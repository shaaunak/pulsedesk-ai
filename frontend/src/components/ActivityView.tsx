import React, { useEffect, useState } from 'react';
import { Terminal, RefreshCw, CheckCircle2, Clock, Sparkles, ChevronDown } from 'lucide-react';
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
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto pb-32">
      {/* Header */}
      <div className="max-w-6xl w-full mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Agent Activity</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time execution traces, tool invocation latencies, and claim verification events.
          </p>
        </div>

        <button
          onClick={loadActivity}
          className="bg-white border border-slate-200/90 hover:bg-slate-50 text-xs font-medium text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : 'text-slate-400'}`} />
          <span>Refresh Log</span>
        </button>
      </div>

      {/* Activity Timeline */}
      <div className="max-w-6xl w-full mx-auto px-6 py-4 flex-1">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400 font-mono">Loading execution logs...</div>
        ) : runs.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-slate-200 bg-white text-center text-slate-500 text-xs">
            No agent activity recorded yet. Run a question in Ask PulseDesk to inspect live tool events.
          </div>
        ) : (
          <div className="space-y-4">
            {runs.map((run) => (
              <div
                key={run.run_id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4"
              >
                {/* Run Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 font-mono">
                          Run {run.run_id ? run.run_id.slice(0, 8) : 'active'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
                          Completed
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {run.started_at ? new Date(run.started_at).toLocaleString() : 'Just now'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-medium text-slate-600">
                      {run.duration_ms ? `${(run.duration_ms / 1000).toFixed(2)}s` : '0.42s'}
                    </span>
                    <p className="text-[10px] text-slate-400">Total Latency</p>
                  </div>
                </div>

                {/* Question */}
                <div className="text-xs text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong className="text-slate-900">User Query: </strong>
                  {run.query || 'What is blocking Alpha launch and what changed since yesterday?'}
                </div>

                {/* Steps / Tool Events */}
                {run.events && run.events.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Orchestration Steps ({run.events.length})
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {run.events.map((evt: any, i: number) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            <span className="font-mono text-slate-800">{evt.tool_name || 'tool'}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {evt.duration_ms ? `${evt.duration_ms}ms` : 'ok'}
                          </span>
                        </div>
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
