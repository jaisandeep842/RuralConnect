import re
import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status, Depends
from app.config import settings
from app.database import get_database
from app.models.schemas import (
    UserRegister, UserLogin, TokenResponse, UserResponse,
    OTPRequest, OTPVerify, PasswordResetRequest, AdminBootstrapRequest
)
from app.services.auth_service import (
    verify_password, get_password_hash, create_access_token,
    normalize_email, normalize_phone, generate_otp, hash_otp, verify_otp_hash,
    create_verification_token, decode_verification_token
)
from app.services.notification_service import send_email_otp, send_sms_otp
from app.routers.deps import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def calculate_completion(user_dict: dict) -> int:
    score = 0
    fields = [
        "full_name", "email", "phone", "village", "district",
        "state", "business_type", "business_description", "preferred_language"
    ]
    for field in fields:
        if user_dict.get(field):
            score += 10
    if user_dict.get("interests") and len(user_dict["interests"]) > 0:
        score += 10
    return min(100, score)

def map_user_response(user_dict: dict) -> UserResponse:
    return UserResponse(
        id=str(user_dict.get("_id")),
        full_name=user_dict.get("full_name", ""),
        email=user_dict.get("email", ""),
        phone=user_dict.get("phone", ""),
        role=user_dict.get("role", "entrepreneur"),
        preferred_language=user_dict.get("preferred_language", "en"),
        village=user_dict.get("village", ""),
        district=user_dict.get("district", ""),
        state=user_dict.get("state", "Maharashtra"),
        business_type=user_dict.get("business_type", "Other"),
        business_description=user_dict.get("business_description", ""),
        interests=user_dict.get("interests", []),
        profile_photo=user_dict.get("profile_photo", ""),
        profile_completion=calculate_completion(user_dict),
        created_at=user_dict.get("created_at", "")
    )

EMAIL_REGEX = re.compile(r"^[\w\.-]+@[\w\.-]+\.\w+$")

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    db = get_database()
    
    clean_email = normalize_email(user_data.email)
    clean_phone = normalize_phone(user_data.phone)

    if not EMAIL_REGEX.match(clean_email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid email address."
        )

    if len(clean_phone) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid 10-digit mobile number."
        )

    if len(user_data.password.strip()) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters long."
        )

    # Optional verification token validation
    if user_data.verification_token:
        decoded = decode_verification_token(user_data.verification_token, expected_purpose="registration")
        if not decoded:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verification code token is invalid or expired. Please verify again."
            )

    # Check if email exists
    existing = await db.users.find_one({"email": clean_email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )
    
    # Check if phone exists (checking both raw and normalized)
    existing_phone = await db.users.find_one({
        "$or": [{"phone": clean_phone}, {"phone": user_data.phone.strip()}]
    })
    if existing_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this phone number already exists."
        )
    
    user_id = str(uuid.uuid4())
    now_str = datetime.utcnow().isoformat()
    
    # Strictly enforce entrepreneur role for public self-registration
    user_doc = {
        "_id": user_id,
        "full_name": user_data.full_name.strip(),
        "email": clean_email,
        "phone": clean_phone,
        "password_hash": get_password_hash(user_data.password),
        "role": "entrepreneur",
        "preferred_language": user_data.preferred_language,
        "village": user_data.village.strip(),
        "district": user_data.district.strip(),
        "state": user_data.state.strip(),
        "business_type": user_data.business_type,
        "business_description": user_data.business_description or "",
        "interests": user_data.interests or [],
        "profile_photo": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        "created_at": now_str,
        "updated_at": now_str
    }
    
    await db.users.insert_one(user_doc)
    
    # Create welcome notification
    welcome_notif = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "title": "Welcome to RuralConnect!",
        "message": f"Namaste {user_data.full_name}! Explore courses, connect with Indian business mentors, and ask our AI assistant anything.",
        "type": "announcement",
        "link": "/learn",
        "is_read": False,
        "created_at": now_str
    }
    await db.notifications.insert_one(welcome_notif)
    
    # Generate token
    token = create_access_token({"sub": user_id, "role": "entrepreneur", "email": user_doc["email"]})
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=map_user_response(user_doc)
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    db = get_database()
    raw_query = credentials.email_or_phone.strip()
    clean_email = normalize_email(raw_query)
    clean_phone = normalize_phone(raw_query)
    
    user = await db.users.find_one({
        "$or": [
            {"email": clean_email},
            {"phone": clean_phone},
            {"phone": raw_query}
        ]
    })
    
    if not user or not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email/phone or password. Please try again."
        )
    
    token = create_access_token({
        "sub": user["_id"],
        "role": user.get("role", "entrepreneur"),
        "email": user.get("email")
    })
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=map_user_response(user)
    )

@router.post("/otp/request")
async def request_otp(payload: OTPRequest):
    """
    Public endpoint to request a 6-digit OTP for Registration, Phone Login, or Password Reset.
    Applies rate-limiting and input format validation.
    """
    db = get_database()
    raw_target = payload.target.strip()
    target_type = payload.type.lower()
    purpose = payload.purpose.lower()

    if purpose not in ["login", "registration", "reset_password"]:
        raise HTTPException(status_code=400, detail="Invalid OTP purpose specified.")

    if target_type == "email":
        target = normalize_email(raw_target)
        if not EMAIL_REGEX.match(target):
            raise HTTPException(status_code=400, detail="Please provide a valid email address.")
    else:
        target = normalize_phone(raw_target)
        if len(target) < 10:
            raise HTTPException(status_code=400, detail="Please provide a valid 10-digit mobile number.")

    # Rate limiting: check recent OTP requests for this target in last 10 minutes
    now = datetime.utcnow()
    ten_min_ago = now - timedelta(minutes=10)
    recent_count = await db.otps.count_documents({
        "target": target,
        "created_at": {"$gte": ten_min_ago.isoformat()}
    })

    if recent_count >= settings.RATE_LIMIT_OTP_PER_10_MIN:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many OTP requests. Please wait a few minutes before trying again."
        )

    # Contextual check:
    # If logging in or resetting password, verify user actually exists
    if purpose in ["login", "reset_password"]:
        user_check = await db.users.find_one({
            "$or": [{"email": target}, {"phone": target}]
        })
        if not user_check:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No RuralConnect account found with this {target_type}."
            )

    # If registering, check if target already taken
    if purpose == "registration":
        user_check = await db.users.find_one({
            "$or": [{"email": target}, {"phone": target}]
        })
        if user_check:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"An account with this {target_type} already exists. Please log in instead."
            )

    # Generate cryptographic OTP
    otp_code = generate_otp(6)
    otp_hashed = hash_otp(otp_code)
    expires_at = now + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

    # Invalidate previous unverified OTPs for this target & purpose
    await db.otps.delete_many({"target": target, "purpose": purpose})

    # Store OTP record
    await db.otps.insert_one({
        "_id": str(uuid.uuid4()),
        "target": target,
        "target_type": target_type,
        "purpose": purpose,
        "otp_hash": otp_hashed,
        "attempts": 0,
        "is_verified": False,
        "created_at": now.isoformat(),
        "expires_at": expires_at.isoformat()
    })

    # Send OTP through configured provider
    if target_type == "email":
        await send_email_otp(target, otp_code, purpose)
    else:
        await send_sms_otp(target, otp_code, purpose)

    # In mock/resilient development mode, we surface dev_otp so offline testing is painless
    dev_otp = otp_code if (
        (target_type == "email" and settings.EMAIL_PROVIDER == "mock") or
        (target_type == "phone" and settings.SMS_PROVIDER == "mock")
    ) else None

    return {
        "success": True,
        "message": f"Verification code sent to your {target_type}.",
        "target": target,
        "target_type": target_type,
        "purpose": purpose,
        "expires_in_minutes": settings.OTP_EXPIRE_MINUTES,
        "dev_otp": dev_otp
    }

@router.post("/otp/verify")
async def verify_otp(payload: OTPVerify):
    """
    Verifies the 6-digit OTP.
    - If purpose is 'login', generates JWT session token and returns TokenResponse.
    - If purpose is 'registration' or 'reset_password', issues signed verification token.
    """
    db = get_database()
    raw_target = payload.target.strip()
    target = normalize_email(raw_target) if "@" in raw_target else normalize_phone(raw_target)
    otp_code = payload.otp.strip()
    purpose = payload.purpose.lower()

    now = datetime.utcnow().isoformat()

    otp_doc = await db.otps.find_one({
        "target": target,
        "purpose": purpose,
        "is_verified": False,
        "expires_at": {"$gte": now}
    })

    if not otp_doc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code is invalid or has expired. Please request a new code."
        )

    # Check maximum attempt limit
    if otp_doc.get("attempts", 0) >= settings.OTP_MAX_ATTEMPTS:
        await db.otps.delete_one({"_id": otp_doc["_id"]})
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Too many incorrect attempts. This code has been invalidated. Please request a new code."
        )

    # Verify code match
    if not verify_otp_hash(otp_code, otp_doc.get("otp_hash", "")):
        await db.otps.update_one({"_id": otp_doc["_id"]}, {"$inc": {"attempts": 1}})
        remaining = settings.OTP_MAX_ATTEMPTS - (otp_doc.get("attempts", 0) + 1)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Incorrect verification code. {max(0, remaining)} attempt(s) remaining."
        )

    # Mark as verified or consume
    await db.otps.delete_one({"_id": otp_doc["_id"]})

    # Flow A: Login via Phone / Email OTP
    if purpose == "login":
        user = await db.users.find_one({
            "$or": [{"phone": target}, {"email": target}]
        })
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User account not found."
            )

        token = create_access_token({
            "sub": user["_id"],
            "role": user.get("role", "entrepreneur"),
            "email": user.get("email")
        })

        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=map_user_response(user)
        )

    # Flow B: Registration or Password Reset Token
    verification_token = create_verification_token(target, purpose, expires_minutes=15)
    return {
        "success": True,
        "verified": True,
        "target": target,
        "purpose": purpose,
        "verification_token": verification_token,
        "message": "Security verification successful."
    }

@router.post("/reset-password")
async def reset_password(payload: PasswordResetRequest):
    """
    Completes password reset using a verified security token.
    """
    db = get_database()
    raw_target = payload.target.strip()
    target = normalize_email(raw_target) if "@" in raw_target else normalize_phone(raw_target)

    if len(payload.new_password.strip()) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long."
        )

    decoded = decode_verification_token(payload.verification_token, expected_purpose="reset_password")
    if not decoded or decoded.get("target") != target:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password reset session is invalid or has expired. Please verify again."
        )

    user = await db.users.find_one({
        "$or": [{"email": target}, {"phone": target}]
    })
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found."
        )

    new_hash = get_password_hash(payload.new_password.strip())
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"password_hash": new_hash, "updated_at": datetime.utcnow().isoformat()}}
    )

    return {
        "success": True,
        "message": "Your password has been reset successfully. Please log in with your new password."
    }

@router.post("/admin/bootstrap")
async def bootstrap_admin(payload: AdminBootstrapRequest):
    """
    Secure server-side administrator account bootstrap/recovery endpoint.
    Protected strictly by ADMIN_BOOTSTRAP_KEY from environment variables.
    """
    if not payload.bootstrap_key or payload.bootstrap_key != settings.ADMIN_BOOTSTRAP_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized admin bootstrap key."
        )

    clean_email = normalize_email(payload.email)
    clean_phone = normalize_phone(payload.phone or "9876543210")
    db = get_database()
    now_str = datetime.utcnow().isoformat()

    existing_admin = await db.users.find_one({"email": clean_email})
    if existing_admin:
        await db.users.update_one(
            {"_id": existing_admin["_id"]},
            {
                "$set": {
                    "role": "admin",
                    "full_name": payload.full_name or existing_admin.get("full_name"),
                    "password_hash": get_password_hash(payload.password),
                    "phone": clean_phone,
                    "updated_at": now_str
                }
            }
        )
        return {
            "success": True,
            "message": f"Administrator account '{clean_email}' successfully updated with admin role.",
            "email": clean_email
        }
    else:
        admin_doc = {
            "_id": str(uuid.uuid4()),
            "full_name": payload.full_name or "Platform Administrator",
            "email": clean_email,
            "phone": clean_phone,
            "password_hash": get_password_hash(payload.password),
            "role": "admin",
            "preferred_language": "en",
            "village": "Haveli",
            "district": "Pune",
            "state": "Maharashtra",
            "business_type": "Administration",
            "business_description": "Rural Development Officer and Platform Administrator.",
            "interests": ["Administration", "Policy", "Mentorship"],
            "profile_photo": "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
            "created_at": now_str,
            "updated_at": now_str
        }
        await db.users.insert_one(admin_doc)
        return {
            "success": True,
            "message": f"Initial administrator account '{clean_email}' created successfully.",
            "email": clean_email
        }

@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully."}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return map_user_response(current_user)
