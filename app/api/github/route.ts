// src/app/api/github/route.ts
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { accounts: true },
    });

    const githubToken = dbUser?.accounts[0]?.access_token;
    if (!githubToken) {
      return NextResponse.json({ error: "No GitHub account linked" }, { status: 400 });
    }

    const repoResponse = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const repos = await repoResponse.json();

    return NextResponse.json({
      totalRepos: repos.length || 0,
      recentRepos: repos.slice(0, 5), 
      allRepos: repos, // <-- We are now sending all repo data to the frontend for analysis
    });

  } catch (error) {
    console.error("GitHub API Error:", error);
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
  }
}