import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict, Any, Optional
from app.database import get_database
from app.models.schemas import (
    AdminStatsResponse, MentorCreate, TrainingCreate, SchemeCreate,
    CourseCreate, LessonCreate, KnowledgeItemCreate, KnowledgeItemUpdate, KnowledgeItemResponse, UserRoleUpdate
)
from app.services.rag_service import (
    refresh_knowledge_pool_item, remove_knowledge_pool_item, generate_knowledge_embedding
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
        total_posts=await db.community_posts.count_documents({}),
        total_knowledge_items=await db.knowledge_base.count_documents({})
    )

# --- Users ---
@router.get("/users")
async def list_admin_users(search: Optional[str] = None, role: Optional[str] = None):
    db = get_database()
    query: Dict[str, Any] = {}
    if role and role != "All":
        query["role"] = role.lower()
    if search and search.strip():
        s = search.strip()
        query["$or"] = [
            {"full_name": {"$regex": s, "$options": "i"}},
            {"email": {"$regex": s, "$options": "i"}},
            {"phone": {"$regex": s, "$options": "i"}},
            {"district": {"$regex": s, "$options": "i"}},
            {"business_type": {"$regex": s, "$options": "i"}}
        ]
    users = await db.users.find(query, {"password_hash": 0}).to_list(200)
    for u in users:
        u["id"] = u.pop("_id")
    return users

@router.put("/users/{user_id}/role")
async def update_user_role(user_id: str, data: UserRoleUpdate):
    if data.role not in ["admin", "entrepreneur", "mentor"]:
        raise HTTPException(status_code=400, detail="Invalid role specified.")
    db = get_database()
    res = await db.users.update_one({"_id": user_id}, {"$set": {"role": data.role, "updated_at": datetime.utcnow().isoformat()}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"message": f"User role updated to {data.role}.", "role": data.role}

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

# --- Knowledge Base Management ---
def format_kb_item(k: dict) -> dict:
    item_id = str(k.get("_id") or k.get("id"))
    title = k.get("title") or k.get("topic") or "Verified Knowledge"
    question = k.get("question") or k.get("question_en") or ""
    answer = k.get("answer") or k.get("answer_en") or ""
    return {
        "id": item_id,
        "_id": item_id,
        "title": title,
        "topic": k.get("topic") or title,
        "category": k.get("category", "Entrepreneurship"),
        "question": question,
        "question_en": k.get("question_en") or question,
        "question_hi": k.get("question_hi") or "",
        "question_mr": k.get("question_mr") or "",
        "answer": answer,
        "answer_en": k.get("answer_en") or answer,
        "answer_hi": k.get("answer_hi") or "",
        "answer_mr": k.get("answer_mr") or "",
        "language": k.get("language", "en"),
        "tags": k.get("tags", []),
        "source": k.get("source", "RuralConnect Knowledge Base"),
        "source_url": k.get("source_url", ""),
        "is_verified": (k.get("is_verified", True) is True) or (k.get("verified", True) is True),
        "status": k.get("status", "published"),
        "embedding_status": k.get("embedding_status", "indexed"),
        "embedding_error": k.get("embedding_error"),
        "created_by": k.get("created_by", "admin"),
        "created_at": k.get("created_at") or k.get("updated_at") or datetime.utcnow().isoformat(),
        "updated_at": k.get("updated_at") or datetime.utcnow().isoformat(),
        "version": k.get("version", 1)
    }

@router.get("/knowledge-base")
async def list_admin_knowledge(
    search: Optional[str] = None,
    category: Optional[str] = None,
    language: Optional[str] = None,
    status: Optional[str] = None,
    is_verified: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    db = get_database()
    query: Dict[str, Any] = {}

    if category and category != "All":
        query["category"] = category

    if language and language != "All":
        query["language"] = language

    if status and status != "All":
        query["status"] = status.lower()

    if is_verified and is_verified != "All":
        val = is_verified.lower() == "true"
        query["$or"] = [{"is_verified": val}, {"verified": val}]

    if search and search.strip():
        s = search.strip()
        query["$or"] = [
            {"title": {"$regex": s, "$options": "i"}},
            {"topic": {"$regex": s, "$options": "i"}},
            {"question": {"$regex": s, "$options": "i"}},
            {"question_en": {"$regex": s, "$options": "i"}},
            {"question_hi": {"$regex": s, "$options": "i"}},
            {"question_mr": {"$regex": s, "$options": "i"}},
            {"answer": {"$regex": s, "$options": "i"}},
            {"answer_en": {"$regex": s, "$options": "i"}},
            {"tags": {"$regex": s, "$options": "i"}},
            {"source": {"$regex": s, "$options": "i"}}
        ]

    total = await db.knowledge_base.count_documents(query)
    cursor = db.knowledge_base.find(query).sort("updated_at", -1).skip(skip)
    if limit > 0:
        cursor = cursor.limit(limit)

    raw_items = await cursor.to_list(limit if limit > 0 else 500)
    formatted = [format_kb_item(k) for k in raw_items]

    return {
        "items": formatted,
        "total": total,
        "page": (skip // limit) + 1 if limit > 0 else 1,
        "limit": limit
    }

@router.get("/knowledge-base/{item_id}")
async def get_single_knowledge(item_id: str):
    db = get_database()
    doc = await db.knowledge_base.find_one({"_id": item_id})
    if not doc:
        doc = await db.knowledge_base.find_one({"id": item_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Knowledge entry not found.")
    return format_kb_item(doc)

@router.post("/knowledge-base")
async def add_knowledge(kb_data: KnowledgeItemCreate):
    db = get_database()
    k_id = str(uuid.uuid4())
    now_str = datetime.utcnow().isoformat()
    doc = kb_data.dict()
    
    # Auto-fill title/topic and multilingual variants
    title_val = doc.get("title") or doc.get("topic") or doc["question"][:50]
    doc["_id"] = k_id
    doc["id"] = k_id
    doc["title"] = title_val
    doc["topic"] = title_val
    if not doc.get("question_en"):
        doc["question_en"] = doc["question"]
    if not doc.get("answer_en"):
        doc["answer_en"] = doc["answer"]

    doc["created_at"] = now_str
    doc["updated_at"] = now_str
    doc["version"] = 1
    doc["created_by"] = "admin"

    # Handle embedding if published
    if doc.get("status") == "published" and doc.get("is_verified"):
        text_for_embed = f"{title_val}\n{doc['question']}\n{doc['answer']}\n{' '.join(doc.get('tags', []))}"
        vector, emb_status, emb_err = generate_knowledge_embedding(text_for_embed)
        doc["embedding"] = vector
        doc["embedding_status"] = emb_status
        doc["embedding_error"] = emb_err
    else:
        doc["embedding"] = None
        doc["embedding_status"] = "pending"
        doc["embedding_error"] = None

    await db.knowledge_base.insert_one(doc)

    # Immediately synchronize active in-memory retrieval pool
    refresh_knowledge_pool_item(doc)

    return format_kb_item(doc)

@router.put("/knowledge-base/{item_id}")
async def update_knowledge(item_id: str, kb_data: KnowledgeItemUpdate):
    db = get_database()
    existing = await db.knowledge_base.find_one({"$or": [{"_id": item_id}, {"id": item_id}]})
    if not existing:
        raise HTTPException(status_code=404, detail="Knowledge entry not found.")

    actual_id = existing["_id"]
    now_str = datetime.utcnow().isoformat()
    update_data = {k: v for k, v in kb_data.dict(exclude_unset=True).items() if v is not None}

    # If title or topic updated, keep in sync
    if "title" in update_data and "topic" not in update_data:
        update_data["topic"] = update_data["title"]
    elif "topic" in update_data and "title" not in update_data:
        update_data["title"] = update_data["topic"]

    # If question or answer updated, keep English variant in sync if not specified
    if "question" in update_data and "question_en" not in update_data:
        update_data["question_en"] = update_data["question"]
    if "answer" in update_data and "answer_en" not in update_data:
        update_data["answer_en"] = update_data["answer"]

    update_data["updated_at"] = now_str
    update_data["version"] = existing.get("version", 1) + 1

    # Check if embedding needs regeneration
    merged = {**existing, **update_data}
    is_published = merged.get("status") == "published"
    is_verified = merged.get("is_verified", True) is True or merged.get("verified", True) is True

    if is_published and is_verified:
        content_changed = any(f in update_data for f in ["question", "answer", "title", "tags", "question_en", "answer_en"])
        if content_changed or not existing.get("embedding"):
            text_for_embed = f"{merged.get('title', '')}\n{merged.get('question', '')}\n{merged.get('answer', '')}\n{' '.join(merged.get('tags', []))}"
            vector, emb_status, emb_err = generate_knowledge_embedding(text_for_embed)
            update_data["embedding"] = vector
            update_data["embedding_status"] = emb_status
            update_data["embedding_error"] = emb_err
            merged["embedding"] = vector
            merged["embedding_status"] = emb_status
    else:
        merged["embedding_status"] = "pending"

    await db.knowledge_base.update_one({"_id": actual_id}, {"$set": update_data})
    
    # Synchronize live retrieval pool immediately
    if is_published and is_verified:
        refresh_knowledge_pool_item(merged)
    else:
        remove_knowledge_pool_item(actual_id)

    updated_doc = await db.knowledge_base.find_one({"_id": actual_id})
    return format_kb_item(updated_doc)

@router.post("/knowledge-base/{item_id}/verify")
async def verify_knowledge(item_id: str):
    db = get_database()
    existing = await db.knowledge_base.find_one({"$or": [{"_id": item_id}, {"id": item_id}]})
    if not existing:
        raise HTTPException(status_code=404, detail="Knowledge entry not found.")

    actual_id = existing["_id"]
    await db.knowledge_base.update_one(
        {"_id": actual_id},
        {"$set": {"is_verified": True, "verified": True, "updated_at": datetime.utcnow().isoformat()}}
    )

    updated = await db.knowledge_base.find_one({"_id": actual_id})
    refresh_knowledge_pool_item(updated)
    return {"message": "Knowledge entry verified.", "is_verified": True, "item": format_kb_item(updated)}

@router.post("/knowledge-base/{item_id}/publish")
async def publish_knowledge(item_id: str):
    db = get_database()
    existing = await db.knowledge_base.find_one({"$or": [{"_id": item_id}, {"id": item_id}]})
    if not existing:
        raise HTTPException(status_code=404, detail="Knowledge entry not found.")

    actual_id = existing["_id"]
    now_str = datetime.utcnow().isoformat()

    # Generate embedding if needed
    text_for_embed = f"{existing.get('title', '')}\n{existing.get('question', '')}\n{existing.get('answer', '')}\n{' '.join(existing.get('tags', []))}"
    vector, emb_status, emb_err = generate_knowledge_embedding(text_for_embed)

    await db.knowledge_base.update_one(
        {"_id": actual_id},
        {
            "$set": {
                "status": "published",
                "is_verified": True,
                "verified": True,
                "embedding": vector,
                "embedding_status": emb_status,
                "embedding_error": emb_err,
                "updated_at": now_str
            }
        }
    )

    updated = await db.knowledge_base.find_one({"_id": actual_id})
    refresh_knowledge_pool_item(updated)
    return {
        "message": "Knowledge entry published and indexed into live RAG retrieval.",
        "status": "published",
        "embedding_status": emb_status,
        "item": format_kb_item(updated)
    }

@router.post("/knowledge-base/{item_id}/unpublish")
async def unpublish_knowledge(item_id: str):
    db = get_database()
    existing = await db.knowledge_base.find_one({"$or": [{"_id": item_id}, {"id": item_id}]})
    if not existing:
        raise HTTPException(status_code=404, detail="Knowledge entry not found.")

    actual_id = existing["_id"]
    await db.knowledge_base.update_one(
        {"_id": actual_id},
        {"$set": {"status": "draft", "updated_at": datetime.utcnow().isoformat()}}
    )

    # Immediately remove from live chatbot retrieval pool
    remove_knowledge_pool_item(actual_id)
    return {"message": "Knowledge entry unpublished. Excluded from RAG retrieval.", "status": "draft"}

@router.delete("/knowledge-base/{item_id}")
async def delete_knowledge(item_id: str):
    db = get_database()
    existing = await db.knowledge_base.find_one({"$or": [{"_id": item_id}, {"id": item_id}]})
    if not existing:
        raise HTTPException(status_code=404, detail="Knowledge entry not found.")

    actual_id = existing["_id"]
    await db.knowledge_base.delete_one({"_id": actual_id})
    remove_knowledge_pool_item(actual_id)
    return {"message": "Knowledge item permanently deleted and removed from RAG index."}

@router.post("/knowledge-base/{item_id}/retry-index")
async def retry_index_knowledge(item_id: str):
    db = get_database()
    existing = await db.knowledge_base.find_one({"$or": [{"_id": item_id}, {"id": item_id}]})
    if not existing:
        raise HTTPException(status_code=404, detail="Knowledge entry not found.")

    actual_id = existing["_id"]
    text_for_embed = f"{existing.get('title', '')}\n{existing.get('question', '')}\n{existing.get('answer', '')}\n{' '.join(existing.get('tags', []))}"
    vector, emb_status, emb_err = generate_knowledge_embedding(text_for_embed)

    await db.knowledge_base.update_one(
        {"_id": actual_id},
        {
            "$set": {
                "embedding": vector,
                "embedding_status": emb_status,
                "embedding_error": emb_err,
                "updated_at": datetime.utcnow().isoformat()
            }
        }
    )

    updated = await db.knowledge_base.find_one({"_id": actual_id})
    refresh_knowledge_pool_item(updated)
    return {
        "message": "Re-indexing complete.",
        "embedding_status": emb_status,
        "embedding_error": emb_err,
        "item": format_kb_item(updated)
    }


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
