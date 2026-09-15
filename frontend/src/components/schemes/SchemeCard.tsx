import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, FileText, CheckCircle2, ChevronDown, ChevronUp,
  ExternalLink, Sparkles, Building2, HelpCircle
} from 'lucide-react';
import { Scheme } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface SchemeCardProps {
  scheme: Scheme;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAskAi = () => {
    navigate(`/assistant?query=${encodeURIComponent(`Tell me eligibility and documents for ${scheme.scheme_name}`)}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-6 sm:p-7 space-y-4">
        
        {/* Header: Title & Badges */}
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {scheme.is_verified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                VERIFIED
              </span>
            )}
            <Badge variant="saffron">{scheme.category}</Badge>
            <Badge variant="slate">{scheme.state}</Badge>
          </div>

          <h3 className="text-xl font-bold text-slate-900 font-heading">
            {scheme.scheme_name}
          </h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            {scheme.description}
          </p>
        </div>

        {/* Highlighted Benefits Card */}
        <div className="p-4 bg-brand-50/70 rounded-xl border border-brand-200/60 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-700" />
            {t('schemes.benefits', 'Key Benefits')}
          </span>
          <p className="text-sm font-semibold text-brand-950 leading-relaxed">
            {scheme.benefits}
          </p>
        </div>

        {/* Collapsible Details (Eligibility, Documents, Application Process) */}
        {isExpanded && (
          <div className="space-y-4 pt-3 border-t border-slate-100 text-sm animate-in fade-in duration-200">
            <div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">
                {t('schemes.eligibility', 'Eligibility Criteria')}
              </h4>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {scheme.eligibility}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                {t('schemes.documents', 'Required Documents')}
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {scheme.required_documents.map((doc, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-xs font-medium text-slate-700 border border-slate-100"
                  >
                    <FileText className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span className="truncate">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">
                {t('schemes.applyProcess', 'How to Apply')}
              </h4>
              <p className="text-slate-600 leading-relaxed text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                {scheme.application_process}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Target Users: <strong>{scheme.target_users}</strong></span>
              <span>Deadline: <strong>{scheme.deadline}</strong></span>
            </div>
          </div>
        )}

        {/* Bottom Actions: Expand, Ask AI, Official Portal */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-slate-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
          >
            <span>{isExpanded ? 'Show Less Details' : 'View Full Requirements & Process'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="saffron"
              size="sm"
              onClick={handleAskAi}
              className="flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-900" />
              <span>{t('schemes.askAi', 'Ask AI About This Scheme')}</span>
            </Button>

            {scheme.official_website && (
              <a
                href={scheme.official_website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span>{t('schemes.officialLink', 'Official Website')}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
