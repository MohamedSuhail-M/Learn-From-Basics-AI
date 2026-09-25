import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { documentText, topic } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    const prompt = `Analyze this course syllabus and convert it into a structured Coursera-style curriculum with 3-4 sequential modules.

SYLLABUS CONTENT:
"""
${documentText.slice(0, 7000)}
"""

REQUIREMENTS:
1. Divide the syllabus into logical modules.
2. For each module, generate 2-3 specific lessons with reading guides.
3. Attach a module assessment to verify prerequisite mastery before progressing.
4. Output strict JSON matching this schema:
{
  "courseTitle": "Extracted Course Title",
  "modules": [
    {
      "moduleNumber": 1,
      "title": "Module Title",
      "description": "Short module summary",
      "lessons": [
        {
          "id": "m1-l1",
          "title": "Lesson Title",
          "durationMinutes": 15,
          "type": "reading",
          "contentMarkdown": "Concise lesson summary based on the document excerpt..."
        }
      ],
      "assessment": {
        "title": "Module 1 Mastery Quiz",
        "passingScorePercent": 75,
        "prerequisiteConcepts": ["Concept A", "Concept B"]
      }
    }
  ]
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    const data = await res.json();
    const course = JSON.parse(data.candidates[0].content.parts[0].text);
    return NextResponse.json({ course });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}