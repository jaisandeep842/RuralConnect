import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict, Any, Optional
from app.database import get_database
from app.models.schemas import (
    AdminStatsResponse, MentorCreate, TrainingCreate, SchemeCreate,
    CourseCreate, LessonCreate, KnowledgeItemCreate
)
from app.routers.deps import get_current_admin_user

router = APIRouter(prefix="/api/admin", tags=["Admin Management"], dependencies=[Depends(get_current_admin_user)])

@router.get("/stats", response_model=AdminStatsResponse)
async def get_admin_stats():
    db = get_database()
    return AdminStatsResponse(
        total_users=await db.users.count_documents({}),
        active_users=await db.users.count_documents({"role": "entrepreneur"}),
        total_mentors=await db.mentors.count_documents({}),
        total_training_sessions=await db.training_sessions.count_documents({}),
        total_registrations=await db.training_registrations.count_documents({}),
        total_courses=await db.learning_courses.count_documents({}),
        total_lessons=await db.lessons.count_documents({}),
        total_schemes=await db.government_schemes.count_documents({}),
        total_certificates=await db.certificates.count_documents({}),
        total_posts=await db.community_posts.count_documents({})
    )

# --- Users ---
@router.get("/users")
async def list_admin_users():
    db = get_database()
    users = await db.users.find({}, {"password_hash": 0}).to_list(100)
    for u in users:
        u["id"] = u.pop("_id")
    return users

@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    db = get_database()
    res = await db.users.delete_one({"_id": user_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"message": "User deleted successfully."}

# --- Mentors ---
@router.post("/mentors")
async def add_mentor(mentor_data: MentorCreate):
    db = get_database()
    m_id = str(uuid.uuid4())
    doc = mentor_data.dict()
    doc["_id"] = m_id
    await db.mentors.insert_one(doc)
    doc["id"] = doc.pop("_id")
    return doc

@router.put("/mentors/{mentor_id}")
async def update_mentor(mentor_id: str, mentor_data: MentorCreate):
    db = get_database()
    doc = mentor_data.dict()
    await db.mentors.update_one({"_id": mentor_id}, {"$set": doc})
    doc["id"] = mentor_id
    return doc

@router.delete("/mentors/{mentor_id}")
async def delete_mentor(mentor_id: str):
    db = get_database()
    await db.mentors.delete_one({"_id": mentor_id})
    return {"message": "Mentor deleted."}

# --- Training Sessions ---
@router.post("/training")
async def add_training(training_data: TrainingCreate):
    db = get_database()
    t_id = str(uuid.uuid4())
    doc = training_data.dict()
    doc["_id"] = t_id
    doc["created_at"] = datetime.utcnow().isoformat()
    await db.training_sessions.insert_one(doc)
    doc["id"] = doc.pop("_id")
    return doc

@router.put("/training/{training_id}")
async def update_training(training_id: str, training_data: TrainingCreate):
    db = get_database()
    doc = training_data.dict()
    await db.training_sessions.update_one({"_id": training_id}, {"$set": doc})
    doc["id"] = training_id
    return doc

@router.delete("/training/{training_id}")
async def delete_training(training_id: str):
    db = get_database()
    await db.training_sessions.delete_one({"_id": training_id})
    return {"message": "Training session deleted."}

# --- Courses ---
@router.post("/courses")
async def add_course(course_data: CourseCreate):
    db = get_database()
    c_id = str(uuid.uuid4())
    doc = course_data.dict()
    doc["_id"] = c_id
    doc["created_at"] = datetime.utcnow().isoformat()
    await db.learning_courses.insert_one(doc)
    doc["id"] = doc.pop("_id")
    return doc

@router.put("/courses/{course_id}")
async def update_course(course_id: str, course_data: CourseCreate):
    db = get_database()
    doc = course_data.dict()
    await db.learning_courses.update_one({"_id": course_id}, {"$set": doc})
    doc["id"] = course_id
    return doc

@router.delete("/courses/{course_id}")
async def delete_course(course_id: str):
    db = get_database()
    await db.learning_courses.delete_one({"_id": course_id})
    await db.lessons.delete_many({"course_id": course_id})
    return {"message": "Course and associated lessons deleted."}

# --- Lessons & YouTube Lectures ---
@router.post("/lessons")
async def add_lesson(lesson_data: LessonCreate):
    db = get_database()
    l_id = str(uuid.uuid4())
    doc = lesson_data.dict()
    doc["_id"] = l_id
    
    # Auto-format YouTube embed URL if youtube link provided
    if "youtu" in doc.get("video_url", ""):
        v_url = doc["video_url"]
        import re
        m = re.search(r'(?:youtu\.be/|v/|u/\w/|embed/|watch\?v=)([^#&?]+)', v_url)
        if m:
            video_id = m.group(1)
            doc["embed_url"] = f"https://www.youtube-nocookie.com/embed/{video_id}"
            doc["video_source_type"] = "youtube"
            doc["provider"] = "YouTube"
            
    await db.lessons.insert_one(doc)
    
    # Update total lessons count on course
    count = await db.lessons.count_documents({"course_id": doc["course_id"]})
    await db.learning_courses.update_one({"_id": doc["course_id"]}, {"$set": {"total_lessons": count}})
    
    doc["id"] = doc.pop("_id")
    return doc

@router.put("/lessons/{lesson_id}")
async def update_lesson(lesson_id: str, lesson_data: LessonCreate):
    db = get_database()
    doc = lesson_data.dict()
    
    if "youtu" in doc.get("video_url", ""):
        import re
        m = re.search(r'(?:youtu\.be/|v/|u/\w/|embed/|watch\?v=)([^#&?]+)', doc["video_url"])
        if m:
            video_id = m.group(1)
            doc["embed_url"] = f"https://www.youtube-nocookie.com/embed/{video_id}"
            
    await db.lessons.update_one({"_id": lesson_id}, {"$set": doc})
    doc["id"] = lesson_id
    return doc

@router.delete("/lessons/{lesson_id}")
async def delete_lesson(lesson_id: str):
    db = get_database()
    lesson = await db.lessons.find_one({"_id": lesson_id})
    if lesson:
        course_id = lesson["course_id"]
        await db.lessons.delete_one({"_id": lesson_id})
        count = await db.lessons.count_documents({"course_id": course_id})
        await db.learning_courses.update_one({"_id": course_id}, {"$set": {"total_lessons": count}})
    return {"message": "Lesson deleted."}

# --- Government Schemes ---
@router.post("/schemes")
async def add_scheme(scheme_data: SchemeCreate):
    db = get_database()
    s_id = str(uuid.uuid4())
    doc = scheme_data.dict()
    doc["_id"] = s_id
    await db.government_schemes.insert_one(doc)
    doc["id"] = doc.pop("_id")
    return doc

@router.put("/schemes/{scheme_id}")
async def update_scheme(scheme_id: str, scheme_data: SchemeCreate):
    db = get_database()
    doc = scheme_data.dict()
    await db.government_schemes.update_one({"_id": scheme_id}, {"$set": doc})
    doc["id"] = scheme_id
    return doc

@router.delete("/schemes/{scheme_id}")
async def delete_scheme(scheme_id: str):
    db = get_database()
    await db.government_schemes.delete_one({"_id": scheme_id})
    return {"message": "Government scheme deleted."}

# --- Knowledge Base ---
@router.get("/knowledge-base")
async def list_admin_knowledge():
    db = get_database()
    kb = await db.knowledge_base.find().to_list(100)
    for k in kb:
        k["id"] = k.pop("_id")
    return kb

@router.post("/knowledge-base")
async def add_knowledge(kb_data: KnowledgeItemCreate):
    db = get_database()
    k_id = str(uuid.uuid4())
    doc = kb_data.dict()
    doc["_id"] = k_id
    await db.knowledge_base.insert_one(doc)
    doc["id"] = doc.pop("_id")
    return doc

@router.delete("/knowledge-base/{item_id}")
async def delete_knowledge(item_id: str):
    db = get_database()
    await db.knowledge_base.delete_one({"_id": item_id})
    return {"message": "Knowledge item deleted."}

# --- Notifications Broadcast ---
@router.post("/notifications/broadcast")
async def broadcast_notification(payload: Dict[str, str]):
    db = get_database()
    users = await db.users.find({}, {"_id": 1}).to_list(1000)
    now_str = datetime.utcnow().isoformat()
    
    docs = [
        {
            "_id": str(uuid.uuid4()),
            "user_id": u["_id"],
            "title": payload.get("title", "Important Announcement"),
            "message": payload.get("message", ""),
            "type": payload.get("type", "announcement"),
            "link": payload.get("link", "/dashboard"),
            "is_read": False,
            "created_at": now_str
        }
        for u in users
    ]
    if docs:
        await db.notifications.insert_many(docs)
    return {"message": f"Broadcast sent to {len(docs)} users."}
