import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Loader2, Search, Copy, Check } from 'lucide-react';

export default function OriginalityAuditor() {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [ngramSize, setNgramSize] = useState(5);
  
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [copiedPhrase, setCopiedPhrase] = useState(null);

  const handleAudit = async () => {
    if (!sourceText.trim() || !targetText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/originality/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_text: sourceText,
          target_text: targetText,
          ngram_size: ngramSize
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Audit failed');

      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyPhrase = (phrase) => {
    navigator.clipboard.writeText(phrase);
    setCopiedPhrase(phrase);
    setTimeout(() => setCopiedPhrase(null), 2000);
  };

  const getRiskBadge = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high risk':
      case 'high':
        return <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> High Risk</span>;
      case 'moderate risk':
      case 'medium risk':
      case 'medium':
        return <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Moderate Risk</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Low Risk</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" /> Originality & Academic Integrity Auditor
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Detect TF-IDF cosine similarity, evaluate plagiarism risk, and identify exact n-gram phrase overlaps between source texts and student drafts.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Input Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Text Input */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Original Source Passage</h3>
          <textarea
            rows={7}
            placeholder="Paste reference text or original source passage here..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 resize-none font-sans"
          />
        </div>

        {/* Target Text Input */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Target Passage (Student Draft)</h3>
          <textarea
            rows={7}
            placeholder="Paste target student draft text here to compare..."
            value={targetText}
            onChange={(e) => setTargetText(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 resize-none font-sans"
          />
        </div>
      </div>

      {/* Control Bar & Audit Button */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:w-1/2 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>N-gram Phrase Overlap Length</span>
            <span className="text-emerald-400">{ngramSize} Words</span>
          </div>
          <input
            type="range"
            min={3}
            max={8}
            value={ngramSize}
            onChange={(e) => setNgramSize(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        <button
          onClick={handleAudit}
          disabled={loading || !sourceText.trim() || !targetText.trim()}
          className="w-full md:w-auto min-w-[200px] py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? 'Auditing Similarity...' : 'Run Similarity Audit'}
        </button>
      </div>

      {/* Audit Report Workspace */}
      {report && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Cosine Similarity Card */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cosine Similarity Score</div>
              <div className="text-4xl font-extrabold text-white tracking-tight">{report.similarity_percentage}%</div>
              <div className="text-xs text-slate-500 mt-2">TF-IDF Vector Cosine Metric</div>
            </div>

            {/* Risk Indicator Card */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Academic Risk Level</div>
              {getRiskBadge(report.risk_level)}
            </div>

            {/* Overlap Count Card */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Matching Phrases</div>
              <div className="text-4xl font-extrabold text-emerald-400 tracking-tight">{report.n_gram_match_count}</div>
              <div className="text-xs text-slate-500 mt-2">{ngramSize}-gram exact phrase overlaps</div>
            </div>
          </div>

          {/* Phrase Matches Chips Card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Detected Phrase Overlaps ({report.n_gram_matches?.length || 0})
            </h4>

            {(!report.n_gram_matches || report.n_gram_matches.length === 0) ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> No exact {ngramSize}-gram phrase overlaps detected. High originality!
              </div>
            ) : (
              <div className="space-y-2.5">
                {report.n_gram_matches.map((phrase, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-between gap-4 group hover:border-amber-500 transition-colors"
                  >
                    <span className="text-sm font-mono text-amber-200">
                      "{phrase}"
                    </span>
                    <button
                      onClick={() => copyPhrase(phrase)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="Copy matching phrase"
                    >
                      {copiedPhrase === phrase ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
