import { NextRequest, NextResponse } from 'next/server';
import { detectDependencies } from '@/lib/llm';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { concepts, sourceText } = await req.json();

    if (!concepts || !Array.isArray(concepts)) {
      return NextResponse.json({ error: 'No concepts provided' }, { status: 400 });
    }

    const edges = await detectDependencies(concepts, sourceText || '');
    return NextResponse.json({ edges });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to detect dependencies';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
