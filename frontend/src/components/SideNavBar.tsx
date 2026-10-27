import React from 'react';
import {
  Home,
  Sparkles,
  FolderKanban,
  Database,
  Brain,
  GitBranch,
  Activity,
  Plus,
  ChevronRight,
  GitPullRequest,
  Mail,
  Layers,
  X,
} from 'lucide-react';

interface SideNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewEntity?: () => void;
  isDemoMode: boolean;
  onOpenDemoControls: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeTab,
  setActiveTab,
  onNewEntity,
  isDemoMode,
  onOpenDemoControls,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const primaryNav = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'ask', label: 'Ask PulseDesk', icon: Sparkles },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'sources', label: 'Sources', icon: Database },
    { id: 'memory', label: 'Memory', icon: Brain },
    { id: 'changes', label: 'Changes', icon: GitBranch },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  const integrations = [
    { id: 'github', name: 'GitHub', icon: GitPullRequest, connected: true },
    { id: 'gmail', name: 'Gmail', icon: Mail, connected: true },
    { id: 'linear', name: 'Linear', icon: Layers, connected: true },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">PulseDesk</span>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Primary Navigation List */}
        <nav className="p-3 space-y-1">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Integrations Section */}
        <div className="px-5 pt-4 pb-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Integrations
          </div>
          <div className="space-y-1">
            {integrations.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab('sources')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.name}</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected" />
                </button>
              );
            })}

            {/* Add Source Button */}
            <button
              onClick={() => handleSelectTab('sources')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-colors text-left cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add source</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={onOpenDemoControls}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xs shrink-0 shadow-xs">
              S
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-900 truncate">Shaunak</div>
              <div className="text-[11px] text-slate-400 truncate">Personal Workspace</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed left 240px) */}
      <aside
        aria-label="Sidebar Navigation"
        className="hidden md:flex fixed top-0 bottom-0 left-0 w-60 bg-white border-r border-slate-200/90 z-30 flex-col justify-between"
      >
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
export default SideNavBar;
