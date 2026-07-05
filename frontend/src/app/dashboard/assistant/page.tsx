"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: string;
  confidence?: number;
  suggestions?: string[];
  timestamp: Date;
}

const quickActions = [
  "What's my account balance?",
  "Help me open a new account",
  "Show my financial health",
  "Recommend investment options",
  "Activate UPI payments",
  "What life events detected?",
];

const languages = [
  { code: "english", label: "English" },
  { code: "hindi", label: "हिंदी" },
  { code: "gujarati", label: "ગુજરાતી" },
  { code: "marathi", label: "मराठी" },
  { code: "tamil", label: "தமிழ்" },
  { code: "telugu", label: "తెలుగు" },
  { code: "bengali", label: "বাংলা" },
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `👋 **Welcome to SBI SmartLife AI Assistant!**\n\nI'm your intelligent banking companion, powered by 6 specialized AI agents:\n\n🎯 **Acquisition** — Account opening & KYC\n📱 **Adoption** — Digital banking setup\n💡 **Engagement** — Offers & rewards\n❤️ **Wellness** — Financial health\n🔮 **Life Events** — Proactive predictions\n🤝 **Relationship** — Personal banker\n\nI speak **7 languages** and can help with anything banking-related.\n\n**How can I help you today?**`,
      agent: "AI Relationship Manager",
      confidence: 1.0,
      suggestions: quickActions.slice(0, 4),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("english");
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language }),
      });
      const data = await res.json();
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        agent: data.agent_used,
        confidence: data.confidence,
        suggestions: data.suggestions || [],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      // Fallback for when backend is not running
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I received your message: "${text}"\n\n🔧 **Note:** The backend API is not currently running. To see full AI responses, start the backend with:\n\n\`docker-compose up\`\n\nOr manually:\n\`cd backend && uvicorn app.main:app --reload\`\n\nThe 6 AI agents are ready to assist you with banking queries, financial planning, and more!`,
        agent: "System",
        confidence: 1.0,
        suggestions: ["How to start the backend?", "View demo features", "Explore dashboard"],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)", gap: 0 }}>
      {/* Chat Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 0", marginBottom: 16,
      }}>
        <div>
          <h2 style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 700 }}>💬 AI Banking Assistant</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Powered by 6 specialized agents • Multi-lingual support</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{
              padding: "8px 16px", borderRadius: "var(--radius-md)",
              background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)", fontSize: 13, cursor: "pointer",
            }}
          >
            {languages.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflow: "auto", padding: "0 4px",
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            animation: "fadeIn 0.3s ease",
          }}>
            <div style={{
              maxWidth: "75%",
              padding: "16px 20px",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: msg.role === "user"
                ? "var(--gradient-primary)"
                : "var(--bg-card)",
              border: msg.role === "user" ? "none" : "1px solid var(--border-subtle)",
            }}>
              {msg.role === "assistant" && msg.agent && (
                <div style={{
                  fontSize: 11, color: "var(--sbi-blue-300)", marginBottom: 8,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{
                    padding: "2px 8px", borderRadius: "var(--radius-full)",
                    background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)",
                  }}>
                    🤖 {msg.agent}
                  </span>
                  {msg.confidence && (
                    <span style={{ color: "var(--text-muted)" }}>
                      {(msg.confidence * 100).toFixed(0)}% confidence
                    </span>
                  )}
                </div>
              )}
              <div style={{
                fontSize: 14, lineHeight: 1.7, color: "var(--text-primary)",
                whiteSpace: "pre-wrap",
              }}
              dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br/>')
                  .replace(/\|(.*?)\|/g, '<code>$1</code>')
              }}
              />
              
              {/* Suggestions */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {msg.suggestions.map((s, i) => (
                    <button key={i} onClick={() => sendMessage(s)} style={{
                      padding: "6px 14px", borderRadius: "var(--radius-full)",
                      background: "rgba(57, 73, 171, 0.15)", border: "1px solid rgba(57, 73, 171, 0.3)",
                      color: "var(--sbi-blue-300)", fontSize: 12, cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 8, textAlign: "right" }}>
                {mounted ? msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "16px 24px", borderRadius: "16px 16px 16px 4px",
              background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
            }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: "var(--sbi-blue-400)",
                    animation: `float 1.4s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div style={{ padding: "12px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {quickActions.map((action, i) => (
          <button key={i} onClick={() => sendMessage(action)} style={{
            padding: "8px 16px", borderRadius: "var(--radius-full)",
            background: "var(--bg-card)", border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)", fontSize: 12, cursor: "pointer",
            transition: "all 0.2s ease",
          }}>
            {action}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        display: "flex", gap: 12, padding: "16px 0",
        borderTop: "1px solid var(--border-subtle)",
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask me anything about banking..."
          style={{
            flex: 1, padding: "14px 20px",
            borderRadius: "var(--radius-lg)",
            background: "var(--bg-card)", border: "1px solid var(--border-medium)",
            color: "var(--text-primary)", fontSize: 14,
            outline: "none",
          }}
        />
        <button onClick={() => sendMessage(input)} className="btn-primary" style={{
          padding: "14px 28px", borderRadius: "var(--radius-lg)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          Send ↗
        </button>
      </div>
    </div>
  );
}
