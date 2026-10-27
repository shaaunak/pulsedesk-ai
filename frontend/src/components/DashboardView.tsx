import React from 'react';
import {
  AlertTriangle,
  FileText,
  GitBranch,
  Target,
  ArrowRight,
  GitPullRequest,
  Mail,
  Layers,
  Plus,
  MessageSquare,
  CheckCircle2,
  Play,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Paperclip,
  Globe,
  Folder,
  Send,
  ExternalLink,
} from 'lucide-react';

interface DashboardViewProps {
  issue42State: string;
  onOpenAuditLog: () => void;
  onSelectEntityNode: (entityId: string) => void;
  onDeployIntelligence: () => void;
  onInspectEvidence: (evidenceId: string) => void;
  onOpenExportBriefing?: () => void;
  onNavigateToTab?: (tab: string) => void;
  onRunPrompt?: (prompt: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  issue42State,
  onOpenAuditLog,
  onInspectEvidence,
  onOpenExportBriefing,
  onNavigateToTab,
  onRunPrompt,
}) => {
  const isOpenBlocker = issue42State === 'open';

  const handleActionClick = (prompt: string) => {
    if (onRunPrompt) {
      onRunPrompt(prompt);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 pb-28 pt-1 max-w-7xl mx-auto w-full">
      {/* 1. HERO BANNER: Atmospheric Landscape Graphic + Project Status */}
      <section className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-card p-6 sm:p-8">
        {/* Subtle Mountain Landscape Silhouette on right */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-20 sm:opacity-40 overflow-hidden select-none">
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 600 240"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 120 240 L 260 90 L 380 180 L 480 60 L 600 240 Z"
              fill="url(#mountainGrad1)"
            />
            <path
              d="M 0 240 L 160 130 L 290 210 L 420 110 L 600 240 Z"
              fill="url(#mountainGrad2)"
              opacity="0.6"
            />
            <defs>
              <linearGradient id="mountainGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="mountainGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#EFF6FF" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between gap-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-slate-500">Good evening, Shaunak</span>
              <h1 className="font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight mt-1">
                Your project, in context.
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-xl font-normal">
                Here's what matters today, pulled from your connected sources.
              </p>
            </div>

            {/* Right Quote Pill */}
            <div className="self-start lg:self-center bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 max-w-xs shadow-2xs">
              <p className="text-xs text-slate-600 italic">
                “Clear context leads to better decisions.”
              </p>
            </div>
          </div>

          {/* Integrated Source Status Strip */}
          <div className="flex items-center flex-wrap gap-2.5 pt-2 border-t border-slate-100">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
              <GitPullRequest className="w-3.5 h-3.5 text-slate-600" />
              <span>GitHub</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-400 font-normal">Connected</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
              <Mail className="w-3.5 h-3.5 text-slate-600" />
              <span>Gmail</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-400 font-normal">Connected</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span>Linear</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-400 font-normal">Connected</span>
            </div>

            <button
              onClick={() => onNavigateToTab?.('sources')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add source</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. FOUR METRIC STATUS CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Blocking Issues */}
        <div
          onClick={() => onInspectEvidence('fixture:github:42')}
          className="p-5 rounded-2xl bg-red-50/50 border border-red-100 hover:border-red-200 transition-all cursor-pointer group shadow-card"
        >
          <div className="flex items-center gap-2.5 text-red-600 mb-3">
            <div className="w-7 h-7 rounded-lg bg-red-100/70 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-red-700">
              Blocking Issues
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900">
              {isOpenBlocker ? '2' : '0'}
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-red-600 group-hover:translate-x-0.5 transition-transform">
              <span>{isOpenBlocker ? 'need attention' : 'all clear'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Card 2: Pending Decisions */}
        <div
          onClick={() => onInspectEvidence('fixture:gmail:approval-1')}
          className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 hover:border-blue-200 transition-all cursor-pointer group shadow-card"
        >
          <div className="flex items-center gap-2.5 text-blue-600 mb-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100/70 flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Pending Decisions
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900">1</div>
            <div className="flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:translate-x-0.5 transition-transform">
              <span>needs your input</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Card 3: Recent Changes */}
        <div
          onClick={() => onNavigateToTab?.('changes')}
          className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-200 transition-all cursor-pointer group shadow-card"
        >
          <div className="flex items-center gap-2.5 text-emerald-600 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100/70 flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Recent Changes
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900">12</div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 group-hover:translate-x-0.5 transition-transform">
              <span>since yesterday</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Card 4: Your Focus */}
        <div
          onClick={() => handleActionClick('Find root cause for Issue #42 and draft a staging fix')}
          className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 hover:border-purple-200 transition-all cursor-pointer group shadow-card"
        >
          <div className="flex items-center gap-2.5 text-purple-600 mb-3">
            <div className="w-7 h-7 rounded-lg bg-purple-100/70 flex items-center justify-center">
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">
              Your Focus
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-xs font-semibold text-slate-900 truncate max-w-[140px]">
              Review Stripe fix
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-purple-600 group-hover:translate-x-0.5 transition-transform">
              <span>integration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT GRID (8 Cols Left / 4 Cols Right) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Top Blockers & Recent Activity (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card A: Top Blockers */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Top Blockers
                </span>
              </div>
              <button
                onClick={onOpenAuditLog}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Blocker Item 1 */}
            <div
              onClick={() => onInspectEvidence('fixture:github:42')}
              className="p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200/80 cursor-pointer mb-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 font-mono">#342</span>
                      <h3 className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                        Payment integration is blocking the next release
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Stripe webhook HMAC signature mismatch in staging.
                    </p>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200/60 text-[10px] font-medium font-mono">
                        bug
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 border border-orange-200/60 text-[10px] font-medium font-mono">
                        high priority
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium font-mono">
                        staging
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium font-mono">
                        stripe
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs text-slate-400">
                  <span className="font-mono text-[11px]">22m ago</span>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium">8</span>
                  </div>
                  {/* Avatar stack */}
                  <div className="flex -space-x-1.5">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white">
                      A
                    </div>
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white">
                      E
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Blocker Item 2 */}
            <div
              onClick={() => onInspectEvidence('fixture:github:42')}
              className="p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200/80 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 font-mono">#318</span>
                      <h3 className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                        Onboarding flow failing for some users
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Intermittent 200 OK but empty response from Linear API.
                    </p>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200/60 text-[10px] font-medium font-mono">
                        bug
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium font-mono">
                        medium
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium font-mono">
                        production
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium font-mono">
                        linear
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs text-slate-400">
                  <span className="font-mono text-[11px]">1h ago</span>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium">4</span>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white">
                    S
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-emerald-600" />
                  Recent Activity
                </span>
              </div>
              <button
                onClick={() => onNavigateToTab?.('changes')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Connecting Timeline Thread */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {/* Event 1 */}
              <div className="relative flex items-start justify-between gap-4">
                <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                <div>
                  <div className="text-xs text-slate-900">
                    <strong className="font-semibold text-slate-900">Alex</strong> pushed 3 commits to <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">main</code>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 font-mono">feat: Improve webhook validation</div>
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">2h ago</span>
              </div>

              {/* Event 2 */}
              <div className="relative flex items-start justify-between gap-4">
                <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-red-500 ring-4 ring-white" />
                <div>
                  <div className="text-xs text-slate-900">
                    <strong className="font-semibold text-slate-900">New issue #356</strong> opened
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Staging DB migration conflict</div>
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">3h ago</span>
              </div>

              {/* Event 3 */}
              <div className="relative flex items-start justify-between gap-4">
                <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white" />
                <div>
                  <div className="text-xs text-slate-900">
                    <strong className="font-semibold text-slate-900">PR #341</strong> marked as ready for review
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Update onboarding copy and error handling</div>
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">5h ago</span>
              </div>

              {/* Event 4 */}
              <div className="relative flex items-start justify-between gap-4">
                <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                <div>
                  <div className="text-xs text-slate-900">
                    <strong className="font-semibold text-slate-900">Deployment to staging completed</strong>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 font-mono">v2.4.0-rc3</div>
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">6h ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Suggested Next Actions & Project Health (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card C: Suggested Next Actions */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Suggested Next Actions</h2>
            </div>

            <div className="space-y-3">
              {/* Action 1 */}
              <button
                onClick={() => handleActionClick('Review PR #342 fix for Stripe webhook signature verification')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 transition-all flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Review PR #342
                    </div>
                    <div className="text-[11px] text-slate-500">Fix Stripe webhook verification</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Action 2 */}
              <button
                onClick={() => handleActionClick('Summarize design feedback on the onboarding flow')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 transition-all flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Respond to design feedback
                    </div>
                    <div className="text-[11px] text-slate-500">3 new comments on onboarding flow</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Action 3 */}
              <button
                onClick={() => handleActionClick('Check staging deployment status and run smoke test suite')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 transition-all flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Check staging deployment
                    </div>
                    <div className="text-[11px] text-slate-500">Verify latest build and run smoke tests</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            </div>
          </div>

          {/* Card D: Project Health */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" />
                  Project Health
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Issue trend</span>
                <span className="font-semibold text-red-600 flex items-center gap-1 font-mono">
                  +3 this week
                  <TrendingUp className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">PR cycle time</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1 font-mono">
                  2.1 days
                  <TrendingDown className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Deployment status</span>
                <span className="font-medium text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Healthy
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Open risks</span>
                <span className="font-medium text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  2 high · 1 medium
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default DashboardView;
