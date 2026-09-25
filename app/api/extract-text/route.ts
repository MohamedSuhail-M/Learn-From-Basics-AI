import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');
  const data = new Uint8Array(buffer);
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => 'str' in item ? item.str : '').join(' ') + '\n';
  }
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    let text = '';
    let needsOcr = false;

    if (fileName.endsWith('.txt')) {
      text = buffer.toString('utf-8');
    } else if (fileName.endsWith('.pdf')) {
      text = await extractPdfText(buffer);
      if (!text || text.trim().length < 50) {
        needsOcr = true;
      }
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a PDF or TXT file.' },
        { status: 400 }
      );
    }

    if (needsOcr) {
      return NextResponse.json({
        text: '',
        fileName: file.name,
        needsOcr: true,
        message: 'This PDF appears to be scanned (no extractable text). The app will try OCR next.',
      });
    }

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract enough text from the file. Try another file or use the sample material.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text, fileName: file.name, needsOcr: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to parse file';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
