import React, { useState, useEffect } from 'react';
import { Search, Sparkles, ArrowRight, X } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectResult }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      category: 'Blockers & CI',
      items: [
        { title: 'Payment Integration / Stripe HMAC Blocker', query: 'What is blocking Alpha launch and what changed since yesterday?', tag: 'Issue #42' },
        { title: 'Release CI Pipeline Failure Invocations', query: 'Show me details of the release CI failure', tag: 'GitHub' },
      ]
    },
    {
      category: 'Stakeholder Communications',
      items: [
        { title: 'VP Finance Staging Migration Approval', query: 'What project updates have I received from VP Finance recently?', tag: 'Gmail' },
      ]
    },
    {
      category: 'Durable Memories',
      items: [
        { title: 'Project Alpha Presentation Priority', query: 'What are my top recorded priorities for Project Alpha?', tag: 'Memory' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Input Bar */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search graph entities, blockers, PR diffs, or enter prompt..."
            className="flex-1 bg-transparent border-0 outline-hidden focus:ring-0 text-sm text-slate-900 placeholder:text-slate-400 font-sans"
            autoFocus
          />
          <kbd className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results / Suggestions */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4 text-xs">
          {quickActions.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider px-2 font-mono">
                {group.category}
              </div>
              <div className="space-y-1">
                {group.items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectResult(item.query);
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-slate-800 font-medium">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono border border-blue-100">
                        {item.tag}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
