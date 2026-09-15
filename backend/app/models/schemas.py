from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

# --- User & Auth ---
class UserRegister(BaseModel):
    full_name: str
    email: str
    phone: str
    password: str
    preferred_language: str = "en"
    village: str
    district: str
    state: str = "Maharashtra"
    business_type: str = "Agriculture"
    business_description: Optional[str] = ""
    interests: List[str] = []

class UserLogin(BaseModel):
    email_or_phone: str
    password: str

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    preferred_language: Optional[str] = None
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    business_type: Optional[str] = None
    business_description: Optional[str] = None
    interests: Optional[List[str]] = None
    profile_photo: Optional[str] = None

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    phone: str
    role: str = "entrepreneur"
    preferred_language: str
    village: str
    district: str
    state: str
    business_type: str
    business_description: Optional[str] = ""
    interests: List[str] = []
    profile_photo: Optional[str] = ""
    profile_completion: int = 100
    created_at: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Mentors ---
class MentorCreate(BaseModel):
    name: str
    photo: str
    expertise: str
    experience: str
    qualification: str
    languages: List[str]
    location: str
    availability: str
    rating: float = 5.0
    sessions: int = 0
    bio: str
    is_verified: bool = True

class MentorResponse(MentorCreate):
    id: str

class MentorBookingCreate(BaseModel):
    mentor_id: str
    date: str
    time_slot: str
    notes: Optional[str] = ""

class MentorBookingResponse(BaseModel):
    id: str
    user_id: str
    mentor_id: str
    mentor_name: str
    date: str
    time_slot: str
    notes: Optional[str] = ""
    status: str = "confirmed"
    created_at: str

# --- Organizations ---
class OrganizationCreate(BaseModel):
    name: str
    type: str
    description: str
    logo: Optional[str] = ""
    contact_email: Optional[str] = ""
    phone: Optional[str] = ""
    location: Optional[str] = ""
    website: Optional[str] = ""

class OrganizationResponse(OrganizationCreate):
    id: str

# --- Training Sessions ---
class TrainingCreate(BaseModel):
    title: str
    description: str
    category: str
    trainer: str
    organization: str
    date: str
    start_time: str
    end_time: str
    mode: str = "online"  # "online" or "offline"
    venue: str
    meeting_link: Optional[str] = ""
    language: str = "Hindi"
    seats: int = 50
    deadline: str
    status: str = "upcoming"

class TrainingResponse(TrainingCreate):
    id: str
    available_seats: int = 50
    is_registered: bool = False

# --- Government Schemes ---
class SchemeCreate(BaseModel):
    scheme_name: str
    description: str
    category: str
    eligibility: str
    benefits: str
    required_documents: List[str]
    application_process: str
    official_website: str
    deadline: Optional[str] = "Ongoing"
    state: str = "Central / All States"
    target_users: str = "Rural Entrepreneurs, Women"
    language: str = "Hindi & English"
    is_verified: bool = True
    updated_at: str = "2026-03-01"

class SchemeResponse(SchemeCreate):
    id: str

# --- Learning Academy: Courses & Lessons ---
class CourseCreate(BaseModel):
    title: str
    description: str
    category: str
    thumbnail: str
    level: str = "Beginner"
    language: str = "Hindi / Marathi / English"
    total_duration_minutes: int = 120
    total_lessons: int = 3
    tags: List[str] = []

class CourseResponse(CourseCreate):
    id: str
    progress_percentage: float = 0.0
    completed_lessons: int = 0

class LessonCreate(BaseModel):
    course_id: str
    lesson_number: int
    lesson_title: str
    description: str
    video_source_type: str = "youtube"  # "youtube", "text", "vimeo"
    video_url: str
    embed_url: str
    provider: str = "YouTube"
    language: str = "Hindi"
    duration_minutes: int = 20
    learning_objectives: List[str] = []
    is_embeddable: bool = True
    is_verified: bool = True
    last_verified: str = "2026-03-01"
    order: int = 1
    text_content: Optional[str] = ""

class LessonResponse(LessonCreate):
    id: str
    is_completed: bool = False

class ProgressUpdate(BaseModel):
    completed: bool = True
    watched_duration: int = 0
    total_duration: int = 0

# --- Knowledge Base & RAG ---
class KnowledgeItemCreate(BaseModel):
    topic: str
    category: str
    question: str
    answer: str
    language: str = "en"
    tags: List[str] = []
    source: str = "Verified Government/Academic Source"
    is_verified: bool = True

class KnowledgeItemResponse(KnowledgeItemCreate):
    id: str

class ChatQuery(BaseModel):
    message: str
    language: Optional[str] = "en"  # "en", "hi", "mr"
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    language: str
    sources: List[str] = []
    suggested_questions: List[str] = []

# --- Community ---
class PostCreate(BaseModel):
    content: str
    category: str = "Discussion"
    image_url: Optional[str] = None

class CommentCreate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: str
    post_id: str
    user_id: str
    user_name: str
    content: str
    created_at: str

class PostResponse(BaseModel):
    id: str
    user_id: str
    user_name: str
    user_business: str
    avatar: str
    content: str
    image_url: Optional[str] = None
    category: str
    likes_count: int = 0
    comments_count: int = 0
    is_liked: bool = False
    comments: List[CommentResponse] = []
    created_at: str

# --- Certificates ---
class CertificateResponse(BaseModel):
    id: str
    user_id: str
    user_name: str
    course_or_training_title: str
    certificate_number: str
    issue_date: str
    cert_type: str
    verification_url: str

# --- Notifications ---
class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: str
    link: Optional[str] = None
    is_read: bool = False
    created_at: str

# --- Admin Statistics ---
class AdminStatsResponse(BaseModel):
    total_users: int
    active_users: int
    total_mentors: int
    total_training_sessions: int
    total_registrations: int
    total_courses: int
    total_lessons: int
    total_schemes: int
    total_certificates: int
    total_posts: int
