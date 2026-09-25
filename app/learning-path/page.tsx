'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  AlertOctagon,
  ArrowLeft,
  Loader2,
  RotateCcw,
  Network,
  BookOpen,
  FileText,
  AlertTriangle,
  ArrowDown,
  Quote,
  Sparkles,
  History,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

interface LearningResource {
  title: string;
  url: string;
}

interface Question {
  id: number;
  concept: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceQuote?: string;
  sourceContext?: string;
  prerequisites?: string[];
  learningResource?: LearningResource;
}

interface GraphNode {
  id: string;
  numericId: number;
  conceptName: string;
  order: number;
  isBlocking: boolean;
  masteryStatus: 'mastered' | 'weak';
  reason: string;
  sourceQuote?: string;
  sourceContext?: string;
  prerequisites: string[];
  userChoice?: string;
  correctChoice?: string;
  learningResource?: LearningResource;
}

function LearningPathContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get('id') || 'default_run';
  const isNewAction = searchParams.get('action') === 'new';

  const [activeCourse, setActiveCourse] = useState<string>('Uploaded Material');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Diagnostic Quiz State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [assessmentCompleted, setAssessmentCompleted] = useState<boolean>(false);

  // Graph State
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('active_assessment_name') || 'Course Material';
    setActiveCourse(savedName);

    // 1. Check if this assessment was ALREADY completed in localStorage
    const savedRecord = localStorage.getItem(`graph_record_${assessmentId}`);
    if (!isNewAction && savedRecord) {
      try {
        const parsed = JSON.parse(savedRecord);
        if (parsed.nodes && parsed.nodes.length > 0) {
          setGraphNodes(parsed.nodes);
          setSelectedNode(parsed.nodes.find((n: GraphNode) => n.isBlocking) || parsed.nodes[0]);
          setActiveCourse(parsed.courseName || savedName);
          setAssessmentCompleted(true);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Could not read cached graph record', err);
      }
    }

    // 2. Otherwise, fetch questions to take/retake diagnostic quiz
    const docText = localStorage.getItem('active_assessment_text') || '';

    async function loadQuiz() {
      setLoading(true);
      setErrorMessage(null);
      try {
        const res = await fetch('/api/generate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentText: docText, topic: savedName }),
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || 'Failed to fetch diagnostic questions');
        }

        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          throw new Error('No diagnostic questions returned');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Error generating assessment');
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [assessmentId, isNewAction]);

  const handleSelectOption = (qId: number, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handlePreviousQuestion = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentQIndex > 0) {
      setCurrentQIndex((prev) => prev - 1);
    }
  };

  const handleNextQuestion = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    }
  };

  const handleFinishAssessment = (e: React.MouseEvent) => {
    e.preventDefault();
    const nodes: GraphNode[] = questions.map((q, idx) => {
      const userChoiceIdx = selectedAnswers[q.id];
      const isCorrect = userChoiceIdx === q.correctIndex;

      return {
        id: `node-${q.id}`,
        numericId: q.id,
        conceptName: q.concept,
        order: idx + 1,
        isBlocking: !isCorrect,
        masteryStatus: isCorrect ? 'mastered' : 'weak',
        reason: isCorrect
          ? `Mastered: Verified understanding of ${q.concept}.`
          : `Knowledge Gap: Review ${q.concept} before proceeding.`,
        sourceQuote: q.sourceQuote || q.explanation,
        sourceContext: q.sourceContext || `Section ${idx + 1}`,
        prerequisites: q.prerequisites || (idx > 0 ? [questions[idx - 1].concept] : []),
        userChoice: userChoiceIdx !== undefined ? q.options[userChoiceIdx] : undefined,
        correctChoice: q.options[q.correctIndex],
        learningResource: q.learningResource || {
          title: `Study Guide: ${q.concept}`,
          url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q.concept)}`
        }
      };
    });

    const gapCount = nodes.filter((n) => n.isBlocking).length;
    const masteredCount = nodes.filter((n) => !n.isBlocking).length;

    // Save record to localStorage
    localStorage.setItem(
      `graph_record_${assessmentId}`,
      JSON.stringify({
        id: assessmentId,
        courseName: activeCourse,
        nodes: nodes,
        date: new Date().toLocaleDateString(),
      })
    );

    // Update history list
    try {
      const existingHistoryRaw = localStorage.getItem('assessment_history_v1');
      const existingList = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
      const filtered = existingList.filter((item: any) => item.id !== assessmentId);

      const updatedHistory = [
        {
          id: assessmentId,
          courseName: activeCourse,
          date: new Date().toLocaleDateString(),
          totalNodes: nodes.length,
          gapCount,
          masteredCount,
        },
        ...filtered,
      ];

      localStorage.setItem('assessment_history_v1', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('History save error:', e);
    }

    setGraphNodes(nodes);
    setSelectedNode(nodes.find((n) => n.isBlocking) || nodes[0]);
    setAssessmentCompleted(true);
  };

  const handleRetake = (e: React.MouseEvent) => {
    e.preventDefault();
    setAssessmentCompleted(false);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setSelectedNode(null);
  };

  // State 1: Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] space-y-4 px-4 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <h2 className="text-xl font-bold tracking-tight">Generating Diagnostic Assessment</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Extracting concepts and establishing topological prerequisite graph...
        </p>
      </div>
    );
  }

  // State 2: Error
  if (errorMessage) {
    return (
      <div className="max-w-lg mx-auto my-12 p-6 border rounded-xl bg-card shadow-sm space-y-4 text-center">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-foreground">Assessment Generation Error</h2>
        <p className="text-sm text-rose-500 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20 font-mono text-left">
          {errorMessage}
        </p>
        <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // State 3: Taking Quiz
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
            <div className="text-xs text-muted-foreground font-mono uppercase mb-1">
              Concept: <span className="text-foreground font-semibold">{currentQ.concept}</span>
            </div>
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
                  type="button"
                  onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  className={`w-full text-left p-3.5 rounded-lg border text-sm transition-all cursor-pointer ${
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
            type="button"
            variant="ghost"
            size="sm"
            disabled={currentQIndex === 0}
            onClick={handlePreviousQuestion}
          >
            Previous
          </Button>

          {isLast ? (
            <Button
              type="button"
              size="sm"
              disabled={!isAnswered}
              onClick={handleFinishAssessment}
              className="bg-[#107569] hover:bg-[#0e6258] text-white"
            >
              Finish & View Prerequisite Graph
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              disabled={!isAnswered}
              onClick={handleNextQuestion}
            >
              Next Question
            </Button>
          )}
        </div>
      </div>
    );
  }

  // State 4: Persistent Prerequisite Graph
  const blockingGaps = graphNodes.filter((n) => n.isBlocking);
  const masteredNodes = graphNodes.filter((n) => !n.isBlocking);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <button
              onClick={() => router.push('/dashboard')}
              className="hover:text-foreground flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </button>
            <span>/</span>
            <span className="font-medium text-foreground">{activeCourse}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Prerequisite Knowledge Graph</h1>
          <p className="text-sm text-muted-foreground">
            Saved diagnostic results. You can return to this graph anytime from your dashboard history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => router.push('/dashboard')}
          >
            <History className="w-4 h-4" /> All History
          </Button>
          <Button
            size="sm"
            onClick={handleRetake}
            variant="outline"
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retake Diagnostic
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`border shadow-sm ${blockingGaps.length > 0 ? 'border-rose-500/40 bg-rose-500/[0.03]' : 'border-emerald-500/40 bg-emerald-500/[0.03]'}`}>
          <CardContent className="pt-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Identified Gaps
              </span>
              <AlertOctagon className={`w-4 h-4 ${blockingGaps.length > 0 ? 'text-rose-500' : 'text-emerald-500'}`} />
            </div>
            <div className="text-2xl font-bold text-rose-600">
              {blockingGaps.length} <span className="text-xs font-normal text-muted-foreground">blocking prerequisite{blockingGaps.length === 1 ? '' : 's'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm border-emerald-500/30 bg-emerald-500/[0.02]">
          <CardContent className="pt-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Mastered Concepts
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              {masteredNodes.length} / {graphNodes.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="pt-5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Target Node
              </span>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="text-sm font-bold truncate">
              {graphNodes[graphNodes.length - 1]?.conceptName || 'Target Concept'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graph and Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Flowchart Graph */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold tracking-tight">Topological Dependency Flow</h2>
            </div>
            <span className="text-xs text-muted-foreground">Click a node to inspect source citations</span>
          </div>

          <div className="p-6 rounded-2xl border bg-card/60 backdrop-blur-sm space-y-6">
            {graphNodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              const isBlocking = node.isBlocking;
              const hasNext = index < graphNodes.length - 1;

              return (
                <div key={node.id} className="relative flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setSelectedNode(node)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 shadow-sm relative cursor-pointer ${
                      isSelected
                        ? isBlocking
                          ? 'ring-2 ring-rose-500 border-rose-500 bg-rose-500/10'
                          : 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-500/10'
                        : isBlocking
                        ? 'border-rose-500/40 bg-rose-500/[0.03] hover:border-rose-500'
                        : 'border-emerald-500/30 bg-emerald-500/[0.02] hover:border-emerald-500'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                            isBlocking ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                          }`}
                        >
                          {isBlocking ? <AlertOctagon className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">
                            Step {node.order}
                          </span>
                          <h3 className="text-sm font-bold text-foreground leading-snug">
                            {node.conceptName}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isBlocking ? 'bg-rose-500/20 text-rose-600' : 'bg-emerald-500/20 text-emerald-600'
                        }`}
                      >
                        {isBlocking ? 'Blocking Gap' : 'Mastered'}
                      </span>
                    </div>

                    {node.prerequisites && node.prerequisites.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-muted-foreground uppercase font-mono">Requires:</span>
                        {node.prerequisites.map((req, rIdx) => (
                          <span key={rIdx} className="text-[11px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-medium">
                            {req}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>

                  {hasNext && (
                    <div className="flex flex-col items-center my-2">
                      <div className="w-0.5 h-4 bg-border" />
                      <ArrowDown className="w-4 h-4 text-muted-foreground -my-1" />
                      <div className="w-0.5 h-4 bg-border" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Node Inspector */}
        <div className="lg:col-span-5 space-y-4 sticky top-6">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold tracking-tight">Node Inspector & Prerequisite Verification</h2>
          </div>

          {selectedNode ? (
            <Card className="border shadow-sm">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    Step {selectedNode.order} of {graphNodes.length}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      selectedNode.isBlocking
                        ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    }`}
                  >
                    {selectedNode.isBlocking ? 'Knowledge Gap' : 'Mastered'}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold pt-1">{selectedNode.conceptName}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 pt-4 text-sm">
                {/* Diagnostic Outcome */}
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Diagnostic Status
                  </span>
                  <p className="text-foreground leading-relaxed text-xs">{selectedNode.reason}</p>
                  {selectedNode.isBlocking && selectedNode.correctChoice && (
                    <div className="mt-2 p-2.5 rounded bg-muted/60 text-xs space-y-1 border">
                      <div className="text-rose-600 font-semibold">
                        Your answer: <span className="font-normal">{selectedNode.userChoice || 'Missed'}</span>
                      </div>
                      <div className="text-emerald-600 font-semibold">
                        Target answer: <span className="font-normal">{selectedNode.correctChoice}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 1. Grounded Source Material Citation */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
                      <Quote className="w-3.5 h-3.5" /> Source Document Citation
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded border">
                      {selectedNode.sourceContext || 'Document Grounding'}
                    </span>
                  </div>

                  <blockquote className="p-3 bg-muted/40 border-l-2 border-primary text-xs italic text-muted-foreground leading-relaxed rounded-r">
                    &ldquo;{selectedNode.sourceQuote}&rdquo;
                  </blockquote>

                  <p className="text-[11px] text-muted-foreground">
                    Verbatim passage derived from your uploaded course text. Review this section to master this concept.
                  </p>
                </div>

                {/* 2. External Prerequisite Learning Resource */}
                {selectedNode.learningResource && (
                  <div className="pt-2 border-t space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-primary" /> Recommended Study Material
                      </span>
                    </div>

                    <a
                      href={selectedNode.learningResource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors group cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-primary group-hover:underline">
                          {selectedNode.learningResource.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Direct reference to clear prerequisite gaps
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border p-6 text-center text-muted-foreground text-sm">
              Select any node from the graph to inspect details.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LearningPathPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[65vh] space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading learning path...</p>
        </div>
      }
    >
      <LearningPathContent />
    </Suspense>
  );
}