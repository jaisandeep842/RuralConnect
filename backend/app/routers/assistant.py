import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from app.database import get_database
from app.models.schemas import ChatQuery, ChatResponse
from app.services.rag_service import generate_rag_answer
from app.routers.deps import get_current_user_optional

router = APIRouter(prefix="/api/assistant", tags=["AI Business Assistant"])

SUGGESTED_QUESTIONS = {
    "en": [
        "How can I start a small food business from home?",
        "How can I promote my handmade products on WhatsApp Business?",
        "Which government support or loan is relevant to my rural business?",
        "How can I create an attractive brand and packaging?",
        "How do self-help groups (SHG) get bank credit?"
    ],
    "hi": [
        "मैं घर से छोटा खाद्य प्रसंस्करण व्यापार कैसे शुरू कर सकती हूँ?",
        "व्हाट्सएप बिजनेस पर अपने उत्पादों का प्रचार कैसे करें?",
        "मेरे ग्रामीण व्यवसाय के लिए कौन सी सरकारी योजना या ऋण उपलब्ध है?",
        "अपने हस्तशिल्प उत्पाद की अच्छी पैकेजिंग और ब्रांड कैसे बनाएं?",
        "स्वयं सहायता समूह को बैंक से ऋण कैसे मिलता है?"
    ],
    "mr": [
        "मी घरून छोटा खाद्यपदार्थ व्यवसाय कसा सुरू करू शकते?",
        "व्हॉट्सअॅप बिझनेसवर माझ्या उत्पादनांचा प्रसार कसा करावा?",
        "माझ्या ग्रामीण उद्योगासाठी कोणती शासकीय योजना किंवा कर्ज उपलब्ध आहे?",
        "हस्तकला किंवा उत्पादनांचे आकर्षक पॅकेजिंग कसे करावे?",
        "बचत गटांना बँकेकडून सुलभ कर्ज कसे मिळते?"
    ]
}

@router.get("/suggested")
async def get_suggested_questions(language: str = "en"):
    lang = language if language in SUGGESTED_QUESTIONS else "en"
    return {"questions": SUGGESTED_QUESTIONS[lang]}

@router.post("/chat", response_model=ChatResponse)
async def chat(query: ChatQuery, current_user: Optional[dict] = Depends(get_current_user_optional)):
    db = get_database()
    user_lang_pref = query.language
    if current_user and not query.language:
        user_lang_pref = current_user.get("preferred_language")

    session_id = query.session_id or str(uuid.uuid4())
    user_id = current_user["_id"] if current_user else "anonymous"

    answer, detected_lang, is_retrieved, sources, suggested = await generate_rag_answer(
        query=query.message,
        user_language_pref=user_lang_pref,
        session_id=session_id
    )

    # Save to chat_history collection
    now_str = datetime.utcnow().isoformat()
    if db is not None:
        await db.chat_history.insert_one({
            "_id": str(uuid.uuid4()),
            "session_id": session_id,
            "user_id": user_id,
            "query": query.message,
            "reply": answer,
            "answer": answer,
            "language": detected_lang,
            "retrieved": is_retrieved,
            "sources": sources,
            "created_at": now_str
        })

    return ChatResponse(
        reply=answer,
        answer=answer,
        language=detected_lang,
        retrieved=is_retrieved,
        sources=sources,
        suggested_questions=suggested
    )

@router.get("/history")
async def get_chat_history(session_id: Optional[str] = None, current_user: Optional[dict] = Depends(get_current_user_optional)):
    db = get_database()
    query = {}
    if current_user:
        query["user_id"] = current_user["_id"]
    elif session_id:
        query["session_id"] = session_id
    else:
        return []
        
    history = await db.chat_history.find(query).sort("created_at", 1).limit(50).to_list(50)
    results = []
    for h in history:
        results.append({
            "id": h["_id"],
            "query": h.get("query", ""),
            "reply": h.get("reply", ""),
            "language": h.get("language", "en"),
            "sources": h.get("sources", []),
            "created_at": h.get("created_at", "")
        })
    return results
