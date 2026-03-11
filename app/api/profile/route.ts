import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true, image: true, travelStatus: true, numberOfKids: true,
      kidsAges: true, petFriendly: true, budgetStyle: true, travelPace: true,
      interests: true, mobilityNeeds: true, dietaryNeeds: true, profileComplete: true,
    },
  });

  return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: { ...data, profileComplete: true },
  });

  return NextResponse.json({ success: true, user });
}