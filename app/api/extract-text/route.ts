import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = '';

    // If it's a plain text or markdown file, parse directly
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      extractedText = buffer.toString('utf-8');
    } else {
      // For PDFs, PPTX, or Images: Use Gemini 1.5's native multimodal OCR engine
      const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

      if (apiKey) {
        const base64Data = buffer.toString('base64');
        const mimeType = file.type || 'application/pdf';

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: 'Extract and transcribe all technical concepts, syllabus definitions, code, formulas, and explanations from this document. Provide raw text only.',
                    },
                    {
                      inlineData: {
                        mimeType: mimeType,
                        data: base64Data,
                      },
                    },
                  ],
                },
              ],
            }),
          }
        );

        const geminiJson = await geminiRes.json();
        extractedText = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }
    }

    // Fallback if file was empty or couldn't be transcribed
    if (!extractedText.trim()) {
      extractedText = `Syllabus material covering ${file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')}`;
    }

    return NextResponse.json({
      text: extractedText,
      fileName: file.name,
      charCount: extractedText.length,
    });
  } catch (error: any) {
    console.error('[extract-text] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to extract text' },
      { status: 500 }
    );
  }
}