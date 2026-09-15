import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from app.database import get_database
from app.models.schemas import TrainingResponse
from app.routers.deps import get_current_user, get_current_user_optional

router = APIRouter(prefix="/api/training", tags=["Training & Workshops"])

@router.get("", response_model=List[TrainingResponse])
async def list_training_sessions(
    category: Optional[str] = None,
    mode: Optional[str] = None,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    db = get_database()
    query = {}
    if category and category != "All":
        query["category"] = category
    if mode and mode != "All":
        query["mode"] = mode.lower()
        
    trainings = await db.training_sessions.find(query).sort("date", 1).to_list(100)
    user_id = current_user["_id"] if current_user else None
    
    results = []
    for t in trainings:
        t_id = t["_id"]
        reg_count = await db.training_registrations.count_documents({"training_id": t_id, "status": "registered"})
        is_reg = False
        if user_id:
            reg_doc = await db.training_registrations.find_one({"user_id": user_id, "training_id": t_id, "status": "registered"})
            is_reg = bool(reg_doc)
            
        total_seats = t.get("seats", 50)
        avail = max(0, total_seats - reg_count)
        
        results.append(TrainingResponse(
            id=t_id,
            title=t.get("title", ""),
            description=t.get("description", ""),
            category=t.get("category", "General"),
            trainer=t.get("trainer", ""),
            organization=t.get("organization", ""),
            date=t.get("date", ""),
            start_time=t.get("start_time", ""),
            end_time=t.get("end_time", ""),
            mode=t.get("mode", "online"),
            venue=t.get("venue", ""),
            meeting_link=t.get("meeting_link", ""),
            language=t.get("language", "Hindi"),
            seats=total_seats,
            deadline=t.get("deadline", ""),
            status=t.get("status", "upcoming"),
            available_seats=avail,
            is_registered=is_reg
        ))
    return results

@router.post("/{training_id}/register")
async def register_training(training_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = current_user["_id"]
    
    training = await db.training_sessions.find_one({"_id": training_id})
    if not training:
        raise HTTPException(status_code=404, detail="Training session not found.")
        
    existing_reg = await db.training_registrations.find_one({"user_id": user_id, "training_id": training_id})
    now_str = datetime.utcnow().isoformat()
    
    if existing_reg:
        if existing_reg.get("status") == "registered":
            return {"message": "Already registered for this workshop.", "is_registered": True}
        else:
            await db.training_registrations.update_one(
                {"_id": existing_reg["_id"]},
                {"$set": {"status": "registered", "registered_at": now_str}}
            )
    else:
        reg_doc = {
            "_id": str(uuid.uuid4()),
            "user_id": user_id,
            "training_id": training_id,
            "training_title": training.get("title", ""),
            "registered_at": now_str,
            "status": "registered",
            "attended": False
        }
        await db.training_registrations.insert_one(reg_doc)
        
    # Send confirmation notification
    await db.notifications.insert_one({
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "title": f"🎟️ Registered for {training.get('title')}",
        "message": f"Your seat is reserved for {training.get('date')} at {training.get('start_time')}. Mode: {training.get('mode').title()}.",
        "type": "training_registration",
        "link": "/training",
        "is_read": False,
        "created_at": now_str
    })
    
    return {"message": "Successfully registered for workshop!", "is_registered": True}

@router.post("/{training_id}/cancel")
async def cancel_training_registration(training_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = current_user["_id"]
    
    await db.training_registrations.update_one(
        {"user_id": user_id, "training_id": training_id},
        {"$set": {"status": "cancelled"}}
    )
    return {"message": "Registration cancelled successfully.", "is_registered": False}
