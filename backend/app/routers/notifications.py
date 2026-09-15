from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.database import get_database
from app.models.schemas import NotificationResponse
from app.routers.deps import get_current_user

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
async def list_notifications(current_user: dict = Depends(get_current_user)):
    db = get_database()
    notifs = await db.notifications.find({"user_id": current_user["_id"]}).sort("created_at", -1).to_list(100)
    results = []
    for n in notifs:
        results.append(NotificationResponse(
            id=n["_id"],
            user_id=n["user_id"],
            title=n.get("title", ""),
            message=n.get("message", ""),
            type=n.get("type", "info"),
            link=n.get("link"),
            is_read=n.get("is_read", False),
            created_at=n.get("created_at", "")
        ))
    return results

@router.put("/{notif_id}/read")
async def mark_notification_read(notif_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    await db.notifications.update_one(
        {"_id": notif_id, "user_id": current_user["_id"]},
        {"$set": {"is_read": True}}
    )
    return {"message": "Notification marked as read."}

@router.put("/read-all")
async def mark_all_notifications_read(current_user: dict = Depends(get_current_user)):
    db = get_database()
    await db.notifications.update_many(
        {"user_id": current_user["_id"]},
        {"$set": {"is_read": True}}
    )
    return {"message": "All notifications marked as read."}
