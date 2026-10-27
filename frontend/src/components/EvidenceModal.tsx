import React from 'react';
import { X, ExternalLink, Calendar, Database, ShieldCheck, Tag } from 'lucide-react';
import { EvidenceItem } from '../types';

interface EvidenceModalProps {
  evidence: EvidenceItem | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ evidence, onClose }) => {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[10px] uppercase font-semibold text-blue-600 font-mono tracking-wider">
              {evidence.source_type.replace('_', ' ')}
            </span>
            <h3 className="text-sm font-semibold text-slate-900 mt-0.5">{evidence.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs font-sans">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5 tracking-wider font-mono">
              Evidence Content
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
              {evidence.snippet}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[10px] font-semibold uppercase font-mono">Evidence ID</span>
              </div>
              <div className="font-mono text-[11px] text-slate-800 truncate">{evidence.evidence_id}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-[10px] font-semibold uppercase font-mono">Observed At</span>
              </div>
              <div className="text-[11px] text-slate-800 font-mono">{new Date(evidence.observed_at).toLocaleString()}</div>
            </div>
          </div>

          {evidence.metadata && Object.keys(evidence.metadata).length > 0 && (
            <div className="pt-2">
              <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5 tracking-wider font-mono">
                Source Metadata
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(evidence.metadata).map(([k, v]) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-[10px] text-slate-700 border border-slate-200 font-mono"
                  >
                    <Tag className="w-2.5 h-2.5 text-slate-400" />
                    <strong>{k}:</strong> {String(v)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Grounded in verified external API</span>
            </div>

            {evidence.url && (
              <a
                href={evidence.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
              >
                <span>View original source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
