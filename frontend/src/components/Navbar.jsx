import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Sliders, 
  ShieldCheck, 
  FileText, 
  Settings, 
  GraduationCap,
  Sparkles,
  KeyRound,
  Cpu,
  Database,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  stats, 
  setIsSettingsOpen, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'rag', label: 'Grounded RAG QA', icon: BookOpen, badge: stats?.active_chunks ? `${stats.active_chunks}` : null },
    { id: 'style', label: 'Style Transformer', icon: Sliders },
    { id: 'originality', label: 'Originality Auditor', icon: ShieldCheck },
    { id: 'critique', label: 'Essay Reviewer', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0c121e]/90 backdrop-blur-2xl border-b border-slate-800/90 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => setActiveTab('overview')} 
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0c121e] animate-pulse" />
            </div>
            <div>
              <div className="font-black text-sm md:text-base text-white tracking-tight leading-tight flex items-center gap-1.5">
                Academic AI <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-[11px] text-slate-400 font-semibold tracking-wide hidden sm:block">
                Workspace Studio v2.0
              </div>
            </div>
          </div>

          {/* Desktop Center Navigation Pills */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Badges & Controls */}
          <div className="flex items-center gap-2.5">
            {/* Status Badge: API Key */}
            <span className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              stats?.api_key_connected 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 glow-emerald' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <KeyRound className="w-3.5 h-3.5" />
              {stats?.api_key_connected ? 'Connected' : 'Key Missing'}
            </span>

            {/* Status Badge: Model */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold glow-blue">
              <Cpu className="w-3.5 h-3.5" />
              {stats?.model_name || 'Gemini'}
            </span>

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-md group"
              title="System Credentials & Model Settings"
            >
              <Settings className="w-4 h-4 text-slate-400 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c121e] border-t border-slate-800/80 p-4 space-y-2 animate-fadeIn">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs transition-all ${
                  isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25' : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
