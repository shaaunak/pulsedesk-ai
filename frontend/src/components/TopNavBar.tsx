import React from 'react';
import { RefreshCw, Search, Sparkles } from 'lucide-react';
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
}) => {
  const isOpenBlocker = issue42State === 'open';

  return (
    <header className="fixed top-0 left-0 md:left-18 right-0 h-16 border-b border-outline-variant/20 bg-surface/85 backdrop-blur-md shadow-xs z-30 flex items-center select-none">
      <div className="flex justify-between items-center h-full px-4 sm:px-6 w-full">
        {/* Left side: Brand, Active Workspace, and Clear Demo Mode Indicator */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              onClick={() => setActiveTab('overview')}
              className="font-headline font-semibold text-sm sm:text-base text-on-surface tracking-tight cursor-pointer whitespace-nowrap"
            >
              PulseDesk
            </span>
            <span className="text-outline-variant text-sm font-light">/</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-low border border-outline-variant/30 cursor-pointer hover:border-outline-variant/60 transition-colors">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-body text-xs text-on-surface font-medium truncate max-w-[100px] sm:max-w-none">
                Project Alpha
              </span>
            </div>
          </div>

          {/* Explicit Synthetic Demo Status Badge (Replaces cluttered sync pills) */}
          <div className="hidden sm:flex items-center pl-3 border-l border-outline-variant/25">
            <button
              onClick={onToggleDemoState}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono transition-all border cursor-pointer ${
                isOpenBlocker
                  ? 'bg-error-container/20 border-error-container/40 text-error hover:bg-error-container/30'
                  : 'bg-primary/15 border-primary/30 text-primary hover:bg-primary/25'
              }`}
              title="Click to toggle between Open Blocker and Resolved states in the demo environment"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isOpenBlocker ? 'bg-error animate-pulse' : 'bg-primary'}`} />
              <span>Demo Fixtures · {isOpenBlocker ? 'Blocker #42 Open' : 'Blocker Resolved'}</span>
              <RefreshCw className="w-2.5 h-2.5 opacity-60" />
            </button>
          </div>
        </div>

        {/* Right side: Clean Search and Primary 'Ask PulseDesk' Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search bar with Cmd+K */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface transition-all text-left group cursor-pointer"
            type="button"
          >
            <Search className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary transition-colors" />
            <span className="font-body text-xs text-on-surface-variant/80 hidden sm:inline">
              Search workspace...
            </span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant/70 border border-outline-variant/20 tracking-wider font-mono">
              Cmd+K
            </kbd>
          </button>

          {/* Primary Action Button: Natural Human Language ('Ask PulseDesk') */}
          <button
            onClick={onDeployIntelligence}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-lg bg-primary hover:bg-primary-fixed text-on-primary font-body text-xs font-semibold tracking-wide shadow-md shadow-primary/20 transition-all duration-200 active:scale-95 cursor-pointer"
            type="button"
          >
            <Sparkles className="w-3.5 h-3.5 text-on-primary" />
            <span className="hidden sm:inline">Ask PulseDesk</span>
            <span className="sm:hidden">Ask</span>
          </button>
        </div>
      </div>
    </header>
  );
};
