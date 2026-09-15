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
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
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

export const FALLBACK_POSTS: CommunityPost[] = [
  {
    id: 'post-01',
    user_id: 'user-demo-01',
    user_name: 'Sunita Kamble',
    user_business: 'Organic Food Processing • Satara',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
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
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
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
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
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
  const q = query.toLowerCase();

  const isFood = q.includes('food') || q.includes('खाद्य') || q.includes('लोणचे') || q.includes('पापड') || q.includes('मसाले') || q.includes('pickle') || q.includes('fssai');
  const isMarketing = q.includes('whatsapp') || q.includes('marketing') || q.includes('व्हॉट्सअॅप') || q.includes('विक्री') || q.includes('मार्केटिंग') || q.includes('ग्राहक');
  const isPmegp = q.includes('pmegp') || q.includes('subsidy') || q.includes('सबसिडी') || q.includes('अनुदान');
  const isMudra = q.includes('mudra') || q.includes('मुद्रा') || q.includes('कर्ज') || q.includes('loan');
  const isShg = q.includes('shg') || q.includes('बचत') || q.includes('bachat');

  let reply = '';
  let sources: string[] = ['RuralConnect Verified Knowledge Base'];

  if (isFood) {
    sources.push('Ministry of Food Processing Industries (MoFPI)', 'FSSAI FoSCoS Portal');
    if (language === 'mr') {
      reply = `**ग्रामीण भागात घरून अन्नप्रक्रिया व्यवसाय कसा सुरू करावा:**\n\n1. **Udyam नोंदणी:** [udyamregistration.gov.in](https://udyamregistration.gov.in) वर मोफत MSME प्रमाणपत्र मिळवा.\n2. **FSSAI परवाना:** ₹१२ लाखांखालील उलाढालीसाठी FoSCoS पोर्टलवर फक्त ₹१००/वर्ष दरात बेसिक फूड लायसन्स मिळते.\n3. **स्वच्छ पॅकेजिंग:** हवाबंद पाकिटांवर उत्पादन तारीख, एक्स्पायरी, वजन व घटकांची माहिती द्या.\n4. **PMFME योजना:** खाद्यप्रक्रिया युनिटसाठी ३५% क्रेडिट सबसिडी (कमाल ₹१० लाख) मिळते.`;
    } else if (language === 'hi') {
      reply = `**ग्रामीण क्षेत्र में घर से खाद्य प्रसंस्करण व्यापार शुरू करने के उपाय:**\n\n1. **उद्यम रजिस्ट्रेशन:** udyamregistration.gov.in पर मुफ्त MSME पंजीकरण करें।\n2. **FSSAI लाइसेंस:** ₹12 लाख से कम टर्नओवर के लिए FoSCoS पोर्टल पर ₹100/वर्ष में बेसिक रजिस्ट्रेशन लें।\n3. **एयरटाइट पैकेजिंग:** निर्माण तिथि और सामग्री का स्पष्ट विवरण दें।\n4. **PMFME योजना:** 35% क्रेडिट सब्सिडी (अधिकतम ₹10 लाख) का लाभ उठाएं।`;
    } else {
      reply = `**Steps to Start a Home Food Processing Unit in Rural India:**\n\n1. **Udyam Registration:** Register your micro-business for free on [udyamregistration.gov.in](https://udyamregistration.gov.in).\n2. **FSSAI License:** For turnover under ₹12 Lakhs/year, get a Basic FSSAI registration on the FoSCoS portal (₹100/year).\n3. **Quality Packaging:** Use food-grade pouches with labels indicating ingredients, net weight, and best-before date.\n4. **PMFME Scheme:** Avail 35% capital subsidy (up to ₹10 Lakhs) under the Pradhan Mantri Formalisation of Micro food processing Enterprises scheme.`;
    }
  } else if (isMarketing) {
    sources.push('RuralConnect Digital Commerce Academy', 'WhatsApp Business Guidelines');
    if (language === 'mr') {
      reply = `**व्हॉट्सअॅप व सोशल मीडिया मार्केटिंगद्वारे ग्राहक कसे मिळवावेत:**\n\n1. **WhatsApp Business अ‍ॅप:** उत्पादनांचे फोटो, किंमत आणि वर्णनासह कॅटलॉग (Catalog) तयार करा.\n2. **मोबाईल फोटोग्राफी:** सूर्यप्रकाशात उत्पादनांचे स्वच्छ फोटो काढा.\n3. **डिजिटल पेमेंट (UPI):** PhonePe किंवा Google Pay चा QR कोड तयार ठेवा.\n4. **स्थानिक ग्रुप्स:** गाव व तालुक्यातील व्हॉट्सअॅप ग्रुप्सवर नवीन उत्पादनांची माहिती शेअर करा.`;
    } else if (language === 'hi') {
      reply = `**व्हाट्सएप और डिजिटल मार्केटिंग से बिक्री कैसे बढ़ाएं:**\n\n1. **WhatsApp Business:** उत्पाद फोटो और मूल्य के साथ अपना कैटलॉग तैयार करें।\n2. **नेचुरल लाइट फोटोग्राफी:** दिन की रोशनी में साफ फोटो खींचें।\n3. **UPI पेमेंट:** तुरंत भुगतान हेतु PhonePe/Google Pay QR कोड रखें।\n4. **सोशल वीडियो:** 15 सेकंड के छोटे वीडियो बनाकर साझा करें।`;
    } else {
      reply = `**Boost Your Rural Business with Digital & WhatsApp Marketing:**\n\n1. **WhatsApp Business:** Set up a free business profile with a photo catalog and clear pricing.\n2. **Crisp Mobile Photos:** Shoot authentic pictures in natural daylight showing hygiene and craft quality.\n3. **UPI Payments:** Provide quick QR codes (Google Pay, PhonePe, Paytm) for easy advance orders.\n4. **Short Videos:** Share short 15-second craft clips to connect with town and city customers.`;
    }
  } else if (isPmegp || isMudra || isShg) {
    sources.push('Khadi and Village Industries Commission (KVIC)', 'Ministry of MSME', 'PMMY Portal');
    if (language === 'mr') {
      reply = `**सत्यापित शासकीय कर्ज व सबसिडी योजना:**\n\n• **PMEGP योजना:** उत्पादन व्यवसायासाठी ₹५० लाखांपर्यंत आणि सेवा व्यवसायासाठी ₹२० लाखांपर्यंत कर्ज. ग्रामीण महिला व मागास प्रवर्गासाठी **३५% सरकारी सबसिडी**.\n• **मुद्रा योजना (PMMY):** विनातारण (Collateral-free) ₹१० लाखांपर्यंत कर्ज (शिशु, किशोर, तरुण).\n• **महिला बचत गट (SHG):** NRLM अंतर्गत बचत गटांना बँकांकडून ₹१ ते ५ लाखांपर्यंत कमी व्याजदरात खेळते भांडवल मिळते.`;
    } else if (language === 'hi') {
      reply = `**सत्यापित सरकारी ऋण और सब्सिडी योजनाएं:**\n\n• **PMEGP योजना:** विनिर्माण हेतु ₹50 लाख और सेवा हेतु ₹20 लाख तक ऋण। ग्रामीण महिलाओं को **35% सरकारी सब्सिडी**।\n• **मुद्रा योजना:** बिना किसी गारंटी के ₹10 लाख तक का रियायती ऋण।\n• **स्वयं सहायता समूह (SHG):** आजीविका मिशन के तहत समूह को आसान बैंक क्रेडिट लिंकेज मिलता है।`;
    } else {
      reply = `**Verified Government Schemes for Rural Entrepreneurs:**\n\n• **PMEGP Scheme:** Up to ₹50 Lakhs for manufacturing and ₹20 Lakhs for services. Rural women receive **35% government subsidy**.\n• **Mudra Loan (PMMY):** Collateral-free credit up to ₹10 Lakhs with minimal paperwork.\n• **Self-Help Groups (SHG):** Bank-linkage loans under NRLM from ₹1 Lakh to ₹5 Lakhs at subsidized interest rates.`;
    }
  } else {
    if (language === 'mr') {
      reply = `**'${query}' या विषयावर ग्रामीण कनेक्ट सल्ला:**\n\n1. **मागणी आणि बाजारपेठ:** आपल्या भागातील ग्राहकांची गरज ओळखा.\n2. **कमी भांडवलाने सुरुवात:** कमी खर्चात उत्पादन किंवा सेवा सुरू करा.\n3. **शासकीय पाठबळ:** PMEGP किंवा मुद्रा योजनेतून अर्थसहाय्य मिळवा.\n4. **डिजिटल संपर्क:** WhatsApp Business व UPI पेमेंटचा वापर करा.`;
    } else if (language === 'hi') {
      reply = `**'${query}' के संबंध में ग्रामीण कनेक्ट व्यावसायिक सलाह:**\n\n1. **बाजार मांग की समझ:** अपने स्थानीय क्षेत्र में ग्राहकों की वास्तविक जरूरत को पहचानें।\n2. **कम बजट में शुरुआत:** छोटे स्तर पर काम शुरू करें और गुणवत्ता पर ध्यान दें।\n3. **सरकारी योजनाएं:** PMEGP या मुद्रा योजना से आसान ऋण का लाभ उठाएं।\n4. **डिजिटल टूल्स:** WhatsApp Business और ऑनलाइन पेमेंट का उपयोग करें।`;
    } else {
      reply = `**RuralConnect Guidance on '${query}':**\n\n1. **Identify Market Demand:** Understand what local customers need and are willing to pay for.\n2. **Start Lean:** Keep initial capital expenses low and focus on quality.\n3. **Leverage Support:** Explore micro-credit schemes like PMEGP or Mudra loans.\n4. **Use Digital Tools:** Adopt WhatsApp Business for sales and UPI for instant payments.`;
    }
  }

  const suggested_questions = [
    language === 'mr' ? 'घरून खाद्य व्यवसाय कसा सुरू करावा?' : 'How can I start a small food business from home?',
    language === 'mr' ? 'PMEGP योजनेतून महिलांना किती सबसिडी मिळते?' : 'What subsidy does PMEGP give to rural women?',
    language === 'mr' ? 'व्हॉट्सअॅप बिझनेसवर उत्पादनांचा प्रचार कसा करावा?' : 'How can I promote my products on WhatsApp Business?',
  ];

  return { reply, sources, suggested_questions };
}
