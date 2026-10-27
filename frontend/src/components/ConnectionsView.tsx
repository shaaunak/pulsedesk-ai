import React, { useState } from 'react';
import {
  Plus,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Settings,
  Sliders,
  Check,
  Info,
} from 'lucide-react';
import { Connection } from '../types';

interface ConnectionsViewProps {
  connections: Connection[];
  onToggleConnection: (provider: string) => void;
}

export const ConnectionsView: React.FC<ConnectionsViewProps> = ({
  connections,
  onToggleConnection,
}) => {
  const [activeModalProvider, setActiveModalProvider] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const isConnected = (id: string) => {
    const conn = connections.find((c) => c.provider === id);
    if (conn) return conn.status === 'connected';
    // Defaults for visual fidelity
    return ['github', 'gmail', 'linear'].includes(id);
  };

  const handleManualSync = (id: string, name: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
      setSuccessToast(`Synchronized latest events from ${name}`);
      setTimeout(() => setSuccessToast(null), 3000);
    }, 900);
  };

  const sourcesList = [
    {
      id: 'github',
      name: 'GitHub',
      description: '2 repositories connected',
      secondaryText: 'Last synced 5 minutes ago',
      color: 'bg-slate-900 text-white',
      logo: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
      details: {
        repos: ['pulsedesk/project-alpha', 'pulsedesk/core-api'],
        scopes: ['repo:read', 'issues:read', 'pull_requests:read'],
        webhook: 'https://api.pulsedesk.internal/v1/webhooks/github',
        lastCommit: 'feat: Improve webhook validation (2h ago)',
      },
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Personal inbox connected',
      secondaryText: 'Last synced 12 minutes ago',
      color: 'bg-red-50 text-red-600 border border-red-100',
      logo: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      ),
      details: {
        account: 'shaunak@workspace.internal',
        scopes: ['gmail.readonly', 'metadata.read'],
        filter: 'label:project-alpha OR subject:"launch approval"',
        lastEmail: 'Re: Staging Demo Sign-off (yesterday)',
      },
    },
    {
      id: 'linear',
      name: 'Linear',
      description: 'Project workspace connected',
      secondaryText: 'Last synced 8 minutes ago',
      color: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      logo: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#5E6AD2" />
          <path d="M7 16.5L16.5 7M7.5 12.5L12.5 7.5M11.5 16.5L16.5 11.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      details: {
        team: 'Alpha Engineering',
        scopes: ['issues:read', 'projects:read', 'cycles:read'],
        linkedCycles: 'Cycle 24 (Oct 21 - Nov 04)',
        lastUpdate: 'Issue LIN-894 updated by Product Council',
      },
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Connect your Notion workspace to get docs and knowledge.',
      secondaryText: null,
      color: 'bg-slate-100 text-slate-800 border border-slate-200',
      logo: (
        <div className="w-6 h-6 rounded flex items-center justify-center font-serif font-black text-slate-900 border border-slate-300 bg-white text-xs">
          N
        </div>
      ),
      details: {
        scopes: ['pages:read', 'databases:read'],
        suggested: 'Product Roadmap, Design Specs, Sprint Wiki',
      },
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get team conversations and important updates.',
      secondaryText: null,
      color: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      logo: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
        </svg>
      ),
      details: {
        scopes: ['channels:read', 'groups:read', 'chat:write'],
        suggested: '#alpha-eng, #launch-war-room, #announcements',
      },
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full pb-32 animate-fade-in">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Sources</h1>
          <p className="text-sm text-slate-500 mt-1">
            Connect and manage your data sources.
          </p>
        </div>

        <button
          onClick={() => setActiveModalProvider('new')}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add source</span>
        </button>
      </div>

      {/* Sources Grid matching reference screen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sourcesList.map((source) => {
            const connected = isConnected(source.id);
            const isSyncing = syncingId === source.id;

            return (
              <div
                key={source.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between group min-h-[190px]"
              >
                <div>
                  {/* Top Bar: Icon and Status */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                      {source.logo}
                    </div>

                    {connected ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Connected
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          onToggleConnection(source.id);
                          setSuccessToast(`${source.name} authorization requested`);
                          setTimeout(() => setSuccessToast(null), 3000);
                        }}
                        className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        title={`Connect ${source.name}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="mt-4">
                    <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {source.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {source.description}
                    </p>
                    {source.secondaryText && (
                      <p className="text-[11px] text-slate-400 mt-1">
                        {source.secondaryText}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {connected ? (
                    <>
                      <button
                        onClick={() => setActiveModalProvider(source.id)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Configure</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleManualSync(source.id, source.name)}
                        disabled={isSyncing}
                        className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Sync now"
                      >
                        <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
                        <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        onToggleConnection(source.id);
                        setSuccessToast(`${source.name} connected successfully`);
                        setTimeout(() => setSuccessToast(null), 3000);
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Connect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add New Source Dashed Card */}
          <div
            onClick={() => setActiveModalProvider('new')}
            className="rounded-2xl border-2 border-dashed border-slate-200/90 p-5 hover:border-slate-300 bg-white/50 hover:bg-white transition-all flex flex-col justify-between cursor-pointer group min-h-[190px]"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <Plus className="w-5 h-5" />
              </div>

              <div className="mt-4">
                <h2 className="text-base font-semibold text-slate-900">Add new source</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Connect additional tools to enhance your project intelligence.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100/60 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 flex items-center gap-1">
                <span>Browse Integrations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

      {/* Configuration & Details Modal */}
      {activeModalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {activeModalProvider === 'new'
                      ? 'Add New Integration Source'
                      : `Configure ${activeModalProvider.toUpperCase()}`}
                  </h3>
                  <p className="text-xs text-slate-400">Strict Read-Only Least-Privilege Scopes</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalProvider(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-medium px-2 py-1 rounded-md cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600">
              {activeModalProvider === 'new' ? (
                <div className="space-y-3">
                  <p className="text-slate-500 leading-relaxed">
                    PulseDesk connects with modern developer conduits via MCP (Model Context Protocol) and official OAuth 2.0. Select a conduit below to connect:
                  </p>
                  <div className="space-y-2">
                    {['Jira Software', 'PostgreSQL pgvector', 'Confluence', 'Sentry Logs'].map((tool) => (
                      <div
                        key={tool}
                        onClick={() => {
                          setSuccessToast(`${tool} added to project scope`);
                          setActiveModalProvider(null);
                          setTimeout(() => setSuccessToast(null), 3000);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-all"
                      >
                        <span className="font-medium text-slate-800">{tool}</span>
                        <span className="text-[11px] font-semibold text-blue-600">Connect →</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-[11px]">
                    <div className="text-slate-500 font-sans font-medium text-xs">Security & Scope Verification:</div>
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Zero-write guarantee (read-only queries)</span>
                    </div>
                    <div className="text-slate-600">Sync Frequency: Every 5 minutes</div>
                    <div className="text-slate-600">Local Cache: PostgreSQL + Vector Index</div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        onToggleConnection(activeModalProvider);
                        setActiveModalProvider(null);
                        setSuccessToast(`${activeModalProvider} status updated`);
                        setTimeout(() => setSuccessToast(null), 3000);
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer"
                    >
                      Disconnect Conduit
                    </button>
                    <button
                      onClick={() => {
                        handleManualSync(activeModalProvider, activeModalProvider);
                        setActiveModalProvider(null);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer shadow-xs"
                    >
                      Save & Force Sync
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
