import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Search, Filter, Sparkles, Building2 } from 'lucide-react';
import { Scheme } from '../types';
import { apiRequest } from '../api/client';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { Badge } from '../components/common/Badge';

export const SchemesPage: React.FC = () => {
  const { t } = useTranslation();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    'All',
    'Micro Enterprise & Subsidies',
    'Collateral-Free Loans',
    'Women & SC/ST Enterprise',
    'Food Processing',
    'Women Welfare & Micro-credit',
  ];

  const fetchSchemes = async () => {
    setIsLoading(true);
    try {
      let url = '/api/schemes?';
      if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery.trim())}&`;
      if (selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
      const res = await apiRequest(url);
      setSchemes(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSchemes();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Strictly Verified Policy Data</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          {t('schemes.title', 'Government Schemes')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {t(
            'schemes.subtitle',
            'Explore verified central and state schemes supporting rural businesses and women entrepreneurs.'
          )}
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(
              'schemes.searchPlaceholder',
              'Search schemes by keyword, sector, or eligibility...'
            )}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Cards List */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>{t('common.loading', 'Loading verified schemes...')}</p>
        </div>
      ) : schemes.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
          No schemes found matching "{searchQuery}".
        </div>
      ) : (
        <div className="space-y-6">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}

    </div>
  );
};
