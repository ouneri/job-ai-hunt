"use client";
import { useState } from "react";
import Markdown from "react-markdown";
import { useAiRequest } from "../hooks/useAiRequest";


export default function СoverLetter() {
  const [resumeText, setResumeText] = useState("");
  const [vacancyText, setVacancyText] = useState("");

  const { result, loading, error, generate } = useAiRequest<{ resumeText: string; vacancyText: string }>("/api/cover-letter");

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-2xl border-2 border-white/15 p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            Сопроводительное <span className="text-lime-400">письмо</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Вставь вакансию и коротко о себе — AI напишет письмо под тебя
          </p>
        </div>

        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Коротко о себе и своём опыте"
          className="w-full min-h-32 resize-y border-2 border-white/20 bg-black p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-400 transition-colors"
        ></textarea>

        <textarea
          value={vacancyText}
          onChange={(e) => setVacancyText(e.target.value)}
          placeholder="Текст вакансии, на которую хочешь откликнуться"
          className="w-full min-h-40 resize-y border-2 border-white/20 bg-black p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-400 transition-colors"
        ></textarea>

        <button
          disabled={loading}
          onClick={async () => {
            await generate({ resumeText, vacancyText });
          }}
          className="border-2 border-lime-400 bg-lime-400 px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition-all hover:bg-black hover:text-lime-400 active:scale-95"
        >
          {loading ? "Генерация..." : "Сгенерировать письмо"}
        </button>

        {result && !error && (
          <div className="animate-[fadeInUp_0.4s_ease-out] border-2 border-white/15 p-5 prose prose-invert prose-sm max-w-none">
            <Markdown>{result}</Markdown>
          </div>
        )}

        {error && (
          <div className="animate-[fadeInUp_0.4s_ease-out] border-2 border-white/15 p-5 prose prose-invert prose-sm max-w-none">
            <p className="text-red-400">Ошибка при обработке запроса</p>
          </div>
        )}
      </div>
    </div>
  );
}
