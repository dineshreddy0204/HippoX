import React from 'react';
import { 
  Home, Languages, SpellCheck, MessagesSquare, Mic2, FileText, 
  History, Bookmark, BarChart3, Code2, Settings, ChevronLeft, ChevronRight,
  Sparkles, Globe2, Layers
} from 'lucide-react';

interface SidebarProps {
  activeRoute: string;
  onRouteChange: (route: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRoute,
  onRouteChange,
  collapsed,
  onToggleCollapse
}) => {
  const navigationItems = [
    { id: '/', label: 'Home', icon: Home },
    { id: '/translate', label: 'Translate', icon: Languages, badge: 'Core' },
    { id: '/grammar', label: 'Grammar', icon: SpellCheck, badge: 'AI' },
    { id: '/conversation', label: 'Conversation', icon: MessagesSquare, badge: 'Live' },
    { id: '/languages', label: 'Languages', icon: Globe2, count: '7,191' },
    { id: '/voice', label: 'Voice Tools', icon: Mic2 },
    { id: '/documents', label: 'Documents', icon: FileText },
    { id: '/history', label: 'History', icon: History },
    { id: '/saved', label: 'Saved Items', icon: Bookmark },
    { id: '/analytics', label: 'Analytics', icon: BarChart3 },
    { id: '/api', label: 'Developer API', icon: Code2 },
    { id: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className={`relative z-30 transition-all duration-300 ease-in-out border-r border-[#EAE6DC] bg-[#FFFFFF] flex flex-col justify-between select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Section */}
      <div className="p-3">
        {/* Collapse Toggle Button */}
        <div className="flex items-center justify-between mb-3 px-2">
          {!collapsed && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E9A90]">
              Workspace
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-[#8A857A] hover:text-[#1A1918] hover:bg-[#F6F4EE] transition-colors ml-auto cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            id="sidebar-toggle-btn"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onRouteChange(item.id)}
                id={`sidebar-nav-${item.id.replace('/', '') || 'home'}`}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#F4EAD2] to-[#FBF8F1] text-[#1A1918] border border-[#E4D1A4] shadow-[0_2px_8px_rgba(197,160,89,0.15)] font-bold'
                    : 'text-[#5C5952] hover:bg-[#FAF8F5] hover:text-[#1A1918] border border-transparent'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#C5A059] text-white shadow-xs'
                      : 'text-[#7D786E] group-hover:text-[#C5A059] group-hover:bg-[#F6F3EB]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#FAF4E6] text-[#8C6D23] border border-[#E9D9B2]">
                        {item.badge}
                      </span>
                    )}
                    {item.count && (
                      <span className="text-[10px] font-mono text-[#8C6D23] font-bold">
                        {item.count}
                      </span>
                    )}
                  </div>
                )}

                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1A1918] text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-lg">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promo / Engine Status Card */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-[#FAF8F3] via-[#F6F1E5] to-[#EFE7D5] border border-[#E4D7BA] shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-[#C5A059] text-white flex items-center justify-center">
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="text-xs font-bold text-[#1A1918]">Enterprise Polyglot</span>
          </div>
          <p className="text-[11px] text-[#635F56] leading-relaxed mb-3">
            Multi-engine architecture with capability verification and confidence tracking across 7,191 languages.
          </p>
          <button
            onClick={() => onRouteChange('/pricing')}
            className="w-full py-1.5 px-2.5 rounded-xl bg-white text-[#8C6D23] text-xs font-bold border border-[#DAC8A0] hover:bg-[#FAF8F5] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            Explore Pro Tiers →
          </button>
        </div>
      ) : (
        <div className="p-3 flex justify-center">
          <button
            onClick={() => onRouteChange('/pricing')}
            className="w-9 h-9 rounded-xl bg-[#F6F1E5] border border-[#E4D7BA] flex items-center justify-center text-[#8C6D23] hover:bg-[#EFE7D5] transition-colors cursor-pointer"
            title="Enterprise Plan"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
