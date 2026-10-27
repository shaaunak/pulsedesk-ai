import React, { useState } from 'react';
import { Paperclip, Globe, Folder, ArrowUp, Loader2 } from 'lucide-react';

interface CommandConsoleProps {
  onRunCommand: (command: string) => void;
  isLoading: boolean;
  issue42State: string;
}

export const CommandConsole: React.FC<CommandConsoleProps> = ({
  onRunCommand,
  isLoading,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [webEnabled, setWebEnabled] = useState(false);
  const [projectEnabled, setProjectEnabled] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onRunCommand(inputVal.trim());
    setInputVal('');
  };

  return (
    <aside
      aria-label="PulseDesk AI Command Console"
      className="fixed bottom-4 left-4 right-4 md:left-64 md:right-8 z-30 max-w-4xl mx-auto"
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-composer p-2 sm:p-2.5 flex items-center gap-2 select-none"
      >
        {/* Paperclip Action */}
        <button
          type="button"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
          title="Attach logs or code snippet"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Input Text Field */}
        <div className="relative flex-1 min-w-0">
          <input
            id="ai-command-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isLoading}
            placeholder="Ask PulseDesk anything about your project..."
            className="w-full bg-transparent border-0 focus:ring-0 p-1 font-body text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        {/* Mode Chips & Submit Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Web Mode Toggle */}
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

          {/* Project Mode Toggle */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
            title="Ask PulseDesk"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <ArrowUp className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </form>
    </aside>
  );
};
export default CommandConsole;
