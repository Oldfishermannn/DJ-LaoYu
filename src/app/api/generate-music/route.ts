import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const { prompt, model } = await request.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }

    const modelName = model === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    let text = '';
    let audioBase64 = '';
    let mimeType = '';

    for (const part of parts) {
      if (part.text) {
        text += part.text + '\n';
      } else if (part.inlineData) {
        audioBase64 = part.inlineData.data ?? '';
        mimeType = part.inlineData.mimeType ?? 'audio/mp3';
      }
    }

    return NextResponse.json({ text: text.trim(), audioBase64, mimeType, model: modelName });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[generate-music] error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
