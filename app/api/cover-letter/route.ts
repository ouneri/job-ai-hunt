import { GoogleGenAI } from "@google/genai";

const geminiAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
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
