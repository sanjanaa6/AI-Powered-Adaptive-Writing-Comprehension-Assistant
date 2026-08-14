
import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Search,
  Trash2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Loader2,
  Sparkles,
  Layers,
  Database
} from 'lucide-react';

export default function RagEngineView({ stats, refreshStats }) {
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [docName, setDocName] = useState('');
  const [query, setQuery] = useState('');

  const [uploading, setUploading] = useState(false);
  const [indexingText, setIndexingText] = useState(false);
  const [querying, setQuerying] = useState(false);

  const [ragResult, setRagResult] = useState(null);
  const [openChunks, setOpenChunks] = useState({});
  const [statusMsg, setStatusMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files?.[0] || file;
    if (!selectedFile) return;

    setUploading(true);
    setStatusMsg(null);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/rag/ingest-file', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'File ingestion failed');

      setStatusMsg({ type: 'success', text: `Successfully indexed "${data.filename}" into ${data.num_chunks} vector chunks!` });
      setFile(null);
      refreshStats();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleTextIngest = async () => {
    if (!pastedText.trim()) return;
    setIndexingText(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/rag/ingest-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pastedText, doc_name: docName.trim() || 'Pasted_Reference' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Text ingestion failed');

      setStatusMsg({ type: 'success', text: `Indexed reference passage into ${data.num_chunks} vector chunks!` });
      setPastedText('');
      setDocName('');
      refreshStats();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setIndexingText(false);
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) return;
    setQuerying(true);
    setRagResult(null);

    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Query processing failed');

      setRagResult(data);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setQuerying(false);
    }
  };

  const handleClearMemory = async () => {
    if (!confirm('Clear all indexed documents and vector memory?')) return;
    try {
      await fetch('/api/rag/memory', { method: 'DELETE' });
      setStatusMsg({ type: 'success', text: 'Vector memory cleared successfully.' });
      setRagResult(null);
      refreshStats();
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to clear vector memory.' });
    }
  };

  const toggleChunk = (idx) => {
    setOpenChunks(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const copyAnswer = () => {
    if (ragResult?.answer) {
      navigator.clipboard.writeText(ragResult.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-400" /> Grounded Academic Query Engine
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Ingest textbook chapters, lecture notes, or PDFs to answer student queries with direct factual citations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-blue-400" /> {stats?.active_chunks || 0} Chunks
          </span>
          {stats?.active_chunks > 0 && (
            <button
              onClick={handleClearMemory}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Memory
            </button>
          )}
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-sm font-semibold shadow-lg ${statusMsg.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 glow-emerald'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Document Ingestion */}
        <div className="lg:col-span-5 space-y-6">
          {/* File Upload Dropzone */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-400" /> 1. Upload Source Document
            </h3>

            <label className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl cursor-pointer bg-slate-900/60 hover:bg-blue-950/20 transition-all group shadow-inner">
              <input
                type="file"
                accept=".pdf,.txt,.docx"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <FileText className="w-12 h-12 text-slate-500 group-hover:text-blue-400 transition-all mb-3 group-hover:scale-110" />
              <span className="text-sm font-semibold text-slate-200 text-center">
                {file ? file.name : 'Select or drag & drop document'}
              </span>
              <span className="text-xs text-slate-500 mt-1">Supports PDF, TXT, DOCX</span>
            </label>

            {file && (
              <button
                onClick={handleFileUpload}
                disabled={uploading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Ingesting File...' : 'Ingest Document into Memory'}
              </button>
            )}
          </div>

          {/* Paste Reference Text */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" /> 2. Paste Reference Passage
            </h3>

            <input
              type="text"
              placeholder="Document Title (e.g. Chapter 4 Summary)"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
            />

            <textarea
              rows={5}
              placeholder="Paste reference passage or lecture notes here..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 resize-none font-mono leading-relaxed"
            />

            <button
              onClick={handleTextIngest}
              disabled={indexingText || !pastedText.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 disabled:opacity-50"
            >
              {indexingText ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {indexingText ? 'Indexing Text...' : 'Index Text Passage'}
            </button>
          </div>
        </div>

        {/* Right Column: Grounded QA Workspace */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-400" /> Ask Factually Grounded Question
            </h3>

            <div className="relative">
              <input
                type="text"
                placeholder="e.g. What conclusions does the document state regarding global warming?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                className="w-full px-4 py-3.5 pr-28 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 shadow-inner"
              />
              <button
                onClick={handleQuery}
                disabled={querying || !query.trim()}
                className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50 shadow-md shadow-blue-600/25"
              >
                {querying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                {querying ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Results Workspace */}
          {ragResult && (
            <div className="space-y-6 animate-fadeIn">
              {/* Answer Card */}
              <div className="glass-card p-6 rounded-3xl border border-blue-500/30 bg-blue-950/20 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Grounded Fact-Based Answer
                  </h4>
                  <button
                    onClick={copyAnswer}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy Answer'}
                  </button>
                </div>

                <p className="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {ragResult.answer}
                </p>
              </div>

              {/* Source Passages Card */}
              <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Referenced Source Passages ({ragResult.sources?.length || 0})</span>
                  <span className="text-[11px] text-blue-400 font-semibold">Ranked by Cosine Relevance</span>
                </h4>

                {(!ragResult.sources || ragResult.sources.length === 0) ? (
                  <p className="text-slate-500 text-xs italic">No relevant source passages retrieved for this query.</p>
                ) : (
                  <div className="space-y-3">
                    {ragResult.sources.map((s, idx) => (
                      <div
                        key={idx}
                        className="border border-slate-800 rounded-2xl bg-slate-900/80 overflow-hidden transition-all hover:border-slate-700"
                      >
                        <button
                          onClick={() => toggleChunk(idx)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold font-mono">
                              Score: {s.score.toFixed(3)}
                            </span>
                            <span className="text-xs font-semibold text-slate-200 truncate max-w-xs md:max-w-md">
                              {s.chunk?.doc_name}
                            </span>
                          </div>
                          {openChunks[idx] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>

                        {openChunks[idx] && (
                          <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
                            <div className="text-[10px] font-mono text-slate-500">Chunk ID: {s.chunk?.id}</div>
                            <p className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap bg-slate-900 p-3 rounded-xl border border-slate-800">
                              {s.chunk?.text}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

