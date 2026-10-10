import os
import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "RuralConnect"
    PROJECT_DESCRIPTION: str = "AI-Powered Rural Entrepreneurship Platform"
    PROJECT_VERSION: str = "1.0.0"
    
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "ruralconnect")
    
    JWT_SECRET: str = os.getenv("JWT_SECRET", "ruralconnect_jwt_secret_key_change_in_production_2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    PORT: int = int(os.getenv("PORT", "8001"))
    HOST: str = os.getenv("HOST", "127.0.0.1")
    
    # Authentication & OTP
    OTP_EXPIRE_MINUTES: int = int(os.getenv("OTP_EXPIRE_MINUTES", "10"))
    OTP_MAX_ATTEMPTS: int = int(os.getenv("OTP_MAX_ATTEMPTS", "5"))
    RATE_LIMIT_OTP_PER_10_MIN: int = int(os.getenv("RATE_LIMIT_OTP_PER_10_MIN", "5"))
    
    # Email Delivery Provider (options: mock, smtp, sendgrid)
    EMAIL_PROVIDER: str = os.getenv("EMAIL_PROVIDER", "mock")
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "noreply@ruralconnect.in")
    SENDGRID_API_KEY: str = os.getenv("SENDGRID_API_KEY", "")
    
    # SMS / OTP Provider (options: mock, twilio, msg91, fast2sms)
    SMS_PROVIDER: str = os.getenv("SMS_PROVIDER", "mock")
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_FROM_NUMBER: str = os.getenv("TWILIO_FROM_NUMBER", "")
    MSG91_AUTH_KEY: str = os.getenv("MSG91_AUTH_KEY", "")
    MSG91_SENDER_ID: str = os.getenv("MSG91_SENDER_ID", "RURLCN")
    FAST2SMS_API_KEY: str = os.getenv("FAST2SMS_API_KEY", "")

    # Admin Account Bootstrap & Security
    ADMIN_INITIAL_EMAIL: str = os.getenv("ADMIN_INITIAL_EMAIL", "admin@ruralconnect.in")
    ADMIN_INITIAL_PASSWORD: str = os.getenv("ADMIN_INITIAL_PASSWORD", "Admin@12345")
    ADMIN_BOOTSTRAP_KEY: str = os.getenv("ADMIN_BOOTSTRAP_KEY", "ruralconnect_admin_bootstrap_secret_key_2026")

    # Atlas Vector Search configuration
    MONGODB_VECTOR_INDEX: str = os.getenv("MONGODB_VECTOR_INDEX", "vector_index")

    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:8001",
        "http://127.0.0.1:8001"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("["):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:8000",
            "http://127.0.0.1:8000",
            "http://localhost:8001",
            "http://127.0.0.1:8001"
        ]
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

