import React, { useState } from 'react';
import { EvidenceItem } from '../types';
import {
  FileText,
  Radar,
  ArrowRight,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  GitPullRequest,
} from 'lucide-react';

interface DashboardViewProps {
  issue42State: string;
  onOpenAuditLog: () => void;
  onSelectEntityNode: (entityId: string) => void;
  onDeployIntelligence: () => void;
  onInspectEvidence: (evidenceId: string) => void;
  onOpenExportBriefing?: () => void;
  onNavigateToRadar?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  issue42State,
  onOpenAuditLog,
  onSelectEntityNode,
  onDeployIntelligence,
  onInspectEvidence,
  onOpenExportBriefing,
  onNavigateToRadar,
}) => {
  const isOpenBlocker = issue42State === 'open';

  // Selected topology node state
  const [selectedNodeId, setSelectedNodeId] = useState<string>('payment');

  const nodesInfo: Record<string, { entity: string; response: string; dependents: string; depsList: string; action: string; actionSub: string }> = {
    core: {
      entity: 'Project Alpha Core',
      response: 'v2.4.0-rc3 · Nominal Heartbeat',
      dependents: 'All Downstream Services',
      depsList: 'Auth, Payment, Workers, Webhooks',
      action: 'Run Integration Matrix',
      actionSub: 'Trigger full CI verification suite',
    },
    auth: {
      entity: 'Auth / Identity Service',
      response: '200 OK · Zero Breaches',
      dependents: '12 External Clients',
      depsList: 'JWT Gateway, SSO Handshake',
      action: 'Maintain Stable Token Rotation',
      actionSub: 'Certificate valid for 48 days',
    },
    payment: {
      entity: isOpenBlocker ? 'Stripe Webhook Gateway' : 'Stripe Webhook Gateway (Patched)',
      response: isOpenBlocker ? 'Response: 401 Unauthorized' : 'Response: 200 OK Verified',
      dependents: '3 Microservices Affected',
      depsList: 'Checkout, Billing, Invoicing',
      action: isOpenBlocker ? 'Rotate Staging Secret' : 'Deploy Verified Release Candidate',
      actionSub: isOpenBlocker ? 'PulseDesk ready to patch HMAC payload' : 'Staging pipeline confirmed green',
    },
    pr342: {
      entity: 'PR #342 Diff (webhook.rb)',
      response: '+142 / -38 lines changed',
      dependents: 'Staging Integration Suite',
      depsList: 'webhook_spec.rb, intent_v2.rb',
      action: isOpenBlocker ? 'Review Pending Review Comments' : 'Approved and Merged',
      actionSub: 'Authored by @alex-lead',
    },
    release: {
      entity: isOpenBlocker ? 'Release Gating: HALT Alpha-4' : 'Release Gating: APPROVED',
      response: isOpenBlocker ? 'Stage deployment deferred' : 'Greenlight for Staging Demo',
      dependents: 'Pilot Cohort Delta Onboarding',
      depsList: 'Production Sandbox, Demo Cluster',
      action: isOpenBlocker ? 'Resolve Issue #42 Blocker' : 'Trigger Staging Deploy',
      actionSub: isOpenBlocker ? 'Approval on hold until tests pass' : 'Signed off by VP Finance',
    },
  };

  const selectedInfo = nodesInfo[selectedNodeId] || nodesInfo.payment;

  return (
    <div className="flex-1 flex flex-col gap-6 pb-52 pt-2">
      {/* TOP SECTION: Editorial Headline & Telemetry Row */}
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-2 border-b border-outline-variant/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/30 mb-3 shadow-xs">
            <span className={`w-2 h-2 rounded-full ${isOpenBlocker ? 'bg-error animate-pulse' : 'bg-primary'}`} />
            <span className="font-body text-[11px] tracking-wide text-on-surface font-medium">
              Live Workspace Status
            </span>
            <span className="text-outline-variant text-xs">·</span>
            <span className="font-mono text-[11px] text-on-surface-variant">
              {isOpenBlocker ? '1 Active Blocker · Issue #42' : 'All Checks Passing · Staging Ready'}
            </span>
          </div>

          <h1 className="font-display text-4xl lg:text-5xl text-on-surface font-semibold tracking-tight text-white leading-tight">
            Your workspace, in focus.
          </h1>

          <p className="font-body text-base lg:text-lg text-on-surface-variant/90 mt-1 max-w-2xl font-light">
            {isOpenBlocker ? (
              <>
                <span className="text-error font-semibold">1 blocker</span> ·{' '}
                <span className="text-secondary font-medium">1 pending sign-off</span> · Here's what needs attention today.
              </>
            ) : (
              <>
                <span className="text-primary font-semibold">0 blockers</span> ·{' '}
                <span className="text-secondary font-medium">1 staging sign-off ready</span> · All release pipelines clear.
              </>
            )}
          </p>
        </div>

        {/* Real Workspace Intelligence KPI Strip & Export Briefing CTA */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3">
          {onOpenExportBriefing && (
            <button
              onClick={onOpenExportBriefing}
              className="px-3.5 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 flex items-center justify-center gap-2 text-xs font-mono text-on-surface hover:text-primary transition-all shadow-sm cursor-pointer shrink-0"
              title="Export formatted Executive Briefing report"
            >
              <FileText className="w-4 h-4 text-primary" />
              <span>Export Briefing</span>
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Metric 1: Open Issues */}
            <div className="px-4 py-2.5 rounded-xl bg-surface-container-lowest hairline-border flex items-center gap-3 shadow-md">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isOpenBlocker ? 'bg-error-container/20 text-error' : 'bg-primary/20 text-primary'
              }`}>
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="font-body text-[11px] text-on-surface-variant font-medium uppercase tracking-wider">
                  Open Issues
                </div>
                <div className={`font-headline text-base font-semibold leading-tight ${
                  isOpenBlocker ? 'text-error' : 'text-primary'
                }`}>
                  {isOpenBlocker ? '1 Blocker · 1 Open' : '0 Blockers · 1 Open'}
                </div>
                <div className="text-[10px] font-mono text-outline-variant">Issue #42 & #47</div>
              </div>
            </div>

            {/* Metric 2: Pending Sign-offs */}
            <div className="px-4 py-2.5 rounded-xl bg-surface-container-lowest hairline-border flex items-center gap-3 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-body text-[11px] text-on-surface-variant font-medium uppercase tracking-wider">
                  Pending Sign-offs
                </div>
                <div className="font-headline text-base font-semibold text-secondary leading-tight">
                  {isOpenBlocker ? '1 Staging Approval' : 'Ready for Demo'}
                </div>
                <div className="text-[10px] font-mono text-outline-variant">Elena Rostova · VP Finance</div>
              </div>
            </div>

            {/* Metric 3: Sources Synced */}
            <div className="px-4 py-2.5 rounded-xl bg-surface-container-lowest hairline-border flex items-center gap-3 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-body text-[11px] text-on-surface-variant font-medium uppercase tracking-wider">
                  Last Verified
                </div>
                <div className="font-mono text-sm font-semibold text-on-surface leading-tight">14m ago</div>
                <div className="text-[10px] font-mono text-outline-variant">GitHub MCP · Gmail OAuth</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE FEATURE BANNER: Change Radar Quick Teaser */}
      {onNavigateToRadar && (
        <div
          onClick={onNavigateToRadar}
          className="p-3.5 px-4 rounded-xl bg-surface-container-low hairline-border hover:border-primary/40 transition-all flex items-center justify-between group cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
              <Radar className="w-4 h-4" />
            </div>
            <div className="text-xs font-mono text-on-surface-variant flex items-center gap-2 flex-wrap">
              <span className="text-primary font-semibold uppercase tracking-wider text-[10px]">Change Radar</span>
              <span className="text-outline-variant">·</span>
              <span className="text-on-surface">
                {isOpenBlocker
                  ? 'Issue #42 reopened from closed state · Staging approval pending'
                  : 'Issue #42 verified closed · Staging sign-off ready'}
              </span>
            </div>
          </div>
          <div className="text-xs font-mono text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>View Full Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* CRITICAL BLOCKER BANNER: Atmospheric Black Feather & Socialist Dark Red */}
      <section className={`relative overflow-hidden rounded-2xl p-6 shadow-xl shadow-black/40 ${
        isOpenBlocker
          ? 'bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-error-container/20 border border-error-container/60'
          : 'bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-secondary-container/25 hairline-border-strong'
      }`}>
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary/10 filter blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4 max-w-4xl">
            <div className="relative shrink-0 mt-1">
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  isOpenBlocker
                    ? 'bg-error-container/20 border-error-container text-error'
                    : 'bg-primary/20 border-primary text-primary'
                }`}
              >
                <span
                  className="material-symbols-outlined text-xl"
                  data-icon={isOpenBlocker ? 'error' : 'check_circle'}
                >
                  {isOpenBlocker ? 'error' : 'check_circle'}
                </span>
              </div>
              {isOpenBlocker && (
                <div className="absolute -inset-1 rounded-xl bg-error-container/25 pulse-ring pointer-events-none" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-semibold font-mono ${
                    isOpenBlocker
                      ? 'bg-error-container text-on-error font-bold'
                      : 'bg-primary/20 text-primary border border-primary/40'
                  }`}
                >
                  {isOpenBlocker ? 'High-Severity Blocker' : 'Blocker Cleared'}
                </span>
                <span className="text-[11px] text-secondary font-mono">ALPHA-RELEASE-CRITICAL</span>
                <span className="text-outline-variant text-xs">·</span>
                <span className="text-[11px] text-on-surface-variant font-mono">Staging Cluster #4</span>
              </div>

              <h2 className="font-headline text-lg sm:text-xl font-semibold text-white tracking-tight leading-snug">
                {isOpenBlocker
                  ? 'Payment integration is blocking the next release — Stripe webhook HMAC signature mismatch in staging awaits review.'
                  : 'Payment integration blocker resolved — Issue #42 verified closed in live repository. Integration test suite passing.'}
              </h2>

              <p className="font-body text-sm text-on-surface leading-relaxed">
                {isOpenBlocker ? (
                  <>
                    Detected 28 failed invocations during{' '}
                    <code className="font-mono text-secondary bg-surface-container-high px-2 py-0.5 rounded text-xs font-semibold border border-outline-variant/30">
                      test_checkout_intent_v2
                    </code>
                    . Root cause isolated to payload serialization drift in commit{' '}
                    <span className="font-mono text-primary bg-surface-container-high px-2 py-0.5 rounded text-xs font-semibold border border-primary/30">
                      9f2e81a
                    </span>
                    .
                  </>
                ) : (
                  <>
                    All 28 assertions passed in{' '}
                    <code className="font-mono text-primary bg-surface-container-high px-2 py-0.5 rounded text-xs font-semibold border border-primary/30">
                      test_checkout_intent_v2
                    </code>
                    . Verified against live GitHub API status. Ready for staging demo sign-off.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Banner CTAs */}
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
            <button
              onClick={onOpenAuditLog}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-high/60 hover:bg-surface-container-highest border border-outline-variant/30 text-on-surface font-body text-xs transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-sm" data-icon="description">
                description
              </span>
              <span>Audit Log</span>
            </button>

            <button
              onClick={() => onInspectEvidence('fixture:github:42')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-on-surface text-surface font-body text-xs font-semibold shadow-lg hover:bg-white transition-all transform active:scale-95 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base text-surface" data-icon="rate_review">
                rate_review
              </span>
              <span>Review PR #342</span>
            </button>
          </div>
        </div>
      </section>

      {/* CENTER PIECE BENTO GRID: Living Dependency Map (Left 7 Cols) + Right Activity Stream (5 Cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT: Interactive Entity Topology / Living Map (7 Cols) */}
        <section className="xl:col-span-7 rounded-2xl bg-surface-container-lowest hairline-border p-6 shadow-xl flex flex-col gap-5">
          {/* Header & Topology Controls */}
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-lg" data-icon="hub">
                  hub
                </span>
              </div>
              <div>
                <h3 className="font-headline text-base font-semibold text-on-surface">Living Dependency Topology</h3>
                <p className="font-body text-xs text-on-surface-variant">
                  Real-time architectural node traversal & release blast radius
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container text-[11px] font-mono text-on-surface-variant border border-outline-variant/30">
                <span className="material-symbols-outlined text-xs text-tertiary" data-icon="sync">
                  sync
                </span>
                <span>LIVE 30FPS</span>
              </div>
              <button
                onClick={() => setSelectedNodeId('payment')}
                className="w-7 h-7 rounded-md bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
                title="Fit to Screen"
                type="button"
              >
                <span className="material-symbols-outlined text-sm" data-icon="fit_screen">
                  fit_screen
                </span>
              </button>
            </div>
          </div>

          {/* Map Canvas with Gridlines & Coordinates (Black Feather Deep Base #061517) */}
          <div className="relative w-full h-[460px] rounded-xl bg-[#061517] topology-grid hairline-border overflow-hidden select-none group">
            {/* Coordinate Markers */}
            <div className="absolute top-2 left-3 font-mono text-[10px] text-outline-variant tracking-wider">
              LAT 47.61 · LNG -122.33 · EPSG:4326
            </div>
            <div className="absolute bottom-2 left-3 font-mono text-[10px] text-outline-variant tracking-wider">
              GRID_RESOLUTION_28PX · GRAPH_DEGREE_4
            </div>

            {/* Connecting Dependency SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="coralGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF8A8A" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#941D1D" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="greenGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#336269" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#93D4D8" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              {/* Line 1: Alpha Core to Payment Integration */}
              <path
                d="M 175 140 C 240 140, 240 230, 310 230"
                fill="none"
                stroke={isOpenBlocker ? 'url(#coralGrad)' : 'url(#greenGrad)'}
                strokeDasharray={isOpenBlocker ? '4 2' : 'none'}
                strokeWidth="2"
              />
              {/* Line 2: Alpha Core to Auth Service */}
              <path d="M 175 140 C 230 140, 230 75, 310 75" fill="none" stroke="url(#greenGrad)" strokeWidth="1.75" />
              {/* Line 3: Payment Integration to PR #342 Diff */}
              <path
                d="M 450 230 C 500 230, 500 230, 530 230"
                fill="none"
                stroke={isOpenBlocker ? '#941D1D' : '#93D4D8'}
                strokeWidth="2.5"
              />
              {/* Line 4: PR #342 Diff to Release Blocker */}
              <path
                d="M 640 230 C 670 230, 670 330, 550 350"
                fill="none"
                stroke={isOpenBlocker ? '#941D1D' : '#93D4D8'}
                strokeDasharray={isOpenBlocker ? '6 3' : 'none'}
                strokeWidth="2"
              />
            </svg>

            {/* Node 1: Project Alpha Core (Root) */}
            <div
              onClick={() => setSelectedNodeId('core')}
              className={`absolute left-6 top-24 w-44 rounded-xl bg-surface-container-low hairline-border-strong p-3.5 shadow-2xl backdrop-blur-xs cursor-pointer transition-all ${
                selectedNodeId === 'core' ? 'ring-2 ring-primary border-primary' : 'hover:border-primary'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-1.5 py-0.5 rounded bg-surface-container text-[10px] font-mono text-tertiary">
                  ROOT CORE
                </span>
                <span className="w-2 h-2 rounded-full bg-tertiary" />
              </div>
              <div className="font-headline text-xs font-semibold text-on-surface">Project Alpha Core</div>
              <div className="font-mono text-[10px] text-on-surface-variant mt-0.5">v2.4.0-rc3 · Node 0x1A</div>
            </div>

            {/* Node 2: Auth / Identity Service (Stable) */}
            <div
              onClick={() => setSelectedNodeId('auth')}
              className={`absolute left-72 top-8 w-48 rounded-xl bg-surface-container-low hairline-border p-3 shadow-lg cursor-pointer transition-all ${
                selectedNodeId === 'auth' ? 'ring-2 ring-tertiary border-tertiary' : 'hover:border-tertiary'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-1.5 py-0.2 rounded bg-tertiary-container/30 text-tertiary text-[10px] font-mono font-semibold">
                  STABLE
                </span>
                <span className="material-symbols-outlined text-xs text-tertiary" data-icon="lock">
                  lock
                </span>
              </div>
              <div className="font-headline text-xs font-semibold text-on-surface">Auth / Identity Service</div>
              <div className="font-mono text-[10px] text-tertiary">0 alerts · JWT HMAC valid</div>
            </div>

            {/* Node 3: Payment Integration (Interrupted / Blocker) */}
            <div
              onClick={() => setSelectedNodeId('payment')}
              className={`absolute left-72 top-44 w-52 rounded-xl bg-surface-container-highest border-2 p-3.5 shadow-2xl cursor-pointer transition-all ${
                selectedNodeId === 'payment' ? 'ring-2 ring-primary' : ''
              } ${
                isOpenBlocker
                  ? 'border-error-container shadow-error-container/25'
                  : 'border-primary shadow-primary/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider ${
                    isOpenBlocker
                      ? 'bg-error-container text-on-error'
                      : 'bg-primary/20 text-primary border border-primary/40'
                  }`}
                >
                  {isOpenBlocker ? 'BLOCKING' : 'RESOLVED'}
                </span>
                <span
                  className={`material-symbols-outlined text-sm ${
                    isOpenBlocker ? 'text-error animate-pulse' : 'text-primary'
                  }`}
                  data-icon={isOpenBlocker ? 'sync_problem' : 'check_circle'}
                >
                  {isOpenBlocker ? 'sync_problem' : 'check_circle'}
                </span>
              </div>
              <div className="font-headline text-xs font-semibold text-white">Payment Integration</div>
              <div
                className={`font-mono text-[10px] mt-0.5 ${isOpenBlocker ? 'text-error' : 'text-primary'}`}
              >
                {isOpenBlocker ? 'Stripe Webhook SIG ERR' : 'HMAC Verified 200 OK'}
              </div>
            </div>

            {/* Node 4: PR #342 Diff */}
            <div
              onClick={() => setSelectedNodeId('pr342')}
              className={`absolute right-8 top-44 w-44 rounded-xl bg-surface-container-high hairline-border-strong p-3 shadow-xl cursor-pointer transition-all ${
                selectedNodeId === 'pr342' ? 'ring-2 ring-secondary border-secondary' : 'hover:border-secondary'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-1.5 py-0.5 rounded bg-secondary-container text-secondary text-[10px] font-mono">
                  PULL REQUEST
                </span>
                <span className="material-symbols-outlined text-sm text-secondary" data-icon="commit">
                  commit
                </span>
              </div>
              <div className="font-headline text-xs font-semibold text-on-surface">PR #342 Diff</div>
              <div className="font-mono text-[10px] text-on-surface-variant">+142 / -38 lines (webhook.rb)</div>
            </div>

            {/* Node 5: Release Blocker (HALT Alpha-4) */}
            <div
              onClick={() => setSelectedNodeId('release')}
              className={`absolute right-24 bottom-10 w-56 rounded-xl bg-surface-container-lowest border p-3.5 shadow-2xl cursor-pointer transition-all ${
                isOpenBlocker ? 'border-error-container' : 'border-primary'
              } ${selectedNodeId === 'release' ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-mono ${
                    isOpenBlocker
                      ? 'bg-error-container text-on-error'
                      : 'bg-primary/20 text-primary border border-primary/40'
                  }`}
                >
                  {isOpenBlocker ? 'HALT Alpha-4' : 'APPROVED'}
                </span>
                <span
                  className={`material-symbols-outlined text-sm ${isOpenBlocker ? 'text-error' : 'text-primary'}`}
                  data-icon={isOpenBlocker ? 'cancel' : 'check'}
                >
                  {isOpenBlocker ? 'cancel' : 'check'}
                </span>
              </div>
              <div className="font-headline text-xs font-semibold text-primary">
                {isOpenBlocker ? 'Release Gating Triggered' : 'Release Gating Cleared'}
              </div>
              <div className="font-mono text-[10px] text-on-surface-variant">
                {isOpenBlocker ? 'Stage deployment deferred' : 'Greenlit for demo rollout'}
              </div>
            </div>

            {/* Topology Map Overlay Legend */}
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md hairline-border flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary" />
                <span className="text-on-surface-variant text-[11px] font-body">Nominal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary-container" />
                <span className="text-on-surface-variant text-[11px] font-body">Blocker</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed" />
                <span className="text-on-surface-variant text-[11px] font-body">Pending PR</span>
              </div>
            </div>
          </div>

          {/* Node Inspection Subpanel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-surface-container-low hairline-border">
              <div className="text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider font-mono">
                Selected Entity
              </div>
              <div className="font-headline text-xs font-semibold text-on-surface mt-0.5 truncate">
                {selectedInfo.entity}
              </div>
              <div className="text-[11px] text-tertiary font-mono truncate">{selectedInfo.response}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low hairline-border">
              <div className="text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider font-mono">
                Direct Dependents
              </div>
              <div className="font-headline text-xs font-semibold text-on-surface mt-0.5 truncate">
                {selectedInfo.dependents}
              </div>
              <div className="text-[11px] text-primary font-mono truncate">{selectedInfo.depsList}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low hairline-border">
              <div className="text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider font-mono">
                Recommended Action
              </div>
              <div className="font-headline text-xs font-semibold text-on-surface mt-0.5 truncate">
                {selectedInfo.action}
              </div>
              <div className="text-[11px] text-secondary font-mono truncate">{selectedInfo.actionSub}</div>
            </div>
          </div>
        </section>

        {/* RIGHT: Chronological Curated Activity Stream (5 Cols) */}
        <section className="xl:col-span-5 rounded-2xl bg-surface-container-lowest hairline-border p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-lg" data-icon="dynamic_feed">
                  dynamic_feed
                </span>
              </div>
              <div>
                <h3 className="font-headline text-base font-semibold text-on-surface">Intelligence Stream</h3>
                <p className="font-body text-xs text-on-surface-variant">
                  Live telemetry across GitHub MCP, Gmail OAuth &amp; PostgreSQL Memory
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-[11px] font-mono text-primary font-medium">
              4 Unresolved
            </span>
          </div>

          {/* Activity Feed List with Hairline Dividers */}
          <div className="flex flex-col gap-3.5 custom-scroll overflow-y-auto max-h-[570px] pr-1">
            {/* Event 1: GitHub CI Failure */}
            <div
              onClick={() => onInspectEvidence('fixture:github:42')}
              className="p-4 rounded-xl bg-surface-container-low/90 hairline-border hover:bg-surface-container hover:border-outline-variant/40 transition-all group cursor-pointer shadow-xs"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-primary-container/20 border border-primary-container text-primary text-[10px] font-semibold font-mono">
                    GitHub CI Failure
                  </span>
                  <span className="font-mono text-xs text-on-surface-variant font-medium">22m ago</span>
                </div>
                <span className="material-symbols-outlined text-sm text-primary" data-icon="emergency">
                  emergency
                </span>
              </div>
              <div className="font-headline text-sm font-semibold text-white">
                auth/webhook_spec.rb failed on Line 142
              </div>
              <p className="font-body text-xs sm:text-sm text-on-surface mt-1 leading-relaxed">
                Expected <code className="font-mono text-xs text-secondary bg-surface-container px-1.5 py-0.5 rounded font-semibold">HMAC-SHA256</code> calculated against raw
                request body, but received sanitized JSON hash representation.
              </p>
              <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <span className="font-mono text-on-surface-variant text-xs">Runner #2948-Alpha</span>
                <span className="text-primary hover:text-white transition-colors font-medium flex items-center gap-1">
                  <span>View Trace</span>
                  <span className="material-symbols-outlined text-xs" data-icon="arrow_forward">
                    arrow_forward
                  </span>
                </span>
              </div>
            </div>

            {/* Event 2: Linear Ticket LIN-894 */}
            <div className="p-4 rounded-xl bg-surface-container-low/90 hairline-border hover:bg-surface-container hover:border-outline-variant/40 transition-all group shadow-xs">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-secondary-container text-secondary text-[10px] font-semibold font-mono">
                    Linear Ticket LIN-894
                  </span>
                  <span className="font-mono text-xs text-on-surface-variant font-medium">41m ago</span>
                </div>
                <span className="material-symbols-outlined text-sm text-secondary" data-icon="flag">
                  flag
                </span>
              </div>
              <div className="font-headline text-sm font-semibold text-white">
                Marked as Urgent Blocker by Product Council
              </div>
              <p className="font-body text-xs sm:text-sm text-on-surface mt-1 leading-relaxed">
                "Customer onboarding for Pilot Cohort Delta cannot initiate until recurring subscription events deliver
                200 OK responses."
              </p>
              <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <span className="font-mono text-on-surface-variant text-xs">Assignee: @alex-lead</span>
                <span className="text-secondary hover:text-white transition-colors font-medium flex items-center gap-1">
                  <span>Open in Linear</span>
                  <span className="material-symbols-outlined text-xs" data-icon="open_in_new">
                    open_in_new
                  </span>
                </span>
              </div>
            </div>

            {/* Event 3: Gmail Briefing from VP Finance */}
            <div
              onClick={() => onInspectEvidence('fixture:gmail:approval-1')}
              className="p-4 rounded-xl bg-surface-container-low/90 hairline-border hover:bg-surface-container hover:border-outline-variant/40 transition-all group cursor-pointer shadow-xs"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant/40 text-on-surface-variant text-[10px] font-medium font-mono">
                    Gmail Briefing
                  </span>
                  <span className="font-mono text-xs text-on-surface-variant font-medium">1h ago</span>
                </div>
                <span className="material-symbols-outlined text-sm text-on-surface-variant" data-icon="mail">
                  mail
                </span>
              </div>
              <div className="font-headline text-sm font-semibold text-white">
                Staging migration window confirmed for 18:00 UTC
              </div>
              <p className="font-body text-xs sm:text-sm text-on-surface mt-1 leading-relaxed">
                VP Finance signed off on the sandbox gateway transition. Zero tolerance for unverified signature
                handshakes during the 30-minute switch.
              </p>
              <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <span className="font-mono text-on-surface-variant text-xs">From: elena@treasury.corp</span>
                <span className="text-primary font-mono text-xs font-semibold">Approved</span>
              </div>
            </div>

            {/* Event 4: Pinned Context Memory */}
            <div
              onClick={() => onInspectEvidence('memory:fixture:memory:priority')}
              className="p-4 rounded-xl bg-surface-container-low/90 hairline-border border-outline-variant/30 hover:bg-surface-container hover:border-primary/40 transition-all group cursor-pointer shadow-xs"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-primary/15 text-primary text-[10px] font-semibold font-mono flex items-center gap-1 border border-primary/30">
                    <span className="material-symbols-outlined text-xs" data-icon="bookmark">
                      bookmark
                    </span>
                    <span>Pinned Context Memory</span>
                  </span>
                  <span className="font-mono text-[10px] text-primary font-semibold">PERSISTENT</span>
                </div>
                <span className="material-symbols-outlined text-sm text-primary" data-icon="neurology">
                  neurology
                </span>
              </div>
              <div className="font-headline text-sm font-semibold text-white">
                Rollback flag primed in production config
              </div>
              <p className="font-body text-xs sm:text-sm text-on-surface mt-1 leading-relaxed">
                PulseDesk AI synthesized a hot-patch fallback to Stripe v2022-11-15 legacy headers if PR #342 cannot
                be merged before the maintenance window.
              </p>
              <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <span className="font-mono text-primary text-xs">Feature Flag: `ff_legacy_webhook_fallback`</span>
                <span className="text-primary hover:text-white transition-colors font-medium flex items-center gap-1">
                  <span>View Memory</span>
                  <span className="material-symbols-outlined text-xs" data-icon="chevron_right">
                    chevron_right
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
