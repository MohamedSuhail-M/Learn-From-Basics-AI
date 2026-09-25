'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Target, CheckCircle2, AlertTriangle, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type {
  Concept,
  DependencyEdge,
  QuizQuestion,
  QuizAnswer,
  GapAnalysis,
} from '@/lib/types';
import { mockGapAnalysis } from '@/lib/mock-data';

interface ResultsStepProps {
  concepts: Concept[];
  edges: DependencyEdge[];
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  onComplete: (gapAnalysis: GapAnalysis, goalConceptId: string) => void;
}

export function ResultsStep({ concepts, questions, answers, onComplete }: ResultsStepProps) {
  const [loading, setLoading] = useState(true);
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [goalConceptId, setGoalConceptId] = useState<string>('');
  const [usedFallback, setUsedFallback] = useState(false);
  const { toast } = useToast();

  const analyze = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze-gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setGapAnalysis(data);
      const weakConcepts = data.results?.filter((r: { status: string }) => r.status === 'weak') || [];
      const masteredCount = data.results?.filter((r: { status: string }) => r.status === 'mastered').length || 0;
      toast({
        title: 'Gap analysis complete',
        description: `${masteredCount} mastered, ${weakConcepts.length} weak spots found.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze gaps';
      console.warn('[ResultsStep] Falling back to mock gap analysis:', message);
      setGapAnalysis(mockGapAnalysis);
      setUsedFallback(true);
      toast({
        title: 'Using sample results',
        description: 'AI gap analysis unavailable — showing demo results.',
      });
    } finally {
      setLoading(false);
    }
  }, [questions, answers, toast]);

  useEffect(() => {
    analyze();
  }, [analyze]);

  if (loading || !gapAnalysis) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-6">
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-around mb-4">
            <Skeleton className="h-12 w-16" />
            <Skeleton className="h-12 w-16" />
            <Skeleton className="h-12 w-16" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </Card>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="w-5 h-5 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const masteredCount = gapAnalysis.results.filter((r) => r.status === 'mastered').length;
  const weakCount = gapAnalysis.results.filter((r) => r.status === 'weak').length;
  const scorePercent = Math.round((masteredCount / gapAnalysis.results.length) * 100);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Results</h2>
        <p className="text-muted-foreground">{gapAnalysis.summary}</p>
      </div>

      {usedFallback && (
        <div className="mb-4 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Showing demo results (AI was unavailable). Add an OpenAI API key for real analysis.</span>
        </div>
      )}

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-around mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{masteredCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Mastered</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <div className="text-3xl font-bold text-destructive">{weakCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Weak</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">{scorePercent}%</div>
            <div className="text-xs text-muted-foreground mt-1">Score</div>
          </div>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-700" style={{ width: `${scorePercent}%` }} />
        </div>
      </Card>

      <div className="space-y-3 mb-6">
        {gapAnalysis.results.map((r, i) => {
          const concept = concepts.find((c) => c.id === r.conceptId);
          return (
            <Card key={r.conceptId} className="p-4 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start gap-3">
                {r.status === 'mastered' ? (
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="font-medium text-foreground">{concept?.name || r.conceptId}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{r.explanation}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-5 mb-6 border-primary/30 bg-primary/5">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Choose Your Learning Goal</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Select the concept you want to master. We&apos;ll build the shortest path to get there.
        </p>
        <Label className="mb-2 block">Goal Concept</Label>
        <Select value={goalConceptId} onValueChange={setGoalConceptId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a concept to master..." />
          </SelectTrigger>
          <SelectContent>
            {concepts.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <Button
        className="w-full"
        onClick={() => onComplete(gapAnalysis, goalConceptId)}
        disabled={!goalConceptId}
      >
        Generate Learning Path
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}
