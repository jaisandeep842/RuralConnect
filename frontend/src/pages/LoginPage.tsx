import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, AlertCircle, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { Button } from '../components/common/Button';
import { apiRequest } from '../api/client';
import { useAuthStore } from '../store/authStore';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email_or_phone: emailOrPhone,
          password: password,
        }),
      });

      setAuth(response.user, response.access_token);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email/phone or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (email: string, pass: string) => {
    setEmailOrPhone(email);
    setPassword(pass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-amber-100 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-700 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-700/20">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {t('nav.login', 'Login to RuralConnect')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Enter your registered email or mobile number to continue.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-800 font-semibold animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email or Phone Number / ईमेल किंवा फोन
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="sunita@ruralconnect.in or 9822334455"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password / पासवर्ड
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <Button variant="primary" size="lg" type="submit" isLoading={isLoading} className="w-full">
            <span>{t('nav.login', 'Login')}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        {/* Quick Demo Logins */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Quick Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('sunita@ruralconnect.in', 'Rural@12345')}
              className="p-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left font-medium text-amber-950 transition-colors"
            >
              <div className="font-bold">Sunita Kamble</div>
              <div className="text-[10px] text-amber-800">Rural Entrepreneur</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@ruralconnect.in', 'Admin@12345')}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left font-medium text-emerald-950 transition-colors"
            >
              <div className="font-bold">Dr. Rajesh Sharma</div>
              <div className="text-[10px] text-emerald-800">Platform Admin</div>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          New to RuralConnect?{' '}
          <Link to="/register" className="text-brand-700 font-bold hover:underline">
            Register your business here
          </Link>
        </p>

      </div>
    </div>
  );
};
