# -*- coding: utf-8 -*-
"""
Script to build the 72 Core Knowledge Base records for RuralConnect.
"""
import json

ITEMS = [
    # CATEGORY 1 — AGRICULTURE & FARMING (1 - 10)
    {
        "id": "kb-01",
        "title": "Starting Small-Scale Farming",
        "category": "Agriculture & Farming",
        "question_en": "How can I start a small farming business with limited money?",
        "answer_en": "To start a small farming business with limited funds:\n1. Start on leased or family land (0.5 to 1 acre) to avoid high land purchase costs.\n2. Choose short-duration, high-demand cash crops like leafy vegetables (spinach, coriander) or mushrooms.\n3. Make your own organic inputs like Jeevamrut and vermicompost to reduce fertilizer costs.\n4. Share farm tools and irrigation equipment with neighboring farmers.\n5. Sell directly in weekly village markets (haats) or nearby colonies to get full retail profit without middlemen.",
        "question_hi": "कम पैसों में छोटा खेती का व्यवसाय कैसे शुरू करें?",
        "answer_hi": "कम पूंजी में छोटा कृषि व्यवसाय शुरू करने के आसान उपाय:\n1. शुरुआत 0.5 से 1 एकड़ पैतृक या पट्टे की जमीन से करें ताकि जमीन खरीदने का बड़ा खर्च न हो।\n2. कम समय में तैयार होने वाली हरी सब्जियां (धनिया, पालक) या मशरूम जैसी फसलें चुनें।\n3. खाद का खर्च घटाने के लिए घर पर जीवामृत और वर्मीकम्पोस्ट तैयार करें।\n4. पड़ोसी किसानों के साथ कृषि उपकरण और सिंचाई पंप साझा करें।\n5. बिचौलियों से बचकर सीधे स्थानीय साप्ताहिक हाट या पास की कॉलोनियों में बेचें ताकि पूरा मुनाफा आपको मिले।",
        "question_mr": "कमी पैशात शेतीचा छोटा व्यवसाय कसा सुरू करावा?",
        "answer_mr": "कमी भांडवलात शेतीचा व्यवसाय सुरू करण्यासाठी उपयुक्त पावले:\n1. सुरुवातीला स्वतःच्या किंवा भाडेतत्त्वावरील ०.५ ते १ एकर जमिनीवर काम सुरू करा.\n2. कोथिंबीर, मेथी, पालक यांसारखी कमी कालावधीत रोख पैसे देणारी भाजीपाला पिके निवडा.\n3. खतांचा खर्च कमी करण्यासाठी जीवामृत आणि गांडूळ खत स्वतः तयार करा.\n4. शेतीची अवजारे आणि पाण्याचे पंप शेजारील शेतकऱ्यांसोबत मिळून वापरा.\n5. दलालांना न देता आठवडे बाजार किंवा थेट ग्राहकांना भाजीपाला विकून चांगला नफा मिळवा.",
        "source": "ICAR - Indian Council of Agricultural Research Guidelines",
        "tags": ["small farming", "farming business", "low investment", "खेती व्यवसाय", "शेती व्यवसाय", "kheti shuru", "sheti kashi karavi"]
    },
    {
        "id": "kb-02",
        "title": "Choosing a Crop",
        "category": "Agriculture & Farming",
        "question_en": "How should I choose which crop to grow?",
        "answer_en": "Choose the right crop by checking four practical factors:\n1. Soil and Water Availability: Check your soil type (black, red, sandy) and ensure you have sufficient water for the entire crop cycle.\n2. Local Market Demand: Check what local towns and markets buy consistently at good prices.\n3. Climate and Season: Select crops suited to your agro-climatic zone and season (Kharif, Rabi, or Zaid).\n4. Perishability and Transport: If your transport facilities are limited, choose crops with longer storage life (like onions, pulses, turmeric) rather than delicate vegetables.",
        "question_hi": "मुझे कौन सी फसल उगानी चाहिए, इसका चुनाव कैसे करें?",
        "answer_hi": "सही फसल चुनने के लिए 4 मुख्य बातों पर ध्यान दें:\n1. मिट्टी और पानी की उपलब्धता: अपनी मिट्टी की जांच करें और देखें कि फसल के पूरे चक्र के लिए पर्याप्त पानी उपलब्ध है या नहीं।\n2. स्थानीय बाजार की मांग: देखें कि नजदीकी मंडी या कस्बे में किस उपज की नियमित मांग और अच्छा भाव रहता है।\n3. मौसम और जलवायु: मौसम (खरीफ, रबी, जायद) और अपने क्षेत्र की जलवायु के अनुकूल फसल ही चुनें।\n4. परिवहन और भंडारण: यदि दूर बाजार ले जाने के साधन कम हैं, तो जल्दी खराब न होने वाली फसलें (जैसे प्याज, दालें, हल्दी) चुनें।",
        "question_mr": "कोणते पीक घ्यावे हे कसे ठरवावे?",
        "answer_mr": "योग्य पिकाची निवड करताना खालील ४ बाबींचा विचार करा:\n1. माती आणि पाण्याची उपलब्धता: आपल्या जमिनीचा पोत तपासा आणि पिकाच्या संपूर्ण कालावधीसाठी मुबलक पाणी उपलब्ध असल्याची खात्री करा.\n2. स्थानिक बाजारातील मागणी: जवळच्या बाजारात किंवा शहरात कोणत्या शेतमालाला सतत चांगला भाव मिळतो ते पाहा.\n3. हवामान व हंगाम: आपल्या भागातील हवामान आणि चालू हंगामानुसार (खरीप, रब्बी किंवा उन्हाळी) योग्य पीक निवडा.\n4. वाहतूक आणि साठवणूक: वाहतुकीची सोय मर्यादित असल्यास लवकर खराब न होणारी पिके (उदा. कांदा, कडधान्ये, हळद) निवडा.",
        "source": "Ministry of Agriculture & Farmers Welfare Advisory",
        "tags": ["crop selection", "choosing crop", "फसल चुनाव", "पीक निवड", "fasal kaise chune", "peak nivad"]
    },
    {
        "id": "kb-03",
        "title": "Soil Testing",
        "category": "Agriculture & Farming",
        "question_en": "Why should I test my soil before farming?",
        "answer_en": "Soil testing is essential because:\n1. It reveals the exact fertility and pH level of your soil.\n2. It tells you which nutrients (Nitrogen, Phosphorus, Potassium, micronutrients) are lacking or excess.\n3. It prevents over-spending on chemical fertilizers that you may not actually need.\n4. You can get a Soil Health Card from your nearest Krishi Vigyan Kendra (KVK) or government agriculture office at a nominal fee or free under the Soil Health Card Scheme.",
        "question_hi": "खेती करने से पहले मिट्टी की जांच (मृदा परीक्षण) क्यों करानी चाहिए?",
        "answer_hi": "मिट्टी परीक्षण कराने के मुख्य लाभ:\n1. यह आपकी मिट्टी की उपजाऊ क्षमता और पीएच (pH) मान की सही जानकारी देता है।\n2. यह बताता है कि मिट्टी में नाइट्रोजन, फास्फोरस, पोटाश और सूक्ष्म पोषक तत्वों की क्या स्थिति है।\n3. इससे गैर-जरूरी रासायनिक खादों पर होने वाला भारी खर्च बचता है।\n4. आप अपने नजदीकी कृषि विज्ञान केंद्र (KVK) या कृषि कार्यालय से 'सॉइल हेल्थ कार्ड' बहुत कम शुल्क या मुफ्त में बनवा सकते हैं।",
        "question_mr": "शेती करण्यापूर्वी माती परीक्षण का करावे?",
        "answer_mr": "माती परीक्षण करण्याचे महत्त्वाचे फायदे:\n1. जमिनीची सुपिकता आणि सामू (pH) नेमका किती आहे हे अचूक समजते.\n2. जमिनीत नत्र, स्फुरद, पालाश आणि सूक्ष्म अन्नद्रव्यांची कमतरता किंवा प्रमाण स्पष्ट होते.\n3. नको असलेल्या रासायनिक खतांवर होणारा वायफळ खर्च वाचतो.\n4. जवळच्या कृषी विज्ञान केंद्रात (KVK) किंवा तालुका कृषी कार्यालयात सॉइल हेल्थ कार्ड योजनेअंतर्गत माती परीक्षण करून मिळते.",
        "source": "National Soil Health Card Scheme (soilhealth.dac.gov.in)",
        "tags": ["soil testing", "soil health card", "मिट्टी जांच", "माती परीक्षण", "soil test", "mati parikshan", "mitti ki janch"]
    },
    {
        "id": "kb-04",
        "title": "Drip Irrigation",
        "category": "Agriculture & Farming",
        "question_en": "What is drip irrigation and why is it useful?",
        "answer_en": "Drip irrigation is a micro-irrigation method that delivers water directly to the plant root zone drop by drop through plastic pipes and emitters.\nBenefits:\n1. Saves 40% to 70% of irrigation water compared to flood irrigation.\n2. Reduces weed growth because the space between plants remains dry.\n3. Allows fertilizer application through water (fertigation), boosting crop yields by 20% to 50%.\n4. Farmers can avail 50% to 80% government subsidy under PM Krishi Sinchayee Yojana (Per Drop More Crop).",
        "question_hi": "ड्रिप सिंचाई (टपक सिंचाई) क्या है और यह क्यों उपयोगी है?",
        "answer_hi": "ड्रिप सिंचाई (टपक सिंचाई) में पानी पाइप और ड्रिपर्स के माध्यम से बूंद-बूंद करके सीधे पौधों की जड़ों में पहुंचाया जाता है।\nउपयोगिता और फायदे:\n1. पारंपरिक सिंचाई की तुलना में 40% से 70% तक पानी की बचत होती है।\n2. खाली जमीन पर पानी न गिरने से खरपतवार (घास-फूंस) बहुत कम उगते हैं।\n3. पानी के साथ खाद देने (फर्टिगेशन) से फसल की पैदावार 20% से 50% तक बढ़ जाती है।\n4. पीएम कृषि सिंचाई योजना (प्रति बूंद अधिक फसल) के तहत किसानों को 50% से 80% तक सरकारी सब्सिडी मिलती है।",
        "question_mr": "ठिबक सिंचन म्हणजे काय आणि ते का उपयुक्त आहे?",
        "answer_mr": "ठिबक सिंचन पद्धतीत प्लास्टिकच्या नळ्यांद्वारे थेंब-थेंब पाणी थेट पिकांच्या मुळाशी दिले जाते.\nफायदे:\n1. पारंपारिक पद्धतीपेक्षा ४०% ते ७०% पाण्याची बचत होते.\n2. पिकांच्या मधली जागा कोरडी राहत असल्याने तणांची वाढ खूप कमी होते.\n3. पाण्यासोबत विद्राव्य खते देता येत असल्याने (फर्टिगेशन) उत्पादनात २०% ते ५०% वाढ होते.\n4. प्रधानमंत्री कृषी सिंचाई योजनेअंतर्गत (PMKSY) ठिबक संचावर ५०% ते ८०% पर्यंत शासकीय अनुदान मिळते.",
        "source": "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
        "tags": ["drip irrigation", "micro irrigation", "ड्रिप सिंचाई", "ठिबक सिंचन", "drip subsidy", "thibak sinchan"]
    },
    {
        "id": "kb-05",
        "title": "Organic Farming",
        "category": "Agriculture & Farming",
        "question_en": "What is organic farming?",
        "answer_en": "Organic farming is an agricultural method that avoids synthetic chemical fertilizers, pesticides, and GMOs. It relies on natural processes, crop rotation, green manures, compost, and biological pest control.\nKey Practices:\n1. Enrich soil with cow dung, vermicompost, and Jeevamrut.\n2. Use botanical sprays like Neem oil, Dashaparni ark, or sour buttermilk to control pests.\n3. Practice multi-cropping and crop rotation to maintain natural ecological balance.\n4. Certified organic produce often fetches 20% to 40% higher prices in urban markets.",
        "question_hi": "जैविक खेती (ऑर्गेनिक फार्मिंग) क्या है?",
        "answer_hi": "जैविक खेती कृषि की वह पद्धति है जिसमें रासायनिक खादों, जहरीले कीटनाशकों और हाइब्रिड रसायनों का उपयोग नहीं किया जाता। यह प्रकृति के नियमों पर आधारित होती है।\nमुख्य बातें:\n1. मिट्टी को उपजाऊ बनाने के लिए गोबर खाद, वर्मीकम्पोस्ट और जीवामृत का उपयोग किया जाता है।\n2. कीट नियंत्रण के लिए नीम तेल, दशपर्णी अर्क या छाछ के घोल का छिड़काव होता है।\n3. फसल चक्र और मिश्रित खेती से मिट्टी की उर्वरता बनी रहती है।\n4. प्रमाणित जैविक उपज को शहरी बाजारों में 20% से 40% तक अधिक कीमत मिलती है।",
        "question_mr": "सेंद्रिय शेती म्हणजे काय?",
        "answer_mr": "सेंद्रिय शेती म्हणजे रासायनिक खते, विषारी कीटकनाशके आणि रसायनांचा वापर न करता नैसर्गिक पद्धतीने केली जाणारी शेती.\nप्रमुख पद्धती:\n1. शेणखत, गांडूळ खत आणि जिवामृताचा वापर करून जमिनीची सुपीकता वाढवली जाते.\n2. किडींच्या नियंत्रणासाठी निंबोळी अर्क, दशपर्णी अर्क किंवा ताकाचा वापर केला जातो.\n3. आंतरपिके व पिकांची फेरपालट करून जमिनीचा कस टिकवून ठेवला जातो.\n4. सेंद्रिय प्रमाणीकरण असलेल्या शेतमालाला शहरात २०% ते ४०% जास्त भाव मिळतो.",
        "source": "Paramparagat Krishi Vikas Yojana (PKVY) - MoA&FW",
        "tags": ["organic farming", "जैविक खेती", "सेंद्रिय शेती", "jeevamrut", "sendriya sheti", "jaivik kheti"]
    },
    {
        "id": "kb-06",
        "title": "Vegetable Farming",
        "category": "Agriculture & Farming",
        "question_en": "How can I start a vegetable farming business?",
        "answer_en": "To start a successful commercial vegetable farming venture:\n1. Choose high-yield seasonal vegetables (tomatoes, chillies, okra, gourds, leafy greens) that have steady local demand.\n2. Prepare raised nursery beds or use pro-trays with coco-peat to grow healthy, disease-free seedlings.\n3. Use drip irrigation and plastic mulching sheet to conserve moisture and suppress weeds.\n4. Plan staggered sowing (planting every 15-20 days) so you get regular harvest and income rather than a single bulk harvest.\n5. Harvest early in the morning and pack in clean plastic crates for transport to mandi or direct retail.",
        "question_hi": "सब्जी की खेती का व्यवसाय कैसे शुरू करें?",
        "answer_hi": "व्यावसायिक सब्जी उत्पादन शुरू करने के जरूरी चरण:\n1. ऐसी मौसमी सब्जियां चुनें जिनकी बाजार में अच्छी मांग हो (जैसे टमाटर, मिर्च, भिंडी, लौकी और हरी पत्तेदार सब्जियां)।\n2. स्वस्थ पौध तैयार करने के लिए कोकोपीट और प्रो-ट्रे का उपयोग करें।\n3. नमी बनाए रखने और खरपतवार रोकने के लिए ड्रिप सिंचाई और मल्चिंग पेपर का प्रयोग करें।\n4. हर 15-20 दिन के अंतराल पर चरणबद्ध बुआई करें ताकि हर हफ्ते ताजी उपज मिले और आमदनी नियमित रहे।\n5. सुबह जल्दी तुड़ाई करें और उपज को साफ क्रेट में भरकर स्थानीय मंडी या ग्राहकों तक पहुंचाएं।",
        "question_mr": "भाजीपाला शेती व्यवसाय कसा सुरू करावा?",
        "answer_mr": "व्यावसायिक भाजीपाला शेती सुरू करण्यासाठी महत्त्वाच्या पायऱ्या:\n1. स्थानिक बाजारात सतत मागणी असणाऱ्या भाज्या (टोमॅटो, मिरची, भेंडी, कारली, पालेभाज्या) निवडा.\n2. दर्जेदार रोपे तयार करण्यासाठी कोकोपीट आणि प्रो-ट्रे वापरून नर्सरी तयार करा.\n3. पाण्याचे व्यवस्थापन आणि तण नियंत्रणासाठी ठिबक सिंचन व मल्चिंग पेपरचा वापर करा.\n4. दर १५-२० दिवसांच्या अंतराने टप्प्याटप्प्याने लागवड करा, ज्यामुळे वर्षभर नियमित उत्पन्न सुरू राहील.\n5. सकाळी लवकर काढणी करून स्वच्छ क्रेट्समध्ये पॅक करून थेट आठवडे बाजारात किंवा ग्राहकांपर्यंत पोहोचवा.",
        "source": "National Horticulture Mission (NHM)",
        "tags": ["vegetable farming", "commercial farming", "सब्जी की खेती", "भाजीपाला शेती", "sabzi business", "bhajipala sheti"]
    },
    {
        "id": "kb-07",
        "title": "Selling Farm Products",
        "category": "Agriculture & Farming",
        "question_en": "Where can I sell my farm products?",
        "answer_en": "You can sell farm products across multiple profitable channels:\n1. Local APMC Mandis: For bulk produce through registered commission agents.\n2. Farmer Markets (Rythu Bazaars / Shetkari Athavadi Aathavadi): Direct selling to consumers at retail rates without paying commission.\n3. Farmer Producer Companies (FPC): Join or form an FPC to aggregate produce and supply directly to supermarkets or food processors.\n4. WhatsApp & Hyperlocal Delivery: Pre-book vegetable baskets for apartment complexes in nearby towns.\n5. e-NAM Portal (enam.gov.in): Transparent online pan-India auction system for competitive bidding.",
        "question_hi": "मैं अपनी कृषि उपज (शेतमाल) कहाँ और कैसे बेच सकता हूँ?",
        "answer_hi": "कृषि उपज बेचने के मुख्य लाभकारी माध्यम:\n1. स्थानीय एपीएमसी मंडी: बड़े पैमाने पर उपज को पंजीकृत आढ़तियों के माध्यम से बेचना।\n2. किसान साप्ताहिक बाजार (शेतकरी आठवडे बाजार): सीधे उपभोक्ताओं को खुदरा भाव पर बेचना जिससे बिचौलियों का कमीशन बचता है।\n3. किसान उत्पादक कंपनी (FPC): एफपीसी से जुड़कर सुपरमार्केट्स और फूड प्रोसेसिंग कंपनियों को सीधे थोक माल सप्लाई करें।\n4. व्हाट्सएप और हाउसिंग सोसाइटियां: नजदीकी शहर की सोसाइटियों में ताजी सब्जियों के बास्केट प्री-बुक करवाएं।\n5. ई-नाम (e-NAM) पोर्टल: भारत सरकार के ऑनलाइन प्लेटफॉर्म पर देश भर के खरीदारों को अच्छी कीमत पर उपज बेचें।",
        "question_mr": "शेतमाल कुठे आणि कसा विकावा?",
        "answer_mr": "शेतमालाच्या फायदेशीर विक्रीसाठी प्रमुख पर्याय:\n1. स्थानिक कृषी उत्पन्न बाजार समिती (APMC): मोठ्या प्रमाणातील मालाची लिलावाद्वारे विक्री.\n2. शेतकरी आठवडे बाजार: थेट ग्राहकांना किरकोळ दराने शेतमाल विकून मध्यस्थांचे कमिशन वाचवा.\n3. शेतकरी उत्पादक कंपनी (FPC): FPC च्या माध्यमातून एकत्र येऊन थेट सुपरमार्केट आणि मॉलना पुरवठा करा.\n4. व्हॉट्सअॅप व सोसायट्यांमध्ये थेट विक्री: जवळच्या शहरातील गृहनिर्माण सोसायट्यांमध्ये भाजीपाल्याचे बास्केट घरपोच द्या.\n5. ई-नाम (e-NAM) राष्ट्रीय पोर्टल: ऑनलाइन राष्ट्रीय बाजारपेठेत उत्तम भावाने मालाची विक्री करा.",
        "source": "National Agriculture Market (e-NAM) - enam.gov.in",
        "tags": ["selling farm products", "mandi", "enam", "कृषि उपज बिक्री", "शेतमाल विक्री", "kahan beche", "kuthe vikava"]
    },
    {
        "id": "kb-08",
        "title": "Farm Record Keeping",
        "category": "Agriculture & Farming",
        "question_en": "What records should a farmer maintain?",
        "answer_en": "Every commercial farmer should maintain these basic records in a dedicated register or phone app:\n1. Input Expenses: Date, quantity, and cost of seeds, fertilizers, pesticides, diesel, and electricity.\n2. Labor Log: Daily labor hired, hours worked, and wages paid.\n3. Field Operations: Sowing date, spray dates, irrigation dates, and fertilizer application dates.\n4. Harvest & Yield Log: Total weight harvested per acre and grade breakdown.\n5. Sales & Revenue Log: Quantity sold, rate per kg/quintal, buyer name, transportation cost, and net payment received.",
        "question_hi": "एक किसान को अपने खेत के कौन से रिकॉर्ड और हिसाब-किताब रखने चाहिए?",
        "answer_hi": "किसानों को अपनी डायरी या मोबाइल ऐप में निम्नलिखित मुख्य रिकॉर्ड रखने चाहिए:\n1. लागत खर्च: बीज, खाद, कीटनाशक, डीजल और मजदूरी पर खर्च की गई रकम और तारीख।\n2. दैनिक मजदूरी रजिस्टर: कितने मजदूर लगे और उन्हें क्या भुगतान किया गया।\n3. कृषि कार्य विवरण: बुआई की तारीख, खाद देने और कीटनाशक छिड़काव की तारीखें।\n4. कुल उत्पादन का हिसाब: प्रति एकड़ कितनी उपज (क्विंटल/किलो) प्राप्त हुई।\n5. बिक्री और आय: उपज की मात्रा, प्रति किलो भाव, खरीदार का नाम, भाड़ा खर्च और कुल शुद्ध बचत।",
        "question_mr": "शेतकऱ्यांनी शेतातील कोणते हिशोब आणि नोंदी ठेवाव्यात?",
        "answer_mr": "शेतकऱ्यांनी स्वतंत्र नोंदवहीत किंवा मोबाईल अ‍ॅपमध्ये खालील नोंदी ठेवाव्यात:\n1. उत्पादन खर्च: बियाणे, खते, औषधे, डिझेल आणि मजुरीचा प्रत्येक तारखेनुसार खर्च.\n2. मजुरी नोंद: रोज कामावर लावलेले मजूर, कामाचे तास आणि दिलेली मजुरी.\n3. शेती मशागत नोंदी: पेरणीची तारीख, खते दिल्याची वेळ, फवारणीच्या तारखा आणि पाणी दिल्याचे दिवस.\n4. उत्पादन नोंद: एकरी मिळालेले एकूण उत्पादन (क्विंटल/किलोमध्ये).\n5. विक्री व नफा नोंद: विकलेला माल, मिळालेला दर, वाहतूक खर्च व हातात आलेली प्रत्यक्ष रक्कम.",
        "source": "ICAR Farmer Extension Services",
        "tags": ["farm records", "farm bookkeeping", "खेती का हिसाब", "शेतीचा हिशोब", "record keeping", "hishob"]
    },
    {
        "id": "kb-09",
        "title": "Crop Storage",
        "category": "Agriculture & Farming",
        "question_en": "How can I reduce losses after harvesting?",
        "answer_en": "To minimize post-harvest crop losses:\n1. Proper Drying: Dry grains, pulses, and oilseeds until moisture is under 10-12% before storage.\n2. Hermetic Bags: Store grains in multi-layer airtight bags (like SuperGrainbags) to eliminate insects without toxic chemicals.\n3. Proper Ventilation: Store perishables like onions and potatoes in aerated raised bamboo/slatted platforms (chawl system).\n4. Cold Storage & Warehouses: Use WDRA-registered godowns to store produce safely and obtain warehouse receipt loans (e-NWR) against stored crops.",
        "question_hi": "फसल कटाई के बाद होने वाले नुकसान (पोस्ट-हार्वेस्ट लॉस) को कैसे कम करें?",
        "answer_hi": "फसल की कटाई के बाद नुकसान रोकने के प्रमुख उपाय:\n1. सही सुखाना: अनाज और दलहन को भंडारण से पहले अच्छी तरह सुखाएं ताकि नमी 10-12% से कम रहे।\n2. एयरटाइट बैग (हर्मेटिक बैग): अनाज को सुरक्षित रखने के लिए बिना रसायनों वाले हर्मेटिक बैग का प्रयोग करें जिससे घुन और कीड़े नहीं लगते।\n3. हवादार भंडारण: प्याज और आलू को जमीन पर रखने के बजाय हवादार चाळ या जालीदार रैक पर रखें।\n4. सरकारी गोदाम व कोल्ड स्टोरेज: WDRA पंजीकृत गोदामों में माल रखकर सुरक्षित करें और गोदाम रसीद (e-NWR) पर बैंक से कम ब्याज पर ऋण लें।",
        "question_mr": "कापणीनंतर शेतमालाचे नुकसान कसे टाळावे?",
        "answer_mr": "कापणीनंतर शेतमालाचे नुकसान कमी करण्याचे उपाय:\n1. योग्य वाळवणे: धान्य आणि कडधान्ये साठवण्यापूर्वी त्यातील ओलावा १०-१२% पेक्षा कमी होईपर्यंत नीट वाळवा.\n2. हवाबंद बॅग्ज (हर्मेटिक बॅग्ज): धान्याला कीड लागू नये म्हणून हवाबंद बॅग्ज वापरा, ज्यामुळे रासायनिक गोळ्यांची गरज पडत नाही.\n3. कांदा चाळ व हवादार जागा: कांदा व बटाटा साठवण्यासाठी जमिनीपासून उंचावर हवा खेळती राहणारी कांदा चाळ पद्धत वापरा.\n4. वेअरहाऊस व कोल्ड स्टोरेज: मालाची साठवणूक शासकीय मान्यताप्राप्त गोदामात करा आणि वखार पावतीवर (e-NWR) बँकेकडून अल्पदराने कर्ज मिळवा.",
        "source": "Warehousing Development and Regulatory Authority (WDRA)",
        "tags": ["crop storage", "post harvest loss", "फसल भंडारण", "शेतमाल साठवणूक", "kanda chawl", "godown"]
    },
    {
        "id": "kb-10",
        "title": "Farm Business Planning",
        "category": "Agriculture & Farming",
        "question_en": "How can I make a business plan for my farm?",
        "answer_en": "A clear farm business plan contains five simple sections:\n1. Resource Assessment: Land area, soil type, water source, machinery, and available capital.\n2. Crop Strategy: Which crops to plant in Kharif, Rabi, and summer seasons based on soil and market demand.\n3. Cost Budget: Estimated expenses for seeds, inputs, labor, electricity, packaging, and transport.\n4. Revenue Projection: Expected yield per acre multiplied by realistic minimum selling price.\n5. Risk & Contingency Plan: Crop insurance (PM Fasal Bima Yojana) and pest contingency fund.",
        "question_hi": "अपने खेत के लिए एक व्यावसायिक योजना (Farm Business Plan) कैसे बनाएं?",
        "answer_hi": "खेत के लिए एक सरल और व्यावहारिक बिजनेस प्लान बनाने के 5 चरण:\n1. संसाधनों का मूल्यांकन: उपलब्ध जमीन, मिट्टी की स्थिति, पानी के साधन, औजार और उपलब्ध बजट।\n2. फसल चक्र योजना: खरीफ, रबी और जायद में कौन-सी फसलें लगानी हैं, इसकी पूर्व तैयारी।\n3. लागत बजट: बीज, खाद, कीटनाशक, जुताई, मजदूरी और ढुलाई का अनुमानित खर्च।\n4. संभावित आय का अनुमान: प्रति एकड़ अपेक्षित उत्पादन को न्यूनतम बाजार दर से गुणा कर आय की गणना।\n5. जोखिम प्रबंधन: प्राकृतिक आपदा से सुरक्षा के लिए पीएम फसल बीमा योजना (PMFBY) का सहारा लें।",
        "question_mr": "शेतीचा बिझनेस प्लॅन (नियोजन) कसा तयार करावा?",
        "answer_mr": "शेतीचा यशस्वी बिझनेस प्लॅन तयार करण्यासाठी ५ प्रमुख टप्पे:\n1. उपलब्ध साधनांची पाहणी: शेतजमीन, मातीचा प्रकार, पाण्याचे स्रोत, अवजारे आणि हातात असणारे भांडवल.\n2. पीक फेरपालट आराखडा: खरीप, रब्बी आणि उन्हाळी हंगामात कोणती पिके फायदेशीर ठरतील याचे नियोजन.\n3. संभाव्य खर्च पत्रक: बियाणे, खते, औषधे, मजुरी आणि वाहतुकीवर होणाऱ्या खर्चाचा अंदाज.\n4. अपेक्षित उत्पन्न पत्रक: एकरी अपेक्षित उत्पादन आणि बाजारातील सरासरी दर यांचा गुणाकार करून निव्वळ नफ्याचा अंदाज.\n5. जोखीम व्यवस्थापन: अवकाळी पाऊस किंवा दुष्काळापासून संरक्षणासाठी प्रधानमंत्री पीक विमा योजना (PMFBY) उतरवणे.",
        "source": "NABARD Farm Sector Development Guidelines",
        "tags": ["farm business plan", "farm planning", "खेती बिजनेस प्लान", "शेती नियोजन", "sheti plan"]
    },

    # CATEGORY 2 — DAIRY & LIVESTOCK (11 - 14)
    {
        "id": "kb-11",
        "title": "Starting a Dairy Business",
        "category": "Dairy & Livestock",
        "question_en": "What should I consider before starting a small dairy business?",
        "answer_en": "Key factors before starting a dairy venture:\n1. Start Small: Begin with 2 to 4 high-yielding healthy cows (like Gir, Sahiwal, HF cross) or Murrah buffaloes.\n2. Fodder Security: Ensure at least 0.5 acre of land per 2-3 cows dedicated to green fodder (Napier grass, lucerne, silage).\n3. Clean, Ventilated Shed: High-roofed, dry shed with clean drainage and continuous fresh drinking water.\n4. Milk Offtake: Secure an assured daily buyer (dairy cooperative like Amul/Mahanand, local hotels, or direct households).\n5. Subsidy Support: Explore the Animal Husbandry Infrastructure Development Fund (AHIDF) and NABARD dairy loan schemes.",
        "question_hi": "छोटा डेयरी व्यवसाय शुरू करने से पहले किन बातों का ध्यान रखना चाहिए?",
        "answer_hi": "डेयरी व्यवसाय शुरू करने से पहले 5 जरूरी बातें:\n1. छोटे स्तर से शुरुआत: शुरुआत में 2 से 4 अच्छी नस्ल की गाय (जैसे गिर, साहीवाल, एचएफ क्रॉस) या मुर्रा भैंस से काम शुरू करें।\n2. हरे चारे की व्यवस्था: 2-3 पशुओं के लिए कम से कम 0.5 एकड़ जमीन में नेपियर या बरसीम जैसे हरे चारे की पुख्ता व्यवस्था हो।\n3. हवादार और सूखा शेड: शेड में ताजी हवा, पानी की निकासी और हर समय साफ पीने का पानी उपलब्ध होना चाहिए।\n4. दूध की बिक्री का बाजार: दूध बेचने के लिए अमूल जैसी सहकारी डेयरी, मिठाई की दुकान या स्थानीय घरों से पहले ही बात कर लें।\n5. सरकारी योजनाएं: नाबार्ड (NABARD) और पशुपालन विभाग की डेयरी सब्सिडी योजनाओं की जानकारी लें।",
        "question_mr": "छोटा दुग्ध व्यवसाय (डेअरी) सुरू करताना कोणती काळजी घ्यावी?",
        "answer_mr": "दुग्ध व्यवसाय सुरू करण्यापूर्वी लक्षात घ्यावयाच्या ५ बाबी:\n1. छोट्या प्रमाणावर सुरुवात: सुरुवातीला २ ते ४ चांगल्या जातीच्या गाई (गीर, साहिवाल, एचएफ क्रॉस) किंवा मुऱ्हा म्हशींनी सुरुवात करा.\n2. चारा नियोजन: २-३ जनावरांसाठी किमान अर्धा एकर हक्काचा हिरवा चारा (नेपियर गवत, लसूण घास किंवा मुरघास) उपलब्ध असावा.\n3. हवेशीर गोठा: गोठ्यात भरपूर हवा, सूर्यप्रकाश, पाण्याचा निचरा आणि जनावरांना पिण्यासाठी २४ तास स्वच्छ पाणी हवे.\n4. खात्रीशीर दूध विक्री: दुधासाठी स्थानिक दूध डेअरी (महानंद, अमूल इ.) किंवा गावात/शहरात थेट घरपोच ग्राहक निश्चित करा.\n5. शासकीय अनुदान: नाबार्ड आणि पशुसंवर्धन विभागाच्या दुग्ध व्यवसाय योजनांचा लाभ घ्या.",
        "source": "National Dairy Development Board (NDDB)",
        "tags": ["starting dairy", "dairy business", "डेयरी व्यवसाय", "दुग्ध व्यवसाय", "doodh business", "dairy farming"]
    },
    {
        "id": "kb-12",
        "title": "Animal Health",
        "category": "Dairy & Livestock",
        "question_en": "Why is animal vaccination important?",
        "answer_en": "Animal vaccination is vital because:\n1. Disease Prevention: It protects cattle and goats from deadly contagious diseases like Foot-and-Mouth Disease (FMD), Black Quarter (BQ), Anthrax, and Brucellosis.\n2. Milk Yield Stability: Sick animals suffer severe drop in milk production and take months to recover.\n3. Low Cost vs High Loss: Vaccines cost very little or are free at Government Veterinary Clinics, whereas treating a sick animal costs thousands of rupees.\n4. Herd Immunity: Regular vaccination prevents disease from spreading across your entire herd and village.",
        "question_hi": "पशुओं का टीकाकरण (वैक्सीनेशन) क्यों आवश्यक है?",
        "answer_hi": "पशुओं में नियमित टीकाकरण के मुख्य लाभ:\n1. जानलेवा बीमारियों से बचाव: यह खुरपका-मुंहपका (FMD), लंगड़ा बुखार (BQ), गलघोंटू (HS) और ब्रुसेलोसिस जैसी घातक बीमारियों से बचाता है।\n2. दूध उत्पादन बना रहता है: बीमारी के कारण पशु का दूध काफी घट जाता है और उसकी सेहत सुधरने में महीनों लगते हैं।\n3. कम खर्च में बड़ा बचाव: सरकारी पशु चिकित्सालयों में टीके मुफ्त या नाममात्र दर पर मिलते हैं, जबकि इलाज पर भारी खर्च होता है।\n4. पूरे झुंड की सुरक्षा: नियमित टीकाकरण से बीमारी पूरे बाड़े या गाँव के दूसरे पशुओं में नहीं फैलती।",
        "question_mr": "जनावरांचे लसीकरण का महत्त्वाचे आहे?",
        "answer_mr": "जनावरांना नियमित लस टोचण्याचे प्रमुख फायदे:\n1. जीवघेण्या आजारांपासून संरक्षण: लाळ-खुरकूत (FMD), फऱ्या (BQ), घटसर्प (HS) यांसारख्या संसर्गजन्य आजारांपासून जनावरांचे रक्षण होते.\n2. दूध उत्पादन टिकून राहते: आजारपण आल्यास जनावरांचे दूध प्रचंड घटते आणि पूर्ववत होण्यास दीर्घकाळ लागतो.\n3. अल्प खर्चात मोठा बचाव: शासकीय पशुवैद्यकीय दवाखान्यांमध्ये बहुतांश लस मोफत किंवा नाममात्र शुल्कात मिळतात, ज्यामुळे महागडा उपचार खर्च वाचतो.\n4. संपूर्ण गोठ्याची सुरक्षा: नियमित लसीकरणामुळे संपूर्ण गोठ्यात किंवा गावात रोगराईचा प्रसार होत नाही.",
        "source": "Department of Animal Husbandry & Dairying (DAHD)",
        "tags": ["animal vaccination", "cattle health", "पशु टीकाकरण", "जनावरांचे लसीकरण", "fmd vaccine", "pashu rog"]
    },
    {
        "id": "kb-13",
        "title": "Selling Milk",
        "category": "Dairy & Livestock",
        "question_en": "How can I improve my small milk business?",
        "answer_en": "To increase profitability in a small milk business:\n1. Boost Fat & SNF: Feed animals balanced cattle feed, mineral mixture, and green fodder to raise Fat and SNF percentages, fetching higher cooperative rates.\n2. Value Addition: Convert surplus milk into higher-margin products like Paneer, Curd, Ghee, or Khoa (profit margins 30-50% higher than raw milk).\n3. Direct-to-Consumer Bottling: Sell raw farm-fresh milk in glass bottles directly to urban households at Rs. 60-80/liter rather than Rs. 35-40 at bulk collection.\n4. Clean Milking Practices: Wash udders before milking and chill milk immediately to reduce spoilage.",
        "question_hi": "अपने छोटे दूध व्यवसाय से ज्यादा मुनाफा कैसे कमाएं?",
        "answer_hi": "दूध व्यवसाय से अधिक आमदनी के व्यावहारिक उपाय:\n1. फैट और एसएनएफ (Fat & SNF) बढ़ाएं: पशुओं को संतुलित दाना, मिनरल मिक्सचर और हरा चारा दें ताकि दूध का फैट बढ़े और अधिक रेट मिले।\n2. दुग्ध उत्पाद तैयार करें (वैल्यू एडिशन): सारा कच्चा दूध सस्ते में बेचने के बजाय पनीर, दही, शुद्ध घी और खोया बनाकर बेचें (इसमें 30-50% अधिक लाभ होता है)।\n3. सीधे ग्राहकों को बेचें: दूध को कांच की बोतलों में पैक करके नजदीकी शहर या कॉलोनियों में सीधे ₹60-₹80/लीटर बेचें।\n4. स्वच्छ दूध दोहन: दूध निकालने से पहले थनों की अच्छी सफाई करें और दूध को तुरंत ठंडा रखें ताकि वह खराब न हो।",
        "question_mr": "छोट्या दुग्ध व्यवसायातून जास्त नफा कसा मिळवावा?",
        "answer_mr": "दूध व्यवसायातील नफा वाढवण्याचे व्यावहारिक उपाय:\n1. फॅट आणि एसएनएफ (Fat & SNF) वाढवा: संतुलित पशुआहार, खनिज मिश्रण (मिनरल मिक्स्चर) आणि हिरवा चारा दिल्यास दुधाचे फॅट वाढून डेअरीत उत्तम भाव मिळतो.\n2. दुग्धजन्य पदार्थ तयार करा (मूल्यवर्धन): कच्चे दूध विकण्यासोबतच पनीर, दही, खवा आणि अस्सल तूप तयार करून विका; यात ३०% ते ५०% जास्त नफा मिळतो.\n3. थेट घरपोच दूध विक्री: दूध संकलन केंद्रात कमी दरात देण्याऐवजी जवळच्या शहरात बाटलीबंद ताजे दूध ₹६० ते ₹८० प्रति लिटर दराने थेट ग्राहकांना द्या.\n4. स्वच्छ दूध उत्पादन: धार काढण्यापूर्वी कास स्वच्छ धुवा आणि काढलेले दूध लगेच थंड ठिकाणी ठेवा ज्यामुळे नासण्याची भीती राहत नाही.",
        "source": "National Dairy Development Board (NDDB)",
        "tags": ["selling milk", "dairy profit", "दूध का धंधा", "दूध विक्री", "paneer business", "fat snf"]
    },
    {
        "id": "kb-14",
        "title": "Poultry Business",
        "category": "Dairy & Livestock",
        "question_en": "How can I start a small poultry business?",
        "answer_en": "To start a small backyard or commercial poultry enterprise:\n1. Choose the Right Bird Breed: For eggs, select BV-380 or Desi crosses. For meat, choose Broiler or hardy Desi breeds like Kadaknath or Kaveri.\n2. Well-Ventilated Shed: Provide 1.5 to 2 sq ft of floor space per bird with rice husk or sawdust bedding.\n3. Feed & Clean Water: Provide balanced poultry feed and unlimited clean drinking water with vitamin supplements.\n4. Vaccination: Strictly administer Marek's, Ranikhet (LaSota), and Gumboro vaccines on schedule.\n5. Market Linkage: Sell live birds and free-range Desi eggs directly to local dhabas, butcher shops, and households.",
        "question_hi": "छोटा मुर्गी पालन (पोल्ट्री) व्यवसाय कैसे शुरू करें?",
        "answer_hi": "छोटा पोल्ट्री व्यवसाय शुरू करने के मुख्य चरण:\n1. सही नस्ल का चुनाव: अंडों के लिए बीवी-380 या देशी नस्लें और मांस के लिए ब्रायलर या मजबूत देशी नस्लें (जैसे कड़कनाथ, कावेरी) चुनें।\n2. हवादार शेड: प्रति पक्षी 1.5 से 2 वर्ग फुट जगह रखें और फर्श पर 2 इंच धान की भूसी (लीटर) बिछाएं।\n3. संतुलित आहार और साफ पानी: प्रोटीनयुक्त दाना और हमेशा साफ पीने का पानी उपलब्ध कराएं।\n4. टीकाकरण: रानीखेत (Lasota) और गंबोरो की वैक्सीन समय पर लगवाएं ताकि मुर्गियां बीमार न पड़ें।\n5. बिक्री व्यवस्था: देशी अंडे और मुर्गियों को स्थानीय होटलों, ढाबों और साप्ताहिक बाजारों में सीधे अच्छे दामों पर बेचें।",
        "question_mr": "छोटा कुक्कुटपालन (पोल्ट्री) व्यवसाय कसा सुरू करावा?",
        "answer_mr": "कुक्कुटपालन व्यवसाय सुरू करण्यासाठी महत्त्वाच्या पायऱ्या:\n1. जातीची निवड: अंड्यांसाठी बीव्ही-३८० किंवा सुधारित गावरान आणि मांसासाठी ब्रॉयलर किंवा कडकनाथ/कावेरी यांसारख्या निरोगी देशी जाती निवडा.\n2. हवेशीर शेड: प्रत्येक पक्ष्यासाठी १.५ ते २ चौ. फूट जागा असावी आणि जमिनीवर भाताचा तूस किंवा लाकडाचा भुसा पसरावा.\n3. खाद्य आणि पाणी: मका, पेंडयुक्त संतुलित खाद्य आणि २४ तास पिण्यासाठी स्वच्छ पाणी द्या.\n4. लसीकरण: लासोटा (LaSota) आणि गंबोरो या रोगांवर वेळेवर लसीकरण करून मरतूक २% च्या आत ठेवा.\n5. थेट विक्री: गावरान अंडी ₹१०-१५ प्रति नग आणि जिवंत पक्षी स्थानिक हॉटेल व आठवडे बाजारात थेट चांगल्या भावाने विका.",
        "source": "Central Poultry Development Organization (CPDO)",
        "tags": ["poultry business", "backyard poultry", "मुर्गी पालन", "कुक्कुटपालन", "desi murgi", "kadaknath"]
    },

    # CATEGORY 3 — FOOD PROCESSING (15 - 18)
    {
        "id": "kb-15",
        "title": "Starting a Homemade Food Business",
        "category": "Food Processing",
        "question_en": "How can I start a homemade food business from my village?",
        "answer_en": "To launch a homemade food venture (pickles, papad, masala, sweets, snacks):\n1. Pick Your Special Product: Choose 2-3 signature items you make exceptionally well.\n2. Obtain Basic Registrations: Apply for a free MSME Udyam Registration (udyamregistration.gov.in) and a Basic FSSAI Registration on the FoSCoS portal (costs only Rs. 100/year for turnover under Rs. 12 Lakhs).\n3. Maintain Hygiene & Consistency: Use food-grade utensils, maintain clean preparation space, and follow exact weight recipes.\n4. Attractive Packaging: Pack in airtight pouches with clean ingredient and expiry labels.\n5. Sell Locally: Distribute samples to neighbors, grocery stores, and take orders via WhatsApp.",
        "question_hi": "गाँव से घर का बना खाद्य उत्पाद (होममेड फूड) व्यवसाय कैसे शुरू करें?",
        "answer_hi": "घर से खाद्य व्यवसाय (अचार, पापड़, मसाले, नमकीन) शुरू करने के सरल कदम:\n1. अपनी खास रेसिपी चुनें: शुरुआत में केवल 2-3 उत्पाद चुनें जिन्हें आप सबसे स्वादिष्ट और प्रामाणिक बनाते हैं।\n2. आवश्यक रजिस्ट्रेशन: मुफ्त उद्यम (MSME) रजिस्ट्रेशन कराएं और FoSCoS पोर्टल पर ₹100/वर्ष में बेसिक FSSAI फूड लाइसेंस लें।\n3. स्वच्छता और माप: हमेशा साफ-सुथरे स्थान पर काम करें और हर बार एक जैसा स्वाद बनाए रखने के लिए सामग्री तौलकर डालें।\n4. साफ पैकेजिंग: फूड-ग्रेड एयरटाइट पाउच में पैक करें और ऊपर सामग्री व एक्सपायरी का लेबल लगाएं।\n5. स्थानीय बिक्री: रिश्तेदारों, स्थानीय किराना स्टोरों पर सैंपल दें और व्हाट्सएप बिजनेस से ऑर्डर लेना शुरू करें।",
        "question_mr": "गावातून घरगुती खाद्यपदार्थ व्यवसाय कसा सुरू करावा?",
        "answer_mr": "घरगुती खाद्यपदार्थ (लोणचे, पापड, मसाले, लाडू, शेव) व्यवसाय सुरू करण्याचे टप्पे:\n1. खास पदार्थांची निवड: तुम्ही ज्या २-३ पदार्थांमध्ये निष्णात आहात (उदा. आंबा लोणचे, गरम मसाला) तेच सुरुवातीला निवडा.\n2. आवश्यक परवाने: [udyamregistration.gov.in](https://udyamregistration.gov.in) वर मोफत उद्यम नोंदणी करा आणि FoSCoS पोर्टलवरून फक्त ₹१००/वर्ष फी भरून बेसिक FSSAI परवाना मिळवा.\n3. स्वच्छता आणि प्रमाण: काम करण्याची जागा अत्यंत स्वच्छ ठेवा आणि पदार्थांची चव नेहमी एकसारखी राहण्यासाठी घटकांचे वजन करून घ्या.\n4. आकर्षक पॅकेजिंग: हवाबंद फूड-ग्रेड पाकिटात पॅक करून त्यावर घटक, निव्वळ वजन आणि अंतिम तारीख स्पष्ट लिहा.\n5. विक्री सुरुवात: शेजारी, स्थानिक किराणा दुकाने आणि व्हॉट्सअॅप ग्रुपवर सॅम्पल दाखवून ऑर्डर्स घ्या.",
        "source": "Ministry of Food Processing Industries (MoFPI) & FSSAI",
        "tags": ["homemade food", "food processing", "घर का खाना", "खाद्यपदार्थ व्यवसाय", "fssai license", "pickle business", "papad masala"]
    },
    {
        "id": "kb-16",
        "title": "Food Product Packaging",
        "category": "Food Processing",
        "question_en": "Why is packaging important for a food business?",
        "answer_en": "Food packaging serves five crucial functions:\n1. Protection & Freshness: Keeps food safe from moisture, dust, pests, and air oxidation, preventing spoilage.\n2. Extended Shelf Life: Sealed pouches keep chips crispy and pickles fresh for months.\n3. Brand Recognition: A well-designed, neat pouch makes a small village brand look as professional as a supermarket brand.\n4. Legal Compliance: Food safety laws mandate printing product name, net weight, ingredients, MFG date, Best Before, and FSSAI number.\n5. Customer Trust: Sealed food signals safety and hygiene, giving customers confidence to buy and recommend.",
        "question_hi": "खाद्य व्यवसाय के लिए अच्छी पैकेजिंग क्यों जरूरी है?",
        "answer_hi": "फूड बिजनेस में पैकेजिंग के 5 मुख्य महत्व:\n1. सुरक्षा और ताजगी: यह उत्पाद को हवा, नमी, धूल और कीड़ों से बचाती है जिससे खाना जल्दी खराब नहीं होता।\n2. शेल्फ लाइफ बढ़ना: अच्छी सीलिंग से पापड़, नमकीन और अचार महीनों तक कुरकुरे और ताजे रहते हैं।\n3. ब्रांड की पहचान: सुंदर और साफ पैकेट से आपके गाँव का उत्पाद भी बड़े ब्रांड जैसा पेशेवर दिखता है।\n4. कानूनी नियम: पैकेट पर सामग्री, वजन, निर्माण तिथि, एक्सपायरी और FSSAI नंबर लिखना अनिवार्य है।\n5. ग्राहकों का भरोसा: सीलबंद और साफ पैकेजिंग देखकर ग्राहक बिना हिचकिचाहट के सामान खरीदते हैं।",
        "question_mr": "खाद्यपदार्थ व्यवसायासाठी पॅकेजिंग का महत्त्वाचे आहे?",
        "answer_mr": "खाद्य उद्योगात पॅकेजिंगचे ५ मोठे फायदे:\n1. सुरक्षा आणि ताजेपणा: हवा, धूळ, ओलावा आणि कीटक यांच्यापासून अन्न सुरक्षित राहून खराब होत नाही.\n2. टिकवणक्षमता (Shelf Life): हवाबंद सील केलेल्या पाकिटांमुळे शेव, पापड, लोणची महिनान्-महिने ताजी आणि कुरकुरीत राहतात.\n3. ब्रँडची प्रतिष्ठा: आकर्षक पॅकेजिंगमुळे तुमच्या खेड्यातील उत्पादनालाही मोठ्या कंपनीसारखा दर्जा आणि ओळख मिळते.\n4. कायदेशीर नियम: पाकिटावर घटकांची यादी, निव्वळ वजन, उत्पादन तारीख आणि FSSAI नंबर छापणे बंधनकारक असते.\n5. ग्राहकांचा विश्वास: सीलबंद पॅक पाहिल्यावर ग्राहकांना स्वच्छतेची खात्री पटते आणि ते नियमित खरेदी करतात.",
        "source": "Indian Institute of Packaging (IIP)",
        "tags": ["food packaging", "packaging importance", "पैकेजिंग महत्व", "पॅकेजिंगचे महत्त्व", "airtight pouch", "shelf life"]
    },
    {
        "id": "kb-17",
        "title": "Food Business Branding",
        "category": "Food Processing",
        "question_en": "How can I create a brand for my homemade food products?",
        "answer_en": "Building a memorable brand on a small budget:\n1. Memorable Name: Choose a short, warm, culturally resonant name (e.g., 'Aaji Che Masale', 'Shree Gramin Swad').\n2. Clear Identity & Story: Highlight your unique strength: '100% Traditional Stone-Ground', 'No Artificial Preservatives'.\n3. Simple Sticker Labels: Print colorful self-adhesive sticker labels at a local digital printer (costs approx. 50-80 paise each).\n4. Consistent Colors & Design: Use the same font, logo, and colors across all product pouches and delivery bags.\n5. Customer Testimonials: Print honest reviews or WhatsApp screenshots on your flyers and social media.",
        "question_hi": "अपने घर के बने खाद्य उत्पादों के लिए एक ब्रांड कैसे बनाएं?",
        "answer_hi": "कम खर्च में अपना फूड ब्रांड बनाने के 5 तरीके:\n1. सरल और आकर्षक नाम: ऐसा नाम चुनें जो याद रखने में आसान और भरोसेमंद हो (जैसे 'दादी का स्वाद', 'देसी रसोई')।\n2. अपनी खासियत बताएं: पैकेट पर साफ लिखें—'100% शुद्ध', 'हाथ से पिसा हुआ', या 'बिना मिलावट'।\n3. स्थानीय प्रिंटिंग: पास की डिजिटल प्रिंटिंग दुकान से 50-80 पैसे प्रति स्टीकर की दर से रंगीन लेबल छपवाएं।\n4. एक जैसी पहचान: अपने सभी पैकेटों और बैग पर एक जैसा लोगो, रंग और फोन नंबर रखें।\n5. ग्राहकों की प्रतिक्रिया: संतुष्ट ग्राहकों की तारीफ और फोटो को अपने व्हाट्सएप स्टेटस पर साझा करें।",
        "question_mr": "घरगुती खाद्यपदार्थांचा स्वतःचा ब्रँड कसा तयार करावा?",
        "answer_mr": "कमी खर्चात स्वतःचा दर्जेदार ब्रँड तयार करण्याचे ५ टप्पे:\n1. सोपे व लक्षात राहणारे नाव: आपलेपणा दर्शवणारे नाव निवडा (उदा. 'माऊली गृहउद्योग', 'गावचा स्वाद', 'सुगंध मसाले').\n2. स्वतःची वेगळी ओळख (USP): तुमच्या उत्पादनाचे वैशिष्ट्य सांगा: 'पारंपारिक पाटा-वरवंटा पद्धत', 'कोणतेही कृत्रिम रंग नाहीत'.\n3. स्थानिक स्टिकर्स: स्थानिक प्रिंटिंग प्रेसमधून ५० ते ८० पैशांत रंगीत स्टिकर्स छापून पाकिटांवर लावा.\n4. एकसारखी डिझाईन: सर्व पाकिटांवर एकच लोगो, रंग आणि मोबाईल नंबर वापरून ओळख निर्माण करा.\n5. ग्राहकांचा विश्वास: समाधानी ग्राहकांच्या प्रतिक्रियांचे फोटो व्हॉट्सअॅप स्टेटसवर ठेवून प्रचार करा.",
        "source": "Rural Marketing Association of India (RMAI)",
        "tags": ["food branding", "brand creation", "फूड ब्रांड", "ब्रँड निर्मिती", "logo sticker", "swad brand"]
    },
    {
        "id": "kb-18",
        "title": "Increasing Shelf Life",
        "category": "Food Processing",
        "question_en": "How can I increase the shelf life of a food product?",
        "answer_en": "To extend food shelf life naturally without harmful chemicals:\n1. Moisture Control: Thoroughly sun-dry or dehydrate raw ingredients before processing; bacteria cannot multiply without water.\n2. Natural Preservatives: Use natural curing agents like salt, edible oil, mustard, turmeric, and jaggery in correct proportions.\n3. Hot-Fill or Vacuum Seal: Fill hot liquid products into sterilized glass jars or use nitrogen-flushed / vacuum-sealed pouches for snacks.\n4. Sterilize Containers: Wash bottles and jars in boiling water and completely dry them before filling.\n5. Storage Conditions: Advise customers to keep products in a cool, dry place away from direct sunlight.",
        "question_hi": "खाद्य उत्पाद की शेल्फ लाइफ (खराब न होने की अवधि) कैसे बढ़ाएं?",
        "answer_hi": "बिना हानिकारक रसायनों के खाद्य सामग्री को लंबे समय तक सुरक्षित रखने के उपाय:\n1. नमी दूर करना: सामग्री को अच्छी तरह धूप में सुखाएं; बिना नमी के फफूंद और बैक्टीरिया नहीं पनपते।\n2. प्राकृतिक परिरक्षक (Natural Preservatives): नमक, सरसों का तेल, हल्दी, नींबू रस या सिरके का सही अनुपात में प्रयोग करें।\n3. कांच के जार को स्टरलाइज करना: कांच की बरनियों को उबलते पानी में धोकर पूरी तरह सुखा लें, फिर उत्पाद भरें।\n4. वैक्यूम या एयरटाइट सील: स्नैक्स और नमकीन के लिए एयरटाइट पाउच का उपयोग करें।\n5. सही भंडारण निर्देश: पैकेट पर स्पष्ट लिखें—'ठंडी और सूखी जगह पर रखें, गीले चम्मच का प्रयोग न करें'।",
        "question_mr": "खाद्यपदार्थ जास्त दिवस टिकवण्यासाठी (शेल्फ लाईफ) काय करावे?",
        "answer_mr": "खाद्यपदार्थ दीर्घकाळ टिकवण्यासाठी नैसर्गिक उपाय:\n1. ओलावा पूर्णपणे काढणे: कच्चा माल उन्हात कडकडीत वाळवून घ्या; अन्नात ओलावा नसेल तर बुरशी किंवा जिवाणू वाढत नाहीत.\n2. नैसर्गिक संरक्षक घटकांचा वापर: तेल, मीठ, हळद, मोहरी आणि लिंबाचा रस यांचा योग्य प्रमाणात वापर करा.\n3. बरण्या निर्जंतुक करणे: काचेच्या बरण्या उकळत्या पाण्यात स्वच्छ धुवून उन्हात वाळवा, मगच त्यात लोणचे भरा.\n4. हवाबंद पॅकिंग: पाकिटातील हवा पूर्णपणे काढून सील करा (Airtight heat sealing).\n5. सूचनांची नोंद: पाकिटावर 'थंड व कोरड्या जागी ठेवा, ओला चमचा वापरू नका' अशी सूचना ठळकपणे लिहा.",
        "source": "CFTRI - Central Food Technological Research Institute",
        "tags": ["shelf life", "food preservation", "शेल्फ लाइफ", "अन्न साठवणूक", "natural preservative", "tikan kshamata"]
    }
]

print(f"Loaded initial {len(ITEMS)} items. Building next categories...")
