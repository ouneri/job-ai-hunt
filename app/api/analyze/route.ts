import { GoogleGenAI } from "@google/genai";
import * as z from "zod";

const geminiAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const requestLog = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5;
const WINDOW_MS = 60_000;

// zod

const AnalyzeSchema = z.object({
  text: z.string(),
});

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestLog.get(ip);

  if (!entry || now > entry.resetAt) {
    requestLog.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= LIMIT) {
    return true;
  }

  entry.count++;
  return false;
}
export async function POST(request: Request) {
  try {
    const parsed = AnalyzeSchema.safeParse(await request.json());

    if (!parsed.success) {
      return Response.json({ text: "Вы ввели пустое поле" }, { status: 400 });
    }

    const data = parsed.data;
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";

    if (isRateLimited(ip)) {
      return Response.json(
        { text: "Слишком много запросов, попробуй позже" },
        { status: 429 },
      );
    }

    const result = await geminiAI.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: `Ты — помощник для соискателей в IT. Ниже текст вакансии.
                        Разбери его и структурированно ответь:
                        1. Какой технологический стек требуется (языки, фреймворки, инструменты)
                        2. Какой уровень подразумевается (junior/middle/senior)
                        3. Ключевые требования и обязанности — коротко, одним-двумя предложениями
                        4. На что стоит обратить внимание при отклике на эту вакансию

                        !!ответь в формате Markdown, используя заголовки ## для каждого из четырёх пунктов!!

                        Текст вакансии:
                        ${data.text}`,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result)
          controller.enqueue(encoder.encode(chunk.text));
        controller.close();
      },
    });
    return new Response(stream);
  } catch (error) {
    console.log(error);
    return Response.json(
      { text: "Ошибка при обработке запроса" },
      { status: 500 },
    );
  }
}

