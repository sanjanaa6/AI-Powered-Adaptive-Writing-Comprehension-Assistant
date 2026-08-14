import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Sliders, 
  ShieldCheck, 
  FileText, 
  Settings, 
  GraduationCap,
  Cpu,
  Database,
  KeyRound,
  Menu,
  X,
  Sparkles,
  Activity,
  Zap
} from 'lucide-react';

import Overview from './components/Overview';
import RagEngineView from './components/RagEngineView';
import StyleTransformer from './components/StyleTransformer';
import OriginalityAuditor from './components/OriginalityAuditor';
import EssayCritiqueView from './components/EssayCritiqueView';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch system stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 8000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview & Analytics', icon: LayoutDashboard, badge: 'Live' },
    { id: 'rag', label: 'Grounded RAG QA', icon: BookOpen, badge: stats?.active_chunks ? `${stats.active_chunks}` : null },
    { id: 'style', label: 'Style Transformer', icon: Sliders },
    { id: 'originality', label: 'Originality Auditor', icon: ShieldCheck },
    { id: 'critique', label: 'Essay Reviewer', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-dark-mesh bg-grid-pattern flex flex-col md:flex-row text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/80 bg-[#0c121e]/90 backdrop-blur-2xl p-5 sticky top-0 h-screen justify-between z-20">
        <div>
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3.5 px-2 mb-8 group cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0c121e] animate-pulse" />
            </div>
            <div>
              <h1 className="font-black text-sm text-white tracking-tight leading-tight flex items-center gap-1.5">
                Academic AI <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              </h1>
              <p className="text-[11px] text-slate-400 font-semibold tracking-wide">Workspace Studio v2.0</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5">
            <div className="px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
              <span>Intelligence Suite</span>
              <Activity className="w-3 h-3 text-slate-600" />
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-xs transition-all text-left group ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 border border-blue-400/30' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom System Settings */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-amber-400" /> System Engine</span>
              <span className="text-slate-200 font-bold">{stats?.model_name || 'Gemini'}</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-full animate-pulse" />
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-all group"
          >
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-400 group-hover:rotate-90 transition-transform duration-300" /> System Credentials
            </span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </button>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0c121e] border-b border-slate-800 sticky top-0 z-30 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-black text-white text-sm tracking-tight">Academic AI</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c121e]/95 backdrop-blur-2xl border-b border-slate-800 p-4 space-y-2 animate-fadeIn z-20">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
                  isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Top Header Navbar */}
        <header className="glass-card p-4 md:px-6 md:py-4 rounded-2xl border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Academic Intelligence Platform
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-extrabold uppercase tracking-wider">
                Active Session
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">RAG Intelligence • Readability Transformer • Originality Auditor • Pedagogical Reviewer</p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Status Badge: API Key */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              stats?.api_key_connected 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 glow-emerald' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <KeyRound className="w-3.5 h-3.5" />
              {stats?.api_key_connected ? 'API Key Connected' : 'API Key Missing'}
            </span>

            {/* Status Badge: Model */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold glow-blue">
              <Cpu className="w-3.5 h-3.5" />
              {stats?.model_name || 'Gemini'}
            </span>

            {/* Status Badge: Memory */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700 text-xs font-bold">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              {stats?.active_chunks || 0} Vector Chunks
            </span>
          </div>
        </header>

        {/* Dynamic Router Views */}
        {activeTab === 'overview' && <Overview stats={stats} onNavigate={setActiveTab} />}
        {activeTab === 'rag' && <RagEngineView stats={stats} refreshStats={fetchStats} />}
        {activeTab === 'style' && <StyleTransformer stats={stats} />}
        {activeTab === 'originality' && <OriginalityAuditor />}
        {activeTab === 'critique' && <EssayCritiqueView />}
      </main>

      {/* System Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        stats={stats} 
        refreshStats={fetchStats} 
      />
    </div>
  );
}

