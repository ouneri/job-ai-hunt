'use client';
import {useState} from 'react';
import Markdown from 'react-markdown';






export default function Home() {
   const [text, setText] = useState('');
   const [textRes, setTextRes] = useState('')
   const [loading, setLoading] = useState(false);




    

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Анализ вакансии
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Вставь текст вакансии — AI разберёт стек и требования
          </p>
        </div>

        <textarea
          placeholder="Введите текст вакансии"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full min-h-40 resize-y rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent p-4 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        />

        <button
          disabled={loading}
          onClick={  async () => {
            setLoading(true);
            const res = await fetch('/api/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text }),
            });
            const data = await res.json();
            setTextRes(data.text);
            setLoading(false)
          }}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          {loading ? "Анализирую...": "Анализировать"}
        </button>

        {textRes && (
          <div className="prose prose-neutral dark:prose-invert prose-sm max-w-none rounded-xl bg-neutral-50 dark:bg-neutral-800/60 p-5">
            <Markdown>{textRes}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}