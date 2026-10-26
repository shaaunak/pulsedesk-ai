import React from 'react';
import {
  Plus,
  SlidersHorizontal,
  User,
  LayoutDashboard,
  Sparkles,
  Network,
  Activity,
  Brain,
} from 'lucide-react';

interface SideNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewEntity?: () => void;
  isDemoMode: boolean;
  onOpenDemoControls: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeTab,
  setActiveTab,
  onNewEntity,
  isDemoMode,
  onOpenDemoControls,
}) => {
  const navTabs = [
    {
      id: 'overview',
      label: 'Overview',
      materialIcon: 'dashboard',
    },
    {
      id: 'ask',
      label: 'Ask PulseDesk',
      materialIcon: 'auto_awesome',
    },
    {
      id: 'radar',
      label: 'Change Radar',
      materialIcon: 'radar',
    },
    {
      id: 'topology',
      label: 'Topology',
      materialIcon: 'hub',
    },
    {
      id: 'stream',
      label: 'Stream',
      materialIcon: 'dynamic_feed',
    },
    {
      id: 'memory',
      label: 'Memory',
      materialIcon: 'neurology',
    },
    {
      id: 'connections',
      label: 'Connections',
      materialIcon: 'cable',
    },
  ];

  return (
    <>
      {/* Desktop Navigation Rail (68-72px, hidden on mobile) */}
      <aside
        aria-label="PulseDesk Navigation Rail"
        className="hidden md:flex fixed top-0 left-0 h-screen w-18 flex-col justify-between py-6 border-r border-outline-variant/30 bg-surface-container-lowest z-40 shadow-2xl select-none"
      >
        {/* Top Brand Emblem */}
        <div className="flex flex-col items-center gap-5 w-full">
          <div
            onClick={() => setActiveTab('overview')}
            className="relative group cursor-pointer"
            title="PulseDesk AI Project Intelligence"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-container to-secondary-container p-0.5 shadow-lg shadow-black/60 flex items-center justify-center">
              <div className="w-full h-full bg-surface-container-lowest rounded-[10px] flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl" data-icon="neurology">
                  neurology
                </span>
              </div>
            </div>
            <span className="sr-only">PulseDesk AI Project Intelligence</span>
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-tertiary border-2 border-surface-container-lowest" />
          </div>

          {/* Quick Action / Add CTA */}
          <button
            onClick={onNewEntity}
            className="w-9 h-9 rounded-xl bg-surface-container-high/60 hover:bg-primary-container hover:text-on-primary-container text-primary transition-all duration-200 active:scale-95 flex items-center justify-center shadow-sm cursor-pointer"
            title="Add context, entity or new inquiry"
            type="button"
          >
            <span className="material-symbols-outlined text-lg" data-icon="add">
              add
            </span>
          </button>

          {/* Primary Navigation Rail Items (5 tabs) */}
          <nav className="flex flex-col items-center gap-2.5 w-full px-2 mt-1">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative rounded-xl p-3 flex items-center justify-center w-full transition-all group cursor-pointer ${
                    isActive
                      ? 'text-primary bg-primary/15 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-primary before:rounded-r'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40 active:scale-95'
                  }`}
                  title={tab.label}
                  type="button"
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    data-icon={tab.materialIcon}
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {tab.materialIcon}
                  </span>
                  <span className="sr-only">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Action Tabs (Settings, User Profile) */}
        <div className="flex flex-col items-center gap-3 w-full px-2 border-t border-outline-variant/20 pt-4">
          {/* Recruiter Demo State Badge */}
          <button
            onClick={onOpenDemoControls}
            className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-all relative cursor-pointer"
            title="Open Demo Controller"
            type="button"
          >
            <span className="material-symbols-outlined text-base" data-icon="tune">
              tune
            </span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`rounded-xl p-2.5 transition-colors w-full flex items-center justify-center cursor-pointer ${
              activeTab === 'settings'
                ? 'text-primary bg-primary/15'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40'
            }`}
            title="Settings"
            type="button"
          >
            <span className="material-symbols-outlined text-lg" data-icon="settings">
              settings
            </span>
            <span className="sr-only">Settings</span>
          </button>

          <button
            onClick={onOpenDemoControls}
            className="relative rounded-xl p-1.5 transition-transform active:scale-95 group focus:outline-hidden cursor-pointer"
            title="Workspace Operator Profile"
            type="button"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-outline-variant/40 bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl" data-icon="account_circle">
                account_circle
              </span>
            </div>
            <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-tertiary ring-2 ring-surface-container-lowest" />
            <span className="sr-only">Executive Operator Avatar</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Visible only on < 768px screens) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-surface-container-lowest border-t border-outline-variant/30 z-50 flex items-center justify-around px-2 shadow-2xl"
      >
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-lg" data-icon={tab.materialIcon}>
                {tab.materialIcon}
              </span>
              <span className="text-[9px] font-mono mt-0.5">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
        <button
          onClick={onOpenDemoControls}
          className="flex flex-col items-center justify-center p-1.5 rounded-lg text-tertiary"
        >
          <span className="material-symbols-outlined text-lg" data-icon="tune">
            tune
          </span>
          <span className="text-[9px] font-mono mt-0.5">Demo</span>
        </button>
      </nav>
    </>
  );
};

