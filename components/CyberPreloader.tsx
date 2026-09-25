'use client';

import { useState, useEffect } from 'react';

export default function CyberPreloader() {
  const [active, setActive] = useState(true);
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState('INITIALIZING NEURAL RUNTIME...');

  useEffect(() => {
    const phases = [
      { pct: 0, text: 'INITIALIZING NEURAL RUNTIME...' },
      { pct: 28, text: 'COMPUTING TOPOLOGICAL MANIFOLD...' },
      { pct: 58, text: 'CALIBRATING SYNAPSE WEIGHTS [OK]' },
      { pct: 84, text: 'ORBITAL MESH SYNC: VERIFIED' },
      { pct: 100, text: 'SYSTEM ONLINE // DOCK READY' }
    ];

    const startTime = performance.now();
    const duration = 1800;

    const frame = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(eased * 100);
      setPct(current);

      for (let i = phases.length - 1; i >= 0; i--) {
        if (current >= phases[i].pct) {
          setPhase(phases[i].text);
          break;
        }
      }

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(() => setActive(false), 360);
      }
    };

    const anim = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(anim);
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[99990] flex items-center justify-center bg-[#050505] overflow-hidden select-none">
      <div className="absolute w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.22)_0%,rgba(202,138,4,0.06)_45%,transparent_70%)] blur-3xl pointer-events-none" />
      <div className="relative w-80 sm:w-96 flex flex-col items-center justify-center p-8 border border-white/5 rounded-2xl bg-[#0a0a0c]/80 backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-yellow-400 animate-hud-bracket" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-yellow-400 animate-hud-bracket" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-yellow-400 animate-hud-bracket" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-yellow-400 animate-hud-bracket" />

        <div className="w-full flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-500 uppercase mb-6 border-b border-white/[0.08] pb-2">
          <span className="flex items-center space-x-1.5 text-yellow-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span>SYS.RUN // v4.2</span>
          </span>
          <span className="text-neutral-400 font-mono tracking-wider">EVOLUTE//NOIR</span>
        </div>

        <div className="text-center w-full">
          <div className="text-5xl font-extrabold text-white font-mono">{pct < 10 ? `0${pct}` : pct}%</div>
          <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden mt-4 border border-yellow-400/20 p-[1px]">
            <div className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-200 rounded-full transition-all duration-75 shadow-[0_0_12px_#facc15]" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-yellow-300 font-semibold mt-3">{phase}</p>
        </div>
      </div>
    </div>
  );
}