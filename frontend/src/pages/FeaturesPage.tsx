import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sparkles, Bot, Mic, BookOpen, Video, Users, ShieldCheck,
  Award, HeartHandshake, Compass, Smartphone, Check
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const FeaturesPage: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Mic,
      title: 'Multimodal AI Voice Assistant',
      badge: 'Hindi • Marathi • English',
      description: 'Rural entrepreneurs who prefer speaking over typing can simply click the large microphone to ask questions in their native language. Powered by speech recognition and natural speech synthesis.',
      details: [
        'Live speech-to-text in regional Indian dialects',
        'Natural audio playback of business guidance',
        'Full fallback to responsive text chat',
      ],
    },
    {
      icon: ShieldCheck,
      title: 'Retrieval-Augmented Generation (RAG) on Verified Schemes',
      badge: 'Anti-Hallucination Verified',
      description: 'Never guess government requirements. Our AI checks authentic policy documents for PMEGP, Mudra, Stand-Up India, and PMFME before answering queries.',
      details: [
        'Zero invented schemes or fake deadlines',
        'Direct citation of official government portals',
        'Clear eligibility and documentation checklists',
      ],
    },
    {
      icon: Video,
      title: 'Internal YouTube Course Player',
      badge: 'Zero External Redirects',
      description: 'All 5 core video lectures for Entrepreneurship and Digital Marketing play seamlessly inside RuralConnect. Users never lose context or get redirected to third-party apps.',
      details: [
        'Internal embedded playback with progress tracking',
        'Next / Previous lesson navigation',
        'Automatic certificate generation upon course completion',
      ],
    },
    {
      icon: Users,
      title: 'Specialist Indian Mentors Directory',
      badge: '1-on-1 Rural Guidance',
      description: 'Connect with verified Indian business advisors from Maharashtra and across India specializing in food processing, retail branding, and micro-finance.',
      details: [
        'Convenient date and time slot booking',
        'Direct notification reminders',
        'Experienced mentors who understand village markets',
      ],
    },
    {
      icon: Compass,
      title: 'Personalized Recommendations Engine',
      badge: 'Tailored for Your Business',
      description: 'Based on whether you run a food processing unit, handloom workshop, or dairy farm, RuralConnect customizes your dashboard with the most relevant courses and schemes.',
      details: [
        'Personalized by business type and district',
        'Automatic suggestions for training and mentors',
        'Profile completion guidance',
      ],
    },
    {
      icon: Smartphone,
      title: 'Low-Bandwidth & Mobile-First Design',
      badge: 'Optimized for 3G/4G/5G',
      description: 'Designed specifically for rural mobile networks with lightweight components, high contrast typography, accessible touch targets, and offline-friendly text fallbacks.',
      details: [
        'High readability under bright outdoor sunlight',
        'Minimal battery and data consumption',
        'Strictly no horizontal scrolling or broken cards',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="brand">POWERFUL CAPABILITIES</Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
          Designed from the Ground Up for Rural India
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Explore how RuralConnect combines verified knowledge, multilingual artificial intelligence, and community-driven mentorship to empower micro-enterprises.
        </p>
      </div>

      {/* Grid of features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="saffron" size="sm">
                    {feat.badge}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feat.description}
                </p>

                <ul className="space-y-2 pt-2 border-t border-slate-100">
                  {feat.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                      <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="bg-amber-50 rounded-3xl p-8 sm:p-12 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl font-black text-slate-900 font-heading">
            Experience RuralConnect in your language
          </h3>
          <p className="text-sm text-slate-600">
            Switch between Hindi, Marathi, and English with one click.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/register">
            <Button variant="primary" size="lg">
              Get Started Now
            </Button>
          </Link>
          <Link to="/assistant">
            <Button variant="outline" size="lg">
              Try AI Assistant
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
};
