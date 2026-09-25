export type RelationshipType =
  | 'prerequisite'
  | 'builds-on'
  | 'related'
  | 'example-of';

export interface Concept {
  id: string;
  name: string;
  description: string;
}

export interface DependencyEdge {
  id: string;
  source: string;
  target: string;
  type: 'prerequisite' | 'builds-on' | 'related' | 'example-of';
  confidence: number;
  evidence: string;
  whyLearnFirst?: string; // <-- Add this field
}

export interface QuizQuestion {
  id: string;
  conceptId: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
}

export interface ConceptMastery {
  conceptId: string;
  status: 'mastered' | 'weak';
  explanation: string;
}

export interface GapAnalysis {
  results: ConceptMastery[];
  summary: string;
}

export interface LearningPathStep {
  conceptId: string;
  conceptName: string;
  order: number;
  isBlocking: boolean;
  masteryStatus: 'mastered' | 'weak' | 'unknown';
  reason: string;
  whyExplanation?: string; // Fixes results-step.tsx ts(2339)
}

export interface LearningPath {
  goalConceptId: string;
  goalConceptName: string;
  steps: LearningPathStep[];
  blockingConceptId?: string | null; // Fixes mock-data.ts ts(2322)
  whyExplanation?: string;
}
export interface ExtractionResult {
  concepts: Concept[];
  edges: DependencyEdge[];
  sourceText: string;
}
