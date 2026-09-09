export type CapabilityStatus = 'FULL' | 'PARTIAL' | 'EXPERIMENTAL' | 'UNAVAILABLE';

export interface Language {
  id: string;
  iso_639_3: string;
  iso_639_1?: string;
  name: string;
  native_name: string;
  alternative_names?: string[];
  script: string;
  language_family: string;
  region: string;
  countries: string[];
  speaker_estimate: number;
  asr_status: CapabilityStatus;
  translation_status: CapabilityStatus;
  grammar_status: CapabilityStatus;
  tts_status: CapabilityStatus;
  ocr_status: CapabilityStatus;
  conversation_status: CapabilityStatus;
  available_models: string[];
  fallback_models: string[];
  notes?: string;
  is_favorite?: boolean;
}

export interface TranslationAlternative {
  text: string;
  register: 'formal' | 'informal' | 'business' | 'poetic' | 'colloquial';
  explanation?: string;
}

export interface TranslationResult {
  id: string;
  source_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
  detected_language?: string;
  detected_language_name?: string;
  confidence: number;
  provider: string;
  model: string;
  latency_ms: number;
  alternatives?: TranslationAlternative[];
  transliteration?: string;
  timestamp: string;
  cached?: boolean;
}

export interface GrammarIssue {
  id: string;
  original: string;
  correction: string;
  error_type: string;
  explanation: string;
  rule: string;
  confidence: number;
  start_index?: number;
  end_index?: number;
}

export interface GrammarResult {
  id: string;
  original_text: string;
  corrected_text: string;
  language: string;
  overall_confidence: number;
  issues: GrammarIssue[];
  summary: string;
  learning_points?: string[];
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  provider: string;
  latency_ms: number;
  timestamp: string;
}

export interface PracticeExercise {
  id: string;
  question: string;
  sentence_with_blank: string;
  options: string[];
  correct_answer: string;
  rule_targeted: string;
  explanation: string;
}

export interface ConversationMessage {
  id: string;
  speaker_id: 'A' | 'B';
  speaker_name: string;
  original_text: string;
  original_language: string;
  translated_text: string;
  target_language: string;
  confidence: number;
  timestamp: string;
}

export interface DocumentTranslationResult {
  id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  source_language: string;
  target_language: string;
  extracted_text: string;
  translated_text: string;
  status: 'processing' | 'completed' | 'failed';
  page_count?: number;
  confidence: number;
  timestamp: string;
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  source_language: string;
  target_language: string;
  source_text: string;
  translated_text: string;
  task_type: 'translation' | 'grammar' | 'voice' | 'document' | 'conversation';
  confidence: number;
  provider: string;
  latency_ms: number;
  status: 'success' | 'failed';
}

export interface SavedItem {
  id: string;
  title: string;
  source_text: string;
  output_text: string;
  source_language: string;
  target_language?: string;
  category: 'translation' | 'grammar' | 'phrase' | 'vocabulary';
  folder?: string;
  tags: string[];
  notes?: string;
  created_at: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  key_prefix: string;
  full_key?: string;
  created_at: string;
  last_used?: string;
  requests_count: number;
  rate_limit: string;
  status: 'active' | 'revoked';
}

export interface SystemAnalytics {
  total_translations: number;
  total_grammar_checks: number;
  total_voice_sessions: number;
  total_documents_processed: number;
  active_languages: number;
  average_latency_ms: number;
  overall_success_rate: number;
  provider_usage: {
    [key: string]: number;
  };
  language_usage: {
    code: string;
    name: string;
    count: number;
  }[];
  confidence_distribution: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'pro' | 'enterprise';
  avatar_url?: string;
  preferred_source_lang: string;
  preferred_target_lang: string;
  auto_speak: boolean;
  retain_audio: boolean;
  created_at: string;
}
