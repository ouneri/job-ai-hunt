import { GoogleGenAI } from "@google/genai";

const geminiAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const LIMIT = 5;
const WINDOW_MS = 60000;
const requestLog = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
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
    const data = await request.json();
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    if (isRateLimited(ip)) {
      return Response.json(
        { text: "Слишком много запросов, попробуй позже" },
        { status: 429 },
      );
    }
    if (!data.textInterview)
      return Response.json(
        { text: " Вы ввепли пустое поле " },
        { status: 400 },
      );
    const res = await geminiAI.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: `Ты - профессиональный HR и тех-лид в компании, твоя задача проанализировать сегодняшний рынок и на основе предоставленных тебе данных
            составить подготовку к собеседованию по данной вакансии -- приблизительно нужно оценить то чем компания занимается какие вопросы могут задать на собеседовании и предоставить небольшой тест-блиц вопрос с вопросами и ответами на них в конце для подготовки к собеседованию
            Текст вакансии ${data.textInterview}
            !!ответь в формате Markdown, используя заголовки ##`,
            
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of res)
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
