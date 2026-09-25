import asyncio
import logging
from datetime import datetime
from app.database import get_database, connect_to_mongo, close_mongo_connection
from app.services.auth_service import get_password_hash

logger = logging.getLogger("ruralconnect.seed")

async def seed_database():
    db = get_database()
    if db is None:
        logger.error("Database connection not ready for seeding.")
        return

    # Check if already seeded
    existing_courses = await db.learning_courses.count_documents({})
    if existing_courses > 0:
        logger.info("Database already seeded with courses. Checking admin user and updating lessons...")
    else:
        logger.info("Seeding database with authentic Indian data...")

    # 1. Users (Admin + Demo Rural Woman Entrepreneur)
    now_str = datetime.utcnow().isoformat()
    
    admin_user = await db.users.find_one({"email": "admin@ruralconnect.in"})
    if not admin_user:
        await db.users.insert_one({
            "_id": "user-admin-01",
            "full_name": "Dr. Rajesh Sharma",
            "email": "admin@ruralconnect.in",
            "phone": "9876543210",
            "password_hash": get_password_hash("Admin@12345"),
            "role": "admin",
            "preferred_language": "en",
            "village": "Haveli",
            "district": "Pune",
            "state": "Maharashtra",
            "business_type": "Services",
            "business_description": "Rural Development Officer and Platform Administrator.",
            "interests": ["Administration", "Policy", "Mentorship"],
            "profile_photo": "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
            "created_at": now_str,
            "updated_at": now_str
        })
    else:
        await db.users.update_one({"email": "admin@ruralconnect.in"}, {"$set": {"profile_photo": "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80"}})
        
    demo_user = await db.users.find_one({"email": "sunita@ruralconnect.in"})
    if not demo_user:
        await db.users.insert_one({
            "_id": "user-demo-01",
            "full_name": "Sunita Kamble",
            "email": "sunita@ruralconnect.in",
            "phone": "9822334455",
            "password_hash": get_password_hash("Rural@12345"),
            "role": "entrepreneur",
            "preferred_language": "mr",
            "village": "Shindewadi",
            "district": "Satara",
            "state": "Maharashtra",
            "business_type": "Food",
            "business_description": "Organic spice processing, homemade pickles, and multigrain flour packaging with Mahila Bachat Gat.",
            "interests": ["Food Processing", "Packaging", "WhatsApp Business", "Government Subsidies"],
            "profile_photo": "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&auto=format&fit=crop&q=80",
            "created_at": now_str,
            "updated_at": now_str
        })
    else:
        await db.users.update_one({"email": "sunita@ruralconnect.in"}, {"$set": {"profile_photo": "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&auto=format&fit=crop&q=80"}})

    # 2. Courses (All 5 YouTube Lectures integrated directly!)
    if existing_courses == 0:
        courses = [
            {
                "_id": "course-entrepreneurship",
                "title": "Entrepreneurship",
                "description": "Fundamental entrepreneurship principles, business mindset, market research, and scaling strategies for Indian rural founders.",
                "category": "Entrepreneurship",
                "thumbnail": "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80",
                "level": "Beginner",
                "language": "Hindi / English",
                "total_duration_minutes": 95,
                "total_lessons": 3,
                "tags": ["Entrepreneurship", "Business Planning", "Idea Validation"],
                "created_at": now_str
            },
            {
                "_id": "course-digital-marketing",
                "title": "Digital Marketing",
                "description": "Master online presence, social media sales, WhatsApp Business communication, and digital payments for rural micro-enterprises.",
                "category": "Digital Marketing",
                "thumbnail": "https://images.unsplash.com/photo-1556742049-0a67e5572263?w=600&auto=format&fit=crop&q=80",
                "level": "Beginner",
                "language": "Hindi / English",
                "total_duration_minutes": 65,
                "total_lessons": 2,
                "tags": ["Digital Marketing", "Social Media", "WhatsApp", "Local Commerce"],
                "created_at": now_str
            },
            {
                "_id": "course-rural-women",
                "title": "Rural & Women Entrepreneurship Basics",
                "description": "Step-by-step practical guide on Self-Help Groups (SHG), micro-enterprise bookkeeping, branding, hygiene standards, and government loans.",
                "category": "Rural & Women Entrepreneurship",
                "thumbnail": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
                "level": "Beginner",
                "language": "Marathi / Hindi",
                "total_duration_minutes": 110,
                "total_lessons": 3,
                "tags": ["Women In Business", "Self Help Groups", "Finance", "Branding"],
                "created_at": now_str
            }
        ]
        await db.learning_courses.insert_many(courses)

        # 3. Exact 5 Provided YouTube Lectures + Additional Practical Lessons
        lessons = [
            # Course 1: Entrepreneurship (3 required YouTube lectures)
            {
                "_id": "lesson-ent-01",
                "course_id": "course-entrepreneurship",
                "lesson_number": 1,
                "lesson_title": "Entrepreneurship Lecture 1",
                "description": "Introduction to entrepreneurial mindset, identifying community needs, and building sustainable village business models.",
                "video_source_type": "youtube",
                "video_url": "https://youtu.be/kAAO-qO2kFg",
                "embed_url": "https://www.youtube-nocookie.com/embed/kAAO-qO2kFg",
                "provider": "YouTube",
                "language": "Hindi / English",
                "duration_minutes": 32,
                "learning_objectives": [
                    "Understand what makes an entrepreneur succeed in local markets",
                    "Identify viable customer pain points in your taluka or village",
                    "Assess risk, initial capital requirements, and profitability"
                ],
                "is_embeddable": True,
                "is_verified": True,
                "last_verified": "2026-03-01",
                "order": 1,
                "text_content": "In this foundational lecture, we explore how successful rural enterprises begin with simple observation of local needs: from organic produce to tailoring, repair services, and localized food processing."
            },
            {
                "_id": "lesson-ent-02",
                "course_id": "course-entrepreneurship",
                "lesson_number": 2,
                "lesson_title": "Entrepreneurship Lecture 2",
                "description": "Business planning, customer acquisition strategies, and cost calculation for small products and services.",
                "video_source_type": "youtube",
                "video_url": "https://youtu.be/pC5l5j2u9SQ",
                "embed_url": "https://www.youtube-nocookie.com/embed/pC5l5j2u9SQ",
                "provider": "YouTube",
                "language": "Hindi / English",
                "duration_minutes": 35,
                "learning_objectives": [
                    "How to calculate cost price, markup, and selling price accurately",
                    "Understanding cash flow cycles in rural weekly markets (haats)",
                    "Building repeat business through trust and product consistency"
                ],
                "is_embeddable": True,
                "is_verified": True,
                "last_verified": "2026-03-01",
                "order": 2,
                "text_content": "Careful financial planning is the lifeblood of rural entrepreneurship. This session guides you through recording daily raw material costs, labor, and separating personal savings from business revenue."
            },
            {
                "_id": "lesson-ent-03",
                "course_id": "course-entrepreneurship",
                "lesson_number": 3,
                "lesson_title": "Entrepreneurship Lecture 3",
                "description": "Scaling your venture, overcoming supply chain challenges, and hiring local community talent.",
                "video_source_type": "youtube",
                "video_url": "https://youtu.be/1Tf9NHbRPYM",
                "embed_url": "https://www.youtube-nocookie.com/embed/1Tf9NHbRPYM",
                "provider": "YouTube",
                "language": "Hindi / English",
                "duration_minutes": 28,
                "learning_objectives": [
                    "Expanding from one village to nearby towns and talukas",
                    "Navigating local logistics, transport, and cooperative delivery",
                    "Leveraging government micro-credit for equipment expansion"
                ],
                "is_embeddable": True,
                "is_verified": True,
                "last_verified": "2026-03-01",
                "order": 3,
                "text_content": "Scaling up requires structured delegation. Learn how rural women collectives in Maharashtra successfully divided production, quality checks, and logistics to serve bigger urban retailers."
            },

            # Course 2: Digital Marketing (2 required YouTube lectures)
            {
                "_id": "lesson-dm-01",
                "course_id": "course-digital-marketing",
                "lesson_number": 1,
                "lesson_title": "Digital Marketing Lecture 1",
                "description": "Foundations of digital marketing, setting up a professional mobile presence, and reaching regional customers.",
                "video_source_type": "youtube",
                "video_url": "https://youtu.be/ZucOiqzRznA",
                "embed_url": "https://www.youtube-nocookie.com/embed/ZucOiqzRznA",
                "provider": "YouTube",
                "language": "Hindi / English",
                "duration_minutes": 31,
                "learning_objectives": [
                    "Creating a verified Google Business Profile for your shop or workshop",
                    "Using smartphone cameras for high-quality natural light product photos",
                    "Setting up WhatsApp Business with catalog, auto-reply, and quick tags"
                ],
                "is_embeddable": True,
                "is_verified": True,
                "last_verified": "2026-03-01",
                "order": 1,
                "text_content": "With 4G/5G mobile penetration across rural India, your smartphone is your complete marketing agency. Learn how to showcase handicrafts, agro-products, and spices directly to buyers."
            },
            {
                "_id": "lesson-dm-02",
                "course_id": "course-digital-marketing",
                "lesson_number": 2,
                "lesson_title": "Digital Marketing Lecture 2",
                "description": "WhatsApp Business selling, social media reels, and digital UPI payments for hassle-free orders.",
                "video_source_type": "youtube",
                "video_url": "https://youtu.be/OC8s2_VSQFA",
                "embed_url": "https://www.youtube-nocookie.com/embed/OC8s2_VSQFA",
                "provider": "YouTube",
                "language": "Hindi / English",
                "duration_minutes": 34,
                "learning_objectives": [
                    "Showcasing behind-the-scenes craft videos on Instagram and YouTube Shorts",
                    "Collecting advance payments securely via UPI QR codes",
                    "Handling customer inquiries politely and tracking dispatch parcels"
                ],
                "is_embeddable": True,
                "is_verified": True,
                "last_verified": "2026-03-01",
                "order": 2,
                "text_content": "Customers love seeing the genuine craftspeople behind the product. Short, authentic clips of handloom weaving, pickle making, or pottery connect deeply with urban consumers looking for organic quality."
            },

            # Course 3: Rural & Women Entrepreneurship
            {
                "_id": "lesson-rwe-01",
                "course_id": "course-rural-women",
                "lesson_number": 1,
                "lesson_title": "Self-Help Groups (SHG) & Micro-Finance",
                "description": "How to register and operate a vibrant Mahila Bachat Gat, maintain registers, and access subsidized bank loans.",
                "video_source_type": "youtube",
                "video_url": "https://youtu.be/pC5l5j2u9SQ",
                "embed_url": "https://www.youtube-nocookie.com/embed/pC5l5j2u9SQ",
                "provider": "YouTube",
                "language": "Marathi / Hindi",
                "duration_minutes": 35,
                "learning_objectives": [
                    "Forming a 10 to 20 member Mahila Bachat Gat",
                    "Bookkeeping best practices and monthly savings discipline",
                    "Applying for bank linkage loans under NRLM (National Rural Livelihoods Mission)"
                ],
                "is_embeddable": True,
                "is_verified": True,
                "last_verified": "2026-03-01",
                "order": 1,
                "text_content": "A Self-Help Group (SHG) empowers women to pool micro-savings, generate internal loans at nominal interest, and establish creditworthiness with commercial and cooperative banks."
            },
            {
                "_id": "lesson-rwe-02",
                "course_id": "course-rural-women",
                "lesson_number": 2,
                "lesson_title": "Branding, Packaging & Food Safety (FSSAI)",
                "description": "Step-by-step guidance on basic packaging, moisture control, labeling requirements, and free/low-cost FSSAI registration.",
                "video_source_type": "youtube",
                "video_url": "https://youtu.be/kAAO-qO2kFg",
                "embed_url": "https://www.youtube-nocookie.com/embed/kAAO-qO2kFg",
                "provider": "YouTube",
                "language": "Marathi / Hindi",
                "duration_minutes": 40,
                "learning_objectives": [
                    "Simple vacuum sealers and food-grade pouches",
                    "Required label details: Net weight, manufacturing date, ingredients, MRP",
                    "Applying for FSSAI basic registration for turnover under 12 Lakhs"
                ],
                "is_embeddable": True,
                "is_verified": True,
                "last_verified": "2026-03-01",
                "order": 2,
                "text_content": "A clean, well-labeled package transforms a homemade item into a trusted retail product. Food safety certification gives urban buyers confidence and opens doors to supermarket shelves."
            },
            {
                "_id": "lesson-rwe-03",
                "course_id": "course-rural-women",
                "lesson_number": 3,
                "lesson_title": "Accessing Subsidized Government Schemes",
                "description": "Understanding PMEGP, Mudra, and Stand-Up India schemes to finance machinery and working capital.",
                "video_source_type": "youtube",
                "video_url": "https://youtu.be/1Tf9NHbRPYM",
                "embed_url": "https://www.youtube-nocookie.com/embed/1Tf9NHbRPYM",
                "provider": "YouTube",
                "language": "Marathi / Hindi",
                "duration_minutes": 35,
                "learning_objectives": [
                    "Preparing a simple Project Report (DPR)",
                    "Submitting applications through KVIB / DIC portals",
                    "Tracking loan approval and subsidy claims without middlemen"
                ],
                "is_embeddable": True,
                "is_verified": True,
                "last_verified": "2026-03-01",
                "order": 3,
                "text_content": "Government schemes provide subsidies up to 35% for women and rural entrepreneurs under PMEGP. This lesson gives you a step-by-step checklist to avoid paying touts or agents."
            }
        ]
        await db.lessons.insert_many(lessons)

    # 4. Specialist Indian Mentors (Realistic Indian professionals, Maharashtra & rural context)
    mentors = [
        {
            "_id": "mentor-01",
            "name": "Dr. Ramesh Kulkarni",
            "photo": "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&auto=format&fit=crop&q=80",
            "expertise": "Agro-Processing & Dairy Farming",
            "experience": "18+ years",
            "qualification": "Ph.D. in Agriculture Economics (MPKV Rahuri)",
            "languages": ["Marathi", "Hindi", "English"],
            "location": "Pune, Maharashtra",
            "availability": "Mon, Wed, Fri (4 PM - 7 PM)",
            "rating": 4.9,
            "sessions": 142,
            "bio": "Specializes in helping farmer producer companies (FPC) and rural dairy farmers set up cold storage, milk chilling plants, and organic certification.",
            "is_verified": True
        },
        {
            "_id": "mentor-02",
            "name": "Sunita Patil",
            "photo": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80",
            "expertise": "Self-Help Groups & Micro-Finance",
            "experience": "14+ years",
            "qualification": "M.S.W., Rural Livelihoods Consultant",
            "languages": ["Marathi", "Hindi"],
            "location": "Kolhapur, Maharashtra",
            "availability": "Tue, Thu, Sat (10 AM - 1 PM)",
            "rating": 5.0,
            "sessions": 218,
            "bio": "Trained over 400 women-led self-help groups across western Maharashtra in micro-savings, bank credit linkage, and conflict resolution.",
            "is_verified": True
        },
        {
            "_id": "mentor-03",
            "name": "Vikram Shinde",
            "photo": "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&auto=format&fit=crop&q=80",
            "expertise": "Handicrafts, Textiles & Retail Branding",
            "experience": "12+ years",
            "qualification": "National Institute of Design (NID) Alum",
            "languages": ["Hindi", "Marathi", "English"],
            "location": "Nashik, Maharashtra",
            "availability": "Mon to Fri (5 PM - 8 PM)",
            "rating": 4.8,
            "sessions": 98,
            "bio": "Helps Paithani weavers, bamboo artisans, and pottery collectives modernise design aesthetics, packaging, and showcase in national craft exhibitions.",
            "is_verified": True
        },
        {
            "_id": "mentor-04",
            "name": "Ananya Deshmukh",
            "photo": "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&auto=format&fit=crop&q=80",
            "expertise": "Digital Marketing & WhatsApp Commerce",
            "experience": "9+ years",
            "qualification": "MBA Marketing (Symbiosis Pune)",
            "languages": ["Marathi", "Hindi", "English"],
            "location": "Aurangabad (Chhatrapati Sambhajinagar)",
            "availability": "Wed, Sat, Sun (2 PM - 6 PM)",
            "rating": 4.9,
            "sessions": 165,
            "bio": "Digital growth strategist dedicated to onboarding rural tier-3 and village entrepreneurs onto social media storefronts and hyperlocal delivery apps.",
            "is_verified": True
        },
        {
            "_id": "mentor-05",
            "name": "Priya Gaikwad",
            "photo": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80",
            "expertise": "Government Schemes & Bank Loans",
            "experience": "15+ years",
            "qualification": "Former Lead Bank Manager (Bank of Maharashtra)",
            "languages": ["Marathi", "Hindi", "English"],
            "location": "Satara, Maharashtra",
            "availability": "Mon, Thu, Sat (3 PM - 6 PM)",
            "rating": 5.0,
            "sessions": 310,
            "bio": "Expert in PMEGP and Mudra loan documentation, project report preparation, and bank interview guidance for rural women entrepreneurs.",
            "is_verified": True
        },
        {
            "_id": "mentor-06",
            "name": "Suresh Jadhav",
            "photo": "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&auto=format&fit=crop&q=80",
            "expertise": "Organic Farming & Solar Schemes",
            "experience": "16+ years",
            "qualification": "M.Sc. Horticulture & Certified Organic Auditor",
            "languages": ["Marathi", "Hindi"],
            "location": "Sangli, Maharashtra",
            "availability": "Mon, Wed, Sat (9 AM - 12 PM)",
            "rating": 4.9,
            "sessions": 184,
            "bio": "Pioneer in organic vermicompost, greenhouse drip irrigation, and availing PM-KUSUM 90% solar pump government subsidies for farmers.",
            "is_verified": True
        },
        {
            "_id": "mentor-07",
            "name": "Dr. Meera Joshi",
            "photo": "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&auto=format&fit=crop&q=80",
            "expertise": "Millet Processing & FSSAI Licensing",
            "experience": "11+ years",
            "qualification": "Food Technologist (CFTRI Mysore)",
            "languages": ["Marathi", "Hindi", "English"],
            "location": "Nagpur, Maharashtra",
            "availability": "Tue, Thu, Fri (3 PM - 6 PM)",
            "rating": 4.9,
            "sessions": 126,
            "bio": "Consultant for Shree Anna millets value addition, bakery items, shelf-life testing, and obtaining FoSCoS state & basic FSSAI licenses.",
            "is_verified": True
        },
        {
            "_id": "mentor-08",
            "name": "Dr. Arjun Rathod",
            "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
            "expertise": "Poultry & Goat Rearing Micro-Enterprises",
            "experience": "13+ years",
            "qualification": "B.V.Sc & A.H. (Veterinary Consultant)",
            "languages": ["Marathi", "Hindi", "English"],
            "location": "Amravati, Maharashtra",
            "availability": "Mon to Fri (11 AM - 2 PM)",
            "rating": 4.8,
            "sessions": 152,
            "bio": "Advises farmers on disease-resistant Kadaknath / Desi poultry breeds, Osmanabadi stall-fed goat rearing sheds, and vaccination management.",
            "is_verified": True
        },
        {
            "_id": "mentor-09",
            "name": "Kavita Choudhary",
            "photo": "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&auto=format&fit=crop&q=80",
            "expertise": "Rural Women SHG Federation & Lakhpati Didi",
            "experience": "17+ years",
            "qualification": "NRLM Master Trainer & Social Entrepreneur",
            "languages": ["Marathi", "Hindi"],
            "location": "Solapur, Maharashtra",
            "availability": "Tue, Wed, Sat (1 PM - 4 PM)",
            "rating": 5.0,
            "sessions": 275,
            "bio": "National mentor for women federation empowerment, community revolving funds, and Lakhpati Didi business model implementation in rural areas.",
            "is_verified": True
        }
    ]
    for m in mentors:
        await db.mentors.update_one({"_id": m["_id"]}, {"$set": m}, upsert=True)

    # 5. Training Sessions & Workshops
    existing_training = await db.training_sessions.count_documents({})
    if existing_training == 0:
        trainings = [
            {
                "_id": "training-01",
                "title": "Hands-on Workshop: Food Safety & FSSAI Registration",
                "description": "Learn how to obtain basic food registration for home pickles, spices, papad, and snacks. Live demo of online FoSCoS portal submission.",
                "category": "Food Processing",
                "trainer": "Dr. Ramesh Kulkarni",
                "organization": "Maharashtra Agricultural Development Council",
                "date": "2026-03-25",
                "start_time": "10:00 AM",
                "end_time": "01:00 PM",
                "mode": "online",
                "venue": "Google Meet / RuralConnect Live",
                "meeting_link": "https://meet.google.com/rc-food-training",
                "language": "Marathi / Hindi",
                "seats": 60,
                "deadline": "2026-03-24",
                "status": "upcoming",
                "created_at": now_str
            },
            {
                "_id": "training-02",
                "title": "Selling Handloom & Handicrafts on WhatsApp Business",
                "description": "Practical training on catalog creation, product photography with phone, broadcasting offers for Diwali & festive seasons, and UPI payment buttons.",
                "category": "Digital Marketing",
                "trainer": "Ananya Deshmukh",
                "organization": "Gramin Vikas Foundation",
                "date": "2026-03-28",
                "start_time": "02:00 PM",
                "end_time": "05:00 PM",
                "mode": "online",
                "venue": "Zoom / RuralConnect Live",
                "meeting_link": "https://zoom.us/j/rc-digital-crafts",
                "language": "Hindi / Marathi",
                "seats": 50,
                "deadline": "2026-03-27",
                "status": "upcoming",
                "created_at": now_str
            },
            {
                "_id": "training-03",
                "title": "Masterclass: PMEGP & Mudra Loan Application Without Middlemen",
                "description": "Line-by-line walk-through of the online PMEGP e-portal, preparing viable project balance sheets, and facing the banker's interview confidently.",
                "category": "Government Schemes",
                "trainer": "Priya Gaikwad",
                "organization": "District Industries Centre (DIC) Network",
                "date": "2026-04-02",
                "start_time": "11:00 AM",
                "end_time": "02:00 PM",
                "mode": "online",
                "venue": "RuralConnect Live Stream",
                "meeting_link": "https://meet.google.com/rc-loans-workshop",
                "language": "Marathi / Hindi",
                "seats": 75,
                "deadline": "2026-04-01",
                "status": "upcoming",
                "created_at": now_str
            },
            {
                "_id": "training-04",
                "title": "Field Workshop: High-Density Dairy & Goat Farming Economics",
                "description": "Practical farm tour on silage preparation, disease prevention, automated milking units, and setting up direct B2C milk sales in nearby towns.",
                "category": "Dairy & Livestock",
                "trainer": "Suresh Shirole",
                "organization": "KVK Baramati",
                "date": "2026-04-10",
                "start_time": "09:00 AM",
                "end_time": "04:00 PM",
                "mode": "offline",
                "venue": "Krishi Vigyan Kendra Demonstration Farm, Baramati, Pune",
                "meeting_link": "",
                "language": "Marathi",
                "seats": 35,
                "deadline": "2026-04-08",
                "status": "upcoming",
                "created_at": now_str
            },
            {
                "_id": "training-05",
                "title": "Packaging & Branding for Rural Home Entrepreneurs",
                "description": "Learn how small investments in eco-friendly kraft paper pouches, personalized logo stickers, and vacuum sealing multiply your product selling price.",
                "category": "Branding",
                "trainer": "Vikram Shinde",
                "organization": "Rural Artisan Guild",
                "date": "2026-04-15",
                "start_time": "02:00 PM",
                "end_time": "05:00 PM",
                "mode": "online",
                "venue": "RuralConnect Live",
                "meeting_link": "https://meet.google.com/rc-packaging-art",
                "language": "Hindi / English",
                "seats": 50,
                "deadline": "2026-04-14",
                "status": "upcoming",
                "created_at": now_str
            }
        ]
        await db.training_sessions.insert_many(trainings)

    # 6. Verified Government Schemes (Authentic schemes with factual accuracy)
    existing_schemes = await db.government_schemes.count_documents({})
    if existing_schemes == 0:
        schemes = [
            {
                "_id": "scheme-pmegp",
                "scheme_name": "Prime Minister's Employment Generation Programme (PMEGP)",
                "description": "Credit-linked subsidy scheme offering financial assistance to set up new micro-enterprises in manufacturing and services.",
                "category": "Micro Enterprise & Subsidies",
                "eligibility": "Any individual above 18 years. For manufacturing units above Rs. 10 lakh and service units above Rs. 5 lakh, minimum 8th standard pass is required. SHGs and cooperative societies are also eligible.",
                "benefits": "Subsidy rate of 25% for general category and 35% for special categories (women, SC/ST, OBC, minorities, rural areas). Maximum project cost Rs. 50 Lakh for manufacturing and Rs. 20 Lakh for services.",
                "required_documents": [
                    "Aadhaar Card",
                    "PAN Card",
                    "Caste / Category Certificate (if claiming 35% subsidy)",
                    "Education qualification mark sheet",
                    "Detailed Project Report (DPR)",
                    "Rural area certificate from Gram Panchayat"
                ],
                "application_process": "1. Prepare Detailed Project Report (DPR). 2. Submit online application on kviconline.gov.in portal. 3. Application forwarded to District Industries Centre (DIC) or KVIC. 4. Task force committee interview. 5. Sanction and disbursement by chosen partner bank.",
                "official_website": "https://www.kviconline.gov.in/pmegpeportal",
                "deadline": "Ongoing / Open round the year",
                "state": "Central / All States",
                "target_users": "Rural Entrepreneurs, Women, Youth, Self-Help Groups",
                "language": "Hindi, Marathi & English",
                "is_verified": True,
                "updated_at": "2026-03-01"
            },
            {
                "_id": "scheme-mudra",
                "scheme_name": "Pradhan Mantri Mudra Yojana (PMMY)",
                "description": "Collateral-free loans up to Rs. 20 Lakh to non-corporate, non-farm small and micro enterprises.",
                "category": "Collateral-Free Loans",
                "eligibility": "Any Indian citizen engaged in small manufacturing, processing, trading, tailoring, shopkeeping, beauty salon, or repair services.",
                "benefits": "Categorized into 3 tiers: 1. Shishu (loans up to Rs. 50,000), 2. Kishore (loans from Rs. 50,000 to Rs. 5 Lakh), 3. Tarun (loans from Rs. 5 Lakh to Rs. 20 Lakh). No collateral required.",
                "required_documents": [
                    "Identity proof (Aadhaar / Voter ID / Driving License)",
                    "Address proof (Electricity bill / Ration card)",
                    "Quotations of machinery or goods to be purchased",
                    "Business enterprise registration (Udyam Registration)"
                ],
                "application_process": "Apply via Udyami Mitra portal (udyamimitra.in) or directly walk into any public sector, private, or regional rural bank with your business plan.",
                "official_website": "https://www.mudra.org.in",
                "deadline": "Ongoing",
                "state": "Central / All States",
                "target_users": "Micro-entrepreneurs, Artisans, Small Vendors",
                "language": "Hindi & English",
                "is_verified": True,
                "updated_at": "2026-03-01"
            },
            {
                "_id": "scheme-standup",
                "scheme_name": "Stand-Up India Scheme",
                "description": "Facilitates bank loans between Rs. 10 Lakh and Rs. 1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch.",
                "category": "Women & SC/ST Enterprise",
                "eligibility": "SC/ST and/or woman entrepreneur above 18 years. In case of non-individual enterprises, at least 51% shareholding must be held by an SC/ST or woman entrepreneur. Must be a greenfield enterprise.",
                "benefits": "Composite loan (term loan + working capital) covering up to 85% of project cost, ranging from Rs. 10 Lakh to Rs. 1 Crore with concessional interest rates.",
                "required_documents": [
                    "Identity and residence proof",
                    "Proof of SC/ST or Woman ownership (Aadhaar / Caste certificate)",
                    "Project report with capital expenditure and cash flow projections",
                    "Pollution clearance / Panchayat NOC if applicable"
                ],
                "application_process": "Apply online at standupmitra.in portal or visit the nearest bank branch to connect with Lead District Manager (LDM).",
                "official_website": "https://www.standupmitra.in",
                "deadline": "Ongoing",
                "state": "Central / All States",
                "target_users": "Women Entrepreneurs, SC/ST Founders",
                "language": "Hindi & English",
                "is_verified": True,
                "updated_at": "2026-03-01"
            },
            {
                "_id": "scheme-pmfme",
                "scheme_name": "PM Formalisation of Micro Food Processing Enterprises (PMFME)",
                "description": "Provides financial, technical, and business support for the upgrade of existing micro food processing units and farmer producer organizations.",
                "category": "Food Processing",
                "eligibility": "Existing micro food processing enterprises, SHGs, FPOs, and cooperatives producing pickles, spices, flour, dairy, jaggery, and honey.",
                "benefits": "Credit-linked capital subsidy @ 35% of eligible project cost with a maximum ceiling of Rs. 10 Lakh per unit. Seed capital assistance of Rs. 40,000 per SHG member for working capital and small tools.",
                "required_documents": [
                    "Aadhaar card of entrepreneur / SHG members",
                    "Udyam registration",
                    "FSSAI license / registration copy",
                    "Bank passbook with 6 months transaction history",
                    "Food product specification and machinery quotation"
                ],
                "application_process": "Register on the MOFPI PMFME portal (pmfme.mofpi.gov.in) with assistance from District Resource Persons (DRP).",
                "official_website": "https://pmfme.mofpi.gov.in",
                "deadline": "Ongoing",
                "state": "Central & State Convergence",
                "target_users": "Food Processors, Self-Help Groups, Spices & Pickle Makers",
                "language": "Hindi & English",
                "is_verified": True,
                "updated_at": "2026-03-01"
            },
            {
                "_id": "scheme-mahila-samridhi",
                "scheme_name": "Mahila Samridhi Yojana",
                "description": "Micro-finance scheme implemented through State Channelising Agencies (SCA) to provide concessional financial assistance to women entrepreneurs from backward classes.",
                "category": "Women Welfare & Micro-credit",
                "eligibility": "Women entrepreneurs belonging to Backward Classes with family annual income below prescribed limit. Target age 18-50 years.",
                "benefits": "Loan assistance up to Rs. 1,40,000 per beneficiary at a nominal interest rate of 4% per annum. Repayment tenure up to 3 years.",
                "required_documents": [
                    "Income certificate from Tehsildar",
                    "Caste certificate",
                    "Aadhaar card and bank account details",
                    "Business proposal / quotation"
                ],
                "application_process": "Apply through District Social Welfare Office or Mahila Arthik Vikas Mahamandal (MAVIM) in Maharashtra.",
                "official_website": "https://nbcfdc.gov.in",
                "deadline": "Ongoing",
                "state": "Maharashtra & Central SCA",
                "target_users": "Rural Women, Marginalized Artisans",
                "language": "Marathi & Hindi",
                "is_verified": True,
                "updated_at": "2026-03-01"
            }
        ]
        await db.government_schemes.insert_many(schemes)

    # 7. Knowledge Base for AI RAG
    # 7. Knowledge Base for AI RAG (72 Core Multilingual Records)
    try:
        from app.knowledge_data import CORE_72_KNOWLEDGE_BASE
        for item in CORE_72_KNOWLEDGE_BASE:
            doc = {
                "_id": item["id"],
                "id": item["id"],
                "title": item["title"],
                "category": item["category"],
                "question_en": item["question_en"],
                "answer_en": item["answer_en"],
                "question_hi": item["question_hi"],
                "answer_hi": item["answer_hi"],
                "question_mr": item["question_mr"],
                "answer_mr": item["answer_mr"],
                "question": item["question_en"],
                "answer": item["answer_en"],
                "verified": item.get("verified", True),
                "is_verified": item.get("verified", True),
                "source": item.get("source", "RuralConnect Verified Advisory"),
                "updated_at": item.get("updated_at", "2026-03-01T00:00:00Z"),
                "tags": item.get("tags", [])
            }
            await db.knowledge_base.update_one({"_id": item["id"]}, {"$set": doc}, upsert=True)
        logger.info(f"Seeded/Updated {len(CORE_72_KNOWLEDGE_BASE)} multilingual knowledge base items.")
    except Exception as e:
        logger.warning(f"Failed to seed knowledge base: {e}")

    # 8. Community Posts (Authentic Indian rural entrepreneur voices)
    existing_posts = await db.community_posts.count_documents({})
    if existing_posts == 0:
        posts = [
            {
                "_id": "post-01",
                "user_id": "user-demo-01",
                "user_name": "Sunita Kamble",
                "user_business": "Kamble Spices & Pickles • Satara",
                "avatar": "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&auto=format&fit=crop&q=80",
                "content": "आज आमच्या बचत गटाने कोल्हापुरी लाल तिखट आणि लोणच्याचे पहिले ५० बॉक्स पुण्याच्या एका किराणा दुकानाला पाठवले! रुरल कनेक्टच्या डिजिटल मार्केटिंग कोर्समधील व्हॉट्सअॅप कॅटलॉग ट्रिक खूप उपयोगी पडली. धन्यवाद!",
                "image_url": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80",
                "category": "Success Story",
                "liked_by": ["user-admin-01"],
                "created_at": now_str
            },
            {
                "_id": "post-02",
                "user_id": "user-demo-02",
                "user_name": "Kavita Jadhav",
                "user_business": "Surabhi Organic Dairy • Nashik",
                "avatar": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=150&auto=format&fit=crop&q=80",
                "content": "Does anyone know if PMFME subsidy applies to small milk chilling units for a group of 5 dairy farmers? We want to avoid selling raw milk to middlemen at low rates.",
                "image_url": None,
                "category": "Question",
                "liked_by": [],
                "created_at": now_str
            },
            {
                "_id": "post-03",
                "user_id": "user-demo-03",
                "user_name": "Rukmini Shinde",
                "user_business": "Paithani Handlooms • Yeola",
                "avatar": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
                "content": "Handcrafted pure silk Paithani dupattas made by our village artisan collective. We started accepting orders across Maharashtra using simple Google Pay QR codes!",
                "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
                "category": "Product Showcase",
                "liked_by": ["user-demo-01", "user-admin-01"],
                "created_at": now_str
            }
        ]
        await db.community_posts.insert_many(posts)
    else:
        await db.community_posts.update_one({"_id": "post-01"}, {"$set": {"avatar": "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&auto=format&fit=crop&q=80"}})
        await db.community_posts.update_one({"_id": "post-02"}, {"$set": {"avatar": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=150&auto=format&fit=crop&q=80"}})
        await db.community_posts.update_one({"_id": "post-03"}, {"$set": {"avatar": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80"}})

        # Initial comment on post-02 by mentor Dr. Ramesh Kulkarni
        await db.comments.update_one(
            {"_id": "comment-01"},
            {"$set": {
                "_id": "comment-01",
                "post_id": "post-02",
                "user_id": "mentor-01",
                "user_name": "Dr. Ramesh Kulkarni (Agro Mentor)",
                "content": "Yes, Kavita ji! Under PMFME, milk chilling and value addition (ghee, paneer, curd) are covered with a 35% capital subsidy. You can book an appointment with me through the Mentors section, and I will share the exact DPR format.",
                "created_at": now_str
            }},
            upsert=True
        )

    logger.info("Seed data verification completed successfully.")

async def main():
    await connect_to_mongo()
    await seed_database()
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(main())

