"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Send,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Wallet,
  Search,
  PieChart,
  Shield,
  AlertTriangle,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/format";

interface Message {
  role: "user" | "assistant";
  content: string;
  thinking?: string;
}

const SUGGESTIONS = [
  { icon: Search, text: "What's the safety score of UNI token?", color: "text-emerald-400" },
  { icon: Wallet, text: "Show me the top whale movements on Ethereum in the last 24h", color: "text-purple-400" },
  { icon: PieChart, text: "Analyze my portfolio risk for 0xf2d5...E34A", color: "text-amber-400" },
  { icon: Shield, text: "Is this contract a honeypot? 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", color: "text-cyan-400" },
  { icon: AlertTriangle, text: "Alert me when any whale accumulates more than 100K ENA", color: "text-rose-400" },
  { icon: Gift, text: "Check if I'm eligible for EigenLayer and zkSync airdrops", color: "text-violet-400" },
];

export default function ChatPage() {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showThinking, setShowThinking] = useState<Record<number, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Add empty assistant message for streaming
    setMessages((prev) => [...prev, { role: "assistant", content: "", thinking: "" }]);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";
      let assistantThinking = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("event: thinking")) {
            // next data line is thinking
          } else if (line.startsWith("event: content")) {
            // next data line is content
          } else if (line.startsWith("data: ")) {
            try {
              const json = JSON.parse(line.slice(6));
              const lastEvent = lines[lines.indexOf(line) - 1];
              if (lastEvent?.startsWith("event: thinking")) {
                assistantThinking += json.text || "";
              } else {
                assistantContent += json.text || json.content || "";
              }
            } catch {
              // Skip malformed data
            }
          }
        }

        // Update the last message
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantContent,
            thinking: assistantThinking || undefined,
          };
          return updated;
        });
      }

      // If no content came through, show a fallback
      if (!assistantContent && !assistantThinking) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "I'm connected and ready. The AI agent will process your on-chain queries once the backend is configured with a valid API key.",
          };
          return updated;
        });
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Unable to connect to the AI agent. Please verify the API configuration is set up correctly.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 flex flex-col min-h-screen lg:min-h-auto pb-20 lg:pb-0">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-6 py-16">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6">
                <Sparkles size={24} className="text-cyan-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2 tracking-tight">
                On-Chain AI Agent
              </h2>
              <p className="text-sm text-[#606068] text-center mb-10 max-w-md leading-relaxed">
                Ask complex blockchain questions in natural language. Get real-time data,
                analysis, and actionable insights powered by advanced reasoning.
              </p>

              {/* Suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(s.text)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border border-white/[0.06] bg-[#111113] text-left hover:border-white/[0.1] hover:bg-[#151518] transition-colors",
                      `animate-fade-in stagger-${i + 1}`
                    )}
                  >
                    <s.icon size={15} className={cn(s.color, "mt-0.5 flex-shrink-0")} />
                    <span className="text-xs text-[#909098] leading-relaxed">{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "animate-fade-in",
                    msg.role === "user" ? "flex justify-end" : ""
                  )}
                >
                  {msg.role === "user" ? (
                    <div className="max-w-[80%] px-4 py-2.5 rounded-xl bg-cyan-600/15 border border-cyan-500/20 text-sm text-[#e0e0e8]">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="group">
                      {/* Thinking block */}
                      {msg.thinking && (
                        <div className="mb-3">
                          <button
                            onClick={() => setShowThinking((prev) => ({ ...prev, [i]: !prev[i] }))}
                            className="flex items-center gap-2 text-xs text-[#505058] hover:text-[#707078] transition-colors mb-2"
                          >
                            <Loader2 size={12} className={showThinking[i] ? "animate-spin" : ""} />
                            <span>Reasoning process</span>
                          </button>
                          {showThinking[i] && (
                            <div className="pl-4 border-l border-white/[0.06] text-xs text-[#505058] font-mono leading-relaxed whitespace-pre-wrap">
                              {msg.thinking}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className="text-sm text-[#c0c0c8] leading-relaxed whitespace-pre-wrap">
                        {msg.content || (
                          <div className="flex items-center gap-1.5 text-[#505058]">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40 thinking-dot" />
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40 thinking-dot" />
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40 thinking-dot" />
                          </div>
                        )}
                      </div>

                      {/* Copy button */}
                      {msg.content && (
                        <button
                          onClick={() => copyToClipboard(msg.content, i)}
                          className="mt-2 flex items-center gap-1.5 text-xs text-[#404048] hover:text-[#707078] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedIdx === i ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedIdx === i ? "Copied" : "Copy"}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-white/[0.06] bg-[#0c0c0e]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-end gap-2 bg-[#111113] border border-white/[0.08] rounded-xl px-4 py-3 focus-within:border-white/[0.14] transition-colors">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about any token, wallet, or protocol..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-[#404048] resize-none outline-none max-h-32"
                style={{ fieldSizing: "content" } as React.CSSProperties}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg transition-colors flex-shrink-0",
                  input.trim() && !isLoading
                    ? "bg-cyan-600 text-white hover:bg-cyan-500"
                    : "bg-white/[0.04] text-[#404048]"
                )}
              >
                {isLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
              </button>
            </div>
            <p className="text-[10px] text-[#303038] text-center mt-2">
              ScnrMx AI Agent — Responses are AI-generated and not financial advice
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
