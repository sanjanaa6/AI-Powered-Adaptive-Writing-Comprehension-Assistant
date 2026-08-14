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
  ArrowRight
} from 'lucide-react';

export default function Overview({ stats, onNavigate }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-card p-8 border border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/40 to-purple-950/30">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Academic Workspace
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            Academic Writing & Comprehension Assistant
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            A pedagogy-first intelligence suite for student research, grounded factual retrieval, readability transformation, originality auditing, and structured essay feedback.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-xl border border-slate-800/80 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">{stats?.active_chunks || 0}</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Active RAG Chunks</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-800/80 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">{stats?.indexed_files_count || 0}</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">Indexed Documents</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-800/80 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="text-base font-bold text-white truncate max-w-[140px]">{stats?.model_name || 'Gemini'}</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">LLM Engine</div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-slate-800/80 flex items-center gap-4">
          <div className={`p-3.5 rounded-xl border ${stats?.api_key_connected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-base font-bold ${stats?.api_key_connected ? 'text-emerald-400' : 'text-amber-400'}`}>
              {stats?.api_key_connected ? 'Connected' : 'Key Required'}
            </div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">API Status</div>
          </div>
        </div>
      </div>

      {/* Feature Modules Grid */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight mb-4 flex items-center gap-2">
          Academic Intelligence Tools
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* RAG QA */}
          <div 
            onClick={() => onNavigate('rag')}
            className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Grounded Academic RAG QA
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Upload PDFs, Word docs, or course notes to receive factually grounded answers backed by precise chunk citations and relevance scoring.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-semibold group-hover:gap-3 transition-all">
              Launch Query Engine <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Style Transformer */}
          <div 
            onClick={() => onNavigate('style')}
            className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                Style & Readability Transformer
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Adapt writing tone, target grade reading levels, and complexity while measuring real-time Flesch-Kincaid metrics before and after.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-purple-400 text-xs font-semibold group-hover:gap-3 transition-all">
              Transform Readability <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Originality Auditor */}
          <div 
            onClick={() => onNavigate('originality')}
            className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Originality & Integrity Auditor
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Compare student drafts against source materials using TF-IDF cosine similarity, risk scoring, and exact n-gram phrase match highlighting.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-semibold group-hover:gap-3 transition-all">
              Audit Text Similarity <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Essay Critique */}
          <div 
            onClick={() => onNavigate('critique')}
            className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                Pedagogical Essay Reviewer
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Receive structured, rubric-aligned feedback on thesis clarity, argument structure, evidence support, and action plans without AI ghostwriting.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold group-hover:gap-3 transition-all">
              Review Essay Draft <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
