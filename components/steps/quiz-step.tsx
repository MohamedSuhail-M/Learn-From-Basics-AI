'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, ListChecks, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Concept, DependencyEdge, QuizQuestion, QuizAnswer } from '@/lib/types';
import { mockQuiz } from '@/lib/mock-data';

interface QuizStepProps {
  concepts: Concept[];
  edges: DependencyEdge[];
  onComplete: (questions: QuizQuestion[], answers: QuizAnswer[]) => void;
}

export function QuizStep({ concepts, onComplete }: QuizStepProps) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [usedFallback, setUsedFallback] = useState(false);
  const { toast } = useToast();

  const loadQuiz = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concepts }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setQuestions(data.questions);
      toast({ title: 'Quiz ready', description: `${data.questions.length} questions generated.` });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate quiz';
      console.warn('[QuizStep] Falling back to mock quiz:', message);
      setQuestions(mockQuiz);
      setUsedFallback(true);
      toast({
        title: 'Using sample quiz',
        description: 'AI quiz generation unavailable — showing demo questions.',
      });
    } finally {
      setLoading(false);
    }
  }, [concepts, toast]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = () => {
    const quizAnswers: QuizAnswer[] = questions.map((q) => ({
      questionId: q.id,
      selectedIndex: answers[q.id],
    }));
    onComplete(questions, quizAnswers);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-6">
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-72 mx-auto" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-5">
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-5 w-full" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <ListChecks className="w-6 h-6 text-primary" />
          Diagnostic Quiz
        </h2>
        <p className="text-muted-foreground">Answer {questions.length} questions to identify your knowledge gaps.</p>
      </div>

      {usedFallback && (
        <div className="mb-4 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Showing demo quiz (AI was unavailable). Add an OpenAI API key for real questions.</span>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q, qi) => {
          const concept = concepts.find((c) => c.id === q.conceptId);
          const answered = answers[q.id] !== undefined;
          return (
            <Card key={q.id} className="p-5 animate-slide-up" style={{ animationDelay: `${qi * 80}ms` }}>
              <div className="flex items-start gap-3 mb-4">
                <div className={`mt-0.5 ${answered ? 'text-primary' : 'text-muted-foreground'}`}>
                  {answered ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">Q{qi + 1}</span>
                    {concept && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {concept.name}
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-foreground">{q.question}</p>
                </div>
              </div>
              <RadioGroup
                value={answers[q.id]?.toString() || ''}
                onValueChange={(val) => setAnswers((prev) => ({ ...prev, [q.id]: parseInt(val) }))}
                className="pl-8 space-y-2"
              >
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <RadioGroupItem id={`${q.id}-${oi}`} value={oi.toString()} />
                    <Label htmlFor={`${q.id}-${oi}`} className="text-sm font-normal cursor-pointer">
                      {opt}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </Card>
          );
        })}
      </div>

      <Button className="w-full mt-6" onClick={handleSubmit} disabled={!allAnswered}>
        {allAnswered ? 'Submit & Analyze Gaps' : `Answer all questions (${Object.keys(answers).length}/${questions.length})`}
      </Button>
    </div>
  );
}
