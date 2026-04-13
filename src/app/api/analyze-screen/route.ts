import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const VISION_PROMPT = `看这张桌面截图，分析当前的场景、情绪和氛围。

然后推荐适合的背景音乐，输出格式：

1. 先用中文写 1-2 句场景描述（你看到了什么，感觉是什么氛围）
2. 然后输出 JSON 参数块：

\`\`\`json
{
  "prompts": [{"text": "英文音乐风格描述", "weight": 1.0}],
  "config": {
    "bpm": 120,
    "temperature": 1.1,
    "guidance": 4.0,
    "density": 0.5,
    "brightness": 0.5
  },
  "action": "play"
}
\`\`\`

规则：
- 如果是代码编辑器/终端 → 推荐 lofi, ambient, chillhop
- 如果是游戏画面 → 推荐 energetic, electronic, epic
- 如果是视频/电影 → 推荐 cinematic, orchestral
- 如果是社交媒体/聊天 → 推荐 pop, upbeat
- 如果是设计工具/创意软件 → 推荐 minimal, experimental, downtempo
- 如果是空桌面/壁纸 → 根据壁纸的色调和情绪来推荐
- prompts.text 必须用英文
- 根据画面亮暗调整 brightness，根据内容复杂度调整 density`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const { imageBase64 } = await request.json();
    if (!imageBase64) {
      return NextResponse.json({ error: 'imageBase64 is required' }, { status: 400 });
    }

    const genai = new GoogleGenAI({ apiKey });

    const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];
    let lastError = '';

    for (const model of models) {
      try {
        const response = await genai.models.generateContent({
          model,
          contents: [{
            role: 'user',
            parts: [
              { text: VISION_PROMPT },
              { inlineData: { mimeType: 'image/png', data: imageBase64 } },
            ],
          }],
        });
        const text = response.text ?? '';
        return NextResponse.json({ text, model });
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        if (lastError.includes('503') || lastError.includes('UNAVAILABLE') || lastError.includes('404') || lastError.includes('no longer available')) {
          continue;
        }
        return NextResponse.json({ error: lastError }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'All models unavailable: ' + lastError }, { status: 503 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
