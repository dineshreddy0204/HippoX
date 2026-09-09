// Audio playback utility supporting Gemini Neural TTS (24kHz PCM) with browser WebSpeech fallback

export function playPcmAudio(base64Pcm: string, sampleRate = 24000): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const binaryString = window.atob(base64Pcm);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert 16-bit PCM bytes to Float32
      const int16Array = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate });
      const audioBuffer = audioCtx.createBuffer(1, float32Array.length, sampleRate);
      audioBuffer.copyToChannel(float32Array, 0);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.onended = () => {
        audioCtx.close().catch(() => {});
        resolve();
      };
      source.start();
    } catch (e) {
      reject(e);
    }
  });
}

export async function speakText(
  text: string, 
  isoCode: string = 'en', 
  audioBase64?: string | null,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  onStart?.();

  // 1. If Gemini 3.1 Flash Neural TTS audio is provided, play high-definition PCM
  if (audioBase64) {
    try {
      await playPcmAudio(audioBase64);
      onEnd?.();
      return;
    } catch (err) {
      console.warn('Neural audio playback failed, falling back to WebSpeech', err);
    }
  }

  // 2. Fallback to Browser Web Speech API
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isoCode;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      onEnd?.();
    };
    utterance.onerror = () => {
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } else {
    onEnd?.();
  }
}
