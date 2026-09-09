import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRightLeft, Volume2, Copy, Download, Bookmark, Share2, 
  Mic, MicOff, Upload, Trash2, Check, Sparkles, AlertCircle,
  FileText, MessageSquare, SpellCheck, ThumbsUp, ThumbsDown,
  RefreshCw, Languages, Loader2, Info
} from 'lucide-react';
import { Language, TranslationResult, SavedItem } from '../types';
import { LanguageSelectorModal } from './LanguageSelectorModal';
import { speakText } from '../utils/audioPlayer';

interface TranslationWorkspaceProps {
  onNavigateToTab?: (tab: string) => void;
  defaultSource?: string;
  defaultTarget?: string;
  onSaveItem?: (item: Omit<SavedItem, 'id' | 'created_at'>) => void;
}

export const TranslationWorkspace: React.FC<TranslationWorkspaceProps> = ({
  onNavigateToTab,
  defaultSource = 'auto',
  defaultTarget = 'spa',
  onSaveItem
}) => {
  // Mode & Tabs
  const [activeTab, setActiveTab] = useState<'translate' | 'grammar' | 'conversation' | 'voice' | 'documents'>('translate');
  const [inputMode, setInputMode] = useState<'text' | 'voice' | 'file'>('text');
  
  // Languages
  const [sourceCode, setSourceCode] = useState<string>(defaultSource);
  const [sourceName, setSourceName] = useState<string>('Auto Detect');
  const [targetCode, setTargetCode] = useState<string>(defaultTarget);
  const [targetName, setTargetName] = useState<string>('Spanish');

  // Modals
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

  // Content & State
  const [inputText, setInputText] = useState<string>('The breakthrough in neural multilingual architectures enables real-time global collaboration across diverse linguistic communities.');
  const [tone, setTone] = useState<'natural' | 'formal' | 'business' | 'poetic'>('natural');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>({
    id: 'tr-init',
    source_text: 'The breakthrough in neural multilingual architectures enables real-time global collaboration across diverse linguistic communities.',
    translated_text: 'El avance en las arquitecturas neuronales multilingües permite la colaboración global en tiempo real a través de diversas comunidades lingüísticas.',
    source_language: 'eng',
    detected_language: 'eng',
    detected_language_name: 'English',
    target_language: 'spa',
    confidence: 0.984,
    provider: 'Gemini 2.5 Flash / HippoX Engine',
    model: 'gemini-3.8-flash',
    latency_ms: 286,
    alternatives: [
      { text: 'El hito en las arquitecturas neuronales multilingües facilita la colaboración internacional en tiempo real.', register: 'formal', explanation: 'Uses "hito" (milestone) and "facilita" for formal academic register.' },
      { text: 'Este gran avance de IA en idiomas permite que personas de todo el mundo colaboren al instante.', register: 'colloquial', explanation: 'Simplified phrasing accessible for everyday conversational context.' }
    ],
    timestamp: new Date().toISOString()
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<'helpful' | 'unhelpful' | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Speech Recognition (Microphone)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Audio Playback
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Perform Real Translation API Call
  const handleTranslate = async (textToTranslate = inputText) => {
    if (!textToTranslate || !textToTranslate.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSaved(false);

    try {
      const response = await fetch('/api/v1/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToTranslate,
          source_lang: sourceCode,
          target_lang: targetCode,
          tone
        })
      });

      const data = await response.json();
      if (data.success && data.result) {
        setTranslationResult(data.result);
        if (data.result.detected_language_name && sourceCode === 'auto') {
          // Detected language notification
        }
      } else {
        setErrorMessage(data.error || 'Translation service failed to complete request.');
      }
    } catch (err: any) {
      setErrorMessage('Network or server error while executing translation.');
    } finally {
      setIsLoading(false);
    }
  };

  // Swap Languages
  const handleSwapLanguages = () => {
    if (sourceCode === 'auto') return;
    const oldSourceCode = sourceCode;
    const oldSourceName = sourceName;
    setSourceCode(targetCode);
    setSourceName(targetName);
    setTargetCode(oldSourceCode);
    setTargetName(oldSourceName);

    if (translationResult?.translated_text) {
      setInputText(translationResult.translated_text);
      handleTranslate(translationResult.translated_text);
    }
  };

  // Copy Output
  const handleCopy = () => {
    if (!translationResult?.translated_text) return;
    navigator.clipboard.writeText(translationResult.translated_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save to Saved Items
  const handleSave = async () => {
    if (!translationResult?.translated_text) return;
    try {
      await fetch('/api/v1/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: inputText.slice(0, 40) + '...',
          source_text: inputText,
          output_text: translationResult.translated_text,
          source_language: sourceCode,
          target_language: targetCode,
          category: 'translation',
          tags: ['Translation', targetName]
        })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      // Graceful error
    }
  };

  // Download TXT
  const handleDownload = () => {
    if (!translationResult?.translated_text) return;
    const element = document.createElement('a');
    const file = new Blob([
      `HippoX Multilingual Platform Translation\n`,
      `Date: ${new Date().toLocaleString()}\n`,
      `Source (${sourceName}):\n${inputText}\n\n`,
      `Target (${targetName}):\n${translationResult.translated_text}\n\n`,
      `Confidence: ${(translationResult.confidence * 100).toFixed(1)}%\n`,
      `Engine: ${translationResult.provider}`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `HippoX_Translation_${sourceCode}_to_${targetCode}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Text-To-Speech (Play)
  const handlePlayTTS = async () => {
    if (!translationResult?.translated_text) return;
    setIsPlayingAudio(true);

    try {
      // First verify TTS status from server & request neural audio if available
      const res = await fetch('/api/v1/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: translationResult.translated_text,
          language: targetCode
        })
      });
      const data = await res.json();

      if (!data.available) {
        showToast(data.message || 'Text-to-speech is not currently available for this language.');
        setIsPlayingAudio(false);
        return;
      }

      // Play via Gemini 3.1 Neural TTS or browser WebSpeech fallback
      await speakText(
        translationResult.translated_text,
        data.iso_code || targetCode,
        data.audio_base64,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false)
      );
    } catch (e) {
      setIsPlayingAudio(false);
    }
  };

  // Voice Input (Microphone)
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        showToast('Web Speech API is not supported in this browser. Please use Chrome, Safari, or Edge.');
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = sourceCode === 'auto' ? 'en-US' : sourceCode;

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setInputText(transcript);
        };

        recognition.onerror = (event: any) => {
          setIsRecording(false);
          showToast('Microphone input error or permission denied.');
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        setIsRecording(false);
        showToast('Could not access microphone.');
      }
    }
  };

  // File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setInputText(text.slice(0, 5000));
        showToast(`Loaded ${file.name} successfully.`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-[#EAE6DC] shadow-xl overflow-hidden relative">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="bg-[#1A1918] text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2 z-20">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#C5A059]" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs text-[#DAC8A0] hover:text-white px-2 py-0.5 rounded cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Workspace Tab Bar (Translate, Grammar, Conversation, Voice, Documents) */}
      <div className="px-6 py-3.5 border-b border-[#EAE6DC] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#E2DDCF] shadow-xs">
          <button
            onClick={() => { setActiveTab('translate'); onNavigateToTab?.('/translate'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'translate'
                ? 'bg-[#F4EAD2] text-[#8C6D23] shadow-xs'
                : 'text-[#635F57] hover:text-[#1A1918]'
            }`}
          >
            <Languages className="w-3.5 h-3.5 text-[#C5A059]" />
            Translate
          </button>
          <button
            onClick={() => onNavigateToTab?.('/grammar')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#635F57] hover:text-[#1A1918] transition-all cursor-pointer"
          >
            <SpellCheck className="w-3.5 h-3.5 text-[#A69B88]" />
            Grammar
          </button>
          <button
            onClick={() => onNavigateToTab?.('/conversation')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#635F57] hover:text-[#1A1918] transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#A69B88]" />
            Conversation
          </button>
          <button
            onClick={() => onNavigateToTab?.('/voice')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#635F57] hover:text-[#1A1918] transition-all cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-[#A69B88]" />
            Voice
          </button>
          <button
            onClick={() => onNavigateToTab?.('/documents')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#635F57] hover:text-[#1A1918] transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#A69B88]" />
            Documents
          </button>
        </div>

        {/* Tone Register Selector */}
        <div className="flex items-center gap-1.5 text-xs text-[#7A756C]">
          <span className="font-semibold text-[#5A5750]">Tone:</span>
          {(['natural', 'formal', 'business', 'poetic'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-2.5 py-1 rounded-lg capitalize text-xs font-medium border transition-colors cursor-pointer ${
                tone === t
                  ? 'bg-[#1A1918] text-white border-[#1A1918] font-bold'
                  : 'bg-white border-[#E0DBD0] text-[#615E57] hover:bg-[#F6F4EE]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Language Selector Header Strip */}
      <div className="px-6 py-4 border-b border-[#EAE6DC] bg-white flex items-center justify-between gap-4">
        {/* FROM Language Selector */}
        <div className="flex-1 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9A90]">FROM</span>
          <button
            onClick={() => setIsSourceModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0DBD0] hover:border-[#C5A059] transition-all text-xs font-bold text-[#1A1918] shadow-xs cursor-pointer group"
          >
            <span className="group-hover:text-[#8C6D23] transition-colors">{sourceName}</span>
            <span className="text-[10px] font-mono text-[#8C6D23] bg-[#F4EAD2] px-1.5 py-0.2 rounded font-semibold">
              {sourceCode.toUpperCase()}
            </span>
          </button>
        </div>

        {/* Swap Languages Button */}
        <button
          onClick={handleSwapLanguages}
          disabled={sourceCode === 'auto'}
          title={sourceCode === 'auto' ? 'Cannot swap with Auto Detect' : 'Swap languages'}
          className={`p-2 rounded-xl border border-[#E0DBD0] bg-white transition-all shadow-xs cursor-pointer ${
            sourceCode === 'auto'
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:bg-[#FAF8F5] hover:border-[#C5A059] text-[#6B675E]'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>

        {/* TO Language Selector */}
        <div className="flex-1 flex items-center justify-end gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9A90]">TO</span>
          <button
            onClick={() => setIsTargetModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#E0DBD0] hover:border-[#C5A059] transition-all text-xs font-bold text-[#1A1918] shadow-xs cursor-pointer group"
          >
            <span className="group-hover:text-[#8C6D23] transition-colors">{targetName}</span>
            <span className="text-[10px] font-mono text-[#8C6D23] bg-[#F4EAD2] px-1.5 py-0.2 rounded font-semibold">
              {targetCode.toUpperCase()}
            </span>
          </button>
        </div>
      </div>

      {/* Main Dual-Panel Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#EAE6DC]">
        {/* Left: Source Text Input */}
        <div className="p-6 flex flex-col justify-between bg-white min-h-[320px]">
          <div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type, paste, or speak anything to translate..."
              rows={7}
              className="w-full resize-none bg-transparent border-none text-[#1A1918] placeholder-[#9E9A90] text-sm leading-relaxed focus:outline-none"
            />
          </div>

          {/* Input Bottom Controls */}
          <div className="pt-4 border-t border-[#F2EEE4] flex items-center justify-between text-xs text-[#7A756C]">
            <div className="flex items-center gap-2">
              {/* Microphone / Speech Recognition */}
              <button
                onClick={toggleRecording}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isRecording
                    ? 'bg-[#E53E3E] text-white border-[#E53E3E] animate-pulse shadow-md'
                    : 'bg-[#FAF8F5] border-[#E0DBD0] text-[#635F57] hover:border-[#C5A059] hover:bg-[#F4EAD2]'
                }`}
                title={isRecording ? 'Listening... Click to stop' : 'Record voice'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isRecording && <span className="text-[11px] font-bold">Listening...</span>}
              </button>

              {/* File Upload Trigger */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.md,.json,.csv"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl border border-[#E0DBD0] bg-[#FAF8F5] text-[#635F57] hover:border-[#C5A059] hover:bg-[#F4EAD2] transition-colors cursor-pointer"
                title="Upload Text Document"
              >
                <Upload className="w-4 h-4" />
              </button>

              {/* Clear Input */}
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="p-2.5 rounded-xl border border-[#E0DBD0] bg-[#FAF8F5] text-[#635F57] hover:text-[#E53E3E] hover:border-[#E53E3E]/40 transition-colors cursor-pointer"
                  title="Clear text"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-[#9E9A90]">
                {inputText.length} chars &bull; {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words
              </span>
              <button
                onClick={() => handleTranslate()}
                disabled={isLoading || !inputText.trim()}
                className="gold-gradient-btn px-5 py-2 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Translate Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Target Translation Output */}
        <div className="p-6 flex flex-col justify-between bg-[#FDFBF7] min-h-[320px]">
          <div>
            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center text-[#8C6D23] space-y-3">
                <Loader2 className="w-7 h-7 animate-spin text-[#C5A059]" />
                <span className="text-xs font-semibold">Generating neural translation...</span>
              </div>
            ) : errorMessage ? (
              <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#FED7D7] text-[#C53030] text-xs">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Translation Notice</span>
                </div>
                <p>{errorMessage}</p>
                <button
                  onClick={() => handleTranslate()}
                  className="mt-3 px-3 py-1 bg-white border border-[#E2E8F0] text-xs font-bold rounded-lg hover:bg-[#F7FAFC] cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : translationResult ? (
              <div className="space-y-4">
                <p className="text-[#1A1918] text-sm leading-relaxed select-text font-normal">
                  {translationResult.translated_text}
                </p>

                {/* Transliteration if available */}
                {translationResult.transliteration && (
                  <div className="text-xs font-mono text-[#8C6D23] italic bg-[#F4EAD2]/40 px-2.5 py-1.5 rounded-lg border border-[#E9D9B2]/60">
                    Phonetics: {translationResult.transliteration}
                  </div>
                )}

                {/* Alternatives List */}
                {translationResult.alternatives && translationResult.alternatives.length > 0 && (
                  <div className="pt-3 border-t border-[#EAE6DC] space-y-2">
                    <span className="text-[11px] font-bold text-[#8A857A] uppercase tracking-wider">
                      Alternative Nuances
                    </span>
                    <div className="space-y-1.5">
                      {translationResult.alternatives.map((alt, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#EAE6DC] text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-[#1A1918]">{alt.text}</span>
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#FAF4E6] text-[#8C6D23] border border-[#EEDBBA]">
                              {alt.register}
                            </span>
                          </div>
                          {alt.explanation && (
                            <p className="text-[11px] text-[#7A756C]">{alt.explanation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-[#9E9A90] text-xs">
                Your translation will appear here...
              </div>
            )}
          </div>

          {/* Output Bottom Action Bar */}
          <div className="pt-4 border-t border-[#EAE6DC] flex flex-wrap items-center justify-between gap-3">
            {/* Real Confidence & Latency Indicator */}
            {translationResult && (
              <div className="flex items-center gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E2DDD0] font-mono text-[#4A4740]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#287D3C]" />
                  <span>{(translationResult.confidence * 100).toFixed(1)}% Confidence</span>
                </div>
                <span className="text-[#9E9A90] font-mono">{translationResult.latency_ms}ms</span>
              </div>
            )}

            {/* Actions: Play, Copy, Download, Save, Feedback */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={handlePlayTTS}
                disabled={!translationResult?.translated_text}
                className={`p-2 rounded-xl border border-[#E0DBD0] bg-white transition-colors cursor-pointer ${
                  isPlayingAudio ? 'bg-[#F4EAD2] text-[#8C6D23] border-[#C5A059]' : 'text-[#635F57] hover:bg-[#FAF8F5]'
                }`}
                title="Play Audio (Speech Synthesis)"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              </button>

              <button
                onClick={handleCopy}
                disabled={!translationResult?.translated_text}
                className="p-2 rounded-xl border border-[#E0DBD0] bg-white text-[#635F57] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                title="Copy Translation"
              >
                {copied ? <Check className="w-4 h-4 text-[#287D3C]" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={handleDownload}
                disabled={!translationResult?.translated_text}
                className="p-2 rounded-xl border border-[#E0DBD0] bg-white text-[#635F57] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                title="Download .txt"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={handleSave}
                disabled={!translationResult?.translated_text}
                className={`p-2 rounded-xl border border-[#E0DBD0] bg-white transition-colors cursor-pointer ${
                  saved ? 'bg-[#F4EAD2] text-[#8C6D23] border-[#C5A059]' : 'text-[#635F57] hover:bg-[#FAF8F5]'
                }`}
                title="Save Translation"
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#8C6D23]' : ''}`} />
              </button>

              {/* Feedback Button */}
              <div className="flex items-center gap-1 pl-2 border-l border-[#E2DDD0]">
                <button
                  onClick={() => setFeedback('helpful')}
                  className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                    feedback === 'helpful' ? 'bg-[#EAF5EC] border-[#287D3C] text-[#287D3C]' : 'border-transparent text-[#9E9A90] hover:text-[#1A1918]'
                  }`}
                  title="Helpful translation"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setFeedback('unhelpful')}
                  className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                    feedback === 'unhelpful' ? 'bg-[#FFF5F5] border-[#E53E3E] text-[#E53E3E]' : 'border-transparent text-[#9E9A90] hover:text-[#1A1918]'
                  }`}
                  title="Unhelpful translation"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Language Selector Modals */}
      <LanguageSelectorModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        selectedCode={sourceCode}
        onSelect={(lang) => {
          setSourceCode(lang.iso_639_3);
          setSourceName(lang.name);
        }}
        title="Select Source Language"
        includeAutoDetect={true}
      />

      <LanguageSelectorModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        selectedCode={targetCode}
        onSelect={(lang) => {
          setTargetCode(lang.iso_639_3);
          setTargetName(lang.name);
        }}
        title="Select Target Language"
        includeAutoDetect={false}
      />
    </div>
  );
};
