import { NextRequest, NextResponse } from 'next/server';
import { generateLearningPath } from '@/lib/llm';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { concepts, edges, gapAnalysis, goalConceptId } = await req.json();

    if (!concepts || !edges || !gapAnalysis || !goalConceptId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const path = await generateLearningPath(concepts, edges, gapAnalysis, goalConceptId);
    return NextResponse.json(path);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate learning path';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
