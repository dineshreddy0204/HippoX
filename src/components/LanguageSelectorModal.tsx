import React, { useState, useMemo } from 'react';
import { 
  Search, Check, Star, Globe, X, Sparkles, Filter, CheckCircle2, 
  AlertTriangle, AlertCircle, XCircle
} from 'lucide-react';
import { Language, CapabilityStatus } from '../types';
import { CANONICAL_LANGUAGES, registryEngine } from '../data/languageRegistry';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCode: string;
  onSelect: (language: Language) => void;
  title?: string;
  includeAutoDetect?: boolean;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCode,
  onSelect,
  title = 'Select Language',
  includeAutoDetect = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedCapability, setSelectedCapability] = useState<'all' | 'asr' | 'translation' | 'grammar' | 'tts'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 30;

  const families = [
    'ALL',
    'Indo-European',
    'Sino-Tibetan',
    'Afroasiatic',
    'Austronesian',
    'Niger-Congo',
    'Dravidian',
    'Turkic',
    'Japonic',
    'Koreanic',
    'Uralic',
    'Kartvelian'
  ];

  const regions = [
    'ALL',
    'Global',
    'Americas',
    'Europe',
    'East Asia',
    'South Asia',
    'Middle East',
    'Southeast Asia',
    'East Africa',
    'West Africa'
  ];

  const { total, languages: filteredLanguages } = useMemo(() => {
    const trimmed = searchQuery.trim();
    // When searching by text (name, native script, ISO code), search complete 7,191 registry
    return registryEngine.searchLanguages(
      trimmed,
      {
        family: trimmed ? undefined : selectedFamily,
        region: trimmed ? undefined : selectedRegion,
        capability: selectedCapability === 'all' ? undefined : selectedCapability,
        favoritesOnly
      },
      Math.max(100, pageSize * page),
      0
    );
  }, [searchQuery, selectedFamily, selectedRegion, selectedCapability, favoritesOnly, page]);

  if (!isOpen) return null;

  const renderStatusBadge = (status: CapabilityStatus, label: string) => {
    const config = {
      FULL: { icon: CheckCircle2, text: 'text-[#287D3C] bg-[#EAF5EC] border-[#CDE5D2]', label: '✓ ' + label },
      PARTIAL: { icon: AlertTriangle, text: 'text-[#B07A10] bg-[#FFF8E6] border-[#F0DFB5]', label: '⚠ ' + label },
      EXPERIMENTAL: { icon: AlertCircle, text: 'text-[#8E5BAE] bg-[#F7F0FA] border-[#E8D6ED]', label: '🧪 ' + label },
      UNAVAILABLE: { icon: XCircle, text: 'text-[#8A857A] bg-[#F4F1EB] border-[#E5E0D6]', label: '✕ ' + label }
    }[status];

    return (
      <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded border ${config.text} whitespace-nowrap`}>
        {config.label}
      </span>
    );
  };

  const isAutoDetectVisible = includeAutoDetect && (
    !searchQuery.trim() || 
    'auto detect language'.includes(searchQuery.toLowerCase().trim()) ||
    'detect'.includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#1A1918]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EAE6DC] shadow-2xl w-full max-w-4xl max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE6DC] flex items-center justify-between bg-[#FCFBF8]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F4EAD2] text-[#8C6D23] flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1A1918]">{title}</h2>
              <p className="text-[11px] sm:text-xs text-[#7A766D]">
                Search all 7,191 living languages by name, native script, or ISO code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A766D] hover:text-[#1A1918] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Search Bar at Very Top Above Language List */}
        <div className="p-3 sm:p-4 border-b border-[#EAE6DC] bg-[#FAF8F5] space-y-2.5 sticky top-0 z-10 shadow-xs">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#8C6D23] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search language..."
              className="w-full pl-10 pr-20 py-2.5 sm:py-3 bg-white rounded-xl border border-[#DCD6C7] text-sm text-[#1A1918] placeholder-[#9E9A90] font-medium focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 shadow-xs transition-all"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setPage(1); }}
                className="absolute right-3 px-2 py-1 text-xs font-semibold text-[#8C6D23] hover:text-[#1A1918] bg-[#F4EAD2] rounded-lg transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filters / Search Context */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {searchQuery.trim() ? (
              <div className="text-[11px] font-semibold text-[#8C6D23] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Searching all 7,191 living languages: <strong>{total}</strong> {total === 1 ? 'match' : 'matches'}</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] overflow-x-auto max-w-full pb-0.5">
                <span className="text-[#8A857A] font-semibold">Family:</span>
                {families.slice(0, 5).map((fam) => (
                  <button
                    key={fam}
                    onClick={() => { setSelectedFamily(fam); setPage(1); }}
                    className={`px-2 py-0.5 rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                      selectedFamily === fam
                        ? 'bg-[#1A1918] text-white border-[#1A1918] font-bold'
                        : 'bg-white border-[#E0DBD0] text-[#615E57] hover:bg-[#F4F1EA]'
                    }`}
                  >
                    {fam}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border transition-all cursor-pointer shrink-0 ${
                favoritesOnly
                  ? 'bg-[#F4EAD2] border-[#C5A059] text-[#8C6D23]'
                  : 'bg-white border-[#E0DBD0] text-[#615E57] hover:bg-[#FAF8F5]'
              }`}
            >
              <Star className={`w-3 h-3 ${favoritesOnly ? 'fill-[#C5A059] text-[#C5A059]' : ''}`} />
              Favorites
            </button>
          </div>
        </div>

        {/* Language Grid & List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {isAutoDetectVisible && (
            <div
              onClick={() => {
                onSelect({
                  id: 'auto',
                  iso_639_3: 'auto',
                  name: 'Auto Detect Language',
                  native_name: 'Detect Language',
                  script: 'All Scripts',
                  language_family: 'Universal Multi-Engine',
                  region: 'Global',
                  countries: [],
                  speaker_estimate: 0,
                  asr_status: 'FULL',
                  translation_status: 'FULL',
                  grammar_status: 'FULL',
                  tts_status: 'FULL',
                  ocr_status: 'FULL',
                  conversation_status: 'FULL',
                  available_models: ['Gemini 2.5 Flash'],
                  fallback_models: []
                });
                onClose();
              }}
              className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedCode === 'auto'
                  ? 'bg-[#F4EAD2] border-[#C5A059] shadow-xs'
                  : 'bg-white border-[#EAE6DC] hover:border-[#C5A059]/60 hover:bg-[#FBF9F5]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1A1918] to-[#383329] text-[#E8D49E] flex items-center justify-center font-bold text-xs">
                  ✨
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1918]">Auto Detect Language</div>
                  <div className="text-[11px] text-[#7A756C]">Neural automatic source dialect classification</div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#8C6D23] font-bold border border-[#E4D5B1]">
                AUTO
              </span>
            </div>
          )}

          {filteredLanguages.length === 0 ? (
            <div className="py-12 text-center text-[#8A857A]">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-[#C5A059]" />
              <div className="text-xs font-semibold text-[#1A1918]">No language found for "{searchQuery}"</div>
              <div className="text-[11px] mt-1">Try typing the English name, native script, or 3-letter ISO 639-3 code</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              {filteredLanguages.map((lang) => {
                const isSelected = selectedCode === lang.iso_639_3 || selectedCode === lang.iso_639_1;

                return (
                  <div
                    key={lang.id}
                    onClick={() => {
                      onSelect(lang);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#F9F5EC] border-[#C5A059] shadow-xs ring-1 ring-[#C5A059]'
                        : 'bg-white border-[#ECE8DE] hover:border-[#D6CAAD] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1A1918]">{lang.name}</span>
                          <span className="text-[10px] font-mono text-[#8C6D23] bg-[#FAF4E6] px-1.5 py-0.2 rounded border border-[#EEDBBA]">
                            {lang.iso_639_3}
                          </span>
                        </div>
                        <div className="text-xs text-[#6E6A60] font-medium mt-0.5">
                          {lang.native_name}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#C5A059] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#8C877D] border-t border-[#F2EEE4] pt-2 mt-1">
                      <span className="truncate max-w-[130px] sm:max-w-[150px]">{lang.language_family}</span>
                      <div className="flex items-center gap-1">
                        {renderStatusBadge(lang.asr_status, 'ASR')}
                        {renderStatusBadge(lang.translation_status, 'Trans')}
                        {renderStatusBadge(lang.grammar_status, 'Gram')}
                        {renderStatusBadge(lang.tts_status, 'TTS')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Pagination */}
          {filteredLanguages.length < total && (
            <div className="pt-3 pb-2 text-center">
              <button
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-xl bg-[#FAF6EC] border border-[#E2D4B2] text-xs font-bold text-[#8C6D23] hover:bg-[#F4EAD2] transition-colors cursor-pointer"
              >
                Load More Results ({filteredLanguages.length} of {total})
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-3.5 border-t border-[#EAE6DC] bg-[#FCFBF8] flex items-center justify-between text-xs text-[#7A756C]">
          <span>
            Living Languages Indexed: <strong>7,191</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#1A1918] text-white font-bold hover:bg-[#33312B] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
