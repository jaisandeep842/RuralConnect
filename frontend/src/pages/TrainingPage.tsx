import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Filter, Video, MapPin, Sparkles } from 'lucide-react';
import { Training } from '../types';
import { apiRequest } from '../api/client';
import { TrainingCard } from '../components/training/TrainingCard';
import { Badge } from '../components/common/Badge';

export const TrainingPage: React.FC = () => {
  const { t } = useTranslation();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    'All',
    'Food Processing',
    'Digital Marketing',
    'Government Schemes',
    'Dairy & Livestock',
    'Branding',
  ];

  const fetchTrainings = async () => {
    setIsLoading(true);
    try {
      let url = '/api/training?';
      if (categoryFilter !== 'All') url += `category=${encodeURIComponent(categoryFilter)}&`;
      if (modeFilter !== 'All') url += `mode=${encodeURIComponent(modeFilter)}&`;
      const res = await apiRequest(url);
      setTrainings(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, [categoryFilter, modeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="brand">{t('training.title', 'Training & Workshops')}</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          Practical Workshops for Rural Founders
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {t(
            'training.subtitle',
            'Join interactive workshops by rural business experts and self-help groups.'
          )}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Categories */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span>Mode:</span>
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold focus:ring-2 focus:ring-brand-600 focus:outline-none"
          >
            <option value="All">All Modes</option>
            <option value="online">Online Workshops</option>
            <option value="offline">In-Person Field Visits</option>
          </select>
        </div>

      </div>

      {/* Training Cards Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>{t('common.loading', 'Loading workshops...')}</p>
        </div>
      ) : trainings.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
          No training sessions found matching the chosen filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((t) => (
            <TrainingCard key={t.id} training={t} onRegistered={fetchTrainings} />
          ))}
        </div>
      )}

    </div>
  );
};
