import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Calendar, Clock, MapPin, Users, Video, CheckCircle2,
  AlertCircle, ShieldCheck
} from 'lucide-react';
import { Training } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { apiRequest } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

interface TrainingCardProps {
  training: Training;
  onRegistered?: () => void;
}

export const TrainingCard: React.FC<TrainingCardProps> = ({ training, onRegistered }) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [isRegistered, setIsRegistered] = useState(training.is_registered || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleRegister = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    try {
      if (isRegistered) {
        await apiRequest(`/api/training/${training.id}/cancel`, { method: 'POST' });
        setIsRegistered(false);
      } else {
        await apiRequest(`/api/training/${training.id}/register`, { method: 'POST' });
        setIsRegistered(true);
      }
      if (onRegistered) onRegistered();
    } catch {
      // Friendly error handled
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
      <div className="p-6 space-y-4">
        
        {/* Header badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Badge variant="brand">{training.category}</Badge>
            <Badge variant={training.mode === 'online' ? 'saffron' : 'slate'}>
              {training.mode === 'online' ? (
                <span className="flex items-center gap-1">
                  <Video className="w-3 h-3 text-amber-700" />
                  {t('training.online', 'Online Workshop')}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {t('training.offline', 'In-Person Workshop')}
                </span>
              )}
            </Badge>
          </div>

          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{training.available_seats} {t('training.seats', 'Seats Left')}</span>
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            {training.title}
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
            {training.description}
          </p>
        </div>

        {/* Trainer & Organization */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
          <p className="text-slate-500">
            <strong>{t('training.trainer', 'Trainer')}:</strong> {training.trainer}
          </p>
          <p className="text-slate-500">
            <strong>{t('training.organization', 'Organization')}:</strong> {training.organization}
          </p>
        </div>

        {/* Date, Time & Venue */}
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
            <span className="font-semibold text-slate-800">{training.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-600 shrink-0" />
            <span>{training.start_time} - {training.end_time}</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <span className="text-slate-500 truncate">{training.venue}</span>
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400">
          Deadline: {training.deadline}
        </span>

        <Button
          variant={isRegistered ? 'outline' : 'primary'}
          size="sm"
          onClick={handleToggleRegister}
          isLoading={isLoading}
          className="flex items-center gap-1.5"
        >
          {isRegistered ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t('training.registered', 'Registered (Cancel)')}</span>
            </>
          ) : (
            <span>{t('training.register', 'Register for Free')}</span>
          )}
        </Button>
      </div>
    </div>
  );
};
