import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { Scheme } from '../../types';
import { apiRequest } from '../../api/client';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminSchemesPage: React.FC = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchemeId, setEditingSchemeId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    scheme_name: '',
    description: '',
    category: 'Micro Enterprise & Subsidies',
    eligibility: '',
    benefits: '',
    required_documents: 'Aadhaar Card, PAN Card, Project Report',
    application_process: '',
    official_website: 'https://www.kviconline.gov.in',
    deadline: 'Ongoing',
    state: 'Central / All States',
    target_users: 'Rural Entrepreneurs, Women',
    language: 'Hindi & English',
    is_verified: true,
  });

  const fetchSchemes = async () => {
    try {
      const res = await apiRequest('/api/schemes');
      setSchemes(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleOpenAdd = () => {
    setEditingSchemeId(null);
    setFormData({
      scheme_name: '',
      description: '',
      category: 'Micro Enterprise & Subsidies',
      eligibility: '',
      benefits: '',
      required_documents: 'Aadhaar Card, PAN Card, Project Report',
      application_process: '',
      official_website: '',
      deadline: 'Ongoing',
      state: 'Central / All States',
      target_users: 'Rural Entrepreneurs, Women',
      language: 'Hindi & English',
      is_verified: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (s: Scheme) => {
    setEditingSchemeId(s.id);
    setFormData({
      scheme_name: s.scheme_name,
      description: s.description,
      category: s.category,
      eligibility: s.eligibility,
      benefits: s.benefits,
      required_documents: s.required_documents.join(', '),
      application_process: s.application_process,
      official_website: s.official_website,
      deadline: s.deadline,
      state: s.state,
      target_users: s.target_users,
      language: s.language,
      is_verified: s.is_verified,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete scheme "${name}"?`)) return;
    try {
      await apiRequest(`/api/admin/schemes/${id}`, { method: 'DELETE' });
      fetchSchemes();
    } catch {
      alert('Could not delete scheme.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      required_documents: formData.required_documents.split(',').map((d) => d.trim()),
    };

    try {
      if (editingSchemeId) {
        await apiRequest(`/api/admin/schemes/${editingSchemeId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest('/api/admin/schemes', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchSchemes();
    } catch {
      alert('Could not save scheme.');
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
            Manage Government Schemes
          </h1>
          <p className="text-xs text-slate-500">
            Publish verified central & state subsidies, criteria, and documentation requirements.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenAdd} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Add New Scheme</span>
        </Button>
      </div>

      <div className="space-y-4">
        {schemes.map((s) => (
          <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">{s.scheme_name}</h3>
                {s.is_verified && <Badge variant="verified">VERIFIED</Badge>}
                <Badge variant="saffron">{s.category}</Badge>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{s.description}</p>
              <p className="text-xs font-semibold text-brand-800">Benefits: {s.benefits}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => handleOpenEdit(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl border">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(s.id, s.scheme_name)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl border">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingSchemeId ? 'Edit Scheme' : 'Add Scheme'} maxWidth="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Scheme Name *</label>
            <input type="text" required value={formData.scheme_name} onChange={(e) => setFormData({ ...formData, scheme_name: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Category *</label>
            <input type="text" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Key Benefits *</label>
            <textarea rows={2} required value={formData.benefits} onChange={(e) => setFormData({ ...formData, benefits: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Eligibility Criteria</label>
            <textarea rows={2} value={formData.eligibility} onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Required Documents (comma-separated)</label>
            <input type="text" value={formData.required_documents} onChange={(e) => setFormData({ ...formData, required_documents: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Official Portal Link</label>
            <input type="url" value={formData.official_website} onChange={(e) => setFormData({ ...formData, official_website: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Save Scheme</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
