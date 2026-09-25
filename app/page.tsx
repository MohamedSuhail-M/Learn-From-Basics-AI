'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Flame,
  Award,
  BookOpen,
  Share2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Brain,
  History,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  streak_count: number;
  last_active_date: string;
  referral_code: string;
  referral_earnings: number;
}

interface MasteryItem {
  id: string;
  concept_id: string;
  concept_title: string;
  score: number;
  status: 'mastered' | 'gap' | 'learning';
  updated_at: string;
}

interface SavedPath {
  id: string;
  goal_concept: string;
  steps: any[];
  why_explanation: string;
  created_at: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [masteryList, setMasteryList] = useState<MasteryItem[]>([]);
  const [savedPaths, setSavedPaths] = useState<SavedPath[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      // 1. Fetch & Auto-Update Streak
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (prof) {
        let currentStreak = prof.streak_count || 1;
        if (prof.last_active_date !== today) {
          const yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0];
          currentStreak = prof.last_active_date === yesterday ? currentStreak + 1 : 1;

          await supabase
            .from('profiles')
            .update({ streak_count: currentStreak, last_active_date: today })
            .eq('id', user.id);

          prof.streak_count = currentStreak;
          prof.last_active_date = today;
        }
        setProfile(prof);
      }

      // 2. Fetch Knowledge Gaps & Mastery
      const { data: mastery } = await supabase
        .from('user_mastery')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (mastery) {
        setMasteryList(mastery);
      }

      // 3. Fetch Saved Generated Paths
      const { data: paths } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (paths) {
        setSavedPaths(paths);
      }
    } catch (err) {
      console.warn('[Dashboard] Data fetch skipped or failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const masteredCount = masteryList.filter((m) => m.status === 'mastered').length;
  const gapCount = masteryList.filter((m) => m.status === 'gap').length;
  const masteryPercentage =
    masteryList.length > 0 ? Math.round((masteredCount / masteryList.length) * 100) : 0;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-60" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="p-6 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </Card>
          <Card className="p-6 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Student Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {profile?.full_name
              ? `Welcome back, ${profile.full_name}!`
              : profile?.email
              ? `Logged in as ${profile.email}`
              : 'Sign in to track real-time study streaks, knowledge gaps, and rewards.'}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/">
            <Button className="gap-2 shadow-sm">
              <BookOpen className="w-4 h-4" /> Analyze New Course
            </Button>
          </Link>
          <Link href="/refer">
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" /> Refer &amp; Earn
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Streak */}
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Active Streak
            </CardTitle>
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {profile ? `${profile.streak_count} Days` : '1 Day'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Daily learning sequence active</p>
          </CardContent>
        </Card>

        {/* Overall Mastery Percentage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mastery Rate
            </CardTitle>
            <TrendingUp className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{masteryPercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {masteredCount} concepts fully mastered
            </p>
          </CardContent>
        </Card>

        {/* Identified Knowledge Gaps */}
        <Card className="border-rose-500/20 bg-rose-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Knowledge Gaps
            </CardTitle>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{gapCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Prerequisites blocking progress</p>
          </CardContent>
        </Card>

        {/* Referral Earnings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Referral Balance
            </CardTitle>
            <Share2 className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              ${Number(profile?.referral_earnings || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Code: <span className="font-mono font-bold text-primary">{profile?.referral_code || 'GENCODE'}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: Mastery Breakdown & Path History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Gap & Concept Mastery Section */}
        <Card>
          <CardHeader className="border-b border-border/60 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  Knowledge Gaps &amp; Mastery Tracking
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Concepts assessed through diagnostic quizzes
                </CardDescription>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                Total: {masteryList.length}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {masteryList.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <Brain className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                <p className="text-sm text-muted-foreground">
                  No concepts recorded yet. Run a course material diagnostic to populate your gaps.
                </p>
                <Link href="/">
                  <Button size="sm" variant="outline" className="text-xs">
                    Start Assessment
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {masteryList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-border/80 bg-card hover:bg-muted/30 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      {item.status === 'mastered' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold text-foreground text-sm">{item.concept_title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Score: {Math.round(item.score * 100)}%
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md shrink-0 ${
                        item.status === 'mastered'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {item.status === 'mastered' ? 'Mastered' : 'Knowledge Gap'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saved Generated Learning Paths */}
        <Card>
          <CardHeader className="border-b border-border/60 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  Generated Learning Sequences
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Recent topologically sorted prerequisite paths
                </CardDescription>
              </div>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {savedPaths.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <History className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                <p className="text-sm text-muted-foreground">
                  No learning paths generated yet. Set your goal in the results step to save paths.
                </p>
                <Link href="/">
                  <Button size="sm" variant="outline" className="text-xs">
                    Create Learning Path
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {savedPaths.map((path) => (
                  <div
                    key={path.id}
                    className="p-3.5 rounded-xl border border-border/80 bg-card space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-primary">
                        Target Goal: {path.goal_concept}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(path.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-muted-foreground leading-relaxed line-clamp-2">
                      {path.why_explanation || 'Custom topological prerequisite sequence generated by engine.'}
                    </p>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-foreground">
                        Milestones: {path.steps?.length || 0} Steps
                      </span>
                      <Link href="/learning-path">
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary">
                          Open Path <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}