import React, { useState, useEffect } from 'react';
import { 
  Code2, Key, Copy, Check, Plus, Trash2, ShieldCheck, 
  Terminal, Sparkles, AlertCircle, Play, Loader2
} from 'lucide-react';
import { ApiKeyItem } from '../types';

export const ApiView: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<ApiKeyItem | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeSnippetLang, setActiveSnippetLang] = useState<'curl' | 'typescript' | 'python'>('curl');

  // Interactive Playground State
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/v1/translate');
  const [requestBody, setRequestBody] = useState<string>(
    JSON.stringify({
      text: "The future of multilingual AI preserves cultural heritage while accelerating global collaboration.",
      source_lang: "eng",
      target_lang: "spa",
      tone: "natural"
    }, null, 2)
  );
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isCallingApi, setIsCallingApi] = useState<boolean>(false);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/v1/api-keys');
      const data = await res.json();
      if (data.success) {
        setKeys(data.keys || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      const res = await fetch('/api/v1/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName })
      });
      const data = await res.json();
      if (data.success && data.key) {
        setCreatedKey(data.key);
        setKeys(prev => [data.key, ...prev]);
        setNewKeyName('');
      }
    } catch (e) {}
  };

  const handleRevokeKey = async (id: string) => {
    try {
      await fetch(`/api/v1/api-keys/${id}`, { method: 'DELETE' });
      setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
    } catch (e) {}
  };

  const handleTestApi = async () => {
    setIsCallingApi(true);
    setApiResponse(null);
    try {
      let res: Response;
      if (selectedEndpoint.startsWith('GET ')) {
        const url = selectedEndpoint.replace('GET ', '');
        res = await fetch(url);
      } else {
        const parsedBody = JSON.parse(requestBody);
        res = await fetch(selectedEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsedBody)
        });
      }
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsCallingApi(false);
    }
  };

  const snippets = {
    curl: `curl -X POST https://api.hippox.ai/v1/translate \\
  -H "Authorization: Bearer hp_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Hello, world!",
    "source_lang": "eng",
    "target_lang": "spa"
  }'`,
    typescript: `import { HippoXClient } from '@hippox/sdk';

const client = new HippoXClient({ apiKey: 'hp_live_...' });

const result = await client.translate({
  text: 'The future of multilingual AI connects communities.',
  sourceLang: 'eng',
  targetLang: 'spa'
});

console.log(result.translatedText);`,
    python: `import requests

url = "https://api.hippox.ai/v1/translate"
headers = {
    "Authorization": "Bearer hp_live_...",
    "Content-Type": "application/json"
}
payload = {
    "text": "The future of multilingual AI connects communities.",
    "source_lang": "eng",
    "target_lang": "spa"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4E6] border border-[#E8D9B4] text-xs font-bold text-[#8C6D23] mb-2">
          <Code2 className="w-3.5 h-3.5" />
          <span>Developer Platform</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1918]">HippoX Adapter API & Credentials</h1>
        <p className="text-xs sm:text-sm text-[#6E6A61] mt-1">
          Integrate the HippoX multilingual engine, grammar inspector, and living registry into your applications.
        </p>
      </div>

      {/* API Key Management Section */}
      <div className="bg-white rounded-3xl border border-[#EAE6DC] p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0ECE1] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#1A1918] flex items-center gap-2">
              <Key className="w-4 h-4 text-[#C5A059]" />
              <span>Production API Keys</span>
            </h2>
            <p className="text-xs text-[#7A756C]">
              Authenticate requests by including your secret API key in the Authorization header.
            </p>
          </div>

          {/* Create Key Form */}
          <form onSubmit={handleCreateKey} className="flex items-center gap-2">
            <input
              type="text"
              required
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key label (e.g., Mobile App)"
              className="px-3 py-2 bg-[#FAF8F5] border border-[#E0DBD0] rounded-xl text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A059]"
            />
            <button
              type="submit"
              className="gold-gradient-btn px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Key</span>
            </button>
          </form>
        </div>

        {/* Newly Created Key Alert */}
        {createdKey && (
          <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#EEDBBA] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#8C6D23]">
              <span>New Key Created: {createdKey.name}</span>
              <span className="text-[10px] text-[#C53030]">Save this key now. It will not be displayed again.</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={createdKey.full_key}
                className="flex-1 px-3 py-2 bg-white rounded-xl border border-[#E0DBD0] font-mono text-xs text-[#1A1918] select-all"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(createdKey.full_key || '');
                  setCopiedKey(true);
                  setTimeout(() => setCopiedKey(false), 2000);
                }}
                className="px-4 py-2 bg-[#1A1918] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-[#3FB950]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Keys Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE6DC] text-[#7A756C] font-semibold">
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Key Prefix</th>
                <th className="py-2.5 px-3">Created</th>
                <th className="py-2.5 px-3">Requests</th>
                <th className="py-2.5 px-3">Rate Limit</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EEE4] text-[#4A4740]">
              {keys.map((k) => (
                <tr key={k.id} className="hover:bg-[#FAF8F5]">
                  <td className="py-3 px-3 font-bold text-[#1A1918]">{k.name}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#8C6D23]">{k.key_prefix}</td>
                  <td className="py-3 px-3 text-[#8A857A]">{new Date(k.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-3 font-mono">{k.requests_count.toLocaleString()}</td>
                  <td className="py-3 px-3 text-[11px] text-[#6E6A61]">{k.rate_limit}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      k.status === 'active' ? 'bg-[#EAF5EC] text-[#287D3C]' : 'bg-[#FFF5F5] text-[#C53030]'
                    }`}>
                      {k.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {k.status === 'active' && (
                      <button
                        onClick={() => handleRevokeKey(k.id)}
                        className="text-[11px] text-[#C53030] hover:underline cursor-pointer"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive API Playground */}
      <div className="bg-white rounded-3xl border border-[#EAE6DC] p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0ECE1] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#1A1918]">Live API Console Playground</h2>
            <p className="text-xs text-[#7A756C]">
              Execute test payloads against the live server endpoints directly in your browser.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#5A5750]">Endpoint:</span>
            <select
              value={selectedEndpoint}
              onChange={(e) => {
                setSelectedEndpoint(e.target.value);
                if (e.target.value === '/api/v1/grammar/check') {
                  setRequestBody(JSON.stringify({ text: "She go to the store and have bought groceries.", language: "eng" }, null, 2));
                } else if (e.target.value === '/api/v1/detect-language') {
                  setRequestBody(JSON.stringify({ text: "Bonjour tout le monde! Comment allez-vous aujourd'hui?" }, null, 2));
                } else if (e.target.value === '/api/v1/synthesize') {
                  setRequestBody(JSON.stringify({ text: "Welcome to the HippoX neural speech platform.", language: "eng" }, null, 2));
                } else if (e.target.value.startsWith('GET ')) {
                  setRequestBody(JSON.stringify({ note: "Querying living language registry (HTTP GET)" }, null, 2));
                } else {
                  setRequestBody(JSON.stringify({ text: "The future of multilingual AI is here.", source_lang: "eng", target_lang: "spa" }, null, 2));
                }
              }}
              className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E0DBD0] rounded-xl text-xs font-bold text-[#1A1918]"
            >
              <option value="/api/v1/translate">POST /api/v1/translate</option>
              <option value="/api/v1/grammar/check">POST /api/v1/grammar/check</option>
              <option value="/api/v1/detect-language">POST /api/v1/detect-language</option>
              <option value="/api/v1/synthesize">POST /api/v1/synthesize</option>
              <option value="GET /api/v1/languages?q=spanish&limit=5">GET /api/v1/languages</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Request Payload Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#7A756C]">
              <span>Request JSON Payload</span>
              <button
                onClick={handleTestApi}
                disabled={isCallingApi}
                className="gold-gradient-btn px-4 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isCallingApi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>Send Request</span>
              </button>
            </div>
            <textarea
              rows={8}
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#FAF8F5] border border-[#E0DBD0] font-mono text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Response Inspector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#7A756C] block">
              Live HTTP Response
            </span>
            <div className="h-[180px] p-3 rounded-2xl bg-[#1A1918] text-[#EEDBBA] font-mono text-xs overflow-y-auto">
              {isCallingApi ? (
                <div className="h-full flex items-center justify-center text-[#8C6D23]">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span>Awaiting response...</span>
                </div>
              ) : apiResponse ? (
                <pre>{apiResponse}</pre>
              ) : (
                <span className="text-[#6E6A61]">// Click "Send Request" to view live response body...</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Code Integration Snippets */}
      <div className="bg-white rounded-3xl border border-[#EAE6DC] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1A1918]">SDK & Code Snippets</h2>
          <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] border border-[#E0DBD0] rounded-xl">
            {(['curl', 'typescript', 'python'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setActiveSnippetLang(lang)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeSnippetLang === lang
                    ? 'bg-white text-[#1A1918] shadow-xs'
                    : 'text-[#7A756C] hover:text-[#1A1918]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <pre className="p-4 rounded-2xl bg-[#1A1918] text-[#EEDBBA] font-mono text-xs overflow-x-auto leading-relaxed">
            {snippets[activeSnippetLang]}
          </pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(snippets[activeSnippetLang]);
              setCopiedSnippet(true);
              setTimeout(() => setCopiedSnippet(false), 2000);
            }}
            className="absolute top-3 right-3 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            {copiedSnippet ? <Check className="w-3.5 h-3.5 text-[#3FB950]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
