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
    r"\bguaranteed\s+(government\s+)?loan\b"
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
    "with", "how", "what", "can", "i", "my", "me", "do", "we", "our",
    "का", "की", "के", "को", "में", "से", "है", "हैं", "था", "थी", "थे", "पर",
    "चा", "ची", "चे", "च्या", "ला", "ना", "आणि", "किंवा", "आहे", "होते"
}

def compute_similarity_score(query: str, item: Dict[str, Any]) -> float:
    """
    Computes a cross-lingual relevance score between query and a knowledge item.
    Evaluates title, category, en/hi/mr questions, en/hi/mr answers, and tags.
    """
    q_norm = normalize_query(query).lower()
    q_words = extract_words(q_norm)
    meaningful_q_tokens = {w for w in q_words if w.lower() not in STOPWORDS}

    score = 0.0

    # 1. Exact phrase / title match
    title_lower = item["title"].lower()
    if title_lower in q_norm or q_norm in title_lower:
        score += 5.0

    # 2. Match across English, Hindi, and Marathi questions
    for q_field in ["question_en", "question_hi", "question_mr"]:
        field_val = item.get(q_field, "").lower()
        if field_val:
            # Check full substring
            clean_field = " ".join(extract_words(field_val))
            clean_q = " ".join(q_words)
            if clean_q in clean_field or clean_field in clean_q:
                score += 4.5
            field_tokens = set(extract_words(field_val))
            if meaningful_q_tokens:
                common = meaningful_q_tokens.intersection(field_tokens)
                if common:
                    score += (len(common) / len(meaningful_q_tokens)) * 3.5

    # 3. Match across tags
    tags = [t.lower() for t in item.get("tags", [])]
    for tag in tags:
        clean_tag = " ".join(extract_words(tag))
        if clean_tag in q_norm or q_norm in clean_tag:
            score += 3.5
        tag_tokens = set(extract_words(tag))
        if meaningful_q_tokens and meaningful_q_tokens.intersection(tag_tokens):
            score += 2.0

    # 4. Match category
    cat_lower = item["category"].lower()
    if cat_lower in q_norm:
        score += 2.0

    # 5. Token match in answers
    for a_field in ["answer_en", "answer_hi", "answer_mr"]:
        a_tokens = set(extract_words(item.get(a_field, "").lower()))
        if meaningful_q_tokens:
            common_a = meaningful_q_tokens.intersection(a_tokens)
            if len(common_a) >= 2:
                score += 1.5


    return score

def retrieve_best_knowledge(query: str) -> Tuple[Optional[Dict[str, Any]], float]:
    """
    Finds the highest-scoring verified knowledge record for the query.
    Returns (item, score).
    """
    q_norm = normalize_query(query).lower()

    # Fast-check for obvious out-of-domain queries
    for pat in OUT_OF_DOMAIN_PATTERNS:
        if re.search(pat, q_norm):
            return None, 0.0

    best_item = None
    max_score = 0.0

    for item in CORE_72_KNOWLEDGE_BASE:
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
        "You are RuralConnect AI, a simple and practical entrepreneurship assistant for rural entrepreneurs in India.\n"
        "Answer using the retrieved RuralConnect knowledge-base context.\n"
        f"Always follow the user's preferred language: {lang_name}.\n"
        "Use simple, beginner-friendly language.\n"
        "When the retrieved context contains the answer, base the response on that context.\n"
        "You may simplify or translate the retrieved information, but do not introduce unsupported factual claims.\n"
        "Never invent government schemes, eligibility, benefits, deadlines, loan amounts, subsidies, registration requirements, or official URLs.\n"
        "If the knowledge base does not contain sufficient verified information, clearly state that verified information is unavailable.\n"
        "Be practical and respectful.\n"
        "Use rural Indian examples when helpful.\n"
        "Do not pretend that unsupported information came from the RuralConnect knowledge base."
    )

    context_text = (
        f"TITLE: {context_item['title']}\n"
        f"CATEGORY: {context_item['category']}\n"
        f"SOURCE: {context_item.get('source', 'RuralConnect Knowledge Base')}\n\n"
        f"VERIFIED INFORMATION (English):\n{context_item['answer_en']}\n\n"
        f"VERIFIED INFORMATION (Hindi):\n{context_item['answer_hi']}\n\n"
        f"VERIFIED INFORMATION (Marathi):\n{context_item['answer_mr']}"
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

    models_to_try = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"]
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
            "title": matched_item["title"],
            "category": matched_item["category"],
            "source": matched_item.get("source", "RuralConnect Knowledge Base")
        }
    ]

    gemini_reply = await call_gemini_grounded(query, matched_item, target_lang, recent_history)
    if gemini_reply and len(gemini_reply) > 40:
        final_answer = gemini_reply
    else:
        # Direct deterministic answer in target language from verified knowledge base
        field_name = f"answer_{target_lang}"
        final_answer = matched_item.get(field_name, matched_item["answer_en"])

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
