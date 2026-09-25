import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, Bot, Users, Calendar, ShieldCheck, HeartHandshake,
  ArrowRight, Sparkles, CheckCircle2, Star, Award, Phone
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const featureCards = [
    {
      title: 'Learning Academy',
      desc: 'Watch step-by-step video lectures on Entrepreneurship, Digital Marketing, and Self-Help Group finance.',
      icon: BookOpen,
      link: '/learn',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Multilingual AI Assistant',
      desc: 'Ask any business query by voice or text in Hindi, Marathi, or English with verified references.',
      icon: Bot,
      link: '/assistant',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      title: 'Specialist Indian Mentors',
      desc: 'Book one-on-one appointments with verified agro-business mentors, bank managers, and design specialists.',
      icon: Users,
      link: '/mentors',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Training & Workshops',
      desc: 'Join practical online & field workshops on food processing, FSSAI registration, and WhatsApp catalog sales.',
      icon: Calendar,
      link: '/training',
      color: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      title: 'Verified Government Schemes',
      desc: 'Clear, accurate guidance on PMEGP 35% subsidies, Mudra loans, Stand-Up India, and PMFME.',
      icon: ShieldCheck,
      link: '/schemes',
      color: 'bg-green-50 text-green-800 border-green-200',
    },
    {
      title: 'Entrepreneur Community',
      desc: 'Connect with fellow rural women entrepreneurs, showcase your craft, and celebrate success milestones.',
      icon: HeartHandshake,
      link: '/community',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-amber-100/50 via-amber-50/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-900 border border-brand-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4 text-brand-700" />
                <span>AI-Powered Rural Entrepreneurship Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 font-heading tracking-tight leading-[1.15]">
                {t('hero.title', 'RuralConnect')}
                <span className="block text-brand-700 mt-1">
                  {t('hero.tagline', 'Learn. Connect. Grow.')}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-normal">
                {t(
                  'hero.description',
                  'RuralConnect helps rural entrepreneurs learn business skills, find specialist mentors, discover verified government schemes, attend training, and receive AI-powered business guidance in simple local languages.'
                )}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link to="/register">
                  <Button variant="primary" size="lg" className="flex items-center gap-2">
                    <span>{t('hero.startJourney', 'Start Your Journey')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <Link to="/assistant">
                  <Button variant="saffron" size="lg" className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-slate-900" />
                    <span>{t('hero.talkAi', 'Talk to AI Assistant')}</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg">
                <div>
                  <p className="text-2xl font-black text-slate-900 font-heading">5,000+</p>
                  <p className="text-xs text-slate-600 font-medium">Rural Entrepreneurs</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-brand-700 font-heading">100%</p>
                  <p className="text-xs text-slate-600 font-medium">Verified Schemes</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-amber-700 font-heading">3 Langs</p>
                  <p className="text-xs text-slate-600 font-medium">हिन्दी • मराठी • Eng</p>
                </div>
              </div>

            </div>

            {/* Right Column: Authentic Indian Rural Entrepreneur Visuals */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&auto=format&fit=crop&q=80"
                  alt="Indian rural woman entrepreneur working on spices and handicrafts"
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Highlight Badge: Indian Self-Help Group */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Empowering Self-Help Groups (SHGs)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Pickle & Spice Units • Paithani Handlooms • Organic Dairy
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Verified Scheme Notification */}
              <div className="hidden sm:flex absolute -top-4 -right-4 p-3 bg-white rounded-2xl shadow-xl border border-amber-200 items-center gap-2 text-xs font-bold text-slate-800 animate-in fade-in duration-300">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>PMEGP 35% Subsidy Verified</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <Badge variant="brand">COMPLETE PLATFORM</Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
            Everything You Need to Start and Grow
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From basic business literacy to credit linkage, RuralConnect brings all essential entrepreneurial tools directly to your fingertips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                to={card.link}
                className="bg-white rounded-2xl border border-slate-200/80 p-7 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group hover:-translate-y-1 duration-200"
              >
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${card.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-800 transition-colors font-heading">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-6 flex items-center gap-2 text-xs font-bold text-brand-700 group-hover:text-brand-800">
                  <span>Explore Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Visual Representation & Village Context Section */}
      <section className="bg-amber-50/60 border-y border-amber-200/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden shadow-md border-2 border-white">
                <img
                  src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80"
                  alt="Rural spice processing"
                  className="w-full h-48 sm:h-56 object-cover"
                />
                <div className="p-3 bg-white text-xs font-bold text-slate-800">
                  Food & Spice Processing
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md border-2 border-white mt-6">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80"
                  alt="Artisan handloom weaving"
                  className="w-full h-48 sm:h-56 object-cover"
                />
                <div className="p-3 bg-white text-xs font-bold text-slate-800">
                  Handlooms & Crafts
                </div>
              </div>
            </div>

            <div className="space-y-6 text-left">
              <Badge variant="saffron">BUILT FOR RURAL INDIA</Badge>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
                Designed for Rural Realities, Low Bandwidth & Local Languages
              </h2>
              <p className="text-slate-700 leading-relaxed text-base">
                Whether you run a tailoring shop in your village, produce organic jaggery, or manage a dairy farm, RuralConnect eliminates complex jargon and paperwork confusion.
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0" />
                  <span>Speech-to-Text Voice Assistant in Hindi & Marathi</span>
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0" />
                  <span>YouTube Video Lectures that play seamlessly inside RuralConnect</span>
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0" />
                  <span>Verified Indian mentors with local Maharashtra expertise</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link to="/features">
                  <Button variant="outline" size="md">
                    Learn More About Our Features
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-brand-900 rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black font-heading tracking-tight">
              Ready to take your rural enterprise to the next level?
            </h2>
            <p className="text-brand-100 text-sm sm:text-base leading-relaxed">
              Create your free account today, access all video courses, book mentor sessions, and receive personalized recommendations.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-4 relative z-10">
            <Link to="/register">
              <Button variant="saffron" size="lg">
                Create Free Account
              </Button>
            </Link>
            <Link to="/assistant">
              <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                Ask AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
