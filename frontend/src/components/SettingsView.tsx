import React, { useState } from 'react';
import { Shield, Cpu, GitBranch, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [provider, setProvider] = useState('auto');
  const [model, setModel] = useState('gpt-4o');
  const [repo, setRepo] = useState('pulsedesk/project-alpha');
  const [langsmithEnabled, setLangsmithEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto pb-32">
      {/* Header */}
      <div className="px-8 py-5 border-b border-outline-variant/20 bg-surface-container-lowest/60">
        <h2 className="font-display text-xl font-bold text-on-surface">Workspace Settings</h2>
        <p className="font-body text-xs text-on-surface-variant mt-0.5">
          Configure model parameters, repository bindings, and privacy guardrails.
        </p>
      </div>

      <div className="max-w-3xl w-full mx-auto p-8 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* LLM Provider Card */}
          <div className="bg-surface-container-low rounded-2xl hairline-border-strong p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-on-surface font-headline">
              <Cpu className="w-4 h-4 text-primary" />
              <span>Agent LLM Engine & Provider</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body">
              <div>
                <label className="block text-[11px] font-semibold text-outline uppercase tracking-wider mb-1.5 font-mono">
                  Provider Selection
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full p-2.5 rounded-lg hairline-border bg-surface-container text-on-surface outline-hidden focus:border-primary-container font-mono"
                >
                  <option value="auto">Auto-detect (Env configured)</option>
                  <option value="openai">OpenAI (GPT-4o)</option>
                  <option value="gemini">Google Gemini (Gemini 1.5 Pro)</option>
                  <option value="demo">Deterministic Synthetic Engine</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-outline uppercase tracking-wider mb-1.5 font-mono">
                  Model Identifier
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full p-2.5 rounded-lg hairline-border bg-surface-container text-on-surface outline-hidden focus:border-primary-container font-mono"
                />
              </div>
            </div>
          </div>

          {/* GitHub Binding Card */}
          <div className="bg-surface-container-low rounded-2xl hairline-border-strong p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-on-surface font-headline">
              <GitBranch className="w-4 h-4 text-secondary" />
              <span>Target Repository Binding</span>
            </div>

            <div className="text-xs font-body">
              <label className="block text-[11px] font-semibold text-outline uppercase tracking-wider mb-1.5 font-mono">
                Default GitHub Repository (owner/repo)
              </label>
              <input
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="owner/repository"
                className="w-full p-2.5 rounded-lg hairline-border bg-surface-container text-on-surface outline-hidden focus:border-primary-container font-mono"
              />
              <p className="text-[11px] text-on-surface-variant mt-1.5">
                MCP server will query issues and pull requests from this repository.
              </p>
            </div>
          </div>

          {/* Privacy & Observability Card */}
          <div className="bg-surface-container-low rounded-2xl hairline-border-strong p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-on-surface font-headline">
              <Shield className="w-4 h-4 text-tertiary" />
              <span>Privacy & Guardrails</span>
            </div>

            <div className="space-y-3 text-xs font-body">
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-container hairline-border">
                <div>
                  <div className="font-semibold text-on-surface">Least-Privilege Enforcement</div>
                  <div className="text-on-surface-variant text-[11px]">Strictly read-only access to GitHub and Gmail. No write actions.</div>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary font-mono">
                  Enforced
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-container hairline-border">
                <div>
                  <div className="font-semibold text-on-surface">Prompt-Injection Boundary</div>
                  <div className="text-on-surface-variant text-[11px]">Treats retrieved external emails and issues strictly as untrusted data.</div>
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary font-mono">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-container hairline-border">
                <div>
                  <div className="font-semibold text-on-surface">LangSmith Observability</div>
                  <div className="text-on-surface-variant text-[11px]">Send redacted execution traces when credentials are configured.</div>
                </div>
                <input
                  type="checkbox"
                  checked={langsmithEnabled}
                  onChange={(e) => setLangsmithEnabled(e.target.checked)}
                  className="rounded text-primary-container focus:ring-primary-container w-4 h-4"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {saved && (
              <span className="text-xs text-tertiary font-medium flex items-center gap-1 font-mono">
                <Check className="w-3.5 h-3.5" /> Settings saved successfully
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-inverse-primary transition-colors font-semibold text-xs shadow-md font-body cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
