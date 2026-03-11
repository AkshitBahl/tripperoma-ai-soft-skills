import Groq from "groq-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const BASE_SYSTEM_PROMPT = `You are EuroTrip AI — an expert, deeply knowledgeable European travel planner with the warmth of a well-travelled local friend and the precision of a seasoned tour operator.

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
- Include emoji sparingly but effectively for visual scanning (🍽️ 🏛️ 🌅 💡 🚂)`;

function buildUserContext(profile: {
  travelStatus?: string | null;
  numberOfKids?: number | null;
  kidsAges?: string | null;
  petFriendly?: boolean | null;
  budgetStyle?: string | null;
  travelPace?: string | null;
  interests?: string | null;
  mobilityNeeds?: string | null;
  dietaryNeeds?: string | null;
  name?: string | null;
}): string {
  const lines: string[] = [];

  if (profile.name) lines.push(`- Traveller's name: ${profile.name}`);

  if (profile.travelStatus) {
    const statusMap: Record<string, string> = {
      single: "travelling solo",
      couple: "travelling as a couple",
      family: "travelling as a family",
      group: "travelling in a group",
    };
    lines.push(`- Travel group: ${statusMap[profile.travelStatus] ?? profile.travelStatus}`);
  }

  if (profile.numberOfKids !== null && profile.numberOfKids !== undefined) {
    if (profile.numberOfKids === 0) {
      lines.push("- No children");
    } else {
      const ages = profile.kidsAges ? ` (ages: ${profile.kidsAges})` : "";
      lines.push(`- Travelling with ${profile.numberOfKids} child${profile.numberOfKids > 1 ? "ren" : ""}${ages}`);
    }
  }

  if (profile.petFriendly === true) lines.push("- Travelling with a pet — needs pet-friendly accommodation and venues");

  if (profile.budgetStyle) {
    const budgetMap: Record<string, string> = {
      backpacker: "budget/backpacker (hostels, street food, free attractions)",
      "mid-range": "mid-range (3-star hotels, sit-down restaurants, some paid attractions)",
      luxury: "luxury (4-5 star hotels, fine dining, private tours)",
    };
    lines.push(`- Budget style: ${budgetMap[profile.budgetStyle] ?? profile.budgetStyle}`);
  }

  if (profile.travelPace) {
    const paceMap: Record<string, string> = {
      slow: "slow-paced (few activities per day, lots of relaxation)",
      moderate: "moderate pace (balanced mix of activity and downtime)",
      packed: "packed schedule (maximise every day, see as much as possible)",
    };
    lines.push(`- Preferred pace: ${paceMap[profile.travelPace] ?? profile.travelPace}`);
  }

  if (profile.interests) lines.push(`- Key interests: ${profile.interests}`);

  if (profile.mobilityNeeds && profile.mobilityNeeds !== "none") {
    const mobilityMap: Record<string, string> = {
      "limited-walking": "limited walking ability — avoid long walks, prefer transport between sites",
      wheelchair: "wheelchair user — needs fully accessible venues, routes, and accommodation",
    };
    lines.push(`- Mobility needs: ${mobilityMap[profile.mobilityNeeds] ?? profile.mobilityNeeds}`);
  }

  if (profile.dietaryNeeds && profile.dietaryNeeds !== "none") {
    lines.push(`- Dietary requirements: ${profile.dietaryNeeds} — only suggest suitable restaurants`);
  }

  if (lines.length === 0) return "";

  return `\n\n## Traveller Profile\nAlways tailor your response to this specific traveller:\n${lines.join("\n")}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // Fetch user profile from DB if logged in
    let userContext = "";
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          name: true, travelStatus: true, numberOfKids: true, kidsAges: true,
          petFriendly: true, budgetStyle: true, travelPace: true,
          interests: true, mobilityNeeds: true, dietaryNeeds: true,
        },
      });
      if (user) userContext = buildUserContext(user);
    }

    const systemPrompt = BASE_SYSTEM_PROMPT + userContext;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2048,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
    });

    const reply = response.choices[0]?.message?.content ?? "No response generated.";

    // Auto-save trip if this looks like an itinerary response (first assistant message)
    if (session?.user?.email && messages.length === 1) {
      try {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (user) {
          // Extract a title from the first user message
          const rawQuery = messages[0].content as string;
          const title = rawQuery.length > 60 ? rawQuery.slice(0, 57) + "..." : rawQuery;
          await prisma.trip.create({
            data: {
              userId: user.id,
              title,
              query: rawQuery,
              content: reply,
            },
          });
        }
      } catch (saveErr) {
        console.error("Failed to save trip:", saveErr);
        // Non-fatal — don't fail the whole request
      }
    }

    return NextResponse.json({ reply });

  } catch (error: unknown) {
    console.error("Groq API error:", error);

    if (error instanceof Error) {
      if (error.message.includes("401") || error.message.includes("Invalid API Key")) {
        return NextResponse.json({ error: "Invalid API key. Check your GROQ_API_KEY in .env.local" }, { status: 401 });
      }
      if (error.message.includes("429") || error.message.includes("rate limit")) {
        return NextResponse.json({ error: "Rate limit hit. Please wait a moment and try again." }, { status: 429 });
      }
    }

    return NextResponse.json({ error: "Failed to get a response. Please try again." }, { status: 500 });
  }
}