"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main style={{
      background: "#0a0a0f", minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,400&family=DM+Mono:wght@300&display=swap');`}</style>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "28px", color: "#c4a064", marginBottom: "24px" }}>✦</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 300, color: "#e8e4d9", marginBottom: "12px" }}>
          Welcome to <em style={{ color: "#c4a064" }}>EuroTrip AI</em>
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", color: "rgba(232,228,217,0.5)", marginBottom: "40px" }}>
          Sign in to start planning your European adventure
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/planner" })}
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            margin: "0 auto", padding: "14px 28px",
            background: "rgba(196,160,100,0.1)",
            border: "1px solid rgba(196,160,100,0.3)",
            color: "#e8e4d9", cursor: "pointer",
            fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "0.15em",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(196,160,100,0.18)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(196,160,100,0.1)")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          CONTINUE WITH GOOGLE
        </button>
      </div>
    </main>
  );
}