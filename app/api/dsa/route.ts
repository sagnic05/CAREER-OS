// src/app/api/dsa/route.ts
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const problems = await prisma.dSAProblem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(problems);
  } catch (error) {
    console.error("GET DSA Error:", error);
    return NextResponse.json({ error: "Failed to fetch DSA problems" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    const { title, platform, difficulty, link } = await req.json();

    const newProblem = await prisma.dSAProblem.create({
      data: {
        title,
        platform,
        difficulty,
        link,
        status: "Solved",
        userId: user!.id,
      },
    });

    return NextResponse.json(newProblem);
  } catch (error) {
    console.error("POST DSA Error:", error);
    return NextResponse.json({ error: "Failed to log problem" }, { status: 500 });
  }
}