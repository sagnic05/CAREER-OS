// src/app/placement/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, Code, BarChart3, Briefcase, Plus, Building2, ExternalLink, TerminalSquare, UserCircle, LogOut } from "lucide-react";
import Link from "next/link";

const COLUMNS = ["Applied", "Interviewing", "Offered", "Rejected"];

export default function PlacementPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<any[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [link, setLink] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (session) {
      fetch("/api/jobs")
        .then(async (res) => {
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) throw new Error("API Route missing.");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) setJobs(data);
          else if (data.error) console.error("API Error:", data.error);
        })
        .catch((err) => setErrorMsg(err.message));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/jobs", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role, link }),
      });
      if (res.ok) {
        const newJob = await res.json();
        setJobs([newJob, ...jobs]);
        setCompany(""); setRole(""); setLink(""); setErrorMsg("");
      }
    } catch (err: any) { setErrorMsg("Failed to save record."); }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/jobs", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus } : job));
    } catch (err) { console.error("Failed to update status"); }
  };

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
            <Link href="/analytics" className="flex items-center gap-3 text-zinc-400 hover:bg-white/5 hover:text-cyan-300 px-4 py-3 rounded-xl font-medium text-sm transition-all"><BarChart3 size={18} /> Skill Analytics</Link>
            <Link href="/placement" className="flex items-center gap-3 bg-white/10 text-cyan-400 px-4 py-3 rounded-xl font-medium text-sm shadow-[inset_0_0_10px_rgba(6,182,212,0.1)] border border-cyan-400/20"><Briefcase size={18} /> Placement Hub</Link>
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
        <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none -z-10"></div>
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Placement Hub</h1>
            <p className="text-zinc-400 mt-2 font-mono text-sm">CAREER PIPELINE // APPLICATION TRACKING SYSTEM</p>
            {errorMsg && <p className="text-rose-400 text-sm mt-2 font-medium">⚠️ {errorMsg}</p>}
          </div>
          <form onSubmit={handleSubmit} className="flex items-center gap-2 glass-panel p-2 rounded-2xl">
            <input required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company / Exam" className="bg-transparent border-none text-sm text-white outline-none px-3 w-32 font-mono" />
            <div className="w-px h-6 bg-white/10"></div>
            <input required value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" className="bg-transparent border-none text-sm text-white outline-none px-3 w-32 font-mono" />
            <button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-2 rounded-xl hover:scale-105 hover:shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all"><Plus size={18} /></button>
          </form>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map((col) => (
            <div key={col} className="bg-black/30 backdrop-blur-md border border-white/5 rounded-3xl p-4 min-h-[500px]">
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wider">{col}</h3>
                <span className="bg-white/5 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-mono border border-white/5">{jobs.filter(j => j.status === col).length}</span>
              </div>
              <div className="space-y-4">
                {jobs.filter(j => j.status === col).map((job) => (
                  <div key={job.id} className="glass-panel p-4 rounded-2xl group hover:border-cyan-500/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 font-bold text-white">
                        <Building2 size={14} className="text-cyan-400" /> {job.company}
                      </div>
                      {job.link && <a href={job.link} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-cyan-400 transition-colors"><ExternalLink size={14}/></a>}
                    </div>
                    <p className="text-sm text-zinc-400 mb-4 font-mono">{job.role}</p>
                    <select value={job.status} onChange={(e) => updateStatus(job.id, e.target.value)} className="w-full bg-black/50 border border-white/10 text-xs text-zinc-300 rounded-xl p-2 outline-none focus:border-cyan-500 cursor-pointer font-mono transition-colors">
                      {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}