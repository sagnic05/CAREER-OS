// src/app/api/jobs/route.ts
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

    const jobs = await prisma.jobApplication.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("GET Jobs Error:", error); // <-- This will tell us the exact issue in the terminal
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    const { company, role, link } = await req.json();

    const newJob = await prisma.jobApplication.create({
      data: {
        company,
        role,
        link,
        status: "Applied",
        userId: user!.id,
      },
    });

    return NextResponse.json(newJob);
  } catch (error) {
    console.error("POST Jobs Error:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, status } = await req.json();

    const updatedJob = await prisma.jobApplication.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("PATCH Jobs Error:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}