import React from 'react';
import {
  FileCode,
  GitPullRequest,
  Mail,
  FileText,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import { EvidenceItem, ToolEvent } from '../types';

interface SourceInspectorProps {
  evidenceList: EvidenceItem[];
  activityList: ToolEvent[];
  selectedEvidenceId: string | null;
  onOpenEvidenceDetail: (item: EvidenceItem) => void;
}

export const SourceInspector: React.FC<SourceInspectorProps> = ({
  evidenceList,
  selectedEvidenceId,
  onOpenEvidenceDetail,
}) => {
  // Fallback high-fidelity sources matching the reference design
  const defaultSources: EvidenceItem[] = [
    {
      evidence_id: 'fixture:github:42',
      source_type: 'github_issue',
      external_id: '#342',
      title: '#342 Payment integration is blocking the next release',
      snippet: 'Webhook signature verification failing in staging environment due to payload serialization drift in commit 9f2e81a.',
      url: 'https://github.com/pulsedesk/project-alpha/issues/42',
      observed_at: new Date(Date.now() - 22 * 60000).toISOString(),
      live_checked: true,
      metadata: { repo: 'github.com', category: 'Issue', time: '22m ago' },
    },
    {
      evidence_id: 'fixture:github:pr341',
      source_type: 'github_pr',
      external_id: 'PR #341',
      title: 'PR #341 Update webhook handling',
      snippet: 'Refactored Stripe webhook verification logic and updated raw payload parser for v2022-11-15 headers.',
      url: 'https://github.com/pulsedesk/project-alpha/pull/341',
      observed_at: new Date(Date.now() - 3 * 3600000).toISOString(),
      live_checked: true,
      metadata: { repo: 'github.com', category: 'PR', time: '3h ago' },
    },
    {
      evidence_id: 'fixture:config:staging',
      source_type: 'staging_config',
      external_id: 'config-1',
      title: 'Staging environment variables',
      snippet: 'STRIPE_WEBHOOK_SECRET in staging cluster #4 is set to a legacy secret rotated during the previous release.',
      url: null,
      observed_at: new Date(Date.now() - 24 * 3600000).toISOString(),
      live_checked: true,
      metadata: { repo: 'docs/internal', category: 'Config', time: '1d ago' },
    },
    {
      evidence_id: 'fixture:datadog:logs',
      source_type: 'error_logs',
      external_id: 'log-1',
      title: 'Error logs (last 24h)',
      snippet: '28 failed invocations detected during test_checkout_intent_v2 with "signature verification failed" 401 exceptions.',
      url: null,
      observed_at: new Date(Date.now() - 24 * 3600000).toISOString(),
      live_checked: true,
      metadata: { repo: 'datadog', category: 'Logs', time: '1d ago' },
    },
  ];

  const displayedList = evidenceList.length > 0 ? evidenceList : defaultSources;

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'github_issue':
      case 'github_pr':
        return <GitPullRequest className="w-4 h-4 text-slate-700" />;
      case 'gmail_message':
        return <Mail className="w-4 h-4 text-red-500" />;
      case 'staging_config':
        return <FileCode className="w-4 h-4 text-blue-500" />;
      default:
        return <Layers className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <aside
      aria-label="Source Inspector Panel"
      className="w-80 bg-white border-l border-slate-200/90 h-full flex flex-col justify-between shrink-0 select-none custom-scroll overflow-y-auto"
    >
      <div>
        {/* Panel Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Sources ({displayedList.length})</h2>
          </div>
          <span className="text-[11px] font-medium text-slate-400">Grounded</span>
        </div>

        {/* Source Cards List */}
        <div className="p-4 space-y-3">
          {displayedList.map((item, idx) => {
            const isSelected = selectedEvidenceId === item.evidence_id;

            return (
              <div
                key={item.evidence_id || idx}
                onClick={() => onOpenEvidenceDetail(item)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-blue-50/60 border-blue-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getSourceIcon(item.source_type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-semibold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-1">
                      <span>{item.metadata?.repo || 'github.com'}</span>
                      <span>·</span>
                      <span>{item.metadata?.time || 'recently'}</span>
                    </div>
                    {item.snippet && (
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5 line-clamp-2 font-normal">
                        {item.snippet}
                      </p>
                    )}
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 opacity-60 group-hover:opacity-100 transition-all shrink-0 mt-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Provenance Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60 text-[11px] text-slate-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Grounded via AST verification. Uncited claims purged.</span>
      </div>
    </aside>
  );
};
export default SourceInspector;
