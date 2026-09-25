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
  source: string; // concept id (prerequisite)
  target: string; // concept id (dependent)
  type: RelationshipType;
  confidence: number; // 0-100
  evidence: string; // quote from source text
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
}

export interface LearningPath {
  goalConceptId: string;
  goalConceptName: string;
  steps: LearningPathStep[];
  blockingConceptId: string | null;
  whyExplanation: string;
}

export interface ExtractionResult {
  concepts: Concept[];
  edges: DependencyEdge[];
  sourceText: string;
}
