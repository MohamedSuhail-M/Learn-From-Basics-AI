import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Native buffer text parser for digital PDFs with zero native/canvas dependencies
function parsePdfBuffer(buffer: Buffer): string {
  const content = buffer.toString('latin1');
  const textChunks: string[] = [];

  // Extract Tj commands: (text) Tj
  const tjMatches = content.match(/\(([^)]+)\)\s*T[jJ]/g) || [];
  for (const m of tjMatches) {
    const raw = m.replace(/^[(]/, '').replace(/[)]\s*T[jJ]$/, '');
    if (raw.trim()) textChunks.push(raw);
  }

  // Extract TJ array commands: [(text) 10 (more)] TJ
  const arrayMatches = content.match(/\[(.*?)\]\s*TJ/g) || [];
  for (const arr of arrayMatches) {
    const innerMatches = arr.match(/\(([^)]+)\)/g) || [];
    for (const inner of innerMatches) {
      const clean = inner.replace(/[()]/g, '');
      if (clean.trim()) textChunks.push(clean);
    }
  }

  const result = textChunks.join(' ').replace(/\\([()\\])/g, '$1').trim();
  if (result.length > 40) {
    return result;
  }

  // Fallback: extract continuous ASCII blocks
  const asciiMatches = content.match(/[\x20-\x7E\t\n\r]{6,}/g) || [];
  return asciiMatches
    .filter((s) => !s.startsWith('/') && !s.includes('obj') && !s.includes('endobj'))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Native XML string parser for PPTX slide text
function parsePptxBuffer(buffer: Buffer): string {
  const raw = buffer.toString('utf-8');
  // Match standard PPTX slide text tags: <a:t>slide content</a:t>
  const tagMatches = raw.match(/<a:t>([^<]+)<\/a:t>/g) || [];
  if (tagMatches.length > 0) {
    return tagMatches
      .map((tag) => tag.replace(/<\/?a:t>/g, ''))
      .join(' ')
      .trim();
  }

  // Fallback: extract readable alphanumeric sequences
  const cleanMatches = raw.match(/[A-Za-z0-9 .,!?:;'"()\-\n]{5,}/g) || [];
  return cleanMatches
    .filter((chunk) => !chunk.includes('xml') && !chunk.includes('schemas'))
    .join(' ')
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const filename = file.name.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';

    if (filename.endsWith('.pdf')) {
      extractedText = parsePdfBuffer(buffer);
    } else if (filename.endsWith('.docx') || filename.endsWith('.doc')) {
      const docxResult = await mammoth.extractRawText({ buffer });
      extractedText = docxResult.value;
    } else if (filename.endsWith('.pptx') || filename.endsWith('.ppt')) {
      extractedText = parsePptxBuffer(buffer);
    } else if (filename.endsWith('.txt')) {
      extractedText = buffer.toString('utf-8');
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload PDF, DOCX, PPTX, or TXT.' },
        { status: 400 }
      );
    }

    const trimmed = extractedText.trim();
    // If text is below 50 characters, client triggers Tesseract OCR fallback
    const needsOcr = trimmed.length < 50;

    return NextResponse.json({
      text: trimmed,
      needsOcr,
      filename: file.name,
      characters: trimmed.length,
    });
  } catch (err: any) {
    console.error('[extract-text] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to extract text from document' },
      { status: 500 }
    );
  }
}