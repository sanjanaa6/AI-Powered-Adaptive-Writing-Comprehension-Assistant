import React, { useState } from 'react';
import { FileText, Sparkles, Loader2, Award, Copy, Check, BookMarked, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const LEVELS = ["High School", "Undergraduate", "Postgraduate"];

export default function EssayCritiqueView() {
  const [essayDraft, setEssayDraft] = useState('');
  const [academicLevel, setAcademicLevel] = useState(LEVELS[1]);
  
  const [loading, setLoading] = useState(false);
  const [critique, setCritique] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleReview = async () => {
    if (!essayDraft.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/critique/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          essay_draft: essayDraft,
          academic_level: academicLevel
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Essay review failed');

      setCritique(data.critique);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCritique = () => {
    if (critique) {
      navigator.clipboard.writeText(critique);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-amber-400" /> Pedagogical Essay Reviewer & Tutor
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Receive multi-criteria rubric evaluation on thesis clarity, argument structure, evidence support, and tone without AI ghostwriting.
          </p>
        </div>

        {/* Level Badges */}
        <div className="flex items-center gap-2">
          {LEVELS.map(lvl => (
            <button
              key={lvl}
              onClick={() => setAcademicLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                academicLevel === lvl 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md glow-amber' 
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold shadow-lg">
          {error}
        </div>
      )}

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Essay Submission Form */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Submit Essay Draft</span>
              <span className="text-xs font-semibold text-amber-400">{academicLevel} Level</span>
            </h3>

            <textarea
              rows={12}
              placeholder="Paste student essay draft here for pedagogical rubric evaluation..."
              value={essayDraft}
              onChange={(e) => setEssayDraft(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 resize-none font-sans leading-relaxed shadow-inner"
            />

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Academic Level Standard</label>
              <select
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
              >
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <button
              onClick={handleReview}
              disabled={loading || !essayDraft.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
              {loading ? 'Analyzing Essay Draft...' : 'Review Essay Draft'}
            </button>
          </div>
        </div>

        {/* Right Column: Markdown Rubric Feedback */}
        <div className="lg:col-span-7">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 min-h-[520px] shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Rubric Feedback & Mentorship
              </h3>
              {critique && (
                <button
                  onClick={copyCritique}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied Feedback' : 'Copy Feedback'}
                </button>
              )}
            </div>

            {!critique ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-500 text-center">
                <BookMarked className="w-14 h-14 stroke-1 mb-3 text-slate-600" />
                <p className="text-sm font-medium max-w-sm">Paste an essay draft on the left and click "Review Essay Draft" to generate pedagogical feedback.</p>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4 font-sans animate-fadeIn">
                <ReactMarkdown>{critique}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

