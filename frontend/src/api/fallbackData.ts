import { Course, Lesson, Training, Scheme, CommunityPost, Mentor } from '../types';

export const FALLBACK_COURSES: Course[] = [
  {
    id: 'course-entrepreneurship',
    title: 'Entrepreneurship',
    description: 'Fundamental entrepreneurship principles, business mindset, market research, and scaling strategies for Indian rural founders.',
    category: 'Entrepreneurship',
    thumbnail: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80',
    level: 'Beginner',
    language: 'Hindi / English',
    total_duration_minutes: 95,
    total_lessons: 3,
    progress_percentage: 0,
    completed_lessons: 0,
  },
  {
    id: 'course-digital-marketing',
    title: 'Digital Marketing',
    description: 'Master online presence, social media sales, WhatsApp Business communication, and digital payments for rural micro-enterprises.',
    category: 'Digital Marketing',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67e5572263?w=600&auto=format&fit=crop&q=80',
    level: 'Beginner',
    language: 'Hindi / English',
    total_duration_minutes: 65,
    total_lessons: 2,
    progress_percentage: 0,
    completed_lessons: 0,
  },
  {
    id: 'course-rural-women',
    title: 'Rural & Women Entrepreneurship Basics',
    description: 'Step-by-step practical guide on Self-Help Groups (SHG), micro-enterprise bookkeeping, branding, hygiene standards, and government loans.',
    category: 'Rural & Women Entrepreneurship',
    thumbnail: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&auto=format&fit=crop&q=80',
    level: 'Beginner',
    language: 'Marathi / Hindi',
    total_duration_minutes: 110,
    total_lessons: 3,
    progress_percentage: 0,
    completed_lessons: 0,
  },
];

export const FALLBACK_LESSONS: Record<string, Lesson[]> = {
  'course-entrepreneurship': [
    {
      id: 'lesson-ent-01',
      course_id: 'course-entrepreneurship',
      lesson_number: 1,
      lesson_title: 'Entrepreneurship Lecture 1',
      description: 'Introduction to entrepreneurial mindset, identifying community needs, and building sustainable village business models.',
      video_source_type: 'youtube',
      video_url: 'https://youtu.be/kAAO-qO2kFg',
      embed_url: 'https://www.youtube.com/embed/kAAO-qO2kFg',
      provider: 'YouTube',
      language: 'Hindi / English',
      duration_minutes: 32,
      learning_objectives: [
        'Understand what makes an entrepreneur succeed in local markets',
        'Identify viable customer pain points in your taluka or village',
        'Assess risk, initial capital requirements, and profitability',
      ],
      is_embeddable: true,
      is_verified: true,
      order: 1,
      text_content: 'In this foundational lecture, we explore how successful rural enterprises begin with simple observation of local needs.',
      is_completed: false,
    },
    {
      id: 'lesson-ent-02',
      course_id: 'course-entrepreneurship',
      lesson_number: 2,
      lesson_title: 'Entrepreneurship Lecture 2',
      description: 'Business planning, customer acquisition strategies, and cost calculation for small products and services.',
      video_source_type: 'youtube',
      video_url: 'https://youtu.be/pC5l5j2u9SQ',
      embed_url: 'https://www.youtube.com/embed/pC5l5j2u9SQ',
      provider: 'YouTube',
      language: 'Hindi / English',
      duration_minutes: 35,
      learning_objectives: [
        'How to calculate cost price, markup, and selling price accurately',
        'Understanding cash flow cycles in rural weekly markets (haats)',
        'Building repeat business through trust and product consistency',
      ],
      is_embeddable: true,
      is_verified: true,
      order: 2,
      text_content: 'Careful financial planning is the lifeblood of rural entrepreneurship. Record daily costs and separate personal savings.',
      is_completed: false,
    },
    {
      id: 'lesson-ent-03',
      course_id: 'course-entrepreneurship',
      lesson_number: 3,
      lesson_title: 'Entrepreneurship Lecture 3',
      description: 'Scaling your venture, overcoming supply chain challenges, and hiring local community talent.',
      video_source_type: 'youtube',
      video_url: 'https://youtu.be/1Tf9NHbRPYM',
      embed_url: 'https://www.youtube.com/embed/1Tf9NHbRPYM',
      provider: 'YouTube',
      language: 'Hindi / English',
      duration_minutes: 28,
      learning_objectives: [
        'Expanding from one village to nearby towns and talukas',
        'Navigating local logistics, transport, and cooperative delivery',
        'Leveraging government micro-credit for equipment expansion',
      ],
      is_embeddable: true,
      is_verified: true,
      order: 3,
      text_content: 'Scaling up requires structured delegation and collective working models.',
      is_completed: false,
    },
  ],
  'course-digital-marketing': [
    {
      id: 'lesson-dm-01',
      course_id: 'course-digital-marketing',
      lesson_number: 1,
      lesson_title: 'Digital Marketing Lecture 1',
      description: 'Foundations of digital marketing, setting up a professional mobile presence, and reaching regional customers.',
      video_source_type: 'youtube',
      video_url: 'https://youtu.be/ZucOiqzRznA',
      embed_url: 'https://www.youtube.com/embed/ZucOiqzRznA',
      provider: 'YouTube',
      language: 'Hindi / English',
      duration_minutes: 31,
      learning_objectives: [
        'Creating a verified Google Business Profile for your shop or workshop',
        'Using smartphone cameras for high-quality natural light product photos',
        'Setting up WhatsApp Business with catalog, auto-reply, and quick tags',
      ],
      is_embeddable: true,
      is_verified: true,
      order: 1,
      text_content: 'With mobile connectivity across rural India, your smartphone is your complete marketing agency.',
      is_completed: false,
    },
    {
      id: 'lesson-dm-02',
      course_id: 'course-digital-marketing',
      lesson_number: 2,
      lesson_title: 'Digital Marketing Lecture 2',
      description: 'WhatsApp Business selling, social media reels, and digital UPI payments for hassle-free orders.',
      video_source_type: 'youtube',
      video_url: 'https://youtu.be/OC8s2_VSQFA',
      embed_url: 'https://www.youtube.com/embed/OC8s2_VSQFA',
      provider: 'YouTube',
      language: 'Hindi / English',
      duration_minutes: 34,
      learning_objectives: [
        'Showcasing behind-the-scenes craft videos on Instagram and YouTube Shorts',
        'Collecting advance payments securely via UPI QR codes',
        'Handling customer inquiries politely and tracking dispatch parcels',
      ],
      is_embeddable: true,
      is_verified: true,
      order: 2,
      text_content: 'Short, authentic clips of craft making connect deeply with urban consumers looking for genuine quality.',
      is_completed: false,
    },
  ],
  'course-rural-women': [
    {
      id: 'lesson-rwe-01',
      course_id: 'course-rural-women',
      lesson_number: 1,
      lesson_title: 'Self-Help Groups (SHG) & Micro-Finance',
      description: 'How to register and operate a vibrant Mahila Bachat Gat, maintain registers, and access subsidized bank loans.',
      video_source_type: 'youtube',
      video_url: 'https://youtu.be/pC5l5j2u9SQ',
      embed_url: 'https://www.youtube.com/embed/pC5l5j2u9SQ',
      provider: 'YouTube',
      language: 'Marathi / Hindi',
      duration_minutes: 35,
      learning_objectives: [
        'Forming a 10 to 20 member Mahila Bachat Gat',
        'Bookkeeping best practices and monthly savings discipline',
        'Applying for bank linkage loans under NRLM',
      ],
      is_embeddable: true,
      is_verified: true,
      order: 1,
      text_content: 'A Self-Help Group (SHG) empowers women to pool micro-savings and build bank creditworthiness.',
      is_completed: false,
    },
    {
      id: 'lesson-rwe-02',
      course_id: 'course-rural-women',
      lesson_number: 2,
      lesson_title: 'Branding, Packaging & Food Safety (FSSAI)',
      description: 'Step-by-step guidance on basic packaging, moisture control, labeling requirements, and free/low-cost FSSAI registration.',
      video_source_type: 'youtube',
      video_url: 'https://youtu.be/kAAO-qO2kFg',
      embed_url: 'https://www.youtube.com/embed/kAAO-qO2kFg',
      provider: 'YouTube',
      language: 'Marathi / Hindi',
      duration_minutes: 40,
      learning_objectives: [
        'Simple vacuum sealers and food-grade pouches',
        'Required label details: Net weight, manufacturing date, ingredients, MRP',
        'Applying for FSSAI basic registration for turnover under 12 Lakhs',
      ],
      is_embeddable: true,
      is_verified: true,
      order: 2,
      text_content: 'A clean, well-labeled package transforms a homemade item into a trusted retail brand.',
      is_completed: false,
    },
    {
      id: 'lesson-rwe-03',
      course_id: 'course-rural-women',
      lesson_number: 3,
      lesson_title: 'Accessing Subsidized Government Schemes',
      description: 'Understanding PMEGP, Mudra, and Stand-Up India schemes to finance machinery and working capital.',
      video_source_type: 'youtube',
      video_url: 'https://youtu.be/1Tf9NHbRPYM',
      embed_url: 'https://www.youtube.com/embed/1Tf9NHbRPYM',
      provider: 'YouTube',
      language: 'Marathi / Hindi',
      duration_minutes: 35,
      learning_objectives: [
        'Preparing a simple Project Report (DPR)',
        'Submitting applications through KVIB / DIC portals',
        'Tracking loan approval and subsidy claims without middlemen',
      ],
      is_embeddable: true,
      is_verified: true,
      order: 3,
      text_content: 'Learn how to apply directly through government portals to secure 35% subsidies.',
      is_completed: false,
    },
  ],
};

export const FALLBACK_TRAININGS: Training[] = [
  {
    id: 'tr-01',
    title: 'Food Packaging & FSSAI Compliance for Rural Women',
    description: 'Learn vacuum sealing, labeling compliance, and how to apply for FSSAI food licenses online without paying agents.',
    category: 'Food Processing',
    trainer: 'Dr. Sunita Kulkarni (Food Tech Scientist)',
    organization: 'Maharashtra Agro Industries Development Corp',
    date: '2026-03-22',
    start_time: '10:00 AM',
    end_time: '12:30 PM',
    mode: 'online',
    venue: 'Google Meet (Interactive Live Session)',
    meeting_link: 'https://meet.google.com/demo-ruralconnect',
    language: 'Marathi / Hindi',
    seats: 60,
    available_seats: 24,
    deadline: '2026-03-21',
    status: 'upcoming',
    is_registered: false,
  },
  {
    id: 'tr-02',
    title: 'WhatsApp Business & Social Selling Masterclass',
    description: 'Hands-on workshop on setting up product catalogs, taking payments via UPI QR, and getting local orders.',
    category: 'Digital Marketing',
    trainer: 'Amit Deshmukh (Rural Marketing Lead)',
    organization: 'Rural Commerce Foundation',
    date: '2026-03-26',
    start_time: '02:00 PM',
    end_time: '04:00 PM',
    mode: 'online',
    venue: 'Zoom Live Interactive Session',
    meeting_link: 'https://zoom.us/demo-ruralconnect',
    language: 'Hindi',
    seats: 80,
    available_seats: 38,
    deadline: '2026-03-25',
    status: 'upcoming',
    is_registered: false,
  },
  {
    id: 'tr-03',
    title: 'PMEGP & Mudra Loan Application Assistance Camp',
    description: 'Offline district workshop: Get step-by-step guidance on writing DPR, uploading documents, and bank coordination.',
    category: 'Government Schemes',
    trainer: 'Ramesh Patil (DIC General Manager)',
    organization: 'District Industries Centre (DIC) Pune',
    date: '2026-04-05',
    start_time: '09:30 AM',
    end_time: '04:30 PM',
    mode: 'offline',
    venue: 'Zilla Parishad Auditorium, Shivaji Nagar, Pune',
    language: 'Marathi / English',
    seats: 50,
    available_seats: 12,
    deadline: '2026-04-03',
    status: 'upcoming',
    is_registered: false,
  },
  {
    id: 'tr-04',
    title: 'Organic Dairy By-products (Paneer, Ghee, Khoa) Processing',
    description: 'Increase farm income 3x by converting raw cow/buffalo milk into value-added packaged dairy delicacies.',
    category: 'Dairy & Livestock',
    trainer: 'Prof. Anant Shinde',
    organization: 'National Dairy Development Board (NDDB)',
    date: '2026-04-12',
    start_time: '11:00 AM',
    end_time: '01:30 PM',
    mode: 'online',
    venue: 'Online Video Workshop',
    meeting_link: 'https://meet.google.com/demo-dairy-nddb',
    language: 'Hindi / Marathi',
    seats: 70,
    available_seats: 45,
    deadline: '2026-04-10',
    status: 'upcoming',
    is_registered: false,
  },
  {
    id: 'tr-05',
    title: 'Handloom & Khadi Branding for Metropolitan Markets',
    description: 'Understanding urban consumer tastes, eco-friendly natural dyes, and pricing products for upscale exhibitions.',
    category: 'Branding',
    trainer: 'Meera Sengupta (Textile Designer)',
    organization: 'Crafts Council of Western India',
    date: '2026-04-18',
    start_time: '03:00 PM',
    end_time: '05:00 PM',
    mode: 'online',
    venue: 'Webinar Platform',
    meeting_link: 'https://meet.google.com/demo-craft-branding',
    language: 'English / Hindi',
    seats: 40,
    available_seats: 19,
    deadline: '2026-04-16',
    status: 'upcoming',
    is_registered: false,
  },
];

export const FALLBACK_SCHEMES: Scheme[] = [
  {
    id: 'scheme-pmegp',
    scheme_name: "Prime Minister's Employment Generation Programme (PMEGP)",
    description: "Credit-linked subsidy programme to generate continuous self-employment opportunities in rural and urban areas through micro-enterprises.",
    category: 'Micro Enterprise & Subsidies',
    eligibility: 'Individuals aged 18+; at least 8th pass for projects above ₹10 Lakh in manufacturing and ₹5 Lakh in service. Self Help Groups (SHGs) are also eligible.',
    benefits: 'Up to ₹50 Lakh loan for manufacturing, ₹20 Lakh for service. Rural general category gets 25% subsidy; rural women and special categories get 35% margin money subsidy.',
    required_documents: ['Aadhaar Card', 'PAN Card', 'Educational Certificate', 'Detailed Project Report (DPR)', 'Caste/Category Certificate (if applicable)'],
    application_process: 'Apply online directly on the official KVIC e-portal (kviconline.gov.in). Application is reviewed by District Task Force and forwarded to designated bank.',
    official_website: 'https://www.kviconline.gov.in/pmegpeportal/',
    deadline: 'Open throughout the fiscal year (Ongoing)',
    state: 'Central / All India',
    target_users: 'Rural women, aspiring entrepreneurs, self-help groups, village artisans',
    language: 'All Languages',
    is_verified: true,
    updated_at: '2026-03-01',
  },
  {
    id: 'scheme-mudra',
    scheme_name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    description: 'Provides loans up to ₹10 Lakhs to non-corporate, non-farm small/micro enterprises without requiring third-party collateral or security.',
    category: 'Collateral-Free Loans',
    eligibility: 'Any Indian citizen who has a business plan for non-farm sector income-generating activities such as manufacturing, processing, trading, or service sector.',
    benefits: 'Zero collateral required. Shishu: up to ₹50,000; Kishore: ₹50,000 to ₹5 Lakh; Tarun: ₹5 Lakh to ₹10 Lakh. Subsidized interest rates with flexible repayment.',
    required_documents: ['Identity Proof (Voter ID/Aadhaar/Driving License)', 'Proof of Residence', 'Quotation of machinery/items to be purchased', 'Business Address Proof'],
    application_process: 'Apply through any Commercial Bank, RRB, Small Finance Bank, or online via the Udyamimitra portal (udyamimitra.in).',
    official_website: 'https://www.mudra.org.in/',
    deadline: 'Ongoing Scheme',
    state: 'Central / All India',
    target_users: 'Micro shopkeepers, fruit/vegetable vendors, small food processors, artisanal units',
    language: 'All Languages',
    is_verified: true,
    updated_at: '2026-03-01',
  },
  {
    id: 'scheme-pmfme',
    scheme_name: 'PM Formalisation of Micro food processing Enterprises (PMFME)',
    description: 'Centrally sponsored scheme to enhance the competitiveness of individual micro-enterprises in the unorganized food processing segment.',
    category: 'Food Processing',
    eligibility: 'Existing individual micro food processing units, FPOs, SHGs, and Producer Cooperatives. One District One Product (ODOP) focus.',
    benefits: 'Credit-linked capital subsidy @ 35% of eligible project cost with a maximum ceiling of ₹10 Lakh per unit. Seed capital of ₹40,000 per SHG member for working capital.',
    required_documents: ['Aadhaar & PAN', 'Bank statement of last 6 months', 'Electricity bill / proof of premises', 'Detailed food processing DPR'],
    application_process: 'Submit application on the official PMFME portal (pmfme.mofpi.gov.in). District Resource Persons (DRP) provide free handholding support.',
    official_website: 'https://pmfme.mofpi.gov.in/',
    deadline: 'Ongoing',
    state: 'Central / All India',
    target_users: 'Pickle, spice, flour, dairy, and snack manufacturers in rural clusters',
    language: 'All Languages',
    is_verified: true,
    updated_at: '2026-03-01',
  },
  {
    id: 'scheme-standup',
    scheme_name: 'Stand-Up India Scheme',
    description: 'Facilitates bank loans between ₹10 Lakh and ₹1 Crore to at least one SC or ST borrower and at least one woman borrower per bank branch.',
    category: 'Women & SC/ST Enterprise',
    eligibility: 'SC/ST and/or woman entrepreneur above 18 years of age. Enterprise must be a greenfield project in manufacturing, services, or trading.',
    benefits: 'Composite loan (term loan and working capital) between ₹10 Lakh and ₹100 Lakh to cover up to 85% of total project cost.',
    required_documents: ['Identity and address proof', 'Caste certificate (for SC/ST)', 'Project report and balance sheet', 'Pollution NOC if applicable'],
    application_process: 'Apply either directly at bank branches or through the Stand-Up India portal (standupmitra.in).',
    official_website: 'https://www.standupmitra.in/',
    deadline: 'Ongoing',
    state: 'Central / All India',
    target_users: 'Women entrepreneurs setting up manufacturing or agro-processing facilities',
    language: 'All Languages',
    is_verified: true,
    updated_at: '2026-03-01',
  },
  {
    id: 'scheme-mahila-samridhi',
    scheme_name: 'Mahila Samridhi Yojana (Micro-finance for Women)',
    description: 'Provides micro-credit to women entrepreneurs belonging to backward classes and rural families with subsidized interest rates.',
    category: 'Women Welfare & Micro-credit',
    eligibility: 'Women entrepreneurs from rural areas with family income below poverty line or low-income limits. Implemented through Channelizing Agencies.',
    benefits: 'Loans up to ₹1,40,000 per beneficiary at a very low interest rate of 4% per annum. No collateral required.',
    required_documents: ['Ration Card / Income Certificate', 'Aadhaar Card', 'Self-declaration of skill / trade'],
    application_process: 'Apply via the State Women Development Corporation (e.g. MAVIM in Maharashtra) or nominated District Backward Class Welfare offices.',
    official_website: 'https://nbcfdc.gov.in/',
    deadline: 'Ongoing',
    state: 'Maharashtra & All India',
    target_users: 'Rural women micro-entrepreneurs, tailoring, pottery, and poultry farmers',
    language: 'All Languages',
    is_verified: true,
    updated_at: '2026-03-01',
  },
];

export const FALLBACK_MENTORS: Mentor[] = [
  {
    id: 'mentor-01',
    name: 'Dr. Ramesh Kulkarni',
    photo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&auto=format&fit=crop&q=80',
    expertise: 'Agro-Processing & Dairy Farming',
    experience: '18+ years',
    qualification: 'Ph.D. in Agriculture Economics (MPKV Rahuri)',
    languages: ['Marathi', 'Hindi', 'English'],
    location: 'Pune, Maharashtra',
    availability: 'Mon, Wed, Fri (4 PM - 7 PM)',
    rating: 4.9,
    sessions: 142,
    bio: 'Specializes in helping farmer producer companies (FPC) and rural dairy farmers set up cold storage, milk chilling plants, and organic certification.',
    is_verified: true,
  },
  {
    id: 'mentor-02',
    name: 'Sunita Patil',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
    expertise: 'Self-Help Groups & Micro-Finance',
    experience: '14+ years',
    qualification: 'M.S.W., Rural Livelihoods Consultant',
    languages: ['Marathi', 'Hindi'],
    location: 'Kolhapur, Maharashtra',
    availability: 'Tue, Thu, Sat (10 AM - 1 PM)',
    rating: 5.0,
    sessions: 218,
    bio: 'Trained over 400 women-led self-help groups across western Maharashtra in micro-savings, bank credit linkage, and conflict resolution.',
    is_verified: true,
  },
  {
    id: 'mentor-03',
    name: 'Vikram Shinde',
    photo: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&auto=format&fit=crop&q=80',
    expertise: 'Handicrafts, Textiles & Retail Branding',
    experience: '12+ years',
    qualification: 'National Institute of Design (NID) Alum',
    languages: ['Hindi', 'Marathi', 'English'],
    location: 'Nashik, Maharashtra',
    availability: 'Mon to Fri (5 PM - 8 PM)',
    rating: 4.8,
    sessions: 98,
    bio: 'Helps Paithani weavers, bamboo artisans, and pottery collectives modernise design aesthetics, packaging, and showcase in national craft exhibitions.',
    is_verified: true,
  },
  {
    id: 'mentor-04',
    name: 'Ananya Deshmukh',
    photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&auto=format&fit=crop&q=80',
    expertise: 'Digital Marketing & WhatsApp Commerce',
    experience: '9+ years',
    qualification: 'MBA Marketing (Symbiosis Pune)',
    languages: ['Marathi', 'Hindi', 'English'],
    location: 'Aurangabad (Chhatrapati Sambhajinagar)',
    availability: 'Wed, Sat, Sun (2 PM - 6 PM)',
    rating: 4.9,
    sessions: 165,
    bio: 'Digital growth strategist dedicated to onboarding rural tier-3 and village entrepreneurs onto social media storefronts and hyperlocal delivery apps.',
    is_verified: true,
  },
  {
    id: 'mentor-05',
    name: 'Priya Gaikwad',
    photo: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80',
    expertise: 'Government Schemes & Bank Loans',
    experience: '15+ years',
    qualification: 'Former Lead Bank Manager (Bank of Maharashtra)',
    languages: ['Marathi', 'Hindi', 'English'],
    location: 'Satara, Maharashtra',
    availability: 'Mon, Thu, Sat (3 PM - 6 PM)',
    rating: 5.0,
    sessions: 310,
    bio: 'Expert in PMEGP and Mudra loan documentation, project report preparation, and bank interview guidance for rural women entrepreneurs.',
    is_verified: true,
  },
  {
    id: 'mentor-06',
    name: 'Suresh Jadhav',
    photo: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&auto=format&fit=crop&q=80',
    expertise: 'Organic Farming & Solar Schemes',
    experience: '16+ years',
    qualification: 'M.Sc. Horticulture & Certified Organic Auditor',
    languages: ['Marathi', 'Hindi'],
    location: 'Sangli, Maharashtra',
    availability: 'Mon, Wed, Sat (9 AM - 12 PM)',
    rating: 4.9,
    sessions: 184,
    bio: 'Pioneer in organic vermicompost, greenhouse drip irrigation, and availing PM-KUSUM 90% solar pump government subsidies for farmers.',
    is_verified: true,
  },
  {
    id: 'mentor-07',
    name: 'Dr. Meera Joshi',
    photo: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&auto=format&fit=crop&q=80',
    expertise: 'Millet Processing & FSSAI Licensing',
    experience: '11+ years',
    qualification: 'Food Technologist (CFTRI Mysore)',
    languages: ['Marathi', 'Hindi', 'English'],
    location: 'Nagpur, Maharashtra',
    availability: 'Tue, Thu, Fri (3 PM - 6 PM)',
    rating: 4.9,
    sessions: 126,
    bio: 'Consultant for Shree Anna millets value addition, bakery items, shelf-life testing, and obtaining FoSCoS state & basic FSSAI licenses.',
    is_verified: true,
  },
  {
    id: 'mentor-08',
    name: 'Dr. Arjun Rathod',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    expertise: 'Poultry & Goat Rearing Micro-Enterprises',
    experience: '13+ years',
    qualification: 'B.V.Sc & A.H. (Veterinary Consultant)',
    languages: ['Marathi', 'Hindi', 'English'],
    location: 'Amravati, Maharashtra',
    availability: 'Mon to Fri (11 AM - 2 PM)',
    rating: 4.8,
    sessions: 152,
    bio: 'Advises farmers on disease-resistant Kadaknath / Desi poultry breeds, Osmanabadi stall-fed goat rearing sheds, and vaccination management.',
    is_verified: true,
  },
  {
    id: 'mentor-09',
    name: 'Kavita Choudhary',
    photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&auto=format&fit=crop&q=80',
    expertise: 'Rural Women SHG Federation & Lakhpati Didi',
    experience: '17+ years',
    qualification: 'NRLM Master Trainer & Social Entrepreneur',
    languages: ['Marathi', 'Hindi'],
    location: 'Solapur, Maharashtra',
    availability: 'Tue, Wed, Sat (1 PM - 4 PM)',
    rating: 5.0,
    sessions: 275,
    bio: 'National mentor for women federation empowerment, community revolving funds, and Lakhpati Didi business model implementation in rural areas.',
    is_verified: true,
  },
];

export const FALLBACK_POSTS: CommunityPost[] = [
  {
    id: 'post-01',
    user_id: 'user-demo-01',
    user_name: 'Sunita Kamble',
    user_business: 'Organic Food Processing • Satara',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&auto=format&fit=crop&q=80',
    content: '🎉 आमच्या महिला बचत गटाने या महिन्यात ५० किलो सेंद्रिय हळद पावडर आणि आवळा कॅण्डी तयार केली आहे! व्हॉट्सअॅप बिझनेसवरून आम्हाला पुण्यामधून १५ नवीन ऑर्डर्स मिळाल्या. धन्यवाद रुरल कनेक्ट!',
    image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    category: 'Success Story',
    likes_count: 24,
    comments_count: 5,
    is_liked: false,
    comments: [
      {
        id: 'c-01',
        post_id: 'post-01',
        user_id: 'user-02',
        user_name: 'Kavita Jadhav',
        content: 'खूप छान ताई! आम्हाला हळद कशी मागवता येईल?',
        created_at: '2026-03-01T14:30:00Z',
      },
    ],
    created_at: '2026-03-01T12:00:00Z',
  },
  {
    id: 'post-02',
    user_id: 'user-demo-02',
    user_name: 'Rekha Patil',
    user_business: 'Handmade Bamboo Crafts • Kolhapur',
    avatar: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=150&auto=format&fit=crop&q=80',
    content: 'PMEGP योजनेतून ३५% सबसिडीवर बांबू प्रक्रिया मशीनसाठी अर्ज केला होता. बँकेकडून नुकतेच कर्ज मंजूर झाले आहे! कागदपत्रांबद्दल कोणाला काही मदत हवी असल्यास नक्की विचारा.',
    image_url: null,
    category: 'Discussion',
    likes_count: 18,
    comments_count: 3,
    is_liked: false,
    comments: [],
    created_at: '2026-02-28T09:15:00Z',
  },
  {
    id: 'post-03',
    user_id: 'user-demo-03',
    user_name: 'Pooja Gaikwad',
    user_business: 'Herbal Soaps & Cosmetics • Pune',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    content: 'नवीन लेबलिंग आणि इको-फ्रेंडली पॅकेजिंग डिझाइन केले आहे. ग्राहकांना प्लास्टिक-मुक्त पॅकिंग खूप आवडत आहे. फोटो पाहून आपले मत नक्की कळवा!',
    image_url: 'https://images.unsplash.com/photo-1608248597359-2917e889099e?w=800&auto=format&fit=crop&q=80',
    category: 'Product Showcase',
    likes_count: 31,
    comments_count: 7,
    is_liked: false,
    comments: [],
    created_at: '2026-02-27T16:45:00Z',
  },
];

export function getFallbackChatResponse(query: string, language: string = 'en'): { reply: string; sources: string[]; suggested_questions: string[] } {
  const q = query.toLowerCase().trim();

  const isWhatsApp = q.includes('whatsapp') || q.includes('व्हॉट्सअॅप') || q.includes('व्हॉट्सॅप') || q.includes('व्हाट्सएप') || q.includes('catalog') || q.includes('कैटलॉग') || q.includes('कॅटलॉग') || q.includes('broadcast');
  const isFood = q.includes('food') || q.includes('खाद्य') || q.includes('लोणचे') || q.includes('पापड') || q.includes('मसाले') || q.includes('pickle') || q.includes('fssai') || q.includes('बेकरी') || q.includes('तेल');
  const isPoultry = q.includes('poultry') || q.includes('chicken') || q.includes('kadaknath') || q.includes('egg') || q.includes('कुक्कुटपालन') || q.includes('कोंबडी') || q.includes('कडकनाथ') || q.includes('मुर्गी');
  const isDairy = q.includes('dairy') || q.includes('milk') || q.includes('cow') || q.includes('buffalo') || q.includes('ghee') || q.includes('paneer') || q.includes('दुग्ध') || q.includes('गाय') || q.includes('म्हैस') || q.includes('दूध') || q.includes('पनीर') || q.includes('डेअरी');
  const isGoat = q.includes('goat') || q.includes('sheep') || q.includes('शेळी') || q.includes('बकरी') || q.includes('बोकड') || q.includes('मेंढी');
  const isPmegp = q.includes('pmegp') || q.includes('subsidy') || q.includes('सबसिडी') || q.includes('अनुदान') || q.includes('खादी');
  const isMudra = q.includes('mudra') || q.includes('मुद्रा') || q.includes('loan') || q.includes('कर्ज') || q.includes('ऋण');
  const isShg = q.includes('shg') || q.includes('बचत') || q.includes('bachat') || q.includes('lakhpati') || q.includes('लखपती');
  const isHandicraft = q.includes('handicraft') || q.includes('weaving') || q.includes('saree') || q.includes('tailor') || q.includes('हस्तकला') || q.includes('शिलाई') || q.includes('हातमाग') || q.includes('पैठणी');

  let reply = '';
  let sources: string[] = ['RuralConnect Verified Knowledge Base'];

  if (isWhatsApp) {
    sources.push('RuralConnect Digital Commerce Academy', 'WhatsApp Business Guidelines');
    if (language === 'mr') {
      reply = `**ग्रामीण व नवउद्योजकांसाठी WhatsApp Business द्वारे विक्री वाढवण्याचे परिपूर्ण मार्गदर्शन:**\n\n` +
        `1. **WhatsApp Business अ‍ॅप सेट करणे:** गुगल प्ले स्टोअरवरून मोफत WhatsApp Business डाऊनलोड करा. आपल्या व्यवसायाचे नाव, लोगो, श्रेणी (उदा. Grocery / Food / Handicrafts), कामाची वेळ आणि दुकानाचा पत्ता भरा.\n` +
        `2. **उत्पादनांचा डिजिटल कॅटलॉग (Catalog):** कॅटलॉग विभागात जाऊन प्रत्येक उत्पादनाचे सूर्यप्रकाशात काढलेले २-३ स्वच्छ फोटो, अचूक नाव, वजन (उदा. ५०० ग्रॅम / १ किलो) आणि स्पष्ट किंमत (₹) जोडा. ग्राहकांना थेट कॅटलॉग लिंक पाठवता येते.\n` +
        `3. **त्वरित उत्तरे (Quick Replies):** वारंवार विचारल्या जाणाऱ्या प्रश्नांसाठी शॉर्टकट तयार करा (उदा. \`/price\` दाबताच संपूर्ण दरपत्रक, \`/account\` दाबताच बँक तपशील व UPI पाठवले जाईल).\n` +
        `4. **स्वयंचलित संदेश (Automated Greeting & Away Messages):** नवीन ग्राहकाने पहिला मेसेज करताच 'स्वागत संदेश' त्वरित पाठवा आणि कामाच्या वेळेबाहेर 'अवे मेसेज' चालू ठेवा.\n` +
        `5. **ग्राहकांचे वर्गीकरण (Labels):** ग्राहकांना रंगीबेरंगी लेबल्स लावा: 'नवीन ग्राहक', 'ऑर्डर बाकी', 'पैसे आले', 'माल पाठवला' - यामुळे कोणाकडून पैसे बाकी आहेत हे एका नजरेत कळते.\n` +
        `6. **ब्रॉडकास्ट यादी (Broadcast Lists):** ज्यांनी आपला नंबर सेव्ह केला आहे अशा ग्राहकांची २०-५० जणांची यादी करा. दर आठवड्याला नवीन ताजी उत्पादने किंवा सणांची विशेष ऑफर पाठवा (स्पॅमिंग टाळा).\n` +
        `7. **UPI पेमेंट व स्टेटस स्टोरीज (Status Updates):** दररोज सकाळी उत्पादने पॅक करतानाचे किंवा तयार करतानाचे १५ सेकंदांचे व्हिडिओ स्टेटसवर ठेवा आणि खाली Google Pay/PhonePe QR कोड द्या जेणेकरून ग्राहक आगाऊ रक्कम भरून बुकिंग करतील.`;
    } else if (language === 'hi') {
      reply = `**ग्रामीण व छोटे उद्यमियों के लिए WhatsApp Business से बिक्री बढ़ाने की संपूर्ण गाइड:**\n\n` +
        `1. **WhatsApp Business प्रोफाइल:** प्ले स्टोर से फ्री बिजनेस ऐप डाउनलोड करें। अपना व्यावसायिक नाम, प्रोफाइल फोटो, व्यवसाय विवरण, कार्य समय और पता सेट करें।\n` +
        `2. **डिजिटल प्रोडक्ट कैटलॉग (Catalog):** अपने उत्पादों की अच्छी रोशनी में खींची गई फोटो, सही नाम, वजन (उदा. 500g/1kg) और तय कीमत (₹) के साथ कैटलॉग जोड़ें। ग्राहक एक क्लिक पर उत्पाद चुन सकते हैं।\n` +
        `3. **त्वरित उत्तर (Quick Replies):** बार-बार पूछे जाने वाले उत्तरों के लिए शॉर्टकट बनाएं (जैसे \`/rate\` टाइप करने पर रेट लिस्ट या \`/pay\` पर पेमेंट जानकारी तुरंत चली जाए)।\n` +
        `4. **ऑटोमेटेड मैसेजिंग (Greeting & Away):** नए ग्राहकों के लिए तुरंत स्वागत संदेश सेट करें और दुकान बंद होने पर ऑटो-रिप्लाई चालू रखें।\n` +
        `5. **कस्टमर लेबल्स (Labels):** ग्राहकों को लेबल्स से व्यवस्थित करें: 'नया ग्राहक', 'भुगतान लंबित', 'ऑर्डर तैयार', 'पार्सल रवाना'। इससे हिसाब में कभी गलती नहीं होती।\n` +
        `6. **ब्रॉडकास्ट लिस्ट (Broadcast):** नियमित ग्राहकों की ब्रॉडकास्ट लिस्ट बनाएं और हफ्ते में एक बार ताज़ा माल या छूट की जानकारी भेजें।\n` +
        `7. **UPI पेमेंट और स्टेटस मार्केटिंग:** PhonePe / Google Pay QR कोड से एडवांस पेमेंट लें। रोज़ाना काम के छोटे-छोटे वीडियो (Shorts) व्हाट्सएप स्टेटस पर शेयर करें।`;
    } else {
      reply = `**Mastering WhatsApp Business for Rural & Micro-Enterprises:**\n\n` +
        `1. **Setup Professional Business Profile:** Install WhatsApp Business (free). Add your official venture name, clear brand logo, business category, business hours, and location address.\n` +
        `2. **Build a Crisp Product Catalog:** In Catalog Manager, upload high-resolution daylight photos, product title, unit weights (e.g., 250g, 1kg), clear descriptions, and fixed prices in ₹. Customers can browse and add items to a cart.\n` +
        `3. **Configure Quick Replies:** Save canned shortcuts for repetitive inquiries (e.g., \`/pricing\` sends price list, \`/pay\` sends UPI details, \`/shipping\` gives delivery timelines).\n` +
        `4. **Automated Greeting & Away Messages:** Instantly welcome first-time contacts with a warm greeting and set automated out-of-office responses during non-working hours.\n` +
        `5. **Organize Contacts with Color-Coded Labels:** Tag chats with labels like 'New Inquiry', 'Payment Pending', 'Order Confirmed', 'Dispatched', and 'Repeat Customer' for spotless order tracking.\n` +
        `6. **Targeted Broadcast Lists:** Send weekly fresh arrivals or seasonal festive offers to customers who have saved your number (avoid spam to protect your account).\n` +
        `7. **UPI Digital Payments & Status Stories:** Share PhonePe/Google Pay/Paytm QR codes for instant prepayment. Post 15-second behind-the-scenes preparation clips to WhatsApp Status daily to build customer trust.`;
    }
  } else if (isPoultry) {
    sources.push('National Livestock Mission (NLM)', 'NABARD Backyard Poultry Guidelines');
    if (language === 'mr') {
      reply = `**ग्रामीण भागात परसातील कुक्कुटपालन (Poultry / Kadaknath) नियोजन:**\n\n` +
        `1. **जातींची निवड:** गावरान (Desi), कडकनाथ (Kadaknath), किंवा कावेरी/ग्रामप्रिया या रोगप्रतिकारक जाती निवडा.\n` +
        `2. **शेड व्यवस्थापन:** १०० पक्षांसाठी सुमारे १५०-२०० चौ.फूट हवेशीर शेड पुरेसे असते. जमिनीवर २-३ इंच भाताचा भुसा टाका.\n` +
        `3. **खाद्य व्यवस्थापन:** परसातील मोकळे खाद्य सोबत मका, सोयाबीन पेंड व अझोला दिल्यास खाद्याचा खर्च ३५% कमी होतो.\n` +
        `4. **लसीकरण:** लासोटा व गंबोरो लसीकरण वेळेवर करा जेणेकरून मरतूक २% खाली राहील.\n` +
        `5. **नफा व शासकीय योजना:** नाबार्ड व पशुसंवर्धन विभागाकडून २५% ते ३३% अनुदान मिळते. कडकनाथ ₹६००-८००/किलो दराने विकले जाते.`;
    } else {
      reply = `**Guide to Backyard & Kadaknath Poultry Farming:**\n\n` +
        `1. **Breed Selection:** Choose hardy breeds like pure Desi, Kadaknath, or dual-purpose Vanaraja.\n` +
        `2. **Shed & Housing:** 150-200 sq.ft. predator-proof ventilated shed per 100 birds with dry paddy husk litter.\n` +
        `3. **Feed Cost Reduction:** Supplement free-range foraging with broken maize and Azolla to cut feed expenses by 35%.\n` +
        `4. **Vaccination:** Strictly administer LaSota (Day 5-7) and IBD Gumboro to keep mortality under 3%.\n` +
        `5. **Subsidies & Revenue:** Access 25% to 33% capital subsidy under National Livestock Mission (NLM).`;
    }
  } else if (isDairy) {
    sources.push('National Dairy Development Board (NDDB)', 'AHIDF Guidelines');
    if (language === 'mr') {
      reply = `**ग्रामीण दुग्ध व्यवसाय (Dairy Farming) व मूल्यवर्धन:**\n\n` +
        `1. **जनावरांची निवड:** उच्च दूध देणाऱ्या गीर/साहिवाल गाई किंवा मुऱ्हा/जाफराबादी म्हशींची निवड करा.\n` +
        `2. **चारा व्यवस्थापन:** मका सायलेज (मुरघास) व अझोला लागवड करून खाद्याचा खर्च ५०% कमी करा.\n` +
        `3. **मूल्यवर्धन:** केवळ कच्चे दूध न विकता **शुद्ध तूप (₹२,०००/किलो), ताजे पनीर, खवा** तयार करून थेट ग्राहकांना विका.\n` +
        `4. **आरोग्य व स्वच्छता:** दर ३ महिन्यांनी जंतनाशक आणि लाळ-खुरकूत (FMD) लसीकरण नियमित करा.\n` +
        `5. **शासकीय सबसिडी:** राष्ट्रीय गोकुळ मिशन व नाबार्ड अंतर्गत २५% ते ३३% सबसिडी उपलब्ध आहे.`;
    } else {
      reply = `**Profitable Rural Dairy Farming & Value Addition:**\n\n` +
        `1. **High-Yield Breeds:** Start with Gir, Sahiwal cows or Murrah buffaloes.\n` +
        `2. **Green Fodder & Silage:** Cultivate maize silage and Azolla to lower concentrate feed costs.\n` +
        `3. **Value Addition:** Produce A2 Bilona Ghee, fresh paneer, and curd to double profit margins.\n` +
        `4. **Preventive Care:** Routine deworming and mandatory Foot & Mouth Disease (FMD) vaccination.\n` +
        `5. **Subsidies:** Avail 25% to 33% subsidy under the Animal Husbandry Infrastructure Development Fund.`;
    }
  } else if (isFood) {
    sources.push('Ministry of Food Processing Industries (MoFPI)', 'FSSAI FoSCoS Portal');
    if (language === 'mr') {
      reply = `**ग्रामीण भागात घरून अन्नप्रक्रिया (Food Processing) व्यवसाय:**\n\n` +
        `1. **Udyam नोंदणी:** [udyamregistration.gov.in](https://udyamregistration.gov.in) वर आधार व पॅनद्वारे मोफत MSME नोंदणी करा.\n` +
        `2. **FSSAI परवाना:** ₹१२ लाखांखालील उलाढालीसाठी FoSCoS पोर्टलवरून फक्त ₹१००/वर्ष फी भरून बेसिक रजिस्ट्रेशन मिळवा.\n` +
        `3. **स्वच्छ पॅकेजिंग:** हवाबंद फूड-ग्रेड पाकिटांवर नाव, घटक, वजन, निर्मिती व एक्सपायरी तारीख स्पष्ट छापा.\n` +
        `4. **PMFME शासकीय योजना:** खाद्य प्रक्रिया उपकरणांसाठी **३५% सबसिडी (कमाल ₹१० लाख)** मिळते.\n` +
        `5. **मार्केटिंग:** WhatsApp Business कॅटलॉग आणि आठवडे बाजारात थेट विक्री सुरू करा.`;
    } else {
      reply = `**Steps to Start a Home Food Processing Unit in Rural India:**\n\n` +
        `1. **Udyam Registration:** Register your micro-business for free on [udyamregistration.gov.in](https://udyamregistration.gov.in).\n` +
        `2. **FSSAI Food License:** Get a Basic FSSAI registration on the FoSCoS portal (₹100/year).\n` +
        `3. **Quality Packaging:** Use food-grade airtight pouches with labels showing ingredients and MFG date.\n` +
        `4. **PMFME Scheme:** Avail 35% capital subsidy (up to ₹10 Lakhs) for food processing machinery.\n` +
        `5. **Sales Channels:** Launch via WhatsApp Business catalogs and local weekly village markets.`;
    }
  } else if (isPmegp || isMudra || isShg) {
    sources.push('Khadi and Village Industries Commission (KVIC)', 'Ministry of MSME', 'PMMY Portal');
    if (language === 'mr') {
      reply = `**सत्यापित शासकीय कर्ज व सबसिडी योजना (PMEGP, मुद्रा, बचत गट):**\n\n` +
        `1. **PMEGP योजना:** उत्पादन क्षेत्रासाठी ₹५० लाखांपर्यंत व सेवेसाठी ₹२० लाखांपर्यंत कर्ज. ग्रामीण महिला व मागास प्रवर्गासाठी **३५% सरकारी सबसिडी**.\n` +
        `2. **मुद्रा योजना (PMMY):** विनातारण ₹१० लाखांपर्यंत कर्ज (शिशु, किशोर, तरुण) ५-१० दिवसांत बँकांकडून मिळते.\n` +
        `3. **महिला बचत गट (SHG):** NRLM अंतर्गत बचत गटांना बँकांकडून ₹१ ते १० लाखांपर्यंत कमी व्याजदरात कर्ज मिळते.\n` +
        `4. **लखपती दीदी योजना:** ग्रामीण महिलांचे वार्षिक उत्पन्न किमान ₹१ लाख करण्यासाठी कौशल्य व साधनसामग्री पाठबळ.\n` +
        `5. **अर्ज कसा करावा:** [kviconline.gov.in](https://www.kviconline.gov.in) किंवा जवळच्या राष्ट्रीयीकृत बँकेच्या शाखेत DPR सह संपर्क साधा.`;
    } else {
      reply = `**Verified Government Schemes for Rural Entrepreneurs:**\n\n` +
        `1. **PMEGP Scheme:** Up to ₹50 Lakhs for manufacturing and ₹20 Lakhs for services with **35% government subsidy** for rural women.\n` +
        `2. **Mudra Loan (PMMY):** Collateral-free credit up to ₹10 Lakhs across Shishu, Kishor, and Tarun categories.\n` +
        `3. **Self-Help Groups (SHG):** Bank-linkage loans under NRLM from ₹1 Lakh to ₹10 Lakhs at subsidized interest rates.\n` +
        `4. **Lakhpati Didi Mission:** Skill training and enterprise support to achieve ₹1 Lakh+ sustainable annual income.\n` +
        `5. **How to Apply:** Apply online on [kviconline.gov.in](https://www.kviconline.gov.in) or visit your local lead bank.`;
    }
  } else {
    // Dynamic synthesis for ANY query
    if (language === 'mr') {
      reply = `**'${query}' या विषयावर ग्रामीण उद्योजकांसाठी सविस्तर मार्गदर्शन:**\n\n` +
        `1. **स्थानिक बाजारपेठेचा अभ्यास:** आपल्या गावातील किंवा तालुक्यातील ग्राहकांच्या नेमक्या गरजा आणि नियमित मागणीचा अंदाज घ्या.\n` +
        `2. **कमी खर्चात सुरुवात:** सुरुवातीला छोट्या प्रमाणावर सुरुवात करून उत्पादनाची गुणवत्ता व ग्राहकांचा प्रतिसाद तपासा.\n` +
        `3. **उद्योग नोंदणी:** [udyamregistration.gov.in](https://udyamregistration.gov.in) वर मोफत MSME Udyam नोंदणी करा. अन्न व्यवसाय असल्यास FSSAI परवाना (₹१००/वर्ष) घ्या.\n` +
        `4. **शासकीय सबसिडी व कर्ज:** PMEGP योजनेतून ३५% सबसिडी किंवा मुद्रा योजनेतून विनातारण कर्ज मिळवा.\n` +
        `5. **WhatsApp Business द्वारे विक्री:** उत्पादनांचे फोटो व किमतींसह डिजिटल कॅटलॉग बनवा आणि UPI QR कोडने पेमेंट स्वीकारा.\n` +
        `6. **हिशोब व नफा नियोजन:** दररोजच्या खर्चाची नोंद ठेवा आणि किमान २५% ते ३५% नफा जोडून दर निश्चित करा.`;
    } else if (language === 'hi') {
      reply = `**'${query}' के संदर्भ में ग्रामीण उद्यमियों के लिए व्यावहारिक गाइड:**\n\n` +
        `1. **स्थानीय बाजार व मांग की समझ:** अपने गाँव या कस्बे में ग्राहकों की वास्तविक जरूरत और कच्चे माल की उपलब्धता जांचें।\n` +
        `2. **कम बजट में शुरुआत:** बड़े निवेश के बजाय छोटे स्तर पर काम शुरू करें ताकि जोखिम कम से कम रहे।\n` +
        `3. **सरकारी रजिस्ट्रेशन:** udyamregistration.gov.in पर मुफ्त MSME पंजीकरण करें और आवश्यक परवाने प्राप्त करें।\n` +
        `4. **सब्सिडी का लाभ:** PMEGP (35% सब्सिडी) अथवा मुद्रा योजना से रियायती बैंक ऋण प्राप्त करें।\n` +
        `5. **WhatsApp Business से बिक्री:** उत्पाद फोटो और मूल्य के साथ डिजिटल कैटलॉग बनाकर स्थानीय समूहों में साझा करें।\n` +
        `6. **मुनाफा व हिसाब-किताब:** लागत पर 25% से 35% लाभ मार्जिन जोड़कर उचित मूल्य तय करें।`;
    } else {
      reply = `**Comprehensive Guidance on '${query}':**\n\n` +
        `1. **Market Demand Assessment:** Study local community requirements and source affordable raw materials nearby.\n` +
        `2. **Lean Micro-Enterprise Setup:** Launch with minimal capital investment to validate quality and gain customer trust.\n` +
        `3. **Essential Registrations:** Complete free MSME registration on [udyamregistration.gov.in](https://udyamregistration.gov.in).\n` +
        `4. **Financial Schemes:** Leverage PMEGP for 35% government subsidy or Mudra for collateral-free credit.\n` +
        `5. **WhatsApp Commerce:** Create a daylight product catalog and accept instant UPI QR payments.\n` +
        `6. **Financial Bookkeeping:** Track daily operational expenses and maintain a healthy 25-35% profit margin.`;
    }
  }

  const suggested_questions = [
    language === 'mr' ? 'व्हॉट्सअॅप बिझनेसवर उत्पादनांचा प्रसार कसा करावा?' : 'How can I promote my products on WhatsApp Business?',
    language === 'mr' ? 'PMEGP योजनेतून महिलांना किती सबसिडी मिळते?' : 'What subsidy does PMEGP give to rural women?',
    language === 'mr' ? 'घरून खाद्य प्रक्रिया व्यवसाय कसा सुरू करावा?' : 'How can I start a small food business from home?',
  ];

  return { reply, sources, suggested_questions };
}
