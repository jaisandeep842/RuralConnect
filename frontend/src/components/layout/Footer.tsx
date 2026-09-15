import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, ExternalLink, Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-xl">
                RC
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Rural<span className="text-brand-400">Connect</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering rural women and entrepreneurs across India with practical business education, specialist mentors, verified government support, and multilingual AI guidance.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400 font-semibold bg-brand-950/60 border border-brand-800/60 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Built for Rural India • 100% Free Access</span>
            </div>
          </div>

          {/* Col 2: Learning & Growth */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Explore Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/learn" className="hover:text-brand-400 transition-colors">
                  Learning Academy (Video Courses)
                </Link>
              </li>
              <li>
                <Link to="/mentors" className="hover:text-brand-400 transition-colors">
                  Specialist Indian Mentors
                </Link>
              </li>
              <li>
                <Link to="/training" className="hover:text-brand-400 transition-colors">
                  Workshops & Field Training
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="hover:text-brand-400 transition-colors">
                  Verified Government Schemes
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-brand-400 transition-colors">
                  Entrepreneur Community
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-brand-400 transition-colors">
                  Multilingual AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Portals */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Official Portals
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a
                  href="https://www.kviconline.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  PMEGP Portal (KVIC) <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mudra.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  Mudra Loans Portal <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://udyamregistration.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  Udyam MSME Registration <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmfme.mofpi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  PMFME Food Processing <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://standupmitra.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  Stand-Up India Scheme <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Rural Support Helplines */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Entrepreneur Helpline
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">1800-180-1551</p>
                  <p className="text-xs">Kisan & Rural Call Centre (Toll Free)</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">1800-11-0001</p>
                  <p className="text-xs">National MSME Helpline</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 mt-0.5" />
                <div>
                  <p className="text-xs">Maharashtra Rural Enterprise Initiative, Pune / Satara Hub</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 RuralConnect. Dedicated to the hardworking rural entrepreneurs of India.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>for Rural India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
