'use client';

import { useState, useCallback } from 'react';
import { Check, Brain, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadStep } from '@/components/steps/upload-step';
import { GraphStep } from '@/components/steps/graph-step';
import { QuizStep } from '@/components/steps/quiz-step';
import { ResultsStep } from '@/components/steps/results-step';
import { PathStep } from '@/components/steps/path-step';
import type {
  Concept,
  DependencyEdge,
  QuizQuestion,
  QuizAnswer,
  GapAnalysis,
} from '@/lib/types';

type StepId = 'upload' | 'graph' | 'quiz' | 'results' | 'path';

const STEPS: { id: StepId; label: string }[] = [
  { id: 'upload', label: 'Upload' },
  { id: 'graph', label: 'Graph' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'results', label: 'Results' },
  { id: 'path', label: 'Learning Path' },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState<StepId>('upload');
  const [sourceText, setSourceText] = useState('');
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [edges, setEdges] = useState<DependencyEdge[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [goalConceptId, setGoalConceptId] = useState('');

  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  const handleUploadComplete = useCallback((text: string) => {
    setSourceText(text);
    setCurrentStep('graph');
  }, []);

  const handleGraphComplete = useCallback((c: Concept[], e: DependencyEdge[]) => {
    setConcepts(c);
    setEdges(e);
    setCurrentStep('quiz');
  }, []);

  const handleQuizComplete = useCallback((questions: QuizQuestion[], answers: QuizAnswer[]) => {
    setQuizQuestions(questions);
    setQuizAnswers(answers);
    setCurrentStep('results');
  }, []);

  const handleResultsComplete = useCallback((analysis: GapAnalysis, goalId: string) => {
    setGapAnalysis(analysis);
    setGoalConceptId(goalId);
    setCurrentStep('path');
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentStep('upload');
    setSourceText('');
    setConcepts([]);
    setEdges([]);
    setQuizQuestions([]);
    setQuizAnswers([]);
    setGapAnalysis(null);
    setGoalConceptId('');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-foreground leading-tight">Concept Dependency Learning Engine</h1>
            <p className="text-xs text-muted-foreground">AI-powered prerequisite analysis &amp; personalized learning paths</p>
          </div>
          {currentStep !== 'upload' && (
            <Button variant="outline" size="sm" onClick={handleRestart}>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset Demo
            </Button>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((step, i) => {
            const isComplete = i < currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      isComplete
                        ? 'bg-primary text-primary-foreground'
                        : isCurrent
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isComplete ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'} hidden sm:block`}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 rounded transition-colors duration-300" style={{ background: i < currentIndex ? 'hsl(175 65% 32%)' : 'hsl(200 15% 88%)' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-6">
        {currentStep === 'upload' && <UploadStep onComplete={handleUploadComplete} />}
        {currentStep === 'graph' && <GraphStep sourceText={sourceText} onComplete={handleGraphComplete} />}
        {currentStep === 'quiz' && (
          <QuizStep concepts={concepts} edges={edges} onComplete={handleQuizComplete} />
        )}
        {currentStep === 'results' && (
          <ResultsStep
            concepts={concepts}
            edges={edges}
            questions={quizQuestions}
            answers={quizAnswers}
            onComplete={handleResultsComplete}
          />
        )}
        {currentStep === 'path' && gapAnalysis && (
          <PathStep
            concepts={concepts}
            edges={edges}
            gapAnalysis={gapAnalysis}
            goalConceptId={goalConceptId}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
