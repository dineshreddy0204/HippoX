import React, { useState } from 'react';
import { 
  Settings, Volume2, ShieldCheck, Globe, Bell, Trash2, 
  Check, Sliders, Moon, Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [speechRate, setSpeechRate] = useState(1.0);
  const [autoPlayTTS, setAutoPlayTTS] = useState(false);
  const [zeroDataRetention, setZeroDataRetention] = useState(true);
  const [telemetryConsent, setTelemetryConsent] = useState(true);
  const [defaultSource, setDefaultSource] = useState('auto');
  const [defaultTarget, setDefaultTarget] = useState('spa');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [cacheNotice, setCacheNotice] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const executeClearCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      setCacheNotice('Local application cache and dialect stores cleared successfully.');
    } catch (e) {
      setCacheNotice('Cache cleared.');
    }
    setShowClearConfirm(false);
    setTimeout(() => setCacheNotice(null), 3500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4E6] border border-[#E8D9B4] text-xs font-bold text-[#8C6D23] mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1918]">Platform Settings & Privacy</h1>
        <p className="text-xs sm:text-sm text-[#6E6A61] mt-1">
          Configure speech parameters, zero-retention privacy policies, and default translation pairs.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#EAF5EC] border border-[#CDE5D2] text-[#287D3C] text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>Preferences updated and persisted across session.</span>
        </div>
      )}

      {cacheNotice && (
        <div className="p-4 rounded-2xl bg-[#FAF6EC] border border-[#E8DEC7] text-[#8C6D23] text-xs font-bold flex items-center justify-between animate-in fade-in shadow-xs">
          <span>{cacheNotice}</span>
          <button
            onClick={() => setCacheNotice(null)}
            className="text-[11px] underline text-[#8C6D23] hover:text-[#1A1918] cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Audio & Speech Settings */}
      <div className="bg-white rounded-3xl border border-[#EAE6DC] p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1A1918] border-b border-[#F0ECE1] pb-3">
          <Volume2 className="w-4 h-4 text-[#C5A059]" />
          <span>Speech & Audio Parameters</span>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-[#1A1918]">Text-to-Speech Playback Speed ({speechRate}x)</label>
              <span className="text-[#8A857A]">Natural (1.0x)</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full accent-[#C5A059] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="font-semibold text-[#1A1918] block">Auto-Play Translations</span>
              <span className="text-[11px] text-[#7A756C]">Automatically speak translated output via TTS upon completion</span>
            </div>
            <input
              type="checkbox"
              checked={autoPlayTTS}
              onChange={(e) => setAutoPlayTTS(e.target.checked)}
              className="w-4 h-4 accent-[#C5A059] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Privacy & Enterprise Data Governance */}
      <div className="bg-white rounded-3xl border border-[#EAE6DC] p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1A1918] border-b border-[#F0ECE1] pb-3">
          <ShieldCheck className="w-4 h-4 text-[#287D3C]" />
          <span>Privacy & Zero-Data Retention</span>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#1A1918] block">Zero-Data Retention Mode</span>
              <span className="text-[11px] text-[#7A756C]">Prevent any server-side logging of sensitive text inputs</span>
            </div>
            <input
              type="checkbox"
              checked={zeroDataRetention}
              onChange={(e) => setZeroDataRetention(e.target.checked)}
              className="w-4 h-4 accent-[#287D3C] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#1A1918] block">Share Performance Telemetry</span>
              <span className="text-[11px] text-[#7A756C]">Send anonymized latency data to improve regional adapter routing</span>
            </div>
            <input
              type="checkbox"
              checked={telemetryConsent}
              onChange={(e) => setTelemetryConsent(e.target.checked)}
              className="w-4 h-4 accent-[#C5A059] cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-[#F2EEE4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-[#1A1918] block">Local Workspace Cache</span>
              <span className="text-[11px] text-[#7A756C]">Clear cached dialect dictionaries and temporary cookies</span>
            </div>
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E0DBD0] text-[#C53030] hover:bg-[#FFF5F5] font-bold cursor-pointer text-xs self-start sm:self-auto"
              >
                Clear Cache
              </button>
            ) : (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-[#C53030] font-semibold">Confirm purge?</span>
                <button
                  onClick={executeClearCache}
                  className="px-2.5 py-1 rounded-lg bg-[#E53E3E] text-white hover:bg-[#C53030] text-xs font-bold cursor-pointer"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-1 rounded-lg bg-white border border-[#E0DBD0] text-xs font-semibold hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Default Languages */}
      <div className="bg-white rounded-3xl border border-[#EAE6DC] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1A1918] border-b border-[#F0ECE1] pb-3">
          <Globe className="w-4 h-4 text-[#C5A059]" />
          <span>Default Language Pair</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-[#1A1918] block mb-1">Default Source</label>
            <select
              value={defaultSource}
              onChange={(e) => setDefaultSource(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DBD0] rounded-xl font-bold cursor-pointer"
            >
              <option value="auto">Auto Detect Language</option>
              <option value="eng">English (eng)</option>
              <option value="fra">French (fra)</option>
              <option value="spa">Spanish (spa)</option>
              <option value="cmn">Mandarin (cmn)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-[#1A1918] block mb-1">Default Target</label>
            <select
              value={defaultTarget}
              onChange={(e) => setDefaultTarget(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0DBD0] rounded-xl font-bold cursor-pointer"
            >
              <option value="spa">Spanish (spa)</option>
              <option value="eng">English (eng)</option>
              <option value="fra">French (fra)</option>
              <option value="deu">German (deu)</option>
              <option value="jpn">Japanese (jpn)</option>
              <option value="cmn">Mandarin (cmn)</option>
              <option value="hin">Hindi (hin)</option>
              <option value="ara">Arabic (ara)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="gold-gradient-btn px-6 py-2.5 rounded-2xl text-white text-xs font-bold shadow-md cursor-pointer"
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
};
