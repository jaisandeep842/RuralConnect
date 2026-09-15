import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from app.database import get_database
from app.models.schemas import CourseResponse, LessonResponse, ProgressUpdate
from app.routers.deps import get_current_user, get_current_user_optional

router = APIRouter(prefix="/api/courses", tags=["Courses & Learning Academy"])

@router.get("", response_model=List[CourseResponse])
async def list_courses(current_user: Optional[dict] = Depends(get_current_user_optional)):
    db = get_database()
    courses = await db.learning_courses.find().to_list(100)
    
    results = []
    user_id = current_user["_id"] if current_user else None
    
    for c in courses:
        course_id = c["_id"]
        total_lessons = await db.lessons.count_documents({"course_id": course_id})
        completed_lessons = 0
        if user_id:
            completed_lessons = await db.learning_progress.count_documents({
                "user_id": user_id,
                "course_id": course_id,
                "completed": True
            })
            
        progress_pct = round((completed_lessons / total_lessons * 100), 1) if total_lessons > 0 else 0.0
        
        results.append(CourseResponse(
            id=course_id,
            title=c.get("title", ""),
            description=c.get("description", ""),
            category=c.get("category", "Entrepreneurship"),
            thumbnail=c.get("thumbnail", ""),
            level=c.get("level", "Beginner"),
            language=c.get("language", "Hindi / Marathi / English"),
            total_duration_minutes=c.get("total_duration_minutes", 60),
            total_lessons=total_lessons,
            tags=c.get("tags", []),
            progress_percentage=progress_pct,
            completed_lessons=completed_lessons
        ))
    return results

@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(course_id: str, current_user: Optional[dict] = Depends(get_current_user_optional)):
    db = get_database()
    c = await db.learning_courses.find_one({"_id": course_id})
    if not c:
        raise HTTPException(status_code=404, detail="Course not found.")
        
    total_lessons = await db.lessons.count_documents({"course_id": course_id})
    completed_lessons = 0
    user_id = current_user["_id"] if current_user else None
    if user_id:
        completed_lessons = await db.learning_progress.count_documents({
            "user_id": user_id,
            "course_id": course_id,
            "completed": True
        })
    progress_pct = round((completed_lessons / total_lessons * 100), 1) if total_lessons > 0 else 0.0
    
    return CourseResponse(
        id=c["_id"],
        title=c.get("title", ""),
        description=c.get("description", ""),
        category=c.get("category", "Entrepreneurship"),
        thumbnail=c.get("thumbnail", ""),
        level=c.get("level", "Beginner"),
        language=c.get("language", "Hindi / Marathi / English"),
        total_duration_minutes=c.get("total_duration_minutes", 60),
        total_lessons=total_lessons,
        tags=c.get("tags", []),
        progress_percentage=progress_pct,
        completed_lessons=completed_lessons
    )

@router.get("/{course_id}/lessons", response_model=List[LessonResponse])
async def get_course_lessons(course_id: str, current_user: Optional[dict] = Depends(get_current_user_optional)):
    db = get_database()
    lessons = await db.lessons.find({"course_id": course_id}).sort("order", 1).to_list(100)
    
    user_id = current_user["_id"] if current_user else None
    completed_lesson_ids = set()
    if user_id:
        progress_docs = await db.learning_progress.find({
            "user_id": user_id,
            "course_id": course_id,
            "completed": True
        }).to_list(100)
        completed_lesson_ids = {p["lesson_id"] for p in progress_docs}
        
    results = []
    for l in lessons:
        results.append(LessonResponse(
            id=l["_id"],
            course_id=l["course_id"],
            lesson_number=l.get("lesson_number", 1),
            lesson_title=l.get("lesson_title", ""),
            description=l.get("description", ""),
            video_source_type=l.get("video_source_type", "youtube"),
            video_url=l.get("video_url", ""),
            embed_url=l.get("embed_url", ""),
            provider=l.get("provider", "YouTube"),
            language=l.get("language", "Hindi"),
            duration_minutes=l.get("duration_minutes", 20),
            learning_objectives=l.get("learning_objectives", []),
            is_embeddable=l.get("is_embeddable", True),
            is_verified=l.get("is_verified", True),
            last_verified=l.get("last_verified", "2026-03-01"),
            order=l.get("order", 1),
            text_content=l.get("text_content", ""),
            is_completed=(l["_id"] in completed_lesson_ids)
        ))
    return results

@router.post("/lessons/{lesson_id}/progress")
async def update_lesson_progress(lesson_id: str, progress_data: ProgressUpdate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = current_user["_id"]
    
    lesson = await db.lessons.find_one({"_id": lesson_id})
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found.")
        
    course_id = lesson["course_id"]
    now_str = datetime.utcnow().isoformat()
    
    # Update progress record
    progress_doc = {
        "user_id": user_id,
        "course_id": course_id,
        "lesson_id": lesson_id,
        "completed": progress_data.completed,
        "watched_duration": progress_data.watched_duration,
        "total_duration": progress_data.total_duration,
        "progress_percentage": 100.0 if progress_data.completed else 50.0,
        "last_accessed": now_str,
        "completed_at": now_str if progress_data.completed else None
    }
    
    await db.learning_progress.update_one(
        {"user_id": user_id, "course_id": course_id, "lesson_id": lesson_id},
        {"$set": progress_doc},
        upsert=True
    )
    
    # Check if all course lessons are now completed
    all_lessons = await db.lessons.find({"course_id": course_id}).to_list(100)
    completed_count = await db.learning_progress.count_documents({
        "user_id": user_id,
        "course_id": course_id,
        "completed": True
    })
    
    course_completed = (len(all_lessons) > 0 and completed_count >= len(all_lessons))
    certificate_issued = False
    
    if course_completed:
        # Check if certificate already issued
        existing_cert = await db.certificates.find_one({"user_id": user_id, "course_or_training_title": lesson.get("course_title", course_id)})
        course = await db.learning_courses.find_one({"_id": course_id})
        course_title = course.get("title", "Entrepreneurship Course") if course else "Entrepreneurship Course"
        
        if not existing_cert:
            cert_id = f"RC-CERT-{uuid.uuid4().hex[:8].upper()}"
            cert_doc = {
                "_id": str(uuid.uuid4()),
                "user_id": user_id,
                "user_name": current_user.get("full_name", "Entrepreneur"),
                "course_or_training_title": course_title,
                "certificate_number": cert_id,
                "issue_date": datetime.utcnow().strftime("%B %d, %Y"),
                "cert_type": "Course Completion",
                "verification_url": f"http://localhost:5173/certificates/{cert_id}"
            }
            await db.certificates.insert_one(cert_doc)
            certificate_issued = True
            
            # Send congratulatory notification
            await db.notifications.insert_one({
                "_id": str(uuid.uuid4()),
                "user_id": user_id,
                "title": f"🎉 Congratulations! You completed {course_title}",
                "message": f"You have earned an official Certificate of Completion ({cert_id}). View or download it anytime.",
                "type": "certificate",
                "link": "/certificates",
                "is_read": False,
                "created_at": now_str
            })
            
    return {
        "status": "success",
        "completed": progress_data.completed,
        "course_completed": course_completed,
        "certificate_issued": certificate_issued
    }
