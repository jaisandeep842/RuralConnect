import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Bot, BookOpen, Users, Calendar, ShieldCheck, HeartHandshake,
  Play, Award, ArrowRight, CheckCircle2, Clock, Sparkles, MapPin
} from 'lucide-react';
import { apiRequest } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiRequest('/api/users/dashboard');
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const quickActions = [
    { title: t('quickActions.askAi', 'ASK AI'), icon: Bot, path: '/assistant', bg: 'bg-amber-500 text-white shadow-amber-500/20' },
    { title: t('quickActions.learn', 'LEARN'), icon: BookOpen, path: '/learn', bg: 'bg-brand-700 text-white shadow-brand-700/20' },
    { title: t('quickActions.findMentor', 'FIND MENTOR'), icon: Users, path: '/mentors', bg: 'bg-blue-600 text-white shadow-blue-600/20' },
    { title: t('quickActions.joinTraining', 'JOIN TRAINING'), icon: Calendar, path: '/training', bg: 'bg-orange-600 text-white shadow-orange-600/20' },
    { title: t('quickActions.govtSchemes', 'GOVERNMENT SCHEMES'), icon: ShieldCheck, path: '/schemes', bg: 'bg-emerald-700 text-white shadow-emerald-700/20' },
    { title: t('quickActions.community', 'COMMUNITY'), icon: HeartHandshake, path: '/community', bg: 'bg-purple-600 text-white shadow-purple-600/20' },
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>{t('common.loading', 'Loading, please wait...')}</p>
      </div>
    );
  }

  const currentUser = data?.user || user;
  const continueLearning = data?.continue_learning;
  const stats = data?.stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome & Profile Completion Banner */}
      <div className="bg-gradient-to-r from-amber-100/80 via-white to-brand-50/80 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.profile_photo || 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser?.full_name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-brand-600 shadow-md"
          />
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {t('dashboard.welcome', 'Welcome back')}, {currentUser?.full_name?.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {currentUser?.business_type} Enterprise • {currentUser?.village}, {currentUser?.district}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="brand">{currentUser?.role}</Badge>
              <Badge variant="saffron">Language: {currentUser?.preferred_language?.toUpperCase()}</Badge>
            </div>
          </div>
        </div>

        {/* Profile Completion Indicator */}
        <div className="w-full md:w-64 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500">{t('dashboard.profileCompletion', 'Profile Completion')}</span>
            <span className="text-brand-700">{currentUser?.profile_completion || 100}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${currentUser?.profile_completion || 100}%` }}
            />
          </div>
          <Link to="/profile" className="text-[11px] font-bold text-brand-700 hover:underline block text-right">
            Edit Profile →
          </Link>
        </div>
      </div>

      {/* 6 Large Quick Actions */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Quick Actions / त्वरित कृती
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.path}
                className={`${action.bg} rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center justify-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all duration-200`}
              >
                <Icon className="w-7 h-7" />
                <span className="text-xs sm:text-sm font-black tracking-wide leading-tight">
                  {action.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {t('dashboard.completedLessons', 'Completed Lessons')}
          </p>
          <p className="text-3xl font-black text-brand-700 font-heading mt-1">
            {stats.completed_lessons || 0}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {t('dashboard.activeCourses', 'Active Courses')}
          </p>
          <p className="text-3xl font-black text-slate-900 font-heading mt-1">
            {stats.active_courses || 3}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {t('dashboard.certificatesEarned', 'Certificates')}
          </p>
          <p className="text-3xl font-black text-amber-600 font-heading mt-1">
            {stats.certificates_earned || 0}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            New Notifications
          </p>
          <p className="text-3xl font-black text-terracotta-600 font-heading mt-1">
            {stats.unread_notifications || 1}
          </p>
        </div>
      </div>

      {/* Continue Learning Card */}
      {continueLearning && (
        <div className="bg-white rounded-3xl border border-amber-200/80 shadow-md p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
              <Play className="w-7 h-7 fill-current ml-0.5" />
            </div>
            <div className="space-y-1">
              <Badge variant="saffron" size="sm">
                {t('dashboard.continueLearning', 'Continue Learning')}
              </Badge>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                {continueLearning.course_title}: {continueLearning.lesson_title}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span>Lecture {continueLearning.lesson_number}</span>
                <span>•</span>
                <span>Internal YouTube Player Ready</span>
              </p>
            </div>
          </div>

          <Link to={`/courses/${continueLearning.course_id}`}>
            <Button variant="primary" size="md" className="flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              <span>{t('dashboard.resumeLesson', 'Resume Lesson')}</span>
            </Button>
          </Link>
        </div>
      )}

      {/* Recommended For You Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                {t('dashboard.recommendedForYou', 'Recommended For You')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Personalized for your <strong>{currentUser?.business_type}</strong> enterprise
            </p>
          </div>
          <Link to="/learn" className="text-xs font-bold text-brand-700 hover:underline">
            {t('dashboard.viewAll', 'View All Courses')} →
          </Link>
        </div>

        {/* Recommended Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(data?.recommended_courses || []).map((course: any) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                    {course.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors font-heading">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between text-xs font-bold text-brand-700">
                <span>{course.total_lessons} Lectures</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Start Course →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};
