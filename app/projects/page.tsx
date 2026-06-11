// src/app/projects/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Plus, Code, LayoutDashboard, BarChart3, Briefcase, TerminalSquare, UserCircle, LogOut } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [techStack, setTechStack] = useState("");

  useEffect(() => {
    if (session) {
      fetch("/api/projects").then((res) => res.json()).then((data) => {
        setProjects(data);
        setIsLoading(false);
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, repoUrl, liveUrl, techStack }),
    });
    if (res.ok) {
      const newProject = await res.json();
      setProjects([newProject, ...projects]);
      setTitle(""); setDescription(""); setRepoUrl(""); setLiveUrl(""); setTechStack("");
    }
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
            <Link href="/projects" className="flex items-center gap-3 bg-white/10 text-cyan-400 px-4 py-3 rounded-xl font-medium text-sm shadow-[inset_0_0_10px_rgba(6,182,212,0.1)] border border-cyan-400/20"><Code size={18} /> Project Engine</Link>
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

      <main className="flex-1 p-6 md:p-10 relative">
        <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none -z-10"></div>
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Project Engine</h1>
          <p className="text-zinc-400 mt-2 font-mono text-sm">MANUAL DEPLOYMENT TRACKER // PORTFOLIO DATABASE</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 glass-panel p-6 rounded-2xl h-fit relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-500"></div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white"><Plus size={20} className="text-cyan-400"/> Inject Record</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-cyan-400/70 mb-1 tracking-wider uppercase">Project Title</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-400 transition-colors shadow-inner" placeholder="e.g., Event Navigation App" />
              </div>
              <div>
                <label className="block text-xs font-mono text-cyan-400/70 mb-1 tracking-wider uppercase">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-400 transition-colors shadow-inner h-24 resize-none" placeholder="Application functionality..." />
              </div>
              <div>
                <label className="block text-xs font-mono text-cyan-400/70 mb-1 tracking-wider uppercase">Tech Stack</label>
                <input value={techStack} onChange={(e) => setTechStack(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-400 transition-colors shadow-inner" placeholder="Kotlin, Spring Boot" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-mono text-cyan-400/70 mb-1 tracking-wider uppercase">Repo URL</label><input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-400 transition-colors shadow-inner" placeholder="https://github..." /></div>
                <div><label className="block text-xs font-mono text-cyan-400/70 mb-1 tracking-wider uppercase">Live URL</label><input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-cyan-400 transition-colors shadow-inner" placeholder="https://..." /></div>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-xl hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300 mt-4 uppercase tracking-wider text-sm">Commit to Database</button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold mb-6 text-white">Verified Portfolio Assets</h2>
            {isLoading ? (
              <p className="text-cyan-400 animate-pulse font-mono text-sm tracking-widest">FETCHING RECORDS...</p>
            ) : projects.length === 0 ? (
              <div className="border border-dashed border-white/10 rounded-2xl p-10 text-center text-zinc-500 font-mono text-sm bg-black/20">NO ASSETS FOUND. INJECT A RECORD TO BEGIN.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors pl-2">{proj.title}</h3>
                      <p className="text-zinc-400 text-sm mt-3 line-clamp-3 pl-2">{proj.description}</p>
                      <div className="flex flex-wrap gap-2 mt-5 pl-2">
                        {proj.techStack.map((tech: string, i: number) => (
                          <span key={i} className="text-[10px] uppercase font-bold tracking-wider bg-cyan-500/10 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-500/20 flex items-center gap-1 shadow-[0_0_5px_rgba(6,182,212,0.1)]"><Code size={10} /> {tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}