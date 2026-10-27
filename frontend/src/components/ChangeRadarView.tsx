import React, { useState } from 'react';
import {
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Mail,
  Rocket,
  Filter,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface ChangeRadarViewProps {
  issue42State?: string;
  onInspectEvidence?: (evidenceId: string) => void;
  onSynthesizeInChat?: (query: string) => void;
  onToggleDemoState?: () => void;
}

export const ChangeRadarView: React.FC<ChangeRadarViewProps> = ({
  issue42State = 'open',
  onInspectEvidence,
  onSynthesizeInChat,
  onToggleDemoState,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedRange, setSelectedRange] = useState<string>('Last 7 days');

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'commits', label: 'Commits' },
    { id: 'prs', label: 'Pull Requests' },
    { id: 'issues', label: 'Issues' },
    { id: 'emails', label: 'Emails' },
    { id: 'deployments', label: 'Deployments' },
  ];

  const timelineEvents = [
    {
      id: 'evt-1',
      type: 'commits',
      author: 'alex',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face',
      title: (
        <span>
          <strong className="font-semibold text-slate-900">alex</strong> pushed{' '}
          <strong className="font-semibold text-slate-900">3 commits</strong> to{' '}
          <strong className="font-semibold text-slate-900">main</strong>
        </span>
      ),
      subtitle: 'feat: Improve webhook validation and error handling',
      tag: 'a1b2c3d',
      time: '2h ago',
      source: 'GitHub',
      sourceBadge: 'bg-slate-100 text-slate-700 border-slate-200',
      actionQuery: 'What were the 3 commits alex pushed to main today?',
    },
    {
      id: 'evt-2',
      type: 'prs',
      author: 'PR #341',
      iconBadge: 'bg-blue-50 text-blue-600 border-blue-200',
      icon: GitPullRequest,
      title: (
        <span>
          <strong className="font-semibold text-slate-900">PR #341</strong> marked as ready for review
        </span>
      ),
      subtitle: 'Update webhook handling logic',
      tag: '#341',
      time: '5h ago',
      source: 'GitHub',
      sourceBadge: 'bg-slate-100 text-slate-700 border-slate-200',
      actionQuery: 'Summarize PR #341 changes and who needs to review it.',
    },
    {
      id: 'evt-3',
      type: 'issues',
      author: 'Issue #356',
      iconBadge: 'bg-rose-50 text-rose-600 border-rose-200',
      icon: AlertCircle,
      title: (
        <span>
          <strong className="font-semibold text-slate-900">Issue #356</strong> opened
        </span>
      ),
      subtitle: 'Staging DB migration conflict',
      tag: '#356',
      time: '6h ago',
      source: 'GitHub',
      sourceBadge: 'bg-slate-100 text-slate-700 border-slate-200',
      actionQuery: 'Explain Issue #356 and the staging DB migration conflict.',
    },
    {
      id: 'evt-4',
      type: 'emails',
      author: 'Linear',
      avatarText: 'L',
      avatarBg: 'bg-indigo-900 text-white',
      title: (
        <span>
          <strong className="font-semibold text-slate-900">New email from Linear</strong>
        </span>
      ),
      subtitle: 'Re: Onboarding flow feedback',
      tag: 'From: design@linear.app',
      time: '8h ago',
      source: 'Gmail',
      sourceBadge: 'bg-red-50 text-red-600 border-red-100',
      actionQuery: 'What feedback did Linear send regarding the onboarding flow?',
    },
    {
      id: 'evt-5',
      type: 'deployments',
      author: 'Deploy Staging',
      iconBadge: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      icon: Rocket,
      title: (
        <span>
          <strong className="font-semibold text-slate-900">Deployment to staging</strong> completed
        </span>
      ),
      subtitle: 'v2.4.0-rc3 built and passing health checks',
      tag: 'staging-k8s',
      time: '10h ago',
      source: 'Deployments',
      sourceBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      actionQuery: 'What was included in deployment v2.4.0-rc3 to staging?',
    },
  ];

  const filteredEvents = timelineEvents.filter((evt) => {
    if (activeFilter === 'all') return true;
    return evt.type === activeFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full pb-32 animate-fade-in">
      {/* Header matching Changes reference */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Changes</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track important changes across your connected sources.
          </p>
        </div>

        {/* Right side filter controls */}
        <div className="flex items-center gap-2.5">
          <button className="bg-white border border-slate-200/90 hover:bg-slate-50 text-xs font-medium text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer">
            <span>{selectedRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button className="bg-white border border-slate-200/90 hover:bg-slate-50 text-xs font-medium text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left Column Timeline + Right Column Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Timeline (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">
              Today
            </div>

            <div className="space-y-3">
              {filteredEvents.map((event) => {
                const Icon = event.icon;

                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex items-start gap-3.5 group"
                  >
                    {/* Avatar / Icon Badge */}
                    <div className="shrink-0 mt-0.5">
                      {event.avatar ? (
                        <img
                          src={event.avatar}
                          alt={event.author}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                      ) : event.avatarText ? (
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${event.avatarBg}`}
                        >
                          {event.avatarText}
                        </div>
                      ) : (
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center border ${event.iconBadge}`}
                        >
                          {Icon && <Icon className="w-4 h-4" />}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm text-slate-800 leading-snug">
                          {event.title}
                        </div>
                        {onSynthesizeInChat && (
                          <button
                            onClick={() => onSynthesizeInChat(event.actionQuery)}
                            className="opacity-0 group-hover:opacity-100 text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-opacity cursor-pointer shrink-0"
                            title="Ask PulseDesk about this change"
                          >
                            <span>Analyze</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 mt-0.5 truncate">
                        {event.subtitle}
                      </div>

                      {/* Metadata Row */}
                      <div className="flex items-center gap-2 mt-2.5 text-[11px] text-slate-400 font-mono">
                        <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">
                          {event.tag}
                        </span>
                        <span>•</span>
                        <span className="font-sans text-slate-400">{event.time}</span>
                        <span>•</span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-sans font-medium text-[10px] border ${event.sourceBadge}`}
                        >
                          {event.source}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Change Summary & Top Contributors (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Change Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
                Change Summary (7d)
              </h2>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="text-2xl font-bold text-slate-900">24</div>
                  <div className="text-xs text-slate-500 mt-0.5">Commits</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="text-2xl font-bold text-slate-900">8</div>
                  <div className="text-xs text-slate-500 mt-0.5">Pull Requests</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="text-2xl font-bold text-slate-900">12</div>
                  <div className="text-xs text-slate-500 mt-0.5">Issues</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="text-2xl font-bold text-slate-900">16</div>
                  <div className="text-xs text-slate-500 mt-0.5">Emails</div>
                </div>
              </div>
            </div>

            {/* Top Contributors Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
                Top Contributors
              </h2>

              <div className="mt-4 space-y-3.5">
                {[
                  {
                    name: 'alex',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face',
                    commits: '12 commits',
                  },
                  {
                    name: 'you',
                    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face',
                    commits: '8 commits',
                  },
                  {
                    name: 'ephraim',
                    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=64&h=64&fit=crop&crop=face',
                    commits: '4 commits',
                  },
                  {
                    name: 'others',
                    initial: '+',
                    commits: '6 commits',
                  },
                ].map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {c.avatar ? (
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-semibold">
                          {c.initial}
                        </div>
                      )}
                      <span className="text-xs font-medium text-slate-800">{c.name}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{c.commits}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
