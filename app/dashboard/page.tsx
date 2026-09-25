'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Brain,
  History,
  BookOpen,
  Share2,
  Upload,
  Sparkles,
  Loader2,
  X,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const presetCourses = [
    { title: 'Decision Trees & Information Gain', topic: 'Decision_Trees' },
    { title: 'Graph Algorithms & Topological Sort', topic: 'Graph_Algorithms' },
    { title: 'Dynamic Programming & Memoization', topic: 'Dynamic_Programming' },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      sessionStorage.setItem('currentDocumentText', data.text || '');
      sessionStorage.setItem('currentDocumentName', file.name);

      setCourseModalOpen(false);
      router.push('/learning-path');
    } catch (err) {
      console.error('File extraction failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartAssessment = () => {
    const existingDoc = typeof window !== 'undefined' ? sessionStorage.getItem('currentDocumentText') : null;
    if (!existingDoc) {
      setCourseModalOpen(true);
    } else {
      router.push('/learning-path');
    }
  };

  return (
    <div className="container max-w-5xl py-8 space-y-8 px-4">
      {/* Top Header / Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Learning Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your knowledge gaps, run diagnostic assessments, and view prerequisite paths.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setCourseModalOpen(true)}
            className="bg-[#107569] hover:bg-[#0e6258] text-white gap-2 font-medium"
          >
            <BookOpen className="w-4 h-4" />
            Analyze New Course
          </Button>

          <Link href="/refer">
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Refer & Earn
            </Button>
          </Link>
        </div>
      </div>

      {/* Two Status Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Knowledge Gaps Card */}
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                <Brain className="w-4 h-4" /> Knowledge Gaps & Mastery Tracking
              </CardTitle>
              <CardDescription className="text-xs">Concepts assessed through diagnostic quizzes</CardDescription>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">Total: 0</span>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
              <Brain className="w-10 h-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground max-w-xs">
                No concepts recorded yet. Run a course material diagnostic to populate your gaps.
              </p>
              <Button onClick={handleStartAssessment} variant="outline" size="sm">
                Start Assessment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Sequences Card */}
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2 text-[#107569]">
                <History className="w-4 h-4" /> Generated Learning Sequences
              </CardTitle>
              <CardDescription className="text-xs">Recent topologically sorted prerequisite paths</CardDescription>
            </div>
            <Sparkles className="w-4 h-4 text-[#107569]" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
              <History className="w-10 h-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground max-w-xs">
                No learning paths generated yet. Set your goal in the results step to save paths.
              </p>
              <Link href="/learning-path">
                <Button variant="outline" size="sm">
                  Create Learning Path
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hidden File Picker */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.docx,.doc,.pptx,.ppt,.txt"
        className="hidden"
      />

      {/* Course Analyzer Modal */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-background border p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setCourseModalOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-bold tracking-tight">Analyze Course Material</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Upload your syllabus or choose a suggested course to trace dependencies.
              </p>
            </div>

            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className="border-2 border-dashed border-primary/30 hover:border-primary/70 rounded-xl p-6 text-center cursor-pointer transition-colors bg-primary/5 hover:bg-primary/10"
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-2">
                  <Loader2 className="w-7 h-7 text-primary animate-spin" />
                  <span className="text-sm font-semibold">Extracting document concepts...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-primary mx-auto" />
                  <div className="text-sm font-semibold">Upload Syllabus, Slides, or Notes</div>
                  <div className="text-xs text-muted-foreground">PDF, DOCX, PPTX, or TXT</div>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Or Select a Suggested Course
              </div>
              <div className="grid gap-2">
                {presetCourses.map((c) => (
                  <button
                    key={c.topic}
                    onClick={() => {
                      sessionStorage.setItem('selectedCourseTopic', c.topic);
                      setCourseModalOpen(false);
                      router.push('/learning-path');
                    }}
                    className="flex items-center justify-between p-3 rounded-lg border text-left hover:bg-accent transition text-sm font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" /> {c.title}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}