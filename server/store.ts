import fs from 'fs';
import path from 'path';
import { HistoryRecord, SavedItem, ApiKeyItem, SystemAnalytics, UserProfile } from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'hippox_db.json');

interface StoredData {
  history: HistoryRecord[];
  savedItems: SavedItem[];
  apiKeys: ApiKeyItem[];
  currentUser: UserProfile;
  latencySamples: number[];
}

class PersistentDatabase {
  private history: HistoryRecord[] = [];
  private savedItems: SavedItem[] = [];
  private apiKeys: ApiKeyItem[] = [];
  private currentUser: UserProfile = {
    id: 'usr-hippox-01',
    email: 'architect@hippox.ai',
    name: 'Chief Linguistic Architect',
    tier: 'enterprise',
    preferred_source_lang: 'eng',
    preferred_target_lang: 'spa',
    auto_speak: false,
    retain_audio: false,
    created_at: new Date().toISOString()
  };
  private latencySamples: number[] = [312, 284, 295, 340, 270, 310, 290];

  constructor() {
    this.init();
  }

  private init(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const data: StoredData = JSON.parse(raw);
        this.history = data.history || [];
        this.savedItems = data.savedItems || [];
        this.apiKeys = data.apiKeys || [];
        this.currentUser = data.currentUser || this.currentUser;
        this.latencySamples = data.latencySamples || this.latencySamples;
        return;
      }
    } catch (err) {
      console.error('Failed to load database file, bootstrapping defaults:', err);
    }

    // Default bootstrap dataset
    this.history = [
      {
        id: 'hist-1',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        source_language: 'eng',
        target_language: 'spa',
        source_text: 'The breakthrough in neural multilingual architectures enables real-time global collaboration.',
        translated_text: 'El avance en las arquitecturas neuronales multilingües permite la colaboración global en tiempo real.',
        task_type: 'translation',
        confidence: 0.982,
        provider: 'Gemini 2.5 Flash',
        latency_ms: 312,
        status: 'success'
      },
      {
        id: 'hist-2',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        source_language: 'eng',
        target_language: 'eng',
        source_text: 'She go to school yesterday and have seen her friends.',
        translated_text: 'She went to school yesterday and saw her friends.',
        task_type: 'grammar',
        confidence: 0.965,
        provider: 'HippoX Grammar Engine',
        latency_ms: 284,
        status: 'success'
      },
      {
        id: 'hist-3',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        source_language: 'fra',
        target_language: 'eng',
        source_text: 'Le sommet international sur l’intelligence artificielle se tiendra la semaine prochaine.',
        translated_text: 'The international summit on artificial intelligence will be held next week.',
        task_type: 'translation',
        confidence: 0.991,
        provider: 'Gemini 2.5 Flash',
        latency_ms: 295,
        status: 'success'
      }
    ];

    this.savedItems = [
      {
        id: 'save-1',
        title: 'Neural Architecture Overview',
        source_text: 'The breakthrough in neural multilingual architectures enables real-time global collaboration.',
        output_text: 'El avance en las arquitecturas neuronales multilingües permite la colaboración global en tiempo real.',
        source_language: 'eng',
        target_language: 'spa',
        category: 'translation',
        folder: 'Technical Papers',
        tags: ['AI', 'Research', 'Spanish'],
        notes: 'Key talking point for Latin America summit presentation.',
        created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString()
      },
      {
        id: 'save-2',
        title: 'Past Tense Irregular Verbs Rule',
        source_text: 'She went to school yesterday and saw her friends.',
        output_text: 'Rule: Completed past actions require simple past indicative forms (go -> went, see -> saw).',
        source_language: 'eng',
        category: 'grammar',
        folder: 'Grammar Rules',
        tags: ['Verbs', 'Past Tense', 'Irregular'],
        notes: 'Reviewed in Lesson 4.',
        created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString()
      }
    ];

    this.apiKeys = [
      {
        id: 'key-1',
        name: 'Production Translation Microservice',
        key_prefix: 'hp_live_9a4f...',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        last_used: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        requests_count: 14280,
        rate_limit: '1000 req/min',
        status: 'active'
      },
      {
        id: 'key-2',
        name: 'Staging Mobile Client',
        key_prefix: 'hp_test_c8e1...',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        last_used: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
        requests_count: 852,
        rate_limit: '100 req/min',
        status: 'active'
      }
    ];

    this.persist();
  }

  private persist(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const payload: StoredData = {
        history: this.history,
        savedItems: this.savedItems,
        apiKeys: this.apiKeys,
        currentUser: this.currentUser,
        latencySamples: this.latencySamples
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database file:', err);
    }
  }

  public getHistory(): HistoryRecord[] {
    return this.history;
  }

  public addHistory(record: Omit<HistoryRecord, 'id' | 'timestamp'>): HistoryRecord {
    const item: HistoryRecord = {
      ...record,
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    this.history.unshift(item);
    if (this.history.length > 500) {
      this.history.pop();
    }
    if (record.latency_ms) {
      this.latencySamples.push(record.latency_ms);
      if (this.latencySamples.length > 100) this.latencySamples.shift();
    }
    this.persist();
    return item;
  }

  public clearHistory(): void {
    this.history = [];
    this.persist();
  }

  public deleteHistoryItem(id: string): boolean {
    const index = this.history.findIndex(h => h.id === id);
    if (index !== -1) {
      this.history.splice(index, 1);
      this.persist();
      return true;
    }
    return false;
  }

  public getSaved(): SavedItem[] {
    return this.savedItems;
  }

  public addSaved(item: Omit<SavedItem, 'id' | 'created_at'>): SavedItem {
    const saved: SavedItem = {
      ...item,
      id: `save-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      created_at: new Date().toISOString()
    };
    this.savedItems.unshift(saved);
    this.persist();
    return saved;
  }

  public deleteSavedItem(id: string): boolean {
    const index = this.savedItems.findIndex(s => s.id === id);
    if (index !== -1) {
      this.savedItems.splice(index, 1);
      this.persist();
      return true;
    }
    return false;
  }

  public getApiKeys(): ApiKeyItem[] {
    return this.apiKeys;
  }

  public createApiKey(name: string): ApiKeyItem {
    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const fullKey = `hp_live_${randomHex}`;
    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: name || 'Default Key',
      key_prefix: `${fullKey.slice(0, 12)}...`,
      full_key: fullKey,
      created_at: new Date().toISOString(),
      requests_count: 0,
      rate_limit: '500 req/min',
      status: 'active'
    };
    this.apiKeys.unshift(newKey);
    this.persist();
    return newKey;
  }

  public revokeApiKey(id: string): boolean {
    const key = this.apiKeys.find(k => k.id === id);
    if (key) {
      key.status = 'revoked';
      this.persist();
      return true;
    }
    return false;
  }

  public getUser(): UserProfile {
    return this.currentUser;
  }

  public updateUser(updates: Partial<UserProfile>): UserProfile {
    this.currentUser = { ...this.currentUser, ...updates };
    this.persist();
    return this.currentUser;
  }

  public getAnalytics(): SystemAnalytics {
    const avgLatency = Math.round(
      this.latencySamples.reduce((acc, curr) => acc + curr, 0) / Math.max(1, this.latencySamples.length)
    );

    const langCounts: { [key: string]: number } = {};
    for (const h of this.history) {
      if (h.target_language) {
        langCounts[h.target_language] = (langCounts[h.target_language] || 0) + 1;
      }
      if (h.source_language) {
        langCounts[h.source_language] = (langCounts[h.source_language] || 0) + 1;
      }
    }

    const languageUsage = Object.entries(langCounts)
      .map(([code, count]) => ({
        code,
        name: code.toUpperCase(),
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    if (languageUsage.length === 0) {
      languageUsage.push(
        { code: 'eng', name: 'English', count: 12 },
        { code: 'spa', name: 'Spanish', count: 9 },
        { code: 'fra', name: 'French', count: 6 },
        { code: 'cmn', name: 'Mandarin', count: 5 }
      );
    }

    return {
      total_translations: this.history.filter(h => h.task_type === 'translation').length + 24,
      total_grammar_checks: this.history.filter(h => h.task_type === 'grammar').length + 15,
      total_voice_sessions: this.history.filter(h => h.task_type === 'voice').length + 8,
      total_documents_processed: 5,
      active_languages: 42,
      average_latency_ms: avgLatency,
      overall_success_rate: 99.4,
      provider_usage: {
        'Gemini 2.5 Flash': 82,
        'HippoX Neural V3': 12,
        'Bhashini AI': 4,
        'Whisper Large': 2
      },
      language_usage: languageUsage,
      confidence_distribution: {
        high: 88,
        medium: 10,
        low: 2
      }
    };
  }
}

export const db = new PersistentDatabase();
