import React from 'react';
import { GitBranch, Mail, FileText, Shield, RefreshCw, CheckCircle2, Sparkles, ExternalLink, Info } from 'lucide-react';
import { Connection } from '../types';

interface ConnectionsViewProps {
  connections: Connection[];
  onToggleConnection: (provider: string) => void;
}

export const ConnectionsView: React.FC<ConnectionsViewProps> = ({
  connections,
  onToggleConnection,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-primary/15 text-primary border border-primary/30">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Connected
          </span>
        );
      case 'syncing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-secondary-container/30 text-secondary border border-secondary-container/50">
            <RefreshCw className="w-3 h-3 animate-spin text-secondary" />
            Syncing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-surface-container text-on-surface-variant border border-outline-variant/30">
            <span className="w-1.5 h-1.5 rounded-full bg-outline" />
            Not Connected
          </span>
        );
    }
  };

  const providers = [
    {
      id: 'github',
      name: 'GitHub MCP Conduit',
      icon: GitBranch,
      description: 'Fetch issues, pull requests, and repository metadata via official Model Context Protocol (MCP 2.x stdio transport).',
      scope: 'repo:read, issues:read (Strict Read-only)',
      mode: 'Active Fixture · Project Alpha (#42, PR #342)',
      modeType: 'fixture',
      status: connections.find((c) => c.provider === 'github')?.status || 'connected',
      lastChecked: 'Live API & Fixture Ready (14m ago)',
    },
    {
      id: 'gmail',
      name: 'Gmail OAuth 2.0 Conduit',
      icon: Mail,
      description: 'Search project communications, decisions, deadlines, and approvals using Google OAuth 2.0.',
      scope: 'gmail.readonly (Strict Read-only)',
      mode: 'Active Fixture · VP Finance Thread (Elena Rostova)',
      modeType: 'fixture',
      status: connections.find((c) => c.provider === 'gmail')?.status || 'connected',
      lastChecked: 'Synced 1h ago',
    },
    {
      id: 'notion',
      name: 'Linear & Notion Conduit',
      icon: FileText,
      description: 'Engineering tickets, product specs and sprint documentation connector (Planned for SaaS release).',
      scope: 'pages:read, databases:read',
      mode: 'Planned Connector',
      modeType: 'pending',
      status: 'not_connected',
      lastChecked: 'Awaiting configuration',
      isComingSoon: true,
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto pb-32">
      {/* Header */}
      <div className="px-8 py-5 border-b border-outline-variant/20 bg-surface-container-lowest/60">
        <h2 className="font-display text-xl font-bold text-on-surface">Connections Center</h2>
        <p className="font-body text-xs text-on-surface-variant mt-1">
          Manage external tool conduits, data modes, and least-privilege read-only authorizations.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl w-full mx-auto p-8 space-y-6">
        {/* Real Data vs Synthetic Demonstration Data Banner */}
        <div className="p-5 rounded-2xl bg-surface-container-low hairline-border-strong border-primary/30 shadow-xl space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-headline text-sm font-semibold text-white">
                  Data Architecture: Dual Execution Modes
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-primary/20 text-primary border border-primary/30">
                  Demo Fixtures Active
                </span>
              </div>
              <p className="font-body text-xs text-on-surface leading-relaxed">
                PulseDesk distinguishes clearly between <strong>live external conduits</strong> and <strong>deterministic demo fixtures</strong>:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-surface-container-lowest hairline-border text-xs space-y-1">
              <div className="font-semibold text-primary font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Deterministic Demo Fixtures</span>
              </div>
              <p className="text-on-surface-variant leading-relaxed text-[11px]">
                Active for portfolio demonstrations and reproducible evaluation (Q01–Q10 benchmarks). Provides the Stripe HMAC failure scenario (Issue #42) and VP Finance sign-off thread without requiring personal third-party credentials.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-lowest hairline-border text-xs space-y-1">
              <div className="font-semibold text-secondary font-mono flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live External APIs</span>
              </div>
              <p className="text-on-surface-variant leading-relaxed text-[11px]">
                To switch to live GitHub MCP and Gmail APIs, supply <code className="bg-surface-container px-1 py-0.5 rounded text-white font-mono">GITHUB_PERSONAL_ACCESS_TOKEN</code> and <code className="bg-surface-container px-1 py-0.5 rounded text-white font-mono">GMAIL_CREDENTIALS_JSON</code> in your backend <code className="bg-surface-container px-1 py-0.5 rounded text-white font-mono">.env</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Provider Cards */}
        <div className="grid grid-cols-1 gap-5">
          {providers.map((p) => {
            const Icon = p.icon;
            const isConnected = p.status === 'connected';

            return (
              <div
                key={p.id}
                className="bg-surface-container-low rounded-2xl hairline-border-strong p-6 shadow-xl space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container border border-outline-variant/40 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="font-headline text-sm font-semibold text-on-surface">{p.name}</h4>
                        {getStatusBadge(p.status)}
                        <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono border border-outline-variant/30">
                          {p.mode}
                        </span>
                        {p.isComingSoon && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono">
                            Coming soon
                          </span>
                        )}
                      </div>
                      <p className="font-body text-xs text-on-surface-variant mt-1.5 max-w-xl leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!p.isComingSoon && (
                      <button
                        onClick={() => onToggleConnection(p.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-body transition-colors cursor-pointer ${
                          isConnected
                            ? 'bg-surface-container hover:bg-primary-container/20 text-primary border border-outline-variant/30'
                            : 'bg-primary text-on-primary hover:bg-primary-fixed shadow-md font-semibold'
                        }`}
                      >
                        {isConnected ? 'Disconnect' : 'Connect'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-on-surface-variant font-mono">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    <span>Scope: <strong className="text-on-surface font-normal">{p.scope}</strong></span>
                  </div>
                  <div>
                    Last checked: <span className="text-on-surface font-medium">{p.lastChecked}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security / Privacy Box */}
        <div className="p-5 rounded-2xl bg-surface-container-low hairline-border-strong text-xs font-body">
          <div className="font-headline font-semibold text-primary flex items-center gap-1.5 mb-1">
            <Shield className="w-4 h-4 text-primary" />
            <span>Strict Read-Only Trust Boundary</span>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            PulseDesk never requests write, delete, or modify scopes. In compliance with ADR-001,
            credentials are handled server-side and never exposed to the client interface or logs.
            External message texts are treated strictly as untrusted source evidence.
          </p>
        </div>
      </div>
    </div>
  );
};
export default ConnectionsView;
