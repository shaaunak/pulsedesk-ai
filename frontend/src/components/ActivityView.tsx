import React, { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';
import { getRecentActivity } from '../api';

export const ActivityView: React.FC = () => {
  const [runs, setRuns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    setIsLoading(true);
    try {
      const data = await getRecentActivity();
      setRuns(data);
    } catch (e) {
      console.error('Failed to load activity', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto pb-32">
      {/* Header */}
      <div className="px-8 py-5 border-b border-outline-variant/20 bg-surface-container-lowest/60 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-on-surface">Agent Activity Inspector</h2>
          <p className="font-body text-xs text-on-surface-variant mt-0.5">
            Real-time execution traces, tool invocation latencies, and claim verification events.
          </p>
        </div>

        <button
          onClick={loadActivity}
          className="px-3.5 py-1.5 rounded-lg border border-outline-variant/30 bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors cursor-pointer font-body"
        >
          Refresh Log
        </button>
      </div>

      {/* Activity Timeline */}
      <div className="max-w-4xl w-full mx-auto p-8 flex-1">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-on-surface-variant font-mono">Loading execution logs...</div>
        ) : runs.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-outline-variant/30 bg-surface-container-low/40 text-center text-on-surface-variant text-xs">
            No agent activity recorded yet. Run a question in Ask PulseDesk to inspect live tool events.
          </div>
        ) : (
          <div className="space-y-6">
            {runs.map((run) => (
              <div
                key={run.run_id}
                className="bg-surface-container-low rounded-2xl hairline-border-strong p-6 shadow-xl space-y-4"
              >
                {/* Run Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                    <span className="font-semibold text-xs text-on-surface font-mono">{run.run_id}</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono">
                      {run.intent || 'workspace_query'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-on-surface-variant font-mono">
                    <span>{run.latency_ms}ms</span>
                    <span>·</span>
                    <span>{new Date(run.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Tool Events */}
                <div>
                  <div className="text-[10px] uppercase font-semibold text-outline tracking-wider mb-2 font-mono">
                    Executed Tool Pipeline ({run.tool_events.length})
                  </div>
                  <div className="space-y-2">
                    {run.tool_events.map((te: any) => (
                      <div
                        key={te.id}
                        className="flex items-start justify-between p-3 rounded-lg bg-surface-container hairline-border text-xs"
                      >
                        <div className="flex items-start gap-2.5">
                          <Terminal className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium text-on-surface">{te.name}</div>
                            {te.output_summary && (
                              <div className="text-[11px] text-on-surface-variant mt-0.5 font-mono">
                                {te.output_summary}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-mono text-outline shrink-0">
                          {te.duration_ms > 0 && <span>{te.duration_ms}ms</span>}
                          <span className="text-tertiary font-semibold uppercase">{te.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Citations generated */}
                {run.citations && run.citations.length > 0 && (
                  <div className="pt-2 border-t border-outline-variant/20 flex items-center gap-2 text-[11px]">
                    <span className="text-outline font-medium font-mono">Verified Citations:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {run.citations.map((c: any) => (
                        <span
                          key={c.id}
                          className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary font-medium text-[10px] font-mono border border-primary-container/30"
                        >
                          {c.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
