import { useState } from "react";

export function useAiRequest<T>(endpoint: string) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function generate(payload: T) {
    try {
      setLoading(true);
      setError(false);
      setResult("");
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const {value, done } = await reader.read();
        if(done) break;
        setResult((prev) => prev + decoder.decode(value))
      }

    } catch (error) {
      setError(true);
      console.log(error);
      setResult("Ошибка при обработке запроса");
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, error, generate };
}
