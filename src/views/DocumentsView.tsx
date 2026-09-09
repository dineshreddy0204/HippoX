import React, { useState, useRef } from 'react';
import { 
  FileText, Upload, Download, Check, Sparkles, AlertCircle, 
  FileCheck, Globe, Loader2, ArrowRight, Info
} from 'lucide-react';
import { DocumentTranslationResult } from '../types';
import { LanguageSelectorModal } from '../components/LanguageSelectorModal';

export const DocumentsView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetLang, setTargetLang] = useState('spa');
  const [targetLangName, setTargetLangName] = useState('Spanish');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [docResult, setDocResult] = useState<DocumentTranslationResult | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage((prev) => (prev === msg ? null : prev)), 3500);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      showStatus('File size exceeds 8MB maximum limit.');
      return;
    }
    setSelectedFile(file);
    showStatus(`Loaded file "${file.name}" ready for translation.`);
  };

  const handleTranslateDocument = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    try {
      const isImage = selectedFile.type.startsWith('image/');
      let payload: any = {
        file_name: selectedFile.name,
        mime_type: selectedFile.type,
        target_lang: targetLang
      };

      if (isImage) {
        // Read as base64
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Data = (e.target?.result as string).split(',')[1];
          payload.image_base64 = base64Data;
          await sendDocRequest(payload);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // Read as text
        const reader = new FileReader();
        reader.onload = async (e) => {
          payload.file_text = e.target?.result as string;
          await sendDocRequest(payload);
        };
        reader.readAsText(selectedFile);
      }
    } catch (e) {
      setIsProcessing(false);
      showStatus('Failed to read document.');
    }
  };

  const sendDocRequest = async (payload: any) => {
    try {
      const res = await fetch('/api/v1/documents/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.document) {
        setDocResult(data.document);
        showStatus('Document processed and translated successfully.');
      } else {
        showStatus(data.error || 'Failed to process document.');
      }
    } catch (err) {
      showStatus('Network or server error processing document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const loadSampleDocument = (title: string, text: string) => {
    const file = new File([text], `${title}.txt`, { type: 'text/plain' });
    setSelectedFile(file);
    showStatus(`Loaded sample document "${title}".`);
  };

  const handleDownload = () => {
    if (!docResult?.translated_text) return;
    const blob = new Blob([docResult.translated_text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Translated_${docResult.file_name}`;
    a.click();
  };

  return (
    <div className="space-y-8 pb-16 relative">
      {/* Status Notice */}
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
          <FileText className="w-3.5 h-3.5" />
          <span>Document & OCR Multilingual Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1918]">Document & Image OCR Translation</h1>
        <p className="text-xs sm:text-sm text-[#6E6A61] mt-1">
          Upload TXT, MD, CSV, or Image documents (PNG/JPG) for neural OCR extraction and high-precision translation.
        </p>
      </div>

      {/* Upload Box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        className="p-8 rounded-3xl bg-white border-2 border-dashed border-[#DAC8A0] hover:border-[#C5A059] transition-all flex flex-col items-center justify-center text-center space-y-4 shadow-xs"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#FAF6EC] text-[#8C6D23] flex items-center justify-center">
          <Upload className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#1A1918]">
            {selectedFile ? selectedFile.name : 'Drag & Drop document or image here'}
          </h3>
          <p className="text-xs text-[#7A756C] mt-1">
            Supports .txt, .md, .csv, and images (.png, .jpg) up to 8MB
          </p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".txt,.md,.csv,.json,image/png,image/jpeg"
          className="hidden"
        />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-white border border-[#E0DBD0] text-xs font-bold text-[#1A1918] hover:bg-[#FAF8F5] cursor-pointer shadow-xs"
          >
            Browse Local File
          </button>

          {selectedFile && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#5A5750] font-semibold">Target:</span>
              <button
                onClick={() => setIsLanguageModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E0DBD0] hover:border-[#C5A059] transition-all text-xs font-bold text-[#8C6D23] shadow-xs cursor-pointer group"
              >
                <span className="group-hover:text-[#1A1918] transition-colors">{targetLangName}</span>
                <span className="text-[10px] font-mono bg-[#FAF4E6] px-1.5 py-0.2 rounded border border-[#EEDBBA]">
                  {targetLang.toUpperCase()}
                </span>
              </button>

              <button
                onClick={handleTranslateDocument}
                disabled={isProcessing}
                className="gold-gradient-btn px-5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Document...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Translate Document</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Quick Sample Documents */}
        <div className="pt-4 border-t border-[#F0ECE1] w-full max-w-lg flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-[#8A857A] font-semibold text-[11px]">Load Sample Document:</span>
          <button
            onClick={() => loadSampleDocument('Software_License_Agreement', 'Subject to the terms and conditions herein, Licensor hereby grants Licensee a worldwide, non-exclusive, perpetual license to deploy the software.')}
            className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E0DBD0] text-[11px] font-medium text-[#635F57] hover:border-[#C5A059] hover:bg-[#F4EAD2] cursor-pointer transition-colors"
          >
            Software License (.txt)
          </button>
          <button
            onClick={() => loadSampleDocument('Medical_Prescription_Memo', 'Patient: John Doe. Rx: Amoxicillin 500mg, oral suspension. Take one capsule every 8 hours with meals for 10 days. Avoid alcohol.')}
            className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E0DBD0] text-[11px] font-medium text-[#635F57] hover:border-[#C5A059] hover:bg-[#F4EAD2] cursor-pointer transition-colors"
          >
            Medical Rx (.txt)
          </button>
        </div>
      </div>

      {/* Side-by-Side Extracted & Translated Preview */}
      {docResult && (
        <div className="bg-white rounded-3xl border border-[#EAE6DC] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#287D3C]" />
              <div>
                <h3 className="text-xs font-bold text-[#1A1918]">{docResult.file_name}</h3>
                <span className="text-[10px] text-[#7A756C]">
                  Language: {docResult.source_language.toUpperCase()} &rarr; {docResult.target_language.toUpperCase()} &bull; {(docResult.confidence * 100).toFixed(1)}% Confidence
                </span>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E0DBD0] hover:bg-[#FAF8F5] text-xs font-bold text-[#1A1918] flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#8C6D23]" />
              <span>Download Translated Text</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Extracted Text */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E0DBD0] space-y-2">
              <span className="text-xs font-bold text-[#7A756C] uppercase tracking-wider block">
                Extracted Source Content
              </span>
              <pre className="text-xs text-[#1A1918] whitespace-pre-wrap font-sans leading-relaxed">
                {docResult.extracted_text}
              </pre>
            </div>

            {/* Translated Output */}
            <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#E8DEC7] space-y-2">
              <span className="text-xs font-bold text-[#8C6D23] uppercase tracking-wider block">
                Translated Content
              </span>
              <pre className="text-xs text-[#1A1918] whitespace-pre-wrap font-sans leading-relaxed">
                {docResult.translated_text}
              </pre>
            </div>
          </div>
        </div>
      )}

      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        selectedCode={targetLang}
        onSelect={(lang) => {
          setTargetLang(lang.iso_639_3);
          setTargetLangName(lang.name);
        }}
        title="Select Document Translation Language"
        includeAutoDetect={false}
      />
    </div>
  );
};
