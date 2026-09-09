import React, { useState, useRef } from 'react';
import { 
  MessagesSquare, Mic, MicOff, Volume2, ArrowRightLeft, 
  Trash2, Download, Send, Globe, Loader2, Sparkles, Info
} from 'lucide-react';
import { ConversationMessage } from '../types';
import { speakText } from '../utils/audioPlayer';
import { LanguageSelectorModal } from '../components/LanguageSelectorModal';

export const ConversationView: React.FC = () => {
  const [langA, setLangA] = useState({ code: 'eng', name: 'English' });
  const [langB, setLangB] = useState({ code: 'spa', name: 'Spanish' });
  const [isSelectingA, setIsSelectingA] = useState(false);
  const [isSelectingB, setIsSelectingB] = useState(false);

  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');

  const [isRecordingA, setIsRecordingA] = useState(false);
  const [isRecordingB, setIsRecordingB] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner((prev) => (prev === msg ? null : prev)), 3500);
  };

  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: 'msg-1',
      speaker_id: 'A',
      speaker_name: 'Speaker 1 (English)',
      original_text: 'Good morning! Welcome to our multilingual engineering summit.',
      original_language: 'eng',
      translated_text: '¡Buenos días! Bienvenidos a nuestra cumbre de ingeniería multilingüe.',
      target_language: 'spa',
      confidence: 0.985,
      timestamp: '10:15 AM'
    },
    {
      id: 'msg-2',
      speaker_id: 'B',
      speaker_name: 'Speaker 2 (Spanish)',
      original_text: 'Muchas gracias. Es un verdadero placer estar aquí para presentar nuestros avances.',
      original_language: 'spa',
      translated_text: 'Thank you very much. It is a real pleasure to be here to present our breakthroughs.',
      target_language: 'eng',
      confidence: 0.989,
      timestamp: '10:16 AM'
    }
  ]);

  const recognitionRef = useRef<any>(null);

  const handleSendMessage = async (speaker: 'A' | 'B') => {
    const text = speaker === 'A' ? inputA : inputB;
    if (!text.trim()) return;

    setIsLoading(true);

    const sourceLang = speaker === 'A' ? langA.code : langB.code;
    const targetLang = speaker === 'A' ? langB.code : langA.code;

    try {
      const res = await fetch('/api/v1/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speaker_id: speaker,
          text,
          speaker_lang: sourceLang,
          listener_lang: targetLang
        })
      });

      const data = await res.json();
      if (data.success && data.message) {
        setMessages(prev => [...prev, {
          ...data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

        if (speaker === 'A') setInputA('');
        else setInputB('');
      }
    } catch (e) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeechToggle = (speaker: 'A' | 'B') => {
    const isCurrentlyRecording = speaker === 'A' ? isRecordingA : isRecordingB;

    if (isCurrentlyRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (speaker === 'A') setIsRecordingA(false);
      else setIsRecordingB(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showStatus('Speech Recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speaker === 'A' ? (langA.code === 'eng' ? 'en-US' : langA.code) : (langB.code === 'spa' ? 'es-ES' : langB.code);

      recognition.onstart = () => {
        if (speaker === 'A') setIsRecordingA(true);
        else setIsRecordingB(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        if (speaker === 'A') setInputA(transcript);
        else setInputB(transcript);
      };

      recognition.onerror = () => {
        if (speaker === 'A') setIsRecordingA(false);
        else setIsRecordingB(false);
        showStatus('Microphone capture error or permission denied.');
      };

      recognition.onend = () => {
        if (speaker === 'A') setIsRecordingA(false);
        else setIsRecordingB(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      if (speaker === 'A') setIsRecordingA(false);
      else setIsRecordingB(false);
      showStatus('Could not initialize microphone.');
    }
  };

  const handlePlayAudio = async (text: string, lang: string) => {
    try {
      const res = await fetch('/api/v1/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: lang })
      });
      const data = await res.json();
      await speakText(text, data.iso_code || lang, data.audio_base64);
    } catch (e) {
      speakText(text, lang);
    }
  };

  const handleSwapSpeakers = () => {
    const tempLang = langA;
    setLangA(langB);
    setLangB(tempLang);
    const tempInput = inputA;
    setInputA(inputB);
    setInputB(tempInput);
    showStatus('Swapped Speaker 1 and Speaker 2.');
  };

  const handleExportTranscript = () => {
    const lines = messages.map(m =>
      `[${m.timestamp}] ${m.speaker_name} (${m.original_language.toUpperCase()}): ${m.original_text}\nTranslation (${m.target_language.toUpperCase()}): ${m.translated_text}\n`
    ).join('\n');

    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HippoX_Conversation_Transcript_${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4E6] border border-[#E8D9B4] text-xs font-bold text-[#8C6D23] mb-2">
            <MessagesSquare className="w-3.5 h-3.5" />
            <span>Dual-Speaker Real-Time Stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1918]">Live Multilingual Conversation</h1>
          <p className="text-xs sm:text-sm text-[#6E6A61] mt-1">
            Turn-taking conversation room bridging two distinct languages seamlessly.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportTranscript}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E0DBD0] text-xs font-bold text-[#1A1918] hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Export Transcript</span>
          </button>
          <button
            onClick={() => setMessages([])}
            className="p-2 rounded-xl bg-white border border-[#E0DBD0] text-xs text-[#8A857A] hover:text-[#C53030] hover:border-[#FED7D7] transition-colors cursor-pointer"
            title="Clear Conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Conversation Stream Card */}
      <div className="bg-white rounded-3xl border border-[#EAE6DC] shadow-xl overflow-hidden flex flex-col h-[640px] relative">
        {/* Status Alert Banner */}
        {statusBanner && (
          <div className="bg-[#1A1918] text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between animate-in fade-in z-20">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#C5A059]" />
              <span>{statusBanner}</span>
            </div>
            <button
              onClick={() => setStatusBanner(null)}
              className="text-xs text-[#DAC8A0] hover:text-white px-2 py-0.5 rounded cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Languages Strip */}
        <div className="p-3 sm:p-4 border-b border-[#EAE6DC] bg-[#FCFBF8] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] shrink-0" />
            <span className="text-xs font-bold text-[#1A1918]">Speaker 1:</span>
            <button
              onClick={() => setIsSelectingA(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E0DBD0] hover:border-[#C5A059] transition-all text-xs font-bold text-[#8C6D23] shadow-xs cursor-pointer group"
            >
              <span className="group-hover:text-[#1A1918] transition-colors">{langA.name}</span>
              <span className="text-[10px] font-mono bg-[#FAF4E6] px-1.5 py-0.2 rounded border border-[#EEDBBA]">
                {langA.code.toUpperCase()}
              </span>
            </button>
          </div>

          <button
            onClick={handleSwapSpeakers}
            className="p-2 rounded-xl bg-white border border-[#E0DBD0] hover:border-[#C5A059] text-[#8A857A] hover:text-[#8C6D23] transition-all shadow-xs cursor-pointer"
            title="Swap Speaker Roles & Languages"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0" />
            <span className="text-xs font-bold text-[#1A1918]">Speaker 2:</span>
            <button
              onClick={() => setIsSelectingB(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D1E0F5] hover:border-[#3B82F6] transition-all text-xs font-bold text-[#2563EB] shadow-xs cursor-pointer group"
            >
              <span className="group-hover:text-[#1A1918] transition-colors">{langB.name}</span>
              <span className="text-[10px] font-mono bg-[#EFF6FF] px-1.5 py-0.2 rounded border border-[#BFDBFE]">
                {langB.code.toUpperCase()}
              </span>
            </button>
          </div>
        </div>

        {/* Message Timeline */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAF8F5]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#9E9A90] space-y-2">
              <MessagesSquare className="w-8 h-8 text-[#C5A059]" />
              <div className="text-xs font-bold text-[#1A1918]">No messages yet</div>
              <p className="text-[11px] max-w-sm">
                Speak or type below from either Speaker 1 or Speaker 2 to start real-time translation.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isSpeakerA = msg.speaker_id === 'A';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isSpeakerA ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl p-4 space-y-2 shadow-xs border ${
                      isSpeakerA
                        ? 'bg-white border-[#E8DFC9] rounded-tl-sm'
                        : 'bg-[#F2F7FE] border-[#D1E0F5] rounded-tr-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] pb-1 border-b border-black/5">
                      <span className={`font-bold ${isSpeakerA ? 'text-[#8C6D23]' : 'text-[#2563EB]'}`}>
                        {isSpeakerA ? `Speaker 1 (${langA.name})` : `Speaker 2 (${langB.name})`}
                      </span>
                      <span className="text-[#8A857A]">{msg.timestamp}</span>
                    </div>

                    {/* Original text */}
                    <div className="text-xs text-[#635F57] italic">
                      "{msg.original_text}"
                    </div>

                    {/* Translated output */}
                    <div className="text-sm font-semibold text-[#1A1918] leading-relaxed">
                      {msg.translated_text}
                    </div>

                    {/* Play translation audio */}
                    <div className="flex items-center justify-between pt-1 text-[10px] text-[#8A857A]">
                      <span>{(msg.confidence * 100).toFixed(0)}% confidence</span>
                      <button
                        onClick={() => handlePlayAudio(msg.translated_text, msg.target_language)}
                        className="flex items-center gap-1 hover:text-[#1A1918] cursor-pointer"
                        title="Listen to translation"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Play</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Dual Input Trays */}
        <div className="p-4 border-t border-[#EAE6DC] bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Speaker 1 Input */}
          <div className="p-3 rounded-2xl bg-[#FCFBF8] border border-[#E8DFC9] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#8C6D23]">
              <span>Speaker 1 ({langA.name})</span>
              {isRecordingA && <span className="text-[10px] text-[#E53E3E] animate-pulse">Recording...</span>}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputA}
                onChange={(e) => setInputA(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage('A')}
                placeholder={`Type in ${langA.name}...`}
                className="flex-1 px-3 py-2 bg-white rounded-xl border border-[#E0DBD0] text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A059]"
              />
              <button
                onClick={() => handleSpeechToggle('A')}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isRecordingA
                    ? 'bg-[#E53E3E] text-white border-[#E53E3E]'
                    : 'bg-white border-[#E0DBD0] text-[#635F57] hover:bg-[#F4EAD2]'
                }`}
                title="Speak as Speaker 1"
              >
                {isRecordingA ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleSendMessage('A')}
                disabled={isLoading || !inputA.trim()}
                className="gold-gradient-btn p-2 rounded-xl text-white cursor-pointer disabled:opacity-50"
                title="Send Speaker 1"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Speaker 2 Input */}
          <div className="p-3 rounded-2xl bg-[#F8FAFD] border border-[#D1E0F5] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#2563EB]">
              <span>Speaker 2 ({langB.name})</span>
              {isRecordingB && <span className="text-[10px] text-[#E53E3E] animate-pulse">Recording...</span>}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputB}
                onChange={(e) => setInputB(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage('B')}
                placeholder={`Type in ${langB.name}...`}
                className="flex-1 px-3 py-2 bg-white rounded-xl border border-[#D1E0F5] text-xs text-[#1A1918] focus:outline-none focus:border-[#3B82F6]"
              />
              <button
                onClick={() => handleSpeechToggle('B')}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isRecordingB
                    ? 'bg-[#E53E3E] text-white border-[#E53E3E]'
                    : 'bg-white border-[#D1E0F5] text-[#635F57] hover:bg-[#EBF3FF]'
                }`}
                title="Speak as Speaker 2"
              >
                {isRecordingB ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleSendMessage('B')}
                disabled={isLoading || !inputB.trim()}
                className="p-2 rounded-xl bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer disabled:opacity-50"
                title="Send Speaker 2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Language Selector Modals */}
      <LanguageSelectorModal
        isOpen={isSelectingA}
        onClose={() => setIsSelectingA(false)}
        selectedCode={langA.code}
        onSelect={(lang) => {
          setLangA({ code: lang.iso_639_3, name: lang.name });
        }}
        title="Select Speaker 1 Language"
        includeAutoDetect={false}
      />

      <LanguageSelectorModal
        isOpen={isSelectingB}
        onClose={() => setIsSelectingB(false)}
        selectedCode={langB.code}
        onSelect={(lang) => {
          setLangB({ code: lang.iso_639_3, name: lang.name });
        }}
        title="Select Speaker 2 Language"
        includeAutoDetect={false}
      />
    </div>
  );
};
