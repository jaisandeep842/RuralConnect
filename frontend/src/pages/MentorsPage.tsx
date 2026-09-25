import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Filter, Globe2, CalendarCheck, Sparkles, ShieldCheck, Search, Award, MessageCircle } from 'lucide-react';
import { Mentor, MentorAppointment } from '../types';
import { apiRequest } from '../api/client';
import { MentorCard } from '../components/mentors/MentorCard';
import { Badge } from '../components/common/Badge';
import { useAuthStore } from '../store/authStore';

export const MentorsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [myAppointments, setMyAppointments] = useState<MentorAppointment[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [expertiseFilter, setExpertiseFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const expertises = [
    'All',
    'Agro-Processing & Dairy',
    'Self-Help Groups & Micro-Finance',
    'Handicrafts & Textiles',
    'Digital Marketing & WhatsApp',
    'Government Schemes & Loans',
    'Organic Farming & Solar',
    'Millet Processing & Food',
    'Poultry & Goat Rearing',
  ];

  const languages = ['All', 'Marathi', 'Hindi', 'English'];

  const fetchMentors = async () => {
    setIsLoading(true);
    try {
      let url = '/api/mentors?';
      if (expertiseFilter !== 'All') {
        const shortExp = expertiseFilter.split(' ')[0];
        url += `expertise=${encodeURIComponent(shortExp)}&`;
      }
      if (languageFilter !== 'All') url += `language=${encodeURIComponent(languageFilter)}&`;
      
      const res = await apiRequest(url);
      setMentors(res);

      if (user) {
        const appts = await apiRequest('/api/mentors/my-appointments');
        setMyAppointments(appts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [expertiseFilter, languageFilter]);

  const filteredMentors = mentors.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.expertise.toLowerCase().includes(q) ||
      m.location.toLowerCase().includes(q) ||
      m.bio.toLowerCase().includes(q) ||
      m.qualification.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Specialized Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold border border-emerald-300 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Specialized Indian Business Mentors & Advisors</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
          Connect with Specialist Mentors
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Get verified 1-on-1 practical guidance on food safety, government subsidies (PMEGP & Mudra), self-help group banking, WhatsApp sales, and organic agriculture.
        </p>

        {/* Tab switch if user logged in */}
        {user && (
          <div className="pt-2 flex justify-center">
            <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex gap-1 border border-slate-200 shadow-inner">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Specialist Mentors ({mentors.length})
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'my'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Booked Appointments ({myAppointments.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'all' ? (
        <>
          {/* Search & Filters */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            
            {/* Search Input */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search mentors by expertise (e.g. Poultry, WhatsApp, FSSAI, PMEGP, Dairy, Pune)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
                />
              </div>

              {/* Language filter */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 shrink-0 w-full sm:w-auto">
                <Globe2 className="w-4 h-4 text-slate-400" />
                <span>Language:</span>
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold focus:ring-2 focus:ring-brand-600 focus:outline-none"
                >
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Specialization Domain Badges */}
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                Domain:
              </span>
              {expertises.map((exp) => (
                <button
                  key={exp}
                  onClick={() => setExpertiseFilter(exp)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    expertiseFilter === exp
                      ? 'bg-brand-700 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          {/* Mentors Grid */}
          {isLoading ? (
            <div className="py-20 text-center text-slate-500">
              <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="font-semibold">{t('common.loading', 'Loading specialized Indian mentors...')}</p>
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="p-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 space-y-3">
              <p className="text-base font-bold text-slate-700">No mentors match your selected filters.</p>
              <button
                onClick={() => {
                  setExpertiseFilter('All');
                  setLanguageFilter('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-800 rounded-xl text-xs font-bold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((m) => (
                <MentorCard key={m.id} mentor={m} onBooked={fetchMentors} />
              ))}
            </div>
          )}
        </>
      ) : (
        /* My Appointments Tab */
        <div className="max-w-2xl mx-auto space-y-4">
          {myAppointments.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 space-y-3">
              <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-800">You have no booked appointments yet.</p>
              <p className="text-xs text-slate-500">
                Explore our specialist mentors above and book a free 1-on-1 consultation session for your business.
              </p>
              <button
                onClick={() => setActiveTab('all')}
                className="px-4 py-2 bg-brand-700 text-white rounded-xl text-xs font-bold hover:bg-brand-800 transition-colors shadow-sm"
              >
                Browse Specialist Mentors
              </button>
            </div>
          ) : (
            myAppointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      Confirmed Consultation
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    Mentorship with {appt.mentor_name}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    📅 {appt.date} • ⏰ {appt.time_slot}
                  </p>
                  {appt.notes && (
                    <p className="text-xs text-slate-500 italic pt-1">
                      Topic: "{appt.notes}"
                    </p>
                  )}
                </div>

                <Badge variant="verified">CONFIRMED</Badge>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
