"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const destinations = [
  { city: "Paris", country: "France", emoji: "🗼", tag: "Romance" },
  { city: "Santorini", country: "Greece", emoji: "🏛️", tag: "Beauty" },
  { city: "Prague", country: "Czech Republic", emoji: "🏰", tag: "History" },
  { city: "Amalfi", country: "Italy", emoji: "🍋", tag: "Coast" },
  { city: "Barcelona", country: "Spain", emoji: "🎨", tag: "Culture" },
  { city: "Amsterdam", country: "Netherlands", emoji: "🚲", tag: "Canals" },
];

const features = [
  {
    icon: "✦",
    title: "AI Itinerary Builder",
    desc: "Describe your dream trip in plain language. Claude crafts a detailed day-by-day plan tailored to your style, budget, and interests.",
  },
  {
    icon: "◈",
    title: "Smart Destination Match",
    desc: "Answer a few questions and our AI finds your perfect Worldan destination — from hidden villages to iconic cities.",
  },
  {
    icon: "⬡",
    title: "Local Insider Tips",
    desc: "Skip the tourist traps. Get AI-generated local knowledge: neighborhoods, food, transport, culture and etiquette.",
  },
  {
    icon: "◎",
    title: "Adaptive Replanning",
    desc: "Plans change. Just ask — 'make day 3 more relaxed' or 'add a day trip from Florence' — and your itinerary updates instantly.",
  },
];

const placeholders = [
  "10 days in Italy, history lover, €2000 budget…",
  "Romantic weekend in Paris with my partner…",
  "Solo backpacking across Eastern World…",
  "Family trip to Spain, 2 kids, 2 weeks…",
];

const marqueeItems = ["Paris", "Rome", "Barcelona", "Amsterdam", "Prague", "Vienna", "Lisbon", "Santorini", "Dubrovnik", "Florence", "Budapest", "Copenhagen"];

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [phIdx, setPhIdx] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => setActiveIdx((i) => (i + 1) % destinations.length), 2500);
    const t2 = setInterval(() => setPhIdx((i) => (i + 1) % placeholders.length), 3000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        .fade1 { animation: fadeUp 0.8s ease 0.1s both; }
        .fade2 { animation: fadeUp 0.8s ease 0.3s both; }
        .fade3 { animation: fadeUp 0.8s ease 0.5s both; }
        .fade4 { animation: fadeUp 0.8s ease 0.7s both; }
        .fade5 { animation: fadeUp 0.8s ease 0.9s both; }

        .nav-link {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.25em;
          color: rgba(232,228,217,0.55);
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #e8e4d9; }

        .cta-btn {
          background: linear-gradient(135deg, #c4a064, #a0794a);
          border: none;
          color: #0a0a0f;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          padding: 11px 24px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          white-space: nowrap;
          text-decoration: none;
          display: inline-block;
        }
        .cta-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        .search-wrap {
          display: flex;
          border: 1px solid rgba(196,160,100,0.3);
          max-width: 620px;
          width: 100%;
        }
        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 15px 20px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-style: italic;
          color: #e8e4d9;
        }
        .search-input::placeholder { color: rgba(232,228,217,0.3); }

        .dest-card {
          padding: 28px;
          border: 1px solid rgba(196,160,100,0.1);
          cursor: pointer;
          transition: all 0.35s ease;
        }
        .dest-card:hover { transform: translateY(-4px); }

        .feature-card {
          padding: 32px;
          border: 1px solid rgba(196,160,100,0.1);
          transition: border-color 0.3s, background 0.3s;
        }
        .feature-card:hover {
          border-color: rgba(196,160,100,0.3);
          background: rgba(196,160,100,0.04);
        }

        .step-row {
          display: flex;
          gap: 32px;
          padding: 32px 0;
          border-bottom: 1px solid rgba(196,160,100,0.1);
          align-items: flex-start;
        }

        .marquee-track {
          display: flex;
          gap: 40px;
          white-space: nowrap;
          animation: marquee 22s linear infinite;
        }

        .scroll-line {
          width: 1px;
          height: 52px;
          background: linear-gradient(to bottom, rgba(196,160,100,0.6), transparent);
          margin: 0 auto;
          animation: scrollPulse 2s ease-in-out infinite;
        }

        .section-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.3em;
          color: #c4a064;
          opacity: 0.55;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-label::before {
          content: '';
          display: inline-block;
          width: 28px;
          height: 1px;
          background: rgba(196,160,100,0.6);
        }
      `}</style>

      <div style={{ background: "#0a0a0f", color: "#e8e4d9", fontFamily: "'Cormorant Garamond', serif", overflowX: "hidden" }}>

        {/* GRAIN OVERLAY */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.35,
        }} />

        {/* NAV */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          padding: "18px 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "linear-gradient(to bottom, rgba(10,10,15,0.97), rgba(10,10,15,0))",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#c4a064", fontSize: "18px" }}>✦</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 300, letterSpacing: "0.18em", color: "#e8e4d9" }}>
              TRIPPEROMA <em>AI</em>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <a href="#destinations" className="nav-link">DESTINATIONS</a>
            <a href="#features" className="nav-link">FEATURES</a>
            <a href="#how-it-works" className="nav-link">HOW IT WORKS</a>
            <Link href="/planner" className="cta-btn">PLAN TRIP →</Link>
          </div>
        </nav>

        {/* HERO */}
        <section style={{
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
          padding: "120px 32px 80px",
          position: "relative",
        }}>
          {/* glow */}
          <div style={{
            position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
            width: "600px", height: "600px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,160,100,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div className="fade1" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.35em", color: "#c4a064", opacity: 0.7, marginBottom: "28px" }}>
            ◦ AI-POWERED TRAVEL PLANNER ◦
          </div>

          <h1 className="fade2" style={{ fontSize: "clamp(52px, 9vw, 108px)", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.01em", maxWidth: "900px", margin: "0 0 24px" }}>
            Your World Trip,{" "}
            <em style={{ color: "#c4a064" }}>perfectly</em>
            <br />planned.
          </h1>

          <p className="fade3" style={{ fontSize: "18px", fontWeight: 300, opacity: 0.55, maxWidth: "420px", lineHeight: 1.75, margin: "0 0 44px" }}>
            Tell our AI your dream. Get a bespoke itinerary for anywhere in the world — in seconds.
          </p>

          <div className="fade4 search-wrap">
            <input
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholders[phIdx]}
              onKeyDown={(e) => e.key === "Enter" && window.location.assign("/planner")}
            />
            <Link href="/planner" className="cta-btn" style={{ padding: "15px 28px", display: "flex", alignItems: "center" }}>
              START →
            </Link>
          </div>

          <div className="fade5" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", opacity: 0.25, letterSpacing: "0.18em", marginTop: "14px" }}>
            PRESS ENTER OR CLICK START TO BEGIN YOUR JOURNEY
          </div>

          <div style={{ position: "absolute", bottom: "40px", left: "50%" , transform: "translateX(-50%)"}}>
            <div className="scroll-line" />
          </div>
        </section>

        {/* MARQUEE */}
        <div style={{
          padding: "18px 0", overflow: "hidden",
          borderTop: "1px solid rgba(196,160,100,0.1)",
          borderBottom: "1px solid rgba(196,160,100,0.1)",
          background: "rgba(196,160,100,0.025)",
        }}>
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((city, i) => (
              <span key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.28em", color: "#c4a064", opacity: 0.45 }}>
                {city.toUpperCase()} &nbsp;◦
              </span>
            ))}
          </div>
        </div>

        {/* DESTINATIONS */}
        <section id="destinations" style={{ padding: "100px 48px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "52px" }}>
            <div className="section-label">01 / DESTINATIONS</div>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 300, margin: 0 }}>
              Where will you <em style={{ color: "#c4a064" }}>wander?</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
            {destinations.map((d, i) => (
              <div
                key={d.city}
                className="dest-card"
                style={{
                  borderColor: activeIdx === i ? "rgba(196,160,100,0.45)" : "rgba(196,160,100,0.1)",
                  background: activeIdx === i ? "rgba(196,160,100,0.06)" : "transparent",
                }}
                onClick={() => setActiveIdx(i)}
              >
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{d.emoji}</div>
                <div style={{ fontSize: "22px", fontWeight: 300 }}>{d.city}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", opacity: 0.4, marginTop: "4px", letterSpacing: "0.15em" }}>{d.country.toUpperCase()}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "#c4a064", opacity: activeIdx === i ? 1 : 0.45, marginTop: "10px", letterSpacing: "0.12em" }}>
                  {d.tag}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" style={{
          padding: "100px 48px",
          background: "rgba(196,160,100,0.025)",
          borderTop: "1px solid rgba(196,160,100,0.08)",
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ marginBottom: "52px" }}>
              <div className="section-label">02 / FEATURES</div>
              <h2 style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 300, margin: 0 }}>
                Powered by <em style={{ color: "#c4a064" }}>intelligence.</em>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" }}>
              {features.map((f) => (
                <div key={f.title} className="feature-card">
                  <div style={{ fontSize: "22px", color: "#c4a064", marginBottom: "16px" }}>{f.icon}</div>
                  <h3 style={{ fontSize: "22px", fontWeight: 400, margin: "0 0 12px" }}>{f.title}</h3>
                  <p style={{ fontSize: "16px", fontWeight: 300, opacity: 0.6, lineHeight: 1.75, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" style={{ padding: "100px 48px", maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ marginBottom: "52px" }}>
            <div className="section-label">03 / HOW IT WORKS</div>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 300, margin: 0 }}>
              Three steps to your <em style={{ color: "#c4a064" }}>perfect trip.</em>
            </h2>
          </div>

          {[
            { n: "01", title: "Describe your trip", body: "Tell the AI where you want to go, for how long, your budget, interests, and travel style. Natural language — no forms." },
            { n: "02", title: "Get your itinerary", body: "Within seconds, receive a full day-by-day itinerary with restaurants, activities, transport tips, and cultural insights." },
            { n: "03", title: "Refine & explore", body: "Ask follow-up questions, swap activities, adjust the pace. Your itinerary evolves with you in real time." },
          ].map((step) => (
            <div key={step.n} className="step-row">
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#c4a064", opacity: 0.45, letterSpacing: "0.1em", paddingTop: "4px", width: "28px", flexShrink: 0 }}>
                {step.n}
              </div>
              <div>
                <h3 style={{ fontSize: "26px", fontWeight: 300, margin: "0 0 10px" }}>{step.title}</h3>
                <p style={{ fontSize: "16px", fontWeight: 300, opacity: 0.6, lineHeight: 1.75, margin: 0 }}>{step.body}</p>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section style={{
          padding: "100px 48px",
          textAlign: "center",
          background: "rgba(196,160,100,0.03)",
          borderTop: "1px solid rgba(196,160,100,0.1)",
        }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.35em", color: "#c4a064", opacity: 0.55, marginBottom: "24px" }}>
            ◦ BEGIN YOUR JOURNEY ◦
          </div>
          <h2 style={{ fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 300, lineHeight: 1, margin: "0 0 20px" }}>
            World is waiting<br /><em style={{ color: "#c4a064" }}>for you.</em>
          </h2>
          <p style={{ fontSize: "18px", fontWeight: 300, opacity: 0.5, maxWidth: "360px", margin: "0 auto 40px", lineHeight: 1.75 }}>
            Start planning your trip with AI — free, fast, and beautifully personal.
          </p>
          <Link href="/planner" className="cta-btn" style={{ fontSize: "12px", padding: "16px 48px" }}>
            START PLANNING →
          </Link>
        </section>

        {/* FOOTER */}
        <footer style={{
          padding: "28px 48px",
          borderTop: "1px solid rgba(196,160,100,0.1)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: 0.4 }}>
            <span style={{ color: "#c4a064" }}>✦</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.18em" }}>Tripperoma AI — BUILT WITH GROQ</span>
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", opacity: 0.25, letterSpacing: "0.15em" }}>
            AI-POWERED TRAVEL PLANNING © 2025
          </div>
        </footer>

      </div>
    </>
  );
}