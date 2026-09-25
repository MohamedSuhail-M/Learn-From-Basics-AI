'use client';

import { useState } from 'react';
import { CheckCircle2, Lock, PlayCircle, BookOpen, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CoursePlayerPage() {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonId, setActiveLessonId] = useState('m1-l1');

  // Sample data structure from your syllabus generator
  const modules = [
    {
      id: 'mod-1',
      title: 'Module 1: Mathematical Foundations & Vectors',
      status: 'completed',
      lessons: [
        { id: 'm1-l1', title: 'Vector Spaces & Dot Products', duration: '12 min', completed: true },
        { id: 'm1-l2', title: 'Matrix Transformations', duration: '18 min', completed: true },
      ],
      assessment: { id: 'quiz-1', title: 'Module 1 Prerequisite Test', score: '90%' },
    },
    {
      id: 'mod-2',
      title: 'Module 2: Gradient Optimization & Cost Functions',
      status: 'in-progress',
      lessons: [
        { id: 'm2-l1', title: 'Partial Derivatives in Practice', duration: '15 min', completed: false },
        { id: 'm2-l2', title: 'Gradient Descent Convergence', duration: '20 min', completed: false },
      ],
      assessment: { id: 'quiz-2', title: 'Module 2 Checkpoint Quiz', score: null },
    },
    {
      id: 'mod-3',
      title: 'Module 3: Neural Network Architectures',
      status: 'locked',
      lessons: [
        { id: 'm3-l1', title: 'Perceptrons to Multilayer Nets', duration: '25 min', completed: false },
      ],
      assessment: { id: 'quiz-3', title: 'Capstone Dependency Assessment', score: null },
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f5] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-[#0a0a0c]">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-xs font-mono text-yellow-400 hover:underline">
            ← BACK TO DASHBOARD
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-sm font-bold">Deep Learning & Neural Topologies</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-neutral-400">Progress: 45%</span>
          <div className="w-28 bg-white/10 h-2 rounded-full overflow-hidden">
            <div className="bg-yellow-400 h-full w-[45%]" />
          </div>
        </div>
      </header>

      {/* Main LMS Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Syllabus Modules Sidebar */}
        <aside className="w-80 border-r border-white/10 bg-[#0a0a0c]/80 overflow-y-auto p-4 space-y-6">
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 px-2">
            Course Curriculum
          </div>

          <div className="space-y-4">
            {modules.map((mod, mIdx) => (
              <div
                key={mod.id}
                className={`p-3 rounded-2xl border transition-all ${
                  mIdx === activeModuleIndex
                    ? 'border-yellow-400/50 bg-yellow-400/5'
                    : 'border-white/5 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-xs font-bold text-white leading-snug">{mod.title}</h4>
                  {mod.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {mod.status === 'locked' && <Lock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />}
                </div>

                {/* Lessons List */}
                <div className="space-y-1 pl-1">
                  {mod.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        if (mod.status !== 'locked') {
                          setActiveModuleIndex(mIdx);
                          setActiveLessonId(lesson.id);
                        }
                      }}
                      disabled={mod.status === 'locked'}
                      className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-between ${
                        activeLessonId === lesson.id
                          ? 'bg-yellow-400 text-black font-semibold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span className="truncate flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3" /> {lesson.title}
                      </span>
                      <span className="text-[10px] opacity-75">{lesson.duration}</span>
                    </button>
                  ))}

                  {/* Module Test CTA */}
                  <Link
                    href={`/learning-path?id=${mod.assessment.id}`}
                    className="mt-2 block py-1.5 px-2 rounded-lg border border-yellow-400/30 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 text-[11px] font-mono flex items-center justify-between"
                  >
                    <span>{mod.assessment.title}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right: Active Lesson & Material Panel */}
        <main className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-yellow-400">
              Module {activeModuleIndex + 1} // Lesson View
            </span>
            <h1 className="text-3xl font-extrabold text-white">Partial Derivatives in Practice</h1>
          </div>

          {/* Reading / Video Box */}
          <div className="p-8 rounded-3xl border border-white/10 bg-[#0e0e11] space-y-6">
            <div className="prose prose-invert max-w-none text-neutral-300 text-sm leading-relaxed space-y-4">
              <p>
                In multivariate calculus, gradient vectors store the directional derivatives along every independent axis. When optimizing loss manifolds, computing the analytical gradient enables parameter updates according to the negative descent direction.
              </p>
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] font-mono text-xs text-yellow-300">
                ∇f(x, y) = [ ∂f/∂x, ∂f/∂y ]^T
              </div>
              <p>
                Before proceeding to the subsequent module, your grasp on vector dot-products and partial chains will be evaluated by the diagnostic engine to prevent blocking knowledge gaps.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-mono">15 min read completed</span>
              <Link href="/learning-path?action=new">
                <button className="px-5 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)] flex items-center gap-1.5">
                  <span>Take Module Checkpoint Test</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}