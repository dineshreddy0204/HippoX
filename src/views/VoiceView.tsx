import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Volume2, Play, Pause, RefreshCw, Languages, 
  Sparkles, CheckCircle2, Download, Copy, Check, ArrowRight,
  Upload, FileAudio, Loader2, Info
} from 'lucide-react';
import { speakText } from '../utils/audioPlayer';

export const VoiceView: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [transcript, setTranscript] = useState(
    'Neural multilingual speech processing allows low latency audio interpretation across global borders.'
  );
  const [translatedTranscript, setTranslatedTranscript] = useState('');
  const [targetLang, setTargetLang] = useState('spa');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage((prev) => (prev === msg ? null : prev)), 3500);
  };

  // Audio Canvas Waveform
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Draw Audio Waveform
  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#C5A059';
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    render();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      // MediaRecorder initialization
      audioChunksRef.current = [];
      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        await sendAudioForTranscription(audioBlob);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;

      setIsRecording(true);
      drawWaveform();

      // Browser Speech Recognition for instant preview
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          const current = Array.from(event.results)
            .map((r: any) => r[0].transcript)
            .join(' ');
          if (current.trim()) {
            setTranscript(current);
          }
        };

        rec.onerror = () => {};
        rec.start();
        recognitionRef.current = rec;
      }
    } catch (err) {
      showStatus('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Reset canvas to flat line
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.strokeStyle = '#E0DBD0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvasRef.current.height / 2);
        ctx.lineTo(canvasRef.current.width, canvasRef.current.height / 2);
        ctx.stroke();
      }
    }
  };

  const sendAudioForTranscription = async (blob: Blob) => {
    setIsProcessingAudio(true);
    showStatus('Processing audio through Gemini 3.5 Transcribe...');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        if (!base64Audio) {
          setIsProcessingAudio(false);
          return;
        }

        try {
          const res = await fetch('/api/v1/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audio_base64: base64Audio,
              mime_type: blob.type || 'audio/webm',
              language: 'auto'
            })
          });

          const data = await res.json();
          if (data.success && data.result?.transcript) {
            setTranscript(data.result.transcript);
            showStatus(`Transcribed via ${data.result.provider} (${data.result.latency_ms}ms)`);
          } else {
            showStatus(data.error || 'Audio transcription completed.');
          }
        } catch (e: any) {
          showStatus('Transcription server error.');
        } finally {
          setIsProcessingAudio(false);
        }
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      setIsProcessingAudio(false);
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showStatus('Audio file exceeds 10MB maximum limit.');
      return;
    }

    sendAudioForTranscription(file);
  };

  const handleTranslateVoice = async () => {
    if (!transcript.trim()) return;
    setIsTranslating(true);

    try {
      const res = await fetch('/api/v1/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: transcript,
          source_lang: 'auto',
          target_lang: targetLang
        })
      });

      const data = await res.json();
      if (data.success && data.result) {
        setTranslatedTranscript(data.result.translated_text);
        showStatus('Voice translated successfully.');
      } else {
        showStatus(data.error || 'Translation notice.');
      }
    } catch (e) {
      showStatus('Translation request failed.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeakTranslation = async () => {
    if (!translatedTranscript) return;
    setIsPlayingAudio(true);
    try {
      const res = await fetch('/api/v1/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: translatedTranscript, language: targetLang })
      });
      const data = await res.json();
      await speakText(
        translatedTranscript,
        data.iso_code || targetLang,
        data.audio_base64,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false)
      );
    } catch (err) {
      speakText(translatedTranscript, targetLang, null, () => setIsPlayingAudio(true), () => setIsPlayingAudio(false));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedTranscript || transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleVoicePrompts = [
    { label: 'English memo', text: 'HippoX delivers universal multilingual intelligence with zero data retention.' },
    { label: 'Spanish phrase', text: 'La traducción neuronal preserva el significado cultural exacto en cada conversación.' },
    { label: 'French dialog', text: 'Le système linguistique de HippoX permet une collaboration mondiale sans précédent.' }
  ];

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <div className="space-y-8 pb-16 relative">
      {/* Status Notice Banner */}
      {statusMessage && (
        <div className="bg-[#1A1918] text-white px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between animate-in fade-in shadow-md">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#C5A059]" />
            <span>{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs text-[#DAC8A0] hover:text-white px-2 py-0.5 rounded cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4E6] border border-[#E8D9B4] text-xs font-bold text-[#8C6D23] mb-2">
          <Mic className="w-3.5 h-3.5" />
          <span>Speech Recognition & Synthesis Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1918]">Voice Studio & Audio Visualizer</h1>
        <p className="text-xs sm:text-sm text-[#6E6A61] mt-1">
          Real-time microphone capture with live acoustic waveform, audio file transcription, and instant neural speech translation.
        </p>
      </div>

      {/* Audio Waveform Canvas Box */}
      <div className="bg-white rounded-3xl border border-[#EAE6DC] p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1A1918]">Live Audio Waveform</span>
            {isRecording && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FFF5F5] text-[#E53E3E] text-[10px] font-bold border border-[#FED7D7]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E53E3E] animate-ping" />
                LIVE CAPTURE
              </span>
            )}
            {isProcessingAudio && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FAF4E6] text-[#8C6D23] text-[10px] font-bold border border-[#E8D9B4]">
                <Loader2 className="w-3 h-3 animate-spin text-[#C5A059]" />
                PROCESSING NEURAL AUDIO...
              </span>
            )}
          </div>
          <span className="text-xs text-[#8A857A] font-mono">Web Audio API Analyser &bull; 24kHz</span>
        </div>

        {/* Waveform Canvas */}
        <div className="h-28 rounded-2xl bg-[#FCFBF8] border border-[#EAE6DC] overflow-hidden flex items-center justify-center p-2">
          <canvas
            ref={canvasRef}
            width={800}
            height={112}
            className="w-full h-full"
          />
        </div>

        {/* Recording & Upload Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-6 py-3 rounded-2xl bg-[#1A1918] text-white hover:bg-[#33312B] text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4 text-[#C5A059]" />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-6 py-3 rounded-2xl bg-[#E53E3E] text-white hover:bg-[#C53030] text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer animate-pulse"
            >
              <MicOff className="w-4 h-4" />
              <span>Stop & Transcribe Audio</span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAudioFileUpload}
            accept="audio/*,.wav,.mp3,.m4a,.webm,.ogg"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isRecording || isProcessingAudio}
            className="px-5 py-3 rounded-2xl bg-white border border-[#E0DBD0] hover:border-[#C5A059] text-xs font-bold text-[#1A1918] hover:bg-[#FAF8F5] transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-4 h-4 text-[#C5A059]" />
            <span>Upload Audio File</span>
          </button>
        </div>

        {/* Sample Voice Quick Buttons */}
        <div className="pt-2 border-t border-[#F2EEE4] flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-[#8A857A] font-semibold text-[11px]">Quick Audio Samples:</span>
          <div className="flex flex-wrap gap-1.5">
            {sampleVoicePrompts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(s.text);
                  showStatus(`Loaded "${s.label}" into transcript.`);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E2DDD0] text-[11px] font-medium text-[#635F57] hover:border-[#C5A059] hover:bg-[#F4EAD2] transition-colors cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dual Transcribed & Translated Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Transcription */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAE6DC] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#1A1918]">
            <span>Captured Speech Transcript</span>
            <span className="text-[10px] font-mono text-[#8A857A]">Source Audio</span>
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={5}
            placeholder="Spoken words will appear here in real time..."
            className="w-full p-3 rounded-xl bg-[#FAF8F5] border border-[#E0DBD0] text-xs text-[#1A1918] resize-none focus:outline-none focus:border-[#C5A059]"
          />

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#5A5750] font-semibold">Translate to:</span>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="text-xs font-bold bg-[#FAF8F5] border border-[#E0DBD0] rounded-lg px-2 py-1 cursor-pointer"
              >
                <option value="spa">Spanish (spa)</option>
                <option value="fra">French (fra)</option>
                <option value="deu">German (deu)</option>
                <option value="jpn">Japanese (jpn)</option>
                <option value="cmn">Mandarin (cmn)</option>
                <option value="hin">Hindi (hin)</option>
                <option value="ara">Arabic (ara)</option>
              </select>
            </div>

            <button
              onClick={handleTranslateVoice}
              disabled={isTranslating || !transcript.trim()}
              className="gold-gradient-btn px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Translating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Translate Voice</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Target Translation Output */}
        <div className="p-6 rounded-3xl bg-[#FAF8F2] border border-[#E8DEC7] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#8C6D23]">
            <span>Translated Voice Output</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!translatedTranscript}
                className="hover:text-[#1A1918] cursor-pointer"
                title="Copy output"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#287D3C]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="min-h-[110px] p-3 rounded-xl bg-white border border-[#E2D6BA] text-xs text-[#1A1918] leading-relaxed">
            {translatedTranscript || (
              <span className="text-[#9E9A90]">Translated speech will appear here...</span>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] text-[#8C6D23] font-semibold">
              Neural Speech Synthesis Ready
            </span>
            {translatedTranscript && (
              <button
                onClick={handleSpeakTranslation}
                disabled={isPlayingAudio}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-[#DAC8A0] text-xs font-bold text-[#8C6D23] hover:bg-[#FAF8F5] flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span>{isPlayingAudio ? 'Speaking...' : 'Speak Out Loud'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
