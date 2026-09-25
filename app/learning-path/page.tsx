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
  Sparkles,
  Loader2,
  HelpCircleIcon
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  concept: string;
  explanation: string;
}

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
  const [activeCourse, setActiveCourse] = useState<string>('Document Material');
  const [loadingQuiz, setLoadingQuiz] = useState<boolean>(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [assessmentCompleted, setAssessmentCompleted] = useState<boolean>(false);
  const [steps, setSteps] = useState<PathStepItem[]>([]);

  // 1. Fetch questions using the stored document text
  useEffect(() => {
    const docText = sessionStorage.getItem('currentDocumentText') || '';
    const docName = sessionStorage.getItem('currentDocumentName') || '';
    const topic = sessionStorage.getItem('selectedCourseTopic') || 'Machine Learning & Prerequisite Basics';

    if (docName) setActiveCourse(docName);
    else if (topic) setActiveCourse(topic.replace(/_/g, ' '));

    async function loadQuiz() {
      try {
        const res = await fetch('/api/generate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentText: docText, topic }),
        });
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        }
      } catch (e) {
        console.error('Quiz fetch failed', e);
      } finally {
        setLoadingQuiz(false);
      }
    }

    loadQuiz();
  }, []);

  const handleSelectOption = (qId: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleFinishAssessment = () => {
    // Grade responses to derive actual mastered vs weak steps
    const generatedSteps: PathStepItem[] = questions.map((q, idx) => {
      const userAnswer = selectedAnswers[q.id];
      const isCorrect = userAnswer === q.correctIndex;

      return {
        conceptId: `c-${q.id}`,
        conceptName: q.concept,
        order: idx + 1,
        isBlocking: !isCorrect,
        masteryStatus: isCorrect ? 'mastered' : 'weak',
        reason: isCorrect
          ? `Mastered in diagnostic: ${q.explanation}`
          : `Diagnosed knowledge gap: ${q.explanation}`,
        whyExplanation: !isCorrect
          ? `You missed question ${idx + 1}. Reviewing ${q.concept} is required before advancing.`
          : undefined,
        evidenceQuote: !isCorrect ? q.question : undefined,
      };
    });

    setSteps(generatedSteps);
    setAssessmentCompleted(true);
    // Cache path
    sessionStorage.setItem('generatedLearningPath', JSON.stringify(generatedSteps));
  };

  // State A: Loading the Derived Questions
  if (loadingQuiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">
          Extracting concepts and generating diagnostic assessment from your material...
        </p>
      </div>
    );
  }

  // State B: Active Assessment Mode
  if (!assessmentCompleted && questions.length > 0) {
    const currentQ = questions[currentQIndex];
    const isAnswered = selectedAnswers[currentQ.id] !== undefined;
    const isLast = currentQIndex === questions.length - 1;

    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Diagnostic Assessment
            </span>
            <h1 className="text-xl font-bold tracking-tight">{activeCourse}</h1>
          </div>
          <span className="text-xs bg-muted px-2.5 py-1 rounded-full font-medium">
            Question {currentQIndex + 1} of {questions.length}
          </span>
        </div>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold leading-relaxed">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {currentQ.options.map((opt, optIdx) => {
              const selected = selectedAnswers[currentQ.id] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  className={`w-full text-left p-3.5 rounded-lg border text-sm transition-all ${
                    selected
                      ? 'border-primary bg-primary/10 font-semibold text-primary'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <span className="mr-2 font-mono text-xs opacity-60">
                    {String.fromCharCode(65 + optIdx)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentQIndex === 0}
            onClick={() => setCurrentQIndex((i) => i - 1)}
          >
            Previous
          </Button>

          {isLast ? (
            <Button
              size="sm"
              disabled={!isAnswered}
              onClick={handleFinishAssessment}
              className="bg-[#107569] hover:bg-[#0e6258] text-white"
            >
              Finish & View Learning Path
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={!isAnswered}
              onClick={() => setCurrentQIndex((i) => i + 1)}
            >
              Next Question
            </Button>
          )}
        </div>
      </div>
    );
  }

  // State C: Generated Prerequisite Learning Path
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
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
              <BookOpen className="w-4 h-4" /> New Material
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative border-l-2 border-primary/20 ml-4 space-y-8 pl-6 pt-2">
        {steps.map((step) => {
          const isMastered = step.masteryStatus === 'mastered';

          return (
            <div key={step.conceptId} className="relative">
              <div
                className={`absolute -left-[35px] top-1 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                  isMastered
                    ? 'bg-emerald-500 text-white'
                    : step.isBlocking
                    ? 'bg-rose-500 text-white ring-4 ring-rose-500/20'
                    : 'bg-muted text-muted-foreground border'
                }`}
              >
                {isMastered ? <CheckCircle2 className="w-5 h-5" /> : step.order}
              </div>

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