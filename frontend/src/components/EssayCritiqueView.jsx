import React, { useState } from 'react';
import { FileText, Sparkles, Loader2, Award } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const LEVELS = ["High School", "Undergraduate", "Postgraduate"];

export default function EssayCritiqueView() {
  const [essayDraft, setEssayDraft] = useState('');
  const [academicLevel, setAcademicLevel] = useState(LEVELS[1]);
  
  const [loading, setLoading] = useState(false);
  const [critique, setCritique] = useState(null);
  const [error, setError] = useState(null);

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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-400" /> Pedagogical Essay Reviewer & Tutor
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Receive multi-criteria rubric feedback on thesis clarity, argument structure, evidence support, and tone without AI ghostwriting.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Essay Submission Form */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Submit Essay Draft</h3>

            <textarea
              rows={12}
              placeholder="Paste student essay draft here for pedagogical evaluation..."
              value={essayDraft}
              onChange={(e) => setEssayDraft(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 resize-none font-sans leading-relaxed"
            />

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Academic Level Standard</label>
              <select
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
              >
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <button
              onClick={handleReview}
              disabled={loading || !essayDraft.trim()}
              className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
              {loading ? 'Analyzing Essay Draft...' : 'Review Essay Draft'}
            </button>
          </div>
        </div>

        {/* Right Column: Markdown Rubric Feedback */}
        <div className="lg:col-span-7">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 min-h-[500px]">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" /> Rubric Feedback & Mentorship
            </h3>

            {!critique ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center">
                <FileText className="w-12 h-12 stroke-1 mb-3 text-slate-600" />
                <p className="text-sm font-medium">Paste an essay draft on the left and click "Review Essay Draft" to generate feedback.</p>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4 font-sans animate-fadeIn">
                <ReactMarkdown>{critique}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
