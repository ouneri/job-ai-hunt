'use client';
import {useState, useRef, useEffect} from 'react';
import Markdown from 'react-markdown';
import {useAiRequest} from './hooks/useAiRequest';







export default function Home() {
   const [text, setText] = useState('');
   const inputRef = useRef<HTMLTextAreaElement>(null);
   const {result, loading, error, generate} = useAiRequest<{ text: string }>('/api/analyze');


   useEffect(() => {
    inputRef.current?.focus()

   },[]);
    

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-2xl border-2 border-white/15 p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            Анализ <span className="text-lime-400">вакансии</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Вставь текст вакансии — AI разберёт стек и требования
          </p>
        </div>

        <textarea
          placeholder="Введите текст вакансии"
          value={text}
          ref={inputRef}
          onChange={(e) => setText(e.target.value)}
          className="w-full min-h-40 resize-y border-2 border-white/20 bg-black p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-400 transition-colors"
        />

        <button
          disabled={loading}
          onClick={  async () => {
              await generate({ text });
          }}
          className="border-2 border-lime-400 bg-lime-400 px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition-all hover:bg-black hover:text-lime-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className={loading ? "inline-block animate-[pulseAccent_1s_ease-in-out_infinite]" : ""}>
            {loading ? "Анализирую..." : "Анализировать"}
          </span>
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