// src/app/page.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LayoutDashboard, Code, BarChart3, Briefcase, LogOut, TerminalSquare, UserCircle, Cpu, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  
  const [repoCount, setRepoCount] = useState<number | null>(null);
  const [recentRepos, setRecentRepos] = useState<any[]>([]);

  useEffect(() => {
    if (session) {
      fetch("/api/github")
        .then((res) => res.json())
        .then((data) => {
          if (data.totalRepos !== undefined) setRepoCount(data.totalRepos);
          if (data.recentRepos) setRecentRepos(data.recentRepos);
        })
        .catch((err) => console.error("Failed to fetch repos", err));
    }
  }, [session]);

  const aiScore = repoCount !== null ? Math.min(98, 50 + (repoCount * 2)) : "Pending";

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <Cpu className="animate-spin" size={40} />
          <p className="text-lg tracking-widest uppercase text-cyan-400/80 animate-pulse">Initializing System...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] -z-10"></div>
        
        <div className="text-center max-w-md glass-panel p-10 rounded-3xl relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative h-16 w-16 flex items-center justify-center rounded-2xl bg-black/60 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.5)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10"></div>
              <svg className="relative z-10 w-10 h-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" viewBox="0 0 24 24" fill="none" stroke="url(#logo-grad-main)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="logo-grad-main" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                <polygon points="12 2 2 7 12 12 22 7 12 2" fill="rgba(34, 211, 238, 0.1)" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
                <line x1="12" y1="22" x2="12" y2="12" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">DevCareer OS</h1>
          <p className="text-zinc-400 mb-8 font-light">Secure command center to track your algorithmic progress, optimize your deployed portfolio, and scale your engineering career.</p>
          <button onClick={() => signIn("github")} className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold tracking-wide py-3 px-4 rounded-xl hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300">
            Authenticate via GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen text-zinc-100 selection:bg-cyan-500/30">
      <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl p-6 flex flex-col justify-between hidden md:flex shrink-0 h-screen sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="relative h-10 w-10 flex items-center justify-center rounded-xl bg-black/60 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.4)] overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 group-hover:from-cyan-500/20 group-hover:to-purple-600/20 transition-all duration-500"></div>
              <svg className="relative z-10 w-6 h-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" viewBox="0 0 24 24" fill="none" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#c084fc" /></linearGradient>
                </defs>
                <polygon points="12 2 2 7 12 12 22 7 12 2" fill="rgba(34, 211, 238, 0.1)" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /><line x1="12" y1="22" x2="12" y2="12" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">DevOS</span>
          </div>
          <nav className="space-y-2">
            <Link href="/" className="flex items-center gap-3 bg-white/10 text-cyan-400 px-4 py-3 rounded-xl font-medium text-sm shadow-[inset_0_0_10px_rgba(6,182,212,0.1)] border border-cyan-400/20"><LayoutDashboard size={18} /> System Dashboard</Link>
            <Link href="/projects" className="flex items-center gap-3 text-zinc-400 hover:bg-white/5 hover:text-cyan-300 px-4 py-3 rounded-xl font-medium text-sm transition-all"><Code size={18} /> Project Engine</Link>
            <Link href="/analytics" className="flex items-center gap-3 text-zinc-400 hover:bg-white/5 hover:text-cyan-300 px-4 py-3 rounded-xl font-medium text-sm transition-all"><BarChart3 size={18} /> Skill Analytics</Link>
            <Link href="/placement" className="flex items-center gap-3 text-zinc-400 hover:bg-white/5 hover:text-cyan-300 px-4 py-3 rounded-xl font-medium text-sm transition-all"><Briefcase size={18} /> Placement Hub</Link>
            <Link href="/dsa" className="flex items-center gap-3 text-zinc-400 hover:bg-white/5 hover:text-cyan-300 px-4 py-3 rounded-xl font-medium text-sm transition-all"><TerminalSquare size={18} /> DSA Tracker</Link>
            <Link href="/profile" className="flex items-center gap-3 text-zinc-400 hover:bg-white/5 hover:text-cyan-300 px-4 py-3 rounded-xl font-medium text-sm transition-all"><UserCircle size={18} /> Settings</Link>
          </nav>
        </div>
        <div className="border-t border-white/5 pt-6 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            {session.user?.image ? <img src={session.user.image} alt="Avatar" className="w-10 h-10 rounded-full border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]" /> : <div className="w-10 h-10 rounded-full bg-cyan-900 border border-cyan-500/50 flex items-center justify-center text-sm font-bold text-cyan-300 uppercase shadow-[0_0_10px_rgba(6,182,212,0.2)]">{session.user?.name?.[0] || "U"}</div>}
            <div className="truncate max-w-[110px]">
              <p className="text-sm font-medium truncate text-zinc-200">{session.user?.name}</p>
              <p className="text-xs text-cyan-400/70 truncate tracking-wider uppercase">Admin</p>
            </div>
          </div>
          <button onClick={() => signOut()} className="text-zinc-500 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-all"><LogOut size={18} /></button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 relative flex flex-col">
        <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none -z-10"></div>
        
        <header className="mb-12">
          {/* Changed the comma to a glowing neon terminal separator */}
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            System Status 
            <span className="text-cyan-500/70 font-mono font-light text-3xl pb-1">{"//"}</span> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">{session.user?.name?.split(" ")[0] || 'Developer'}</span>
          </h1>
          <p className="text-zinc-400 mt-2 font-mono text-sm">CONNECTION ESTABLISHED // SECURE CONNECTION</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-500 to-transparent opacity-50 group-hover:via-cyan-400 transition-all duration-500"></div>
            <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Commit Streak</p>
            <p className="text-4xl font-bold mt-2 text-white">0 <span className="text-lg text-zinc-500 font-light">Days</span></p>
          </div>
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-500"></div>
            <p className="text-sm font-medium text-cyan-400/80 uppercase tracking-wider">Active Repositories</p>
            <p className="text-4xl font-bold mt-2 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">{repoCount !== null ? repoCount : "..."}</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all duration-500"></div>
            <p className="text-sm font-medium text-purple-400/80 uppercase tracking-wider">AI Profile Score</p>
            <p className="text-4xl font-bold mt-2 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">{aiScore}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2"><TerminalSquare className="text-cyan-400" size={20} /> Latest Data Logs</h2>
          <div className="glass-panel rounded-2xl overflow-hidden">
            {recentRepos.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 font-mono text-sm">AWAITING GITHUB SYNC...</div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentRepos.map((repo) => (
                  <div key={repo.id} className="p-5 hover:bg-white/5 transition flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                    <div>
                      <a href={repo.html_url} target="_blank" className="text-zinc-200 font-bold hover:text-cyan-400 transition-colors flex items-center gap-3">
                        {repo.name} {repo.private && <span className="text-[10px] uppercase font-bold tracking-widest bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">Private</span>}
                      </a>
                      <p className="text-sm text-zinc-500 mt-1 line-clamp-1 group-hover:text-zinc-400 transition-colors">{repo.description || "No description provided."}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-mono text-cyan-400/70">
                      <span className="flex items-center gap-1.5"><Code size={14} /> {repo.language || "Mixed"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Creator Promotion Section */}
        <div className="mt-auto pt-16">
          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-cyan-500/20 group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-500 opacity-80 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all duration-300"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pl-4">
              <div>
                <p className="text-xs font-mono text-cyan-400 tracking-wider uppercase mb-1">System Architect</p>
                <h3 className="text-2xl font-bold text-white mb-2">Sagnic Bhattacharyya</h3>
                <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
                  B.Tech Computer Science (Class of 2027). Specializing in Full-Stack & Android Development (Kotlin, Spring Boot, Jetpack Compose). Open for collaborations and software engineering opportunities.
                </p>
              </div>
              <a href="mailto:bhattacharyya.sagnic@gmail.com" className="flex items-center gap-2 whitespace-nowrap px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-mono text-sm text-cyan-300 hover:text-cyan-100 transition-all shadow-[0_0_15px_rgba(6,182,212,0.05)] hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Mail size={16} /> INITIATE_CONTACT
              </a>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}