import { useState, useCallback } from "react";
import { api } from "@/lib/api";

export interface ChatMessage {
  role: "user" | "model";
  parts: [{ text: string }];
}

export function useAiStaffChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: ChatMessage = { role: "user", parts: [{ text }] };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("ai/staff-chat", {
        message: text,
        history: messages, // send history before this message
      });
      const aiMsg: ChatMessage = {
        role: "model",
        parts: [{ text: res.response }],
      };
      setMessages([...nextHistory, aiMsg]);
    } catch (err: any) {
      setError(err.message || "Failed to get response");
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, reset };
}
