import React, { useState } from 'react';
import {
  Sparkles,
  Paperclip,
  Globe,
  Folder,
  ArrowUp,
  Loader2,
  GitPullRequest,
  Mail,
  Layers,
  ChevronRight,
  ExternalLink,
  FileCode,
  FileText,
  AlertCircle,
  CheckCircle2,
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
}) => {
  const [inputText, setInputText] = useState('');
  const [webEnabled, setWebEnabled] = useState(false);
  const [projectEnabled, setProjectEnabled] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const samplePrompts = [
    'Summarize recent changes',
    'Why is the Stripe integration failing in staging?',
    'What should I focus on today?',
    'Show me open high priority issues',
  ];

  const followUpActions = [
    'Show me the code diff',
    'What files are affected?',
    'Summarize the logs',
    'Create a test plan',
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 overflow-hidden relative">
      {/* Top Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200/90 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Ask PulseDesk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Get intelligent answers from your project data across GitHub, Gmail, Linear and more.
          </p>
        </div>

        {/* Connected Sources Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex -space-x-1">
            <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center ring-2 ring-white">
              <GitPullRequest className="w-3 h-3" />
            </div>
            <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center ring-2 ring-white">
              <Mail className="w-3 h-3" />
            </div>
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-white">
              <Layers className="w-3 h-3" />
            </div>
          </div>
          <span className="text-xs font-medium text-slate-600">3 connected</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Suggested Prompt Chips (Visible above chat) */}
      <div className="px-6 py-3 bg-white/70 border-b border-slate-200/60 flex items-center gap-2 overflow-x-auto custom-scroll shrink-0">
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(prompt)}
            className="px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200/60 text-xs font-medium text-slate-600 transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Conversation Thread Area */}
      <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-6 pb-32">
        {messages.length === 0 ? (
          <div className="max-w-xl mx-auto my-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Intelligent Workspace Assistant</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Ask about release blockers, code commits, Gmail decisions, or project priorities. Every claim is strictly grounded in connected evidence.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2 max-w-md mx-auto">
              {samplePrompts.slice(0, 3).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(prompt)}
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-xs text-slate-700 font-medium transition-all text-left flex items-center justify-between cursor-pointer group shadow-xs"
                >
                  <span>{prompt}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            if (msg.role === 'user') {
              return (
                <div key={msg.id} className="flex justify-end items-end gap-2.5 max-w-3xl ml-auto">
                  <div className="bg-blue-50 border border-blue-100 text-slate-900 rounded-2xl rounded-br-xs px-4 py-3 text-xs leading-relaxed shadow-xs">
                    {msg.content}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    S
                  </div>
                </div>
              );
            }

            const citations = msg.metadata?.citations || [];

            return (
              <div key={msg.id} className="max-w-3xl mr-auto space-y-3">
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-6 space-y-4">
                  {/* Assistant Header */}
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">PulseDesk</span>
                    <span className="text-[11px] text-slate-400">Just now</span>
                  </div>

                  {/* Body Content */}
                  <div className="text-xs text-slate-700 leading-relaxed space-y-2.5">
                    {msg.content.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx} className="whitespace-pre-wrap">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Grounded Citation Chips */}
                  {citations.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Sources:
                      </span>
                      {citations.map((c, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => onSelectEvidence(c.evidence_id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-600 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          <span>{cIdx + 1} {c.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Follow-up Action Chips */}
                  <div className="pt-2 flex items-center gap-2 flex-wrap">
                    {followUpActions.map((action, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => onSendMessage(action)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200/80 text-[11px] font-medium text-slate-600 transition-colors cursor-pointer"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="max-w-xl mr-auto bg-white rounded-2xl border border-slate-200 p-4 shadow-card flex items-center gap-3">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
            <span className="text-xs text-slate-600 font-medium">
              PulseDesk is querying GitHub MCP, Gmail threads, and durable project memories...
            </span>
          </div>
        )}
      </div>

      {/* Bottom Composer */}
      <div className="absolute bottom-4 left-6 right-6 max-w-3xl mx-auto z-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-composer p-2 sm:p-2.5 flex items-center gap-2"
        >
          <button
            type="button"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Ask a follow-up question..."
            className="flex-1 bg-transparent border-0 focus:ring-0 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden px-1"
          />

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setWebEnabled(!webEnabled)}
              className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                webEnabled
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>Web</span>
            </button>

            <button
              type="button"
              onClick={() => setProjectEnabled(!projectEnabled)}
              className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                projectEnabled
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Folder className="w-3.5 h-3.5 text-slate-500" />
              <span>Project</span>
            </button>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <ArrowUp className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default IntelligenceWorkspace;
