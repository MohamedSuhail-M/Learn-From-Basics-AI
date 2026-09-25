'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Route, AlertTriangle, CheckCircle2, BookOpen, Lightbulb, RotateCcw, AlertCircle, ChevronDown, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import type {
  Concept,
  DependencyEdge,
  GapAnalysis,
  LearningPath,
  LearningPathStep,
} from '@/lib/types';
import { mockLearningPath } from '@/lib/mock-data';

interface PathStepProps {
  concepts: Concept[];
  edges: DependencyEdge[];
  gapAnalysis: GapAnalysis;
  goalConceptId: string;
  onRestart: () => void;
}

function PathStepCard({ step, isLast }: { step: LearningPathStep; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  const concept = { name: step.conceptName };

  const relatedEdges = [] as DependencyEdge[];

  return (
    <div className="flex items-stretch gap-3 animate-slide-up">
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
            step.isBlocking
              ? 'bg-destructive text-destructive-foreground'
              : step.masteryStatus === 'mastered'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground border border-border'
          }`}
        >
          {step.order}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-border mt-1" />}
      </div>
      <Card className={`flex-1 p-4 mb-3 ${step.isBlocking ? 'border-destructive/40' : ''}`}>
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-foreground">{step.conceptName}</h4>
          <div className="flex items-center gap-2">
            {step.isBlocking && (
              <Badge variant="outline" className="text-destructive border-destructive/40 text-[10px]">
                Blocking
              </Badge>
            )}
            {step.masteryStatus === 'mastered' && (
              <Badge variant="outline" className="text-primary border-primary/40 text-[10px]">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Mastered
              </Badge>
            )}
            {step.masteryStatus === 'weak' && (
              <Badge variant="outline" className="text-destructive border-destructive/40 text-[10px]">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Weak
              </Badge>
            )}
            {step.masteryStatus === 'unknown' && (
              <Badge variant="outline" className="text-muted-foreground text-[10px]">
                Not Assessed
              </Badge>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{step.reason}</p>

        {step.isBlocking && (
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-800 mb-1">Why learn this first?</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  This concept is a prerequisite for later steps in your path. Mastering it first
                  ensures you have the foundation needed to understand what comes next.
                </p>
              </div>
            </div>
          </div>
        )}

        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-2 transition-colors">
            <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
            {open ? 'Hide evidence' : 'Show evidence from source'}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 pl-3 border-l-2 border-primary/30 space-y-2">
              {relatedEdges.length > 0 ? (
                relatedEdges.map((e) => (
                  <div key={e.id} className="flex items-start gap-2">
                    <Quote className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs italic text-muted-foreground">&ldquo;{e.evidence}&rdquo;</p>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-2">
                  <Quote className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-xs italic text-muted-foreground">
                    Evidence quotes appear here when the AI analyzes your source material with a real API key.
                  </p>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}

export function PathStep({ concepts, edges, gapAnalysis, goalConceptId, onRestart }: PathStepProps) {
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState<LearningPath | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const { toast } = useToast();

  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concepts, edges, gapAnalysis, goalConceptId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPath(data);
      toast({ title: 'Learning path generated', description: `Path to "${data.goalConceptName}" is ready.` });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate path';
      console.warn('[PathStep] Falling back to mock learning path:', message);
      const mockPath = mockLearningPath(goalConceptId);
      setPath(mockPath);
      setUsedFallback(true);
      toast({
        title: 'Using sample path',
        description: 'AI path generation unavailable — showing demo learning path.',
      });
    } finally {
      setLoading(false);
    }
  }, [concepts, edges, gapAnalysis, goalConceptId, toast]);

  useEffect(() => {
    generate();
  }, [generate]);

  if (loading || !path) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-6">
          <Skeleton className="h-8 w-56 mx-auto mb-2" />
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>
        <Skeleton className="h-24 rounded-xl mb-4" />
        <Skeleton className="h-32 rounded-xl mb-6" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
              <Skeleton className="flex-1 h-16 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const blockingStep = path.steps.find((s) => s.isBlocking);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <Route className="w-6 h-6 text-primary" />
          Your Personalized Learning Path
        </h2>
        <p className="text-muted-foreground">
          Goal: <span className="font-semibold text-foreground">{path.goalConceptName}</span>
        </p>
      </div>

      {usedFallback && (
        <div className="mb-4 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Showing demo path (AI was unavailable). Add an OpenAI API key for real analysis.</span>
        </div>
      )}

      {blockingStep && (
        <Card className="p-5 mb-6 border-destructive/30 bg-destructive/5 animate-slide-up">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                First Blocker: {blockingStep.conceptName}
              </h3>
              <p className="text-sm text-muted-foreground">{blockingStep.reason}</p>
            </div>
          </div>
        </Card>
      )}

      {path.whyExplanation && (
        <Card className="p-5 mb-6 border-accent/40 bg-accent/5 animate-slide-up">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'hsl(38 85% 45%)' }} />
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Why This Must Be Learned First
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{path.whyExplanation}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-3 mb-6">
        {path.steps.map((step, i) => (
          <PathStepCard key={step.conceptId} step={step} isLast={i === path.steps.length - 1} />
        ))}
      </div>

      <Button variant="outline" className="w-full" onClick={onRestart}>
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset Demo
      </Button>
    </div>
  );
}
