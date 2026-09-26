'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Flame,
  ArrowRight,
  Network,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { PRESET_COURSES } from '@/lib/preset-courses';
import { recordDayActivity, StreakData } from '@/lib/streak-tracker';

/* -------------------------------------------------------------------------- */
/*  ORIGINAL 3D SVG TOPOLOGICAL CORE & ORBITAL RINGS COMPONENT                */
/* -------------------------------------------------------------------------- */
function TopologicalMasteryHologram() {
  const [t, setT] = useState(0);

  useEffect(() => {
    let animId: number;
    const animate = () => {
      setT((prev) => prev + 0.015);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 1. Central Solid Gold Polyhedron (Prism / Octahedron) Vertices
  const coreVertices: [number, number, number][] = [
    [0, -48, 0],     // 0: top apex
    [36, 0, 36],     // 1: front right
    [-36, 0, 36],    // 2: front left
    [-36, 0, -36],   // 3: back left
    [36, 0, -36],    // 4: back right
    [0, 48, 0],      // 5: bottom apex
  ];

  const coreFaces = [
    { verts: [0, 1, 2], baseColor: '#facc15', shade: '#eab308' },
    { verts: [0, 2, 3], baseColor: '#ca8a04', shade: '#a16207' },
    { verts: [0, 3, 4], baseColor: '#854d0e', shade: '#713f12' },
    { verts: [0, 4, 1], baseColor: '#fde047', shade: '#facc15' },
    { verts: [5, 2, 1], baseColor: '#eab308', shade: '#ca8a04' },
    { verts: [5, 3, 2], baseColor: '#a16207', shade: '#854d0e' },
    { verts: [5, 4, 3], baseColor: '#713f12', shade: '#552f0d' },
    { verts: [5, 1, 4], baseColor: '#facc15', shade: '#eab308' },
  ];

  // 2. Outer Geodesic Wireframe Sphere (Icosahedron + subdivision)
  const sphereRadius = 82;
  const phi = (1 + Math.sqrt(5)) / 2;
  const rawIcoNodes: [number, number, number][] = [
    [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
    [0, -1,  phi], [0,  1,  phi], [0, -1, -phi], [0,  1, -phi],
    [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
  ].map(([x, y, z]) => {
    const len = Math.hypot(x, y, z);
    return [(x / len) * sphereRadius, (y / len) * sphereRadius, (z / len) * sphereRadius];
  });

  const icoEdges = [
    [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
    [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
    [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
    [4, 9], [9, 8], [8, 6], [6, 2], [2, 4],
    [4, 5], [5, 9], [9, 1], [1, 8], [8, 7],
    [7, 6], [6, 10], [10, 2], [2, 11], [11, 4]
  ];

  // 3. Floating Satellite Crystals orbiting on rings
  const satellites = [
    { orbitRadius: 185, speed: 0.8, tiltX: 0.65, tiltY: 0.35, size: 14, phase: 0 },
    { orbitRadius: 215, speed: -0.6, tiltX: -0.5, tiltY: 0.7, size: 18, phase: 2.1 },
    { orbitRadius: 165, speed: 1.1, tiltX: 0.3, tiltY: -0.8, size: 12, phase: 4.3 },
    { orbitRadius: 195, speed: -0.75, tiltX: 0.8, tiltY: -0.2, size: 16, phase: 1.5 },
  ];

  // 4. Background Floating Golden Ember Particles
  const emberParticles = useMemo(() => {
    return Array.from({ length: 45 }, (_, i) => ({
      id: i,
      x: (Math.sin(i * 99) * 260) + 275,
      y: (Math.cos(i * 33) * 220) + 240,
      r: (Math.sin(i * 12) * 1.5) + 1.8,
      opacity: (Math.cos(i * 45) * 0.35) + 0.55,
      pulseSpeed: 0.02 + (i % 5) * 0.01,
    }));
  }, []);

  // 3D Projection & Rotation Engine
  const cx = 275;
  const cy = 240;
  const fov = 400;

  // Polyhedron rotation angles
  const rotX = t * 0.45;
  const rotY = t * 0.7;
  const rotZ = t * 0.25;

  const project = (x: number, y: number, z: number, rx = rotX, ry = rotY, rz = rotZ): [number, number, number] => {
    // Rotate Y
    let x1 = x * Math.cos(ry) + z * Math.sin(ry);
    let z1 = -x * Math.sin(ry) + z * Math.cos(ry);
    // Rotate X
    let y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
    let z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
    // Rotate Z
    let x3 = x1 * Math.cos(rz) - y2 * Math.sin(rz);
    let y3 = x1 * Math.sin(rz) + y2 * Math.cos(rz);

    const scale = fov / (fov + z2 + 100);
    return [x3 * scale + cx, y3 * scale + cy, z2];
  };

  // Wireframe sphere rotation (slower, opposite direction)
  const sphereRotX = t * 0.2;
  const sphereRotY = -t * 0.35;
  const projectedIco = rawIcoNodes.map(([x, y, z]) => project(x, y, z, sphereRotX, sphereRotY, 0));

  // Project solid core vertices
  const projectedCore = coreVertices.map(([x, y, z]) => project(x, y, z));

  // Compute depth and visibility for faces
  const sortedFaces = coreFaces
    .map((face) => {
      const p0 = projectedCore[face.verts[0]];
      const p1 = projectedCore[face.verts[1]];
      const p2 = projectedCore[face.verts[2]];
      const avgZ = (p0[2] + p1[2] + p2[2]) / 3;

      // Normal cross-product for backface culling
      const cross = (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p1[1] - p0[1]) * (p2[0] - p0[0]);
      return { ...face, avgZ, isFront: cross < 0, pts: `${p0[0]},${p0[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}` };
    })
    .filter((f) => f.isFront)
    .sort((a, b) => b.avgZ - a.avgZ);

  return (
    <div className="relative w-full max-w-[550px] h-[480px] flex items-center justify-center pointer-events-none select-none">
      {/* Central Volumetric Amber Glow */}
      <div className="absolute w-[360px] h-[360px] rounded-full bg-yellow-400/15 blur-3xl pointer-events-none" />

      <svg viewBox="0 0 550 480" className="w-full h-full overflow-visible relative z-10">
        <defs>
          <radialGradient id="goldHoloGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
            <stop offset="60%" stopColor="#facc15" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="ringGoldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#facc15" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#854d0e" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="ringGoldGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ca8a04" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#facc15" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0.95" />
          </linearGradient>

          <filter id="goldenGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Floating Dust Embers */}
        {emberParticles.map((ember) => {
          const pulse = Math.sin(t * 2 + ember.id) * 0.3 + ember.opacity;
          return (
            <circle
              key={ember.id}
              cx={ember.x}
              cy={ember.y}
              r={ember.r}
              fill="#facc15"
              opacity={Math.max(0.1, pulse)}
              className="transition-opacity"
            />
          );
        })}

        {/* --- 3D ORBITAL TORUS RINGS --- */}
        {/* Ring 1 (Broad horizontal tilt) */}
        <g transform={`translate(${cx}, ${cy}) rotate(${t * 4}) rotate(-18) scale(1, 0.32)`}>
          <ellipse
            cx="0"
            cy="0"
            rx="210"
            ry="210"
            fill="none"
            stroke="url(#ringGoldGrad1)"
            strokeWidth="3.5"
            filter="url(#goldenGlowFilter)"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="205"
            ry="205"
            fill="none"
            stroke="#fde047"
            strokeWidth="1"
            opacity="0.8"
          />
        </g>

        {/* Ring 2 (Counter-rotated steep angle) */}
        <g transform={`translate(${cx}, ${cy}) rotate(${-t * 3}) rotate(48) scale(1, 0.28)`}>
          <ellipse
            cx="0"
            cy="0"
            rx="225"
            ry="225"
            fill="none"
            stroke="url(#ringGoldGrad2)"
            strokeWidth="4"
            filter="url(#goldenGlowFilter)"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="220"
            ry="220"
            fill="none"
            stroke="#facc15"
            strokeWidth="1.2"
            opacity="0.85"
          />
        </g>

        {/* Ring 3 (Inner orbital resonance track) */}
        <g transform={`translate(${cx}, ${cy}) rotate(${t * 6}) rotate(-58) scale(1, 0.42)`}>
          <ellipse
            cx="0"
            cy="0"
            rx="155"
            ry="155"
            fill="none"
            stroke="#eab308"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            opacity="0.55"
          />
        </g>

        {/* --- GEODESIC WIREFRAME SPHERE ENVELOPE --- */}
        <g>
          {icoEdges.map(([start, end], idx) => {
            const p1 = projectedIco[start];
            const p2 = projectedIco[end];
            const avgZ = (p1[2] + p2[2]) / 2;
            const alpha = Math.max(0.18, Math.min(0.9, (avgZ + sphereRadius) / (sphereRadius * 2)));

            return (
              <line
                key={`ico-${idx}`}
                x1={p1[0]}
                y1={p1[1]}
                x2={p2[0]}
                y2={p2[1]}
                stroke="#facc15"
                strokeWidth="1.25"
                strokeOpacity={alpha}
              />
            );
          })}
          {/* Wireframe joints */}
          {projectedIco.map((p, idx) => (
            <circle
              key={`ico-node-${idx}`}
              cx={p[0]}
              cy={p[1]}
              r={2.2}
              fill="#fef08a"
              opacity={Math.max(0.3, (p[2] + sphereRadius) / (sphereRadius * 2))}
            />
          ))}
        </g>

        {/* --- CENTRAL SOLID SHADED GOLDEN POLYHEDRON --- */}
        <g filter="url(#goldenGlowFilter)">
          {sortedFaces.map((f, idx) => (
            <polygon
              key={`face-${idx}`}
              points={f.pts}
              fill={f.baseColor}
              stroke="#fef08a"
              strokeWidth="1.2"
              strokeLinejoin="round"
              opacity="0.94"
            />
          ))}
        </g>

        {/* --- ORBITING GOLDEN SATELLITE CRYSTALS --- */}
        {satellites.map((sat, idx) => {
          const currentAngle = t * sat.speed + sat.phase;
          const sx = Math.cos(currentAngle) * sat.orbitRadius;
          const sy = Math.sin(currentAngle) * sat.orbitRadius * sat.tiltX;
          const sz = Math.sin(currentAngle) * sat.orbitRadius * sat.tiltY;

          const [spx, spy, spz] = project(sx, sy, sz, 0.2, 0.4, 0);
          const sScale = Math.max(0.5, (spz + 200) / 250);

          return (
            <g
              key={`sat-${idx}`}
              transform={`translate(${spx}, ${spy}) rotate(${t * 30 + idx * 45}) scale(${sScale})`}
            >
              <rect
                x={-sat.size / 2}
                y={-sat.size / 2}
                width={sat.size}
                height={sat.size}
                fill="#facc15"
                stroke="#fef08a"
                strokeWidth="1.5"
                transform="rotate(45)"
                filter="url(#goldenGlowFilter)"
              />
              <rect
                x={-sat.size / 4}
                y={-sat.size / 4}
                width={sat.size / 2}
                height={sat.size / 2}
                fill="#a16207"
                transform="rotate(45)"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  HERO LANDING PAGE                                                         */
/* -------------------------------------------------------------------------- */
export default function HomePage() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updated = recordDayActivity();
    setStreak(updated);
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-[#f4f4f5] selection:bg-yellow-400 selection:text-black relative overflow-x-hidden font-sans">
      {/* Subtle Ambient Amber Top Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] pointer-events-none z-0 blur-3xl opacity-70"
        style={{
          background: 'radial-gradient(rgba(250, 204, 21, 0.12) 0%, rgba(202, 138, 4, 0.02) 65%, transparent 80%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Navigation Header */}
      <header className="relative z-20 h-20 border-b border-white/10 px-6 sm:px-12 flex items-center justify-between bg-[#070709]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black font-extrabold flex items-center justify-center font-mono text-sm shadow-[0_0_14px_#facc15]">
            Ψ
          </div>
          <span className="font-extrabold text-base tracking-wider text-white">
            NEXUS<span className="text-yellow-400">.AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
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

      {/* Exact Hero Section as Screenshot */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-10 pb-28 space-y-20">
        
        {/* HERO 3-COLUMN / FLEX CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[560px]">
          
          {/* Left Column: Big Bold Typography */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_6px_#facc15]" />
              <span className="text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase font-semibold">
                AI-POWERED DIAGNOSTIC ENGINE
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-[0.95] uppercase font-sans">
              Turn Any <br />
              Syllabus Into A <br />
              <span className="text-yellow-400">Mastery Roadmap.</span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-md">
              Upload course materials, take targeted diagnostic quizzes, and automatically discover your knowledge gaps mapped onto an interactive topological prerequisite graph.
            </p>

            {/* Pill Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-mono text-neutral-300">
                Document Grounded
              </span>
              <span className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-mono text-neutral-300">
                Topological DAG
              </span>
              <span className="px-3 py-1 rounded-full border border-yellow-400/40 bg-yellow-400/10 text-[11px] font-mono text-yellow-400">
                Gemini 2.5 Powered
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <Link href="/dashboard">
                <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-full px-6 py-5 shadow-[0_0_20px_rgba(250,204,21,0.35)] flex items-center gap-2">
                  <span>Start Learning Free</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Button>
              </Link>
              <Link href="/refer">
                <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/5 text-neutral-300 text-xs px-5 py-5">
                  <Users className="w-3.5 h-3.5 text-yellow-400 mr-2" /> Invite Peers
                </Button>
              </Link>
            </div>
          </div>

          {/* Center Column: 3D Holographic Topological Gold Core with Orbiting Rings */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <TopologicalMasteryHologram />
          </div>

          {/* Right Column: Hero Feature Cards (from Screenshot) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Card 1: Topological Sequencing */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0c0c0f]/90 backdrop-blur-xl shadow-xl space-y-3 relative group hover:border-yellow-400/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-yellow-400 font-bold">
                  DEPENDENCY ENGINE
                </span>
                <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Topological Sequencing
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Visualizes concepts in valid prerequisite sequence so you always know which foundation to master next.
              </p>
            </div>

            {/* Card 2: Zero Boilerplate */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0c0c0f]/90 backdrop-blur-xl shadow-xl space-y-3 relative group hover:border-yellow-400/40 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Zero Boilerplate
                </h3>
                <span className="text-[9px] font-mono uppercase tracking-wider text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 px-2 py-0.5 rounded font-bold">
                  100% CITED
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Verbatim excerpts and exact paragraph citations for every knowledge blocker identified.
              </p>
            </div>
          </div>

        </div>

        {/* Curated Career Tracks Showcase */}
        <div className="space-y-6 pt-12 border-t border-white/10">
          <div className="flex items-center justify-between pb-2">
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
                className="p-6 rounded-3xl border border-white/10 bg-[#0e0e11]/90 hover:border-yellow-400/50 transition-all flex flex-col justify-between space-y-4 shadow-xl"
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