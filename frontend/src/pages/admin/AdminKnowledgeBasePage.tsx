import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, ArrowLeft, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../../api/client';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminKnowledgeBasePage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    topic: '',
    category: 'Entrepreneurship',
    question: '',
    answer: '',
    language: 'en',
    tags: 'rural, business',
    source: 'Verified Official Manual',
    is_verified: true,
  });

  const fetchKB = async () => {
    try {
      const res = await apiRequest('/api/admin/knowledge-base');
      setItems(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchKB();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this verified knowledge item?')) return;
    try {
      await apiRequest(`/api/admin/knowledge-base/${id}`, { method: 'DELETE' });
      fetchKB();
    } catch {
      alert('Could not delete item.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()),
    };
    try {
      await apiRequest('/api/admin/knowledge-base', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setModalOpen(false);
      fetchKB();
    } catch {
      alert('Could not add knowledge item.');
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
            AI Verified Knowledge Base (RAG)
          </h1>
          <p className="text-xs text-slate-500">
            Entries here are consulted by the AI Assistant to ensure anti-hallucinated, verified responses.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Add Knowledge Item</span>
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="brand">{item.category}</Badge>
                <Badge variant="verified">VERIFIED SOURCE</Badge>
              </div>
              <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Q: {item.question}</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">
              A: {item.answer}
            </p>
            <p className="text-[11px] text-slate-400">
              Source: <strong>{item.source}</strong>
            </p>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Verified Knowledge" maxWidth="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Topic / Title *</label>
            <input type="text" required value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Question / Prompt *</label>
            <input type="text" required value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Verified Answer / Guidance *</label>
            <textarea rows={4} required value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Source Citation *</label>
            <input type="text" required value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Save to Knowledge Base</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
