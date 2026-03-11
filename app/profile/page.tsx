"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const INTERESTS_OPTIONS = [
  "Food & Wine", "History & Culture", "Art & Museums", "Hiking & Nature",
  "Architecture", "Beaches", "Nightlife", "Shopping", "Photography",
  "Music & Festivals", "Local Markets", "Religious Sites",
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    travelStatus: "",
    numberOfKids: 0,
    kidsAges: "",
    petFriendly: false,
    budgetStyle: "",
    travelPace: "",
    interests: [] as string[],
    mobilityNeeds: "none",
    dietaryNeeds: "none",
  });

  // Load existing profile
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((r) => r.json())
        .then((data) => {
          if (data) {
            setForm({
              travelStatus: data.travelStatus ?? "",
              numberOfKids: data.numberOfKids ?? 0,
              kidsAges: data.kidsAges ?? "",
              petFriendly: data.petFriendly ?? false,
              budgetStyle: data.budgetStyle ?? "",
              travelPace: data.travelPace ?? "",
              interests: data.interests ? data.interests.split(", ") : [],
              mobilityNeeds: data.mobilityNeeds ?? "none",
              dietaryNeeds: data.dietaryNeeds ?? "none",
            });
          }
          setLoading(false);
        });
    }
  }, [status, router]);

  const toggle = (key: string, value: string | boolean | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleInterest = (interest: string) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        interests: form.interests.join(", "),
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (status === "loading" || loading) {
    return <div style={{ background: "#0a0a0f", minHeight: "100vh" }} />;
  }

  const chip = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        padding: "8px 18px", fontSize: "14px", cursor: "pointer",
        fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
        border: `1px solid ${active ? "rgba(196,160,100,0.7)" : "rgba(196,160,100,0.2)"}`,
        background: active ? "rgba(196,160,100,0.12)" : "transparent",
        color: active ? "#e8e4d9" : "rgba(232,228,217,0.5)",
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  );

  const label = (text: string) => (
    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.2em", color: "#c4a064", opacity: 0.8, marginBottom: "12px" }}>
      {text}
    </div>
  );

  const section = (title: string, children: React.ReactNode) => (
    <div style={{ marginBottom: "40px", paddingBottom: "40px", borderBottom: "1px solid rgba(196,160,100,0.1)" }}>
      {label(title)}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>{children}</div>
    </div>
  );

  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", color: "#e8e4d9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; }
        input[type=number] { -moz-appearance: textfield; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      {/* NAV */}
      <nav style={{ padding: "16px 28px", borderBottom: "1px solid rgba(196,160,100,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(10,10,15,0.95)", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", color: "#e8e4d9" }}>
          <span style={{ color: "#c4a064" }}>✦</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 300, letterSpacing: "0.15em" }}>EUROTRIP <em>AI</em></span>
        </Link>
        <Link href="/planner" style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(232,228,217,0.4)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.08)", padding: "6px 14px" }}>
          ← BACK TO PLANNER
        </Link>
      </nav>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "60px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "52px" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.3em", color: "#c4a064", opacity: 0.6, marginBottom: "16px" }}>◦ YOUR TRAVEL PROFILE ◦</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 300, lineHeight: 1.1 }}>
            Tell us about<br /><em style={{ color: "#c4a064" }}>how you travel</em>
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 300, opacity: 0.5, marginTop: "14px", lineHeight: 1.7 }}>
            This helps our AI tailor every itinerary specifically to you — your group, pace, budget, and needs.
          </p>
        </div>

        {/* WHO ARE YOU TRAVELLING WITH */}
        {section("01 — WHO ARE YOU TRAVELLING WITH?",
          <>
            {[
              { val: "single", label: "Solo" },
              { val: "couple", label: "Couple" },
              { val: "family", label: "Family" },
              { val: "group", label: "Group" },
            ].map(({ val, label: l }) => chip(l, form.travelStatus === val, () => toggle("travelStatus", val)))}
          </>
        )}

        {/* CHILDREN */}
        {section("02 — CHILDREN",
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: form.numberOfKids > 0 ? "20px" : "0" }}>
              {[0, 1, 2, 3, 4, "5+"].map((n) => {
                const val = n === "5+" ? 5 : n as number;
                return chip(String(n), form.numberOfKids === val, () => toggle("numberOfKids", val));
              })}
            </div>
            {form.numberOfKids > 0 && (
              <div style={{ marginTop: "16px" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(196,160,100,0.6)", marginBottom: "8px" }}>
                  AGES (e.g. 3, 7, 12)
                </div>
                <input
                  type="text"
                  value={form.kidsAges}
                  onChange={(e) => toggle("kidsAges", e.target.value)}
                  placeholder="e.g. 4, 8, 14"
                  style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(196,160,100,0.2)",
                    padding: "10px 16px", color: "#e8e4d9", fontSize: "15px",
                    fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
                    width: "200px", outline: "none",
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* TRAVELLING WITH PETS */}
        {section("03 — TRAVELLING WITH PETS?",
          <>
            {chip("Yes, pet-friendly please", form.petFriendly === true, () => toggle("petFriendly", true))}
            {chip("No pets", form.petFriendly === false, () => toggle("petFriendly", false))}
          </>
        )}

        {/* BUDGET STYLE */}
        {section("04 — BUDGET STYLE",
          <>
            {chip("🎒 Backpacker", form.budgetStyle === "backpacker", () => toggle("budgetStyle", "backpacker"))}
            {chip("🏨 Mid-range", form.budgetStyle === "mid-range", () => toggle("budgetStyle", "mid-range"))}
            {chip("✨ Luxury", form.budgetStyle === "luxury", () => toggle("budgetStyle", "luxury"))}
          </>
        )}

        {/* TRAVEL PACE */}
        {section("05 — TRAVEL PACE",
          <>
            {chip("🌿 Slow & relaxed", form.travelPace === "slow", () => toggle("travelPace", "slow"))}
            {chip("⚖️ Balanced", form.travelPace === "moderate", () => toggle("travelPace", "moderate"))}
            {chip("⚡ See everything", form.travelPace === "packed", () => toggle("travelPace", "packed"))}
          </>
        )}

        {/* INTERESTS */}
        <div style={{ marginBottom: "40px", paddingBottom: "40px", borderBottom: "1px solid rgba(196,160,100,0.1)" }}>
          {label("06 — INTERESTS (SELECT ALL THAT APPLY)")}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {INTERESTS_OPTIONS.map((interest) =>
              chip(interest, form.interests.includes(interest), () => toggleInterest(interest))
            )}
          </div>
        </div>

        {/* MOBILITY */}
        {section("07 — MOBILITY NEEDS",
          <>
            {chip("No restrictions", form.mobilityNeeds === "none", () => toggle("mobilityNeeds", "none"))}
            {chip("Limited walking", form.mobilityNeeds === "limited-walking", () => toggle("mobilityNeeds", "limited-walking"))}
            {chip("Wheelchair user", form.mobilityNeeds === "wheelchair", () => toggle("mobilityNeeds", "wheelchair"))}
          </>
        )}

        {/* DIETARY */}
        {section("08 — DIETARY REQUIREMENTS",
          <>
            {[
              { val: "none", label: "No restrictions" },
              { val: "vegetarian", label: "Vegetarian" },
              { val: "vegan", label: "Vegan" },
              { val: "halal", label: "Halal" },
              { val: "kosher", label: "Kosher" },
              { val: "gluten-free", label: "Gluten-free" },
            ].map(({ val, label: l }) => chip(l, form.dietaryNeeds === val, () => toggle("dietaryNeeds", val)))}
          </>
        )}

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%", padding: "16px",
            background: saved ? "rgba(100,196,120,0.15)" : "linear-gradient(135deg, #c4a064, #a0794a)",
            border: saved ? "1px solid rgba(100,196,120,0.4)" : "none",
            color: saved ? "#8be0a0" : "#0a0a0f",
            fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "0.2em",
            cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1,
            transition: "all 0.3s",
          }}
        >
          {saving ? "SAVING..." : saved ? "✓ PROFILE SAVED" : "SAVE TRAVEL PROFILE"}
        </button>

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", opacity: 0.35, textAlign: "center", marginTop: "16px", lineHeight: 1.6 }}>
          You can update this at any time. The AI will immediately use your latest preferences.
        </p>
      </div>
    </div>
  );
}