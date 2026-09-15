import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Plus, Trash2, Edit2, Users } from 'lucide-react';
import { Training } from '../../types';
import { apiRequest } from '../../api/client';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminTrainingPage: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrainingId, setEditingTrainingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Food Processing',
    trainer: 'Dr. Ramesh Kulkarni',
    organization: 'Maharashtra Agricultural Council',
    date: '2026-04-05',
    start_time: '10:00 AM',
    end_time: '01:00 PM',
    mode: 'online',
    venue: 'Google Meet / RuralConnect Live',
    meeting_link: 'https://meet.google.com/rc-session',
    language: 'Hindi / Marathi',
    seats: 50,
    deadline: '2026-04-04',
    status: 'upcoming',
  });

  const fetchTrainings = async () => {
    try {
      const res = await apiRequest('/api/training');
      setTrainings(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleOpenAdd = () => {
    setEditingTrainingId(null);
    setFormData({
      title: '',
      description: '',
      category: 'Food Processing',
      trainer: 'Dr. Ramesh Kulkarni',
      organization: 'Maharashtra Agricultural Council',
      date: '2026-04-05',
      start_time: '10:00 AM',
      end_time: '01:00 PM',
      mode: 'online',
      venue: 'Google Meet / RuralConnect Live',
      meeting_link: 'https://meet.google.com/rc-session',
      language: 'Hindi / Marathi',
      seats: 50,
      deadline: '2026-04-04',
      status: 'upcoming',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t: Training) => {
    setEditingTrainingId(t.id);
    setFormData({
      title: t.title,
      description: t.description,
      category: t.category,
      trainer: t.trainer,
      organization: t.organization,
      date: t.date,
      start_time: t.start_time,
      end_time: t.end_time,
      mode: t.mode,
      venue: t.venue,
      meeting_link: t.meeting_link || '',
      language: t.language,
      seats: t.seats,
      deadline: t.deadline,
      status: t.status,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete workshop "${title}"?`)) return;
    try {
      await apiRequest(`/api/admin/training/${id}`, { method: 'DELETE' });
      fetchTrainings();
    } catch {
      alert('Could not delete workshop.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTrainingId) {
        await apiRequest(`/api/admin/training/${editingTrainingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await apiRequest('/api/admin/training', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      setModalOpen(false);
      fetchTrainings();
    } catch {
      alert('Could not save workshop.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Overview</span>
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            Manage Training & Workshops
          </h1>
          <p className="text-xs text-slate-500">
            Schedule workshops, set trainers, manage available seats and meeting links.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenAdd} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Add Workshop</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="brand">{t.category}</Badge>
                <Badge variant="slate">{t.mode.toUpperCase()}</Badge>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2">{t.description}</p>
              <div className="text-xs text-slate-500 pt-1">
                <p>Trainer: <strong>{t.trainer}</strong></p>
                <p>Date: <strong>{t.date}</strong> ({t.start_time})</p>
                <p>Seats: <strong>{t.seats} total</strong></p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button onClick={() => handleOpenEdit(t)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg border">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(t.id, t.title)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTrainingId ? 'Edit Workshop' : 'Add Workshop'} maxWidth="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Title *</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Trainer *</label>
              <input type="text" required value={formData.trainer} onChange={(e) => setFormData({ ...formData, trainer: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Organization *</label>
              <input type="text" required value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Date *</label>
              <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Mode *</label>
              <select value={formData.mode} onChange={(e) => setFormData({ ...formData, mode: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm bg-white">
                <option value="online">Online</option>
                <option value="offline">In-Person</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Total Seats</label>
              <input type="number" value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) || 50 })} className="w-full px-3 py-2 rounded-xl border text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Venue / Meeting Link</label>
            <input type="text" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Save Workshop</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
