import React from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Globe, Zap, Cpu, 
  CheckCircle2, Play, Layers, MessageSquare, SpellCheck, Mic
} from 'lucide-react';
import { HippoMascot } from '../components/HippoMascot';
import { TranslationWorkspace } from '../components/TranslationWorkspace';

interface HomeViewProps {
  onNavigate: (route: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-8 space-y-5">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4E6] border border-[#E8D9B4] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-xs font-bold text-[#8C6D23] uppercase tracking-wider">
                Production-Grade Multilingual Intelligence
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-[#1A1918] tracking-tight leading-[1.1]">
              One Voice.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#99772B]">
                Every Language.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-[#615D54] leading-relaxed max-w-2xl font-normal">
              Speak, translate, correct, and learn across <strong>7,191 indexed living languages</strong> (195 Full, 1,917 Partial, 2,245 Experimental). 
              Built with an adapter architecture, strict capability boundaries, and enterprise-grade privacy.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('/translate')}
                className="gold-gradient-btn px-6 py-3 rounded-2xl text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Start Translating</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('/languages')}
                className="px-5 py-3 rounded-2xl bg-white border border-[#E0DBD0] text-[#1A1918] text-xs sm:text-sm font-bold hover:bg-[#FAF8F5] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Globe className="w-4 h-4 text-[#C5A059]" />
                <span>Explore 7,191 Languages</span>
              </button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-[#7A756C] font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#287D3C]" />
                <span>Real Adapter Architecture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Zero Data Retention Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#C5A059]" />
                <span>Sub-350ms Neural Latency</span>
              </div>
            </div>
          </div>

          {/* Right Hero Mascot Placement */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
            <div className="relative">
              <HippoMascot size="hero" animate={true} />
              
              {/* Floating Floating Stat Badge */}
              <div className="absolute -bottom-2 -left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#E8DFC9] shadow-lg flex items-center gap-2.5">
                <div className="px-2 h-8 rounded-xl bg-[#F4EAD2] flex items-center justify-center text-[#8C6D23] font-bold text-xs whitespace-nowrap">
                  7,191
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#1A1918]">Living Registry</div>
                  <div className="text-[10px] text-[#78746B]">Capability Matrix Active</div>
                </div>
              </div>

              {/* Floating Floating Latency Badge */}
              <div className="absolute -top-2 -right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#E8DFC9] shadow-lg flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EAF5EC] flex items-center justify-center text-[#287D3C] font-bold text-xs">
                  ⚡
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#1A1918]">Gemini 2.5 Flash</div>
                  <div className="text-[10px] text-[#287D3C] font-semibold">98.4% Confidence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Interactive Workspace */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1A1918]">Universal Linguistic Workspace</h2>
            <p className="text-xs text-[#7A756C]">Execute translations with registered capability validation</p>
          </div>
        </div>
        <TranslationWorkspace onNavigateToTab={onNavigate} />
      </section>

      {/* Architectural Platform Highlights (4 Cards) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('/languages')}
          className="p-5 rounded-3xl bg-white border border-[#EAE6DC] hover:border-[#C5A059] transition-all shadow-sm hover:shadow-md cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#F4EAD2] text-[#8C6D23] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1A1918] mb-1">7,191 Living Registry</h3>
          <p className="text-xs text-[#6B675E] leading-relaxed">
            ISO-639-3 canonical catalog with explicit ASR, translation, grammar, and TTS capability tracking.
          </p>
          <div className="mt-3 text-xs font-bold text-[#8C6D23] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Explore Registry →
          </div>
        </div>

        <div
          onClick={() => onNavigate('/grammar')}
          className="p-5 rounded-3xl bg-white border border-[#EAE6DC] hover:border-[#C5A059] transition-all shadow-sm hover:shadow-md cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#F4EAD2] text-[#8C6D23] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
            <SpellCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1A1918] mb-1">Grammar Intelligence</h3>
          <p className="text-xs text-[#6B675E] leading-relaxed">
            Rule-based syntax detection, contextual error explanation, and adaptive interactive practice drills.
          </p>
          <div className="mt-3 text-xs font-bold text-[#8C6D23] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Inspect Syntax →
          </div>
        </div>

        <div
          onClick={() => onNavigate('/conversation')}
          className="p-5 rounded-3xl bg-white border border-[#EAE6DC] hover:border-[#C5A059] transition-all shadow-sm hover:shadow-md cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#F4EAD2] text-[#8C6D23] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1A1918] mb-1">Dual-Speaker Stream</h3>
          <p className="text-xs text-[#6B675E] leading-relaxed">
            Live turn-taking conversation interface between speakers of differing languages with automatic translation.
          </p>
          <div className="mt-3 text-xs font-bold text-[#8C6D23] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Launch Session →
          </div>
        </div>

        <div
          onClick={() => onNavigate('/api')}
          className="p-5 rounded-3xl bg-white border border-[#EAE6DC] hover:border-[#C5A059] transition-all shadow-sm hover:shadow-md cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#F4EAD2] text-[#8C6D23] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1A1918] mb-1">Developer Adapter API</h3>
          <p className="text-xs text-[#6B675E] leading-relaxed">
            REST endpoints for translation, grammar check, and language detection with production API key quotas.
          </p>
          <div className="mt-3 text-xs font-bold text-[#8C6D23] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Endpoints →
          </div>
        </div>
      </section>

      {/* Honest Capability Benchmark Comparison */}
      <section className="bg-white rounded-3xl border border-[#EAE6DC] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0ECE1] pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#1A1918]">Multilingual Integrity & Capability Benchmark</h3>
            <p className="text-xs text-[#7A756C]">How HippoX compares to generic black-box LLM translation</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#FAF4E6] text-[#8C6D23] text-xs font-bold self-start">
            Verified Standards
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#EAE6DC] text-[#7A756C] font-semibold">
                <th className="py-3 px-4">Evaluation Dimension</th>
                <th className="py-3 px-4 text-[#8C6D23] font-bold">HippoX Architecture</th>
                <th className="py-3 px-4">Generic Chatbots</th>
                <th className="py-3 px-4">Legacy Rule MT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EEE4] text-[#4A4740]">
              <tr>
                <td className="py-3 px-4 font-bold text-[#1A1918]">Living Language Coverage</td>
                <td className="py-3 px-4 font-semibold text-[#8C6D23]">7,191 indexed with capability flags</td>
                <td className="py-3 px-4">~50-100 commonly sampled</td>
                <td className="py-3 px-4">~80 fixed dictionary pairs</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#1A1918]">Unsupported Dialect Honesty</td>
                <td className="py-3 px-4 font-semibold text-[#287D3C]">Zero Hallucination (Refuses or Flags)</td>
                <td className="py-3 px-4 text-[#C53030]">Silent gibberish hallucination</td>
                <td className="py-3 px-4">Error 404 Hard Fail</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#1A1918]">Grammar Pedagogical Rules</td>
                <td className="py-3 px-4 font-semibold text-[#8C6D23]">Explicit grammatical rules + drills</td>
                <td className="py-3 px-4">Rewrites without explaining</td>
                <td className="py-3 px-4">Brittle spellcheck only</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#1A1918]">Model Routing Adapter</td>
                <td className="py-3 px-4 font-semibold text-[#8C6D23]">Gemini 2.5 Flash + Whisper + Regional MT</td>
                <td className="py-3 px-4">Single vendor locked</td>
                <td className="py-3 px-4">Monolithic legacy server</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
