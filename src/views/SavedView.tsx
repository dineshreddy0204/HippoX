import React, { useState, useEffect } from 'react';
import { 
  Bookmark, Folder, Tag, Search, Plus, Trash2, Copy, Check, 
  ExternalLink, Sparkles, AlertCircle
} from 'lucide-react';
import { SavedItem } from '../types';

export const SavedView: React.FC = () => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New item form
  const [newItem, setNewItem] = useState({
    title: '',
    source_text: '',
    output_text: '',
    source_language: 'eng',
    target_language: 'spa',
    category: 'translation' as const,
    folder: 'General',
    tags: 'Phrases, Important',
    notes: ''
  });

  const fetchSaved = async () => {
    try {
      const res = await fetch('/api/v1/saved');
      const data = await res.json();
      if (data.success) {
        setSavedItems(data.saved || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/v1/saved/${id}`, { method: 'DELETE' });
      setSavedItems(prev => prev.filter(s => s.id !== id));
    } catch (e) {}
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.source_text.trim() || !newItem.output_text.trim()) return;

    try {
      const res = await fetch('/api/v1/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newItem,
          tags: newItem.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });
      const data = await res.json();
      if (data.success && data.item) {
        setSavedItems(prev => [data.item, ...prev]);
        setIsAddModalOpen(false);
        setNewItem({
          title: '',
          source_text: '',
          output_text: '',
          source_language: 'eng',
          target_language: 'spa',
          category: 'translation',
          folder: 'General',
          tags: 'Phrases, Important',
          notes: ''
        });
      }
    } catch (e) {}
  };

  const folders = ['ALL', ...Array.from(new Set(savedItems.map(s => s.folder).filter(Boolean)))];

  const filteredItems = savedItems.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.output_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFolder = selectedFolder === 'ALL' || item.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4E6] border border-[#E8D9B4] text-xs font-bold text-[#8C6D23] mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Curated Lexicon</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1918]">Saved Translations & Phrasebook</h1>
          <p className="text-xs sm:text-sm text-[#6E6A61] mt-1">
            Organize high-value terminology, idiomatic phrases, and critical grammatical rules into custom folders.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="gold-gradient-btn px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Save New Phrase</span>
        </button>
      </div>

      {/* Folders & Search Strip */}
      <div className="p-4 rounded-2xl bg-white border border-[#EAE6DC] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#A69B88] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved phrases, tags, or folders..."
            className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] rounded-xl border border-[#E0DBD0] text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {folders.map(f => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f as string)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                selectedFolder === f
                  ? 'bg-[#1A1918] text-white'
                  : 'bg-[#FAF8F5] border border-[#E0DBD0] text-[#635F57] hover:bg-white'
              }`}
            >
              {f === 'ALL' ? 'All Folders' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Saved Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-[#EAE6DC] text-[#8A857A]">
            <Bookmark className="w-8 h-8 mx-auto mb-2 text-[#C5A059]" />
            <div className="text-xs font-bold text-[#1A1918]">No saved phrases yet</div>
            <div className="text-[11px]">Save phrases from the translation workspace or click "Save New Phrase"</div>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white border border-[#EAE6DC] hover:border-[#C5A059] transition-all shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 border-b border-[#F2EEE4] pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1A1918] truncate max-w-[200px]">{item.title}</span>
                    {item.folder && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF4E6] text-[#8C6D23] border border-[#EEDBBA]">
                        {item.folder}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-[#8A857A] hover:text-[#C53030] cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-[#635F57]">
                    <span className="font-bold text-[#8A857A] mr-1">Source:</span>
                    {item.source_text}
                  </div>
                  <div className="text-[#1A1918] font-medium bg-[#FAF8F2] p-2.5 rounded-xl border border-[#E8DEC7]">
                    <span className="font-bold text-[#8C6D23] mr-1">Target:</span>
                    {item.output_text}
                  </div>
                  {item.notes && (
                    <div className="text-[11px] text-[#7A756C] italic">
                      Note: {item.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Tags & Copy */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F2EEE4] text-xs">
                <div className="flex flex-wrap gap-1">
                  {item.tags?.map(t => (
                    <span key={t} className="px-1.5 py-0.5 rounded text-[9px] bg-[#FAF8F5] border border-[#E0DBD0] text-[#7A756C]">
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(item.output_text);
                    setCopiedId(item.id);
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="flex items-center gap-1 text-[11px] text-[#8C6D23] font-bold hover:text-[#1A1918] cursor-pointer"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-[#287D3C]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#EAE6DC] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="p-5 border-b border-[#EAE6DC] bg-[#FCFBF8] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1A1918]">Save Linguistic Phrase</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs text-[#8A857A] hover:text-[#1A1918]"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1A1918] block mb-1">Title / Identifier</label>
                <input
                  type="text"
                  required
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="e.g., Summit Opening Greeting"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DBD0] rounded-xl focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1A1918] block mb-1">Source Text</label>
                <textarea
                  required
                  rows={2}
                  value={newItem.source_text}
                  onChange={(e) => setNewItem({ ...newItem, source_text: e.target.value })}
                  placeholder="Original phrase..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DBD0] rounded-xl focus:outline-none focus:border-[#C5A059] resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#1A1918] block mb-1">Target Output Text</label>
                <textarea
                  required
                  rows={2}
                  value={newItem.output_text}
                  onChange={(e) => setNewItem({ ...newItem, output_text: e.target.value })}
                  placeholder="Translated or verified phrase..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DBD0] rounded-xl focus:outline-none focus:border-[#C5A059] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1918] block mb-1">Folder</label>
                  <input
                    type="text"
                    value={newItem.folder}
                    onChange={(e) => setNewItem({ ...newItem, folder: e.target.value })}
                    placeholder="e.g. Technical Papers"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DBD0] rounded-xl focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1A1918] block mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newItem.tags}
                    onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                    placeholder="AI, Spanish, Verbs"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DBD0] rounded-xl focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0DBD0] font-bold text-[#635F57]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-gradient-btn px-5 py-2 rounded-xl text-white font-bold cursor-pointer"
                >
                  Save Phrase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
