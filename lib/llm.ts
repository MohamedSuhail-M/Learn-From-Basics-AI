import { GoogleGenAI } from '@google/genai';
import {
  mockConcepts,
  mockEdges,
  mockQuiz,
  mockGapAnalysis,
  mockLearningPath,
} from './mock-data';
import type {
  Concept,
  DependencyEdge,
  QuizQuestion,
  GapAnalysis,
  LearningPath,
} from './types';

const apiKey = process.env.GEMINI_API_KEY;
const MOCK_MODE = !apiKey;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const MODEL = 'gemini-2.5-flash';

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!ai) throw new Error('Gemini API client not initialized.');
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });
  if (!response.text) throw new Error('Empty response from Gemini');
  return response.text;
}

function extractJSON(text: string): any {
  const match = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? (match[1] || match[0]).trim() : text);
}

function withFallback<T>(label: string, mockValue: T, realCall: () => Promise<T>): Promise<T> {
  if (MOCK_MODE) return Promise.resolve(mockValue);
  return realCall().catch((err) => {
    console.warn(`[LLM] ${label} failed, fallback applied:`, err);
    return mockValue;
  });
}

// 1. Concept Extraction Prompt
export async function extractConcepts(sourceText: string): Promise<Concept[]> {
  return withFallback('extractConcepts', mockConcepts, async () => {
    const system = `You are a curriculum analysis engine. Extract 6 to 12 foundational and advanced concepts.
Return JSON matching:
{
  "concepts": [
    {
      "id": "c1",
      "name": "Concept Title",
      "description": "Precise one-sentence definition from source."
    }
  ]
}`;
    const user = `Text:\n${sourceText.slice(0, 16000)}`;
    const raw = await callGemini(system, user);
    return extractJSON(raw).concepts;
  });
}

// 2. Prerequisite Graph & Evidence Prompt
export async function detectDependencies(concepts: Concept[], sourceText: string): Promise<DependencyEdge[]> {
  return withFallback('detectDependencies', mockEdges, async () => {
    const system = `You are an expert cognitive pedagogue. Identify prerequisite dependencies among concepts.
Rules:
- For every dependency, you MUST cite an exact sentence from the source text as evidenceQuote.
- Provide a rigorous 'whyLearnFirst' justification.
Return JSON matching:
{
  "edges": [
    {
      "id": "e1",
      "source": "concept_id_A",
      "target": "concept_id_B",
      "type": "prerequisite",
      "confidence": 95,
      "evidence": "Exact verbatim quote from material.",
      "whyLearnFirst": "Pedagogical reason why A must precede B."
    }
  ]
}`;
    const user = `Concepts: ${JSON.stringify(concepts)}\n\nCourse Text:\n${sourceText.slice(0, 16000)}`;
    const raw = await callGemini(system, user);
    return extractJSON(raw).edges;
  });
}

// 3. Diagnostic Quiz Prompt
export async function generateQuiz(concepts: Concept[]): Promise<QuizQuestion[]> {
  return withFallback('generateQuiz', mockQuiz, async () => {
    const system = `You are an academic assessment designer. Create targeted diagnostic multiple-choice questions testing conceptual mastery.
Return JSON matching:
{
  "questions": [
    {
      "id": "q1",
      "conceptId": "concept_id",
      "question": "Question testing foundational knowledge",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0
    }
  ]
}`;
    const user = `Concepts:\n${JSON.stringify(concepts)}`;
    const raw = await callGemini(system, user);
    return extractJSON(raw).questions;
  });
}

// 4. Knowledge Gap & Mastery Prompt
export async function analyzeGaps(
  questions: QuizQuestion[],
  answers: { questionId: string; selectedIndex: number }[]
): Promise<GapAnalysis> {
  return withFallback('analyzeGaps', mockGapAnalysis, async () => {
    const system = `You are an evaluation engine. Grade the student's quiz answers, compute mastery scores (0-100), and isolate critical knowledge gaps.
Return JSON matching:
{
  "results": [
    {
      "conceptId": "c1",
      "status": "mastered",
      "explanation": "Student demonstrated correct grasp of the foundational principles."
    }
  ],
  "summary": "Overall assessment summary with priority focus areas."
}`;
    const user = `Questions: ${JSON.stringify(questions)}\nStudent Answers: ${JSON.stringify(answers)}`;
    const raw = await callGemini(system, user);
    return extractJSON(raw);
  });
}

// 5. Specified Learning Path Prompt
export async function generateLearningPath(
  concepts: Concept[],
  edges: DependencyEdge[],
  gapAnalysis: GapAnalysis,
  goalConceptId: string
): Promise<LearningPath> {
  return withFallback('generateLearningPath', mockLearningPath(goalConceptId), async () => {
    const system = `You are a personal learning tutor. Construct a topologically sorted, step-by-step personalized learning sequence targeting the goal concept.
Rules:
- Mark the first weak or missing prerequisite as blocking (isBlocking: true).
- Give an explicit evidence-based 'whyExplanation' highlighting why the student must address this node before proceeding.
Return JSON matching:
{
  "goalConceptId": "${goalConceptId}",
  "goalConceptName": "Name",
  "steps": [
    {
      "conceptId": "c1",
      "conceptName": "Name",
      "order": 1,
      "isBlocking": false,
      "masteryStatus": "mastered",
      "reason": "Foundational prerequisite."
    }
  ],
  "blockingConceptId": "c2",
  "whyExplanation": "Clear justification citing dependencies why this block must be resolved first."
}`;
    const user = `Concepts: ${JSON.stringify(concepts)}\nEdges: ${JSON.stringify(edges)}\nMastery: ${JSON.stringify(gapAnalysis)}\nGoal: ${goalConceptId}`;
    const raw = await callGemini(system, user);
    return extractJSON(raw);
  });
}