// src/app/dsa/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, Code, BarChart3, Briefcase, Code2, Plus, TerminalSquare, ExternalLink, UserCircle, LogOut } from "lucide-react";
import Link from "next/link";

export default function DSAPage() {
  const { data: session } = useSession();
  const [problems, setProblems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("LeetCode");
  const [difficulty, setDifficulty] = useState("Easy");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (session) {
      fetch("/api/dsa").then((res) => res.json()).then((data) => {
        if (Array.isArray(data)) setProblems(data);
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/dsa", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, platform, difficulty, link }),
    });
    if (res.ok) {
      const newProb = await res.json();
      setProblems([newProb, ...problems]);
      setTitle(""); setLink("");
    }
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === "Easy") return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]";
    if (diff === "Medium") return "text-amber-400 bg-amber-400/10 border-amber-400/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]";
    return "text-rose-400 bg-rose-400/10 border-rose-400/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]";
  };

  if (!session) return <div className="p-10 text-cyan-400 text-center animate-pulse tracking-widest uppercase">Awaiting Authentication...</div>;

  const easyCount = problems.filter(p => p.difficulty === "Easy").length;
  const mediumCount = problems.filter(p => p.difficulty === "Medium").length;
  const hardCount = problems.filter(p => p.difficulty === "Hard").length;

  return (
    <div className="flex min-h-screen text-zinc-100 selection:bg-cyan-500/30">
      <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl p-6 flex flex-col justify-between hidden md:flex shrink-0 h-screen sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="relative h-10 w-10 flex items-center justify-center rounded-xl bg-black/60 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.4)] overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 group-hover:from-cyan-500/20 group-hover:to-purple-600/20 transition-all duration-500"></div>
              <svg className="relative z-10 w-6 h-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" viewBox="0 0 24 24" fill="none" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <defs><linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#c084fc" /></linearGradient></defs>
                <polygon points="12 2 2 7 12 12 22 7 12 2" fill="rgba(34, 211, 238, 0.1)" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /><line x1="12" y1="22" x2="12" y2="12" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">DevOS</span>
          </div>
          <nav className="space-y-2">
            <Link href="/" className="flex items-center gap-3 text-zinc-400 hover:bg-white/5 hover:text-cyan-300 px-4 py-3 rounded-xl font-medium text-sm transition-all"><LayoutDashboard size={18} /> System Dashboard</Link>
            <Link href="/projects" className="flex items-center gap-3 text-zinc-400 hover:bg-white/5 hover:text-cyan-300 px-4 py-3 rounded-xl font-medium text-sm transition-all"><Code size={18} /> Project Engine</Link>
            <Link href="/analytics" className="flex items-center gap-3 text-zinc-400 hover:bg-white/5 hover:text-cyan-300 px-4 py-3 rounded-xl font-medium text-sm transition-all"><BarChart3 size={18} /> Skill Analytics</Link>
            <Link href="/placement" className="flex items-center gap-3 text-zinc-400 hover:bg-white/5 hover:text-cyan-300 px-4 py-3 rounded-xl font-medium text-sm transition-all"><Briefcase size={18} /> Placement Hub</Link>
            <Link href="/dsa" className="flex items-center gap-3 bg-white/10 text-cyan-400 px-4 py-3 rounded-xl font-medium text-sm shadow-[inset_0_0_10px_rgba(6,182,212,0.1)] border border-cyan-400/20"><TerminalSquare size={18} /> DSA Tracker</Link>
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

      <main className="flex-1 p-6 md:p-10 relative">
        <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none -z-10"></div>
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Algorithm Log</h1>
          <p className="text-zinc-400 mt-2 font-mono text-sm">PROBLEM SOLVING METRICS // DSA PROGRESSION</p>
        </header>

        <div className="grid grid-cols-4 gap-6 mb-12">
          <div className="glass-panel p-6 rounded-2xl text-center relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Total Executed</p>
            <p className="text-3xl font-bold mt-2 text-white">{problems.length}</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
            <p className="text-xs font-mono text-emerald-400/70 uppercase tracking-wider">Easy</p>
            <p className="text-3xl font-bold mt-2 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">{easyCount}</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
            <p className="text-xs font-mono text-amber-400/70 uppercase tracking-wider">Medium</p>
            <p className="text-3xl font-bold mt-2 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">{mediumCount}</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50"></div>
            <p className="text-xs font-mono text-rose-400/70 uppercase tracking-wider">Hard</p>
            <p className="text-3xl font-bold mt-2 text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">{hardCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 glass-panel p-6 rounded-2xl h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white"><Plus size={20} className="text-emerald-400"/> Log Execution</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-400 transition-colors shadow-inner text-sm font-mono" placeholder="Problem Title" /></div>
              <div className="grid grid-cols-2 gap-3">
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none focus:border-emerald-400 transition-colors shadow-inner text-sm font-mono cursor-pointer"><option>LeetCode</option><option>HackerRank</option><option>GeeksForGeeks</option><option>Codeforces</option></select>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none focus:border-emerald-400 transition-colors shadow-inner text-sm font-mono cursor-pointer"><option>Easy</option><option>Medium</option><option>Hard</option></select>
              </div>
              <div><input value={link} onChange={(e) => setLink(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-emerald-400 transition-colors shadow-inner text-sm font-mono" placeholder="URL (Optional)" /></div>
              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold py-3 rounded-xl hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-300 mt-4 uppercase tracking-wider text-sm">Save Record</button>
            </form>
          </div>
          <div className="lg:col-span-2">
            <div className="glass-panel rounded-2xl overflow-hidden">
              {problems.length === 0 ? (
                <div className="p-10 text-center text-zinc-500 font-mono text-sm uppercase tracking-widest">No operations logged yet.</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {problems.map((prob) => (
                    <div key={prob.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                      <div>
                        <div className="flex items-center gap-3"><span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${getDifficultyColor(prob.difficulty)}`}>{prob.difficulty}</span><span className="font-bold text-white group-hover:text-emerald-300 transition-colors">{prob.title}</span></div>
                        <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1 font-mono uppercase tracking-wider"><Code2 size={12} className="text-cyan-500"/> {prob.platform}</p>
                      </div>
                      {prob.link && <a href={prob.link} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-emerald-400 transition-colors p-2"><ExternalLink size={18}/></a>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}