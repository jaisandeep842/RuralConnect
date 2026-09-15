import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from app.database import get_database
from app.models.schemas import MentorResponse, MentorBookingCreate, MentorBookingResponse
from app.routers.deps import get_current_user

router = APIRouter(prefix="/api/mentors", tags=["Mentors"])

@router.get("", response_model=List[MentorResponse])
async def list_mentors(
    expertise: Optional[str] = None,
    language: Optional[str] = None,
    location: Optional[str] = None
):
    db = get_database()
    query = {}
    if expertise and expertise != "All":
        query["expertise"] = {"$regex": expertise, "$options": "i"}
    if language and language != "All":
        query["languages"] = {"$in": [language]}
    if location and location != "All":
        query["location"] = {"$regex": location, "$options": "i"}
        
    mentors = await db.mentors.find(query).to_list(100)
    results = []
    for m in mentors:
        m["id"] = m.pop("_id")
        results.append(MentorResponse(**m))
    return results

@router.get("/{mentor_id}", response_model=MentorResponse)
async def get_mentor(mentor_id: str):
    db = get_database()
    m = await db.mentors.find_one({"_id": mentor_id})
    if not m:
        raise HTTPException(status_code=404, detail="Mentor not found.")
    m["id"] = m.pop("_id")
    return MentorResponse(**m)

@router.post("/book", response_model=MentorBookingResponse)
async def book_mentor(booking_data: MentorBookingCreate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = current_user["_id"]
    
    mentor = await db.mentors.find_one({"_id": booking_data.mentor_id})
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found.")
        
    booking_id = str(uuid.uuid4())
    now_str = datetime.utcnow().isoformat()
    
    appointment_doc = {
        "_id": booking_id,
        "user_id": user_id,
        "mentor_id": mentor["_id"],
        "mentor_name": mentor["name"],
        "date": booking_data.date,
        "time_slot": booking_data.time_slot,
        "notes": booking_data.notes or "",
        "status": "confirmed",
        "created_at": now_str
    }
    
    await db.mentor_appointments.insert_one(appointment_doc)
    
    # Increment mentor sessions count
    await db.mentors.update_one({"_id": mentor["_id"]}, {"$inc": {"sessions": 1}})
    
    # Create notification for user
    await db.notifications.insert_one({
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "title": f"🗓️ Mentorship Confirmed with {mentor['name']}",
        "message": f"Your consultation is booked for {booking_data.date} at {booking_data.time_slot}. The mentor will connect with you via voice/video link.",
        "type": "mentor_appointment",
        "link": "/mentors",
        "is_read": False,
        "created_at": now_str
    })
    
    return MentorBookingResponse(
        id=booking_id,
        user_id=user_id,
        mentor_id=mentor["_id"],
        mentor_name=mentor["name"],
        date=booking_data.date,
        time_slot=booking_data.time_slot,
        notes=booking_data.notes or "",
        status="confirmed",
        created_at=now_str
    )

@router.get("/my-appointments", response_model=List[MentorBookingResponse])
async def get_my_appointments(current_user: dict = Depends(get_current_user)):
    db = get_database()
    appointments = await db.mentor_appointments.find({"user_id": current_user["_id"]}).sort("date", -1).to_list(100)
    results = []
    for a in appointments:
        results.append(MentorBookingResponse(
            id=a["_id"],
            user_id=a["user_id"],
            mentor_id=a["mentor_id"],
            mentor_name=a["mentor_name"],
            date=a["date"],
            time_slot=a["time_slot"],
            notes=a.get("notes", ""),
            status=a.get("status", "confirmed"),
            created_at=a["created_at"]
        ))
    return results
