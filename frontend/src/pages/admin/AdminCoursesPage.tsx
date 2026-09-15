import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Plus, Trash2, Edit2, Play } from 'lucide-react';
import { Course } from '../../types';
import { apiRequest } from '../../api/client';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Entrepreneurship',
    thumbnail: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80',
    level: 'Beginner',
    language: 'Hindi / English',
    total_duration_minutes: 90,
    tags: 'Business, Skills',
  });

  const fetchCourses = async () => {
    try {
      const res = await apiRequest('/api/courses');
      setCourses(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenAdd = () => {
    setEditingCourseId(null);
    setFormData({
      title: '',
      description: '',
      category: 'Entrepreneurship',
      thumbnail: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80',
      level: 'Beginner',
      language: 'Hindi / English',
      total_duration_minutes: 90,
      tags: 'Business, Skills',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Course) => {
    setEditingCourseId(c.id);
    setFormData({
      title: c.title,
      description: c.description,
      category: c.category,
      thumbnail: c.thumbnail,
      level: c.level,
      language: c.language,
      total_duration_minutes: c.total_duration_minutes,
      tags: 'Skills, Rural Business',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete course "${title}" and all its lessons?`)) return;
    try {
      await apiRequest(`/api/admin/courses/${id}`, { method: 'DELETE' });
      fetchCourses();
    } catch {
      alert('Could not delete course.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()),
    };

    try {
      if (editingCourseId) {
        await apiRequest(`/api/admin/courses/${editingCourseId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest('/api/admin/courses', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchCourses();
    } catch {
      alert('Could not save course.');
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
            Manage Courses
          </h1>
          <p className="text-xs text-slate-500">
            Create and organize learning courses and tracks.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenAdd} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div key={c.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <img src={c.thumbnail} alt={c.title} className="w-full h-40 object-cover" />
              <div className="p-5 space-y-2">
                <Badge variant="brand">{c.category}</Badge>
                <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
                <p className="text-xs text-slate-400">{c.total_lessons} Lessons • {c.total_duration_minutes} Mins</p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs pt-3">
              <Link to={`/courses/${c.id}`} className="font-bold text-brand-700 hover:underline">
                View Course →
              </Link>
              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenEdit(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(c.id, c.title)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCourseId ? 'Edit Course' : 'Add Course'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Course Title *</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Category *</label>
            <input type="text" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Thumbnail URL</label>
            <input type="url" value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" />
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit">Save Course</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
