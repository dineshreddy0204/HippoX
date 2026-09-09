import React, { useState } from 'react';
import { 
  SpellCheck, CheckCircle2, AlertCircle, Sparkles, BookOpen, 
  ArrowRight, RefreshCw, Check, Copy, Bookmark, Lightbulb, Loader2
} from 'lucide-react';
import { GrammarResult, GrammarIssue } from '../types';

export const GrammarView: React.FC = () => {
  const [language, setLanguage] = useState('eng');
  const [inputText, setInputText] = useState(
    'She go to the international conference yesterday and have spoke about artificial intelligence, but their was many questions.'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [grammarResult, setGrammarResult] = useState<GrammarResult | null>({
    id: 'gm-demo',
    original_text: 'She go to the international conference yesterday and have spoke about artificial intelligence, but their was many questions.',
    corrected_text: 'She went to the international conference yesterday and spoke about artificial intelligence, but there were many questions.',
    language: 'eng',
    overall_confidence: 0.975,
    summary: 'Detected 4 grammatical errors: 2 past tense verb forms, 1 homophone spelling error, and 1 subject-verb agreement issue.',
    difficulty_level: 'intermediate',
    provider: 'HippoX Grammar Engine (Gemini 2.5)',
    latency_ms: 294,
    timestamp: new Date().toISOString(),
    issues: [
      {
        id: 'iss-1',
        original: 'go',
        correction: 'went',
        error_type: 'Verb Tense',
        explanation: 'The temporal adverb "yesterday" establishes past time, requiring the simple past form "went" instead of present "go".',
        rule: 'Actions completed at a specified past time require simple past tense verbs.',
        confidence: 0.99
      },
      {
        id: 'iss-2',
        original: 'have spoke',
        correction: 'spoke',
        error_type: 'Verb Tense',
        explanation: 'Completed past actions coordinated with "yesterday" should use simple past "spoke" rather than present perfect or incorrect participle form.',
        rule: 'Use simple past for sequenced past events; the past participle of speak is spoken, but simple past spoke is needed here.',
        confidence: 0.98
      },
      {
        id: 'iss-3',
        original: 'their',
        correction: 'there',
        error_type: 'Spelling / Homophone',
        explanation: '"Their" is a possessive pronoun. The existential dummy pronoun "there" is required to introduce the existence of questions.',
        rule: 'Use "there" as an existential subject introducing nouns ("there were questions").',
        confidence: 0.99
      },
      {
        id: 'iss-4',
        original: 'was many questions',
        correction: 'were many questions',
        error_type: 'Subject-Verb Agreement',
        explanation: 'The plural noun phrase "many questions" requires the plural past verb "were", not singular "was".',
        rule: 'In existential "there" constructions, the verb agrees with the subsequent delayed subject ("many questions" = plural).',
        confidence: 0.97
      }
    ],
    learning_points: [
      'Coordinate verb tenses uniformly when narrating past events.',
      'Check existential "there is / there are" agreement with the plural noun that follows.'
    ]
  });

  // Practice state
  const [practiceData, setPracticeData] = useState<any | null>(null);
  const [isGeneratingPractice, setIsGeneratingPractice] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [checkedAnswers, setCheckedAnswers] = useState<{ [key: string]: boolean }>({});
  const [copied, setCopied] = useState(false);

  const sampleSentences = [
    {
      label: 'Past Tense & Homophones',
      text: 'She go to the international conference yesterday and have spoke about artificial intelligence, but their was many questions.'
    },
    {
      label: 'Subject-Verb & Articles',
      text: 'Every member in the global teams are developing an unique algorithm for speech understanding.'
    },
    {
      label: 'Preposition & Word Order',
      text: 'He is married with a linguist and yesterday arrived he to the university.'
    }
  ];

  const handleCheckGrammar = async (textToCheck = inputText) => {
    if (!textToCheck.trim()) return;

    setIsLoading(true);
    setPracticeData(null);

    try {
      const res = await fetch('/api/v1/grammar/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToCheck,
          language
        })
      });

      const data = await res.json();
      if (data.success && data.result) {
        setGrammarResult(data.result);
      }
    } catch (err) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  const handlePracticeIssue = async (issue: GrammarIssue) => {
    setIsGeneratingPractice(true);
    setSelectedAnswers({});
    setCheckedAnswers({});

    try {
      const res = await fetch('/api/v1/grammar/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rule: issue.rule,
          error_type: issue.error_type,
          language
        })
      });

      const data = await res.json();
      if (data.success && data.practice) {
        setPracticeData(data.practice);
      }
    } catch (err) {
      // Error handling
    } finally {
      setIsGeneratingPractice(false);
    }
  };

  const handleCopyCorrected = () => {
    if (!grammarResult?.corrected_text) return;
    navigator.clipboard.writeText(grammarResult.corrected_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4E6] border border-[#E8D9B4] text-xs font-bold text-[#8C6D23] mb-2">
            <SpellCheck className="w-3.5 h-3.5" />
            <span>Grammar & Syntax Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1918]">Grammar Inspection & Practice</h1>
          <p className="text-xs sm:text-sm text-[#6E6A61] mt-1">
            Detect genuine syntactic and morphological errors, view rules, and practice mistakes interactively.
          </p>
        </div>

        {/* Language Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#5A5750]">Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 bg-white border border-[#E0DBD0] rounded-xl text-xs font-bold text-[#1A1918] focus:outline-none focus:border-[#C5A059] shadow-xs cursor-pointer"
          >
            <option value="eng">English (eng)</option>
            <option value="spa">Spanish (spa)</option>
            <option value="fra">French (fra)</option>
            <option value="deu">German (deu)</option>
            <option value="jpn">Japanese (jpn)</option>
            <option value="cmn">Mandarin (cmn)</option>
            <option value="hin">Hindi (hin)</option>
          </select>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-3xl border border-[#EAE6DC] p-6 shadow-sm space-y-4">
        {/* Sample Sentences Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#8A857A] font-semibold">Try sample sentences:</span>
          {sampleSentences.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(sample.text);
                handleCheckGrammar(sample.text);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E0DBD0] text-[#5C5952] hover:bg-[#F4EAD2] hover:text-[#8C6D23] hover:border-[#C5A059] transition-all cursor-pointer font-medium"
            >
              {sample.label}
            </button>
          ))}
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste or write text to analyze grammar and syntax rules..."
          rows={4}
          className="w-full resize-none p-4 rounded-2xl bg-[#FCFBF8] border border-[#EAE6DC] text-sm text-[#1A1918] placeholder-[#9E9A90] focus:outline-none focus:border-[#C5A059]"
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#8A857A] font-mono">
            {inputText.length} characters &bull; {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words
          </span>

          <button
            onClick={() => handleCheckGrammar()}
            disabled={isLoading || !inputText.trim()}
            className="gold-gradient-btn px-5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Checking Grammar...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze Grammar & Rules</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grammar Results Display */}
      {grammarResult && (
        <div className="space-y-6">
          {/* Summary & Corrected Text Card */}
          <div className="bg-[#FAF8F3] rounded-3xl border border-[#E8DEC7] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DEC7] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#287D3C]" />
                <span className="text-sm font-bold text-[#1A1918]">Analysis Summary</span>
                <span className="text-[10px] font-mono font-bold bg-[#EAF5EC] text-[#287D3C] px-2 py-0.5 rounded-full">
                  {(grammarResult.overall_confidence * 100).toFixed(1)}% Confidence
                </span>
              </div>
              <span className="text-xs text-[#7A756C]">
                Level: <strong className="capitalize text-[#1A1918]">{grammarResult.difficulty_level}</strong>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#4A4740] leading-relaxed font-medium">
              {grammarResult.summary}
            </p>

            {/* Corrected Text Block */}
            <div className="p-4 rounded-2xl bg-white border border-[#E0D7BF] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#8C6D23]">
                <span>Corrected Text</span>
                <button
                  onClick={handleCopyCorrected}
                  className="flex items-center gap-1 text-[11px] text-[#5A5750] hover:text-[#1A1918] cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#287D3C]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Corrected'}</span>
                </button>
              </div>
              <p className="text-sm text-[#1A1918] leading-relaxed select-text font-normal">
                {grammarResult.corrected_text}
              </p>
            </div>
          </div>

          {/* Detailed Issues Breakdown */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-[#1A1918] flex items-center gap-2">
              <span>Identified Issues & Linguistic Rules ({grammarResult.issues.length})</span>
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {grammarResult.issues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-5 rounded-2xl bg-white border border-[#EAE6DC] hover:border-[#C5A059] transition-all shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-[#FAF4E6] text-[#8C6D23] border border-[#EEDBBA]">
                        {issue.error_type}
                      </span>
                      <span className="text-xs text-[#8A857A] font-mono">
                        {(issue.confidence * 100).toFixed(0)}% accuracy
                      </span>
                    </div>

                    <button
                      onClick={() => handlePracticeIssue(issue)}
                      className="px-3 py-1 rounded-xl bg-[#FAF6EC] border border-[#E2D4B2] text-xs font-bold text-[#8C6D23] hover:bg-[#F4EAD2] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Practice This Mistake →</span>
                    </button>
                  </div>

                  {/* Diff: Original vs Correction */}
                  <div className="flex items-center gap-3 text-sm">
                    <div className="px-2.5 py-1 rounded-lg bg-[#FFF5F5] text-[#C53030] line-through font-mono text-xs border border-[#FED7D7]">
                      {issue.original}
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8C6D23]" />
                    <div className="px-2.5 py-1 rounded-lg bg-[#EAF5EC] text-[#287D3C] font-mono font-bold text-xs border border-[#CDE5D2]">
                      {issue.correction}
                    </div>
                  </div>

                  {/* Explanation */}
                  <p className="text-xs text-[#524F49] leading-relaxed">
                    {issue.explanation}
                  </p>

                  {/* Canonical Rule */}
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6DC] text-xs text-[#4A4740]">
                    <Lightbulb className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#1A1918]">Rule: </span>
                      <span>{issue.rule}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Learning Practice Drawer / Container */}
          {isGeneratingPractice && (
            <div className="p-8 rounded-3xl bg-white border border-[#EAE6DC] flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#C5A059]" />
              <span className="text-xs font-semibold text-[#8C6D23]">
                Generating customized interactive practice exercises...
              </span>
            </div>
          )}

          {practiceData && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FAF8F2] to-[#F5EFE0] border border-[#E2D5B8] shadow-sm space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#E2D5B8] pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#8C6D23]" />
                  <span className="text-sm font-bold text-[#1A1918]">Interactive Learning Mode</span>
                </div>
                <button
                  onClick={() => setPracticeData(null)}
                  className="text-xs text-[#8A857A] hover:text-[#1A1918] cursor-pointer"
                >
                  Close Practice
                </button>
              </div>

              <p className="text-xs text-[#5C5952] leading-relaxed">
                {practiceData.concept_explanation}
              </p>

              {/* Practice Questions */}
              <div className="space-y-4">
                {practiceData.exercises?.map((ex: any, idx: number) => {
                  const selected = selectedAnswers[ex.id];
                  const isChecked = checkedAnswers[ex.id];
                  const isCorrect = selected === ex.correct_answer;

                  return (
                    <div key={ex.id || idx} className="p-4 rounded-2xl bg-white border border-[#E4D9C0] space-y-3">
                      <div className="text-xs font-bold text-[#1A1918]">
                        Question {idx + 1}: {ex.question}
                      </div>

                      <div className="p-3 rounded-xl bg-[#FAF8F5] font-mono text-xs text-[#1A1918] border border-[#EAE6DC]">
                        {ex.sentence_with_blank}
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ex.options?.map((opt: string) => {
                          const isOptionSelected = selected === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => {
                                if (isChecked) return;
                                setSelectedAnswers(prev => ({ ...prev, [ex.id]: opt }));
                              }}
                              className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                                isOptionSelected
                                  ? 'bg-[#F4EAD2] border-[#C5A059] text-[#8C6D23] font-bold'
                                  : 'bg-white border-[#E0DBD0] text-[#4A4740] hover:bg-[#FAF8F5]'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Check Answer Button */}
                      {!isChecked && selected && (
                        <button
                          onClick={() => setCheckedAnswers(prev => ({ ...prev, [ex.id]: true }))}
                          className="px-4 py-1.5 rounded-xl bg-[#1A1918] text-white text-xs font-bold hover:bg-[#33312B] transition-colors cursor-pointer"
                        >
                          Check Answer
                        </button>
                      )}

                      {/* Result feedback */}
                      {isChecked && (
                        <div
                          className={`p-3 rounded-xl border text-xs ${
                            isCorrect
                              ? 'bg-[#EAF5EC] border-[#CDE5D2] text-[#287D3C]'
                              : 'bg-[#FFF5F5] border-[#FED7D7] text-[#C53030]'
                          }`}
                        >
                          <div className="font-bold mb-0.5">
                            {isCorrect ? '✓ Correct! Excellent grasp of the rule.' : `✕ Incorrect. Correct answer: "${ex.correct_answer}"`}
                          </div>
                          <p className="text-[11px] text-[#4A4740]">{ex.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
