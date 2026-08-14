import React, { useState } from 'react';
import { X, Key, Cpu, Check, Loader2, ShieldAlert, Sparkles } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, stats, refreshStats }) {
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState(stats?.model_name || 'gemini-2.5-flash');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    try {
      const payload = { model_name: modelName };
      if (apiKey.trim()) {
        payload.api_key = apiKey.trim();
      }

      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save settings');

      await refreshStats();
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1200);
    } catch (err) {
      alert('Error updating system configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card w-full max-w-md rounded-3xl border border-slate-700/80 p-6 shadow-2xl space-y-6 bg-[#0c121e]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-400" /> System Credentials & LLM Engine
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${stats?.api_key_connected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 glow-emerald' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                {stats?.api_key_connected ? 'Active' : 'Missing'}
              </span>
            </label>
            <input
              type="password"
              placeholder="Paste custom Gemini API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500 shadow-inner"
            />
            <p className="text-[11px] text-slate-500 mt-1.5 font-medium">Leave blank to use environment default API key.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-400" /> LLM Model Selection
            </label>
            <select
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm font-semibold focus:outline-none focus:border-purple-500"
            >
              {(stats?.available_models || ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"]).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-600/25 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Credentials'}
          </button>
        </div>
      </div>
    </div>
  );
}

