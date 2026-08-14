import React, { useState } from 'react';
import { Sliders, Sparkles, ArrowRight, Loader2, BarChart2, TrendingUp, TrendingDown } from 'lucide-react';

const TONES = ["Academic / Formal", "Informal / Conversational", "Technical", "Simplified"];
const LENGTHS = ["Maintain Original", "Concise Summary", "Expanded Detail"];

export default function StyleTransformer({ stats }) {
  const gradeTargets = stats?.grade_level_targets || [
    "High School (Grades 9-12)",
    "Middle School (Grades 6-8)",
    "Elementary (Grades 1-5)",
    "Undergraduate (College)",
    "Postgraduate / Academic Research"
  ];

  const [inputText, setInputText] = useState('');
  const [tone, setTone] = useState(TONES[0]);
  const [readingLevel, setReadingLevel] = useState(gradeTargets[0] || "High School (Grades 9-12)");
  const [lengthOpt, setLengthOpt] = useState(LENGTHS[0]);
  const [customInst, setCustomInst] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTransform = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/style/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          tone,
          reading_level: readingLevel,
          length: lengthOpt,
          custom_instruction: customInst
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Transformation failed');

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const origMetrics = result?.metrics_original || {};
  const transMetrics = result?.metrics_transformed || {};

  const fkDelta = (transMetrics.flesch_kincaid_grade || 0) - (origMetrics.flesch_kincaid_grade || 0);
  const freDelta = (transMetrics.flesch_reading_ease || 0) - (origMetrics.flesch_reading_ease || 0);
  const wcDelta = (transMetrics.word_count || 0) - (origMetrics.word_count || 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-purple-400" /> Style & Readability Transformer
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Transform tone, complexity, and target reading level while tracking readability metric deltas in real time.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Inputs & Options */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="text-base font-bold text-white">Original Draft Text</h3>

          <textarea
            rows={8}
            placeholder="Paste text passage here to rewrite, simplify, or adapt tone..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 resize-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Target Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              >
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Target Grade</label>
              <select
                value={readingLevel}
                onChange={(e) => setReadingLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              >
                {gradeTargets.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Length</label>
              <select
                value={lengthOpt}
                onChange={(e) => setLengthOpt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
              >
                {LENGTHS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Custom Instruction (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Include bullet points or concrete examples"
              value={customInst}
              onChange={(e) => setCustomInst(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            onClick={handleTransform}
            disabled={loading || !inputText.trim()}
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Transforming Style...' : 'Transform Text Style'}
          </button>
        </div>

        {/* Right: Transformed Output & Metrics */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Transformed Output</span>
              {result && (
                <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  Transformed
                </span>
              )}
            </h3>

            <textarea
              rows={8}
              readOnly
              placeholder="Transformed text output will appear here..."
              value={result?.transformed_text || ''}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-600 text-sm focus:outline-none resize-none font-sans leading-relaxed"
            />
          </div>

          {/* Metrics Comparison */}
          {result && (
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 animate-fadeIn">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-400" /> Quantitative Readability Impact
              </h4>

              <div className="grid grid-cols-3 gap-4">
                {/* FK Grade */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-xs font-medium text-slate-400 mb-1">FK Grade Level</div>
                  <div className="text-2xl font-bold text-white">{transMetrics.flesch_kincaid_grade || 0}</div>
                  <div className={`text-xs font-semibold mt-1 inline-flex items-center gap-1 ${fkDelta <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {fkDelta <= 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                    {fkDelta > 0 ? `+${fkDelta.toFixed(1)}` : fkDelta.toFixed(1)}
                  </div>
                </div>

                {/* Reading Ease */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-xs font-medium text-slate-400 mb-1">Flesch Reading Ease</div>
                  <div className="text-2xl font-bold text-white">{transMetrics.flesch_reading_ease || 0}</div>
                  <div className={`text-xs font-semibold mt-1 inline-flex items-center gap-1 ${freDelta >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {freDelta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {freDelta > 0 ? `+${freDelta.toFixed(1)}` : freDelta.toFixed(1)}
                  </div>
                </div>

                {/* Word Count */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-xs font-medium text-slate-400 mb-1">Word Count</div>
                  <div className="text-2xl font-bold text-white">{transMetrics.word_count || 0}</div>
                  <div className="text-xs font-semibold text-slate-400 mt-1">
                    {wcDelta >= 0 ? `+${wcDelta}` : wcDelta} words
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
