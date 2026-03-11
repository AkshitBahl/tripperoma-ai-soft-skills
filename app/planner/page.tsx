"use client";

import { useSession, signIn, signOut } from "next-auth/react"; // ✅ single import
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "7 days in Italy, love food & art, €1500 budget",
  "Romantic weekend in Paris, staying near Montmartre",
  "10-day Balkans road trip, off the beaten path",
  "Solo trip through Portugal, budget backpacker",
  "Family holiday in Spain, 2 kids aged 8 & 11",
  "Greek island hopping for 2 weeks in summer",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 6, height: 6,
            borderRadius: "50%",
            background: "#c4a064",
            opacity: 0.7,
            animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  const renderContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("# ")) {
        return <h2 key={i} style={{ fontSize: "22px", fontWeight: 400, color: "#c4a064", marginTop: "16px", marginBottom: "8px", fontFamily: "'Cormorant Garamond', serif" }}>{line.slice(2)}</h2>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={i} style={{ fontSize: "18px", fontWeight: 400, color: "#e8e4d9", marginTop: "14px", marginBottom: "6px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>{line.slice(3)}</h3>;
      }
      if (line.startsWith("### ")) {
        return <h4 key={i} style={{ fontSize: "15px", fontWeight: 400, color: "#c4a064", marginTop: "10px", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", opacity: 0.9 }}>{line.slice(4).toUpperCase()}</h4>;
      }
      if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
        return <p key={i} style={{ fontWeight: 600, color: "#e8e4d9", margin: "6px 0" }}>{line.slice(2, -2)}</p>;
      }
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return (
          <div key={i} style={{ display: "flex", gap: "10px", margin: "4px 0", paddingLeft: "4px" }}>
            <span style={{ color: "#c4a064", opacity: 0.7, flexShrink: 0, marginTop: "2px" }}>◦</span>
            <span style={{ opacity: 0.85, lineHeight: 1.6 }}>{line.slice(2)}</span>
          </div>
        );
      }
      if (line.match(/^\d+\./)) {
        const num = line.match(/^(\d+)\.\s/)?.[1];
        const rest = line.replace(/^\d+\.\s/, "");
        return (
          <div key={i} style={{ display: "flex", gap: "12px", margin: "6px 0" }}>
            <span style={{ color: "#c4a064", fontFamily: "'DM Mono', monospace", fontSize: "12px", flexShrink: 0, marginTop: "3px", opacity: 0.7 }}>
              {String(num).padStart(2, "0")}
            </span>
            <span style={{ opacity: 0.85, lineHeight: 1.6 }}>{rest}</span>
          </div>
        );
      }
      if (line.trim() === "" || line.trim() === "---") {
        return <div key={i} style={{ height: "8px" }} />;
      }
      return (
        <p key={i} style={{ margin: "4px 0", lineHeight: 1.75, opacity: 0.85 }}>
          {line}
        </p>
      );
    });
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: "20px",
      animation: "fadeSlideIn 0.35s ease forwards",
    }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          border: "1px solid rgba(196,160,100,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", color: "#c4a064",
          flexShrink: 0, marginRight: "10px", marginTop: "2px",
        }}>✦</div>
      )}
      <div style={{
        maxWidth: isUser ? "70%" : "85%",
        padding: isUser ? "12px 18px" : "18px 22px",
        background: isUser
          ? "linear-gradient(135deg, rgba(196,160,100,0.18), rgba(196,160,100,0.08))"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${isUser ? "rgba(196,160,100,0.3)" : "rgba(255,255,255,0.07)"}`,
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "16px",
        color: "#e8e4d9",
        lineHeight: 1.7,
      }}>
        {isUser ? (
          <p style={{ margin: 0, fontStyle: "italic" }}>{msg.content}</p>
        ) : (
          <div>{renderContent(msg.content)}</div>
        )}
      </div>
    </div>
  );
}

export default function PlannerPage() {
  // ✅ ALL hooks declared first, before any conditional returns
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ✅ useEffect also before any conditional returns
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ✅ Conditional returns AFTER all hooks
  if (status === "loading") return <div style={{ background: "#0a0a0f", minHeight: "100vh" }} />;
  if (!session) {
    signIn();
    return null;
  }

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    setInput("");
    setStarted(true);
    setError("");

    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Request failed");
      }

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", flexDirection: "column", color: "#e8e4d9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Cormorant Garamond', Georgia, serif; }

        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(196,160,100,0); }
          50% { box-shadow: 0 0 20px 2px rgba(196,160,100,0.15); }
        }

        textarea { resize: none; font-family: 'Cormorant Garamond', Georgia, serif; }
        textarea:focus { outline: none; }
        textarea::placeholder { color: rgba(232,228,217,0.3); font-style: italic; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(196,160,100,0.2); border-radius: 2px; }

        .send-btn {
          background: linear-gradient(135deg, #c4a064, #a0794a);
          transition: opacity 0.2s, transform 0.15s;
          cursor: pointer; border: none;
        }
        .send-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
        .send-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .suggestion-chip {
          border: 1px solid rgba(196,160,100,0.2);
          background: transparent;
          color: rgba(232,228,217,0.6);
          transition: all 0.2s ease;
          cursor: pointer;
          font-family: 'Cormorant Garamond', serif;
        }
        .suggestion-chip:hover {
          border-color: rgba(196,160,100,0.5);
          color: #e8e4d9;
          background: rgba(196,160,100,0.06);
        }

        .grain-overlay {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.3;
        }
      `}</style>

      <div className="grain-overlay" />

      {/* TOP NAV */}
      <nav style={{
        padding: "16px 28px",
        borderBottom: "1px solid rgba(196,160,100,0.12)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(10,10,15,0.95)",
        position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(12px)",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", color: "#e8e4d9" }}>
          <span style={{ color: "#c4a064", fontSize: "16px" }}>✦</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 300, letterSpacing: "0.15em" }}>
            EUROTRIP <em>AI</em>
          </span>
        </Link>

        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", opacity: 0.4, color: "#c4a064" }}>
          ◦ TRIP PLANNER ◦
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {messages.length > 0 && (
            <button
              onClick={() => { setMessages([]); setStarted(false); setError(""); }}
              style={{
                fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.15em",
                color: "rgba(232,228,217,0.4)", background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                padding: "6px 14px", cursor: "pointer",
              }}
            >
              NEW TRIP
            </button>
          )}
          {/* ✅ User avatar + sign out */}
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="avatar"
              style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(196,160,100,0.4)" }}
            />
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.15em",
              color: "rgba(232,228,217,0.4)", background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)", padding: "6px 14px", cursor: "pointer",
            }}
          >
            SIGN OUT
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: "820px", width: "100%", margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 1 }}>

        {/* WELCOME STATE */}
        {!started && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 0 40px", animation: "fadeIn 0.6s ease" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", border: "1px solid rgba(196,160,100,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", color: "#c4a064", marginBottom: "24px", animation: "pulseGlow 3s ease-in-out infinite" }}>
              ✦
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 300, textAlign: "center", lineHeight: 1.1, marginBottom: "14px" }}>
              Welcome back, <em style={{ color: "#c4a064" }}>{session.user?.name?.split(" ")[0] ?? "traveller"}</em>
            </h1>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 300, opacity: 0.5, textAlign: "center", maxWidth: "400px", lineHeight: 1.7, marginBottom: "40px" }}>
              Describe your dream trip in plain language — destination, duration, budget, interests — and I'll craft your perfect itinerary.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", maxWidth: "620px" }}>
              {SUGGESTIONS.map((s) => (
                <button key={s} className="suggestion-chip" style={{ padding: "8px 16px", fontSize: "14px", fontStyle: "italic" }}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CHAT MESSAGES */}
        {started && (
          <div style={{ flex: 1, overflowY: "auto", paddingTop: "32px", paddingBottom: "24px" }}>
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(196,160,100,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#c4a064", flexShrink: 0, marginRight: "10px", marginTop: "2px" }}>✦</div>
                <div style={{ padding: "14px 20px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
                  <TypingDots />
                </div>
              </div>
            )}
            {error && (
              <div style={{ padding: "14px 18px", border: "1px solid rgba(220,80,80,0.3)", background: "rgba(220,80,80,0.06)", color: "#e88", fontFamily: "'DM Mono', monospace", fontSize: "12px", marginBottom: "20px", lineHeight: 1.6 }}>
                ⚠ {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* INPUT BOX */}
        <div style={{
          position: "sticky", bottom: 0, paddingBottom: "24px", paddingTop: "16px",
          background: "linear-gradient(to top, #0a0a0f 80%, transparent)",
        }}>
          <div style={{
            border: "1px solid rgba(196,160,100,0.25)",
            background: "rgba(255,255,255,0.02)",
            display: "flex", alignItems: "flex-end",
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your dream European trip…"
              rows={2}
              style={{
                flex: 1, background: "transparent", border: "none",
                padding: "16px 20px", fontSize: "17px", color: "#e8e4d9",
                lineHeight: 1.6, maxHeight: "140px",
              }}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{ padding: "14px 22px", alignSelf: "stretch", display: "flex", alignItems: "center", justifyContent: "center", minWidth: "56px" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0a0f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", opacity: 0.25, textAlign: "center", marginTop: "10px", letterSpacing: "0.15em" }}>
            ENTER TO SEND · SHIFT+ENTER FOR NEW LINE · POWERED BY GROQ
          </p>
        </div>
      </div>
    </div>
  );
}