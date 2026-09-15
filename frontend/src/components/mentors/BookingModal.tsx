import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Mentor } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { apiRequest } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

interface BookingModalProps {
  mentor: Mentor | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  mentor,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [date, setDate] = useState('2026-03-20');
  const [timeSlot, setTimeSlot] = useState('04:00 PM - 05:00 PM');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!mentor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await apiRequest('/api/mentors/book', {
        method: 'POST',
        body: JSON.stringify({
          mentor_id: mentor.id,
          date,
          time_slot: timeSlot,
          notes,
        }),
      });
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Could not complete booking.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={isSuccess ? 'Booking Confirmed' : `Book Appointment with ${mentor.name}`}
    >
      {isSuccess ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Appointment Booked Successfully!
          </h3>
          <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            Your appointment with <strong>{mentor.name}</strong> has been scheduled for{' '}
            <strong>{date}</strong> at <strong>{timeSlot}</strong>. Confirmation details have been sent to your Notifications.
          </p>
          <div className="pt-4">
            <Button variant="primary" onClick={handleReset} className="w-full">
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200/60">
            <img
              src={mentor.photo}
              alt={mentor.name}
              className="w-12 h-12 rounded-full object-cover border border-brand-400"
            />
            <div>
              <p className="font-bold text-slate-900 text-sm">{mentor.name}</p>
              <p className="text-xs text-brand-800 font-medium">{mentor.expertise}</p>
              <p className="text-xs text-slate-500">{mentor.location}</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              {t('mentors.selectDate', 'Select Date')}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              {t('mentors.selectTime', 'Select Time Slot')}
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none bg-white"
            >
              <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
              <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
              <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
              <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM (Popular)</option>
              <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              What would you like to consult on? (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., Inquiring about starting a pickle packaging unit or getting FSSAI license..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="outline" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isLoading}>
              {t('mentors.confirmBooking', 'Confirm Appointment')}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
