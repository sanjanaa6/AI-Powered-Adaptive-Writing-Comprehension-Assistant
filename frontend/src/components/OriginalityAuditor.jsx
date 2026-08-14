import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Loader2, Search, Copy, Check, FileDown } from 'lucide-react';

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

  const downloadReport = () => {
    if (!report) return;
    const content = `ACADEMIC INTEGRITY & SIMILARITY REPORT
------------------------------------------------
Cosine Similarity Score: ${report.similarity_percentage}%
Risk Level: ${report.risk_level}
N-Gram Phrase Overlaps (${ngramSize}-words): ${report.n_gram_match_count}

MATCHING PHRASES DETECTED:
${(report.n_gram_matches || []).map(p => `- "${p}"`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `originality_audit_report.txt`;
    a.click();
  };

  const getRiskBadge = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high risk':
      case 'high':
        return <span className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-red-500/10"><AlertTriangle className="w-4 h-4" /> High Risk</span>;
      case 'moderate risk':
      case 'medium risk':
      case 'medium':
        return <span className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/10"><AlertTriangle className="w-4 h-4" /> Moderate Risk</span>;
      default:
        return <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg glow-emerald"><CheckCircle2 className="w-4 h-4" /> High Originality (Low Risk)</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" /> Originality & Academic Integrity Auditor
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Detect TF-IDF cosine similarity, evaluate plagiarism risk, and isolate exact n-gram phrase overlaps between source texts and student drafts.
          </p>
        </div>

        {report && (
          <button
            onClick={downloadReport}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <FileDown className="w-4 h-4 text-emerald-400" /> Export Audit Report
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold shadow-lg">
          {error}
        </div>
      )}

      {/* Input Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Text Input */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            <span>Original Source Reference</span>
            <span className="text-xs font-semibold text-slate-400">Source Text</span>
          </h3>
          <textarea
            rows={7}
            placeholder="Paste reference text or original source passage here..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 resize-none font-sans leading-relaxed shadow-inner"
          />
        </div>

        {/* Target Text Input */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            <span>Target Student Draft</span>
            <span className="text-xs font-semibold text-slate-400">Target Draft</span>
          </h3>
          <textarea
            rows={7}
            placeholder="Paste target student draft text here to compare..."
            value={targetText}
            onChange={(e) => setTargetText(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 resize-none font-sans leading-relaxed shadow-inner"
          />
        </div>
      </div>

      {/* Control Bar & Audit Button */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="w-full md:w-1/2 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>N-gram Phrase Overlap Window</span>
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
          className="w-full md:w-auto min-w-[220px] py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 disabled:opacity-50"
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
            <div className="glass-card p-6 rounded-3xl border border-slate-800 text-center space-y-1 shadow-xl">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cosine Similarity Score</div>
              <div className="text-4xl font-black text-white tracking-tight">{report.similarity_percentage}%</div>
              <div className="text-[11px] text-slate-500">TF-IDF Vector Cosine Distance</div>
            </div>

            {/* Risk Indicator Card */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center shadow-xl">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Academic Risk Evaluation</div>
              {getRiskBadge(report.risk_level)}
            </div>

            {/* Overlap Count Card */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 text-center space-y-1 shadow-xl">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matching Phrases</div>
              <div className="text-4xl font-black text-emerald-400 tracking-tight">{report.n_gram_match_count}</div>
              <div className="text-[11px] text-slate-500">{ngramSize}-gram exact phrase overlaps</div>
            </div>
          </div>

          {/* Phrase Matches Chips Card */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Detected Exact Phrase Overlaps ({report.n_gram_matches?.length || 0})</span>
              <span className="text-emerald-400 font-normal text-[11px]">Click phrase copy shortcut</span>
            </h4>

            {(!report.n_gram_matches || report.n_gram_matches.length === 0) ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center gap-2 glow-emerald">
                <CheckCircle2 className="w-5 h-5" /> No exact {ngramSize}-gram phrase overlaps detected. High originality verified!
              </div>
            ) : (
              <div className="space-y-2.5">
                {report.n_gram_matches.map((phrase, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-between gap-4 group hover:border-amber-500 transition-colors shadow-inner"
                  >
                    <span className="text-xs font-mono text-amber-200 leading-relaxed">
                      "{phrase}"
                    </span>
                    <button
                      onClick={() => copyPhrase(phrase)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
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

