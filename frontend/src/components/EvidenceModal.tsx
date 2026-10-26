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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-low rounded-2xl max-w-xl w-full hairline-border-strong shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
          <div>
            <span className="text-[10px] uppercase font-semibold text-primary font-mono tracking-wider">
              {evidence.source_type.replace('_', ' ')}
            </span>
            <h3 className="font-headline text-sm font-semibold text-on-surface mt-0.5">{evidence.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs font-body">
          <div>
            <div className="text-[10px] uppercase font-semibold text-outline mb-1.5 tracking-wider font-mono">
              Evidence Content
            </div>
            <div className="p-4 rounded-xl bg-surface-container hairline-border text-on-surface leading-relaxed whitespace-pre-wrap font-sans">
              {evidence.snippet}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-surface-container hairline-border">
              <div className="flex items-center gap-1.5 text-outline mb-1">
                <Database className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-semibold uppercase font-mono">Evidence ID</span>
              </div>
              <div className="font-mono text-[11px] text-on-surface truncate">{evidence.evidence_id}</div>
            </div>

            <div className="p-3 rounded-lg bg-surface-container hairline-border">
              <div className="flex items-center gap-1.5 text-outline mb-1">
                <Calendar className="w-3.5 h-3.5 text-tertiary" />
                <span className="text-[10px] font-semibold uppercase font-mono">Observed At</span>
              </div>
              <div className="text-[11px] text-on-surface font-mono">{new Date(evidence.observed_at).toLocaleString()}</div>
            </div>
          </div>

          {evidence.metadata && Object.keys(evidence.metadata).length > 0 && (
            <div className="pt-2">
              <div className="text-[10px] uppercase font-semibold text-outline mb-1.5 tracking-wider font-mono">
                Source Metadata
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(evidence.metadata).map(([k, v]) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container text-[10px] text-on-surface border border-outline-variant/30 font-mono"
                  >
                    <Tag className="w-2.5 h-2.5 text-primary" />
                    <span className="font-medium text-outline">{k}:</span>
                    <span>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-surface-container-lowest border-t border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-tertiary font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Grounded Evidence</span>
          </div>

          {evidence.url ? (
            <a
              href={evidence.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-inverse-primary transition-colors font-medium text-xs shadow-md font-body"
            >
              <span>Open in {evidence.source_type.includes('github') ? 'GitHub' : 'Gmail'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-[11px] text-outline font-mono">Internal Workspace Record</span>
          )}
        </div>
      </div>
    </div>
  );
};
