'use client';

import { useState } from 'react';
import Link from 'next/link';
import CyberLabScene from '@/components/CyberLabScene';
import CyberPreloader from '@/components/CyberPreloader';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Network,
  CheckCircle2,
  FileText,
  UploadCloud,
  Compass,
  Layers,
  Activity,
  Cpu
} from 'lucide-react';

export default function HomePage() {
  const [showPreloader, setShowPreloader] = useState(false);

  const triggerReplay = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPreloader(true);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-[#050505] text-[#f4f4f5] overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      {/* 1. HUD Preloader Overlay */}
      <CyberPreloader />
      {showPreloader && <CyberPreloader key={Date.now()} />}

      {/* 2. Ambient Electric Amber Radial Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[580px] pointer-events-none z-0 blur-3xl"
        style={{
          background: 'radial-gradient(rgba(250, 204, 21, 0.16) 0%, rgba(202, 138, 4, 0.05) 50%, transparent 80%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* 3. Main Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-5 flex flex-col flex-1">
        
        {/* Navigation Header */}
        <header className="w-full flex items-center justify-between py-3 mb-6 sm:mb-8 text-xs font-semibold tracking-tight border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-2.5">
            <Link href="/" className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-lg bg-yellow-400/10 border border-yellow-400/40 flex items-center justify-center text-yellow-400 font-mono font-bold text-xs shadow-[0_0_12px_rgba(250,204,21,0.25)]">
                AP
              </span>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Adaptive<span className="text-yellow-400 font-extrabold text-xs ml-1 tracking-widest uppercase">Prereq</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-neutral-400 font-normal text-[13px] tracking-wide">
            <Link href="/" className="text-yellow-400 font-semibold border-b border-yellow-400 pb-0.5">
              Overview
            </Link>
            <a href="#features" className="hover:text-yellow-400 transition-colors">
              Core Engine
            </a>
            <a href="#features" className="hover:text-yellow-400 transition-colors">
              Prerequisite Graph
            </a>
            <Link href="/dashboard" className="hover:text-yellow-400 transition-colors">
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={triggerReplay}
              data-cursor="REPLAY"
              className="inline-flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-full border border-yellow-400/40 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 text-[11px] font-mono tracking-wider uppercase transition-all shadow-[0_0_14px_rgba(250,204,21,0.2)] group"
              title="Replay Preloader Animation"
            >
              <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 text-yellow-400" />
              <span className="hidden sm:inline">Preview</span>
              <span>HUD</span>
            </button>
            <Link
              href="/dashboard"
              className="px-5 py-2 rounded-full bg-yellow-400 text-black text-xs font-bold tracking-normal hover:bg-yellow-300 transition-all shadow-[0_0_18px_rgba(250,204,21,0.35)] flex items-center gap-1.5"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Hero Section with Interactive 3D Cyber Scene Behind Content */}
        <main className="relative flex-1 flex flex-col justify-between pt-1 sm:pt-3">
          <div className="relative min-h-[520px] lg:min-h-[580px] flex items-center mb-8 sm:mb-12 overflow-hidden rounded-3xl border border-white/[0.08] bg-black/40 backdrop-blur-md shadow-2xl">
            
            {/* Background 3D Cyber Lab / Sci-Fi Hologram Canvas */}
            <CyberLabScene />

            {/* Content Foreground */}
            <div className="relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pointer-events-none p-6 sm:p-10">
              
              {/* Left Column: Core Value Proposition */}
              <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center pointer-events-auto">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_10px_#facc15]" />
                  <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium font-mono">
                    AI-Powered Diagnostic Engine
                  </span>
                </div>

                <h1 className="text-4xl sm:text-6xl xl:text-[70px] font-extrabold tracking-[-0.05em] leading-[0.94] text-white drop-shadow-md select-none font-sans">
                  TURN ANY SYLLABUS INTO A<br />
                  <span className="text-yellow-400 font-extrabold tracking-[-0.05em] inline-block transition-transform duration-300 hover:scale-[1.01] drop-shadow-[0_0_25px_rgba(250,204,21,0.3)]">
                    MASTERY ROADMAP.
                  </span>
                </h1>

                <p className="text-neutral-300 text-sm sm:text-base mt-5 max-w-lg font-normal leading-relaxed tracking-normal backdrop-blur-[2px] bg-black/20 rounded-lg p-2 border border-white/5">
                  Upload course materials, take targeted diagnostic quizzes, and automatically discover your knowledge gaps mapped onto an interactive topological prerequisite graph.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span className="px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-[11px] text-neutral-300 font-light tracking-wide">
                    Document Grounded
                  </span>
                  <span className="px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-[11px] text-neutral-300 font-light tracking-wide">
                    Topological DAG
                  </span>
                  <span className="px-3 py-1 rounded-full border border-yellow-400/40 bg-yellow-400/10 backdrop-blur-md text-[11px] text-yellow-300 font-medium tracking-wide shadow-[0_0_10px_rgba(250,204,21,0.15)]">
                    Gemini 2.5 Powered
                  </span>
                </div>

                <div className="mt-8 flex items-center space-x-4">
                  <Link
                    href="/dashboard"
                    data-cursor="START"
                    className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.4)] group transition-all"
                  >
                    <UploadCloud className="w-4 h-4 mr-2" />
                    <span>Start Learning Path</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform duration-300 group-hover:translate-x-1 stroke-[2.5]" />
                  </Link>

                  <Link
                    href="/dashboard"
                    data-cursor="EXPLORE"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-black/80 backdrop-blur-md border border-yellow-400/30 text-white font-medium text-xs hover:border-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 transition-all duration-300 space-x-2 group shadow-[0_0_12px_rgba(0,0,0,0.5)]"
                  >
                    <Network className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="tracking-wide">Go to Dashboard</span>
                  </Link>
                </div>
              </div>

              <div className="hidden lg:block lg:col-span-1" />

              {/* Right Column: Live Prerequisite Graph Telemetry */}
              <div className="lg:col-span-4 xl:col-span-5 flex flex-col justify-center items-end space-y-4 pointer-events-auto">
                <div className="w-full max-w-sm space-y-3.5">
                  <div
                    data-cursor="GRAPH"
                    className="bg-[#0e0e11]/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-yellow-400/70 hover:shadow-[0_0_25px_rgba(250,204,21,0.2)] transition-all duration-300 shadow-2xl group hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono text-[11px] text-yellow-400 font-semibold uppercase tracking-wider">
                        Dependency Engine
                      </span>
                      <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_#facc15]" />
                    </div>
                    <div className="text-2xl font-extrabold text-white group-hover:text-yellow-300 transition-colors font-sans">
                      Topological Sequencing
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed font-light">
                      Visualizes concepts in valid prerequisite sequence so you always know which foundation to master next.
                    </p>
                  </div>

                  <div
                    data-cursor="STATS"
                    className="bg-[#0e0e11]/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-yellow-400/70 hover:shadow-[0_0_25px_rgba(250,204,21,0.2)] transition-all duration-300 shadow-2xl group hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-extrabold text-white group-hover:text-yellow-300 transition-colors font-mono">
                        Zero Boilerplate
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
                        100% CITED
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-2">
                      Verbatim excerpts and exact paragraph citations for every knowledge blocker identified.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Slogan Banner */}
          <div className="relative z-10 text-center my-6 sm:my-8 px-4">
            <div className="flex items-center justify-center space-x-6 mb-4 opacity-80 text-xs font-mono tracking-widest uppercase text-neutral-400">
              <span className="flex items-center space-x-2">
                <Cpu className="w-3.5 h-3.5 text-yellow-400" />
                <span>Concept DAG</span>
              </span>
              <span className="text-yellow-400/50">•</span>
              <span className="flex items-center space-x-2">
                <Layers className="w-3.5 h-3.5 text-neutral-400" />
                <span>Document Grounding</span>
              </span>
              <span className="text-yellow-400/50">•</span>
              <span className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                <span>Knowledge Gap Clearing</span>
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.04em] text-white max-w-4xl mx-auto leading-tight font-sans select-none">
              WE TURN <span className="text-yellow-400 font-extrabold inline-block transition-transform duration-300 hover:scale-105 drop-shadow-[0_0_20px_rgba(250,204,21,0.35)]">SYLLABI</span> INTO INTERACTIVE TOPOLOGIES.
            </h3>
            <p className="text-neutral-500 text-xs uppercase tracking-[0.25em] mt-2.5 font-mono">
              ADAPTIVE DIAGNOSTIC ENGINE : PRECISION PREREQUISITE MAPPING
            </p>
          </div>

          {/* Feature Architecture Cards */}
          <section className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 pb-6 items-stretch" id="features">
            
            {/* Feature 1: Document Grounding */}
            <div
              data-cursor="GROUNDING"
              className="bg-[#101014]/90 backdrop-blur-xl border border-white/10 text-white p-6 sm:p-7 rounded-3xl flex flex-col justify-between hover:border-yellow-400/60 shadow-2xl group cursor-pointer transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Step 01 // Extraction
                </div>
                <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-yellow-300 transition-colors font-sans">
                  Document Grounding
                </h4>
                <p className="text-xs text-neutral-400 mt-2.5 font-light leading-relaxed">
                  Extracts formulas, rules, and core definitions directly from your uploaded slides or documents with zero generic boilerplate.
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="font-mono text-neutral-500 text-[11px]">PDF, DOCX, TXT</span>
                <span className="text-yellow-400 font-mono text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verifiable Citations
                </span>
              </div>
            </div>

            {/* Feature 2: Gap Identification */}
            <div
              data-cursor="DIAGNOSTIC"
              className="bg-gradient-to-b from-[#161510] to-[#0a0a07] border border-yellow-400/60 text-white p-6 sm:p-7 rounded-3xl flex flex-col justify-between shadow-[0_10px_40px_rgba(250,204,21,0.18)] relative overflow-hidden group cursor-pointer transition-all"
            >
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/50 flex items-center justify-center text-yellow-300 mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-yellow-400 font-semibold mb-1">
                  Step 02 // Diagnostics
                </div>
                <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-yellow-300 transition-colors font-sans">
                  Gap Identification
                </h4>
                <p className="text-xs text-neutral-300 mt-2.5 font-light leading-relaxed">
                  Diagnoses weak prerequisite concepts and explicitly cites the source passage needed to resolve each blocker.
                </p>
              </div>

              <div className="relative z-10 pt-5 mt-4 border-t border-yellow-400/20 flex items-center justify-between text-xs">
                <span className="font-mono text-neutral-400 text-[11px]">Multiple Choice</span>
                <span className="text-yellow-300 font-mono text-[11px] font-semibold flex items-center gap-1">
                  Blocking Prereqs Isolated
                </span>
              </div>
            </div>

            {/* Feature 3: Topological DAG */}
            <div
              data-cursor="TOPOLOGY"
              className="bg-[#101014]/90 backdrop-blur-xl border border-white/10 text-white p-6 sm:p-7 rounded-3xl flex flex-col justify-between hover:border-yellow-400/60 shadow-2xl group cursor-pointer transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 mb-4 group-hover:scale-110 transition-transform">
                  <Network className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Step 03 // Resolution
                </div>
                <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-yellow-300 transition-colors font-sans">
                  Topological DAG
                </h4>
                <p className="text-xs text-neutral-400 mt-2.5 font-light leading-relaxed">
                  Visualizes concepts in valid prerequisite sequence so you always know which foundation to master next.
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="font-mono text-neutral-500 text-[11px]">Strict Invariant Flow</span>
                <Link
                  href="/dashboard"
                  className="text-yellow-400 font-mono text-[11px] hover:underline flex items-center gap-1"
                >
                  Inspect Graph <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </section>
        </main>

        {/* Cyber-Noir Footer */}
        <footer className="w-full pt-6 pb-3 text-xs font-medium text-neutral-500 flex flex-col sm:flex-row items-center justify-between border-t border-white/[0.08] mt-4">
          <div className="flex items-center space-x-3 text-neutral-400 font-mono text-[11px]">
            <span className="text-white font-semibold tracking-wide">ADAPTIVE PREREQ // CYBER NOIR</span>
            <span className="text-yellow-400">•</span>
            <span>Autonomous Prerequisite Intelligence Engine</span>
          </div>
          <div className="flex items-center space-x-6 mt-3 sm:mt-0 text-neutral-500 text-xs">
            <Link href="/dashboard" className="hover:text-yellow-400 transition-colors">
              Dashboard
            </Link>
            <Link href="/profile" className="hover:text-yellow-400 transition-colors">
              User Profile
            </Link>
            <Link href="/dashboard" className="text-yellow-400 hover:text-yellow-300 font-mono text-[11px] font-semibold">
              Learning Roadmaps ↗
            </Link>
          </div>
        </footer>

      </div>
    </div>
  );
}