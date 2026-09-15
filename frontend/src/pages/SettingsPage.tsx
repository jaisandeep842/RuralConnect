import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Globe, Lock, Volume2, Shield, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { apiRequest } from '../api/client';
import { Button } from '../components/common/Button';

export const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, setLanguage, logout } = useAuthStore();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    setIsChangingPass(true);
    setPassSuccess(false);
    setPassError(null);

    try {
      await apiRequest('/api/users/change-password', {
        method: 'POST',
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });
      setPassSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassError(err.message || 'Could not change password.');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
          {t('nav.settings', 'Settings')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your account preferences, security, and interface language.
        </p>
      </div>

      {/* Language Preferences Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Platform Language / भाषा</h3>
            <p className="text-xs text-slate-500">Choose your preferred language across the site and AI.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { code: 'mr', label: 'मराठी', sub: 'Marathi' },
            { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
            { code: 'en', label: 'English', sub: 'English' },
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => setLanguage(item.code as any)}
              className={`p-4 rounded-2xl text-center border transition-all ${
                i18n.language === item.code
                  ? 'bg-brand-50 border-brand-500 text-brand-900 font-bold shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="text-sm font-bold">{item.label}</div>
              <div className="text-[10px] text-slate-500">{item.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Security & Password Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Change Password</h3>
            <p className="text-xs text-slate-500">Ensure your account remains safe with a strong password.</p>
          </div>
        </div>

        {passSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Password updated successfully!</span>
          </div>
        )}

        {passError && (
          <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{passError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-1 flex justify-end">
            <Button variant="primary" size="sm" type="submit" isLoading={isChangingPass}>
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* Logout Action */}
      <div className="bg-red-50/50 rounded-3xl border border-red-100 p-6 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-red-900">Sign Out</h4>
          <p className="text-xs text-red-600">End your current session on this device.</p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>

    </div>
  );
};
