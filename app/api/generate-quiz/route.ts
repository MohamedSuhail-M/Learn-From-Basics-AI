import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { documentText, topic } = await req.json();

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured in .env.local' },
        { status: 500 }
      );
    }

    const cleanContent =
      documentText && documentText.trim().length > 20
        ? documentText.slice(0, 8000)
        : topic || 'Foundational Computing Systems & Algorithms';

    const prompt = `Analyze this course material and generate 4 sequential prerequisite multiple-choice questions.

MATERIAL:
"""
${cleanContent}
"""

INSTRUCTIONS:
1. Ground every question strictly in the provided material.
2. For "sourceQuote", extract an exact quote, definition, or formula from the text.
3. For "sourceContext", identify the specific module, section header, or topic from the text.
4. For "learningResource", provide a reliable external learning link (official documentation, Wikipedia, or OpenCourseWare) relevant to that prerequisite.
5. Return ONLY a valid JSON array matching this schema (no markdown, no code blocks):
[
  {
    "id": 1,
    "concept": "Name of Concept",
    "question": "Question evaluating this concept?",
    "options": ["Correct Answer", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Why this answer is correct based on the text.",
    "sourceQuote": "Verbatim quote from the material.",
    "sourceContext": "Section / Chapter / Topic reference",
    "prerequisites": [],
    "learningResource": {
      "title": "MDN Web Docs / Wikipedia / MIT OCW",
      "url": "https://en.wikipedia.org/wiki/..."
    }
  }
]`;

    const modelCandidates = [
      'gemini-3.8-flash',
      'gemini-3.5-flash-lite',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
    ];

    let rawText = '';
    for (const model of modelCandidates) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.3,
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (rawText) break;
        }
      } catch {
        continue;
      }
    }

    if (!rawText) {
      throw new Error('Inference failed across candidate models.');
    }

    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const questions = JSON.parse(cleaned);

    return NextResponse.json({ questions });
  } catch (err: any) {
    console.error('[generate-quiz error]:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}