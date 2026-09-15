import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2, Circle, Play, ChevronLeft, ChevronRight,
  BookOpen, Clock, AlertTriangle, Sparkles, Award, ExternalLink, RefreshCw
} from 'lucide-react';
import { Lesson, Course } from '../../types';
import { apiRequest } from '../../api/client';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import confetti from 'canvas-confetti';

function getCleanYouTubeEmbedUrl(url?: string, embedUrl?: string): string {
  const target = embedUrl || url || '';
  const match = target.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  if (target.includes('youtube-nocookie.com/embed/')) {
    return target.replace('youtube-nocookie.com', 'youtube.com');
  }
  return target;
}

function getYouTubeWatchUrl(url?: string, embedUrl?: string): string {
  const target = url || embedUrl || '';
  const match = target.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match) {
    return `https://www.youtube.com/watch?v=${match[1]}`;
  }
  return url || '';
}

interface CoursePlayerProps {
  course: Course;
  lessons: Lesson[];
  initialLessonIndex?: number;
  onProgressUpdated?: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  lessons,
  initialLessonIndex = 0,
  onProgressUpdated,
}) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(initialLessonIndex);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    new Set(lessons.filter((l) => l.is_completed).map((l) => l.id))
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  const currentLesson = lessons[currentIndex] || lessons[0];
  const isCurrentCompleted = currentLesson ? completedLessonIds.has(currentLesson.id) : false;
  const cleanEmbedUrl = currentLesson ? getCleanYouTubeEmbedUrl(currentLesson.video_url, currentLesson.embed_url) : '';
  const directWatchUrl = currentLesson ? getYouTubeWatchUrl(currentLesson.video_url, currentLesson.embed_url) : '';

  const handleSelectLesson = (index: number) => {
    setCurrentIndex(index);
    setEmbedError(false);
    setCelebrationMsg(null);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      handleSelectLesson(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < lessons.length - 1) {
      handleSelectLesson(currentIndex + 1);
    }
  };

  const handleToggleComplete = async () => {
    if (!currentLesson || isUpdating) return;
    setIsUpdating(true);
    const newCompleted = !isCurrentCompleted;

    try {
      const res = await apiRequest(`/api/courses/lessons/${currentLesson.id}/progress`, {
        method: 'POST',
        body: JSON.stringify({
          completed: newCompleted,
          watched_duration: currentLesson.duration_minutes * 60,
          total_duration: currentLesson.duration_minutes * 60,
        }),
      });

      const updated = new Set(completedLessonIds);
      if (newCompleted) {
        updated.add(currentLesson.id);
      } else {
        updated.delete(currentLesson.id);
      }
      setCompletedLessonIds(updated);

      if (res.course_completed) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
        setCelebrationMsg(
          "🎉 Congratulations! You completed all lectures for this course and earned your Certificate! Check the Certificates tab."
        );
      }

      if (onProgressUpdated) {
        onProgressUpdated();
      }
    } catch {
      // Handled gracefully by ApiError toast/state
    } finally {
      setIsUpdating(false);
    }
  };

  if (!currentLesson) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        No lectures available in this course yet.
      </div>
    );
  }

  const completionPercentage = lessons.length > 0
    ? Math.round((completedLessonIds.size / lessons.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {celebrationMsg && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between text-emerald-900 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-emerald-600 shrink-0" />
            <span className="font-bold text-sm md:text-base">{celebrationMsg}</span>
          </div>
          <Button size="sm" variant="primary" onClick={() => (window.location.href = '/certificates')}>
            View Certificate
          </Button>
        </div>
      )}

      {/* Main Grid: Left Syllabus, Right Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Course Title & Lecture Syllabus */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden order-2 lg:order-1">
          <div className="p-5 border-b border-slate-100 bg-amber-50/40">
            <h3 className="text-lg font-bold text-slate-900 font-heading leading-snug">
              {course.title}
            </h3>
            <div className="flex items-center justify-between mt-2 text-xs font-semibold text-slate-500">
              <span>{t('courses.syllabus', 'Course Syllabus')}</span>
              <span className="text-brand-700 font-bold">
                {completedLessonIds.size} / {lessons.length} {t('courses.completed', 'Completed')} ({completionPercentage}%)
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {lessons.map((lesson, idx) => {
              const isSelected = idx === currentIndex;
              const isCompleted = completedLessonIds.has(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleSelectLesson(idx)}
                  className={`w-full text-left p-4 transition-all flex items-start gap-3 hover:bg-slate-50 ${
                    isSelected ? 'bg-brand-50/70 border-l-4 border-brand-700' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Lecture {lesson.lesson_number}
                      </span>
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.duration_minutes}m
                      </span>
                    </div>
                    <p
                      className={`text-sm font-semibold truncate mt-0.5 ${
                        isSelected ? 'text-brand-900 font-bold' : 'text-slate-800'
                      }`}
                    >
                      {lesson.lesson_title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Embedded Video Player & Details */}
        <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
          
          {/* Internal Video Player Container with resilient fallback */}
          <div className="bg-black rounded-2xl overflow-hidden shadow-lg border border-slate-800 relative aspect-video flex items-center justify-center">
            {cleanEmbedUrl && !embedError ? (
              <iframe
                key={cleanEmbedUrl}
                src={`${cleanEmbedUrl}?rel=0&modestbranding=1&playsinline=1`}
                title={currentLesson.lesson_title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onError={() => setEmbedError(true)}
              />
            ) : (
              <div className="p-8 text-center text-slate-300 max-w-md space-y-3">
                <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">
                  {cleanEmbedUrl ? 'Video embed blocked by browser settings' : t('courses.videoUnavailable', 'Video unavailable inside RuralConnect.')}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {cleanEmbedUrl
                    ? 'Some browsers block embedded YouTube players. You can retry or open the video directly on YouTube.'
                    : 'Please read the comprehensive lesson summary and learning objectives below to complete this module.'}
                </p>
                {directWatchUrl && (
                  <div className="pt-2 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setEmbedError(false)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Player</span>
                    </button>
                    <a
                      href={directWatchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors shadow-sm"
                    >
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Bar (Previous, Mark Complete, Next) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('courses.previous', 'Previous')}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex === lessons.length - 1}
                className="flex items-center gap-1.5"
              >
                <span>{t('courses.next', 'Next')}</span>
                <ChevronRight className="w-4 h-4" />
              </Button>

              {directWatchUrl && (
                <a
                  href={directWatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-colors"
                  title="Open video in YouTube"
                >
                  <span>YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <Button
              variant={isCurrentCompleted ? 'outline' : 'primary'}
              onClick={handleToggleComplete}
              isLoading={isUpdating}
              className="flex items-center gap-2"
            >
              <CheckCircle2
                className={`w-5 h-5 ${
                  isCurrentCompleted ? 'text-emerald-600 fill-emerald-50' : 'text-white'
                }`}
              />
              <span>
                {isCurrentCompleted
                  ? t('courses.completed', 'Completed')
                  : t('courses.markCompleted', 'Mark as Completed')}
              </span>
            </Button>
          </div>

          {/* Lesson Details & Objectives */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <Badge variant="brand">Lecture {currentLesson.lesson_number}</Badge>
                <Badge variant="slate">{currentLesson.duration_minutes} Minutes</Badge>
                {currentLesson.is_verified && <Badge variant="verified">VERIFIED CURRICULUM</Badge>}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-heading">
                {currentLesson.lesson_title}
              </h2>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                {t('courses.description', 'Lesson Overview')}
              </h4>
              <p className="text-slate-700 leading-relaxed text-base">
                {currentLesson.description}
              </p>
            </div>

            {/* Learning Objectives */}
            {currentLesson.learning_objectives && currentLesson.learning_objectives.length > 0 && (
              <div className="p-5 bg-amber-50/50 rounded-xl border border-amber-200/60">
                <h4 className="text-sm font-bold uppercase tracking-wider text-amber-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  {t('courses.learningObjectives', 'What You Will Learn')}
                </h4>
                <ul className="space-y-2">
                  {currentLesson.learning_objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-2 shrink-0"></span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practical Text Content / Notes */}
            {currentLesson.text_content && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Key Practical Takeaways
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {currentLesson.text_content}
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
