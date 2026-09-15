export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'entrepreneur' | 'admin' | 'mentor';
  preferred_language: 'en' | 'hi' | 'mr';
  village: string;
  district: string;
  state: string;
  business_type: string;
  business_description?: string;
  interests?: string[];
  profile_photo?: string;
  profile_completion?: number;
  created_at?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  level: string;
  language: string;
  total_duration_minutes: number;
  total_lessons: number;
  progress_percentage: number;
  completed_lessons: number;
}

export interface Lesson {
  id: string;
  course_id: string;
  lesson_number: number;
  lesson_title: string;
  description: string;
  video_source_type: 'youtube' | 'text' | 'vimeo';
  video_url: string;
  embed_url: string;
  provider: string;
  language: string;
  duration_minutes: number;
  learning_objectives: string[];
  is_embeddable: boolean;
  is_verified: boolean;
  order: number;
  text_content?: string;
  is_completed?: boolean;
}

export interface Mentor {
  id: string;
  name: string;
  photo: string;
  expertise: string;
  experience: string;
  qualification: string;
  languages: string[];
  location: string;
  availability: string;
  rating: number;
  sessions: number;
  bio: string;
  is_verified: boolean;
}

export interface MentorAppointment {
  id: string;
  mentor_id: string;
  mentor_name: string;
  date: string;
  time_slot: string;
  notes?: string;
  status: string;
  created_at: string;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  category: string;
  trainer: string;
  organization: string;
  date: string;
  start_time: string;
  end_time: string;
  mode: 'online' | 'offline';
  venue: string;
  meeting_link?: string;
  language: string;
  seats: number;
  available_seats: number;
  deadline: string;
  status: string;
  is_registered?: boolean;
}

export interface Scheme {
  id: string;
  scheme_name: string;
  description: string;
  category: string;
  eligibility: string;
  benefits: string;
  required_documents: string[];
  application_process: string;
  official_website: string;
  deadline: string;
  state: string;
  target_users: string;
  language: string;
  is_verified: boolean;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  user_name: string;
  user_business: string;
  avatar: string;
  content: string;
  image_url?: string | null;
  category: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  comments: Comment[];
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  user_name: string;
  course_or_training_title: string;
  certificate_number: string;
  issue_date: string;
  cert_type: string;
  verification_url: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language?: string;
  sources?: string[];
  suggested_questions?: string[];
  timestamp: string;
}
