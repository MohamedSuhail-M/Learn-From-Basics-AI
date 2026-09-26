'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Users,
  Copy,
  Check,
  Gift,
  Flame,
  Award,
  ArrowLeft,
  Share2,
  Sparkles
} from 'lucide-react';

export default function ReferAndEarnPage() {
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(2);
  const [credits, setCredits] = useState(350);

  useEffect(() => {
    // Generate or load unique referral code
    let code = localStorage.getItem('user_referral_code');
    if (!code) {
      code = `NEX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      localStorage.setItem('user_referral_code', code);
    }
    setReferralCode(code);
  }, []);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?ref=${referralCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f5] selection:bg-yellow-400 selection:text-black p-6 sm:p-12 font-sans relative overflow-x-hidden">
      {/* Top Ambient Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none z-0 blur-3xl"
        style={{
          background: 'radial-gradient(rgba(250, 204, 21, 0.12) 0%, rgba(202, 138, 4, 0.02) 60%, transparent 80%)',
          mixBlendMode: 'screen',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <Link
            href="/dashboard"
            className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/30">
            Referral Velocity: 2 Active Invites
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 mx-auto shadow-[0_0_20px_rgba(250,204,21,0.25)]">
            <Gift className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Refer Peers. <span className="text-yellow-400">Unlock Multipliers.</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            Invite classmates or fellow engineers. When they complete their first module diagnostic assessment, both of you earn 150 Cognitive Credits and a 3-Day Streak Freeze shield.
          </p>
        </div>

        {/* Referral Link Box */}
        <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0e0e11]/90 backdrop-blur-xl shadow-2xl space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">Your Personal Invite Link</span>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-2xl font-mono text-xs text-yellow-400 truncate">
              {typeof window !== 'undefined' ? `${window.location.origin}/?ref=${referralCode}` : `https://nexus.ai/?ref=${referralCode}`}
            </div>
            <Button
              onClick={handleCopyLink}
              className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-2xl px-6 py-6 shrink-0 shadow-[0_0_15px_rgba(250,204,21,0.3)] flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied' : 'Copy Invite Link'}</span>
            </Button>
          </div>
        </div>

        {/* Referral Reward Tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0e0e11]/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-500 uppercase">Tier 1</span>
              <Users className="w-4 h-4 text-yellow-400" />
            </div>
            <h4 className="text-base font-bold text-white">1 - 3 Invites</h4>
            <p className="text-xs text-neutral-400 font-light">+150 XP per peer and a 24-hr Streak Freeze protection token.</p>
          </div>

          <div className="p-6 rounded-3xl border border-yellow-400/40 bg-yellow-400/[0.03] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-yellow-400 uppercase">Tier 2</span>
              <Flame className="w-4 h-4 text-yellow-400" />
            </div>
            <h4 className="text-base font-bold text-white">4 - 9 Invites</h4>
            <p className="text-xs text-neutral-300 font-light">Permanent 1.5x Streak Velocity Multiplier and custom badge.</p>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-[#0e0e11]/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-500 uppercase">Tier 3</span>
              <Award className="w-4 h-4 text-yellow-400" />
            </div>
            <h4 className="text-base font-bold text-white">10+ Invites</h4>
            <p className="text-xs text-neutral-400 font-light">Free lifetime access to all generated Capstone Credentials.</p>
          </div>
        </div>
      </div>
    </div>
  );
}