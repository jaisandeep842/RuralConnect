import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu, X, Bell, User, BookOpen, Calendar, Users, Award,
  Sparkles, ShieldCheck, LogOut, ChevronDown, Compass
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: t('nav.home', 'Home'), path: '/' },
    { name: t('nav.learn', 'Learn'), path: '/learn' },
    { name: t('nav.training', 'Training'), path: '/training' },
    { name: t('nav.mentors', 'Mentors'), path: '/mentors' },
    { name: t('nav.schemes', 'Govt Schemes'), path: '/schemes' },
    { name: t('nav.community', 'Community'), path: '/community' },
    { name: t('nav.assistant', 'Ask AI'), path: '/assistant', highlight: true },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-700/20 group-hover:scale-105 transition-transform">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 2.84L18 11v7h-2v-6H8v6H6v-7l6-5.16z" />
                <circle cx="12" cy="8.5" r="2" fill="#fbbf24" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 font-heading leading-tight">
                Rural<span className="text-brand-700">Connect</span>
              </span>
              <span className="text-xs font-semibold tracking-wider text-saffron-600 uppercase">
                {t('hero.tagline', 'Learn. Connect. Grow.')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  link.highlight
                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 font-bold flex items-center gap-1.5'
                    : isActive(link.path)
                    ? 'bg-brand-50 text-brand-800 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.highlight && <Sparkles className="w-4 h-4 text-amber-600" />}
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/notifications"
                  className="p-2 text-slate-600 hover:text-brand-700 hover:bg-brand-50 rounded-xl relative transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-terracotta-500 rounded-full ring-2 ring-white"></span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors"
                  >
                    <img
                      src={user.profile_photo || 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=100&auto=format&fit=crop&q=80'}
                      alt={user.full_name}
                      className="w-8 h-8 rounded-full object-cover border border-brand-400"
                    />
                    <span className="text-sm font-semibold text-slate-800 max-w-[120px] truncate">
                      {user.full_name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Logged in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.full_name}</p>
                        <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 uppercase tracking-wide">
                          {user.role}
                        </span>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <Compass className="w-4 h-4 text-brand-600" />
                        {t('nav.dashboard', 'Dashboard')}
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <User className="w-4 h-4 text-brand-600" />
                        {t('nav.profile', 'Profile')}
                      </Link>

                      <Link
                        to="/certificates"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <Award className="w-4 h-4 text-brand-600" />
                        {t('nav.certificates', 'Certificates')}
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-800 bg-amber-50 hover:bg-amber-100 font-bold"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          {t('nav.admin', 'Admin Panel')}
                        </Link>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('nav.logout', 'Logout')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-colors"
                >
                  {t('nav.login', 'Login')}
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-md shadow-brand-700/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t('nav.register', 'Register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-brand-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="py-2 border-b border-slate-100 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${
                  isActive(link.path)
                    ? 'bg-brand-50 text-brand-800 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.name}</span>
                {link.highlight && <Sparkles className="w-4 h-4 text-amber-500" />}
              </Link>
            ))}
          </div>

          {user ? (
            <div className="pt-2 space-y-1">
              <div className="px-4 py-2 flex items-center gap-3">
                <img
                  src={user.profile_photo || 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=100&auto=format&fit=crop&q=80'}
                  alt={user.full_name}
                  className="w-10 h-10 rounded-full object-cover border border-brand-400"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">{user.full_name}</p>
                  <p className="text-xs text-slate-500">{user.business_type} • {user.village}</p>
                </div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                {t('nav.dashboard', 'Dashboard')}
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                {t('nav.profile', 'Profile')}
              </Link>
              <Link
                to="/certificates"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                {t('nav.certificates', 'Certificates')}
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-base font-bold text-amber-900 bg-amber-50 rounded-xl"
                >
                  {t('nav.admin', 'Admin Panel')}
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-base font-bold text-red-600 hover:bg-red-50 rounded-xl"
              >
                {t('nav.logout', 'Logout')}
              </button>
            </div>
          ) : (
            <div className="pt-3 grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-3 px-4 font-bold text-slate-700 bg-slate-100 rounded-xl"
              >
                {t('nav.login', 'Login')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-3 px-4 font-bold text-white bg-brand-700 rounded-xl"
              >
                {t('nav.register', 'Register')}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
