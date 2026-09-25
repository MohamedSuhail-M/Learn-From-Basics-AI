import { mockConcepts, mockEdges, mockQuiz, mockGapAnalysis, mockLearningPath } from './mock-data';
import type {
  Concept,
  DependencyEdge,
  QuizQuestion,
  GapAnalysis,
  LearningPath,
} from './types';

// ── MOCK MODE ──────────────────────────────────────────────────────────
// Set MOCK_MODE = true to always return hardcoded sample data (demo-safe).
// Set MOCK_MODE = false to call the real OpenAI API (requires OPENAI_API_KEY).
// If MOCK_MODE is false but the API call fails, we automatically fall back
// to mock data so the demo never crashes on stage.
const MOCK_MODE = !process.env.OPENAI_API_KEY;

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

function extractJSON(text: string): unknown {
  const match = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
  if (match) {
    const jsonStr = match[1] || match[0];
    return JSON.parse(jsonStr.trim());
  }
  return JSON.parse(text);
}

function withFallback<T>(
  label: string,
  mockValue: T,
  realCall: () => Promise<T>
): Promise<T> {
  if (MOCK_MODE) return Promise.resolve(mockValue);

  return realCall().catch((err) => {
    console.warn(`[LLM] ${label} failed, falling back to mock data:`, err instanceof Error ? err.message : err);
    return mockValue;
  });
}

export async function extractConcepts(sourceText: string): Promise<Concept[]> {
  return withFallback('extractConcepts', mockConcepts, async () => {
    const system = 'You are an expert educator. Extract key concepts from the given course material. Return ONLY valid JSON.';
    const user = `From the following text, extract 8-12 key concepts. Return JSON: {"concepts":[{"id":"c1","name":"Concept Name","description":"One sentence description"}]}\n\nText:\n${sourceText.slice(0, 8000)}`;
    const raw = await callOpenAI(system, user);
    const parsed = extractJSON(raw) as { concepts: Concept[] };
    return parsed.concepts;
  });
}

export async function detectDependencies(
  concepts: Concept[],
  sourceText: string
): Promise<DependencyEdge[]> {
  return withFallback('detectDependencies', mockEdges, async () => {
    const system = 'You are an expert educator. Identify prerequisite relationships between concepts. Return ONLY valid JSON.';
    const user = `Given these concepts: ${JSON.stringify(concepts)}
And this source text: ${sourceText.slice(0, 8000)}

Identify relationships between concepts. Each edge has a source (prerequisite), target (dependent concept), type (prerequisite|builds-on|related|example-of), confidence (0-100), and evidence (a short quote from the source text supporting the relationship).

Return JSON: {"edges":[{"id":"e1","source":"c1","target":"c2","type":"prerequisite","confidence":85,"evidence":"quote from text"}]}`;
    const raw = await callOpenAI(system, user);
    const parsed = extractJSON(raw) as { edges: DependencyEdge[] };
    return parsed.edges;
  });
}

export async function generateQuiz(concepts: Concept[]): Promise<QuizQuestion[]> {
  return withFallback('generateQuiz', mockQuiz, async () => {
    const system = 'You are an expert educator. Generate diagnostic quiz questions. Return ONLY valid JSON.';
    const user = `Generate 5 multiple-choice questions to test understanding of these concepts: ${JSON.stringify(concepts)}
Each question tests one concept. Return JSON: {"questions":[{"id":"q1","conceptId":"c1","question":"Question text","options":["A","B","C","D"],"correctIndex":0}]}`;
    const raw = await callOpenAI(system, user);
    const parsed = extractJSON(raw) as { questions: QuizQuestion[] };
    return parsed.questions;
  });
}

export async function analyzeGaps(
  questions: QuizQuestion[],
  answers: { questionId: string; selectedIndex: number }[]
): Promise<GapAnalysis> {
  return withFallback('analyzeGaps', mockGapAnalysis, async () => {
    const system = 'You are an expert educator. Analyze quiz answers to detect knowledge gaps. Return ONLY valid JSON.';
    const user = `Questions: ${JSON.stringify(questions)}
Student answers: ${JSON.stringify(answers)}

For each concept tested, determine if it is "mastered" or "weak" based on correctness. Return JSON: {"results":[{"conceptId":"c1","status":"mastered","explanation":"..."}],"summary":"..."}`;
    const raw = await callOpenAI(system, user);
    const parsed = extractJSON(raw) as GapAnalysis;
    return parsed;
  });
}

export async function generateLearningPath(
  concepts: Concept[],
  edges: DependencyEdge[],
  gapAnalysis: GapAnalysis,
  goalConceptId: string
): Promise<LearningPath> {
  return withFallback('generateLearningPath', mockLearningPath(goalConceptId), async () => {
    const system = 'You are an expert educator. Generate a personalized learning path. Return ONLY valid JSON.';
    const user = `Concepts: ${JSON.stringify(concepts)}
Dependencies: ${JSON.stringify(edges)}
Mastery: ${JSON.stringify(gapAnalysis)}
Goal concept ID: ${goalConceptId}

Compute the shortest prerequisite chain to the goal. Identify the first weak concept blocking progress. Explain WHY it must be learned first with evidence from the source.

Return JSON: {"goalConceptId":"...","goalConceptName":"...","steps":[{"conceptId":"c1","conceptName":"...","order":1,"isBlocking":false,"masteryStatus":"mastered","reason":"..."}],"blockingConceptId":"c2","whyExplanation":"evidence-based explanation"}`;
    const raw = await callOpenAI(system, user);
    const parsed = extractJSON(raw) as LearningPath;
    return parsed;
  });
}
