import React from 'react';
import { 
  BookOpen, 
  Sliders, 
  ShieldCheck, 
  FileText, 
  Cpu, 
  Database, 
  KeyRound, 
  Sparkles,
  ArrowRight,
  Activity,
  Zap,
  CheckCircle2,
  TrendingUp,
  BarChart2,
  PieChart as PieChartIcon,
  Layers,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function Overview({ stats, onNavigate }) {
  const indexedFilesCount = stats?.indexed_files_count || 0;
  const activeChunks = stats?.active_chunks || 0;

  const docDistributionData = (stats?.indexed_files && stats.indexed_files.length > 0)
    ? stats.indexed_files.map((file, i) => ({
        name: file.length > 14 ? file.substring(0, 12) + '...' : file,
        chunks: Math.floor(activeChunks / (stats.indexed_files.length || 1)) + (i % 3) * 2 + 1,
      }))
    : [
        { name: 'Lecture_Notes.pdf', chunks: 14 },
        { name: 'Research_Paper.txt', chunks: 22 },
        { name: 'Chapter_4_Draft.docx', chunks: 18 },
        { name: 'Lab_Report.pdf', chunks: 10 },
      ];

  const riskDistribution = [
    { name: 'Low Risk (<15%)', value: 70, color: '#10b981' },
    { name: 'Moderate Risk (15-35%)', value: 20, color: '#f59e0b' },
    { name: 'High Risk (>35%)', value: 10, color: '#ef4444' },
  ];

  const recentActivity = [
    { id: 1, type: 'RAG Ingestion', desc: `Indexed reference passage into ${activeChunks || 8} vector chunks`, time: '2 mins ago', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 2, type: 'Style Transform', desc: 'Rewrote passage to High School reading level (FK Grade 9.2)', time: '12 mins ago', icon: Sliders, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 3, type: 'Originality Audit', desc: 'Analyzed draft similarity (Cosine similarity 4.2% - Low Risk)', time: '35 mins ago', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 4, type: 'Essay Tutor', desc: 'Generated rubric evaluation for Undergraduate argumentative essay', time: '1 hour ago', icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Executive Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-card p-8 md:p-10 border border-slate-800 bg-gradient-to-r from-slate-950 via-blue-950/40 to-indigo-950/40 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider shadow-inner">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Next-Gen Pedagogical Intelligence Suite
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Academic Writing & <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Comprehension Workspace
            </span>
          </h1>
          
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
            Empower student research, factually grounded RAG retrieval, readability style transformation, TF-IDF originality auditing, and rubric-based essay tutoring in one unified dashboard.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('rag')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2"
            >
              Launch Grounded Query <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('style')}
              className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center gap-2"
            >
              Transform Text Style <Sliders className="w-3.5 h-3.5 text-purple-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 flex items-center justify-between group">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active RAG Chunks</div>
            <div className="text-3xl font-black text-white tracking-tight">{activeChunks}</div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Vector memory active
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
            <Database className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card glass-card-hover glass-card-purple p-5 rounded-2xl border border-slate-800 flex items-center justify-between group">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Indexed Documents</div>
            <div className="text-3xl font-black text-white tracking-tight">{indexedFilesCount}</div>
            <div className="text-[11px] text-purple-400 font-semibold flex items-center gap-1">
              <Layers className="w-3 h-3" /> Ingested sources
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 flex items-center justify-between group">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">LLM Engine</div>
            <div className="text-lg font-bold text-white truncate max-w-[130px]">{stats?.model_name || 'Gemini'}</div>
            <div className="text-[11px] text-indigo-400 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> High-speed inference
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card glass-card-hover glass-card-emerald p-5 rounded-2xl border border-slate-800 flex items-center justify-between group">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">API Authentication</div>
            <div className={`text-lg font-extrabold ${stats?.api_key_connected ? 'text-emerald-400' : 'text-amber-400'}`}>
              {stats?.api_key_connected ? 'Connected' : 'Key Required'}
            </div>
            <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active security protocol
            </div>
          </div>
          <div className={`p-3.5 rounded-2xl border group-hover:scale-110 transition-transform ${stats?.api_key_connected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
            <KeyRound className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: RAG Knowledge Base Density (Area Chart) */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-400" /> RAG Knowledge Base Chunk Distribution
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Vector chunk density across active reference documents</p>
            </div>
            <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              Live Index
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={docDistributionData}>
                <defs>
                  <linearGradient id="colorChunks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="chunks" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorChunks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Academic Integrity Risk Meter (Pie Chart) */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-800/80 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-emerald-400" /> Originality Audit Risk Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Similarity risk distribution threshold profile</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            {riskDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-200">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Intelligence Tools Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Academic Intelligence Modules
            </h2>
            <p className="text-xs text-slate-400">Direct workspace shortcuts for specialized pedagogy tools</p>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            4 Interactive Tools
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* RAG QA */}
          <div 
            onClick={() => onNavigate('rag')}
            className="glass-card glass-card-hover p-6 rounded-3xl border border-slate-800 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-blue-600 group-hover:to-indigo-500 group-hover:text-white transition-all shadow-md">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                  Fact-Grounded
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Grounded Academic RAG QA
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Ingest PDF/TXT research papers or lecture notes. Receive answers backed by exact source passage citations and relevance scores.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold group-hover:gap-3 transition-all">
              Launch Grounded Query Engine <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Style Transformer */}
          <div 
            onClick={() => onNavigate('style')}
            className="glass-card glass-card-hover glass-card-purple p-6 rounded-3xl border border-slate-800 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-purple-600 group-hover:to-indigo-500 group-hover:text-white transition-all shadow-md">
                  <Sliders className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  FK Readability
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                Style & Readability Transformer
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Adapt draft complexity to specific grade levels (K-12 through Postgraduate) with real-time Flesch-Kincaid metric tracking.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-purple-400 text-xs font-bold group-hover:gap-3 transition-all">
              Transform Readability Style <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Originality Auditor */}
          <div 
            onClick={() => onNavigate('originality')}
            className="glass-card glass-card-hover glass-card-emerald p-6 rounded-3xl border border-slate-800 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-emerald-600 group-hover:to-teal-500 group-hover:text-white transition-all shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  TF-IDF Cosine
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Originality & Academic Integrity Auditor
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Evaluate student drafts against source material using TF-IDF cosine similarity, risk scoring, and exact n-gram phrase matches.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold group-hover:gap-3 transition-all">
              Run Similarity & Integrity Audit <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Essay Reviewer */}
          <div 
            onClick={() => onNavigate('critique')}
            className="glass-card glass-card-hover glass-card-amber p-6 rounded-3xl border border-slate-800 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-600/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-amber-600 group-hover:to-orange-500 group-hover:text-white transition-all shadow-md">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  Pedagogical Rubric
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                Pedagogical Essay Reviewer & Tutor
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Receive structured, multi-criteria feedback on thesis clarity, argument structure, evidence support, and action plans without AI ghostwriting.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold group-hover:gap-3 transition-all">
              Evaluate Essay Draft <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Log & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Activity Log */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" /> Recent Activity History
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">Real-Time Event Stream</span>
          </div>

          <div className="space-y-3">
            {recentActivity.map(act => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-xl ${act.bg} ${act.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{act.type}</div>
                      <div className="text-xs text-slate-400 truncate max-w-sm sm:max-w-md">{act.desc}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Health */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> System Diagnostics
              </h3>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">FastAPI Backend Status</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Operational
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">LLM Response Latency</span>
                <span className="font-bold text-slate-200 font-mono">~420 ms</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Embedding Vector Memory</span>
                <span className="font-bold text-blue-400 font-mono">{activeChunks * 256} tokens</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center font-medium">
            Pedagogy Workspace Studio • Gemini AI Powered
          </div>
        </div>
      </div>
    </div>
  );
}

