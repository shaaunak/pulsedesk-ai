import React from 'react';
import {
  ExternalLink,
  GitBranch,
  Mail,
  Brain,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { EvidenceItem, ToolEvent } from '../types';

interface SourceInspectorProps {
  evidenceList: EvidenceItem[];
  activityList: ToolEvent[];
  selectedEvidenceId: string | null;
  onOpenEvidenceDetail: (evidence: EvidenceItem) => void;
}

export const SourceInspector: React.FC<SourceInspectorProps> = ({
  evidenceList,
  activityList,
  selectedEvidenceId,
  onOpenEvidenceDetail,
}) => {
  return (
    <aside className="w-80 border-l border-outline-variant/30 bg-surface-container-lowest flex flex-col h-full overflow-y-auto text-xs pb-32">
      {/* Top Header */}
      <div className="px-5 py-4 border-b border-outline-variant/20 bg-surface-container-low/50">
        <div className="text-[10px] uppercase font-semibold text-outline tracking-wider font-mono">
          Source Inspector
        </div>
        <div className="font-headline text-sm font-semibold text-on-surface mt-0.5">
          Evidence you can verify
        </div>
      </div>

      <div className="p-5 space-y-6 flex-1">
        {/* Evidence Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-semibold text-outline tracking-wider font-mono">
              Evidence ({evidenceList.length})
            </span>
            <span className="text-[10px] text-primary font-mono font-medium">Click to inspect</span>
          </div>

          {evidenceList.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/40 text-center text-on-surface-variant text-xs">
              No evidence collected yet. Run an inquiry to inspect live source cards.
            </div>
          ) : (
            <div className="space-y-3">
              {evidenceList.map((item) => {
                const isSelected = selectedEvidenceId === item.evidence_id;
                let sourceBadge = 'Source';
                let dotColor = 'bg-primary';

                if (item.source_type === 'github_issue') {
                  sourceBadge = `GitHub · Issue #${item.metadata?.number || '42'}`;
                  dotColor = 'bg-primary-container';
                } else if (item.source_type === 'gmail_message') {
                  sourceBadge = 'Gmail · Approval';
                  dotColor = 'bg-secondary';
                } else if (item.source_type === 'memory') {
                  sourceBadge = 'Memory · Priority';
                  dotColor = 'bg-tertiary';
                }

                return (
                  <div
                    key={item.evidence_id}
                    id={`evidence-${item.evidence_id}`}
                    onClick={() => onOpenEvidenceDetail(item)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary-container bg-surface-container shadow-md ring-1 ring-primary-container/40'
                        : 'border-outline-variant/30 bg-surface-container-low hover:border-primary-container/40 hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                      <span className="text-[11px] font-semibold text-on-surface font-mono">{sourceBadge}</span>
                    </div>

                    <h5 className="font-headline font-medium text-xs text-on-surface line-clamp-1">{item.title}</h5>
                    <p className="font-body text-[11px] text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                      {item.snippet}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-outline">
                        {item.live_checked ? 'Live verified' : 'Indexed store'}
                      </span>
                      <span className="text-primary font-medium flex items-center gap-1 hover:underline">
                        View source <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Agent Activity Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-semibold text-outline tracking-wider font-mono">
              Agent Activity
            </span>
            <span className="text-[10px] text-outline font-mono">LangGraph trace</span>
          </div>

          {activityList.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/40 text-center text-on-surface-variant text-xs">
              Activity timeline will populate when the agent evaluates a question.
            </div>
          ) : (
            <div className="space-y-2">
              {activityList.map((act, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-container hairline-border"
                >
                  <div className="mt-0.5">
                    {act.status === 'success' ? (
                      <span className="w-2 h-2 rounded-full bg-tertiary block" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-primary-container block" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-on-surface truncate">{act.name}</span>
                      {act.duration_ms > 0 && (
                        <span className="text-[10px] text-outline font-mono">{act.duration_ms}ms</span>
                      )}
                    </div>
                    {act.output_summary && (
                      <div className="text-[11px] text-on-surface-variant truncate mt-0.5 font-mono">
                        {act.output_summary}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Guardrail Notice */}
      <div className="p-4 border-t border-outline-variant/30 bg-surface-container-lowest text-[10px] text-on-surface-variant flex items-center gap-2 font-mono">
        <ShieldCheck className="w-4 h-4 text-tertiary shrink-0" />
        <span>Strict read-only MCP bounds. No hallucinations permitted.</span>
      </div>
    </aside>
  );
};
