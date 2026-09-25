import { NextRequest, NextResponse } from 'next/server';
import { generateQuiz } from '@/lib/llm';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { concepts } = await req.json();

    if (!concepts || !Array.isArray(concepts)) {
      return NextResponse.json({ error: 'No concepts provided' }, { status: 400 });
    }

    const questions = await generateQuiz(concepts);
    return NextResponse.json({ questions });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate quiz';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
