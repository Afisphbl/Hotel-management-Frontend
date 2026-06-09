import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAiStaffChat } from "@/hooks/useAiStaffChat";

const QUICK_ACTIONS = [
  { label: "Today's Check-ins", prompt: "Show me today's check-ins and process them" },
  { label: "Today's Check-outs", prompt: "Show me today's check-outs and process them" },
  { label: "Pending Bookings", prompt: "List all pending and confirmed bookings" },
];

function MarkdownText({ text }: { text: string }) {
  // Simple inline markdown: bold, newlines
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => (
        <p key={i} className="text-sm leading-relaxed">
          {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j}>{part.slice(2, -2)}</strong>
            ) : (
              part
            )
          )}
        </p>
      ))}
    </div>
  );
}

export function AiStaffWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, loading, error, sendMessage, reset } = useAiStaffChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full shadow-lg flex items-center justify-center transition-all",
          "bg-[#0F1B2D] hover:bg-[#1a2d47] text-white",
          open && "rotate-90"
        )}
        aria-label="AI Staff Assistant"
      >
        {open ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden max-h-[70vh]">
          {/* Header */}
          <div className="bg-[#0F1B2D] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9973A]" />
              <span className="text-white text-sm font-semibold">Staff Assistant</span>
            </div>
            <button
              onClick={reset}
              className="text-white/50 hover:text-white transition-colors"
              title="Clear chat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Actions */}
          {messages.length === 0 && (
            <div className="p-3 border-b border-gray-100 flex flex-wrap gap-1.5 shrink-0">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  onClick={() => sendMessage(a.prompt)}
                  disabled={loading}
                  className="text-xs px-2.5 py-1 rounded-full bg-[#0F1B2D]/8 hover:bg-[#0F1B2D]/15 text-[#0F1B2D] border border-[#0F1B2D]/20 transition-colors disabled:opacity-50"
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <p className="text-xs text-gray-400 text-center mt-4">
                Ask me anything about bookings and rooms, or use a quick action above.
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2",
                    msg.role === "user"
                      ? "bg-[#0F1B2D] text-white text-sm"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  {msg.role === "user" ? (
                    <p className="text-sm">{msg.parts[0].text}</p>
                  ) : (
                    <MarkdownText text={msg.parts[0].text} />
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              </div>
            )}
            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex gap-2 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about bookings, rooms..."
              disabled={loading}
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#0F1B2D] disabled:opacity-50"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-[#0F1B2D] hover:bg-[#1a2d47] shrink-0 h-9 w-9"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
