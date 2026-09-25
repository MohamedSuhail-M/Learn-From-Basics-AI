'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertOctagon, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

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

export default function LearningPathPage() {
  const [steps] = useState<PathStepItem[]>([
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
      whyExplanation: 'Entropy quantifies impurity. Without it, you cannot calculate information gain at split nodes.',
      evidenceQuote: 'Calculating entropy requires discrete probability distributions over classes.',
    },
    {
      conceptId: 'c3',
      conceptName: 'Decision Trees',
      order: 3,
      isBlocking: false,
      masteryStatus: 'weak',
      reason: 'Target goal concept.',
    },
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Specified Learning Path</h1>
          <p className="text-sm text-muted-foreground">
            Topologically ranked prerequisite chain tailored to your diagnostic results.
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-1.5">
            <BookOpen className="w-4 h-4" /> New Material
          </Button>
        </Link>
      </div>

      <div className="relative border-l-2 border-primary/30 ml-4 space-y-8 pl-6">
        {steps.map((step) => (
          <div key={step.conceptId} className="relative">
            <div
              className={`absolute -left-[35px] top-1 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step.masteryStatus === 'mastered'
                  ? 'bg-emerald-500 text-white'
                  : step.isBlocking
                  ? 'bg-rose-500 text-white ring-4 ring-rose-500/20'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step.masteryStatus === 'mastered' ? <CheckCircle2 className="w-5 h-5" /> : step.order}
            </div>

            <Card className={step.isBlocking ? 'border-rose-500/40 bg-rose-500/5' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    {step.conceptName}
                    {step.isBlocking && (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-semibold border border-rose-500/20">
                        <AlertOctagon className="w-3.5 h-3.5" /> Blocking Knowledge Gap
                      </span>
                    )}
                  </CardTitle>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      step.masteryStatus === 'mastered'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-rose-500/10 text-rose-600'
                    }`}
                  >
                    {step.masteryStatus}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">{step.reason}</p>

                {step.whyExplanation && (
                  <div className="p-3 bg-card border rounded-lg space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-primary">
                      <HelpCircle className="w-4 h-4" />
                      <span>Why do I need this explanation?</span>
                    </div>
                    <p className="text-foreground">{step.whyExplanation}</p>
                    {step.evidenceQuote && (
                      <blockquote className="pl-2 border-l-2 border-primary/50 italic text-muted-foreground">
                        "{step.evidenceQuote}"
                      </blockquote>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}