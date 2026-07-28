import { useReducer } from "react";

type Action =
  | { type: "start" }
  | { type: "chunk"; payload: string }
  | { type: "done" }
  | { type: "error" };

type State = {
  status: "idle" | "loading" | "success" | "error";
  result: string;
};

export function requestReducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return { status: "loading", result: "" };
    case "chunk":
      return { status: "loading", result: state.result + action.payload };
    case "done":
      return { status: "success", result: state.result };
    case "error":
      return { status: "error", result: "Ошибка запроса" };
  }
}

export function useAiRequest<T>(endpoint: string) {
  const [state, dispatch] = useReducer(requestReducer, {
    status: "idle",
    result: "",
  });

  async function generate(payload: T) {
    try {
      dispatch({ type: "start" });
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        dispatch({ type: "chunk", payload: decoder.decode(value) });
      }
      dispatch({ type: "done" });
    } catch (error) {
      console.log(error);
      dispatch({ type: "error" });
    }
  }

  return {
    result: state.result,
    loading: state.status === "loading",
    error: state.status === "error",
    generate,
  };
}
