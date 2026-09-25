import { NextRequest, NextResponse } from 'next/server';
import { analyzeGaps } from '@/lib/llm';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { questions, answers } = await req.json();

    if (!questions || !answers) {
      return NextResponse.json({ error: 'Missing questions or answers' }, { status: 400 });
    }

    const analysis = await analyzeGaps(questions, answers);
    return NextResponse.json(analysis);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to analyze gaps';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
