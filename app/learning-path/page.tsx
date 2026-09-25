'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  BookOpen,
  ArrowLeft,
  GraduationCap,
} from 'lucide-react';

interface PathStepItem {
  conceptId: string;
  conceptName: string;
  order: number;
  isBlocking: boolean;
  masteryStatus: 'mastered' | 'weak';
  reason: string;
  whyExplanation?: string;
  evidenceQuote?: string;
}

const DEFAULT_STEPS: PathStepItem[] = [
  {
    conceptId: 'c1',
    conceptName: 'Probability Distributions',
    order: 1,
    isBlocking: false,
    masteryStatus: 'mastered',
    reason: 'Underpins information theory and discrete uncertainty calculation.',
  },
  {
    conceptId: 'c2',
    conceptName: 'Entropy & Information Gain',
    order: 2,
    isBlocking: true,
    masteryStatus: 'weak',
    reason: 'Direct prerequisite required to understand attribute splitting in Decision Trees.',
    whyExplanation:
      'Entropy quantifies impurity. Without it, you cannot calculate information gain at split nodes.',
    evidenceQuote:
      'Calculating entropy requires discrete probability distributions over classes.',
  },
  {
    conceptId: 'c3',
    conceptName: 'Decision Trees',
    order: 3,
    isBlocking: false,
    masteryStatus: 'weak',
    reason: 'Target goal concept.',
  },
];

export default function LearningPathPage() {
  const [steps, setSteps] = useState<PathStepItem[]>(DEFAULT_STEPS);
  const [activeCourse, setActiveCourse] = useState<string>('Decision Trees & Information Theory');

  useEffect(() => {
    // Restore generated path or topic if available in session
    const storedTopic = sessionStorage.getItem('selectedCourseTopic');
    const storedDocName = sessionStorage.getItem('currentDocumentName');

    if (storedDocName) {
      setActiveCourse(storedDocName);
    } else if (storedTopic) {
      setActiveCourse(storedTopic.replace(/_/g, ' '));
    }

    const savedPath = sessionStorage.getItem('generatedLearningPath');
    if (savedPath) {
      try {
        const parsed = JSON.parse(savedPath);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSteps(parsed);
        }
      } catch (err) {
        console.error('Failed to parse cached learning path:', err);
      }
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">{activeCourse}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Specified Learning Path</h1>
          <p className="text-sm text-muted-foreground">
            Topologically ranked prerequisite chain tailored to your diagnostic results.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <BookOpen className="w-4 h-4" /> Switch Material
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="gap-1.5 text-xs bg-[#107569] hover:bg-[#0e6258] text-white">
              <GraduationCap className="w-4 h-4" /> Practice Blockers
            </Button>
          </Link>
        </div>
      </div>

      {/* Sequential Prerequisite Timeline */}
      <div className="relative border-l-2 border-primary/20 ml-4 space-y-8 pl-6 pt-2">
        {steps.map((step) => {
          const isMastered = step.masteryStatus === 'mastered';

          return (
            <div key={step.conceptId} className="relative">
              {/* Order / Status Badge Node */}
              <div
                className={`absolute -left-[35px] top-1 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-transform ${
                  isMastered
                    ? 'bg-emerald-500 text-white'
                    : step.isBlocking
                    ? 'bg-rose-500 text-white ring-4 ring-rose-500/20'
                    : 'bg-muted text-muted-foreground border'
                }`}
              >
                {isMastered ? <CheckCircle2 className="w-5 h-5" /> : step.order}
              </div>

              {/* Step Detail Card */}
              <Card
                className={`transition-colors shadow-sm ${
                  step.isBlocking
                    ? 'border-rose-500/40 bg-rose-500/[0.02]'
                    : isMastered
                    ? 'border-border/60 bg-card'
                    : 'border-border bg-card'
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base font-bold flex flex-wrap items-center gap-2">
                      <span>{step.conceptName}</span>
                      {step.isBlocking && (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-semibold border border-rose-500/20">
                          <AlertOctagon className="w-3.5 h-3.5" /> Blocking Knowledge Gap
                        </span>
                      )}
                    </CardTitle>

                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md capitalize ${
                        isMastered
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                      }`}
                    >
                      {step.masteryStatus}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">{step.reason}</p>

                  {/* Contextual Justification */}
                  {step.whyExplanation && (
                    <div className="p-3 bg-muted/40 border border-border/80 rounded-lg space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-primary">
                        <HelpCircle className="w-4 h-4" />
                        <span>Why do I need this explanation?</span>
                      </div>
                      <p className="text-foreground leading-relaxed">{step.whyExplanation}</p>
                      {step.evidenceQuote && (
                        <blockquote className="pl-3 border-l-2 border-primary/50 italic text-muted-foreground">
                          &ldquo;{step.evidenceQuote}&rdquo;
                        </blockquote>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}