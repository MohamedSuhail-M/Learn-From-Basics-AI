import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { documentText, topic, moduleTitle, moduleNumber } = await req.json();

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured in environment variables' },
        { status: 500 }
      );
    }

    const cleanContent =
      documentText && documentText.trim().length > 20
        ? documentText.slice(0, 8000)
        : topic || 'Foundational Computing Systems & Algorithms';

    const prompt = `Analyze this specific course module and generate 4 sequential prerequisite multiple-choice questions testing ONLY concepts from this module.

MODULE INFO:
Title: ${moduleTitle || 'Core Module'} (Module #${moduleNumber || 1})
Course Track: ${topic || 'Computer Science'}

MODULE CURRICULUM & LESSON CONTENT:
"""
${cleanContent}
"""

INSTRUCTIONS:
1. Every question MUST evaluate foundational principles specifically described in this module text.
2. For "sourceQuote", extract an exact quote, definition, or formula from the text.
3. For "sourceContext", identify the specific module sub-lesson or topic.
4. For "learningResource", provide a reliable external learning link (MDN, Wikipedia, arXiv, or official documentation) to study that prerequisite.
5. Return ONLY a valid JSON array matching this schema (no markdown formatting, no code blocks):
[
  {
    "id": 1,
    "concept": "Specific Concept Name",
    "question": "Question evaluating this module concept?",
    "options": ["Correct Answer", "Distractor B", "Distractor C", "Distractor D"],
    "correctIndex": 0,
    "explanation": "Why this answer is correct based on the module text.",
    "sourceQuote": "Verbatim quote or formula from the module text.",
    "sourceContext": "${moduleTitle || 'Module'} - Lesson Concept",
    "prerequisites": [],
    "learningResource": {
      "title": "Topic Study Reference",
      "url": "https://en.wikipedia.org/wiki/..."
    }
  }
]`;

    const modelCandidates = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
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
                temperature: 0.25,
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