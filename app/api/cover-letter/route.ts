import { GoogleGenAI } from "@google/genai";
import * as z from "zod";

const geminiAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const LIMIT = 5;
const WINDOW_MS = 60000;
const requestLog = new Map<string, { count: number; resetAt: number }>();

const CoverLetterSchema = z.object({
  vacancyText: z.string(),
  resumeText: z.string(),
});

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
    const parsed = CoverLetterSchema.safeParse(await request.json());

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
      contents: `Ты — помощник, который пишет сопроводительные письма для отклика на вакансии в IT.

                    Вот текст вакансии:
                    ${data.vacancyText}

                    Вот немного о кандидате (резюме/опыт):
                    ${data.resumeText}

                    Напиши сопроводительное письмо от первого лица, как будто его пишет сам кандидат.
                    Требования:
                    - Свяжи конкретный опыт кандидата с конкретными требованиями из вакансии, без общих фраз
                    - Длина — примерно 150-200 слов
                    - Тон уверенный, но не хвастливый, без клише вроде "командный игрок" и "быстро обучаюсь"
                    - Не придумывай факты о кандидате, которых нет в тексте о нём

                    !!ответь в формате Markdown, используя заголовки ##
`,
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
