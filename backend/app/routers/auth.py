import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from app.database import get_database
from app.models.schemas import UserRegister, UserLogin, TokenResponse, UserResponse
from app.services.auth_service import verify_password, get_password_hash, create_access_token
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

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    db = get_database()
    
    # Check if email exists
    existing = await db.users.find_one({"email": user_data.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )
    
    # Check if phone exists
    existing_phone = await db.users.find_one({"phone": user_data.phone})
    if existing_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this phone number already exists."
        )
    
    user_id = str(uuid.uuid4())
    now_str = datetime.utcnow().isoformat()
    
    user_doc = {
        "_id": user_id,
        "full_name": user_data.full_name.strip(),
        "email": user_data.email.lower().strip(),
        "phone": user_data.phone.strip(),
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
    query_val = credentials.email_or_phone.strip()
    
    user = await db.users.find_one({
        "$or": [
            {"email": query_val.lower()},
            {"phone": query_val}
        ]
    })
    
    if not user or not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email/phone or password. Please try again."
        )
    
    token = create_access_token({"sub": user["_id"], "role": user.get("role", "entrepreneur"), "email": user.get("email")})
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=map_user_response(user)
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return map_user_response(current_user)
