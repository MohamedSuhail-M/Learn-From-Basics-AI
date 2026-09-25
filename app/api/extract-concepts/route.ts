import { NextRequest, NextResponse } from 'next/server';
import { extractConcepts } from '@/lib/llm';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { sourceText } = await req.json();

    if (!sourceText || typeof sourceText !== 'string') {
      return NextResponse.json({ error: 'No source text provided' }, { status: 400 });
    }

    const concepts = await extractConcepts(sourceText);
    return NextResponse.json({ concepts });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to extract concepts';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
