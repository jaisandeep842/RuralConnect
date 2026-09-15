import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCheck, Calendar, Award, BookOpen, Megaphone, Clock } from 'lucide-react';
import { Notification } from '../types';
import { apiRequest } from '../api/client';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const NotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await apiRequest('/api/notifications');
      setNotifications(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await apiRequest('/api/notifications/read-all', { method: 'PUT' });
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
    } catch {
      // Handled
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await apiRequest(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch {
      // Handled
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'training_registration':
      case 'mentor_appointment':
        return <Calendar className="w-5 h-5 text-brand-600" />;
      case 'certificate':
        return <Award className="w-5 h-5 text-amber-600" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {t('notifications.title', 'Notifications')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Stay updated with training reminders, mentor sessions, and certificates.
          </p>
        </div>

        {notifications.some((n) => !n.is_read) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4 text-brand-700" />
            <span>{t('notifications.markAllRead', 'Mark All Read')}</span>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>{t('common.loading', 'Loading notifications...')}</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p>{t('notifications.noNotifications', 'You are all caught up!')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.is_read && handleMarkRead(notif.id)}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                notif.is_read
                  ? 'bg-white border-slate-200 text-slate-700'
                  : 'bg-amber-50/50 border-amber-200 text-slate-900 shadow-sm cursor-pointer'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                  {!notif.is_read && (
                    <span className="w-2 h-2 rounded-full bg-terracotta-600 shrink-0" />
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {notif.message}
                </p>

                <p className="text-[11px] text-slate-400 pt-1">
                  {new Date(notif.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
