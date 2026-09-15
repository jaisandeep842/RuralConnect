import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const languages = [
  { code: 'hi', label: 'हिन्दी', name: 'Hindi' },
  { code: 'mr', label: 'मराठी', name: 'Marathi' },
  { code: 'en', label: 'English', name: 'English' },
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { setLanguage } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[2];

  const handleSelect = (code: 'en' | 'hi' | 'mr') => {
    setLanguage(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-600 transition-colors shadow-sm"
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-brand-700" />
        <span>{currentLang.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 border border-slate-100 py-1.5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            Select Language / भाषा
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code as 'en' | 'hi' | 'mr')}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm text-left transition-colors ${
                i18n.language === lang.code
                  ? 'bg-brand-50 text-brand-800 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{lang.label}</span>
                <span className="text-xs text-slate-500">{lang.name}</span>
              </div>
              {i18n.language === lang.code && <Check className="w-4 h-4 text-brand-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
