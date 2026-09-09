import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { CommandSearchModal } from './components/CommandSearchModal';
import { HomeView } from './views/HomeView';
import { TranslationWorkspace } from './components/TranslationWorkspace';
import { GrammarView } from './views/GrammarView';
import { ConversationView } from './views/ConversationView';
import { LanguagesView } from './views/LanguagesView';
import { VoiceView } from './views/VoiceView';
import { DocumentsView } from './views/DocumentsView';
import { HistoryView } from './views/HistoryView';
import { SavedView } from './views/SavedView';
import { AnalyticsView } from './views/AnalyticsView';
import { ApiView } from './views/ApiView';
import { PricingView } from './views/PricingView';
import { SettingsView } from './views/SettingsView';
import { ProfileView } from './views/ProfileView';
import { UserProfile } from './types';
import { ShieldCheck, Heart, Sparkles, Globe, ArrowRight } from 'lucide-react';

export function App() {
  const [activeRoute, setActiveRoute] = useState<string>('/');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const [user, setUser] = useState<UserProfile>({
    id: 'usr-hippox-01',
    name: 'Chief Linguistic Architect',
    email: 'architect@hippox.ai',
    tier: 'enterprise',
    preferred_source_lang: 'eng',
    preferred_target_lang: 'spa',
    auto_speak: false,
    retain_audio: false,
    created_at: new Date().toISOString()
  });

  useEffect(() => {
    // Keyboard shortcut for Cmd+K / Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const renderActiveView = () => {
    switch (activeRoute) {
      case '/':
        return <HomeView onNavigate={setActiveRoute} />;
      case '/translate':
        return (
          <div className="space-y-6 pb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4E6] border border-[#E8D9B4] text-xs font-bold text-[#8C6D23] mb-2">
                <Globe className="w-3.5 h-3.5" />
                <span>Multi-Engine Translation</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1918]">Universal Translation Workspace</h1>
              <p className="text-xs sm:text-sm text-[#6E6A61] mt-1">
                Translate across 7,191 indexed living languages with capability-graded AI models and confidence scoring.
              </p>
            </div>
            <TranslationWorkspace onNavigateToTab={setActiveRoute} />
          </div>
        );
      case '/grammar':
        return <GrammarView />;
      case '/conversation':
        return <ConversationView />;
      case '/languages':
        return <LanguagesView />;
      case '/voice':
        return <VoiceView />;
      case '/documents':
        return <DocumentsView />;
      case '/history':
        return <HistoryView />;
      case '/saved':
        return <SavedView />;
      case '/analytics':
        return <AnalyticsView />;
      case '/api':
        return <ApiView />;
      case '/pricing':
        return <PricingView />;
      case '/settings':
        return <SettingsView />;
      case '/profile':
        return <ProfileView user={user} onUpdateUser={handleUpdateUser} />;
      default:
        return <HomeView onNavigate={setActiveRoute} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1918] font-sans antialiased selection:bg-[#F4EAD2] selection:text-[#8C6D23]">
      {/* Global Command Search (Cmd+K) */}
      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setActiveRoute}
      />

      {/* Top Navigation */}
      <TopNav
        activeRoute={activeRoute}
        onRouteChange={setActiveRoute}
        user={user}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Structural Body */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeRoute={activeRoute}
          onRouteChange={setActiveRoute}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Dynamic Route Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Platform Micro Footer */}
      <footer className="border-t border-[#EAE6DC] bg-white py-4 px-6 text-xs text-[#7A756C]">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1A1918]">HippoX Multilingual Platform</span>
            <span>&bull;</span>
            <span>One Voice. Every Language.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#287D3C]" />
              <span>Zero-Data Retention Verified</span>
            </span>
            <span>&bull;</span>
            <span className="font-mono text-[#8C6D23]">v2.5.0 Production Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
