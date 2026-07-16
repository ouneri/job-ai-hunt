"use client";
import { useState, useEffect } from "react";

export default function TrackerPage() {
  const [bid, setBid] = useState<
    { id: number; name: string; title: string; status: string }[]
  >([]);
  const [nameCompany, setNameCompany] = useState("");
  const [post, setPost] = useState("");

  async function fetchData() {
    const response = await fetch("/api/applications");
    const data = await response.json();
    setBid(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-2xl border-2 border-white/15 p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            Трекер <span className="text-lime-400">заявок</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Все твои отклики в одном месте
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            placeholder="Название компании"
            type="text"
            onChange={(e) => setNameCompany(e.target.value)}
            value={nameCompany}
            className="flex-1 border-2 border-white/20 bg-black p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-400 transition-colors"
          />

          <input
            placeholder="Должность"
            value={post}
            onChange={(e) => setPost(e.target.value)}
            className="flex-1 border-2 border-white/20 bg-black p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-400 transition-colors"
          />

          <button
            onClick={async () => {
              try {
                const response = await fetch("/api/applications", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name: nameCompany, title: post }),
                });
                fetchData();
                console.log("Заявка успешно добавлена");
              } catch (error) {
                console.log(error);
                console.log("Ошибка при добавлении заявки");
              }
            }}
            className="border-2 border-lime-400 bg-lime-400 px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition-all hover:bg-black hover:text-lime-400 active:scale-95"
          >
            Добавить
          </button>
        </div>

        <div className="space-y-3">
          {bid.length === 0 && (
            <p className="text-sm text-white/40">Пока нет ни одной заявки</p>
          )}
          {bid.map((data) => (
            <div
              key={data.id}
              className="animate-[fadeInUp_0.4s_ease-out] flex items-center justify-between border-2 border-white/15 p-4"
            >
              <span className="font-bold uppercase text-white">
                {data.name}
              </span>
              <span className="text-white/60">{data.title}</span>

              <select
                value={data.status}
                onChange={async (e) => {
                  try {
                    const response = await fetch("/api/applications", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id: data.id,
                        status: e.target.value,
                      }),
                    });
                    fetchData();
                    return console.log("Статус заявки успешно изменен");
                  } catch (error) {
                    console.log(error);
                    console.log("Ошибка при изменении статуса  заявки");
                  }
                }}
                className="border-2 border-white/20 bg-black px-3 py-2 text-xs font-bold uppercase tracking-wide text-lime-400 focus:outline-none focus:border-lime-400 transition-colors cursor-pointer"
              >
                <option value="APPLIED" className="bg-black text-white">
                  Принят
                </option>
                <option value="INTERVIEW" className="bg-black text-white">
                  На рассмотрении
                </option>
                <option value="OFFER" className="bg-black text-white">
                  Оффер
                </option>
                <option value="REJECTED" className="bg-black text-white">
                  Отклонено
                </option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
