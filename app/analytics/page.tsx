// src/app/analytics/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BrainCircuit, Code2, TrendingUp, LayoutDashboard, Code, BarChart3, Briefcase, TerminalSquare, UserCircle, LogOut } from "lucide-react";
import Link from "next/link";

const COLORS = ['#06b6d4', '#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#84cc16'];

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [skillData, setSkillData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      Promise.all([
        fetch("/api/projects").then((res) => res.json()),
        fetch("/api/github").then((res) => res.json())
      ]).then(([projects, githubData]) => {
        const techCounts: Record<string, number> = {};
        if (Array.isArray(projects)) {
          projects.forEach((proj: any) => proj.techStack.forEach((tech: string) => {
            const cleanTech = tech.trim().toUpperCase();
            if (cleanTech) techCounts[cleanTech] = (techCounts[cleanTech] || 0) + 1;
          }));
        }
        if (githubData.allRepos && Array.isArray(githubData.allRepos)) {
          githubData.allRepos.forEach((repo: any) => {
            if (repo.language) {
              const cleanLang = repo.language.trim().toUpperCase();
              techCounts[cleanLang] = (techCounts[cleanLang] || 0) + 1;
            }
          });
        }
        const formattedData = Object.keys(techCounts).map((key) => ({ name: key, count: techCounts[key] })).sort((a, b) => b.count - a.count);
        setSkillData(formattedData);
        setIsLoading(false);
      }).catch(err => { console.error("Error fetching analytics data:", err); setIsLoading(false); });
    }
  }, [session]);

  const aiScore = skillData.length > 0 ? Math.min(98, 45 + (skillData.length * 8)) : "Pending";

  if (!session) return <div className="p-10 text-cyan-400 text-center animate-pulse tracking-widest uppercase">Awaiting Authentication...</div>;

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
            <Link href="/analytics" className="flex items-center gap-3 bg-white/10 text-cyan-400 px-4 py-3 rounded-xl font-medium text-sm shadow-[inset_0_0_10px_rgba(6,182,212,0.1)] border border-cyan-400/20"><BarChart3 size={18} /> Skill Analytics</Link>
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

      <main className="flex-1 p-6 md:p-10 relative">
        <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none -z-10"></div>
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Skill Analytics</h1>
          <p className="text-zinc-400 mt-2 font-mono text-sm">TELEMETRY DATA // ENGINEERING STACK DISTRIBUTION</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-panel p-6 rounded-2xl flex items-center gap-5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-500"></div>
            <div className="bg-cyan-500/10 p-4 rounded-xl text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]"><Code2 size={26} /></div>
            <div>
              <p className="text-xs font-mono text-zinc-400 tracking-wider uppercase">Tech Signatures</p>
              <p className="text-3xl font-bold text-white mt-1">{skillData.length}</p>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex items-center gap-5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-500"></div>
            <div className="bg-emerald-500/10 p-4 rounded-xl text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"><TrendingUp size={26} /></div>
            <div>
              <p className="text-xs font-mono text-zinc-400 tracking-wider uppercase">Primary Node</p>
              <p className="text-3xl font-bold text-white mt-1 truncate">{skillData[0]?.name || "N/A"}</p>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex items-center gap-5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all duration-500"></div>
            <div className="bg-purple-500/10 p-4 rounded-xl text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]"><BrainCircuit size={26} /></div>
            <div>
              <p className="text-xs font-mono text-zinc-400 tracking-wider uppercase">Heuristic Score</p>
              <p className="text-3xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)] mt-1">{aiScore}</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <p className="text-cyan-400 animate-pulse font-mono text-sm tracking-widest text-center mt-20">PROCESSING TELEMETRY...</p>
        ) : skillData.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-2xl p-10 text-center text-zinc-500 font-mono text-sm bg-black/20">NO DATA METRICS DETECTED.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-sm font-mono text-cyan-400/80 mb-8 uppercase tracking-wider">Stack Matrix</h2>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillData}>
                    <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '12px', color: '#fff', fontSize: '12px', fontFamily: 'monospace' }} />
                    <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-sm font-mono text-purple-400/80 mb-8 uppercase tracking-wider">Language Distribution</h2>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={skillData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count" stroke="none">
                      {skillData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '12px', color: '#fff', fontSize: '12px', fontFamily: 'monospace' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}