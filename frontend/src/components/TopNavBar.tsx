import React from 'react';
import { Search, Bell, ChevronDown, RefreshCw, Menu } from 'lucide-react';
import { Connection } from '../types';

interface TopNavBarProps {
  connections: Connection[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onDeployIntelligence: () => void;
  isDemoMode: boolean;
  issue42State: string;
  onToggleDemoState: () => void;
  onToggleMobileMenu?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  connections,
  activeTab,
  setActiveTab,
  onOpenSearch,
  onDeployIntelligence,
  isDemoMode,
  issue42State,
  onToggleDemoState,
  onToggleMobileMenu,
}) => {
  const isOpenBlocker = issue42State === 'open';

  return (
    <header className="fixed top-0 left-0 md:left-60 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 z-20 flex items-center select-none px-4 sm:px-6">
      <div className="flex justify-between items-center w-full">
        {/* Left Side: Mobile Menu Toggle + Project Selector */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 -ml-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider leading-none">
              Project
            </span>
            <button
              onClick={() => setActiveTab('projects')}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors mt-0.5 cursor-pointer"
            >
              <span>Alpha</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Demo Mode Toggle Badge */}
          <div className="hidden sm:flex items-center ml-4 pl-4 border-l border-slate-100">
            <button
              onClick={onToggleDemoState}
              className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium transition-all border cursor-pointer ${
                isOpenBlocker
                  ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100/60'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100/60'
              }`}
              title="Click to toggle Issue #42 open/closed in the demo environment"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isOpenBlocker ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span>{isOpenBlocker ? 'Blocker #42 Open' : 'Blocker Resolved'}</span>
              <RefreshCw className="w-2.5 h-2.5 opacity-60" />
            </button>
          </div>
        </div>

        {/* Right Side: Search, Notifications, Avatar */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-400 hover:text-slate-600 transition-all text-xs font-normal cursor-pointer w-48 sm:w-64 justify-between"
            type="button"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">Search anything...</span>
            </div>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-400 border border-slate-200/80 font-mono tracking-tight">
              ⌘K
            </kbd>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setActiveTab('changes')}
            className="relative w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Notifications & Updates"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          {/* User Avatar Circle */}
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-xs shadow-xs">
            S
          </div>
        </div>
      </div>
    </header>
  );
};
export default TopNavBar;
