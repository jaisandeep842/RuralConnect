import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Clock, Award, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { Course } from '../types';
import { apiRequest } from '../api/client';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const LearnPage: React.FC = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiRequest('/api/courses');
        setCourses(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="brand">{t('courses.title', 'Learning Academy')}</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          Practical Business Video Courses
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {t(
            'courses.subtitle',
            'Practical, step-by-step business video courses and lessons designed for rural entrepreneurs.'
          )}
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>{t('common.loading', 'Loading, please wait...')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const isFinished = course.progress_percentage === 100;
            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-bold">
                        {course.category}
                      </span>
                    </div>

                    {isFinished && (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white p-1.5 rounded-full shadow-md">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                        {course.total_lessons} {t('courses.lessonsCount', 'Lessons')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {course.total_duration_minutes} Mins
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-800 transition-colors font-heading leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>{t('courses.progress', 'Progress')}</span>
                        <span className="text-brand-700">{course.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-brand-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${course.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link to={`/courses/${course.id}`}>
                    <Button variant="primary" size="md" className="w-full flex items-center justify-center gap-2">
                      <Play className="w-4 h-4 fill-current" />
                      <span>
                        {course.progress_percentage > 0
                          ? t('courses.continueCourse', 'Continue Course')
                          : t('courses.startCourse', 'Start Learning')}
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
