import React from 'react';

export default function AmbientBackground({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative min-h-screen w-full bg-[#0a0f18] text-slate-100 overflow-hidden font-sans selection:bg-teal-500/30 ${className}`}>
      {/* Floating Ambient Light Blobs */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-teal-500/15 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob pointer-events-none" />
      <div className="absolute top-1/4 -right-10 w-[28rem] h-[28rem] bg-emerald-500/15 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob [animation-delay:2.5s] pointer-events-none" />
      <div className="absolute -bottom-10 left-1/3 w-[30rem] h-[30rem] bg-indigo-500/15 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob [animation-delay:5s] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-radial-grid pointer-events-none opacity-40" />

      {/* Live Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}