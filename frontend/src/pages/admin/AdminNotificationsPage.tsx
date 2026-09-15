import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../../api/client';
import { Button } from '../../components/common/Button';

export const AdminNotificationsPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('/learn');
  const [type, setType] = useState('announcement');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSuccess(false);

    try {
      await apiRequest('/api/admin/notifications/broadcast', {
        method: 'POST',
        body: JSON.stringify({ title, message, link, type }),
      });
      setSuccess(true);
      setTitle('');
      setMessage('');
    } catch {
      alert('Could not send broadcast.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Overview</span>
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
          Broadcast Platform Announcements
        </h1>
        <p className="text-xs text-slate-500">
          Send high-priority notifications to all registered rural entrepreneurs simultaneously.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Notification broadcasted successfully to all users!</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Notification Title *
            </label>
            <input
              type="text"
              required
              placeholder="E.g., New Government Subsidy Workshop Announced"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Message Content *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Enter announcement details in simple language..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Link on Click
              </label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-brand-600 focus:outline-none"
              >
                <option value="announcement">Announcement</option>
                <option value="training">Training Alert</option>
                <option value="scheme">Scheme Update</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="md" type="submit" isLoading={isSending} className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              <span>Send Broadcast to All Users</span>
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
};
