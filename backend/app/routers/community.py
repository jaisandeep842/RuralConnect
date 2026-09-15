import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from app.database import get_database
from app.models.schemas import PostResponse, PostCreate, CommentResponse, CommentCreate
from app.routers.deps import get_current_user, get_current_user_optional

router = APIRouter(prefix="/api/community", tags=["Community"])

@router.get("/posts", response_model=List[PostResponse])
async def list_posts(current_user: Optional[dict] = Depends(get_current_user_optional)):
    db = get_database()
    user_id = current_user["_id"] if current_user else None
    
    posts = await db.community_posts.find().sort("created_at", -1).to_list(100)
    results = []
    
    for p in posts:
        post_id = p["_id"]
        comments = await db.comments.find({"post_id": post_id}).sort("created_at", 1).to_list(50)
        comment_objs = [
            CommentResponse(
                id=c["_id"],
                post_id=c["post_id"],
                user_id=c["user_id"],
                user_name=c["user_name"],
                content=c["content"],
                created_at=c["created_at"]
            )
            for c in comments
        ]
        
        liked_users = p.get("liked_by", [])
        is_liked = bool(user_id and user_id in liked_users)
        
        results.append(PostResponse(
            id=post_id,
            user_id=p["user_id"],
            user_name=p.get("user_name", "Rural Entrepreneur"),
            user_business=p.get("user_business", "Handicrafts"),
            avatar=p.get("avatar", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"),
            content=p.get("content", ""),
            image_url=p.get("image_url"),
            category=p.get("category", "Discussion"),
            likes_count=len(liked_users),
            comments_count=len(comment_objs),
            is_liked=is_liked,
            comments=comment_objs,
            created_at=p.get("created_at", "")
        ))
    return results

@router.post("/posts", response_model=PostResponse)
async def create_post(post_data: PostCreate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    now_str = datetime.utcnow().isoformat()
    post_id = str(uuid.uuid4())
    
    post_doc = {
        "_id": post_id,
        "user_id": current_user["_id"],
        "user_name": current_user.get("full_name", "Rural Entrepreneur"),
        "user_business": f"{current_user.get('business_type', 'Small Business')} • {current_user.get('village', 'Maharashtra')}",
        "avatar": current_user.get("profile_photo") or "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        "content": post_data.content,
        "image_url": post_data.image_url,
        "category": post_data.category,
        "liked_by": [],
        "created_at": now_str
    }
    
    await db.community_posts.insert_one(post_doc)
    
    return PostResponse(
        id=post_id,
        user_id=post_doc["user_id"],
        user_name=post_doc["user_name"],
        user_business=post_doc["user_business"],
        avatar=post_doc["avatar"],
        content=post_doc["content"],
        image_url=post_doc["image_url"],
        category=post_doc["category"],
        likes_count=0,
        comments_count=0,
        is_liked=False,
        comments=[],
        created_at=now_str
    )

@router.post("/posts/{post_id}/like")
async def like_post(post_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    user_id = current_user["_id"]
    
    post = await db.community_posts.find_one({"_id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
        
    liked_by = post.get("liked_by", [])
    if user_id in liked_by:
        liked_by.remove(user_id)
        is_liked = False
    else:
        liked_by.append(user_id)
        is_liked = True
        
    await db.community_posts.update_one({"_id": post_id}, {"$set": {"liked_by": liked_by}})
    return {"is_liked": is_liked, "likes_count": len(liked_by)}

@router.post("/posts/{post_id}/comments", response_model=CommentResponse)
async def add_comment(post_id: str, comment_data: CommentCreate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    now_str = datetime.utcnow().isoformat()
    comment_id = str(uuid.uuid4())
    
    comment_doc = {
        "_id": comment_id,
        "post_id": post_id,
        "user_id": current_user["_id"],
        "user_name": current_user.get("full_name", "Rural Entrepreneur"),
        "content": comment_data.content,
        "created_at": now_str
    }
    
    await db.comments.insert_one(comment_doc)
    return CommentResponse(
        id=comment_id,
        post_id=post_id,
        user_id=comment_doc["user_id"],
        user_name=comment_doc["user_name"],
        content=comment_doc["content"],
        created_at=now_str
    )
