import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, MapPin, Globe2, Award, Calendar, CheckCircle, ShieldCheck } from 'lucide-react';
import { Mentor } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { BookingModal } from './BookingModal';

interface MentorCardProps {
  mentor: Mentor;
  onBooked?: () => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, onBooked }) => {
  const { t } = useTranslation();
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
        <div className="p-6 space-y-4">
          
          {/* Top Header: Photo, Name & Badges */}
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={mentor.photo}
                alt={mentor.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-brand-500 shadow-sm"
              />
              {mentor.is_verified && (
                <span
                  className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-sm"
                  title="Verified Indian Business Mentor"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                {mentor.is_verified && (
                  <Badge variant="verified" size="sm">
                    VERIFIED MENTOR
                  </Badge>
                )}
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                  {mentor.rating.toFixed(1)}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-800 transition-colors">
                {mentor.name}
              </h3>
              <p className="text-xs font-semibold text-brand-800 leading-tight">
                {mentor.expertise}
              </p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{mentor.location}</span>
              </p>
            </div>
          </div>

          {/* Qualification & Experience */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl">
              <span className="text-slate-400 font-medium block">Experience</span>
              <span className="font-bold text-slate-800">{mentor.experience}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl">
              <span className="text-slate-400 font-medium block">Sessions</span>
              <span className="font-bold text-slate-800">{mentor.sessions}+ Guided</span>
            </div>
          </div>

          {/* Languages */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <Globe2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500 font-medium">Speaks:</span>
            {mentor.languages.map((lang, idx) => (
              <span
                key={idx}
                className="bg-amber-50 text-amber-900 font-semibold px-2 py-0.5 rounded-md border border-amber-200/60 text-[11px]"
              >
                {lang}
              </span>
            ))}
          </div>

          {/* Bio snippet */}
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
            {mentor.bio}
          </p>

          {/* Availability */}
          <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 font-medium flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{mentor.availability}</span>
          </div>

        </div>

        {/* Action Button */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-100">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setBookingOpen(true)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>{t('mentors.bookSession', 'Book Appointment')}</span>
          </Button>
        </div>
      </div>

      <BookingModal
        mentor={mentor}
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onSuccess={onBooked}
      />
    </>
  );
};
