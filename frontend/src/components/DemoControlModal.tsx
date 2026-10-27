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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isOpenState ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
            <h3 className="text-sm font-semibold text-slate-900">Demo Controller</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
            <div className="font-semibold text-blue-700 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Evidence-Grounding Verification Story</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              PulseDesk does not hallucinate static answers. Toggle GitHub Issue #42 from{' '}
              <strong className="text-slate-900 font-semibold">OPEN</strong> to{' '}
              <strong className="text-slate-900 font-semibold">CLOSED</strong> below to watch the LangGraph
              agent discover the change, re-evaluate blockers, and adapt its priorities live!
            </p>
          </div>

          {/* Current State Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider font-mono">
                GitHub Issue #42 Status
              </div>
              <div className="flex items-center gap-2 mt-1">
                {isOpenState ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    <AlertTriangle className="w-3 h-3" />
                    Open (Blocking Release)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    Resolved (Closed & Verified)
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onToggleIssue42}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-white text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Toggle State</span>
            </button>
          </div>

          {/* Preset Recruiter Query CTA */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Click to execute test query in Chat:</span>
            <button
              onClick={() => {
                onRunDemoQuery();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <span>Run Verification Query</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DemoControlModal;
