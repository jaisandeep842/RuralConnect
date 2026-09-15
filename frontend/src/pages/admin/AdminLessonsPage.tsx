import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, ArrowLeft, Plus, Trash2, Edit2, Play, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Lesson, Course } from '../../types';
import { apiRequest } from '../../api/client';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminLessonsPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course-entrepreneurship');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    course_id: 'course-entrepreneurship',
    lesson_number: 1,
    lesson_title: '',
    description: '',
    video_url: '',
    embed_url: '',
    video_source_type: 'youtube',
    provider: 'YouTube',
    language: 'Hindi',
    duration_minutes: 30,
    learning_objectives: '',
    order: 1,
    is_embeddable: true,
  });

  const fetchCoursesAndLessons = async () => {
    setIsLoading(true);
    try {
      const cList = await apiRequest('/api/courses');
      setCourses(cList);
      const cId = selectedCourseId || cList[0]?.id;
      if (cId) {
        setSelectedCourseId(cId);
        const lList = await apiRequest(`/api/courses/${cId}/lessons`);
        setLessons(lList);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndLessons();
  }, [selectedCourseId]);

  const handleOpenAdd = () => {
    setEditingLessonId(null);
    setFormData({
      course_id: selectedCourseId,
      lesson_number: lessons.length + 1,
      lesson_title: '',
      description: '',
      video_url: '',
      embed_url: '',
      video_source_type: 'youtube',
      provider: 'YouTube',
      language: 'Hindi / English',
      duration_minutes: 30,
      learning_objectives: 'Understand core principles\nAnalyze local demand',
      order: lessons.length + 1,
      is_embeddable: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (l: Lesson) => {
    setEditingLessonId(l.id);
    setFormData({
      course_id: l.course_id,
      lesson_number: l.lesson_number,
      lesson_title: l.lesson_title,
      description: l.description,
      video_url: l.video_url,
      embed_url: l.embed_url,
      video_source_type: l.video_source_type,
      provider: l.provider,
      language: l.language,
      duration_minutes: l.duration_minutes,
      learning_objectives: (l.learning_objectives || []).join('\n'),
      order: l.order,
      is_embeddable: l.is_embeddable,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete lecture "${title}"?`)) return;
    try {
      await apiRequest(`/api/admin/lessons/${id}`, { method: 'DELETE' });
      fetchCoursesAndLessons();
    } catch {
      alert('Could not delete lecture.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      learning_objectives: formData.learning_objectives
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingLessonId) {
        await apiRequest(`/api/admin/lessons/${editingLessonId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest('/api/admin/lessons', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchCoursesAndLessons();
    } catch {
      alert('Could not save lecture.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Overview</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            YouTube Lectures & Video Management
          </h1>
          <p className="text-xs text-slate-500">
            Configure internal YouTube embeds, lecture numbers, descriptions, and learning objectives.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenAdd} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Add New Lecture</span>
        </Button>
      </div>

      {/* Select Course Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCourseId(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCourseId === c.id
                ? 'bg-brand-700 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {c.title} ({c.total_lessons})
          </button>
        ))}
      </div>

      {/* Lectures List */}
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="brand">Lecture {lesson.lesson_number}</Badge>
                <Badge variant="slate">{lesson.duration_minutes} Mins</Badge>
                {lesson.is_embeddable && <Badge variant="verified">EMBED VERIFIED</Badge>}
              </div>

              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {lesson.lesson_title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2">
                {lesson.description}
              </p>
              <p className="text-[11px] text-slate-400 font-mono truncate">
                Source: {lesson.video_url || 'Text Lesson'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {lesson.embed_url && (
                <a
                  href={`/courses/${lesson.course_id}`}
                  className="px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50 rounded-xl border border-brand-200 flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Test Play</span>
                </a>
              )}
              <button
                onClick={() => handleOpenEdit(lesson)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl border border-slate-200"
                title="Edit Lecture"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(lesson.id, lesson.lesson_title)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl border border-slate-200"
                title="Delete Lecture"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Lecture Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingLessonId ? 'Edit Lecture' : 'Add New Lecture'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Lecture Number *</label>
              <input
                type="number"
                required
                value={formData.lesson_number}
                onChange={(e) => setFormData({ ...formData, lesson_number: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 rounded-xl border text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 20 })}
                className="w-full px-3 py-2 rounded-xl border text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Lecture Title *</label>
            <input
              type="text"
              required
              placeholder="E.g., Entrepreneurship Lecture 4"
              value={formData.lesson_title}
              onChange={(e) => setFormData({ ...formData, lesson_title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">YouTube URL (e.g. https://youtu.be/...)</label>
            <input
              type="url"
              placeholder="https://youtu.be/..."
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Learning Objectives (1 per line)</label>
            <textarea
              rows={3}
              value={formData.learning_objectives}
              onChange={(e) => setFormData({ ...formData, learning_objectives: e.target.value })}
              placeholder="Objective 1&#10;Objective 2"
              className="w-full px-3 py-2 rounded-xl border text-sm"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Lecture
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
