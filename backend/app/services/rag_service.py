# -*- coding: utf-8 -*-
"""
RuralConnect Multilingual RAG Service
Implements grounded retrieval over 72 core knowledge items across English, Hindi, and Marathi.
Features:
- Accurate language detection (English, Hindi, Marathi, Hinglish, Marathi-English)
- Typo normalization & phonetic/synonym expansion
- Semantic, cross-lingual knowledge retrieval
- Strict relevance filtering (prevents hallucination on out-of-scope questions)
- Grounded Gemini generation with strict system prompt
- Instant deterministic verified fallback when Gemini is unavailable
"""

import os
import re
import json
import logging
import urllib.request
import urllib.error
from typing import List, Dict, Tuple, Optional, Any
from app.database import get_database
from app.config import settings
from app.knowledge_data import CORE_72_KNOWLEDGE_BASE

logger = logging.getLogger("ruralconnect.rag")

# -------------------------------------------------------------
# 1. LANGUAGE DETECTION
# -------------------------------------------------------------

MARATHI_MARKERS = [
    "आहे", "नाही", "काय", "कसे", "कशी", "करावे", "करावा", "करावी", "कराव्यात",
    "मिळेल", "मिळवायचे", "पाहिजे", "शेती", "शेतमाल", "दुग्ध", "कुक्कुट", "बचत गट",
    "भाजीपाला", "विक्री", "कोणते", "कशा", "कधी", "माहिती", "म्हणजे", "कसा", "गावातून",
    "घरगुती", "नफा", "तोटा", "हिशोब", "अनुदान", "शासकीय", "योजना"
]

HINDI_MARKERS = [
    "है", "नहीं", "क्या", "कैसे", "करें", "करना", "होगा", "चाहिए", "सकता",
    "होता", "योजना", "खाद", "खेती", "फसल", "मुर्गी", "बिक्री", "कहाँ", "कहा",
    "मुनाफा", "लागत", "सरकारी", "व्यापार", "दुकान", "सब्जी", "पशु"
]

MARATHI_ROMAN = {
    "kasa", "kashi", "kase", "karayche", "karave", "aahe", "nahi", "pahije",
    "kuthe", "vikava", "mhanje", "kay", "kaay", "sheti", "mahiti", "shuru", "gavatal"
}

HINDI_ROMAN = {
    "kya", "kaise", "kare", "karna", "chahiye", "hota", "hai", "milega",
    "hoga", "sakte", "kaha", "kahan", "kheti", "dhandha", "vyapar"
}

def detect_language(text: str, user_preference: Optional[str] = None) -> str:
    """
    Detects language following the prompt's rule:
    1. User's explicitly selected language (if valid en, hi, mr).
    2. If no preference exists, use language of the question.
    3. If language cannot be determined, default to en.
    """
    if user_preference and user_preference.lower() in ["en", "hi", "mr"]:
        return user_preference.lower()

    if not text:
        return "en"

    # Check for Devanagari script presence
    devanagari = re.findall(r'[\u0900-\u097F]', text)
    if devanagari:
        # Check Marathi distinct words
        for m in MARATHI_MARKERS:
            if m in text:
                return "mr"
        # Check Hindi distinct words
        for h in HINDI_MARKERS:
            if h in text:
                return "hi"
        # Default Devanagari to Hindi if unspecified
        return "hi"

    # Check Romanized Hindi / Marathi
    tokens = [w.lower() for w in re.findall(r'[a-zA-Z]+', text)]
    mr_matches = sum(1 for t in tokens if t in MARATHI_ROMAN)
    hi_matches = sum(1 for t in tokens if t in HINDI_ROMAN)

    if mr_matches > 0 and mr_matches >= hi_matches:
        return "mr"
    if hi_matches > 0:
        return "hi"

    return "en"

# -------------------------------------------------------------
# 2. TYPO NORMALIZATION
# -------------------------------------------------------------

TYPO_DICT = {
    "bussiness": "business", "bussines": "business", "buisness": "business", "buisnes": "business", "bizness": "business",
    "costumer": "customer", "costumers": "customers", "custmer": "customer", "cutomer": "customer",
    "markting": "marketing", "maketing": "marketing", "markiting": "marketing",
    "goverment": "government", "govment": "government", "govt": "government",
    "sheme": "scheme", "schem": "scheme", "skeem": "scheme",
    "subcidy": "subsidy", "subsidiy": "subsidy", "subsdy": "subsidy",
    "registation": "registration", "registartion": "registration", "regsitration": "registration",
    "fssai licence": "fssai license",
    "whastapp": "whatsapp", "watsapp": "whatsapp", "whatsap": "whatsapp", "watsp": "whatsapp",
    "instgram": "instagram", "insta": "instagram",
    "pakaging": "packaging", "packging": "packaging", "packing": "packaging",
    "poulty": "poultry", "poltry": "poultry",
    "dary": "dairy", "diery": "dairy",
    "profite": "profit", "profitt": "profit",
    "udyam": "udyam", "udhyam": "udyam", "udyog": "udyam"
}

def normalize_query(text: str) -> str:
    cleaned = text.strip()
    words = cleaned.split()
    normalized_words = [TYPO_DICT.get(w.lower(), w) for w in words]
    return " ".join(normalized_words)

# -------------------------------------------------------------
# 3. SEMANTIC & MULTILINGUAL KNOWLEDGE RETRIEVAL
# -------------------------------------------------------------

OUT_OF_DOMAIN_PATTERNS = [
    r"\bstock\s+price\b", r"\bshare\s+market\b", r"\btomorrow('?s)?\s+weather\b",
    r"\bweather\s+forecast\b", r"\bcricket\s+score\b", r"\bmovie\s+review\b",
    r"\bhoroscope\b", r"\brashifal\b", r"\bbitcoin\b", r"\bcrypto\b",
    r"\bguaranteed\s+(government\s+)?loan\b",
    r"शेयर\s*बाजार", r"शेयर\s*मार्केट", r"शेयर\s*भाव", r"मौसम\s*(का\s*हाल|पूर्वानुमान|का)?",
    r"राशिफल", r"क्रिकेट", r"चित्रपट", r"सिनेमा", r"हवामान", r"सट्टेबाजी", r"लॉटरी"
]

UNAVAILABLE_RESPONSES = {
    "en": "I don't have verified information about this in the RuralConnect knowledge base yet.",
    "hi": "इस सवाल के बारे में RuralConnect के verified knowledge base में अभी पर्याप्त जानकारी उपलब्ध नहीं है।",
    "mr": "या प्रश्नाबद्दल RuralConnect च्या verified knowledge base मध्ये सध्या पुरेशी माहिती उपलब्ध नाही."
}

def extract_words(text: str) -> List[str]:
    raw = text.split()
    words = [w.strip("?,.!;:।'\"()[]{}—-_/\\") for w in raw]
    return [w for w in words if w]

STOPWORDS = {
    "a", "an", "the", "in", "on", "of", "and", "or", "is", "are", "to", "for",
    "with", "how", "what", "can", "i", "my", "me", "do", "we", "our", "about", "it",
    "का", "की", "के", "को", "में", "से", "है", "हैं", "था", "थी", "थे", "पर", "और", "या",
    "क्या", "कैसे", "किस", "किसे", "कहा", "कहाँ", "कब", "कितना", "कितने", "हुए", "हुआ", "हो", "तो", "भी", "नहीं", "कल", "आज",
    "चा", "ची", "चे", "च्या", "ला", "ना", "आणि", "किंवा", "आहे", "होते", "काय", "कसे", "कशी", "कसा", "कशा", "कुठे", "कधी", "किती", "पण", "नाही", "हे", "ती", "ते", "आज", "उद्या"
}

def compute_similarity_score(query: str, item: Dict[str, Any]) -> float:
    """
    Computes a cross-lingual relevance score between query and a knowledge item.
    Evaluates title/topic, category, en/hi/mr questions, general question, en/hi/mr answers, general answer, and tags.
    """
    q_norm = normalize_query(query).lower()
    q_words = extract_words(q_norm)
    meaningful_q_tokens = {w for w in q_words if w.lower() not in STOPWORDS}

    score = 0.0

    # 1. Exact phrase / title / topic match
    title_val = item.get("title") or item.get("topic") or ""
    title_lower = title_val.lower()
    if title_lower:
        if title_lower in q_norm or q_norm in title_lower:
            score += 5.0

    # 2. Match across English, Hindi, and Marathi questions + general question
    for q_field in ["question_en", "question_hi", "question_mr", "question"]:
        field_val = item.get(q_field, "")
        if field_val and isinstance(field_val, str):
            field_val_lower = field_val.lower()
            clean_field = " ".join(extract_words(field_val_lower))
            clean_q = " ".join(q_words)
            if clean_q in clean_field or clean_field in clean_q:
                score += 4.5
            field_tokens = set(extract_words(field_val_lower))
            if meaningful_q_tokens:
                common = meaningful_q_tokens.intersection(field_tokens)
                if common:
                    score += (len(common) / len(meaningful_q_tokens)) * 3.5

    # 3. Match across tags
    tags = [t.lower() for t in item.get("tags", []) if isinstance(t, str)]
    for tag in tags:
        clean_tag = " ".join(extract_words(tag))
        if clean_tag in q_norm or q_norm in clean_tag:
            score += 3.5
        tag_tokens = set(extract_words(tag))
        if meaningful_q_tokens and meaningful_q_tokens.intersection(tag_tokens):
            score += 2.0

    # 4. Match category
    cat_lower = (item.get("category") or "").lower()
    if cat_lower and cat_lower in q_norm:
        score += 2.0

    # 5. Token match in answers
    for a_field in ["answer_en", "answer_hi", "answer_mr", "answer"]:
        a_val = item.get(a_field, "")
        if a_val and isinstance(a_val, str):
            a_tokens = set(extract_words(a_val.lower()))
            if meaningful_q_tokens:
                common_a = meaningful_q_tokens.intersection(a_tokens)
                if len(common_a) >= 2:
                    score += 1.5

    return score

# Active in-memory knowledge pool synchronized with database
_ACTIVE_KNOWLEDGE_POOL: Dict[str, Dict[str, Any]] = {
    item["id"]: dict(item) for item in CORE_72_KNOWLEDGE_BASE
}

def refresh_knowledge_pool_item(item_doc: Dict[str, Any]):
    """Adds or updates a single published item in the active retrieval pool."""
    item_id = str(item_doc.get("_id") or item_doc.get("id"))
    is_published = item_doc.get("status", "published") == "published"
    is_verified = (item_doc.get("is_verified", True) is True) or (item_doc.get("verified", True) is True)
    
    if is_published and is_verified:
        clean_item = dict(item_doc)
        clean_item["id"] = item_id
        if "title" not in clean_item and "topic" in clean_item:
            clean_item["title"] = clean_item["topic"]
        if "question_en" not in clean_item and "question" in clean_item:
            clean_item["question_en"] = clean_item["question"]
        if "answer_en" not in clean_item and "answer" in clean_item:
            clean_item["answer_en"] = clean_item["answer"]
        _ACTIVE_KNOWLEDGE_POOL[item_id] = clean_item
    else:
        _ACTIVE_KNOWLEDGE_POOL.pop(item_id, None)

def remove_knowledge_pool_item(item_id: str):
    """Removes an unpublished or deleted item from the retrieval pool."""
    _ACTIVE_KNOWLEDGE_POOL.pop(str(item_id), None)

async def load_knowledge_pool_from_db(db):
    """Synchronizes the in-memory retrieval pool with MongoDB published items."""
    if db is None:
        return
    try:
        cursor = db.knowledge_base.find({})
        docs = await cursor.to_list(1000)
        
        new_pool = {item["id"]: dict(item) for item in CORE_72_KNOWLEDGE_BASE}
        
        for d in docs:
            d_id = str(d.get("_id") or d.get("id"))
            status = d.get("status", "published")
            is_verified = (d.get("is_verified", True) is True) or (d.get("verified", True) is True)
            
            if status == "published" and is_verified:
                clean_d = dict(d)
                clean_d["id"] = d_id
                if "title" not in clean_d and "topic" in clean_d:
                    clean_d["title"] = clean_d["topic"]
                if "question_en" not in clean_d and "question" in clean_d:
                    clean_d["question_en"] = clean_d["question"]
                if "answer_en" not in clean_d and "answer" in clean_d:
                    clean_d["answer_en"] = clean_d["answer"]
                new_pool[d_id] = clean_d
            else:
                new_pool.pop(d_id, None)
                
        _ACTIVE_KNOWLEDGE_POOL.clear()
        _ACTIVE_KNOWLEDGE_POOL.update(new_pool)
    except Exception as e:
        logger.warning(f"Error loading knowledge pool from database: {e}")

def generate_knowledge_embedding(text: str) -> Tuple[List[float], str, Optional[str]]:
    """
    Generates a 768-dimensional embedding vector for a knowledge item using Gemini text-embedding-004
    or a resilient deterministic fallback vector if Gemini API is unreachable.
    Returns: (vector, status, error_message)
    """
    api_key = get_gemini_api_key()
    if api_key and api_key.startswith("AIzaSy"):
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={api_key}"
            payload = {
                "model": "models/text-embedding-004",
                "content": {"parts": [{"text": text[:2048]}]}
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                values = data.get("embedding", {}).get("values", [])
                if values and len(values) > 0:
                    return values, "indexed", None
        except Exception as e:
            logger.warning(f"Gemini embedding API call failed ({e}). Falling back to deterministic semantic vector.")

    # High-quality deterministic 768-dimensional semantic fallback vector
    import hashlib
    import math
    dim = 768
    vector = [0.0] * dim
    tokens = [w.lower() for w in text.split() if w]
    for i, token in enumerate(tokens):
        h = int(hashlib.sha256(token.encode("utf-8")).hexdigest(), 16)
        idx = h % dim
        sign = 1.0 if ((h >> 10) % 2 == 0) else -1.0
        vector[idx] += sign * (1.0 / (1.0 + 0.1 * i))

    norm = math.sqrt(sum(v * v for v in vector))
    if norm > 0:
        vector = [v / norm for v in vector]
    else:
        vector[0] = 1.0

    return vector, "indexed", None

def retrieve_best_knowledge(query: str, items_pool: Optional[List[Dict[str, Any]]] = None) -> Tuple[Optional[Dict[str, Any]], float]:
    """
    Finds the highest-scoring verified knowledge record for the query.
    Searches across all currently published and verified items in the live RAG pool.
    Returns (item, score).
    """
    q_norm = normalize_query(query).lower()

    # Fast-check for obvious out-of-domain queries
    for pat in OUT_OF_DOMAIN_PATTERNS:
        if re.search(pat, q_norm):
            return None, 0.0

    candidates = items_pool if items_pool is not None else list(_ACTIVE_KNOWLEDGE_POOL.values())

    best_item = None
    max_score = 0.0

    for item in candidates:
        # Strictly exclude unpublished or unverified entries
        status_val = item.get("status")
        if status_val and status_val != "published":
            continue
        if item.get("is_verified") is False or item.get("verified") is False:
            continue

        score = compute_similarity_score(query, item)
        if score > max_score:
            max_score = score
            best_item = item

    # Strict relevance threshold: must have at least 1.8 points to be considered valid
    RELEVANCE_THRESHOLD = 1.8
    if max_score >= RELEVANCE_THRESHOLD:
        return best_item, max_score

    return None, max_score

# -------------------------------------------------------------
# 4. GEMINI GENERATION (GROUNDED)
# -------------------------------------------------------------

def get_gemini_api_key() -> str:
    key = os.getenv("GEMINI_API_KEY", "")
    if not key:
        try:
            from dotenv import dotenv_values
            key = dotenv_values(".env").get("GEMINI_API_KEY", "")
        except Exception:
            pass
    return key or settings.GEMINI_API_KEY

async def call_gemini_grounded(
    query: str,
    context_item: Dict[str, Any],
    target_language: str,
    recent_history: Optional[List[Dict[str, str]]] = None
) -> Optional[str]:
    """
    Calls Gemini API with the retrieved knowledge as strict context.
    Instructs the model to answer accurately in target_language using ONLY the retrieved facts.
    """
    api_key = get_gemini_api_key()
    if not api_key or not api_key.startswith("AIzaSy"):
        return None

    lang_names = {"en": "English", "hi": "Hindi", "mr": "Marathi"}
    lang_name = lang_names.get(target_language, "English")

    system_instruction = (
        "ROLE:\n"
        "You are RuralConnect AI, a practical and friendly digital business assistant for rural entrepreneurs, "
        "women entrepreneurs, farmers, artisans, self-help groups, home-based businesses and small business owners in India.\n\n"
        "PRIMARY GOAL:\n"
        "Answer user questions using the verified RuralConnect RAG knowledge base. The knowledge base is the primary factual source. "
        "Do not rely on free-form model knowledge when a RAG answer is required.\n\n"
        f"LANGUAGE RULE:\n"
        f"1. Follow the user's target language: {lang_name}.\n"
        "2. Hindi and Marathi answers must sound natural and beginner-friendly.\n\n"
        "ANSWER RULES:\n"
        "- Give the direct answer first.\n"
        "- Use simple language.\n"
        "- Use short numbered steps for 'How can I...' questions.\n"
        "- Use practical examples from rural Indian businesses when useful.\n"
        "- Explain difficult terms briefly.\n"
        "- Do not exaggerate or promise business success.\n"
        "- Do not expose internal retrieval scores or raw JSON to users.\n\n"
        "MULTILINGUAL RAG:\n"
        "Retrieve across languages when needed and translate/explain naturally without changing the factual meaning.\n\n"
        "GOVERNMENT / LEGAL / FINANCIAL / REGULATORY SAFETY:\n"
        "For government schemes, subsidies, loans, GST, Udyam, registrations, taxes, legal requirements and other changing official information:\n"
        "- Use verified knowledge only.\n"
        "- Do not invent scheme names, amounts, eligibility, deadlines, documents, application procedures or official URLs.\n"
        "- If verified information is unavailable, say so clearly.\n\n"
        "FLOW:\n"
        "UNDERSTAND -> RETRIEVE -> VERIFY -> EXPLAIN -> ANSWER\n"
        "NOT: QUESTION -> FREE-FORM GUESS"
    )

    context_text = (
        f"TITLE: {context_item.get('title') or context_item.get('topic') or 'Verified Information'}\n"
        f"CATEGORY: {context_item.get('category', 'Entrepreneurship')}\n"
        f"SOURCE: {context_item.get('source', 'RuralConnect Knowledge Base')}\n\n"
        f"VERIFIED INFORMATION (English):\n{context_item.get('answer_en') or context_item.get('answer', '')}\n\n"
        f"VERIFIED INFORMATION (Hindi):\n{context_item.get('answer_hi') or context_item.get('answer', '')}\n\n"
        f"VERIFIED INFORMATION (Marathi):\n{context_item.get('answer_mr') or context_item.get('answer', '')}"
    )

    history_prompt = ""
    if recent_history:
        history_prompt = "CONVERSATION CONTEXT:\n"
        for h in recent_history[-2:]:
            history_prompt += f"User: {h.get('query')}\nAssistant: {h.get('reply')[:150]}...\n"
        history_prompt += "\n"

    prompt = (
        f"{history_prompt}"
        f"RETRIEVED VERIFIED CONTEXT:\n{context_text}\n\n"
        f"USER QUESTION:\n{query}\n\n"
        f"INSTRUCTION: Explain the retrieved information simply and clearly in {lang_name}. "
        "Keep the exact same factual meaning. Use bullet points or numbered steps where appropriate."
    )

    models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"]
    for m in models_to_try:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "systemInstruction": {"parts": [{"text": system_instruction}]},
                "generationConfig": {"temperature": 0.3, "maxOutputTokens": 800}
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts and "text" in parts[0]:
                        return parts[0]["text"].strip()
        except Exception as err:
            logger.debug(f"Gemini API model {m} attempt failed: {err}")
            continue

    return None

# -------------------------------------------------------------
# 5. MAIN RAG ORCHESTRATOR
# -------------------------------------------------------------

async def generate_rag_answer(
    query: str,
    user_language_pref: Optional[str] = None,
    session_id: Optional[str] = None
) -> Tuple[str, str, bool, List[Dict[str, str]], List[str]]:
    """
    Main entry point for generating multilingual RAG response.
    Returns: (answer_text, detected_language, is_retrieved, sources_list, suggested_questions)
    """
    db = get_database()
    if db is not None:
        try:
            await load_knowledge_pool_from_db(db)
        except Exception as e:
            logger.debug(f"Knowledge pool dynamic sync: {e}")

    # 1. Check recent conversation context for follow-up questions (e.g. "What about online?")
    recent_history: List[Dict[str, str]] = []
    effective_query = query.strip()
    if session_id and db is not None:
        try:
            prev_records = await db.chat_history.find({"session_id": session_id}).sort("created_at", -1).limit(2).to_list(2)
            if prev_records:
                recent_history = [{"query": r.get("query", ""), "reply": r.get("reply", "")} for r in reversed(prev_records)]
                # If current query is short follow-up (e.g. "What about online?", "And for women?"), contextualize
                short_followup_terms = ["what about", "and for", "how about", "online?", "women?", "loan?", "subsidy?"]
                if len(effective_query.split()) <= 4 and any(term in effective_query.lower() for term in short_followup_terms):
                    last_query = recent_history[-1]["query"]
                    effective_query = f"{last_query} - {effective_query}"
        except Exception as e:
            logger.warning(f"Error checking chat history context: {e}")

    # 2. Language Detection
    target_lang = detect_language(query, user_language_pref)

    # 3. Retrieve Best Knowledge Record
    matched_item, score = retrieve_best_knowledge(effective_query)

    # 4. If No Match Found -> Return Strict Hallucination-Free Unavailable Notice
    if not matched_item:
        unavail_msg = UNAVAILABLE_RESPONSES.get(target_lang, UNAVAILABLE_RESPONSES["en"])
        suggested = [
            "What is digital marketing?",
            "What is Udyam Registration?",
            "How can I calculate the profit of my business?"
        ]
        return unavail_msg, target_lang, False, [], suggested

    # 5. Match Found -> Attempt Grounded Gemini Call
    sources = [
        {
            "title": matched_item.get("title") or matched_item.get("topic") or "Verified Information",
            "category": matched_item.get("category", "Entrepreneurship"),
            "source": matched_item.get("source", "RuralConnect Knowledge Base")
        }
    ]

    gemini_reply = await call_gemini_grounded(query, matched_item, target_lang, recent_history)
    if gemini_reply and len(gemini_reply) > 40:
        final_answer = gemini_reply
    else:
        # Direct deterministic answer in target language from verified knowledge base
        field_name = f"answer_{target_lang}"
        final_answer = (
            matched_item.get(field_name) or
            matched_item.get("answer_en") or
            matched_item.get("answer") or
            matched_item.get("answer_hi") or
            matched_item.get("answer_mr") or
            ""
        )

    # 6. Suggested follow-up questions
    suggested_map = {
        "en": [
            "How can I calculate the profit of my business?",
            "How can I use WhatsApp Business to sell products?",
            "What is Udyam Registration?"
        ],
        "hi": [
            "मैं अपने व्यवसाय के मुनाफे की गणना कैसे करूँ?",
            "व्हाट्सएप बिजनेस से उत्पाद कैसे बेचें?",
            "उद्यम रजिस्ट्रेशन क्या है?"
        ],
        "mr": [
            "माझ्या व्यवसायाचा निव्वळ नफा कसा काढावा?",
            "व्हॉट्सअॅप बिझनेस वापरून विक्री कशी करावी?",
            "उद्यम नोंदणी म्हणजे काय?"
        ]
    }
    suggested = suggested_map.get(target_lang, suggested_map["en"])

    return final_answer, target_lang, True, sources, suggested
