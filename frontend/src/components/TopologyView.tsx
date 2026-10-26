import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface TopologyViewProps {
  issue42State: string;
  onInspectEvidence: (evidenceId: string) => void;
}

export const TopologyView: React.FC<TopologyViewProps> = ({ issue42State, onInspectEvidence }) => {
  const isOpenBlocker = issue42State === 'open';
  const [selectedNodeId, setSelectedNodeId] = useState<string>('payment');

  const nodes = [
    {
      id: 'core',
      name: 'Project Alpha Core',
      sub: 'v2.4.0-rc3 · Node 0x1A',
      tag: 'ROOT CORE',
      status: 'nominal',
      pos: 'left-8 top-28',
      type: 'core',
      description: 'Primary application cluster orchestrating API gateways, worker pools, and task runners.',
      metrics: 'Uptime 99.98% · 42ms p95 latency · 4 nodes',
    },
    {
      id: 'auth',
      name: 'Auth / Identity Service',
      sub: 'JWT HMAC valid · Zero alerts',
      tag: 'STABLE',
      status: 'nominal',
      pos: 'left-80 top-12',
      type: 'service',
      description: 'Zero-trust authorization server issuing session credentials, HMAC verification keys, and OAuth2 tokens.',
      metrics: '3,410 rps · 0 security anomalies detected',
    },
    {
      id: 'payment',
      name: 'Payment Integration',
      sub: isOpenBlocker ? 'Stripe Webhook SIG ERR' : 'HMAC Verified 200 OK',
      tag: isOpenBlocker ? 'BLOCKING' : 'RESOLVED',
      status: isOpenBlocker ? 'blocker' : 'nominal',
      pos: 'left-80 top-56',
      type: 'service',
      description: 'Stripe webhook receiver and checkout settlement pipeline. Currently experiencing serialization signature drift in staging cluster.',
      metrics: isOpenBlocker ? '28 failed invocations · Error 401 Unauthorized' : '28/28 verified passing',
    },
    {
      id: 'pr342',
      name: 'PR #342 Diff',
      sub: '+142 / -38 lines (webhook.rb)',
      tag: 'PULL REQUEST',
      status: 'pending',
      pos: 'right-20 top-56',
      type: 'diff',
      description: 'Engineering patch normalizing raw payload bytes before HMAC-SHA256 calculation.',
      metrics: 'Commit 9f2e81a · Branch fix/stripe-hmac-staging',
    },
    {
      id: 'release',
      name: 'Release Gating Alpha-4',
      sub: isOpenBlocker ? 'Stage deployment deferred' : 'Stage deployment cleared',
      tag: isOpenBlocker ? 'HALT Alpha-4' : 'APPROVED',
      status: isOpenBlocker ? 'blocker' : 'nominal',
      pos: 'right-36 bottom-16',
      type: 'gate',
      description: 'Automated release gate requiring all integration test suites and stakeholder sign-offs to pass before staging rollout.',
      metrics: isOpenBlocker ? '1 blocking dependency remaining' : 'All gating criteria satisfied',
    },
  ];

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[2];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto pb-32">
      {/* Header */}
      <div className="px-8 py-5 border-b border-outline-variant/20 bg-surface-container-lowest/60 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-on-surface">Living Dependency Topology</h2>
          <p className="font-body text-xs text-on-surface-variant mt-0.5">
            Full-scale architectural graph traversal, component blast radius and release dependencies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface-container text-xs font-mono text-tertiary hairline-border">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span>TOPOLOGY ACTIVE 30FPS</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto p-8 space-y-6">
        {/* Interactive Full Graph Canvas */}
        <div className="relative w-full h-[520px] rounded-2xl bg-[#140608] topology-grid hairline-border-strong overflow-hidden select-none shadow-2xl">
          {/* Coordinates */}
          <div className="absolute top-3 left-4 font-mono text-[10px] text-outline-variant tracking-wider">
            GRID_LAT 47.61 · LNG -122.33 · EPSG:4326 · BLAST_RADIUS_LEVEL_3
          </div>
          <div className="absolute bottom-3 left-4 font-mono text-[10px] text-outline-variant tracking-wider">
            NODES: 5 · ACTIVE_PATHS: 4 · RESOLUTION: 28PX
          </div>

          {/* SVG Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="fullCoralGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#ffb4a8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#c63e4e" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="fullGreenGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#475B35" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#b7ce9f" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <path
              d="M 180 150 C 250 150, 250 270, 320 270"
              fill="none"
              stroke={isOpenBlocker ? 'url(#fullCoralGrad)' : 'url(#fullGreenGrad)'}
              strokeDasharray={isOpenBlocker ? '4 2' : 'none'}
              strokeWidth="2.5"
            />
            <path d="M 180 150 C 250 150, 250 85, 320 85" fill="none" stroke="url(#fullGreenGrad)" strokeWidth="2" />
            <path
              d="M 520 270 C 600 270, 600 270, 720 270"
              fill="none"
              stroke={isOpenBlocker ? '#c63e4e' : '#b7ce9f'}
              strokeWidth="2.5"
            />
            <path
              d="M 820 300 C 860 300, 860 410, 740 430"
              fill="none"
              stroke={isOpenBlocker ? '#c63e4e' : '#b7ce9f'}
              strokeDasharray={isOpenBlocker ? '6 3' : 'none'}
              strokeWidth="2"
            />
          </svg>

          {/* Render Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isBlocker = node.status === 'blocker';

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`absolute ${node.pos} w-52 rounded-xl p-3.5 shadow-2xl backdrop-blur-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-primary-container bg-surface-container-high border border-primary-container'
                    : 'bg-surface-container-low hairline-border hover:border-primary-container/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider ${
                      isBlocker
                        ? 'bg-primary-container text-on-primary-container'
                        : node.tag === 'PULL REQUEST'
                        ? 'bg-secondary-container text-secondary'
                        : 'bg-tertiary-container/30 text-tertiary'
                    }`}
                  >
                    {node.tag}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isBlocker
                        ? 'bg-primary-container animate-pulse'
                        : node.tag === 'PULL REQUEST'
                        ? 'bg-secondary-fixed'
                        : 'bg-tertiary'
                    }`}
                  />
                </div>
                <div className="font-headline text-xs font-semibold text-on-surface">{node.name}</div>
                <div className="font-mono text-[10px] text-on-surface-variant mt-0.5 truncate">{node.sub}</div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 px-3.5 py-2 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md hairline-border flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary" />
              <span className="text-on-surface-variant text-[11px]">Nominal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-container" />
              <span className="text-on-surface-variant text-[11px]">Blocker</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed" />
              <span className="text-on-surface-variant text-[11px]">PR</span>
            </div>
          </div>
        </div>

        {/* Detailed Node Inspector Panel */}
        <div className="bg-surface-container-low rounded-2xl hairline-border-strong p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-base" data-icon="hub">
                  hub
                </span>
              </div>
              <div>
                <h3 className="font-headline text-sm font-semibold text-on-surface">{activeNode.name}</h3>
                <span className="text-[11px] font-mono text-tertiary">{activeNode.sub}</span>
              </div>
            </div>

            <button
              onClick={() => onInspectEvidence('fixture:github:42')}
              className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-medium text-primary transition-colors flex items-center gap-1.5 font-body"
            >
              <span>Inspect Source Evidence</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <p className="font-body text-xs text-on-surface leading-relaxed">{activeNode.description}</p>

          <div className="p-3 rounded-xl bg-surface-container hairline-border font-mono text-[11px] text-on-surface-variant flex items-center justify-between">
            <span>Diagnostics Telemetry:</span>
            <span className="text-primary font-semibold">{activeNode.metrics}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
