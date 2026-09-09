import React, { useState, useEffect } from 'react';
import { Search, Globe, ArrowRight, X, Sparkles, SpellCheck, MessagesSquare, Mic } from 'lucide-react';
import { registryEngine } from '../data/languageRegistry';
import { Language } from '../types';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onSelectLanguage?: (lang: Language) => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectLanguage
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent, but if needed
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickRoutes = [
    { label: 'Universal Translation', route: '/translate', icon: Sparkles },
    { label: 'Grammar Intelligence & Rules', route: '/grammar', icon: SpellCheck },
    { label: 'Live Dual-Speaker Stream', route: '/conversation', icon: MessagesSquare },
    { label: 'Speech & Voice Studio', route: '/voice', icon: Mic },
    { label: '7,191 Living Language Registry', route: '/languages', icon: Globe }
  ];

  const languageResults = query.trim()
    ? registryEngine.searchLanguages(query, {}, 8, 0).languages
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-[#EAE6DC] shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Input Box */}
        <div className="p-4 border-b border-[#EAE6DC] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#C5A059]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search languages, tools, or shortcuts..."
            className="flex-1 bg-transparent text-sm text-[#1A1918] focus:outline-none placeholder-[#9E9A90]"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8A857A] hover:text-[#1A1918] hover:bg-[#FAF8F5] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-3">
          {/* Quick Tools */}
          {!query && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9A90] px-3 mb-1 block">
                Quick Navigation
              </span>
              <div className="space-y-1">
                {quickRoutes.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.route}
                      onClick={() => {
                        onNavigate(tool.route);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#FAF8F5] text-xs font-semibold text-[#1A1918] transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-[#FAF4E6] text-[#8C6D23] flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span>{tool.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#9E9A90]" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Language Results */}
          {query && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9A90] px-3 mb-1 block">
                Languages Matching "{query}"
              </span>
              {languageResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#8A857A]">
                  No matching language found in index.
                </div>
              ) : (
                <div className="space-y-1">
                  {languageResults.map((lang) => (
                    <div
                      key={lang.id}
                      onClick={() => {
                        onNavigate('/translate');
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#FAF8F5] transition-colors cursor-pointer text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#1A1918] flex items-center gap-2">
                          <span>{lang.name}</span>
                          <span className="text-[10px] font-mono text-[#8C6D23] bg-[#FAF4E6] px-1.5 py-0.2 rounded border border-[#EEDBBA]">
                            {lang.iso_639_3}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#7A756C]">{lang.native_name} &bull; {lang.language_family}</div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#8C6D23] bg-[#FAF6EC] px-2 py-0.5 rounded-lg border border-[#E8DFC9]">
                        Open in Translator &rarr;
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-[#EAE6DC] bg-[#FCFBF8] flex items-center justify-between text-[11px] text-[#8A857A] px-4">
          <span>Navigate with <strong>↑ ↓</strong> and press <strong>Enter</strong></span>
          <span><strong>ESC</strong> to close</span>
        </div>
      </div>
    </div>
  );
};
