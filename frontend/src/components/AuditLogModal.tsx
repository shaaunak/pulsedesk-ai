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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-low rounded-2xl max-w-2xl w-full hairline-border-strong shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl" data-icon="description">
              description
            </span>
            <h3 className="font-headline text-sm font-semibold text-on-surface">
              Cluster Audit Log: Stripe Webhook Staging Failure
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[480px] overflow-y-auto custom-scroll text-xs">
          <div className="p-3.5 rounded-xl bg-surface-container-lowest hairline-border font-mono text-[11px] text-on-surface-variant space-y-1">
            <div>Target: staging-k8s-us-west · Pod: checkout-webhook-daemon-v2</div>
            <div>Correlation ID: req_9f2e81a_stripe_hmac_mismatch_2026</div>
            <div>Status: <span className="text-primary font-semibold">{issue42State.toUpperCase()}</span></div>
          </div>

          <div className="space-y-3 font-mono">
            {logs.map((l, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-surface-container hairline-border space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.2 rounded font-semibold ${
                      l.level === 'ERROR' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-secondary'
                    }`}>
                      {l.level}
                    </span>
                    <span className="text-on-surface-variant">{l.time}</span>
                  </div>
                  <span className="text-outline">Commit {l.commit}</span>
                </div>
                <div className="text-xs font-semibold text-on-surface">{l.event}</div>
                <div className="text-[11px] text-on-surface-variant/80 font-sans leading-relaxed">{l.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-3.5 bg-surface-container-lowest border-t border-outline-variant/30 flex items-center justify-between text-xs">
          <span className="font-mono text-on-surface-variant text-[11px]">3 telemetry records verified</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-medium transition-colors"
          >
            Close Log
          </button>
        </div>
      </div>
    </div>
  );
};

