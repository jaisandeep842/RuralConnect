import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, BookOpen, Video, Calendar, ShieldCheck, Award,
  HeartHandshake, Database, Bell, Settings, TrendingUp
} from 'lucide-react';
import { apiRequest } from '../../api/client';
import { Badge } from '../../components/common/Badge';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiRequest('/api/admin/stats');
        setStats(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const adminSections = [
    { title: 'Manage Users', desc: 'View registered rural entrepreneurs & roles', icon: Users, path: '/admin/users', count: stats?.total_users || 0, color: 'text-blue-600 bg-blue-50' },
    { title: 'Specialist Mentors', desc: 'Add/edit Indian mentors & verification', icon: Users, path: '/admin/mentors', count: stats?.total_mentors || 0, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Training & Workshops', desc: 'Schedule workshops, manage seats', icon: Calendar, path: '/admin/training', count: stats?.total_training_sessions || 0, color: 'text-orange-600 bg-orange-50' },
    { title: 'Courses & Lessons', desc: 'Curate video courses & embedded lectures', icon: BookOpen, path: '/admin/courses', count: stats?.total_courses || 0, color: 'text-brand-700 bg-brand-50' },
    { title: 'YouTube Lectures', desc: 'Manage video URLs, descriptions, order', icon: Video, path: '/admin/lessons', count: stats?.total_lessons || 0, color: 'text-red-600 bg-red-50' },
    { title: 'Government Schemes', desc: 'Add verified schemes, edit benefits', icon: ShieldCheck, path: '/admin/schemes', count: stats?.total_schemes || 0, color: 'text-amber-700 bg-amber-50' },
    { title: 'AI Knowledge Base', desc: 'Manage verified entries for RAG engine', icon: Database, path: '/admin/knowledge-base', count: 5, color: 'text-purple-600 bg-purple-50' },
    { title: 'Broadcast Notifications', desc: 'Send announcements to all entrepreneurs', icon: Bell, path: '/admin/notifications', count: 'Active', color: 'text-teal-600 bg-teal-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Badge variant="verified">ADMINISTRATION CONSOLE</Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-2">
            RuralConnect Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage all educational, mentorship, and government scheme content without manual source edits.
          </p>
        </div>
      </div>

      {/* Overview Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Users', val: stats?.total_users || 0 },
          { label: 'Mentors', val: stats?.total_mentors || 0 },
          { label: 'Courses', val: stats?.total_courses || 0 },
          { label: 'Lectures', val: stats?.total_lessons || 0 },
          { label: 'Schemes', val: stats?.total_schemes || 0 },
        ].map((s, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminSections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <Link
              key={idx}
              to={sec.path}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${sec.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {sec.count}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-800 font-heading transition-colors">
                  {sec.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {sec.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-bold text-brand-700">
                <span>Configure</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
};
