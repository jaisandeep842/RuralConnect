import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Filter, Globe2, CalendarCheck, Sparkles, ShieldCheck } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(true);

  const expertises = [
    'All',
    'Agro-Processing',
    'Self-Help Groups',
    'Handicrafts',
    'Digital Marketing',
    'Government Schemes',
  ];

  const languages = ['All', 'Marathi', 'Hindi', 'English'];

  const fetchMentors = async () => {
    setIsLoading(true);
    try {
      let url = '/api/mentors?';
      if (expertiseFilter !== 'All') url += `expertise=${encodeURIComponent(expertiseFilter)}&`;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Authentic Indian Business Mentors</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          {t('mentors.title', 'Specialist Mentors')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {t(
            'mentors.subtitle',
            'Connect directly with experienced Indian business mentors and advisors.'
          )}
        </p>

        {/* Tab switch if user logged in */}
        {user && (
          <div className="pt-2 flex justify-center">
            <div className="bg-slate-100 p-1 rounded-2xl inline-flex gap-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Specialist Mentors ({mentors.length})
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'my' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Bookings ({myAppointments.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'all' ? (
        <>
          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Expertise tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {expertises.map((exp) => (
                <button
                  key={exp}
                  onClick={() => setExpertiseFilter(exp)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    expertiseFilter === exp
                      ? 'bg-brand-700 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {exp}
                </button>
              ))}
            </div>

            {/* Language filter */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Globe2 className="w-4 h-4 text-slate-400" />
              <span>Language:</span>
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold focus:ring-2 focus:ring-brand-600 focus:outline-none"
              >
                {languages.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mentors Grid */}
          {isLoading ? (
            <div className="py-20 text-center text-slate-500">
              <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p>{t('common.loading', 'Loading mentors...')}</p>
            </div>
          ) : mentors.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
              No mentors found matching criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((m) => (
                <MentorCard key={m.id} mentor={m} onBooked={fetchMentors} />
              ))}
            </div>
          )}
        </>
      ) : (
        /* My Appointments Tab */
        <div className="max-w-2xl mx-auto space-y-4">
          {myAppointments.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
              <p>You have no scheduled appointments yet.</p>
              <button
                onClick={() => setActiveTab('all')}
                className="mt-3 text-xs font-bold text-brand-700 hover:underline"
              >
                Browse Mentors and Book a Consultation →
              </button>
            </div>
          ) : (
            myAppointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h4 className="font-bold text-slate-900 text-sm">{appt.mentor_name}</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Date: <strong>{appt.date}</strong> at <strong>{appt.time_slot}</strong>
                  </p>
                  {appt.notes && <p className="text-xs text-slate-400 italic">"{appt.notes}"</p>}
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
