import { useAuthStore } from '../store/authStore';
import {
  FALLBACK_COURSES,
  FALLBACK_LESSONS,
  FALLBACK_TRAININGS,
  FALLBACK_SCHEMES,
  FALLBACK_POSTS,
  FALLBACK_MENTORS,
  getFallbackChatResponse,
} from './fallbackData';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Local storage key for community posts when offline
const LOCAL_POSTS_KEY = 'ruralconnect_local_posts';

function getLocalCommunityPosts() {
  try {
    const saved = localStorage.getItem(LOCAL_POSTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return [...FALLBACK_POSTS];
}

function saveLocalCommunityPosts(posts: any[]) {
  try {
    localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
  } catch {
    // ignore
  }
}

function handleOfflineFallback<T>(endpoint: string, options: RequestInit = {}): T {
  const method = (options.method || 'GET').toUpperCase();
  const [path, queryString] = endpoint.split('?');
  const params = new URLSearchParams(queryString || '');

  // 1. Courses
  if (path === '/api/courses' && method === 'GET') {
    return FALLBACK_COURSES as unknown as T;
  }
  const courseMatch = path.match(/^\/api\/courses\/([^/]+)$/);
  if (courseMatch && method === 'GET') {
    const courseId = courseMatch[1];
    const course = FALLBACK_COURSES.find((c) => c.id === courseId);
    if (course) return course as unknown as T;
  }
  const lessonsMatch = path.match(/^\/api\/courses\/([^/]+)\/lessons$/);
  if (lessonsMatch && method === 'GET') {
    const courseId = lessonsMatch[1];
    return (FALLBACK_LESSONS[courseId] || []) as unknown as T;
  }
  if (path.includes('/progress') && method === 'POST') {
    return { success: true, course_completed: false } as unknown as T;
  }

  // 2. Training
  if (path === '/api/training' && method === 'GET') {
    const category = params.get('category');
    const mode = params.get('mode');
    let results = [...FALLBACK_TRAININGS];
    if (category && category !== 'All') {
      results = results.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }
    if (mode && mode !== 'All') {
      results = results.filter((t) => t.mode.toLowerCase() === mode.toLowerCase());
    }
    return results as unknown as T;
  }
  if (path.match(/\/api\/training\/.*\/register/) && method === 'POST') {
    return { message: 'Successfully registered for workshop!', is_registered: true } as unknown as T;
  }

  // 3. Schemes
  if (path === '/api/schemes' && method === 'GET') {
    const search = params.get('search')?.toLowerCase();
    const category = params.get('category');
    let results = [...FALLBACK_SCHEMES];
    if (category && category !== 'All') {
      results = results.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      results = results.filter(
        (s) =>
          s.scheme_name.toLowerCase().includes(search) ||
          s.description.toLowerCase().includes(search) ||
          s.target_users.toLowerCase().includes(search)
      );
    }
    return results as unknown as T;
  }
  const schemeMatch = path.match(/^\/api\/schemes\/([^/]+)$/);
  if (schemeMatch && method === 'GET') {
    const scheme = FALLBACK_SCHEMES.find((s) => s.id === schemeMatch[1]);
    if (scheme) return scheme as unknown as T;
  }

  // 3.5 Mentors
  if (path === '/api/mentors' && method === 'GET') {
    const expertise = params.get('expertise');
    const language = params.get('language');
    let results = [...FALLBACK_MENTORS];
    if (expertise && expertise !== 'All') {
      results = results.filter((m) => m.expertise.toLowerCase().includes(expertise.toLowerCase()));
    }
    if (language && language !== 'All') {
      results = results.filter((m) => m.languages.some((l) => l.toLowerCase() === language.toLowerCase()));
    }
    return results as unknown as T;
  }
  const mentorMatch = path.match(/^\/api\/mentors\/([^/]+)$/);
  if (mentorMatch && method === 'GET') {
    const mentor = FALLBACK_MENTORS.find((m) => m.id === mentorMatch[1]);
    if (mentor) return mentor as unknown as T;
  }
  if (path === '/api/mentors/book' && method === 'POST') {
    try {
      const body = JSON.parse((options.body as string) || '{}');
      const mentor = FALLBACK_MENTORS.find((m) => m.id === body.mentor_id) || FALLBACK_MENTORS[0];
      const newBooking = {
        id: 'booking-' + Date.now(),
        mentor_id: mentor.id,
        mentor_name: mentor.name,
        date: body.date || '2026-03-25',
        time_slot: body.time_slot || '04:00 PM - 05:00 PM',
        notes: body.notes || '',
        status: 'confirmed',
        created_at: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem('ruralconnect_local_bookings') || '[]');
      existing.unshift(newBooking);
      localStorage.setItem('ruralconnect_local_bookings', JSON.stringify(existing));
      return newBooking as unknown as T;
    } catch {
      return { status: 'confirmed' } as unknown as T;
    }
  }
  if (path === '/api/mentors/my-appointments' && method === 'GET') {
    try {
      const existing = JSON.parse(localStorage.getItem('ruralconnect_local_bookings') || '[]');
      return existing as unknown as T;
    } catch {
      return [] as unknown as T;
    }
  }

  // 4. Community
  if (path === '/api/community/posts' && method === 'GET') {
    return getLocalCommunityPosts() as unknown as T;
  }
  if (path === '/api/community/posts' && method === 'POST') {
    try {
      const body = JSON.parse((options.body as string) || '{}');
      const posts = getLocalCommunityPosts();
      const newPost = {
        id: 'post-' + Date.now(),
        user_id: 'user-current',
        user_name: 'You (Rural Founder)',
        user_business: 'Rural Business • Maharashtra',
        avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&auto=format&fit=crop&q=80',
        content: body.content || '',
        image_url: body.image_url || null,
        category: body.category || 'Discussion',
        likes_count: 0,
        comments_count: 0,
        is_liked: false,
        comments: [],
        created_at: new Date().toISOString(),
      };
      posts.unshift(newPost);
      saveLocalCommunityPosts(posts);
      return newPost as unknown as T;
    } catch {
      // ignore
    }
  }
  const likeMatch = path.match(/^\/api\/community\/posts\/([^/]+)\/like$/);
  if (likeMatch && method === 'POST') {
    const posts = getLocalCommunityPosts();
    const post = posts.find((p: any) => p.id === likeMatch[1]);
    if (post) {
      post.is_liked = !post.is_liked;
      post.likes_count += post.is_liked ? 1 : -1;
      saveLocalCommunityPosts(posts);
      return { is_liked: post.is_liked, likes_count: post.likes_count } as unknown as T;
    }
    return { is_liked: true, likes_count: 1 } as unknown as T;
  }

  // 5. AI Assistant
  if (path === '/api/assistant/chat' && method === 'POST') {
    try {
      const body = JSON.parse((options.body as string) || '{}');
      const result = getFallbackChatResponse(body.message || '', body.language || 'en');
      return result as unknown as T;
    } catch {
      return getFallbackChatResponse('', 'en') as unknown as T;
    }
  }
  if (path === '/api/assistant/suggested') {
    const lang = params.get('language') || 'en';
    const questions = {
      mr: [
        'मी घरून छोटा खाद्यपदार्थ व्यवसाय कसा सुरू करू शकते?',
        'PMEGP योजनेतून महिलांना किती सबसिडी मिळते?',
        'व्हॉट्सअॅप बिझनेसवर उत्पादनांचा प्रचार कसा करावा?',
        'बचत गटांना बँकेकडून सुलभ कर्ज कसे मिळते?'
      ],
      hi: [
        'मैं घर से खाद्य प्रसंस्करण व्यापार कैसे शुरू कर सकती हूँ?',
        'व्हाट्सएप बिजनेस पर अपने उत्पादों का प्रचार कैसे करें?',
        'PMEGP योजना में महिलाओं को कितनी सब्सिडी मिलती है?',
        'स्वयं सहायता समूह को बैंक ऋण कैसे मिलता है?'
      ],
      en: [
        'How can I start a small food business from home?',
        'What subsidy does PMEGP give to rural women?',
        'How can I promote my products on WhatsApp Business?',
        'Which government support or loan is relevant to my rural business?'
      ]
    };
    return { questions: (questions as any)[lang] || questions.en } as unknown as T;
  }

  // 6. Generic health or fallback
  if (path === '/api/health') {
    return { status: 'healthy', database: 'connected (fallback)' } as unknown as T;
  }

  return [] as unknown as T;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = useAuthStore.getState().token;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        useAuthStore.getState().logout();
        throw new ApiError("Your session has expired. Please log in again.", 401);
      }
      
      let errorMessage = "Something went wrong. Please try again.";
      try {
        const errorJson = await response.json();
        if (errorJson.detail) {
          if (typeof errorJson.detail === 'string') {
            errorMessage = errorJson.detail;
          } else if (Array.isArray(errorJson.detail)) {
            errorMessage = errorJson.detail[0]?.msg || errorMessage;
          }
        }
      } catch {
        // Fallback for non-JSON errors
      }

      throw new ApiError(errorMessage, response.status);
    }

    return await response.json();
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network / Offline / Connection Timeout fallback
    console.warn(`[RuralConnect] Live API request to ${endpoint} unavailable, activating verified local data fallback.`);
    try {
      const fallbackResult = handleOfflineFallback<T>(endpoint, options);
      if (fallbackResult !== undefined) {
        return fallbackResult;
      }
    } catch {
      // ignore
    }

    throw new ApiError("Unable to connect. Please check your connection.", 0);
  }
}
