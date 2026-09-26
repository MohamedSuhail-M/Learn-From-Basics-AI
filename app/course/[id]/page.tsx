'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Lock,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  Award,
  ChevronRight,
  CheckSquare,
  Square
} from 'lucide-react';
import { getStudentProgress, toggleLessonCompletion, StudentProgressRecord } from '@/lib/course-progress';
import { PRESET_COURSES } from '@/lib/preset-courses';

export default function CourseLearningWorkspace() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id;
  const courseId = Array.isArray(rawId) ? rawId[0] : (rawId as string) || 'ml-foundations';

  const [progress, setProgress] = useState<StudentProgressRecord | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string>('mod-1');
  const [activeLessonId, setActiveLessonId] = useState<string>('m1-l1');

  const currentCourse = PRESET_COURSES.find((c) => c.id === courseId) || PRESET_COURSES[0];
  const curriculum = currentCourse.curriculum;

  useEffect(() => {
    const data = getStudentProgress(currentCourse.id, currentCourse.title);
    setProgress(data);
    if (curriculum[0]?.lessons[0]) {
      setActiveLessonId(curriculum[0].lessons[0].id);
    }
  }, [currentCourse.id, currentCourse.title, curriculum]);

  if (!progress) return null;

  const currentModuleData = curriculum.find((m) => m.id === activeModuleId) || curriculum[0];
  const currentModuleState = progress.modules[activeModuleId];
  const activeLesson = currentModuleData.lessons.find((l) => l.id === activeLessonId) || currentModuleData.lessons[0];

  const isCurrentLessonDone = currentModuleState?.completedLessons?.includes(activeLesson.id);

  const handleToggleLesson = () => {
    const updated = toggleLessonCompletion(currentCourse.id, activeModuleId, activeLesson.id);
    setProgress({ ...updated });
  };

  const handleLaunchModuleQuiz = () => {
    // Collect all lesson texts for this module to ground the quiz questions
    const moduleLessonContent = currentModuleData.lessons
      .map((l) => `${l.title}:\n${l.readingSnippet} ${l.keyFormula ? `[Formula: ${l.keyFormula}]` : ''}`)
      .join('\n\n');

    localStorage.setItem('active_assessment_text', moduleLessonContent);
    localStorage.setItem('active_assessment_name', `${currentCourse.title} - ${currentModuleData.title}`);

    router.push(
      `/learning-path?courseId=${currentCourse.id}&moduleId=${currentModuleData.id}&action=new&moduleTitle=${encodeURIComponent(
        currentModuleData.title
      )}&moduleNumber=${currentModuleData.number}`
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f5] flex flex-col font-sans selection:bg-yellow-400 selection:text-black">
      {/* Top Application Bar */}
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-[#0a0a0c]">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xs font-mono text-yellow-400 hover:underline flex items-center gap-1">
            ← DASHBOARD
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-sm font-bold tracking-tight text-white">{currentCourse.title}</span>
        </div>

        <div className="flex items-center gap-6">
          {progress.isCertified && (
            <Link
              href={`/certificate?courseId=${currentCourse.id}`}
              className="px-3.5 py-1.5 rounded-full bg-yellow-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(250,204,21,0.4)]"
            >
              <Award className="w-4 h-4" /> View Credential
            </Link>
          )}

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-neutral-400">Mastery: {progress.overallProgress}%</span>
            <div className="w-28 bg-white/10 h-2 rounded-full overflow-hidden border border-white/5">
              <div
                className="bg-yellow-400 h-full transition-all duration-500 shadow-[0_0_8px_#facc15]"
                style={{ width: `${progress.overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* LMS Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Syllabus Sidebar with Module Checkmarks */}
        <aside className="w-80 sm:w-88 border-r border-white/10 bg-[#0a0a0c]/90 overflow-y-auto p-4 space-y-4">
          <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 px-1 flex items-center justify-between">
            <span>{currentCourse.category} Sequence</span>
            <span className="text-yellow-400 font-bold">{progress.overallProgress}% Complete</span>
          </div>

          <div className="space-y-3">
            {curriculum.map((mod, idx) => {
              const state = progress.modules[mod.id];
              const isUnlocked = state?.isUnlocked ?? (idx === 0);
              const isCompleted = state?.isCompleted;
              const isActive = mod.id === activeModuleId;

              return (
                <div
                  key={mod.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isActive
                      ? 'border-yellow-400/60 bg-yellow-400/5'
                      : isUnlocked
                      ? 'border-white/10 bg-white/[0.02]'
                      : 'border-white/5 bg-white/[0.01] opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-xs font-bold text-white leading-snug">{mod.title}</h4>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isUnlocked ? (
                      <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse mt-1 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                    )}
                  </div>

                  {/* Lessons */}
                  <div className="space-y-1 pl-1">
                    {mod.lessons.map((lesson) => {
                      const isDone = state?.completedLessons?.includes(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          disabled={!isUnlocked}
                          onClick={() => {
                            setActiveModuleId(mod.id);
                            setActiveLessonId(lesson.id);
                          }}
                          className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-between transition-colors ${
                            activeLessonId === lesson.id && isActive
                              ? 'bg-yellow-400 text-black font-bold'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          <span className="truncate flex items-center gap-1.5">
                            {isDone ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <BookOpen className="w-3 h-3 shrink-0" />
                            )}
                            {lesson.title}
                          </span>
                          <span className="text-[10px] opacity-75 font-mono shrink-0">{lesson.duration}</span>
                        </button>
                      );
                    })}

                    {/* Checkpoint Quiz */}
                    <div className="pt-2 mt-2 border-t border-white/5">
                      {isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveModuleId(mod.id);
                            handleLaunchModuleQuiz();
                          }}
                          className={`w-full py-1.5 px-2.5 rounded-lg text-[11px] font-mono flex items-center justify-between border transition-all cursor-pointer ${
                            isCompleted
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                              : 'border-yellow-400/40 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300'
                          }`}
                        >
                          <span className="truncate">
                            {isCompleted ? `Passed (${state?.score}%)` : 'Take Module Quiz'}
                          </span>
                          <ArrowRight className="w-3 h-3 shrink-0" />
                        </button>
                      ) : (
                        <div className="text-[10px] font-mono text-neutral-500 flex items-center gap-1 py-1">
                          <Lock className="w-3 h-3" /> Requires Module {idx} Pass (≥ 75%)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right: Active Lesson View & Read Checkmark */}
        <main className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto space-y-6">
          {!currentModuleState?.isUnlocked && activeModuleId !== 'mod-1' ? (
            <div className="p-8 border border-rose-500/30 bg-rose-500/[0.03] rounded-3xl space-y-4 text-center my-12">
              <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
              <h2 className="text-xl font-bold text-white">Module Access Gated</h2>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                You cannot access this module until you score at least <strong>75%</strong> on the previous module&apos;s checkpoint quiz.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-yellow-400">
                  {currentCourse.title} // Module {currentModuleData.number}
                </span>
                <h1 className="text-3xl font-extrabold text-white">
                  {activeLesson?.title}
                </h1>
              </div>

              <div className="p-8 rounded-3xl border border-white/10 bg-[#0e0e11]/90 backdrop-blur-xl shadow-2xl space-y-6">
                <div className="prose prose-invert max-w-none text-neutral-300 text-sm leading-relaxed space-y-4">
                  <p>{activeLesson?.readingSnippet}</p>

                  {activeLesson?.keyFormula && (
                    <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] font-mono text-xs text-yellow-300">
                      {activeLesson.keyFormula}
                    </div>
                  )}

                  <p>
                    Diagnostic questions for this module will evaluate this specific lesson&apos;s principles to test your prerequisite understanding before unlocking subsequent stages.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleToggleLesson}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                      isCurrentLessonDone
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                        : 'border-white/10 bg-white/5 text-neutral-300 hover:text-white'
                    }`}
                  >
                    {isCurrentLessonDone ? (
                      <>
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Square className="w-4 h-4 text-neutral-500" />
                        <span>Mark as Completed</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleLaunchModuleQuiz}
                    className="px-6 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Take Module {currentModuleData.number} Checkpoint Quiz</span>
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}