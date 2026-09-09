import React, { useState, useMemo } from 'react';
import { 
  Globe2, Search, Filter, CheckCircle2, AlertTriangle, AlertCircle, 
  XCircle, ArrowUpRight, ShieldCheck, ChevronRight, X, ExternalLink,
  Sparkles, Layers
} from 'lucide-react';
import { Language, CapabilityStatus } from '../types';
import { registryEngine } from '../data/languageRegistry';

export const LanguagesView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [family, setFamily] = useState('ALL');
  const [region, setRegion] = useState('ALL');
  const [capability, setCapability] = useState<'all' | 'asr' | 'translation' | 'grammar' | 'tts'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 40;

  const families = [
    'ALL', 'Indo-European', 'Sino-Tibetan', 'Afroasiatic', 'Austronesian',
    'Niger-Congo', 'Dravidian', 'Turkic', 'Japonic', 'Koreanic', 'Uralic', 'Kartvelian'
  ];

  const regions = [
    'ALL', 'Global', 'Americas', 'Europe', 'East Asia', 'South Asia',
    'Middle East', 'Southeast Asia', 'East Africa', 'West Africa'
  ];

  const { total, languages } = useMemo(() => {
    return registryEngine.searchLanguages(
      searchQuery,
      {
        family: family === 'ALL' ? undefined : family,
        region: region === 'ALL' ? undefined : region,
        capability: capability === 'all' ? undefined : capability,
        status: statusFilter === 'ALL' ? undefined : (statusFilter as any)
      },
      pageSize * page,
      0
    );
  }, [searchQuery, family, region, capability, statusFilter, page]);

  const renderBadge = (status: CapabilityStatus) => {
    const config = {
      FULL: { bg: 'bg-[#EAF5EC]', text: 'text-[#287D3C]', border: 'border-[#CDE5D2]', label: 'Full Support' },
      PARTIAL: { bg: 'bg-[#FFF8E6]', text: 'text-[#B07A10]', border: 'border-[#F0DFB5]', label: 'Partial' },
      EXPERIMENTAL: { bg: 'bg-[#F7F0FA]', text: 'text-[#8E5BAE]', border: 'border-[#E8D6ED]', label: 'Experimental' },
      UNAVAILABLE: { bg: 'bg-[#F4F1EB]', text: 'text-[#8A857A]', border: 'border-[#E5E0D6]', label: 'Unavailable' }
    }[status];

    return (
      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${config.bg} ${config.text} ${config.border} whitespace-nowrap`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4E6] border border-[#E8D9B4] text-xs font-bold text-[#8C6D23] mb-2">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Canonical Global Living Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1918]">
            Living Languages Index ({total.toLocaleString()}+)
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6A61] mt-1">
            Complete capability matrices across ASR, neural translation, grammar intelligence, and TTS synthesis.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E0DBD0] rounded-xl shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-[#F4EAD2] text-[#8C6D23]' : 'text-[#635F57] hover:text-[#1A1918]'
            }`}
          >
            Matrix Table
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-[#F4EAD2] text-[#8C6D23]' : 'text-[#635F57] hover:text-[#1A1918]'
            }`}
          >
            Card Grid
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-5 rounded-3xl bg-white border border-[#EAE6DC] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A69B88] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search across 7,191 languages (e.g. Yoruba, Nahuatl, eng, spa, Cyrillic)..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] rounded-xl border border-[#E0DBD0] text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <select
            value={family}
            onChange={(e) => { setFamily(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white border border-[#E0DBD0] rounded-xl text-xs font-semibold text-[#1A1918] cursor-pointer"
          >
            {families.map(f => <option key={f} value={f}>Family: {f}</option>)}
          </select>

          <select
            value={region}
            onChange={(e) => { setRegion(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white border border-[#E0DBD0] rounded-xl text-xs font-semibold text-[#1A1918] cursor-pointer"
          >
            {regions.map(r => <option key={r} value={r}>Region: {r}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white border border-[#E0DBD0] rounded-xl text-xs font-semibold text-[#1A1918] cursor-pointer"
          >
            <option value="ALL">Status: All</option>
            <option value="FULL">Full Support Only</option>
            <option value="PARTIAL">Partial</option>
            <option value="EXPERIMENTAL">Experimental</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
        </div>

        {/* Capability Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[#8A857A] font-semibold mr-1">Filter by Capability:</span>
          {(['all', 'asr', 'translation', 'grammar', 'tts'] as const).map(cap => (
            <button
              key={cap}
              onClick={() => { setCapability(cap); setPage(1); }}
              className={`px-2.5 py-1 rounded-lg border text-xs font-bold uppercase cursor-pointer transition-colors ${
                capability === cap
                  ? 'bg-[#1A1918] text-white border-[#1A1918]'
                  : 'bg-white border-[#E0DBD0] text-[#635F57] hover:bg-[#FAF8F5]'
              }`}
            >
              {cap}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-3xl border border-[#EAE6DC] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#EAE6DC] text-[#7A756C] font-bold">
                <tr>
                  <th className="py-3.5 px-5">Language & Native Name</th>
                  <th className="py-3.5 px-3">ISO Codes</th>
                  <th className="py-3.5 px-3">Family & Region</th>
                  <th className="py-3.5 px-3 text-center">Speech (ASR)</th>
                  <th className="py-3.5 px-3 text-center">Translation</th>
                  <th className="py-3.5 px-3 text-center">Grammar</th>
                  <th className="py-3.5 px-3 text-center">Voice (TTS)</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EEE4] text-[#4A4740]">
                {languages.map((lang) => (
                  <tr
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang)}
                    className="hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-[#1A1918]">{lang.name}</div>
                      <div className="text-[11px] text-[#7A756C]">{lang.native_name}</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px]">
                      <span className="bg-[#FAF4E6] text-[#8C6D23] px-1.5 py-0.5 rounded font-bold border border-[#EEDBBA]">
                        {lang.iso_639_3}
                      </span>
                      {lang.iso_639_1 && (
                        <span className="ml-1 text-[#8A857A]">({lang.iso_639_1})</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <div>{lang.language_family}</div>
                      <div className="text-[10px] text-[#8A857A]">{lang.region}</div>
                    </td>
                    <td className="py-3.5 px-3 text-center">{renderBadge(lang.asr_status)}</td>
                    <td className="py-3.5 px-3 text-center">{renderBadge(lang.translation_status)}</td>
                    <td className="py-3.5 px-3 text-center">{renderBadge(lang.grammar_status)}</td>
                    <td className="py-3.5 px-3 text-center">{renderBadge(lang.tts_status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <ChevronRight className="w-4 h-4 text-[#8A857A] inline-block" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <div
              key={lang.id}
              onClick={() => setSelectedLanguage(lang)}
              className="p-5 rounded-3xl bg-white border border-[#EAE6DC] hover:border-[#C5A059] transition-all shadow-xs hover:shadow-md cursor-pointer space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#1A1918]">{lang.name}</h3>
                  <div className="text-xs text-[#7A756C]">{lang.native_name}</div>
                </div>
                <span className="font-mono text-xs font-bold text-[#8C6D23] bg-[#FAF4E6] px-2 py-0.5 rounded-lg border border-[#EEDBBA]">
                  {lang.iso_639_3}
                </span>
              </div>

              <div className="text-xs text-[#635F57] space-y-1">
                <div>Family: <strong>{lang.language_family}</strong></div>
                <div>Region: <strong>{lang.region}</strong></div>
                <div>Script: <strong>{lang.script}</strong></div>
              </div>

              <div className="pt-2 border-t border-[#F2EEE4] grid grid-cols-2 gap-1 text-[10px]">
                <div>ASR: {renderBadge(lang.asr_status)}</div>
                <div>Trans: {renderBadge(lang.translation_status)}</div>
                <div>Gram: {renderBadge(lang.grammar_status)}</div>
                <div>TTS: {renderBadge(lang.tts_status)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Load More */}
      {languages.length < total && (
        <div className="text-center pt-4">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-6 py-2.5 rounded-2xl bg-[#FAF6EC] border border-[#E2D4B2] text-xs font-bold text-[#8C6D23] hover:bg-[#F4EAD2] transition-colors cursor-pointer"
          >
            Load Next Living Batch ({languages.length} of {total.toLocaleString()})
          </button>
        </div>
      )}

      {/* Language Detail Modal */}
      {selectedLanguage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#EAE6DC] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-[#EAE6DC] bg-[#FCFBF8] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#1A1918]">{selectedLanguage.name}</h2>
                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[#FAF4E6] text-[#8C6D23] rounded border border-[#EEDBBA]">
                    {selectedLanguage.iso_639_3}
                  </span>
                </div>
                <p className="text-xs text-[#7A756C] mt-0.5">{selectedLanguage.native_name}</p>
              </div>
              <button
                onClick={() => setSelectedLanguage(null)}
                className="p-2 rounded-xl text-[#7A756C] hover:text-[#1A1918] hover:bg-[#F4F1EA] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DC]">
                  <span className="text-[#8A857A] font-semibold block">Language Family</span>
                  <strong className="text-[#1A1918]">{selectedLanguage.language_family}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DC]">
                  <span className="text-[#8A857A] font-semibold block">Geographic Region</span>
                  <strong className="text-[#1A1918]">{selectedLanguage.region}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DC]">
                  <span className="text-[#8A857A] font-semibold block">Writing Script</span>
                  <strong className="text-[#1A1918]">{selectedLanguage.script}</strong>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE6DC]">
                  <span className="text-[#8A857A] font-semibold block">Estimated Speakers</span>
                  <strong className="text-[#1A1918]">
                    {selectedLanguage.speaker_estimate ? selectedLanguage.speaker_estimate.toLocaleString() : 'Registered Living'}
                  </strong>
                </div>
              </div>

              {/* Capability Matrix Breakdown */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A857A]">
                  Linguistic Capabilities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-3 rounded-2xl border border-[#EAE6DC] bg-white text-center">
                    <span className="text-[10px] text-[#8A857A] block">Speech (ASR)</span>
                    <div className="mt-1">{renderBadge(selectedLanguage.asr_status)}</div>
                  </div>
                  <div className="p-3 rounded-2xl border border-[#EAE6DC] bg-white text-center">
                    <span className="text-[10px] text-[#8A857A] block">Translation</span>
                    <div className="mt-1">{renderBadge(selectedLanguage.translation_status)}</div>
                  </div>
                  <div className="p-3 rounded-2xl border border-[#EAE6DC] bg-white text-center">
                    <span className="text-[10px] text-[#8A857A] block">Grammar</span>
                    <div className="mt-1">{renderBadge(selectedLanguage.grammar_status)}</div>
                  </div>
                  <div className="p-3 rounded-2xl border border-[#EAE6DC] bg-white text-center">
                    <span className="text-[10px] text-[#8A857A] block">Voice (TTS)</span>
                    <div className="mt-1">{renderBadge(selectedLanguage.tts_status)}</div>
                  </div>
                </div>
              </div>

              {/* Models & Adapter Routing */}
              <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E2D5B8] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8C6D23]">
                  <Sparkles className="w-4 h-4" />
                  <span>Adapter Routing Pipeline</span>
                </div>
                <div className="text-xs text-[#5A5750]">
                  Primary Engine: <strong>{selectedLanguage.available_models.join(', ') || 'Gemini 2.5 Flash'}</strong>
                </div>
                <div className="text-xs text-[#5A5750]">
                  Fallback Engine: <strong>{selectedLanguage.fallback_models.join(', ') || 'Regional MT Adapter'}</strong>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#EAE6DC] bg-[#FCFBF8] flex justify-end">
              <button
                onClick={() => setSelectedLanguage(null)}
                className="px-5 py-2 rounded-xl bg-[#1A1918] text-white text-xs font-bold hover:bg-[#33312B] transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
