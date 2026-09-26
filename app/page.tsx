'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Flame,
  ArrowRight,
  Network,
  Users,
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { PRESET_COURSES } from '@/lib/preset-courses';
import { recordDayActivity, StreakData } from '@/lib/streak-tracker';

// 3D SVG Vector Hologram Engine
function Hologram3DVector() {
  const [rotation, setRotation] = useState({ aX: 0, aY: 0, aZ: 0 });

  useEffect(() => {
    let animId: number;
    const animate = () => {
      setRotation((prev) => ({
        aX: prev.aX + 0.007,
        aY: prev.aY + 0.011,
        aZ: prev.aZ + 0.004,
      }));
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 3D Octahedron & Central Topology Coordinates
  const nodes: [number, number, number][] = [
    [0, -1.25, 0],   // Top apex
    [1.15, 0, 0],    // Right
    [0, 0, 1.15],    // Front
    [-1.15, 0, 0],   // Left
    [0, 0, -1.15],   // Back
    [0, 1.25, 0],    // Bottom apex
    // Inner orbital lattice
    [0.55, 0.55, 0.55],
    [-0.55, 0.55, -0.55],
    [0.55, -0.55, -0.55],
    [-0.55, -0.55, 0.55]
  ];

  const edges: [number, number][] = [
    [0, 1], [0, 2], [0, 3], [0, 4], // Upper pyramid
    [5, 1], [5, 2], [5, 3], [5, 4], // Lower pyramid
    [1, 2], [2, 3], [3, 4], [4, 1], // Equator belt
    [6, 7], [7, 8], [8, 9], [9, 6]  // Inner lattice
  ];

  // 3D Perspective Projection
  const cx = 160;
  const cy = 160;
  const fov = 130;
  const dist = 3.3;

  const projectedNodes = nodes.map(([x, y, z]) => {
    let x1 = x * Math.cos(rotation.aY) + z * Math.sin(rotation.aY);
    let z1 = -x * Math.sin(rotation.aY) + z * Math.cos(rotation.aY);

    let y2 = y * Math.cos(rotation.aX) - z1 * Math.sin(rotation.aX);
    let z2 = y * Math.sin(rotation.aX) + z1 * Math.cos(rotation.aX);

    let x3 = x1 * Math.cos(rotation.aZ) - y2 * Math.sin(rotation.aZ);
    let y3 = x1 * Math.sin(rotation.aZ) + y2 * Math.cos(rotation.aZ);

    const scale = fov / (z2 + dist);
    return {
      x: x3 * scale + cx,
      y: y3 * scale + cy,
      z: z2,
    };
  });

  return (
    <div className="relative w-[320px] h-[320px] flex items-center justify-center select-none pointer-events-none">
      {/* Radiant Amber Glow Backdrop */}
      <div className="absolute w-[260px] h-[260px] bg-yellow-400/15 rounded-full blur-3xl animate-pulse" />

      <svg width="320" height="320" viewBox="0 0 320 320" className="relative z-10 overflow-visible">
        <defs>
          <radialGradient id="homeHoloNodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#facc15" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Orbit Reticles */}
        <circle
          cx="160"
          cy="160"
          r="140"
          fill="none"
          stroke="#facc15"
          strokeWidth="1"
          strokeDasharray="6 10"
          opacity="0.25"
          className="animate-[spin_24s_linear_infinite]"
        />
        <circle
          cx="160"
          cy="160"
          r="120"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeDasharray="3 6"
          opacity="0.12"
          className="animate-[spin_14s_linear_infinite_reverse]"
        />

        {/* Wireframe Edges */}
        {edges.map(([start, end], idx) => {
          const p1 = projectedNodes[start];
          const p2 = projectedNodes[end];
          const avgZ = (p1.z + p2.z) / 2;
          const alpha = Math.max(0.18, Math.min(0.9, (avgZ + 1.2) / 2.4));

          return (
            <line
              key={`edge-${idx}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#facc15"
              strokeWidth="1.5"
              strokeOpacity={alpha}
            />
          );
        })}

        {/* Node Vertices */}
        {projectedNodes.map((p, idx) => {
          const radius = Math.max(2.6, (p.z + 1.6) * 2.4);
          const opacity = Math.max(0.35, (p.z + 1.6) / 2.6);

          return (
            <g key={`node-${idx}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r={radius * 1.8}
                fill="url(#homeHoloNodeGlow)"
                opacity={opacity * 0.6}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={radius}
                fill="#fde047"
                stroke="#000000"
                strokeWidth="1"
                opacity={opacity}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

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

      {/* Hero Section with 3D Hologram */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-28 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-400 text-[11px] font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen Prerequisite Learning DAG
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Master Any Domain Through{' '}
              <span className="text-yellow-400">Topological Progression.</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              Break free from linear, superficial courses. Upload any syllabus or select a curated track to map conceptual knowledge graphs, clear prerequisite gates, and earn verified competency credentials.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
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

          {/* Right 3D Vector Hologram */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <Hologram3DVector />
            <div className="text-center pt-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-yellow-400/70">
                Topological Core // Active Synthesis
              </span>
            </div>
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