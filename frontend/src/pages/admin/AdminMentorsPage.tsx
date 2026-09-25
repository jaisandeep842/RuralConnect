import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowLeft, Plus, Trash2, Edit2, ShieldCheck } from 'lucide-react';
import { Mentor } from '../../types';
import { apiRequest } from '../../api/client';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminMentorsPage: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMentorId, setEditingMentorId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    photo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&auto=format&fit=crop&q=80',
    expertise: 'Agro-Processing & Dairy',
    experience: '10+ years',
    qualification: 'M.Sc. Agriculture',
    languages: 'Marathi, Hindi',
    location: 'Pune, Maharashtra',
    availability: 'Mon to Fri (4 PM - 7 PM)',
    rating: 5.0,
    sessions: 25,
    bio: '',
    is_verified: true,
  });

  const fetchMentors = async () => {
    try {
      const res = await apiRequest('/api/mentors');
      setMentors(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleOpenAdd = () => {
    setEditingMentorId(null);
    setFormData({
      name: '',
      photo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&auto=format&fit=crop&q=80',
      expertise: 'Agro-Processing & Dairy',
      experience: '10+ years',
      qualification: 'M.Sc. Agriculture',
      languages: 'Marathi, Hindi',
      location: 'Pune, Maharashtra',
      availability: 'Mon to Fri (4 PM - 7 PM)',
      rating: 5.0,
      sessions: 25,
      bio: '',
      is_verified: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (m: Mentor) => {
    setEditingMentorId(m.id);
    setFormData({
      name: m.name,
      photo: m.photo,
      expertise: m.expertise,
      experience: m.experience,
      qualification: m.qualification,
      languages: m.languages.join(', '),
      location: m.location,
      availability: m.availability,
      rating: m.rating,
      sessions: m.sessions,
      bio: m.bio,
      is_verified: m.is_verified,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete mentor ${name}?`)) return;
    try {
      await apiRequest(`/api/admin/mentors/${id}`, { method: 'DELETE' });
      fetchMentors();
    } catch {
      alert('Could not delete mentor.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      languages: formData.languages.split(',').map((l) => l.trim()),
    };

    try {
      if (editingMentorId) {
        await apiRequest(`/api/admin/mentors/${editingMentorId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest('/api/admin/mentors', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchMentors();
    } catch {
      alert('Could not save mentor.');
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
            Specialist Indian Mentors
          </h1>
          <p className="text-xs text-slate-500">
            Manage Indian mentor profiles, expertise, availability, and verification badges.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenAdd} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Add New Indian Mentor</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((m) => (
          <div key={m.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <img src={m.photo} alt={m.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 text-base">{m.name}</h3>
                  {m.is_verified && <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />}
                </div>
                <p className="text-xs font-medium text-brand-700">{m.expertise}</p>
                <p className="text-xs text-slate-400">{m.location}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2">{m.bio}</p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Rating: <strong>{m.rating}★</strong></span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(m)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(m.id, m.name)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMentorId ? 'Edit Mentor' : 'Add New Indian Mentor'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Mentor Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Expertise *</label>
              <input
                type="text"
                required
                value={formData.expertise}
                onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Languages (comma-separated)</label>
            <input
              type="text"
              value={formData.languages}
              onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Indian Photo URL</label>
            <input
              type="url"
              value={formData.photo}
              onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Bio / Profile Description</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border text-sm"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Mentor
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
