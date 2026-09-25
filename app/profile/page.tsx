'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Network,
  CheckCircle2,
  AlertOctagon,
  LogOut,
  ArrowLeft,
  Trash2,
  Sparkles,
  BookOpen,
  Award,
  Edit3,
  Check,
  X
} from 'lucide-react';

interface HistoryItem {
  id: string;
  courseName: string;
  date: string;
  totalNodes: number;
  gapCount: number;
  masteredCount: number;
}

interface UserProfile {
  name: string;
  email: string;
  targetRole: string;
  provider: string;
  joinedDate: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Profile Form State
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Mohamed Suhail',
    email: 'suhail@example.com',
    targetRole: 'Computer Science & AI Specialist',
    provider: 'Google Auth',
    joinedDate: 'Joined September 2026',
  });

  const [formData, setFormData] = useState<UserProfile>(profile);

  useEffect(() => {
    // 1. Load user profile from storage
    try {
      const stored = localStorage.getItem('auth_user_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
        setFormData(parsed);
      }
    } catch (e) {
      console.warn('Could not read user profile from storage', e);
    }

    // 2. Load assessment history
    try {
      const raw = localStorage.getItem('assessment_history_v1');
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch (e) {
      console.warn('Could not read assessment history', e);
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    localStorage.setItem('auth_user_profile', JSON.stringify(formData));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('auth_user_session');
    router.push('/');
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your learning path history?')) {
      localStorage.removeItem('assessment_history_v1');
      setHistory([]);
    }
  };

  // Aggregated analytics
  const totalCourses = history.length;
  const totalMastered = history.reduce((acc, curr) => acc + (curr.masteredCount || 0), 0);
  const totalGaps = history.reduce((acc, curr) => acc + (curr.gapCount || 0), 0);
  const totalEvaluated = totalMastered + totalGaps;
  const masteryPercentage =
    totalEvaluated > 0 ? Math.round((totalMastered / totalEvaluated) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-4 border-b">
        <Link href="/dashboard" className="hover:text-foreground flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </Button>
      </div>

      {/* Editable Profile Information Card */}
      <div className="p-6 border rounded-2xl bg-card shadow-sm">
        {!isEditing ? (
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="w-20 h-20 rounded-full bg-[#107569]/10 border-2 border-[#107569]/20 flex items-center justify-center text-[#107569] font-bold text-2xl shrink-0">
                {profile.name.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">{profile.name}</h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium flex items-center justify-center sm:justify-start gap-1">
                  <Mail className="w-3.5 h-3.5" /> {profile.email}
                </p>
                <p className="text-xs text-primary font-semibold">
                  Focus: {profile.targetRole}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" /> {profile.joinedDate}
                  </span>
                  <span>•</span>
                  <span>Provider: <strong className="text-foreground">{profile.provider}</strong></span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-1.5 text-xs shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Profile
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between pb-2 border-b">
              <h2 className="text-base font-bold">Edit Account Details</h2>
              <span className="text-xs text-muted-foreground">Updates persist locally</span>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Target Field / Role
                </label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  placeholder="e.g. Machine Learning Engineer"
                  className="w-full p-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button type="submit" size="sm" className="bg-[#107569] hover:bg-[#0e6258] text-white gap-1.5 text-xs">
                <Check className="w-3.5 h-3.5" /> Save Changes
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleCancelEdit} className="gap-1.5 text-xs">
                <X className="w-3.5 h-3.5" /> Cancel
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Global Learning Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="pt-5 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase">
              <span>Overall Mastery</span>
              <Award className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">{masteryPercentage}%</div>
            <p className="text-[11px] text-muted-foreground">Across all assessed topics</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="pt-5 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase">
              <span>Courses Analyzed</span>
              <BookOpen className="w-4 h-4 text-foreground" />
            </div>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-[11px] text-muted-foreground">Uploaded syllabi & materials</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm border-emerald-500/30 bg-emerald-500/[0.02]">
          <CardContent className="pt-5 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase">
              <span>Mastered Concepts</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-600">{totalMastered}</div>
            <p className="text-[11px] text-muted-foreground">Prerequisites verified</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm border-rose-500/30 bg-rose-500/[0.02]">
          <CardContent className="pt-5 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase">
              <span>Active Gaps</span>
              <AlertOctagon className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-bold text-rose-600">{totalGaps}</div>
            <p className="text-[11px] text-muted-foreground">Prerequisite blockers to clear</p>
          </CardContent>
        </Card>
      </div>

      {/* History & Saved Learning Paths */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Your Diagnostic Roadmaps</h2>
            <p className="text-xs text-muted-foreground">
              Saved prerequisite graphs generated for your account.
            </p>
          </div>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              className="text-xs text-muted-foreground hover:text-rose-600 gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="p-8 border rounded-xl bg-card text-center space-y-3">
            <Network className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
            <h3 className="text-sm font-semibold text-foreground">No Learning Paths Yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Analyze a syllabus or chapter from your dashboard to generate your personalized prerequisite graph.
            </p>
            <Link href="/dashboard">
              <Button size="sm" className="bg-[#107569] hover:bg-[#0e6258] text-white gap-1.5 mt-1">
                <Sparkles className="w-4 h-4" /> Start New Assessment
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item) => (
              <Card key={item.id} className="border hover:border-primary/50 transition-all shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-bold truncate" title={item.courseName}>
                      {item.courseName}
                    </CardTitle>
                    <span className="text-[10px] text-muted-foreground font-mono whitespace-nowrap">
                      {item.date}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {item.masteredCount} Mastered
                    </span>
                    <span className="flex items-center gap-1 text-rose-600 font-medium">
                      <AlertOctagon className="w-3.5 h-3.5" /> {item.gapCount} Gap{item.gapCount === 1 ? '' : 's'}
                    </span>
                  </div>

                  <Link href={`/learning-path?id=${item.id}`}>
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      <Network className="w-3.5 h-3.5" /> View Graph
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}