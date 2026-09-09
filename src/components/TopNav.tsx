import React, { useState } from 'react';
import { 
  Search, Bell, Sparkles, User, Globe, ChevronDown, CheckCircle2, 
  ExternalLink, Key, Settings, LogOut, ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface TopNavProps {
  activeRoute: string;
  onRouteChange: (route: string) => void;
  user: UserProfile;
  onOpenSearch: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeRoute,
  onRouteChange,
  user,
  onOpenSearch
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: '1', title: 'Registry Sync', desc: '7,240 living languages catalog verified', time: '10m ago' },
    { id: '2', title: 'Neural Engine Online', desc: 'Gemini 2.5 Flash & Whisper pipelines operational', time: '1h ago' },
    { id: '3', title: 'Speech Studio Updated', desc: 'Bidirectional audio latency optimized to <320ms', time: '3h ago' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#EAE6DC] transition-all">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onRouteChange('/')}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
            id="hippox-logo-btn"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E1C18] to-[#2D2A24] border border-[#C5A059]/40 flex items-center justify-center shadow-sm group-hover:border-[#C5A059] transition-all">
              <span className="font-display font-bold text-white text-base tracking-tight">H</span>
              <span className="font-display font-extrabold text-[#D4AF37] text-base drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]">X</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display font-bold text-lg tracking-tight text-[#1A1918]">Hippo</span>
                <span className="font-display font-extrabold text-lg tracking-tight text-[#C5A059]">X</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#F4EAD2] text-[#8C6D23] rounded-full uppercase tracking-wider ml-1">
                  AI
                </span>
              </div>
              <span className="text-[11px] text-[#78756E] font-medium hidden sm:block">One Voice. Every Language.</span>
            </div>
          </button>

          {/* Quick Top Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-[#5A5852]">
            <button
              onClick={() => onRouteChange('/translate')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeRoute === '/translate'
                  ? 'bg-[#F4EAD2] text-[#8C6D23] font-bold shadow-xs'
                  : 'hover:text-[#1A1918] hover:bg-[#F6F4EE]'
              }`}
            >
              Translate
            </button>
            <button
              onClick={() => onRouteChange('/grammar')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeRoute === '/grammar'
                  ? 'bg-[#F4EAD2] text-[#8C6D23] font-bold shadow-xs'
                  : 'hover:text-[#1A1918] hover:bg-[#F6F4EE]'
              }`}
            >
              Grammar
            </button>
            <button
              onClick={() => onRouteChange('/conversation')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeRoute === '/conversation'
                  ? 'bg-[#F4EAD2] text-[#8C6D23] font-bold shadow-xs'
                  : 'hover:text-[#1A1918] hover:bg-[#F6F4EE]'
              }`}
            >
              Conversation
            </button>
            <button
              onClick={() => onRouteChange('/languages')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeRoute === '/languages'
                  ? 'bg-[#F4EAD2] text-[#8C6D23] font-bold shadow-xs'
                  : 'hover:text-[#1A1918] hover:bg-[#F6F4EE]'
              }`}
            >
              Languages (7,191)
            </button>
            <button
              onClick={() => onRouteChange('/api')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeRoute === '/api'
                  ? 'bg-[#F4EAD2] text-[#8C6D23] font-bold shadow-xs'
                  : 'hover:text-[#1A1918] hover:bg-[#F6F4EE]'
              }`}
            >
              API
            </button>
          </nav>
        </div>

        {/* Center/Right: Global Search Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F3] border border-[#EAE6DC] text-xs text-[#7A7770] hover:border-[#C5A059]/60 hover:bg-white transition-all shadow-xs cursor-pointer w-36 sm:w-60 justify-between"
            id="global-search-trigger"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-[#A69B88]" />
              <span className="truncate">Search 7,191 languages...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-[#E0DBD0] rounded text-[#8A857A]">
              ⌘K
            </kbd>
          </button>

          {/* System Status Pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3F8F2] border border-[#D1E7D0] text-[11px] font-medium text-[#2E6830]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950] animate-pulse" />
            <span>AI Multi-Engine Active</span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-[#5A5852] hover:bg-[#F6F4EE] hover:text-[#1A1918] transition-colors relative cursor-pointer"
              title="Notifications"
              id="notifications-btn"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C5A059]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#EAE6DC] shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F0ECE1]">
                  <span className="text-xs font-bold text-[#1A1918]">System Updates</span>
                  <span className="text-[10px] text-[#8C6D23] font-semibold">Live Stream</span>
                </div>
                <div className="space-y-2">
                  {notifications.map(n => (
                    <div key={n.id} className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#1A1918]">{n.title}</span>
                        <span className="text-[10px] text-[#918D83]">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#66635C] mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-[#EAE6DC] bg-white hover:border-[#C5A059]/60 transition-all cursor-pointer"
              id="user-menu-btn"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#EBD7A0] flex items-center justify-center text-[11px] font-bold text-[#2A200B]">
                HX
              </div>
              <span className="text-xs font-semibold text-[#1A1918] hidden sm:block">Architect</span>
              <ChevronDown className="w-3 h-3 text-[#8A857A]" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#EAE6DC] shadow-xl p-3 z-50">
                <div className="pb-3 border-b border-[#F0ECE1] mb-2">
                  <div className="text-xs font-bold text-[#1A1918]">{user.name}</div>
                  <div className="text-[11px] text-[#807D75] truncate">{user.email}</div>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F4EAD2] text-[#8C6D23] text-[10px] font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3" />
                    {user.tier} Tier Plan
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => { setShowUserMenu(false); onRouteChange('/profile'); }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#4D4B46] hover:bg-[#F6F4EE] hover:text-[#1A1918] cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-[#C5A059]" />
                    Profile & Language Preferences
                  </button>
                  <button
                    onClick={() => { setShowUserMenu(false); onRouteChange('/api'); }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#4D4B46] hover:bg-[#F6F4EE] hover:text-[#1A1918] cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5 text-[#C5A059]" />
                    API Credentials
                  </button>
                  <button
                    onClick={() => { setShowUserMenu(false); onRouteChange('/settings'); }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#4D4B46] hover:bg-[#F6F4EE] hover:text-[#1A1918] cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#C5A059]" />
                    System Settings
                  </button>
                  <button
                    onClick={() => { setShowUserMenu(false); onRouteChange('/pricing'); }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#8C6D23] bg-[#FAF6EC] hover:bg-[#F4EAD2] cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Upgrade Platform Quota
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
