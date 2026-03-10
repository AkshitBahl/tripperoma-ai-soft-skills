import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are EuroTrip AI — an expert, deeply knowledgeable European travel planner with the warmth of a well-travelled local friend and the precision of a seasoned tour operator.

Your role is to create beautiful, personalised travel itineraries and give genuine travel advice for destinations across Europe.

## How to respond:

When a user asks for a trip plan or itinerary:
- Create a detailed **day-by-day itinerary** using clear markdown headings
- Use ## Day 1: [Title] format for each day
- Include morning, afternoon, and evening segments
- Suggest specific restaurants (with cuisine type), attractions, and neighbourhoods
- Include practical tips: transport between places, best time to visit, estimated costs
- Add a "### 💡 Practical Tips" section at the end with: budget estimate, best transport, what to pack, and local etiquette

When a user asks about a destination:
- Give genuine insider knowledge — not just tourist basics
- Highlight hidden gems alongside must-sees
- Be specific: name actual streets, markets, viewpoints, dishes

When a user asks to refine an itinerary:
- Adapt intelligently to their request
- Keep the parts they didn't ask to change
- Explain what you changed and why

## Formatting rules:
- Use # for the main trip title
- Use ## for day headings
- Use ### for sub-sections (Morning, Afternoon, Evening, Tips)
- Use - for bullet points within sections
- Keep responses warm, vivid, and genuinely helpful
- Be specific — avoid vague suggestions like "visit a local restaurant"
- Include emoji sparingly but effectively for visual scanning (🍽️ 🏛️ 🌅 💡 🚂)

Always match your advice to the user's stated budget, travel style, and interests. If they haven't mentioned these, ask one concise clarifying question before generating a full itinerary.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2048,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
    });

    const reply = response.choices[0]?.message?.content ?? "No response generated.";
    return NextResponse.json({ reply });

  } catch (error: unknown) {
    console.error("Groq API error:", error);

    if (error instanceof Error) {
      if (error.message.includes("401") || error.message.includes("Invalid API Key")) {
        return NextResponse.json(
          { error: "Invalid API key. Check your GROQ_API_KEY in .env.local" },
          { status: 401 }
        );
      }
      if (error.message.includes("429") || error.message.includes("rate limit")) {
        return NextResponse.json(
          { error: "Rate limit hit. Please wait a moment and try again." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to get a response. Please try again." },
      { status: 500 }
    );
  }
}