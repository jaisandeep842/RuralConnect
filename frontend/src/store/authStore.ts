import { create } from 'zustand';
import { User } from '../types';
import i18n from '../i18n/i18n';

interface AuthState {
  user: User | null;
  token: string | null;
  language: 'en' | 'hi' | 'mr';
  setAuth: (user: User, token: string) => void;
  updateUser: (partial: Partial<User>) => void;
  setLanguage: (lang: 'en' | 'hi' | 'mr') => void;
  logout: () => void;
}

const savedToken = localStorage.getItem('rc_token');
const savedUserStr = localStorage.getItem('rc_user');
let initialUser: User | null = null;
if (savedUserStr) {
  try {
    initialUser = JSON.parse(savedUserStr);
  } catch {
    initialUser = null;
  }
}

const savedLang = (localStorage.getItem('rc_lang') as 'en' | 'hi' | 'mr') || 'en';
if (savedLang) {
  i18n.changeLanguage(savedLang);
}

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: savedToken,
  language: savedLang,
  setAuth: (user, token) => {
    localStorage.setItem('rc_token', token);
    localStorage.setItem('rc_user', JSON.stringify(user));
    if (user.preferred_language) {
      localStorage.setItem('rc_lang', user.preferred_language);
      i18n.changeLanguage(user.preferred_language);
    }
    set({ user, token, language: user.preferred_language || 'en' });
  },
  updateUser: (partial) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...partial };
      localStorage.setItem('rc_user', JSON.stringify(updated));
      return { user: updated };
    });
  },
  setLanguage: (lang) => {
    localStorage.setItem('rc_lang', lang);
    i18n.changeLanguage(lang);
    set((state) => {
      if (state.user) {
        const updated = { ...state.user, preferred_language: lang };
        localStorage.setItem('rc_user', JSON.stringify(updated));
        return { language: lang, user: updated };
      }
      return { language: lang };
    });
  },
  logout: () => {
    localStorage.removeItem('rc_token');
    localStorage.removeItem('rc_user');
    set({ user: null, token: null });
  },
}));
