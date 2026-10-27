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
- **Pull Request #342:** Fix Stripe webhook HMAC signature calculation (+142 / -38 lines)
- **Status:** Awaiting code review by core team
- **Evidence Citation:** [fixture:github:pr-342] https://github.com/pulsedesk/project-alpha/pull/342

## 5. Strategic Context & Priorities
- **Recorded Fact:** Project Alpha presentation is top priority before Friday.
- **Provenance:** Explicit user priority recorded in Durable Memory Store.

---
*Report generated autonomously by PulseDesk AI workspace engine with cryptographic evidence hashing.*`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PulseDesk_Briefing_Alpha_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] border border-slate-200 shadow-2xl overflow-hidden flex flex-col p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-base">Export Executive Briefing</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                  Markdown · Grounded
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ready-to-share status report with verified citations, root causes, and blast radius.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Preview */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
            <span>Markdown Preview · Verified Citations Included</span>
            <span className="flex items-center gap-1 text-emerald-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Grounded Evidence</span>
            </span>
          </div>

          <pre className="flex-1 overflow-y-auto p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-text">
            {markdownContent}
          </pre>
        </div>

        {/* Footer CTAs */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 flex-wrap">
          <div className="text-[11px] text-slate-400">
            Export ready · Safe for external stakeholder sharing
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
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
export default ExportBriefingModal;
