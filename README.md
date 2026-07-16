# AI Job Hunt

Портфолио-проект: набор инструментов на базе Google Gemini для поиска работы, плюс трекер заявок с реальной базой данных.

🔗 **Живая версия:** [job-ai-hunt-xi.vercel.app](https://job-ai-hunt-xi.vercel.app/)

## Фичи

- **Анализ вакансий** — вставляешь текст вакансии, AI разбирает стек и требования
- **Сопроводительное письмо** — генерация письма под конкретную вакансию и резюме
- **Подготовка к собеседованию** — AI готовит вопросы и советы под вакансию
- **Трекер заявок** — список откликов с реальным сохранением в базе данных и сменой статуса (принят / на рассмотрении / оффер / отказ)

## Стек

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS
- [Google Gemini API](https://ai.google.dev/) (`@google/genai`) — для трёх AI-фич
- PostgreSQL ([Neon](https://neon.com)) + [Prisma](https://www.prisma.io/) — для трекера заявок
- Деплой на [Vercel](https://vercel.com)

## Запуск локально

```bash
npm install
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).

Понадобится `.env.local` с переменными `GEMINI_API_KEY` и `DATABASE_URL`.
