import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { Course, Lesson } from '../types';
import { apiRequest } from '../api/client';
import { CoursePlayer } from '../components/courses/CoursePlayer';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseData = async () => {
    if (!id) return;
    try {
      const [c, l] = await Promise.all([
        apiRequest(`/api/courses/${id}`),
        apiRequest(`/api/courses/${id}/lessons`),
      ]);
      setCourse(c);
      setLessons(l);
    } catch (err: any) {
      setError(err.message || 'Course could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">
        <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p>{t('common.loading', 'Loading lectures...')}</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Course Not Found</h2>
        <p className="text-sm text-slate-600">{error || 'The requested course does not exist.'}</p>
        <Link to="/learn" className="inline-block text-sm font-bold text-brand-700 hover:underline">
          ← Back to Learning Academy
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb Back */}
      <div className="flex items-center gap-2">
        <Link
          to="/learn"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Courses</span>
        </Link>
      </div>

      {/* Internal Course Player */}
      <CoursePlayer
        course={course}
        lessons={lessons}
        onProgressUpdated={fetchCourseData}
      />

    </div>
  );
};
