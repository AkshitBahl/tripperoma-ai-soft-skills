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
    desc: "Answer a few questions and our AI finds your perfect European destination — from hidden villages to iconic cities.",
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

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveIdx((i) => (i + 1) % destinations.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const placeholders = [
    "10 days in Italy, history lover, €2000 budget…",
    "Romantic weekend in Paris with my partner…",
    "Solo backpacking across Eastern Europe…",
    "Family trip to Spain, 2 kids, 2 weeks…",
  ];
  const [phIdx, setPhIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPhIdx((i) => (i + 1) % placeholders.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#e8e4d9] overflow-x-hidden font-serif">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');
        
        * { box-sizing: border-box; }
        body { font-family: 'Cormorant Garamond', Georgia, serif; }
        .mono { font-family: 'DM Mono', monospace; }

        .grain::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 100; opacity: 0.35;
        }

        .hero-glow {
          position: absolute;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(196,160,100,0.12) 0%, transparent 70%);
          border-radius: 50%;
          top: -200px; left: 50%; transform: translateX(-50%);
          pointer-events: none;
        }

        .fade-in { animation: fadeUp 0.9s ease forwards; opacity: 0; }
        .fade-in-1 { animation-delay: 0.1s; }
        .fade-in-2 { animation-delay: 0.3s; }
        .fade-in-3 { animation-delay: 0.5s; }
        .fade-in-4 { animation-delay: 0.7s; }
        .fade-in-5 { animation-delay: 0.9s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dest-card {
          transition: transform 0.4s ease, opacity 0.4s ease;
        }
        .dest-card:hover { transform: translateY(-6px); }

        .input-glow:focus {
          outline: none;
          box-shadow: 0 0 0 1px rgba(196,160,100,0.5), 0 0 30px rgba(196,160,100,0.1);
        }

        .line-deco {
          width: 40px; height: 1px;
          background: linear-gradient(90deg, rgba(196,160,100,0.8), transparent);
          display: inline-block;
          vertical-align: middle; margin-right: 12px;
        }

        .feature-card {
          border: 1px solid rgba(196,160,100,0.12);
          transition: border-color 0.3s, background 0.3s;
        }
        .feature-card:hover {
          border-color: rgba(196,160,100,0.35);
          background: rgba(196,160,100,0.04);
        }

        .cta-btn {
          background: linear-gradient(135deg, #c4a064, #a0794a);
          transition: opacity 0.2s, transform 0.2s;
        }
        .cta-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        .scroll-line {
          width: 1px; height: 60px;
          background: linear-gradient(to bottom, rgba(196,160,100,0.6), transparent);
          margin: 0 auto;
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .marquee-track {
          display: flex; gap: 48px; white-space: nowrap;
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <div className="grain" />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between"
        style={{ background: "linear-gradient(to bottom, rgba(10,10,15,0.95), transparent)" }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "22px" }}>✦</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 300, letterSpacing: "0.15em" }}>
            EUROTRIP <em>AI</em>
          </span>
        </div>
        <div className="flex items-center gap-8">
          {["Destinations", "Features", "How It Works"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="mono text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity hidden md:block">
              {item.toUpperCase()}
            </a>
          ))}
          <Link href="/planner">
            <button className="cta-btn mono text-xs tracking-widest px-5 py-2 text-[#0a0a0f] font-medium rounded-none">
              PLAN TRIP →
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
        <div className="hero-glow" />

        <div className="fade-in fade-in-1 mono text-xs tracking-[0.3em] opacity-50 mb-8"
          style={{ color: "#c4a064" }}>
          ◦ AI-POWERED EUROPEAN TRAVEL ◦
        </div>

        <h1 className="fade-in fade-in-2 relative"
          style={{ fontSize: "clamp(52px, 10vw, 110px)", fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.01em", maxWidth: "900px" }}>
          Your Europe,{" "}
          <span style={{ fontStyle: "italic", color: "#c4a064" }}>perfectly</span>
          <br />planned.
        </h1>

        <p className="fade-in fade-in-3 mt-8 opacity-60 max-w-md"
          style={{ fontSize: "18px", fontWeight: 300, lineHeight: 1.7 }}>
          Tell our AI your dream. Get a bespoke itinerary for anywhere in Europe — in seconds.
        </p>

        {/* Search Bar */}
        <div className="fade-in fade-in-4 mt-12 w-full max-w-2xl">
          <div className="flex gap-0" style={{ border: "1px solid rgba(196,160,100,0.3)" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholders[phIdx]}
              className="input-glow flex-1 bg-transparent px-6 py-4 text-[#e8e4d9] placeholder-opacity-30"
              style={{ fontSize: "16px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", outline: "none", color: "#e8e4d9" }}
              onKeyDown={(e) => e.key === "Enter" && window.location.assign("/planner")}
            />
            <Link href="/planner">
              <button className="cta-btn px-8 py-4 mono text-xs tracking-widest text-[#0a0a0f] font-medium whitespace-nowrap">
                START →
              </button>
            </Link>
          </div>
          <p className="mono text-xs opacity-30 mt-3 tracking-widest">
            PRESS ENTER OR CLICK START TO BEGIN YOUR JOURNEY
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="fade-in fade-in-5 absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="scroll-line" />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="py-5 overflow-hidden" style={{ borderTop: "1px solid rgba(196,160,100,0.1)", borderBottom: "1px solid rgba(196,160,100,0.1)", background: "rgba(196,160,100,0.03)" }}>
        <div className="marquee-track">
          {[...Array(2)].map((_, i) =>
            ["Paris", "Rome", "Barcelona", "Amsterdam", "Prague", "Vienna", "Lisbon", "Santorini", "Dubrovnik", "Florence", "Budapest", "Copenhagen"].map((city) => (
              <span key={`${city}-${i}`} className="mono text-xs tracking-widest opacity-40" style={{ color: "#c4a064" }}>
                {city.toUpperCase()} &nbsp;◦
              </span>
            ))
          )}
        </div>
      </div>

      {/* DESTINATIONS */}
      <section id="destinations" className="px-6 py-32 max-w-6xl mx-auto">
        <div className="mb-16">
          <div className="mono text-xs tracking-[0.3em] opacity-40 mb-4" style={{ color: "#c4a064" }}>
            <span className="line-deco" />01 / DESTINATIONS
          </div>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 300, letterSpacing: "-0.01em" }}>
            Where will you <em style={{ color: "#c4a064" }}>wander?</em>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {destinations.map((d, i) => (
            <div key={d.city}
              className="dest-card p-8 cursor-pointer"
              style={{
                border: `1px solid ${activeIdx === i ? "rgba(196,160,100,0.5)" : "rgba(196,160,100,0.1)"}`,
                background: activeIdx === i ? "rgba(196,160,100,0.06)" : "transparent",
                transition: "all 0.4s ease"
              }}
              onClick={() => setActiveIdx(i)}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>{d.emoji}</div>
              <div style={{ fontSize: "22px", fontWeight: 300 }}>{d.city}</div>
              <div className="mono text-xs opacity-40 mt-1 tracking-widest">{d.country.toUpperCase()}</div>
              <div className="mono text-xs mt-3 tracking-widest"
                style={{ color: "#c4a064", opacity: activeIdx === i ? 1 : 0.5 }}>
                {d.tag}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 py-24" style={{ background: "rgba(196,160,100,0.03)", borderTop: "1px solid rgba(196,160,100,0.08)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <div className="mono text-xs tracking-[0.3em] opacity-40 mb-4" style={{ color: "#c4a064" }}>
              <span className="line-deco" />02 / FEATURES
            </div>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 300 }}>
              Powered by <em style={{ color: "#c4a064" }}>intelligence.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.title} className="feature-card p-8">
                <div style={{ fontSize: "24px", color: "#c4a064", marginBottom: "16px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "22px", fontWeight: 400, marginBottom: "12px" }}>{f.title}</h3>
                <p className="opacity-60" style={{ fontSize: "16px", fontWeight: 300, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="px-6 py-32 max-w-4xl mx-auto">
        <div className="mb-16">
          <div className="mono text-xs tracking-[0.3em] opacity-40 mb-4" style={{ color: "#c4a064" }}>
            <span className="line-deco" />03 / HOW IT WORKS
          </div>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 300 }}>
            Three steps to your <em style={{ color: "#c4a064" }}>perfect trip.</em>
          </h2>
        </div>

        <div className="space-y-0">
          {[
            { n: "01", title: "Describe your trip", body: "Tell the AI where you want to go, for how long, your budget, interests, and travel style. Natural language — no forms." },
            { n: "02", title: "Get your itinerary", body: "Within seconds, receive a full day-by-day itinerary with restaurants, activities, transport tips, and cultural insights." },
            { n: "03", title: "Refine & explore", body: "Ask follow-up questions, swap activities, adjust the pace. Your itinerary evolves with you in real time." },
          ].map((step, i) => (
            <div key={step.n} className="flex gap-8 py-10"
              style={{ borderBottom: "1px solid rgba(196,160,100,0.1)" }}>
              <div className="mono text-xs tracking-widest opacity-30 pt-1 w-8 shrink-0"
                style={{ color: "#c4a064" }}>{step.n}</div>
              <div>
                <h3 style={{ fontSize: "26px", fontWeight: 300, marginBottom: "10px" }}>{step.title}</h3>
                <p className="opacity-60" style={{ fontSize: "16px", fontWeight: 300, lineHeight: 1.7 }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-6 py-32 text-center" style={{ background: "rgba(196,160,100,0.04)", borderTop: "1px solid rgba(196,160,100,0.1)" }}>
        <div className="mono text-xs tracking-[0.3em] opacity-40 mb-6" style={{ color: "#c4a064" }}>
          ◦ BEGIN YOUR JOURNEY ◦
        </div>
        <h2 style={{ fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 300, lineHeight: 1 }}>
          Europe is waiting<br />
          <em style={{ color: "#c4a064" }}>for you.</em>
        </h2>
        <p className="mt-6 opacity-50 max-w-sm mx-auto" style={{ fontSize: "18px", fontWeight: 300, lineHeight: 1.7 }}>
          Start planning your trip with AI — free, fast, and beautifully personal.
        </p>
        <Link href="/planner">
          <button className="cta-btn mt-10 mono text-sm tracking-widest px-12 py-4 text-[#0a0a0f] font-medium">
            START PLANNING →
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid rgba(196,160,100,0.1)" }}>
        <div className="flex items-center gap-2 opacity-50">
          <span>✦</span>
          <span className="mono text-xs tracking-widest">EUROTRIP AI — BUILT WITH CLAUDE</span>
        </div>
        <div className="mono text-xs opacity-30 tracking-widest">
          AI-POWERED TRAVEL PLANNING © 2025
        </div>
      </footer>
    </main>
  );
}