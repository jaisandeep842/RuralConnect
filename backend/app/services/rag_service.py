import os
import re
import logging
from typing import List, Dict, Tuple, Optional
from app.database import get_database
from app.config import settings

logger = logging.getLogger("ruralconnect.rag")

# Multilingual keyword synonyms mapping to knowledge tags and categories
SYNONYM_MAP = {
    "food": ["food", "fssai", "packaging", "pickles", "spices", "खाद्य", "अन्न", "लोणचे", "पापड", "मसाले", "प्रसंस्करण", "खाद्यपदार्थ"],
    "marketing": ["marketing", "whatsapp", "catalog", "sales", "social media", "विपणन", "विक्री", "प्रचार", "व्हॉट्सअॅप", "ग्राहक", "बाजारपेठ"],
    "pmegp": ["pmegp", "subsidy", "kvic", "सबसिडी", "अनुदान", "खादी", "कर्ज"],
    "mudra": ["mudra", "shishu", "kishor", "tarun", "मुद्रा", "कर्ज", "ऋण"],
    "shg": ["shg", "bachat gat", "self help group", "mavim", "nrlm", "बचत गट", "स्वयं सहायता समूह", "बचतगट"],
    "scheme": ["scheme", "yojana", "subsidy", "loan", "योजना", "सबसिडी", "अनुदान", "कर्ज", "सरकारी योजना", "शासन निर्णय"],
    "branding": ["branding", "packaging", "labels", "design", "पॅकेजिंग", "ब्रँड", "लेबल", "नाव"],
    "training": ["training", "workshop", "course", "learn", "प्रशिक्षण", "कार्यशाळा", "वर्कशॉप", "शिकणे"],
    "women": ["women", "mahila", "lady", "female", "महिला", "स्त्री", "नारी", "बचत गट"],
    "dairy": ["dairy", "cow", "buffalo", "milk", "livestock", "दुग्ध", "गाय", "म्हैस", "पशुसंवर्धन"],
}

# Domain-expert answers in Hindi, Marathi, and English for core rural business domains
KNOWLEDGE_RESPONSES = {
    "food": {
        "mr": (
            "**ग्रामीण भागात घरून खाद्य प्रक्रिया (Food Processing) व्यवसाय सुरू करण्याचे टप्पे:**\n\n"
            "1. **उद्योग नोंदणी (Udyam Registration):** सर्वप्रथम [udyamregistration.gov.in](https://udyamregistration.gov.in) वर मोफत MSME नोंदणी करा.\n"
            "2. **FSSAI परवाना (अन्न सुरक्षा):** वार्षिक उलाढाल १२ लाखांपेक्षा कमी असल्यास FoSCoS पोर्टलवरून फक्त ₹१००/वर्ष फी भरून basic registration मिळवा.\n"
            "3. **स्वच्छता व पॅकेजिंग:** हवाबंद पॅकिंग (Airtight pouch/jar), पदार्थाचे नाव, घटक, उत्पादन तारीख व एक्सपायरी तारीख स्पष्ट नमूद करा.\n"
            "4. **PMFME योजना:** अन्न प्रक्रिया उद्योगासाठी केंद्र सरकारची PMFME योजना आहे, ज्यात ३५% सबसिडी (कमाल ₹१० लाख) मिळते.\n"
            "5. **स्थानिक विक्री:** व्हॉट्सअॅप ग्रुप्स, स्थानिक आठवडे बाजार (हाट) आणि किराणा दुकानांशी संपर्क साधून विक्री सुरू करा."
        ),
        "hi": (
            "**ग्रामीण क्षेत्र में घर से खाद्य प्रसंस्करण (Food Processing) व्यापार शुरू करने के मुख्य कदम:**\n\n"
            "1. **उद्यम रजिस्ट्रेशन:** [udyamregistration.gov.in](https://udyamregistration.gov.in) पर निःशुल्क MSME Udyam पंजीकरण करें।\n"
            "2. **FSSAI लाइसेंस:** ₹12 लाख से कम टर्नओवर के लिए FoSCoS पोर्टल पर मात्र ₹100 प्रति वर्ष में बेसिक रजिस्ट्रेशन प्राप्त करें।\n"
            "3. **पैकेजिंग और लेबलिंग:** एयरटाइट पाउच का उपयोग करें और निर्माण तिथि, एक्सपायरी व सामग्री का साफ विवरण दें।\n"
            "4. **PMFME योजना:** खाद्य प्रसंस्करण यूनिट लगाने हेतु 35% क्रेडिट-लिंक्ड सब्सिडी (अधिकतम ₹10 लाख) उपलब्ध है।\n"
            "5. **मार्केटिंग:** व्हाट्सएप बिजनेस कैटलॉग और स्थानीय हाट-बाजार के माध्यम से ग्राहकों तक पहुंचें।"
        ),
        "en": (
            "**Steps to Start a Home Food Processing Business in Rural India:**\n\n"
            "1. **Udyam Registration:** Register your micro-business for free on [udyamregistration.gov.in](https://udyamregistration.gov.in).\n"
            "2. **FSSAI License:** For turnover under ₹12 Lakhs/year, get a Basic FSSAI Registration on the FoSCoS portal (₹100/year).\n"
            "3. **Packaging & Labeling:** Use clean airtight food-grade pouches with labels showing ingredients, packing date, and best-before date.\n"
            "4. **PMFME Scheme:** Avail 35% capital subsidy (up to ₹10 Lakhs) under the Pradhan Mantri Formalisation of Micro food processing Enterprises scheme.\n"
            "5. **Local Distribution:** Set up a WhatsApp Business catalog and supply to local grocery stores and weekly village haats."
        )
    },
    "marketing": {
        "mr": (
            "**ग्रामीण उद्योजकांसाठी व्हॉट्सअॅप व सोशल मीडिया मार्केटिंग तंत्र:**\n\n"
            "1. **WhatsApp Business अ‍ॅप:** गुगल प्ले स्टोअरवरून मोफत डाऊनलोड करा. आपल्या उत्पादनांचे ५-१० सुस्पष्ट फोटो आणि किमतींसह 'कॅटलॉग' (Catalog) तयार करा.\n"
            "2. **फोटो व व्हिडिओ:** सूर्यप्रकाशात उत्पादनांचे स्वच्छ फोटो काढा. उत्पादन बनवतानाचे छोटे व्हिडिओ (Shorts/Reels) तयार करा.\n"
            "3. **UPI पेमेंट:** फोनपे, गुगलपे किंवा पेटीएमचा QR कोड तयार ठेवा जेणेकरून ग्राहक त्वरित आगाऊ रक्कम पाठवू शकतील.\n"
            "4. **ग्रामपंचायत व कौटुंबिक नेटवर्क:** तालुका व गावातील ग्रुप्सवर दर आठवड्याला नवीन ऑफर व उत्पादने शेअर करा.\n"
            "5. **ग्राहकांचा विश्वास:** ग्राहकांना वेळेवर डिलिव्हरी द्या आणि त्यांच्याकडून चांगल्या प्रतिक्रिया (Reviews) मिळवा."
        ),
        "hi": (
            "**ग्रामीण उद्यमियों के लिए व्हाट्सएप और डिजिटल मार्केटिंग के सरल उपाय:**\n\n"
            "1. **WhatsApp Business:** प्ले स्टोर से डाउनलोड करें और अपने उत्पादों की सुंदर तस्वीरों व कीमतों के साथ 'कैटलॉग' बनाएं।\n"
            "2. **नेचुरल लाइट फोटोग्राफी:** मोबाइल से दिन की रोशनी में साफ फोटो खींचें और पैकेजिंग दिखाएं।\n"
            "3. **डिजिटल पेमेंट (UPI):** PhonePe, Google Pay या Paytm QR कोड का इस्तेमाल करें ताकि एडवांस पेमेंट आसानी से मिल सके।\n"
            "4. **स्थानीय प्रचार:** गाँव व तहसील के व्हाट्सएप समूहों में कैटलॉग लिंक भेजें।\n"
            "5. **कस्टमर सर्विस:** ऑर्डर पर तुरंत जवाब दें और पार्सल ट्रैकिंग की जानकारी साझा करें।"
        ),
        "en": (
            "**Digital & WhatsApp Marketing Guide for Rural Entrepreneurs:**\n\n"
            "1. **WhatsApp Business Catalog:** Install WhatsApp Business, add your business hours, and create a product catalog with prices and photos.\n"
            "2. **Mobile Photography:** Click crisp photos in natural daylight showcasing the authenticity and hygiene of your products.\n"
            "3. **UPI Digital Payments:** Provide a UPI QR code (Google Pay, PhonePe, Paytm) for quick instant payment collection.\n"
            "4. **Local Promotion:** Share your catalog link in regional community groups and among local retailers.\n"
            "5. **Short Videos:** Share 15-30 second behind-the-scenes craft or preparation clips to build customer trust."
        )
    },
    "pmegp": {
        "mr": (
            "**PMEGP (पंतप्रधान रोजगार निर्मिती कार्यक्रम) योजनेची संपूर्ण माहिती:**\n\n"
            "• **उद्देश:** नवीन सूक्ष्म उद्योग, उत्पादन किंवा सेवा व्यवसाय सुरू करण्यासाठी राष्ट्रीय स्तरावरील योजना.\n"
            "• **कर्ज मर्यादा:** उत्पादन क्षेत्रासाठी ₹५० लाखांपर्यंत आणि सेवा क्षेत्रासाठी ₹२० लाखांपर्यंत कर्ज.\n"
            "• **ग्रामीण महिलांसाठी सबसिडी:** ग्रामीण भागातील महिला, SC/ST, OBC, अल्पसंख्याकांसाठी **३५% सरकारी सबसिडी (Margin Money Subsidy)**.\n"
            "• **स्वतःचे भांडवल:** प्रकल्प खर्चाच्या केवळ ५% स्वतःचे योगदान द्यावे लागते.\n"
            "• **अर्ज प्रक्रिया:** अधिकृत KVIC पोर्टल [kviconline.gov.in](https://www.kviconline.gov.in) वर ऑनलाइन अर्ज करा. आधार कार्ड, पॅन कार्ड, प्रकल्प अहवाल (DPR), आणि जातीचा दाखला आवश्यक आहे."
        ),
        "hi": (
            "**PMEGP (प्रधानमंत्री रोजगार सृजन कार्यक्रम) की मुख्य विशेषताएं:**\n\n"
            "• **उद्देश्य:** नया विनिर्माण या सेवा उद्यम स्थापित करने के लिए ऋण व सब्सिडी।\n"
            "• **ऋण सीमा:** विनिर्माण क्षेत्र में ₹50 लाख तक तथा सेवा क्षेत्र में ₹20 लाख तक।\n"
            "• **ग्रामीण महिलाओं हेतु सब्सिडी:** ग्रामीण क्षेत्र की महिलाओं और आरक्षित वर्गों को **35% सरकारी सब्सिडी** मिलती है।\n"
            "• **स्वयं का अंशदान:** कुल परियोजना लागत का केवल 5%।\n"
            "• **आवेदन प्रक्रिया:** KVIC की आधिकारिक वेबसाइट [kviconline.gov.in](https://www.kviconline.gov.in) पर प्रोजेक्ट रिपोर्ट (DPR) के साथ ऑनलाइन आवेदन करें।"
        ),
        "en": (
            "**PMEGP (Prime Minister’s Employment Generation Programme) Overview:**\n\n"
            "• **Objective:** Government credit-linked subsidy scheme for setting up micro-enterprises.\n"
            "• **Loan Limits:** Up to ₹50 Lakhs for manufacturing units; up to ₹20 Lakhs for service sector.\n"
            "• **Subsidy for Rural Women:** **35% Government Margin Money Subsidy** for women and special category entrepreneurs in rural areas.\n"
            "• **Beneficiary Contribution:** Only 5% of project cost required as own contribution.\n"
            "• **How to Apply:** Apply directly online at the official KVIC portal [kviconline.gov.in](https://www.kviconline.gov.in) with your Aadhaar, PAN, and Detailed Project Report (DPR)."
        )
    },
    "shg": {
        "mr": (
            "**महिला बचत गट (SHG) व बँक लिंकेज कर्ज योजना:**\n\n"
            "• **स्थापना:** एकाच गावातील १० ते २० महिला एकत्र येऊन बचत गट स्थापन करू शकतात.\n"
            "• **नियमित बचत:** प्रत्येक सदस्याने दरमहा निश्चित रक्कम बचत करावी व बैठक नोंदवहीत नोंद ठेवावी.\n"
            "• **बँक खाते:** बचत गटाच्या नावाने कोणत्याही राष्ट्रीयकृत किंवा ग्रामीण बँकेत ६ महिने जुने खाते असावे.\n"
            "• **NRLM / उमेद अंतर्गत कर्ज:** ६ महिने नियमित व्यवहारांनंतर बँकेकडून विनातारण (Collateral-free) ₹१ लाख ते ₹५ लाखांपर्यंत कमी व्याजदरात कर्ज मिळते.\n"
            "• **सरकारी लाभ:** फिरता निधी (Revolving Fund ₹१५,०००) आणि सामुदायिक गुंतवणूक निधी (CIF) चा लाभ मिळतो."
        ),
        "hi": (
            "**महिला स्वयं सहायता समूह (SHG) और बैंक क्रेडिट लिंकेज:**\n\n"
            "• **गठन:** 10 से 20 ग्रामीण महिलाएं मिलकर स्वयं सहायता समूह शुरू कर सकती हैं।\n"
            "• **नियम:** हर महीने नियमित बचत और बैठकों का रजिस्टर मेंटेन करना आवश्यक है।\n"
            "• **बैंक खाता:** बैंक में समूह के नाम से खाता खुलवाएं और 6 महीने नियमित संचालन करें।\n"
            "• **NRLM ऋण सुविधा:** आजीविका मिशन के तहत समूह को बिना किसी गारंटी के ₹1 लाख से ₹5 लाख तक का रियायती ऋण मिलता है।\n"
            "• **अनुदान सहायता:** रिवॉल्विंग फंड (₹15,000) और कम्युनिटी इन्वेस्टमेंट फंड उपलब्ध होता है।"
        ),
        "en": (
            "**Self-Help Groups (SHG) & Bank Credit Linkage in Rural India:**\n\n"
            "• **Formation:** 10-20 rural women can form a Mahila Bachat Gat / SHG in their village.\n"
            "• **Savings Discipline:** Hold monthly meetings and maintain regular small savings and minutes book.\n"
            "• **Bank Linkage:** After 6 months of active operations, the group can open a savings account and pass grading.\n"
            "• **NRLM Credit:** Under National Rural Livelihoods Mission, banks provide collateral-free loans from ₹1 Lakh up to ₹10 Lakhs at subsidized interest rates.\n"
            "• **Government Grants:** Groups are eligible for Revolving Fund (₹15,000) and Community Investment Funds (CIF)."
        )
    }
}

FALLBACK_RESPONSES = {
    "hi": "नमस्ते! मैं ग्रामीण कनेक्ट का एआई बिजनेस सहायक हूँ। आप मुझसे ग्रामीण व्यवसाय कैसे शुरू करें, सरकारी योजनाएं (जैसे PMEGP, मुद्रा योजना), डिजिटल मार्केटिंग या खाद्य प्रसंस्करण के बारे में पूछ सकते हैं।",
    "mr": "नमस्कार! मी रुरल कनेक्टचा एआई सहाय्यक आहे. आपण मला ग्रामीण उद्योग कसा सुरू करावा, शासकीय योजना (उदा. मुद्रा किंवा PMEGP कर्ज), डिजिटल मार्केटिंग किंवा महिला बचत गटांबद्दल कोणताही प्रश्न विचारू शकता.",
    "en": "Namaste! I am RuralConnect’s AI Business Assistant. You can ask me how to start a rural business, discover government schemes (PMEGP, Mudra, PMFME), learn digital marketing, or connect with mentors."
}

def detect_topic(query: str) -> str:
    q = query.lower()
    for topic, keywords in SYNONYM_MAP.items():
        for kw in keywords:
            if kw in q:
                return topic
    return ""

async def search_verified_knowledge(query: str, language: str = "en") -> Tuple[List[str], List[str]]:
    db = get_database()
    sources = []
    retrieved_docs = []
    
    topic = detect_topic(query)
    
    # 1. Topic-specific deep domain knowledge
    if topic in KNOWLEDGE_RESPONSES:
        ans = KNOWLEDGE_RESPONSES[topic].get(language, KNOWLEDGE_RESPONSES[topic]["en"])
        retrieved_docs.append(ans)
        if topic == "food":
            sources.extend(["Ministry of Food Processing Industries (MoFPI)", "FSSAI FoSCoS Guidelines"])
        elif topic == "marketing":
            sources.extend(["RuralConnect Digital Commerce Academy", "WhatsApp Business Best Practices"])
        elif topic == "pmegp":
            sources.extend(["Khadi and Village Industries Commission (KVIC)", "Ministry of MSME"])
        elif topic == "shg":
            sources.extend(["National Rural Livelihoods Mission (NRLM)", "NABARD SHG-Bank Linkage"])

    if db is not None:
        try:
            # 2. Search database knowledge base
            keywords = [w.lower() for w in re.findall(r'\w+', query) if len(w) > 2]
            if keywords:
                regex_patterns = [{"question": {"$regex": k, "$options": "i"}} for k in keywords[:4]]
                regex_patterns.extend([{"answer": {"$regex": k, "$options": "i"}} for k in keywords[:4]])
                regex_patterns.extend([{"tags": {"$in": keywords[:5]}}])
                
                kb_items = await db.knowledge_base.find({"$or": regex_patterns}).limit(3).to_list(3)
                for item in kb_items:
                    retrieved_docs.append(f"Q: {item.get('question')}\nA: {item.get('answer')}")
                    sources.append(item.get("source", "RuralConnect Knowledge Base"))
                    
            # 3. Search government schemes
            scheme_triggers = ["scheme", "yojana", "loan", "subsidy", "mudra", "pmegp", "standup", "pmfme", "योजना", "ऋण", "कर्ज", "सबसिडी", "अनुदान"]
            if any(t in query.lower() for t in scheme_triggers):
                schemes = await db.government_schemes.find({"is_verified": True}).limit(3).to_list(3)
                for s in schemes:
                    doc_str = (
                        f"**योजना / SCHEME: {s.get('scheme_name')}**\n"
                        f"• प्रवर्ग: {s.get('category')}\n"
                        f"• लाभ (Benefits): {s.get('benefits')}\n"
                        f"• पात्रता (Eligibility): {s.get('eligibility')}\n"
                        f"• कागदपत्रे (Documents): {', '.join(s.get('required_documents', []))}\n"
                        f"• अर्ज प्रक्रिया: {s.get('application_process')}\n"
                        f"• अधिकृत पोर्टल: {s.get('official_website')}"
                    )
                    retrieved_docs.append(doc_str)
                    sources.append(f"{s.get('scheme_name')} (Official Scheme)")
        except Exception as e:
            logger.warning(f"Database knowledge lookup error: {e}")

    return retrieved_docs, list(dict.fromkeys(sources))

def get_current_gemini_key() -> str:
    key = os.getenv("GEMINI_API_KEY", "")
    if not key:
        try:
            from dotenv import dotenv_values
            env_vals = dotenv_values(".env")
            key = env_vals.get("GEMINI_API_KEY", "")
        except Exception:
            pass
    return key or settings.GEMINI_API_KEY

async def call_gemini_api(prompt: str, system_instruction: str, language: str) -> Optional[str]:
    api_key = get_current_gemini_key()
    if not api_key:
        return None

    import urllib.request
    import urllib.error
    import json

    models_to_try = [
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-2.0-flash",
        "gemini-pro-latest"
    ]

    for m in models_to_try:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "systemInstruction": {"parts": [{"text": system_instruction}]},
                "generationConfig": {"temperature": 0.7}
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=4) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts and "text" in parts[0]:
                        return parts[0]["text"].strip()
        except urllib.error.HTTPError as http_err:
            # If forbidden (403) or unauthorized (401), the key has an issue; exit immediately
            if http_err.code in (401, 403):
                logger.warning(f"Gemini API authentication/permission error ({http_err.code}).")
                break
            continue
        except Exception as err:
            logger.debug(f"Gemini API model {m} attempt failed: {err}")
            continue

    return None

def generate_smart_fallback(query: str, language: str) -> str:
    q = query.lower().strip()

    # Marketing / Sales
    if any(w in q for w in ["market", "marketing", "सेल", "विक्री", "ग्राहक", "बाजारपेठ", "प्रचार"]):
        if language == "mr":
            return (
                "**मार्केटिंग म्हणजे काय आणि ग्रामीण व्यवसायासाठी त्याचे महत्त्व:**\n\n"
                "मार्केटिंग (विपणन) म्हणजे आपली उत्पादने किंवा सेवा योग्य ग्राहकांपर्यंत पोहोचवणे, त्यांचे महत्त्व पटवून देणे आणि विक्री वाढवणे होय.\n\n"
                "**ग्रामीण व नवउद्योजकांसाठी ५ प्रभावी मार्केटिंग मार्ग:**\n"
                "1. **व्हॉट्सअॅप बिझनेस (WhatsApp Business):** उत्पादनांचे फोटो, किंमत आणि वर्णनासह कॅटलॉग तयार करा आणि ग्राहकांना पाठवा.\n"
                "2. **स्थानिक आठवडे बाजार:** गावातील आठवडे बाजार, जत्रा आणि तालुक्याच्या प्रदर्शनात स्टॉल लावा.\n"
                "3. **माउथ पब्लिसिटी (तोंडाने प्रसिद्धी):** दर्जेदार उत्पादन दिल्यास स्थानिक ग्राहक स्वतःहून इतरांना शिफारस करतात.\n"
                "4. **डिजिटल पेमेंट (UPI):** PhonePe, Google Pay चे QR कोड ठेवा जेणेकरून ग्राहकांना त्वरित पेमेंट करणे सोपे होईल.\n"
                "5. **आकर्षक पॅकेजिंग व लेबल:** उत्पादनावर नाव, घटक, वजन व तारीख स्पष्ट लिहून विश्वास निर्माण करा."
            )
        elif language == "hi":
            return (
                "**मार्केटिंग (विपणन) क्या है और छोटे व्यवसायों के लिए इसके प्रमुख उपाय:**\n\n"
                "मार्केटिंग का अर्थ है अपने उत्पाद या सेवा को सही ग्राहकों तक पहुँचाना, उनकी जरूरत समझना और लगातार बिक्री बढ़ाना।\n\n"
                "**ग्रामीण उद्यमियों के लिए 5 आसान मार्केटिंग रणनीतियाँ:**\n"
                "1. **WhatsApp Business:** फोटो और मूल्य के साथ अपना डिजिटल कैटलॉग बनाएं और स्थानीय समूहों में साझा करें।\n"
                "2. **स्थानीय हाट और बाजार:** साप्ताहिक हाट-बाजारों और मेलों में अपने उत्पादों की प्रदर्शनी लगाएं।\n"
                "3. **माउथ पब्लिसिटी:** उत्पाद की अच्छी गुणवत्ता से ग्राहक खुद अन्य लोगों को आपके बारे में बताएंगे।\n"
                "4. **डिजिटल पेमेंट (UPI):** PhonePe / Google Pay QR कोड से तुरंत ऑनलाइन भुगतान स्वीकार करें।\n"
                "5. **पैकेजिंग और ब्रांडिंग:** साफ-सुथरी पैकेजिंग और लेबल्स से उत्पाद की साख और विश्वास बढ़ता है।"
            )
        else:
            return (
                "**What is Marketing & How Rural Entrepreneurs Can Master It:**\n\n"
                "Marketing is the process of identifying customer needs, creating value through your products or services, and promoting them to build customer loyalty and drive sustainable sales.\n\n"
                "**5 Practical Marketing Steps for Rural & Small Businesses:**\n"
                "1. **WhatsApp Business Catalog:** Showcase your products with high-quality photos, clear pricing, and descriptions.\n"
                "2. **Direct Community Selling:** Participate in local weekly village haats, farmer markets, and regional fairs.\n"
                "3. **Word-of-Mouth Referrals:** Exceptional product quality and honest pricing turn existing customers into ambassadors.\n"
                "4. **Digital Payments (UPI):** Enable instant payments via PhonePe/Google Pay QR codes for quick transactions.\n"
                "5. **Clean Branding & Packaging:** Food-grade or attractive packaging with clear ingredients builds customer trust."
            )

    # Food Processing
    if any(w in q for w in ["food", "लोणचे", "पापड", "मसाले", "खाद्य", "अन्न", "fssai"]):
        return KNOWLEDGE_RESPONSES["food"].get(language, KNOWLEDGE_RESPONSES["food"]["en"])

    # Schemes & Loans
    if any(w in q for w in ["loan", "subsidy", "pmegp", "mudra", "कर्ज", "अनुदान", "योजना"]):
        return KNOWLEDGE_RESPONSES["pmegp"].get(language, KNOWLEDGE_RESPONSES["pmegp"]["en"])

    # Self-Help Groups (SHG)
    if any(w in q for w in ["shg", "bachat", "बचत गट", "समूह"]):
        return KNOWLEDGE_RESPONSES["shg"].get(language, KNOWLEDGE_RESPONSES["shg"]["en"])

    # Generic Business / Any other questions
    if language == "mr":
        return (
            f"**'{query}' या विषयावर व्यावसायिक मार्गदर्शन:**\n\n"
            "ग्रामीण भागात कोणत्याही नवीन उपक्रमासाठी खालील गोष्टी अत्यंत उपयुक्त ठरतात:\n"
            "1. **स्थानिक मागणीचा अभ्यास:** ग्राहकांच्या नेमक्या गरजा आणि उपलब्ध पर्यायांचा शोध घ्या.\n"
            "2. **कमी भांडवलाने चाचणी:** सुरुवातीला छोट्या प्रमाणावर सुरुवात करून अनुभव घ्या.\n"
            "3. **शासकीय पाठबळ:** PMEGP (३५% सबसिडी), मुद्रा योजना किंवा बचत गट कर्जाचा लाभ घ्या.\n"
            "4. **पारदर्शक हिशोब:** दररोजचा खर्च व नफ्याची नोंद स्वतंत्र वहीत ठेवा."
        )
    elif language == "hi":
        return (
            f"**'{query}' के संदर्भ में व्यावसायिक मार्गदर्शन:**\n\n"
            "ग्रामीण व छोटे उद्यमियों के लिए किसी भी नए कार्य की सफलता के मुख्य चरण:\n"
            "1. **मांग और आवश्यकता समझें:** अपने गाँव या कस्बे में ग्राहकों की वास्तविक जरूरत पहचानें।\n"
            "2. **कम बजट में शुरुआत:** बिना बड़ा जोखिम लिए छोटे स्तर पर उत्पादन और सेवाएं शुरू करें।\n"
            "3. **सरकारी योजनाओं का लाभ:** PMEGP 35% सब्सिडी अथवा मुद्रा योजना का उपयोग करें।\n"
            "4. **लेखा-जोखा और अनुशासन:** दैनिक बिक्री और खर्चे का नियमित हिसाब रखें।"
        )
    else:
        return (
            f"**Comprehensive Guidance on '{query}':**\n\n"
            "To successfully approach this topic or build your venture:\n"
            "1. **Understand Market Demand:** Identify specific pain points and customer requirements in your target market.\n"
            "2. **Start Lean:** Keep initial capital costs minimal to test your idea before major investments.\n"
            "3. **Leverage Support Programs:** Explore relevant subsidies and low-interest micro-loans (such as PMEGP, Mudra, or NRLM).\n"
            "4. **Adopt Digital Tools:** Use WhatsApp Business for customer communication and UPI for payment convenience.\n"
            "5. **Maintain Financial Discipline:** Keep accurate records of operational expenses, inventory, and net profits."
        )

async def generate_rag_answer(query: str, language: str = "en") -> Tuple[str, List[str]]:
    retrieved_docs, sources = await search_verified_knowledge(query, language)

    system_instruction = (
        "You are RuralConnect AI, a knowledgeable, encouraging, and highly practical business advisor for Indian rural entrepreneurs and founders. "
        "Answer the user's question clearly, thoroughly, and directly. "
        f"Respond strictly in {language.upper()} (Hindi if 'hi', Marathi if 'mr', English if 'en'). "
        "Provide actionable steps, real-world examples, and structured bullet points when helpful. "
        "If the question is about business, marketing, finance, or government schemes, provide authoritative rural context."
    )

    context_text = "\n\n---\n\n".join(retrieved_docs) if retrieved_docs else ""
    prompt = f"RELEVANT VERIFIED CONTEXT (if applicable):\n{context_text}\n\nUSER QUESTION:\n{query}" if context_text else query

    gemini_reply = await call_gemini_api(prompt, system_instruction, language)
    if gemini_reply:
        all_sources = sources if sources else ["Gemini Generative AI", "RuralConnect Knowledge Base"]
        return gemini_reply, all_sources

    smart_reply = generate_smart_fallback(query, language)
    all_sources = sources if sources else ["RuralConnect Verified Business Advisory"]
    return smart_reply, all_sources

