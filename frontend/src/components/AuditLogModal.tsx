import React from 'react';
import { X, ShieldAlert, Terminal, Clock, CheckCircle2, FileText, ExternalLink } from 'lucide-react';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue42State: string;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  isOpen,
  onClose,
  issue42State,
}) => {
  if (!isOpen) return null;

  const logs = [
    {
      time: '14:22:18 UTC',
      level: 'ERROR',
      runner: 'Runner #2948-Alpha',
      event: 'HMAC Signature verification failed in StripeWebhookHandler::verify!',
      detail: 'Expected HMAC-SHA256 (computed against raw payload bytes) did not match HTTP_STRIPE_SIGNATURE header.',
      commit: '9f2e81a',
    },
    {
      time: '14:21:40 UTC',
      level: 'WARN',
      runner: 'TestRunner::Checkout',
      event: '28 retried requests received 401 Unauthorized in staging cluster #4',
      detail: 'Webhook payload was serialized via ActiveSupport::JSON before digest computation.',
      commit: '9f2e81a',
    },
    {
      time: '14:15:02 UTC',
      level: 'INFO',
      runner: 'CI::PipelineOrchestrator',
      event: issue42State === 'open' ? 'Issue #42 reopened automatically by CI failure webhook' : 'Issue #42 marked as resolved by engineering patch PR #342',
      detail: 'Gating rule alpha-release-critical triggered halt on stage deployment.',
      commit: 'c41a201',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Cluster Audit Log: Stripe Webhook Staging Failure
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
            <span>Target: staging-k8s-us-west #4</span>
            <span className="text-red-600 font-semibold">28 Failed Invocations</span>
          </div>

          <div className="space-y-3 font-mono">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.level === 'ERROR'
                          ? 'bg-red-100 text-red-700'
                          : log.level === 'WARN'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-slate-700 font-medium">{log.runner}</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">{log.time}</span>
                </div>

                <div className="text-slate-900 font-medium text-xs font-sans">{log.event}</div>
                <div className="text-slate-500 text-[11px] font-sans leading-relaxed">{log.detail}</div>

                <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-400">
                  <span>Commit:</span>
                  <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono">
                    {log.commit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">Telemetry: Datadog APM + Kubernetes Events</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              Close Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
