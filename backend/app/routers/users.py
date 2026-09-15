from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from app.database import get_database
from app.models.schemas import UserProfileUpdate, PasswordChange, UserResponse
from app.routers.auth import map_user_response
from app.services.auth_service import verify_password, get_password_hash
from app.routers.deps import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.put("/profile", response_model=UserResponse)
async def update_profile(data: UserProfileUpdate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    update_data = {k: v for k, v in data.dict(exclude_unset=True).items() if v is not None}
    update_data["updated_at"] = datetime.utcnow().isoformat()
    
    await db.users.update_one({"_id": current_user["_id"]}, {"$set": update_data})
    updated_user = await db.users.find_one({"_id": current_user["_id"]})
    return map_user_response(updated_user)

@router.post("/change-password")
async def change_password(data: PasswordChange, current_user: dict = Depends(get_current_user)):
    db = get_database()
    if not verify_password(data.old_password, current_user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect."
        )
    
    new_hash = get_password_hash(data.new_password)
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"password_hash": new_hash, "updated_at": datetime.utcnow().isoformat()}}
    )
    return {"message": "Password updated successfully."}

@router.get("/dashboard")
async def get_dashboard_data(current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = current_user["_id"]
    
    # 1. Continue Learning (last accessed or active course progress)
    last_progress = await db.learning_progress.find({"user_id": user_id}).sort("last_accessed", -1).to_list(1)
    continue_learning = None
    if last_progress:
        p = last_progress[0]
        course = await db.learning_courses.find_one({"_id": p.get("course_id")})
        lesson = await db.lessons.find_one({"_id": p.get("lesson_id")})
        if course and lesson:
            continue_learning = {
                "course_id": course["_id"],
                "course_title": course.get("title", ""),
                "lesson_id": lesson["_id"],
                "lesson_title": lesson.get("lesson_title", ""),
                "lesson_number": lesson.get("lesson_number", 1),
                "progress_percentage": p.get("progress_percentage", 0),
                "thumbnail": course.get("thumbnail", "")
            }
            
    # If no progress yet, get the first course
    if not continue_learning:
        first_course = await db.learning_courses.find_one()
        if first_course:
            first_lesson = await db.lessons.find_one({"course_id": first_course["_id"], "lesson_number": 1})
            if first_lesson:
                continue_learning = {
                    "course_id": first_course["_id"],
                    "course_title": first_course.get("title", ""),
                    "lesson_id": first_lesson["_id"],
                    "lesson_title": first_lesson.get("lesson_title", ""),
                    "lesson_number": 1,
                    "progress_percentage": 0,
                    "thumbnail": first_course.get("thumbnail", "")
                }
    
    # 2. Recommended Courses
    courses_cursor = db.learning_courses.find().limit(3)
    courses = await courses_cursor.to_list(3)
    for c in courses:
        c["id"] = c.pop("_id")
        
    # 3. Upcoming Training Sessions
    training_cursor = db.training_sessions.find({"status": "upcoming"}).limit(2)
    trainings = await training_cursor.to_list(2)
    for t in trainings:
        t["id"] = t.pop("_id")
        # Check registration
        reg = await db.training_registrations.find_one({"user_id": user_id, "training_id": t["id"]})
        t["is_registered"] = bool(reg)
        
    # 4. Recommended Indian Mentors
    mentors_cursor = db.mentors.find().limit(3)
    mentors = await mentors_cursor.to_list(3)
    for m in mentors:
        m["id"] = m.pop("_id")
        
    # 5. Verified Government Schemes
    schemes_cursor = db.government_schemes.find({"is_verified": True}).limit(3)
    schemes = await schemes_cursor.to_list(3)
    for s in schemes:
        s["id"] = s.pop("_id")
        
    # 6. User Stats
    completed_lessons_count = await db.learning_progress.count_documents({"user_id": user_id, "completed": True})
    active_courses_count = await db.learning_courses.count_documents({})
    certificates_count = await db.certificates.count_documents({"user_id": user_id})
    unread_notifications_count = await db.notifications.count_documents({"user_id": user_id, "is_read": False})
    
    return {
        "user": map_user_response(current_user),
        "continue_learning": continue_learning,
        "recommended_courses": courses,
        "upcoming_training": trainings,
        "recommended_mentors": mentors,
        "verified_schemes": schemes,
        "stats": {
            "completed_lessons": completed_lessons_count,
            "active_courses": active_courses_count,
            "certificates_earned": certificates_count,
            "unread_notifications": unread_notifications_count
        }
    }
