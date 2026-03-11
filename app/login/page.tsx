"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailAuth = async () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (mode === "register" && !name) { setError("Please enter your name."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);

    if (mode === "register") {
      // Create account
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed."); setLoading(false); return; }
    }

    // Sign in
    const result = await signIn("credentials", {
      email, password, redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(mode === "login" ? "Invalid email or password." : "Account created but sign-in failed. Try logging in.");
    } else {
      router.push("/planner");
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(196,160,100,0.2)",
    padding: "13px 16px",
    color: "#e8e4d9",
    fontSize: "16px",
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic" as const,
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Cormorant Garamond', serif", color: "#e8e4d9" }}>
      <style>{`
        .auth-input:focus { border-color: rgba(196,160,100,0.55) !important; }
        .auth-input::placeholder { color: rgba(232,228,217,0.28); }
        .tab-btn { transition: all 0.2s; cursor: pointer; background: transparent; border: none; }
        .google-btn { transition: all 0.2s; cursor: pointer; }
        .google-btn:hover { background: rgba(196,160,100,0.14) !important; }
        .submit-btn { transition: opacity 0.2s, transform 0.15s; cursor: pointer; border: none; }
        .submit-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .switch-link { color: #c4a064; cursor: pointer; text-decoration: underline; }
        .switch-link:hover { opacity: 0.8; }
      `}</style>

      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "24px", color: "#c4a064", marginBottom: "16px" }}>✦</div>
          <h1 style={{ fontSize: "36px", fontWeight: 300, margin: "0 0 8px" }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p style={{ fontSize: "16px", fontWeight: 300, opacity: 0.45, margin: 0 }}>
            {mode === "login" ? "Sign in to continue planning" : "Start your World adventure"}
          </p>
        </div>

        {/* Mode tabs */}
        <div style={{ display: "flex", marginBottom: "28px", borderBottom: "1px solid rgba(196,160,100,0.15)" }}>
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              className="tab-btn"
              onClick={() => { setMode(m); setError(""); }}
              style={{
                flex: 1, padding: "10px", fontFamily: "'DM Mono', monospace",
                fontSize: "10px", letterSpacing: "0.2em",
                color: mode === m ? "#c4a064" : "rgba(232,228,217,0.35)",
                borderBottom: `2px solid ${mode === m ? "#c4a064" : "transparent"}`,
                marginBottom: "-1px",
              }}
            >
              {m === "login" ? "SIGN IN" : "REGISTER"}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: "12px 16px", background: "rgba(220,80,80,0.08)", border: "1px solid rgba(220,80,80,0.25)", color: "#e88", fontFamily: "'DM Mono', monospace", fontSize: "11px", marginBottom: "20px", lineHeight: 1.5 }}>
            ⚠ {error}
          </div>
        )}

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
          {mode === "register" && (
            <input
              className="auth-input"
              style={inputStyle}
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            className="auth-input"
            style={inputStyle}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
          />
          <input
            className="auth-input"
            style={inputStyle}
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
          />
        </div>

        {/* Submit */}
        <button
          className="submit-btn"
          onClick={handleEmailAuth}
          disabled={loading}
          style={{
            width: "100%", padding: "14px",
            background: "linear-gradient(135deg, #c4a064, #a0794a)",
            color: "#0a0a0f", fontFamily: "'DM Mono', monospace",
            fontSize: "11px", letterSpacing: "0.22em", marginBottom: "20px",
          }}
        >
          {loading ? "PLEASE WAIT..." : mode === "login" ? "SIGN IN →" : "CREATE ACCOUNT →"}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(196,160,100,0.15)" }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", opacity: 0.35, letterSpacing: "0.15em" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(196,160,100,0.15)" }} />
        </div>

        {/* Google */}
        <button
          className="google-btn"
          onClick={() => signIn("google", { callbackUrl: "/planner" })}
          style={{
            width: "100%", padding: "13px 20px",
            background: "rgba(196,160,100,0.07)",
            border: "1px solid rgba(196,160,100,0.22)",
            color: "#e8e4d9", display: "flex", alignItems: "center",
            justifyContent: "center", gap: "12px",
            fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em",
            boxSizing: "border-box",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          CONTINUE WITH GOOGLE
        </button>

        {/* Switch mode */}
        <p style={{ textAlign: "center", fontSize: "15px", fontWeight: 300, opacity: 0.45, marginTop: "28px" }}>
          {mode === "login" ? (
            <>Don't have an account?{" "}
              <span className="switch-link" onClick={() => { setMode("register"); setError(""); }}>Register here</span>
            </>
          ) : (
            <>Already have an account?{" "}
              <span className="switch-link" onClick={() => { setMode("login"); setError(""); }}>Sign in</span>
            </>
          )}
        </p>

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Link href="/" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.18em", opacity: 0.25, color: "#e8e4d9", textDecoration: "none" }}>
            ← BACK TO HOME
          </Link>
        </div>

      </div>
    </div>
  );
}