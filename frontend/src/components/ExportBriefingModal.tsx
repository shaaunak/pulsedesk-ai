import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, FileText, Sparkles, ShieldCheck } from 'lucide-react';

interface ExportBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue42State: string;
}

export const ExportBriefingModal: React.FC<ExportBriefingModalProps> = ({
  isOpen,
  onClose,
  issue42State,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const isOpenBlocker = issue42State === 'open';
  const timestamp = new Date().toUTCString();

  const markdownContent = `# PulseDesk — Project Alpha Executive Briefing
**Generated:** ${timestamp}
**Synthesis Engine:** LangGraph 7-Stage Stateful Workflow with Verified Citations
**Workspace Status:** ${isOpenBlocker ? 'ELEVATED RISK · RELEASE AT RISK' : 'NOMINAL · CLEAR FOR STAGING'}

---

## 1. Executive Summary
${
  isOpenBlocker
    ? 'Project Alpha release gating is currently **HALTED** due to a high-severity integration failure in the payment pipeline. 1 critical blocker and 1 pending decision require executive attention prior to the staging demo.'
    : 'All critical release blockers have been **RESOLVED**. Issue #42 has been verified closed in live repository status. Integration test pipelines are green and the staging cluster is cleared for demo sign-off.'
}

## 2. Release Blockers & Status
- **Issue #42 (Release CI pipeline failing):**
  - **State:** ${isOpenBlocker ? 'OPEN (Critical Blocker)' : 'CLOSED (Verified in Live Git)'}
  - **Component:** Stripe Webhook Gateway (\`test_checkout_intent_v2\`)
  - **Root Cause:** HMAC-SHA256 signature calculated against sanitized JSON hash instead of raw request body.
  - **Evidence Citation:** [fixture:github:42] https://github.com/pulsedesk/project-alpha/issues/42
  - **Action Required:** ${isOpenBlocker ? 'Review PR #342 payload serialization diff & rotate staging secret.' : 'Deploy signed-off build to Staging Cluster #4.'}

## 3. Pending Decisions & Communications
- **Gmail Approval (Alpha Staging Approval):**
  - **Sender:** Elena Rostova (VP Finance / Approvals)
  - **Status:** ${isOpenBlocker ? 'ON HOLD (Conditioned on zero-error CI run)' : 'APPROVED FOR STAGING'}
  - **Evidence Citation:** [fixture:gmail:approval-1] https://mail.google.com/mail/u/0/#inbox/approval-1
  - **Decision Mandate:** "Zero tolerance for unverified signature handshakes during the 30-minute transition."

## 4. Code Changes & Diffs
- **PR #342 (Diff in webhook.rb):**
  - **Metrics:** +142 / -38 lines changed across \`webhook.rb\` and \`webhook_spec.rb\`.
  - **Author:** @alex-lead
  - **Validation:** 28/28 assertions verified in staging test runner #2948-Alpha.

## 5. Recommended Priority Sequence
1. ${isOpenBlocker ? 'Merge & verify PR #342 in staging cluster #4 [fixture:github:42]' : 'Trigger staging demo deployment pipeline [fixture:github:42]'}
2. ${isOpenBlocker ? 'Submit green test trace to VP Finance for sign-off [fixture:gmail:approval-1]' : 'Collect formal staging sign-off from VP Finance [fixture:gmail:approval-1]'}
3. Continue enhancement on accessibility labels (Issue #47) [fixture:github:47]

---
*Report synthesized autonomously by PulseDesk AI. All claims verified against connected GitHub MCP and Gmail conduits.*
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PulseDesk_Briefing_Project_Alpha_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-2xl bg-surface-container-lowest hairline-border-strong shadow-2xl p-6 sm:p-8 flex flex-col gap-5 max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-outline-variant/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Briefing Export</span>
              </div>
              <h2 className="font-headline text-lg sm:text-xl font-semibold text-on-surface">
                Project Alpha Briefing Report
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Preview */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant mb-2">
            <span>Markdown Preview · Verified Citations Included</span>
            <span className="flex items-center gap-1 text-primary">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Grounded Evidence</span>
            </span>
          </div>

          <pre className="flex-1 overflow-y-auto p-4 rounded-xl bg-surface-container-low hairline-border font-mono text-xs text-on-surface/90 leading-relaxed custom-scroll whitespace-pre-wrap select-text">
            {markdownContent}
          </pre>
        </div>

        {/* Footer CTAs */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-outline-variant/20 flex-wrap">
          <div className="text-[11px] font-mono text-on-surface-variant/70">
            Export ready · Safe for external stakeholder sharing
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body text-xs font-medium border border-outline-variant/30 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary font-body text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
