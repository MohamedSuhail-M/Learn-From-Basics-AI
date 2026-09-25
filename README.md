# Concept Dependency Learning Engine

Upload course material (PDF or TXT), and the AI extracts concepts, builds a prerequisite dependency graph, gives a diagnostic quiz, detects knowledge gaps, and generates a personalized learning path that explains **why** each concept must be learned first — with evidence quoted from the uploaded material.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template
cp .env.local.example .env.local

# 3. Add your OpenAI API key to .env.local (optional — see below)
#    Open .env.local and paste your key after the = sign

# 4. Run the dev server
npm run dev
```

## How MOCK_MODE Works

The app has a `MOCK_MODE` flag in `lib/llm.ts`:

- **No API key present** → `MOCK_MODE = true` → all LLM calls return hardcoded sample data. The full UI works end-to-end with zero configuration. Perfect for demos.
- **API key present** → `MOCK_MODE = false` → all LLM calls hit the real OpenAI API.
- **API key present but call fails** → automatically falls back to mock data with a console warning and an amber banner in the UI. The demo never crashes.

## How to Switch from Mock to Real API Calls

Edit **one file**: `lib/llm.ts`

The flag is on line 12:

```typescript
const MOCK_MODE = !process.env.OPENAI_API_KEY;
```

To go live, either:

1. **Add a key** (recommended): Add `OPENAI_API_KEY=sk-...` to `.env.local` and restart the dev server. The flag auto-detects it.
2. **Force real calls**: Change the flag to `const MOCK_MODE = false;` (requires a key in `.env.local`).
3. **Force mock mode**: Change the flag to `const MOCK_MODE = true;` (ignores the key, always uses demo data).

## Features

- **Upload**: Drag-and-drop PDF or TXT, or use pre-loaded sample material (Data Structures chapter)
- **OCR fallback**: If a PDF has no extractable text (scanned image), the app automatically runs Tesseract OCR client-side
- **Concept Graph**: Interactive react-flow graph with color-coded relationship edges (prerequisite, builds-on, related, example-of) and confidence scores
- **Diagnostic Quiz**: 5 multiple-choice questions, each tied to a concept
- **Gap Analysis**: Per-concept mastery status (mastered / weak) with explanations
- **Learning Path**: Shortest prerequisite chain to your goal concept, with the first blocking concept highlighted and an evidence-based "why" explanation
- **Collapsible evidence**: Each path step has a collapsible detail showing the source text evidence
- **Reset Demo**: Reset button in the header clears all state and returns to upload

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui components
- react-flow for graph visualization
- pdfjs-dist for PDF text extraction
- tesseract.js for OCR fallback
- OpenAI API (gpt-4o-mini) via a single `lib/llm.ts` helper

## File Structure

```
lib/
  llm.ts              ← LLM helper (MOCK_MODE flag + all API calls)
  mock-data.ts        ← Hardcoded sample data for demo mode
  types.ts            ← Shared TypeScript types
  sample-material.ts  ← Pre-loaded Data Structures chapter
  graph-utils.ts      ← Graph traversal utilities

app/api/
  extract-text/       ← PDF/TXT text extraction (server-side)
  extract-concepts/   ← AI concept extraction
  detect-dependencies/← AI dependency detection
  generate-quiz/      ← AI quiz generation
  analyze-gaps/       ← AI gap analysis from quiz answers
  generate-path/      ← AI personalized learning path

components/steps/
  upload-step.tsx     ← Drag-and-drop upload + OCR fallback
  graph-step.tsx      ← Concept graph with react-flow
  quiz-step.tsx       ← Diagnostic quiz
  results-step.tsx    ← Gap analysis results + goal selection
  path-step.tsx       ← Learning path with collapsible evidence
```
