import React from 'react';
import {
  MessageSquare,
  LayoutDashboard,
  Radio,
  Brain,
  Activity,
  Settings,
  Plus,
  GitBranch,
  Mail,
  FileText,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { Connection } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  connections: Connection[];
  onNewConversation: () => void;
  isDemoMode: boolean;
  onOpenDemoControls: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  connections,
  onNewConversation,
  isDemoMode,
  onOpenDemoControls,
}) => {
  const isGithubConnected = connections.find((c) => c.provider === 'github')?.status === 'connected';
  const isGmailConnected = connections.find((c) => c.provider === 'gmail')?.status === 'connected';

  const navItems = [
    { id: 'chat', label: 'Ask PulseDesk', icon: MessageSquare },
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'connections', label: 'Connections', icon: Radio },
    { id: 'memory', label: 'Memory', icon: Brain },
    { id: 'activity', label: 'Agent activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-sidebar-bg flex flex-col justify-between border-r border-[#1F2937] select-none text-sidebar-text">
      {/* Top Branding & Workspace Selector */}
      <div>
        <div className="px-5 py-5 flex items-center justify-between border-b border-[#1F2937]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal flex items-center justify-center text-white shadow-sm shadow-teal/30">
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            </div>
            <span className="font-semibold text-lg text-white tracking-tight">PulseDesk</span>
          </div>
          <button
            onClick={onNewConversation}
            title="Start new question"
            className="w-7 h-7 rounded-md bg-[#1D2530] hover:bg-teal hover:text-white flex items-center justify-center text-gray-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Dropdown Button */}
        <div className="px-3 pt-3">
          <div className="px-3 py-2 rounded-lg bg-[#18202A] border border-[#273240] flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Layers className="w-4 h-4 text-teal shrink-0" />
              <div className="truncate">
                <div className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">Workspace</div>
                <div className="text-xs font-medium text-white truncate">Project Alpha</div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        {/* Primary Navigation */}
        <div className="px-3 pt-4">
          <div className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider px-3 mb-1.5">
            Workspace
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-teal/15 text-white font-semibold shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1D2530]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-teal' : 'text-gray-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Connected Sources Status */}
        <div className="px-3 pt-6">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
              Connected Sources
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 py-1.5 text-xs text-gray-400 rounded-md hover:bg-[#1D2530] transition-colors">
              <div className="flex items-center gap-2">
                <GitBranch className="w-3.5 h-3.5 text-gray-400" />
                <span>GitHub</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isGithubConnected ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-gray-600'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-1.5 text-xs text-gray-400 rounded-md hover:bg-[#1D2530] transition-colors">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>Gmail</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isGmailConnected ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-gray-600'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-1.5 text-xs text-gray-500 rounded-md">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-gray-500" />
                <span>Notion</span>
              </div>
              <span className="text-[10px] text-gray-500">Coming soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Profile & Mode Indicator */}
      <div className="p-3 border-t border-[#1F2937]/70">
        <button
          onClick={onOpenDemoControls}
          className="w-full mb-2 px-3 py-2 rounded-lg bg-teal/10 hover:bg-teal/20 border border-teal/20 flex items-center justify-between transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal" />
            <span className="text-xs font-medium text-teal-light">Demo State Controller</span>
          </div>
          <span className="text-[10px] bg-teal/20 text-teal-light px-1.5 py-0.5 rounded font-mono">
            {isDemoMode ? 'Active' : 'Live'}
          </span>
        </button>

        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#1D2530] transition-colors">
          <div className="w-7 h-7 rounded-full bg-[#273240] text-gray-200 font-semibold text-xs flex items-center justify-center border border-gray-600">
            S
          </div>
          <div className="truncate">
            <div className="text-xs font-medium text-white truncate">My Workspace</div>
            <div className="text-[10px] text-gray-400">Single-user preview</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

