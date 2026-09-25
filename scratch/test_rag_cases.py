# -*- coding: utf-8 -*-
import asyncio
import os
import sys

# Ensure backend directory is in sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
sys.path.insert(0, backend_dir)
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from app.services.rag_service import generate_rag_answer, detect_language, retrieve_best_knowledge

async def run_tests():
    test_cases = [
        # (Query, UserPref, ExpectedLang, ShouldBeRetrieved, ExpectedKeywordInAnswer)
        ("What is digital marketing?", "en", "en", True, "Digital marketing"),
        ("डिजिटल मार्केटिंग क्या है?", "hi", "hi", True, "डिजिटल"),
        ("डिजिटल मार्केटिंग म्हणजे काय?", "mr", "mr", True, "डिजिटल मार्केटिंग"),
        ("Digital marketing kya hota hai?", None, "hi", True, "डिजिटल"),
        ("WhatsApp Business वापरून customer कसे मिळवायचे?", None, "mr", True, "कॅटलॉग"),
        ("How can I calculate the profit of my business?", "en", "en", True, "Profit"),
        ("What is UPI?", "en", "en", True, "UPI"),
        ("How can I start a small dairy business?", "en", "en", True, "dairy"),
        ("How can I start a handicraft business?", "en", "en", True, "handicraft"),
        ("How can I find customers outside my village?", "en", "en", True, "customers"),
        ("Can AI help me create social media posts?", "en", "en", True, "AI"),
        ("What is Udyam Registration?", "en", "en", True, "Udyam"),
        ("bussiness profit kaise calculate kare", "hi", "hi", True, "मुनाफा"),
        # Negative tests
        ("Tell me today's exact stock price.", "en", "en", False, "verified information"),
        ("What is tomorrow's weather?", "en", "en", False, "verified information"),
        ("Give me a guaranteed government loan.", "en", "en", False, "verified information")
    ]

    print("Running RAG test cases...")
    all_passed = True
    for query, pref, exp_lang, should_retrieve, keyword in test_cases:
        ans, lang, retrieved, sources, suggested = await generate_rag_answer(query, pref)
        print(f"\n[QUERY]: {query}")
        print(f" -> Lang: {lang} (Expected: {exp_lang})")
        print(f" -> Retrieved: {retrieved} (Expected: {should_retrieve})")
        print(f" -> Sources: {[s['title'] for s in sources] if sources else []}")
        print(f" -> Preview: {ans[:90]}...")

        if retrieved != should_retrieve:
            print(f"FAILED: expected retrieved={should_retrieve}, got {retrieved}")
            all_passed = False
        if exp_lang and lang != exp_lang:
            print(f"FAILED: expected lang={exp_lang}, got {lang}")
            all_passed = False

    if all_passed:
        print("\nALL RAG TEST CASES PASSED SUCCESSFULLY!")
    else:
        print("\nSOME TESTS FAILED - REVIEW ABOVE.")

if __name__ == "__main__":
    asyncio.run(run_tests())
