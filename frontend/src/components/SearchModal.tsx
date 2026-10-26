import React, { useState, useEffect } from 'react';

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-surface-container-low rounded-2xl max-w-2xl w-full hairline-border-strong shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Input Bar */}
        <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl" data-icon="search">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search graph entities, blockers, PR diffs, or enter prompt..."
            className="flex-1 bg-transparent border-0 outline-hidden focus:ring-0 text-sm text-on-surface placeholder:text-on-surface-variant/40 font-body"
            autoFocus
          />
          <kbd className="text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono">
            ESC
          </kbd>
        </div>

        {/* Results / Suggestions */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4 custom-scroll text-xs">
          {quickActions.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <div className="text-[10px] uppercase font-semibold text-outline tracking-wider px-2 font-mono">
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
                    className="w-full text-left p-3 rounded-xl hover:bg-surface-container flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-base text-primary" data-icon="auto_awesome">
                        auto_awesome
                      </span>
                      <span className="text-on-surface font-medium">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-secondary font-mono">
                        {item.tag}
                      </span>
                      <span className="material-symbols-outlined text-xs text-outline-variant group-hover:text-primary transition-colors" data-icon="arrow_forward">
                        arrow_forward
                      </span>
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
