import React, { useState } from 'react';
import {
  Radar,
  GitPullRequest,
  AlertTriangle,
  Mail,
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Filter,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';

interface ChangeRadarViewProps {
  issue42State: string;
  onInspectEvidence: (evidenceId: string) => void;
  onSynthesizeInChat: (query: string) => void;
  onToggleDemoState: () => void;
}

export const ChangeRadarView: React.FC<ChangeRadarViewProps> = ({
  issue42State,
  onInspectEvidence,
  onSynthesizeInChat,
  onToggleDemoState,
}) => {
  const isOpenBlocker = issue42State === 'open';
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'blockers' | 'decisions' | 'code'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const radarEvents = [
    {
      id: 'radar-issue-42',
      type: 'blocker',
      category: 'GitHub Issue',
      title: isOpenBlocker ? 'Issue #42 Reopened: Release CI pipeline failing' : 'Issue #42 Resolved & Closed: CI pipeline passing',
      timestamp: 'Today · 08:42 UTC',
      previousState: isOpenBlocker ? 'Closed yesterday at 18:30 UTC' : 'Open (Blocking Staging)',
      currentState: isOpenBlocker ? 'Reopened (CRITICAL BLOCKER)' : 'Closed & Verified',
      severity: isOpenBlocker ? 'critical' : 'resolved',
      sourceType: 'github',
      evidenceId: 'fixture:github:42',
      url: 'https://github.com/pulsedesk/project-alpha/issues/42',
      summary: isOpenBlocker
        ? 'Stripe webhook HMAC signature mismatch in staging test_checkout_intent_v2. Commit 9f2e81a broke payload serialization.'
        : 'Stripe webhook HMAC signature patch verified in staging cluster #4. All 28 tests passing.',
      blastRadius: isOpenBlocker ? 'Checkout, Billing, Staging Cluster #4' : 'Zero affected services',
      actionQuery: isOpenBlocker
        ? 'What is the root cause of Issue #42 and how do we patch the HMAC serialization?'
        : 'Summarize how Issue #42 was resolved and confirm readiness for staging deploy.',
    },
    {
      id: 'radar-gmail-approval',
      type: 'decision',
      category: 'Gmail Sign-off',
      title: 'Staging Demo Launch Sign-off on Hold',
      timestamp: 'Yesterday · 16:15 UTC',
      previousState: 'Awaiting submission',
      currentState: isOpenBlocker ? 'On Hold (Blocked by CI test pass)' : 'Sign-off Approved for Staging',
      severity: isOpenBlocker ? 'warning' : 'stable',
      sourceType: 'gmail',
      evidenceId: 'fixture:gmail:approval-1',
      url: 'https://mail.google.com/mail/u/0/#inbox/approval-1',
      summary:
        'VP Finance confirmed sandbox gateway transition sign-off is conditioned strictly on green integration tests. Zero tolerance for unverified signature handshakes.',
      blastRadius: 'Pilot Cohort Delta customer onboarding',
      actionQuery: 'What are the exact approval requirements from the staging approval email?',
    },
    {
      id: 'radar-pr-342',
      type: 'code',
      category: 'GitHub Pull Request',
      title: 'PR #342: Fix Stripe webhook HMAC signature calculation',
      timestamp: 'Today · 09:15 UTC',
      previousState: 'Draft commit',
      currentState: 'Awaiting Code Review & Staging Diff Verification',
      severity: 'info',
      sourceType: 'github',
      evidenceId: 'fixture:github:pr-342',
      url: 'https://github.com/pulsedesk/project-alpha/pull/342',
      summary: '+142 / -38 lines in webhook.rb and webhook_spec.rb. Raw payload passed directly to OpenSSL::HMAC rather than parsed hash.',
      blastRadius: 'Staging Integration Suite (webhook_spec.rb)',
      actionQuery: 'Explain the code changes in PR #342 and whether it addresses Issue #42.',
    },
    {
      id: 'radar-memory-priority',
      type: 'decision',
      category: 'Recorded Memory',
      title: 'Project Alpha Presentation vs Doc Polish Priority',
      timestamp: '3 days ago · User directive',
      previousState: 'Unspecified',
      currentState: 'Active Durable Priority Context',
      severity: 'stable',
      sourceType: 'memory',
      evidenceId: 'fixture:memory:priority',
      url: null,
      summary: 'Executive instruction: Project Alpha presentation readiness is higher priority than secondary documentation polish this week.',
      blastRadius: 'Sprint Task Allocation',
      actionQuery: 'What durable priorities have been remembered for Project Alpha?',
    },
  ];

  const filteredEvents = radarEvents.filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'blockers') return item.type === 'blocker';
    if (selectedFilter === 'decisions') return item.type === 'decision';
    if (selectedFilter === 'code') return item.type === 'code';
    return true;
  });

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 pb-32">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-outline-variant/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 mb-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">
              Signature Feature · Live Telemetry
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-on-surface font-semibold tracking-tight">
            Change Radar
          </h1>
          <p className="font-body text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl font-light">
            Continuous detection of project changes, status drift, pull request updates, and pending decisions across your connected workspace conduits.
          </p>
        </div>

        {/* Quick Filter Pills & Demo State Toggle */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All Changes ({radarEvents.length})
          </button>
          <button
            onClick={() => setSelectedFilter('blockers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              selectedFilter === 'blockers'
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Blockers
          </button>
          <button
            onClick={() => setSelectedFilter('decisions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              selectedFilter === 'decisions'
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Decisions
          </button>
          <button
            onClick={() => setSelectedFilter('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              selectedFilter === 'code'
                ? 'bg-primary text-on-primary font-semibold shadow-xs'
                : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Code & PRs
          </button>
        </div>
      </div>

      {/* Snapshot Delta Overview Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-surface-container-lowest hairline-border p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isOpenBlocker ? 'bg-error-container/30 text-error' : 'bg-primary/20 text-primary'
            }`}>
              {isOpenBlocker ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">
                Release Blockers
              </div>
              <div className="text-xl font-headline font-semibold text-on-surface">
                {isOpenBlocker ? '1 Active' : '0 Active (Clear)'}
              </div>
            </div>
          </div>
          <button
            onClick={onToggleDemoState}
            className="text-xs font-mono px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant/30 transition-all cursor-pointer"
          >
            Toggle State
          </button>
        </div>

        <div className="rounded-xl bg-surface-container-lowest hairline-border p-4 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">
              Pending Decisions
            </div>
            <div className="text-xl font-headline font-semibold text-on-surface">
              {isOpenBlocker ? '1 Pending' : '1 Sign-off Ready'}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-surface-container-lowest hairline-border p-4 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
            <GitPullRequest className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">
              Active Pull Requests
            </div>
            <div className="text-xl font-headline font-semibold text-on-surface">
              PR #342 (Diff Ready)
            </div>
          </div>
        </div>
      </div>

      {/* Changes Feed Cards */}
      <div className="flex flex-col gap-4">
        {filteredEvents.map((event) => {
          const isCritical = event.severity === 'critical';
          const isResolved = event.severity === 'resolved';

          return (
            <div
              key={event.id}
              className={`rounded-2xl bg-surface-container-lowest p-5 sm:p-6 transition-all shadow-md relative overflow-hidden ${
                isCritical
                  ? 'border border-error-container/60 shadow-error-container/10'
                  : 'hairline-border hover:border-outline-variant/50'
              }`}
            >
              {/* Critical Accent Glow */}
              {isCritical && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-error-container via-error to-error-container" />
              )}

              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Event Details */}
                <div className="flex-1 flex flex-col gap-2.5">
                  <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
                    <span
                      className={`px-2 py-0.5 rounded-md font-semibold uppercase text-[10px] tracking-wider ${
                        isCritical
                          ? 'bg-error-container text-on-error'
                          : isResolved
                          ? 'bg-primary/20 text-primary border border-primary/40'
                          : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/30'
                      }`}
                    >
                      {event.category}
                    </span>

                    <span className="text-on-surface-variant/60 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.timestamp}
                    </span>

                    <span className="text-outline-variant">·</span>

                    <span className="text-on-surface-variant/80">
                      Blast Radius: <strong className="text-on-surface font-medium">{event.blastRadius}</strong>
                    </span>
                  </div>

                  <h3 className="font-headline text-lg sm:text-xl text-on-surface font-semibold">
                    {event.title}
                  </h3>

                  <p className="font-body text-sm text-on-surface-variant/90 leading-relaxed font-light">
                    {event.summary}
                  </p>

                  {/* Previous vs Current State Delta Pill */}
                  <div className="flex items-center flex-wrap gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-on-surface-variant/70">
                      <span className="text-[10px] uppercase tracking-wider text-outline">Earlier:</span>
                      <span className="line-through">{event.previousState}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-outline">Now:</span>
                      <span className={isCritical ? 'text-error font-semibold' : 'text-primary font-medium'}>
                        {event.currentState}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between sm:justify-start gap-2 pt-2 lg:pt-0 shrink-0">
                  <button
                    onClick={() => onSynthesizeInChat(event.actionQuery)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary font-body text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze in Chat</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onInspectEvidence(event.evidenceId)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs font-mono border border-outline-variant/30 transition-all cursor-pointer"
                      title="Inspect citation snippet"
                    >
                      <span>Evidence</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {event.url && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/30 transition-all"
                        title="Open external source"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

