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
  GraduationCap,
  Award,
  ChevronRight
} from 'lucide-react';
import { recordAssessmentResult } from '@/lib/course-progress';

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
  const courseId = searchParams.get('courseId') || 'ml-foundations';
  const moduleId = searchParams.get('moduleId') || 'mod-1';
  const moduleTitle = searchParams.get('moduleTitle') || '';
  const moduleNumber = searchParams.get('moduleNumber') || '1';

  const [activeCourse, setActiveCourse] = useState<string>('Uploaded Material');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Diagnostic Quiz State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [assessmentCompleted, setAssessmentCompleted] = useState<boolean>(false);

  // Gating & Outcome State
  const [gatingResult, setGatingResult] = useState<{
    unlockedNext: boolean;
    nextModuleId?: string;
    isCourseComplete: boolean;
    scorePercent: number;
  } | null>(null);

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

    // 2. Fetch fresh diagnostic questions grounded in this specific module's lessons
    const docText = localStorage.getItem('active_assessment_text') || '';

    async function loadQuiz() {
      setLoading(true);
      setErrorMessage(null);
      try {
        const res = await fetch('/api/generate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentText: docText,
            topic: savedName,
            moduleTitle,
            moduleNumber,
          }),
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || 'Failed to fetch diagnostic questions');
        }

        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          throw new Error('No diagnostic questions returned for this module');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Error generating module assessment');
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [assessmentId, isNewAction, moduleTitle, moduleNumber]);

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
        sourceContext: q.sourceContext || `${moduleTitle || 'Module'} - Concept ${idx + 1}`,
        prerequisites: q.prerequisites || (idx > 0 ? [questions[idx - 1].concept] : []),
        userChoice: userChoiceIdx !== undefined ? q.options[userChoiceIdx] : undefined,
        correctChoice: q.options[q.correctIndex],
        learningResource: q.learningResource || {
          title: `Study Guide: ${q.concept}`,
          url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q.concept)}`,
        },
      };
    });

    const gapCount = nodes.filter((n) => n.isBlocking).length;
    const masteredCount = nodes.filter((n) => !n.isBlocking).length;
    const scorePercent = Math.round((masteredCount / nodes.length) * 100);

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
    } catch (err) {
      console.error('History save error:', err);
    }

    // Execute Module Gating Evaluation (Unlocks next module if score >= 75%)
    const outcome = recordAssessmentResult(courseId, moduleId, scorePercent);
    setGatingResult({
      ...outcome,
      scorePercent,
    });

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
    setGatingResult(null);
  };

  // State 1: Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] space-y-4 px-4 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
        <h2 className="text-xl font-bold tracking-tight text-white font-sans">
          Generating Module {moduleNumber} Assessment
        </h2>
        <p className="text-sm text-neutral-400 max-w-sm font-light">
          Extracting lesson concepts and establishing topological prerequisite graph...
        </p>
      </div>
    );
  }

  // State 2: Error
  if (errorMessage) {
    return (
      <div className="max-w-lg mx-auto my-12 p-8 border border-white/10 rounded-3xl bg-[#0e0e11]/90 shadow-2xl space-y-4 text-center">
        <AlertTriangle className="w-10 h-10 text-yellow-400 mx-auto" />
        <h2 className="text-lg font-bold text-white font-sans">Module Assessment Error</h2>
        <p className="text-xs text-rose-400 bg-rose-500/10 p-3.5 rounded-xl border border-rose-500/20 font-mono text-left">
          {errorMessage}
        </p>
        <Button
          variant="outline"
          className="w-full border-white/10 hover:bg-white/10 text-white rounded-xl"
          onClick={() => router.push(`/course/${courseId}`)}
        >
          Return to Course Workspace
        </Button>
      </div>
    );
  }

  // State 3: Taking Module Checkpoint Quiz
  if (!assessmentCompleted && questions.length > 0) {
    const currentQ = questions[currentQIndex];
    const isAnswered = selectedAnswers[currentQ.id] !== undefined;
    const isLast = currentQIndex === questions.length - 1;

    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-yellow-400 font-semibold">
              Module {moduleNumber} // Diagnostic Checkpoint
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">{activeCourse}</h1>
          </div>
          <span className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1 rounded-full text-neutral-300">
            Question {currentQIndex + 1} of {questions.length}
          </span>
        </div>

        <Card className="border border-white/10 bg-[#0e0e11]/90 backdrop-blur-xl shadow-2xl rounded-3xl">
          <CardHeader>
            <div className="text-[11px] text-neutral-400 font-mono uppercase mb-1">
              Evaluating Concept: <span className="text-yellow-400 font-semibold">{currentQ.concept}</span>
            </div>
            <CardTitle className="text-base font-semibold leading-relaxed text-white">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const selected = selectedAnswers[currentQ.id] === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all duration-200 cursor-pointer ${
                    selected
                      ? 'border-yellow-400 bg-yellow-400/10 font-semibold text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.2)]'
                      : 'border-white/10 bg-white/[0.02] text-neutral-300 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="mr-2.5 font-mono text-xs text-yellow-400 opacity-80">
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
            className="text-neutral-400 hover:text-white"
          >
            Previous
          </Button>

          {isLast ? (
            <Button
              type="button"
              size="sm"
              disabled={!isAnswered}
              onClick={handleFinishAssessment}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-full px-5 shadow-[0_0_18px_rgba(250,204,21,0.35)]"
            >
              Finish & Check Module Gating
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              disabled={!isAnswered}
              onClick={handleNextQuestion}
              className="bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-full px-5"
            >
              Next Question
            </Button>
          )}
        </div>
      </div>
    );
  }

  // State 4: Persistent Prerequisite Knowledge Graph & Module Outcome
  const blockingGaps = graphNodes.filter((n) => n.isBlocking);
  const masteredNodes = graphNodes.filter((n) => !n.isBlocking);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 selection:bg-yellow-400 selection:text-black">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <button
              onClick={() => router.push(`/course/${courseId}`)}
              className="hover:text-yellow-400 flex items-center gap-1 cursor-pointer font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Course Workspace
            </button>
            <span>/</span>
            <span className="font-medium text-white">{activeCourse}</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">
            Module {moduleNumber} Prerequisite Knowledge Graph
          </h1>
          <p className="text-xs text-neutral-400 font-light">
            Topological dependency flow for this module. Inspect nodes to view verbatim course excerpts and external study material.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white"
            onClick={() => router.push('/dashboard')}
          >
            <History className="w-4 h-4 text-yellow-400" /> Dashboard
          </Button>
          <Button
            size="sm"
            onClick={handleRetake}
            variant="outline"
            className="gap-1.5 text-xs rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white"
          >
            <RotateCcw className="w-3.5 h-3.5 text-yellow-400" /> Retake Quiz
          </Button>
        </div>
      </div>

      {/* Gating Outcome Banner */}
      {gatingResult && (
        <div
          className={`p-5 rounded-3xl border transition-all ${
            gatingResult.scorePercent >= 75
              ? 'border-emerald-500/40 bg-emerald-500/10'
              : 'border-yellow-400/40 bg-yellow-400/10'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {gatingResult.scorePercent >= 75 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertOctagon className="w-5 h-5 text-yellow-400" />
                )}
                <h3 className="text-base font-bold text-white font-sans">
                  {gatingResult.scorePercent >= 75
                    ? `Module ${moduleNumber} Passed (${gatingResult.scorePercent}%)`
                    : `Threshold Incomplete (${gatingResult.scorePercent}% / 75% Required)`}
                </h3>
              </div>
              <p className="text-xs text-neutral-300 font-light">
                {gatingResult.scorePercent >= 75
                  ? gatingResult.isCourseComplete
                    ? 'All modules completed across this curriculum track. Your verified credential is now available.'
                    : `Prerequisite threshold passed. Next sequential module in this track has been unlocked.`
                  : 'Review the identified conceptual blockers in the inspector below before re-evaluating.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {gatingResult.isCourseComplete ? (
                <Link href={`/certificate?courseId=${courseId}`}>
                  <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-full px-5 shadow-[0_0_15px_rgba(250,204,21,0.3)] flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> View Certificate
                  </Button>
                </Link>
              ) : (
                <Link href={`/course/${courseId}`}>
                  <Button className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-full px-5 flex items-center gap-1.5">
                    <span>Return to Course Workspace</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`p-5 rounded-2xl border transition-all ${
            blockingGaps.length > 0
              ? 'border-rose-500/40 bg-rose-500/[0.04]'
              : 'border-emerald-500/40 bg-emerald-500/[0.04]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
              Module Knowledge Gaps
            </span>
            <AlertOctagon
              className={`w-4 h-4 ${blockingGaps.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}
            />
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">
            {blockingGaps.length}{' '}
            <span className="text-xs font-light text-neutral-400">
              blocking prerequisite{blockingGaps.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.02]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
              Mastered Concepts
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {masteredNodes.length} / {graphNodes.length}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#0e0e11]/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
              Target Module Concept
            </span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-sm font-bold text-white mt-1 truncate">
            {graphNodes[graphNodes.length - 1]?.conceptName || 'Target Concept'}
          </div>
        </div>
      </div>

      {/* Prerequisite Flow and Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Topological Dependency Flow */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-yellow-400" />
              <h2 className="text-sm font-bold tracking-tight text-white font-sans">
                Topological Dependency Flow
              </h2>
            </div>
            <span className="text-xs text-neutral-500 font-mono">Click a node to inspect citations</span>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-[#0e0e11]/90 backdrop-blur-xl space-y-6 shadow-2xl">
            {graphNodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              const isBlocking = node.isBlocking;
              const hasNext = index < graphNodes.length - 1;

              return (
                <div key={node.id} className="relative flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setSelectedNode(node)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? isBlocking
                          ? 'ring-2 ring-rose-500 border-rose-500 bg-rose-500/10'
                          : 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-500/10'
                        : isBlocking
                        ? 'border-rose-500/30 bg-rose-500/[0.03] hover:border-rose-500'
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
                          {isBlocking ? (
                            <AlertOctagon className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase">
                            Step {node.order}
                          </span>
                          <h3 className="text-sm font-bold text-white leading-snug">
                            {node.conceptName}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isBlocking
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isBlocking ? 'Blocking Gap' : 'Mastered'}
                      </span>
                    </div>

                    {node.prerequisites && node.prerequisites.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-neutral-500 uppercase font-mono">
                          Requires:
                        </span>
                        {node.prerequisites.map((req, rIdx) => (
                          <span
                            key={rIdx}
                            className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-neutral-300 border border-white/5"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>

                  {hasNext && (
                    <div className="flex flex-col items-center my-2">
                      <div className="w-0.5 h-3 bg-white/10" />
                      <ArrowDown className="w-3.5 h-3.5 text-neutral-600 -my-1" />
                      <div className="w-0.5 h-3 bg-white/10" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Node Inspector with Grounded Citations */}
        <div className="lg:col-span-5 space-y-4 sticky top-6">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-yellow-400" />
            <h2 className="text-sm font-bold tracking-tight text-white font-sans">
              Node Inspector & Source Citations
            </h2>
          </div>

          {selectedNode ? (
            <Card className="border border-white/10 bg-[#0e0e11]/90 backdrop-blur-xl shadow-2xl rounded-3xl">
              <CardHeader className="pb-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    Step {selectedNode.order} of {graphNodes.length}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                      selectedNode.isBlocking
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {selectedNode.isBlocking ? 'Knowledge Gap' : 'Mastered'}
                  </span>
                </div>
                <CardTitle className="text-base font-bold text-white pt-1">
                  {selectedNode.conceptName}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 pt-4 text-sm">
                {/* Diagnostic Status */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    Diagnostic Status
                  </span>
                  <p className="text-neutral-300 text-xs leading-relaxed font-light">
                    {selectedNode.reason}
                  </p>
                  {selectedNode.isBlocking && selectedNode.correctChoice && (
                    <div className="mt-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-1 font-mono">
                      <div className="text-rose-400">
                        Selected: <span className="text-neutral-300">{selectedNode.userChoice || 'Missed'}</span>
                      </div>
                      <div className="text-emerald-400">
                        Target: <span className="text-neutral-200">{selectedNode.correctChoice}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Grounded Source Material Citation */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-yellow-400 flex items-center gap-1 font-semibold">
                      <Quote className="w-3.5 h-3.5" /> Module Excerpt Citation
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {selectedNode.sourceContext}
                    </span>
                  </div>

                  <blockquote className="p-3 bg-white/[0.02] border-l-2 border-yellow-400 text-xs italic text-neutral-300 leading-relaxed rounded-r">
                    &ldquo;{selectedNode.sourceQuote}&rdquo;
                  </blockquote>

                  <p className="text-[11px] text-neutral-500 font-light">
                    Passage derived from this module&apos;s lessons. Review to resolve this prerequisite gap.
                  </p>
                </div>

                {/* External Prerequisite Learning Resource */}
                {selectedNode.learningResource && (
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-yellow-400" /> Recommended Study Resource
                    </span>

                    <a
                      href={selectedNode.learningResource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl border border-yellow-400/30 bg-yellow-400/5 hover:bg-yellow-400/10 transition-colors group cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-yellow-300 group-hover:underline">
                          {selectedNode.learningResource.title}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          Direct reference to resolve prerequisite gap
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-yellow-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="p-8 border border-white/10 rounded-3xl bg-[#0e0e11]/80 text-center text-xs text-neutral-500 font-mono">
              Select any node from the graph to inspect details.
            </div>
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
          <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
          <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
            Loading module assessment...
          </p>
        </div>
      }
    >
      <LearningPathContent />
    </Suspense>
  );
}