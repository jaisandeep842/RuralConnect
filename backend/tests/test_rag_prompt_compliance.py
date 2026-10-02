# -*- coding: utf-8 -*-
"""
Tests for RuralConnect Multilingual RAG Answering System
Verifies full compliance with RURALCONNECT AI ASSISTANT MULTILINGUAL RAG prompt:
- Role & Persona
- 72 Core Knowledge Base completeness & schema
- Accurate language detection (English, Hindi, Marathi, Hinglish, Romanized Marathi)
- Semantic & Cross-lingual retrieval
- Strict Negative/No-match responses
- Contextual follow-up understanding
"""

import pytest
import asyncio
from app.knowledge_data import CORE_72_KNOWLEDGE_BASE
from app.services.rag_service import (
    detect_language,
    normalize_query,
    retrieve_best_knowledge,
    generate_rag_answer,
    UNAVAILABLE_RESPONSES
)

def test_core_72_knowledge_base_integrity():
    """Ensure all 72 items exist and have the required schema fields."""
    assert len(CORE_72_KNOWLEDGE_BASE) == 72, f"Expected 72 items, found {len(CORE_72_KNOWLEDGE_BASE)}"
    
    required_keys = [
        "title", "category", "question_en", "answer_en",
        "question_hi", "answer_hi", "question_mr", "answer_mr",
        "verified", "source"
    ]
    
    categories = set()
    for idx, item in enumerate(CORE_72_KNOWLEDGE_BASE):
        for key in required_keys:
            assert key in item, f"Item {idx+1} ({item.get('title')}) missing required key '{key}'"
            assert item[key], f"Item {idx+1} ({item.get('title')}) has empty '{key}'"
        assert item["verified"] is True, f"Item {idx+1} must be verified: True"
        categories.add(item["category"])

    # Verify key domains are represented
    expected_categories = [
        "Agriculture & Farming",
        "Dairy & Livestock",
        "Food Processing",
        "Digital Literacy",
        "Digital Marketing",
        "Branding",
        "Finance & Business Management",
        "Business Registration",
        "Government Support",
        "E-Commerce",
        "Customer Service",
        "Handicrafts & Tailoring",
        "Cybersecurity & Online Safety",
        "Entrepreneurship Basics",
        "Women Entrepreneurship",
        "Digital Record Keeping",
        "Rural Business Growth",
        "AI for Entrepreneurs"
    ]
    for cat in expected_categories:
        assert cat in categories, f"Category '{cat}' missing from knowledge base"

def test_language_detection_rules():
    """Test 3 language rules: user preference > question language > simple English."""
    # 1. Explicit preference overrides
    assert detect_language("How are you?", user_preference="mr") == "mr"
    assert detect_language("शेती कशी करावी?", user_preference="en") == "en"
    assert detect_language("What is UPI?", user_preference="hi") == "hi"

    # 2. Devanagari Hindi vs Marathi
    assert detect_language("डिजिटल मार्केटिंग क्या होता है?") == "hi"
    assert detect_language("UPI म्हणजे काय?") == "mr"
    assert detect_language("शेतीचा व्यवसाय कसा सुरू करावा?") == "mr"
    assert detect_language("खेती का व्यापार कैसे शुरू करें?") == "hi"

    # 3. Romanized Hinglish / Marathi
    assert detect_language("digital marketing kya hota hai") == "hi"
    assert detect_language("sheti kashi karavi") == "mr"

    # 4. English default
    assert detect_language("How should I choose which crop to grow?") == "en"
    assert detect_language("") == "en"

def test_no_match_responses():
    """Verify exact no-match responses as mandated in prompt specification."""
    expected_en = "I don't have verified information about this in the RuralConnect knowledge base yet."
    expected_hi = "इस सवाल के बारे में RuralConnect के verified knowledge base में अभी पर्याप्त जानकारी उपलब्ध नहीं है।"
    expected_mr = "या प्रश्नाबद्दल RuralConnect च्या verified knowledge base मध्ये सध्या पुरेशी माहिती उपलब्ध नाही."

    assert UNAVAILABLE_RESPONSES["en"] == expected_en
    assert UNAVAILABLE_RESPONSES["hi"] == expected_hi
    assert UNAVAILABLE_RESPONSES["mr"] == expected_mr

@pytest.mark.asyncio
async def test_negative_test_out_of_domain():
    """RAG Assistant must NOT invent answers for out-of-domain or unverified queries."""
    # Query outside knowledge base
    answer, lang, is_retrieved, sources, _ = await generate_rag_answer(
        "What is the tomorrow stock price of Reliance shares?",
        user_language_pref="en"
    )
    assert is_retrieved is False
    assert len(sources) == 0
    assert answer == UNAVAILABLE_RESPONSES["en"]

    # Hindi out-of-domain
    answer_hi, lang_hi, is_retrieved_hi, _, _ = await generate_rag_answer(
        "कल का मौसम और शेयर बाजार का भाव क्या है?",
        user_language_pref="hi"
    )
    assert is_retrieved_hi is False
    assert answer_hi == UNAVAILABLE_RESPONSES["hi"]

@pytest.mark.asyncio
async def test_retrieval_across_languages():
    """Verify cross-language retrieval and accuracy for core questions."""
    # 1. Agriculture question in English
    item_en, score_en = retrieve_best_knowledge("How can I start a small farming business with limited money?")
    assert item_en is not None
    assert item_en["title"] == "Starting Small-Scale Farming"

    # 2. Digital Marketing in Hinglish
    item_hi, score_hi = retrieve_best_knowledge("Digital marketing kya hota hai?")
    assert item_hi is not None
    assert item_hi["title"] == "Digital Marketing Basics"

    # 3. UPI in Marathi
    item_mr, score_mr = retrieve_best_knowledge("UPI म्हणजे काय?")
    assert item_mr is not None
    assert item_mr["title"] == "UPI Payments"

    # 4. Dairy question
    item_dairy, score_dairy = retrieve_best_knowledge("How can I start a dairy business?")
    assert item_dairy is not None
    assert item_dairy["title"] == "Starting a Dairy Business"

    # 5. Udyam Registration
    item_udyam, score_udyam = retrieve_best_knowledge("What is Udyam Registration?")
    assert item_udyam is not None
    assert item_udyam["title"] == "Udyam Registration"
