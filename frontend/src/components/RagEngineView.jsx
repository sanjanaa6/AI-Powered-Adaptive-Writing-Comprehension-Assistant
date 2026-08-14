
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
  Loader2
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

      setStatusMsg({ type: 'success', text: `Indexed "${data.filename}" into ${data.num_chunks} chunks!` });
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

      setStatusMsg({ type: 'success', text: `Indexed reference passage into ${data.num_chunks} chunks!` });
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
      setStatusMsg({ type: 'error', text: 'Failed to clear memory.' });
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" /> Grounded Academic Query Engine
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Ingest textbook chapters, lecture notes, or papers to answer queries with direct source citations.
          </p>
        </div>

        {stats?.active_chunks > 0 && (
          <button
            onClick={handleClearMemory}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all"
          >
            <Trash2 className="w-4 h-4" /> Clear Memory ({stats.active_chunks} chunks)
          </button>
        )}
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${statusMsg.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Document Ingestion */}
        <div className="lg:col-span-5 space-y-6">
          {/* File Upload Dropzone */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-400" /> 1. Upload Source Document
            </h3>

            <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl cursor-pointer bg-slate-900/50 hover:bg-blue-950/20 transition-all group">
              <input
                type="file"
                accept=".pdf,.txt,.docx"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <FileText className="w-10 h-10 text-slate-500 group-hover:text-blue-400 transition-colors mb-2" />
              <span className="text-sm font-medium text-slate-300 text-center">
                {file ? file.name : 'Click to select or drag & drop document'}
              </span>
              <span className="text-xs text-slate-500 mt-1">Supports PDF, TXT, DOCX</span>
            </label>

            {file && (
              <button
                onClick={handleFileUpload}
                disabled={uploading}
                className="w-full mt-4 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Ingesting File...' : 'Ingest Document'}
              </button>
            )}
          </div>

          {/* Paste Reference Text */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" /> 2. Paste Reference Text
            </h3>

            <input
              type="text"
              placeholder="Document Title (e.g. Chapter 4 Notes)"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 mb-3"
            />

            <textarea
              rows={5}
              placeholder="Paste reference text or lecture transcript here..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 resize-none"
            />

            <button
              onClick={handleTextIngest}
              disabled={indexingText || !pastedText.trim()}
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 disabled:opacity-50"
            >
              {indexingText ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {indexingText ? 'Indexing Text...' : 'Index Text Passage'}
            </button>
          </div>
        </div>

        {/* Right Column: Grounded QA Workspace */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-400" /> Ask Grounded Question
            </h3>

            <div className="relative">
              <input
                type="text"
                placeholder="e.g. What are the key conclusions regarding climate models?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                className="w-full px-4 py-3.5 pr-28 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleQuery}
                disabled={querying || !query.trim()}
                className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
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
              <div className="glass-card p-6 rounded-2xl border border-blue-500/30 bg-blue-950/10 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Grounded Answer
                  </h4>
                  <button
                    onClick={copyAnswer}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy Answer'}
                  </button>
                </div>

                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {ragResult.answer}
                </p>
              </div>

              {/* Source Passages Card */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Referenced Source Passages ({ragResult.sources?.length || 0})
                </h4>

                {(!ragResult.sources || ragResult.sources.length === 0) ? (
                  <p className="text-slate-500 text-sm italic">No relevant documents retrieved for this query.</p>
                ) : (
                  <div className="space-y-3">
                    {ragResult.sources.map((s, idx) => (
                      <div
                        key={idx}
                        className="border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleChunk(idx)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/40 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
                              Score: {s.score.toFixed(3)}
                            </span>
                            <span className="text-sm font-medium text-slate-200 truncate max-w-xs md:max-w-md">
                              {s.chunk?.doc_name}
                            </span>
                          </div>
                          {openChunks[idx] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>

                        {openChunks[idx] && (
                          <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/40">
                            <div className="text-xs font-mono text-slate-500 mb-1">ID: {s.chunk?.id}</div>
                            <p className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap bg-slate-900 p-3 rounded-lg border border-slate-800">
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
