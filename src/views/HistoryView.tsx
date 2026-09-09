import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, Search, Trash2, Download, Filter, 
  CheckCircle2, AlertCircle, Copy, ArrowRight, Check
} from 'lucide-react';
import { HistoryRecord } from '../types';

export const HistoryView: React.FC = () => {
  const [historyList, setHistoryList] = useState<HistoryRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/v1/history');
      const data = await res.json();
      if (data.success) {
        setHistoryList(data.history || []);
      }
    } catch (e) {
      // Error handling
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/v1/history/${id}`, { method: 'DELETE' });
      setHistoryList(prev => prev.filter(h => h.id !== id));
    } catch (e) {}
  };

  const handleClearAll = async () => {
    try {
      await fetch('/api/v1/history', { method: 'DELETE' });
      setHistoryList([]);
      setConfirmClearOpen(false);
    } catch (e) {}
  };

  const handleExport = (format: 'json' | 'csv') => {
    let content = '';
    let mime = 'text/plain';
    let filename = `HippoX_History_${Date.now()}.${format}`;

    if (format === 'json') {
      content = JSON.stringify(historyList, null, 2);
      mime = 'application/json';
    } else {
      content = 'ID,Timestamp,Type,SourceLang,TargetLang,SourceText,TranslatedText,Confidence,Provider\n' +
        historyList.map(h =>
          `"${h.id}","${h.timestamp}","${h.task_type}","${h.source_language}","${h.target_language}","${(h.source_text || '').replace(/"/g, '""')}","${(h.translated_text || '').replace(/"/g, '""')}","${h.confidence}","${h.provider}"`
        ).join('\n');
      mime = 'text/csv';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const filteredHistory = historyList.filter(item => {
    const matchesSearch =
      item.source_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translated_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source_language?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.target_language?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTask = taskFilter === 'all' || item.task_type === taskFilter;
    return matchesSearch && matchesTask;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4E6] border border-[#E8D9B4] text-xs font-bold text-[#8C6D23] mb-2">
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>Activity Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1918]">Linguistic Execution History</h1>
          <p className="text-xs sm:text-sm text-[#6E6A61] mt-1">
            Browse and export all past translation, grammar, and voice requests with latency telemetry.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('json')}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E0DBD0] text-xs font-bold text-[#1A1918] hover:bg-[#FAF8F5] flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E0DBD0] text-xs font-bold text-[#1A1918] hover:bg-[#FAF8F5] flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Export CSV</span>
          </button>
          {confirmClearOpen ? (
            <div className="flex items-center gap-1.5 animate-in fade-in">
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 rounded-xl bg-[#E53E3E] text-white text-xs font-bold hover:bg-[#C53030] transition-colors cursor-pointer"
              >
                Confirm Clear
              </button>
              <button
                onClick={() => setConfirmClearOpen(false)}
                className="px-2.5 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E0DBD0] text-xs font-medium text-[#635F57] hover:text-[#1A1918] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClearOpen(true)}
              disabled={historyList.length === 0}
              className="p-2 rounded-xl bg-white border border-[#E0DBD0] text-xs text-[#8A857A] hover:text-[#C53030] hover:border-[#FED7D7] transition-colors cursor-pointer disabled:opacity-40"
              title="Clear All History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search */}
      <div className="p-4 rounded-2xl bg-white border border-[#EAE6DC] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#A69B88] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search text, language code, or task..."
            className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] rounded-xl border border-[#E0DBD0] text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {(['all', 'translation', 'grammar', 'voice'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTaskFilter(t)}
              className={`px-3 py-1.5 rounded-xl capitalize text-xs font-bold transition-colors cursor-pointer ${
                taskFilter === t
                  ? 'bg-[#1A1918] text-white'
                  : 'bg-[#FAF8F5] border border-[#E0DBD0] text-[#635F57] hover:bg-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#EAE6DC] text-[#8A857A]">
            <HistoryIcon className="w-8 h-8 mx-auto mb-2 text-[#C5A059]" />
            <div className="text-xs font-bold text-[#1A1918]">No history records found</div>
            <div className="text-[11px]">Completed tasks will be recorded here automatically</div>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white border border-[#EAE6DC] hover:border-[#C5A059] transition-all shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between gap-2 border-b border-[#F2EEE4] pb-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#FAF4E6] text-[#8C6D23] border border-[#EEDBBA]">
                    {item.task_type}
                  </span>
                  <span className="font-mono text-[11px] text-[#4A4740]">
                    {item.source_language?.toUpperCase()} &rarr; {item.target_language?.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-[#8A857A]">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.latency_ms && (
                    <span className="text-[10px] font-mono text-[#8A857A]">{item.latency_ms}ms</span>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-[#8A857A] hover:text-[#C53030] cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE6DC] space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#8A857A]">Source</span>
                  <p className="text-[#1A1918] leading-relaxed select-text">{item.source_text}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#E8DEC7] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#8C6D23]">Result</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.translated_text || '');
                        setCopiedId(item.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                      className="text-[10px] text-[#8C6D23] hover:text-[#1A1918] cursor-pointer flex items-center gap-1"
                    >
                      {copiedId === item.id ? <Check className="w-3 h-3 text-[#287D3C]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[#1A1918] leading-relaxed select-text">{item.translated_text}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
