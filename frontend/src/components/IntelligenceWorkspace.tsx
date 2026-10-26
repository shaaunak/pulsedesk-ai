import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Database,
  ArrowRight,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { Message, Citation, EvidenceItem } from '../types';

interface IntelligenceWorkspaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onSelectEvidence: (evidenceId: string) => void;
  onToggleDemoState: () => void;
  isDemoMode: boolean;
  issue42State: string;
}

export const IntelligenceWorkspace: React.FC<IntelligenceWorkspaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onSelectEvidence,
  onToggleDemoState,
  isDemoMode,
  issue42State,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const samplePrompts = [
    'What is blocking Alpha launch and what changed since yesterday?',
    'What should I focus on this week based on my priorities?',
    'Remember that Project Alpha demo presentation is top priority.',
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto pb-32">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-10 px-8 py-3.5 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-outline font-mono">Workspace</span>
          <span className="text-outline-variant">/</span>
          <span className="font-medium text-on-surface">Project Alpha Assistant</span>
        </div>

        <div className="text-[11px] font-mono text-outline-variant">
          LangGraph Multi-Agent RAG · Verified Sources
        </div>
      </div>

      {/* Main Workspace Content */}
      <div className="max-w-4xl w-full mx-auto px-8 py-8 flex-1 flex flex-col">
        {/* Header Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-surface-container-high text-primary text-[11px] font-semibold tracking-wide mb-2.5 font-mono border border-outline-variant/30">
            <Sparkles className="w-3 h-3 text-primary" />
            Project Assistant
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight">
            Conversational Intelligence
          </h1>
          <p className="font-body text-sm text-on-surface-variant/90 mt-1 font-light">
            Answers grounded in real GitHub commits, Gmail approvals, and durable memory.
          </p>
        </div>

        {/* Conversation Stream */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center my-6">
            <div className="bg-surface-container-low rounded-2xl p-6 hairline-border shadow-xl">
              <h3 className="font-headline text-sm font-semibold text-on-surface mb-1">
                Explore Project Intelligence
              </h3>
              <p className="font-body text-xs text-on-surface-variant mb-4">
                PulseDesk connects with GitHub issues, Gmail threads, and durable project memory to produce
                source-grounded evidence. Try an example question:
              </p>
              <div className="space-y-2">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(prompt)}
                    className="w-full text-left p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-xs text-on-surface transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 flex-1 mb-6">
            {messages.map((msg) => {
              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-xl bg-surface-container border border-outline-variant/30 rounded-2xl px-5 py-3.5 text-xs text-on-surface shadow-md">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              // Assistant message card
              const citations = msg.metadata?.citations || [];
              const isBlockerOpen = msg.content.includes('Release at risk');
              const isBlockerClosed = msg.content.includes('blocker resolved');

              return (
                <div key={msg.id} className="bg-surface-container-low rounded-2xl hairline-border-strong shadow-xl overflow-hidden">
                  {/* Status Banner */}
                  {isBlockerOpen && (
                    <div className="px-6 py-4 bg-primary-container/20 border-b border-primary-container/40 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-primary-container text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        !
                      </div>
                      <div>
                        <h4 className="font-headline text-sm font-semibold text-on-surface">Release at risk</h4>
                        <p className="font-body text-xs text-on-surface-variant mt-0.5">
                          Two dependencies need attention before the staging demo.
                        </p>
                      </div>
                    </div>
                  )}

                  {isBlockerClosed && (
                    <div className="px-6 py-4 bg-tertiary-container/20 border-b border-tertiary-container/40 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-tertiary text-surface flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-headline text-sm font-semibold text-on-surface">Release blocker resolved</h4>
                        <p className="font-body text-xs text-on-surface-variant mt-0.5">
                          Issue #42 is verified closed. Ready for staging sign-off.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="font-body text-xs leading-relaxed space-y-3 text-on-surface">
                      {msg.content
                        .split('\n\n')
                        .filter((block) => !block.startsWith('### Release at risk') && !block.startsWith('### Release blocker resolved'))
                        .map((block, idx) => (
                          <div key={idx} className="whitespace-pre-wrap">
                            {block}
                          </div>
                        ))}
                    </div>

                    {/* Grounded Citation Chips */}
                    {citations.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-outline-variant/30 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-medium text-on-surface-variant mr-1 font-mono">Sources</span>
                        {citations.map((c, i) => (
                          <button
                            key={i}
                            onClick={() => onSelectEvidence(c.evidence_id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-primary-container/25 text-primary hover:bg-primary-container hover:text-white border border-primary-container/40 transition-all shadow-xs cursor-pointer group"
                            title={`Inspect verified evidence: ${c.label}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-white" />
                            <span>{c.label}</span>
                            {c.url && <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Metadata */}
                  <div className="px-6 py-2.5 bg-surface-container-lowest border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
                    <div className="flex items-center gap-2">
                      <Database className="w-3 h-3 text-primary" />
                      <span>Source checks completed · {citations.length} findings · Grounded verification</span>
                    </div>
                    <span>Inspectable execution</span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="bg-surface-container-low rounded-2xl hairline-border p-6 shadow-md flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <div className="text-xs text-on-surface-variant font-mono">
                  PulseDesk is querying GitHub MCP, Gmail threads, and durable project memories...
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Form at bottom */}
        <div className="mt-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-surface-container-low border border-outline-variant/40 rounded-xl shadow-xl p-2.5 flex flex-col focus-within:border-primary transition-colors"
          >
            <div className="flex items-center gap-2 px-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask a follow-up about your work, blockers or dependencies..."
                disabled={isLoading}
                className="w-full text-xs text-on-surface placeholder:text-on-surface-variant/40 bg-transparent outline-hidden py-2"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-fixed disabled:opacity-50 text-on-primary font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center justify-between px-2 pt-1.5 border-t border-outline-variant/20 text-[10px] text-on-surface-variant font-mono">
              <span>GitHub MCP · Gmail OAuth · PostgreSQL Memory</span>
              <span>Evidence validated before display</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
