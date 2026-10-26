import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight, CornerDownLeft } from 'lucide-react';

interface CommandConsoleProps {
  onRunCommand: (command: string) => void;
  isLoading: boolean;
  issue42State: string;
}

export const CommandConsole: React.FC<CommandConsoleProps> = ({
  onRunCommand,
  isLoading,
  issue42State,
}) => {
  const [inputVal, setInputVal] = useState(
    'Find root cause for Issue #42 and draft a staging fix'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onRunCommand(inputVal.trim());
  };

  const isOpenBlocker = issue42State === 'open';

  return (
    <aside
      aria-label="PulseDesk AI Command Console"
      className="fixed bottom-3 left-3 right-3 md:left-24 md:right-8 z-40 max-w-4xl mx-auto transition-all duration-200"
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant/30 p-2.5 sm:p-3 shadow-2xl shadow-black/80 flex flex-col gap-2 select-none"
      >
        {/* Subtle top metadata strip */}
        <div className="flex items-center justify-between px-2 text-xs font-mono text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-primary font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Alpha</span>
            </span>
            <span className="text-outline-variant">·</span>
            <span className="text-on-surface-variant">
              {isOpenBlocker ? 'Issue #42 (HMAC Blocker)' : 'Blocker #42 Resolved'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-outline-variant">
            <span>Verified via GitHub MCP &amp; Gmail OAuth</span>
          </div>
        </div>

        {/* Composer Row */}
        <div className="flex items-center gap-2 sm:gap-3 bg-surface-container-low/80 rounded-xl px-3 py-1.5 border border-outline-variant/20 focus-within:border-primary/50 transition-colors">
          <div className="relative flex-1 min-w-0">
            <label className="sr-only" htmlFor="ai-command-input">
              Ask PulseDesk
            </label>
            <input
              id="ai-command-input"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isLoading}
              placeholder="Ask about blockers, commit diffs, or dependencies..."
              className="w-full bg-transparent border-0 focus:ring-0 p-1 font-body text-xs sm:text-sm text-white placeholder-on-surface-variant/40 focus:outline-hidden"
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-fixed disabled:opacity-50 text-on-primary font-body text-xs font-semibold shadow-md shadow-primary/20 transition-all active:scale-95 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Analyzing...</span>
              </>
            ) : (
              <>
                <span>Ask</span>
                <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-black/30 text-white/90">↵</kbd>
              </>
            )}
          </button>
        </div>
      </form>
    </aside>
  );
};
export default CommandConsole;
