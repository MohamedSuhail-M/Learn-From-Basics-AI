'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import type {
  Concept,
  DependencyEdge,
  GapAnalysis,
  LearningPath,
} from '@/lib/types';
import { mockLearningPath } from '@/lib/mock-data';

interface PathStepProps {
  concepts: Concept[];
  edges: DependencyEdge[];
  gapAnalysis: GapAnalysis;
  goalConceptId: string;
  onRestart: () => void;
}

export function PathStep({
  concepts,
  edges,
  gapAnalysis,
  goalConceptId,
  onRestart,
}: PathStepProps) {
  const [loading, setLoading] = useState(true);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [expandedQuotes, setExpandedQuotes] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const persistPathToSupabase = useCallback(
    async (path: LearningPath) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from('learning_paths').insert({
          user_id: user.id,
          goal_concept: path.goalConceptName || goalConceptId,
          steps: path.steps,
          why_explanation: path.whyExplanation || '',
          created_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('[PathStep] Skipping database persist:', err);
      }
    },
    [goalConceptId]
  );

  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concepts,
          edges,
          gapAnalysis,
          goalConceptId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setLearningPath(data);
      await persistPathToSupabase(data);

      toast({
        title: 'Learning path generated',
        description: `Constructed ${data.steps?.length || 0} milestone steps to reach your goal.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Path generation failed';
      console.warn('[PathStep] Falling back to mock path:', message);
      const fallback = mockLearningPath(goalConceptId);
      setLearningPath(fallback);
      setUsedFallback(true);
      await persistPathToSupabase(fallback);

      toast({
        title: 'Using sample learning path',
        description: 'AI path engine unavailable — displaying sample path.',
      });
    } finally {
      setLoading(false);
    }
  }, [concepts, edges, gapAnalysis, goalConceptId, persistPathToSupabase, toast]);

  useEffect(() => {
    generate();
  }, [generate]);

  const toggleQuote = (conceptId: string) => {
    setExpandedQuotes((prev) => ({
      ...prev,
      [conceptId]: !prev[conceptId],
    }));
  };

  if (loading || !learningPath) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <Card className="p-6">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </Card>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-16 w-full rounded-xl mt-2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Personalized Learning Sequence</h2>
        <p className="text-sm text-muted-foreground">
          Topological prerequisite progression toward mastering{' '}
          <span className="font-semibold text-primary">
            {learningPath.goalConceptName || goalConceptId}
          </span>
        </p>
      </div>

      {usedFallback && (
        <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Showing sample sequence (AI was unavailable). Add your GEMINI_API_KEY for live paths.</span>
        </div>
      )}

      {learningPath.whyExplanation && (
        <Card className="border-primary/30 bg-primary/5 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-foreground">Why start with this sequence?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {learningPath.whyExplanation}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="relative border-l-2 border-primary/30 ml-4 space-y-6 pl-6 pt-2">
        {learningPath.steps.map((step) => {
          const isBlocking = step.isBlocking || step.conceptId === learningPath.blockingConceptId;
          const isMastered = step.masteryStatus === 'mastered';
          const matchedEdge = edges.find((e) => e.target === step.conceptId);
          const evidenceQuote = matchedEdge?.evidence;
          const isQuoteOpen = expandedQuotes[step.conceptId] ?? false;

          return (
            <div key={step.conceptId} className="relative">
              <div
                className={`absolute -left-[37px] top-1.5 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all duration-300 ${
                  isMastered
                    ? 'bg-emerald-500 text-white'
                    : isBlocking
                    ? 'bg-rose-500 text-white ring-4 ring-rose-500/20'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {isMastered ? <CheckCircle2 className="w-4 h-4" /> : step.order}
              </div>

              <Card
                className={`transition-colors shadow-sm ${
                  isBlocking ? 'border-rose-500/40 bg-rose-500/5' : 'border-border/70'
                }`}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <span>{step.conceptName}</span>
                      {isBlocking && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-semibold border border-rose-500/20">
                          <AlertOctagon className="w-3 h-3" /> Priority Bottleneck
                        </span>
                      )}
                    </CardTitle>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        isMastered
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isMastered ? 'Mastered' : 'Knowledge Gap'}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-1 space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.reason}</p>

                  {(step.whyExplanation || isBlocking) && (
                    <div className="mt-3 p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-xs space-y-1.5">
                      <div className="font-semibold text-primary flex items-center gap-1.5">
                        <span>💡 Why learn this first?</span>
                      </div>
                      <p className="text-foreground leading-relaxed">
                        {step.whyExplanation ||
                          learningPath.whyExplanation ||
                          'This concept forms the foundational prerequisite required before downstream topics can be calculated or understood.'}
                      </p>
                      {evidenceQuote && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => toggleQuote(step.conceptId)}
                            className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                          >
                            <FileCheck2 className="w-3.5 h-3.5" />
                            <span>Course Material Evidence</span>
                            {isQuoteOpen ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                          {isQuoteOpen && (
                            <blockquote className="mt-2 pl-3 border-l-2 border-primary/40 italic text-muted-foreground text-[11px] animate-fade-in">
                              "{evidenceQuote}"
                            </blockquote>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={onRestart} className="w-full sm:w-auto gap-1.5 text-xs">
          <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
        </Button>
        <Button
          onClick={() => {
            window.location.href = '/dashboard';
          }}
          className="w-full sm:w-auto gap-1.5 text-xs"
        >
          View in Dashboard <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}