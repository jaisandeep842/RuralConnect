from fastapi import APIRouter, Depends
from app.database import get_database
from app.routers.deps import get_current_user

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.get("")
async def get_recommendations(current_user: dict = Depends(get_current_user)):
    db = get_database()
    b_type = (current_user.get("business_type") or "Agriculture").lower()
    interests = [i.lower() for i in current_user.get("interests", [])]
    
    # 1. Matching courses
    course_query = {}
    if "food" in b_type:
        course_query = {"$or": [{"category": "Entrepreneurship"}, {"tags": {"$in": ["food", "marketing"]}}]}
    elif "handicraft" in b_type or "tailor" in b_type:
        course_query = {"$or": [{"category": "Digital Marketing"}, {"tags": {"$in": ["handicrafts", "marketing", "branding"]}}]}
    else:
        course_query = {}
        
    recommended_courses = await db.learning_courses.find(course_query).limit(3).to_list(3)
    for c in recommended_courses:
        c["id"] = c.pop("_id")
        
    # 2. Matching mentors
    mentor_query = {}
    if "food" in b_type or "dairy" in b_type:
        mentor_query = {"expertise": {"$regex": "food|agri|dairy", "$options": "i"}}
    elif "handicraft" in b_type or "tailor" in b_type:
        mentor_query = {"expertise": {"$regex": "marketing|art|retail|brand", "$options": "i"}}
    else:
        mentor_query = {}
        
    mentors = await db.mentors.find(mentor_query).limit(3).to_list(3)
    if not mentors:
        mentors = await db.mentors.find().limit(3).to_list(3)
    for m in mentors:
        m["id"] = m.pop("_id")
        
    # 3. Matching training sessions
    trainings = await db.training_sessions.find({"status": "upcoming"}).limit(2).to_list(2)
    for t in trainings:
        t["id"] = t.pop("_id")
        
    # 4. Matching government schemes
    scheme_query = {"is_verified": True}
    if "food" in b_type:
        scheme_query["$or"] = [{"scheme_name": {"$regex": "PMFME|Food|Mudra", "$options": "i"}}, {"category": "Food Processing"}]
    elif "handicraft" in b_type:
        scheme_query["$or"] = [{"scheme_name": {"$regex": "Stand-Up|PMEGP|Mudra", "$options": "i"}}, {"category": "Micro Enterprise"}]
        
    schemes = await db.government_schemes.find(scheme_query).limit(3).to_list(3)
    if not schemes:
        schemes = await db.government_schemes.find({"is_verified": True}).limit(3).to_list(3)
    for s in schemes:
        s["id"] = s.pop("_id")
        
    return {
        "business_type": current_user.get("business_type"),
        "reason": f"Tailored for your {current_user.get('business_type')} venture in {current_user.get('village', 'your village')}",
        "courses": recommended_courses,
        "mentors": mentors,
        "trainings": trainings,
        "schemes": schemes
    }
