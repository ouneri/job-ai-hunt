'use client'
import { useState } from "react"
import Markdown from "react-markdown"


export default function InterviewPage() {

    const [textInterview, setTextInterview] = useState('')
    const [textAiRes, setTextAiRes] = useState('')
    




    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="w-full max-w-2xl border-2 border-white/15 p-8 space-y-6">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-white">
                        Подготовка к <span className="text-lime-400">собеседованию</span>
                    </h1>
                    <p className="mt-2 text-sm text-white/50">
                        Вставь текст вакансии — AI подскажет вероятные вопросы и подготовит тест-блиц
                    </p>
                </div>

                <textarea
                    value={textInterview}
                    placeholder="Введите ссылку или требования к вашей вакансии"
                    onChange={(e) => setTextInterview(e.target.value)}
                    className="w-full min-h-40 resize-y border-2 border-white/20 bg-black p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-400 transition-colors"
                ></textarea>

                <button
                    onClick={async () => {
                        const res = await fetch('/api/interview-prep', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ textInterview })

                        })
                        const data = await res.json();
                        setTextAiRes(data.text)
                    }}
                    className="border-2 border-lime-400 bg-lime-400 px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition-all hover:bg-black hover:text-lime-400 active:scale-95"
                >
                    Подготовиться
                </button>

                {textAiRes && (
                    <div className="animate-[fadeInUp_0.4s_ease-out] border-2 border-white/15 p-5 prose prose-invert prose-sm max-w-none">
                        <Markdown>{textAiRes}</Markdown>
                    </div>
                )}
            </div>
        </div>
    )
}
        
    
