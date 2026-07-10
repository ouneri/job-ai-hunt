import { GoogleGenAI } from "@google/genai";



const geminiAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});




export async function POST(request: Request) {
    try {
        const data = await request.json();
        const result = await geminiAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Ты — помощник для соискателей в IT. Ниже текст вакансии.
                        Разбери его и структурированно ответь:
                        1. Какой технологический стек требуется (языки, фреймворки, инструменты)
                        2. Какой уровень подразумевается (junior/middle/senior)
                        3. Ключевые требования и обязанности — коротко, одним-двумя предложениями
                        4. На что стоит обратить внимание при отклике на эту вакансию

                        Текст вакансии:
                        ${data.text}`
        })
        return Response.json({ text: result.text })


    } catch (error) {
        console.log(error)
        return Response.json ({ text: "Ошибка при обработке запроса" }, { status: 500 })

    }
}


