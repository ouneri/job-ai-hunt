import { GoogleGenAI } from "@google/genai";

const geminiAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const res = await geminiAI.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: `Ты - профессиональный HR и тех-лид в компании, твоя задача проанализировать сегодняшний рынок и на основе предоставленных тебе данных
            составить подготовку к собеседованию по данной вакансии -- приблизительно нужно оценить то чем компания занимается какие вопросы могут задать на собеседовании и предоставить небольшой тест-блиц вопрос с вопросами и ответами на них в конце для подготовки к собеседованию
            Текст вакансии ${data.textInterview}`,
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
