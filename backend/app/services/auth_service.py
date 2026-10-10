import bcrypt
import hashlib
import hmac
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from app.config import settings

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if hashed_password.startswith("$2b$") or hashed_password.startswith("$2a$"):
            return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
        # Fallback salt check
        salt = settings.JWT_SECRET.encode("utf-8")
        expected = hashlib.sha256(plain_password.encode("utf-8") + salt).hexdigest()
        return hmac.compare_digest(expected, hashed_password) or plain_password == hashed_password
    except Exception:
        salt = settings.JWT_SECRET.encode("utf-8")
        expected = hashlib.sha256(plain_password.encode("utf-8") + salt).hexdigest()
        return hmac.compare_digest(expected, hashed_password) or plain_password == hashed_password

def get_password_hash(password: str) -> str:
    try:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")
    except Exception:
        salt = settings.JWT_SECRET.encode("utf-8")
        return hashlib.sha256(password.encode("utf-8") + salt).hexdigest()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None

def normalize_email(email: str) -> str:
    return email.strip().lower()

def normalize_phone(phone: str) -> str:
    digits = "".join(filter(str.isdigit, phone.strip()))
    if len(digits) > 10 and digits.startswith("91"):
        digits = digits[2:]
    return digits[-10:] if len(digits) >= 10 else digits

def generate_otp(length: int = 6) -> str:
    import secrets
    return "".join(secrets.choice("0123456789") for _ in range(length))

def hash_otp(otp: str) -> str:
    salt = (settings.JWT_SECRET + "_otp").encode("utf-8")
    return hashlib.sha256(otp.encode("utf-8") + salt).hexdigest()

def verify_otp_hash(otp: str, hashed_otp: str) -> bool:
    expected = hash_otp(otp)
    return hmac.compare_digest(expected, hashed_otp)

def create_verification_token(target: str, purpose: str, expires_minutes: int = 15) -> str:
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    payload = {
        "target": target,
        "purpose": purpose,
        "type": "verification_token",
        "exp": expire
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def decode_verification_token(token: str, expected_purpose: Optional[str] = None) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        if payload.get("type") != "verification_token":
            return None
        if expected_purpose and payload.get("purpose") != expected_purpose:
            return None
        return payload
    except JWTError:
        return None

