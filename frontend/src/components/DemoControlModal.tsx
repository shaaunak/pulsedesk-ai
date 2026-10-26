import React from 'react';
import { X, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, Layers, Sparkles } from 'lucide-react';

interface DemoControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue42State: string;
  onToggleIssue42: () => void;
  onRunDemoQuery: () => void;
}

export const DemoControlModal: React.FC<DemoControlModalProps> = ({
  isOpen,
  onClose,
  issue42State,
  onToggleIssue42,
  onRunDemoQuery,
}) => {
  if (!isOpen) return null;

  const isOpenState = issue42State === 'open';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-low rounded-2xl max-w-lg w-full hairline-border-strong shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse" />
            <h3 className="font-headline text-sm font-semibold text-on-surface">Recruiter Demo Controller</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-on-surface font-body">
          <div className="p-4 rounded-xl bg-primary-container/15 border border-primary-container/30 text-xs">
            <div className="font-semibold text-primary flex items-center gap-1.5 mb-1 font-headline">
              <Sparkles className="w-4 h-4" />
              <span>Evidence-Grounding Verification Story</span>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              PulseDesk does not hallucinate static answers. Toggle GitHub Issue #42 from{' '}
              <strong className="text-white font-semibold">OPEN</strong> to{' '}
              <strong className="text-white font-semibold">CLOSED</strong> below to watch the LangGraph
              agent discover the change, re-evaluate blockers, and adapt its priorities live!
            </p>
          </div>

          {/* Current State Card */}
          <div className="p-4 rounded-xl hairline-border bg-surface-container flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-semibold text-outline tracking-wider font-mono">
                GitHub Issue #42 Status
              </div>
              <div className="font-headline text-sm font-bold text-on-surface mt-0.5 flex items-center gap-2">
                <span>Release CI pipeline failing</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-semibold ${
                    isOpenState
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-tertiary-container text-on-tertiary-container'
                  }`}
                >
                  {issue42State}
                </span>
              </div>
            </div>

            <button
              onClick={onToggleIssue42}
              className="px-3.5 py-2 rounded-lg bg-primary-container text-on-primary-container hover:bg-inverse-primary transition-colors font-medium text-xs flex items-center gap-1.5 shadow-md font-body cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Toggle to {isOpenState ? 'CLOSED' : 'OPEN'}</span>
            </button>
          </div>

          {/* Two-step Walkthrough */}
          <div className="space-y-2 font-mono">
            <div className="text-[10px] uppercase font-semibold text-outline tracking-wider">
              Verification Steps
            </div>

            <div className="p-3 rounded-lg hairline-border bg-surface-container-lowest flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-surface-container text-primary font-bold flex items-center justify-center shrink-0 text-[11px]">
                1
              </span>
              <div className="font-body text-xs">
                <div className="font-semibold text-on-surface">When Issue #42 is OPEN:</div>
                <div className="text-on-surface-variant mt-0.5">
                  Agent detects release blocker, warns <em>"Release at risk"</em>, and recommends fixing
                  the reopened CI pipeline before staging sign-off.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg hairline-border bg-surface-container-lowest flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-surface-container text-tertiary font-bold flex items-center justify-center shrink-0 text-[11px]">
                2
              </span>
              <div className="font-body text-xs">
                <div className="font-semibold text-on-surface">When Issue #42 is CLOSED:</div>
                <div className="text-on-surface-variant mt-0.5">
                  Agent detects CI is passing, announces <em>"Release blocker resolved"</em>, and
                  unblocks the request for staging sign-off!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-surface-container-lowest border-t border-outline-variant/30 flex items-center justify-between">
          <span className="text-[11px] text-outline font-mono">Synthetic reproducible scenario</span>
          <button
            onClick={() => {
              onRunDemoQuery();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-on-surface text-surface hover:bg-white transition-colors font-semibold text-xs flex items-center gap-1.5 shadow-md cursor-pointer font-body"
          >
            <span>Run Blocker Query</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
