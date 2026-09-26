'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Compass,
  Flame,
  ArrowRight,
  ShieldCheck,
  Network,
  Users,
  Award,
  Sparkles,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { PRESET_COURSES } from '@/lib/preset-courses';
import { getStreakData, recordDayActivity, StreakData } from '@/lib/streak-tracker';

export default function HomePage() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updated = recordDayActivity();
    setStreak(updated);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f5] selection:bg-yellow-400 selection:text-black relative overflow-x-hidden font-sans">
      {/* Top Ambient Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none z-0 blur-3xl"
        style={{
          background: 'radial-gradient(rgba(250, 204, 21, 0.15) 0%, rgba(202, 138, 4, 0.03) 60%, transparent 80%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Navigation Header */}
      <header className="relative z-10 h-20 border-b border-white/10 px-6 sm:px-12 flex items-center justify-between bg-[#0a0a0c]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black font-extrabold flex items-center justify-center font-mono text-sm shadow-[0_0_12px_#facc15]">
            Ψ
          </div>
          <span className="font-extrabold text-base tracking-wider text-white">
            NEXUS<span className="text-yellow-400">.AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Daily Streak Counter HUD (Hydration Guarded) */}
          {mounted && streak && (
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-yellow-400/30 text-xs font-mono">
              <Flame className="w-4 h-4 text-yellow-400 animate-pulse fill-yellow-400" />
              <span className="text-yellow-400 font-bold">{streak.currentStreak} Day Streak</span>
              <span className="text-neutral-500">({streak.multiplier.toFixed(1)}x XP)</span>
            </div>
          )}

          <Link
            href="/refer"
            className="text-xs font-mono text-neutral-400 hover:text-white transition-colors hidden sm:block"
          >
            Refer & Earn
          </Link>

          <Link href="/dashboard">
            <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-full px-5 py-2 shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all">
              Launch Platform
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-28 space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-400 text-[11px] font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Prerequisite Learning DAG
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Master Any Domain Through{' '}
            <span className="text-yellow-400">Topological Progression.</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed max-w-2xl mx-auto">
            Break free from linear, superficial courses. Upload any syllabus or select a curated track to map conceptual knowledge graphs, clear prerequisite gates, and earn verified competency credentials.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm rounded-full px-8 py-6 shadow-[0_0_25px_rgba(250,204,21,0.4)] flex items-center justify-center gap-2">
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Button>
            </Link>
            <Link href="/refer">
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-full border-white/10 hover:bg-white/5 text-neutral-300 px-6 py-6 text-sm"
              >
                <Users className="w-4 h-4 text-yellow-400 mr-2" /> Invite Peers (+100 XP)
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0e0e11]/80 backdrop-blur-xl space-y-3">
            <Network className="w-8 h-8 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">Directed Acyclic Graph (DAG)</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Every lesson is node-mapped. Modules remain strictly gated until prerequisite diagnostic assessments are satisfied at ≥ 75%.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-[#0e0e11]/80 backdrop-blur-xl space-y-3">
            <Flame className="w-8 h-8 text-yellow-400 fill-yellow-400/20" />
            <h3 className="text-lg font-bold text-white">Streak Velocity Engine</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Build daily learning momentum. Maintain consecutive study streaks to multiply XP coefficients and earn platform badges.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-[#0e0e11]/80 backdrop-blur-xl space-y-3">
            <Award className="w-8 h-8 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">Verified Competency Credentials</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Generate cryptographic SVG certificates when all topological concepts and capstones across a curriculum are solved.
            </p>
          </div>
        </div>

        {/* Curated Career Tracks Showcase */}
        <div className="space-y-6 pt-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Curated Learning Tracks</h2>
              <p className="text-xs text-neutral-400">High-intensity modules engineered with formulas and code blueprints.</p>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-mono text-yellow-400 hover:underline flex items-center gap-1"
            >
              View All 5 Tracks <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRESET_COURSES.slice(0, 3).map((track) => (
              <div
                key={track.id}
                className="p-6 rounded-3xl border border-white/10 bg-[#0e0e11]/90 hover:border-yellow-400/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded border border-yellow-400/30">
                    {track.badge}
                  </span>
                  <h3 className="text-lg font-bold text-white">{track.title}</h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">{track.description}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-500">{track.estimatedHours}</span>
                  <Link href={`/course/${track.id}`}>
                    <Button
                      size="sm"
                      className="bg-white/10 hover:bg-yellow-400 hover:text-black text-white text-xs rounded-xl font-bold transition-all"
                    >
                      Open Track
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}