'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Flame,
  ArrowRight,
  Users,
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { PRESET_COURSES } from '@/lib/preset-courses';
import { recordDayActivity, StreakData } from '@/lib/streak-tracker';

/* -------------------------------------------------------------------------- */
/*  ORIGINAL 3D SVG TOPOLOGICAL CORE WITH "START" HUD & ROTATING RINGS         */
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

  // 1. Central Solid Gold Polyhedron (Octahedron / Prism)
  const coreVertices: [number, number, number][] = [
    [0, -46, 0],     // 0: top apex
    [34, 0, 34],     // 1: front right
    [-34, 0, 34],    // 2: front left
    [-34, 0, -34],   // 3: back left
    [34, 0, -34],    // 4: back right
    [0, 46, 0],      // 5: bottom apex
  ];

  const coreFaces = [
    { verts: [0, 1, 2], baseColor: '#facc15', stroke: '#fef08a' },
    { verts: [0, 2, 3], baseColor: '#ca8a04', stroke: '#fde047' },
    { verts: [0, 3, 4], baseColor: '#854d0e', stroke: '#ca8a04' },
    { verts: [0, 4, 1], baseColor: '#fde047', stroke: '#fef08a' },
    { verts: [5, 2, 1], baseColor: '#eab308', stroke: '#fef08a' },
    { verts: [5, 3, 2], baseColor: '#a16207', stroke: '#facc15' },
    { verts: [5, 4, 3], baseColor: '#713f12', stroke: '#ca8a04' },
    { verts: [5, 1, 4], baseColor: '#facc15', stroke: '#fef08a' },
  ];

  // 2. Outer Geodesic Wireframe Sphere Envelope
  const sphereRadius = 88;
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

  // 3. Floating Satellites
  const satellites = [
    { orbitRadius: 210, speed: 0.9, tiltX: 0.45, tiltY: 0.25, size: 18, phase: 0 },
    { orbitRadius: 235, speed: -0.65, tiltX: -0.6, tiltY: 0.7, size: 20, phase: 2.4 },
    { orbitRadius: 180, speed: 1.15, tiltX: 0.2, tiltY: -0.85, size: 14, phase: 4.1 },
    { orbitRadius: 215, speed: -0.8, tiltX: 0.85, tiltY: -0.3, size: 16, phase: 1.2 },
  ];

  // 4. Background Floating Golden Embers
  const emberParticles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: (Math.sin(i * 77) * 260) + 260,
      y: (Math.cos(i * 44) * 220) + 230,
      r: (Math.sin(i * 11) * 1.5) + 1.6,
      opacity: (Math.cos(i * 35) * 0.35) + 0.55,
    }));
  }, []);

  const cx = 260;
  const cy = 230;
  const fov = 400;

  // Solid Core Rotation Angles
  const rotX = t * 0.4;
  const rotY = t * 0.65;
  const rotZ = t * 0.25;

  const project = (x: number, y: number, z: number, rx = rotX, ry = rotY, rz = rotZ): [number, number, number] => {
    let x1 = x * Math.cos(ry) + z * Math.sin(ry);
    let z1 = -x * Math.sin(ry) + z * Math.cos(ry);

    let y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
    let z2 = y * Math.sin(rx) + z1 * Math.cos(rx);

    let x3 = x1 * Math.cos(rz) - y2 * Math.sin(rz);
    let y3 = x1 * Math.sin(rz) + y2 * Math.cos(rz);

    const scale = fov / (fov + z2 + 100);
    return [x3 * scale + cx, y3 * scale + cy, z2];
  };

  // Wireframe Cage Rotation
  const cageRotX = t * 0.2;
  const cageRotY = -t * 0.35;
  const projectedIco = rawIcoNodes.map(([x, y, z]) => project(x, y, z, cageRotX, cageRotY, 0));

  // Project solid core vertices
  const projectedCore = coreVertices.map(([x, y, z]) => project(x, y, z));

  // Compute depth & backface culling for solid facets
  const sortedFaces = coreFaces
    .map((face) => {
      const p0 = projectedCore[face.verts[0]];
      const p1 = projectedCore[face.verts[1]];
      const p2 = projectedCore[face.verts[2]];
      const avgZ = (p0[2] + p1[2] + p2[2]) / 3;

      const cross = (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p1[1] - p0[1]) * (p2[0] - p0[0]);
      return { ...face, avgZ, isFront: cross < 0, pts: `${p0[0]},${p0[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}` };
    })
    .filter((f) => f.isFront)
    .sort((a, b) => b.avgZ - a.avgZ);

  return (
    <div className="relative w-full max-w-[550px] h-[480px] flex items-center justify-center select-none">
      {/* Central Volumetric Glow */}
      <div className="absolute w-[340px] h-[340px] rounded-full bg-yellow-400/20 blur-3xl pointer-events-none" />

      <svg viewBox="0 0 520 460" className="w-full h-full overflow-visible relative z-10">
        <defs>
          <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="ringGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#facc15" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#854d0e" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="ringGradAlt" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#854d0e" stopOpacity="0.1" />
            <stop offset="55%" stopColor="#facc15" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Ambient Ember Particles */}
        {emberParticles.map((ember) => {
          const pulse = Math.sin(t * 2 + ember.id) * 0.3 + ember.opacity;
          return (
            <circle
              key={ember.id}
              cx={ember.x}
              cy={ember.y}
              r={ember.r}
              fill="#facc15"
              opacity={Math.max(0.15, pulse)}
            />
          );
        })}

        {/* --- ORBITAL RING 1 (Horizontal / Equatorial Tilt) --- */}
        <g transform={`translate(${cx}, ${cy}) rotate(${t * 3.5}) rotate(-14) scale(1, 0.28)`}>
          <ellipse
            cx="0"
            cy="0"
            rx="225"
            ry="225"
            fill="none"
            stroke="url(#ringGradMain)"
            strokeWidth="4"
            filter="url(#goldGlow)"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="220"
            ry="220"
            fill="none"
            stroke="#fef08a"
            strokeWidth="1.2"
            opacity="0.85"
          />
        </g>

        {/* --- ORBITAL RING 2 (Steep Dynamic Angled Ring) --- */}
        <g transform={`translate(${cx}, ${cy}) rotate(${-t * 2.8}) rotate(44) scale(1, 0.35)`}>
          <ellipse
            cx="0"
            cy="0"
            rx="240"
            ry="240"
            fill="none"
            stroke="url(#ringGradAlt)"
            strokeWidth="4.5"
            filter="url(#goldGlow)"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="235"
            ry="235"
            fill="none"
            stroke="#facc15"
            strokeWidth="1.2"
            opacity="0.9"
          />
        </g>

        {/* --- ORBITAL RING 3 (Near-Vertical Spinning Ring) --- */}
        <g transform={`translate(${cx}, ${cy}) rotate(${t * 5}) rotate(82) scale(1, 0.22)`}>
          <ellipse
            cx="0"
            cy="0"
            rx="210"
            ry="210"
            fill="none"
            stroke="#eab308"
            strokeWidth="2.5"
            strokeDasharray="8 6"
            opacity="0.75"
          />
        </g>

        {/* --- GEODESIC WIREFRAME SPHERE CAGE --- */}
        <g>
          {icoEdges.map(([start, end], idx) => {
            const p1 = projectedIco[start];
            const p2 = projectedIco[end];
            const avgZ = (p1[2] + p2[2]) / 2;
            const alpha = Math.max(0.2, Math.min(0.95, (avgZ + sphereRadius) / (sphereRadius * 2)));

            return (
              <line
                key={`cage-edge-${idx}`}
                x1={p1[0]}
                y1={p1[1]}
                x2={p2[0]}
                y2={p2[1]}
                stroke="#facc15"
                strokeWidth="1.4"
                strokeOpacity={alpha}
              />
            );
          })}
          {projectedIco.map((p, idx) => (
            <circle
              key={`cage-node-${idx}`}
              cx={p[0]}
              cy={p[1]}
              r={2.2}
              fill="#fef08a"
              opacity={Math.max(0.3, (p[2] + sphereRadius) / (sphereRadius * 2))}
            />
          ))}
        </g>

        {/* --- CENTRAL SOLID SHADED GOLDEN POLYHEDRON --- */}
        <g filter="url(#goldGlow)">
          {sortedFaces.map((f, idx) => (
            <polygon
              key={`poly-${idx}`}
              points={f.pts}
              fill={f.baseColor}
              stroke={f.stroke}
              strokeWidth="1.4"
              strokeLinejoin="round"
              opacity="0.96"
            />
          ))}
        </g>

        {/* --- CENTRAL "START" HUD TARGETING RETICLE --- */}
        <Link href="/dashboard" className="cursor-pointer group">
          <g transform={`translate(${cx}, ${cy})`}>
            {/* Outer dotted target ring */}
            <circle
              cx="0"
              cy="0"
              r="28"
              fill="rgba(5, 5, 5, 0.45)"
              stroke="#facc15"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              className="animate-[spin_10s_linear_infinite]"
            />
            {/* Inner subtle glow ring */}
            <circle
              cx="0"
              cy="0"
              r="22"
              fill="rgba(250, 204, 21, 0.15)"
              stroke="#fde047"
              strokeWidth="1"
              className="group-hover:fill-yellow-400/30 transition-all"
            />
            {/* START Label */}
            <text
              x="0"
              y="3.5"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="900"
              letterSpacing="0.1em"
              className="group-hover:fill-yellow-300 transition-colors pointer-events-none"
            >
              START
            </text>
          </g>
        </Link>

        {/* --- ORBITING SOLID SATELLITE CRYSTALS --- */}
        {satellites.map((sat, idx) => {
          const currentAngle = t * sat.speed + sat.phase;
          const sx = Math.cos(currentAngle) * sat.orbitRadius;
          const sy = Math.sin(currentAngle) * sat.orbitRadius * sat.tiltX;
          const sz = Math.sin(currentAngle) * sat.orbitRadius * sat.tiltY;

          const [spx, spy, spz] = project(sx, sy, sz, 0.2, 0.4, 0);
          const sScale = Math.max(0.6, (spz + 200) / 250);

          return (
            <g
              key={`sat-${idx}`}
              transform={`translate(${spx}, ${spy}) rotate(${t * 35 + idx * 60}) scale(${sScale})`}
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
                filter="url(#goldGlow)"
              />
              <rect
                x={-sat.size / 4}
                y={-sat.size / 4}
                width={sat.size / 2}
                height={sat.size / 2}
                fill="#854d0e"
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
/*  HERO LANDING PAGE (MATCHING VIDEO / SCREENSHOT LAYOUT)                     */
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
      {/* Top Ambient Glow */}
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

      {/* Exact Hero Section as Video Frame */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-10 pb-28 space-y-20">
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

          {/* Center Column: 3D Holographic Topological Gold Core with Orbiting Rings & "START" Center */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <TopologicalMasteryHologram />
          </div>

          {/* Right Column: Hero Feature Cards */}
          <div className="lg:col-span-3 space-y-4">
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