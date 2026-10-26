import React, { useState } from 'react';
import {
  Brain,
  Plus,
  Trash2,
  Edit2,
  Check,
  MessageSquare,
} from 'lucide-react';
import { Memory, Conversation } from '../types';

interface MemoryViewProps {
  memories: Memory[];
  conversations: Conversation[];
  onCreateMemory: (content: string, type: string) => void;
  onUpdateMemory: (id: string, content: string) => void;
  onDeleteMemory: (id: string) => void;
  onSelectConversation: (convId: string) => void;
}

export const MemoryView: React.FC<MemoryViewProps> = ({
  memories,
  conversations,
  onCreateMemory,
  onUpdateMemory,
  onDeleteMemory,
  onSelectConversation,
}) => {
  const [activeTab, setActiveTab] = useState<'facts' | 'threads'>('facts');
  const [isAddingFact, setIsAddingFact] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState('explicit_user_request');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    onCreateMemory(newContent.trim(), newType);
    setNewContent('');
    setIsAddingFact(false);
  };

  const startEdit = (m: Memory) => {
    setEditingId(m.id);
    setEditContent(m.content);
  };

  const saveEdit = (id: string) => {
    if (!editContent.trim()) return;
    onUpdateMemory(id, editContent.trim());
    setEditingId(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto pb-32">
      {/* Top Header */}
      <div className="px-8 py-5 border-b border-outline-variant/20 bg-surface-container-lowest/60 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-on-surface">Memory Studio</h2>
          <p className="font-body text-xs text-on-surface-variant mt-0.5">
            Durable user facts, recorded priorities, and multi-turn conversation checkpoints.
          </p>
        </div>

        {activeTab === 'facts' && (
          <button
            onClick={() => setIsAddingFact(true)}
            className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container hover:bg-inverse-primary transition-colors font-medium text-xs flex items-center gap-1.5 shadow-md font-body cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Durable Fact</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="px-8 pt-4 border-b border-outline-variant/20 bg-surface-container-lowest/30 flex items-center gap-6 text-xs font-medium font-mono">
        <button
          onClick={() => setActiveTab('facts')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'facts'
              ? 'border-primary-container text-primary font-semibold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-sm" data-icon="neurology">
            neurology
          </span>
          <span>Saved Facts & Preferences ({memories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('threads')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'threads'
              ? 'border-primary-container text-primary font-semibold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-sm" data-icon="forum">
            forum
          </span>
          <span>Conversation Threads ({conversations.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl w-full mx-auto p-8 flex-1">
        {activeTab === 'facts' ? (
          <div className="space-y-4">
            {/* Add Fact Form */}
            {isAddingFact && (
              <form
                onSubmit={handleAddSubmit}
                className="bg-surface-container-low rounded-2xl hairline-border-strong p-5 shadow-xl space-y-3 animate-in fade-in duration-150"
              >
                <div className="text-xs font-semibold text-on-surface font-headline">New Durable Memory</div>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="e.g., Remember that Project Alpha launch presentation is top priority before Friday."
                  rows={2}
                  className="w-full text-xs p-3 rounded-lg hairline-border bg-surface-container outline-hidden focus:border-primary-container text-on-surface font-body"
                  autoFocus
                />
                <div className="flex items-center justify-between">
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-lg hairline-border bg-surface-container text-on-surface outline-hidden font-mono"
                  >
                    <option value="explicit_user_request">Explicit User Request</option>
                    <option value="confirmed_preference">Confirmed Preference</option>
                    <option value="time_bound_context">Time-bound Project Context</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingFact(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newContent.trim()}
                      className="px-4 py-1.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-inverse-primary disabled:opacity-50 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Save Memory
                    </button>
                  </div>
                </div>
              </form>
            )}

            {memories.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-outline-variant/30 bg-surface-container-low/40 text-center text-on-surface-variant text-xs">
                No durable memories recorded yet. Ask the agent to remember something or add one manually above.
              </div>
            ) : (
              memories.map((m) => (
                <div
                  key={m.id}
                  className="bg-surface-container-low rounded-2xl hairline-border p-5 shadow-md hover:border-outline-variant/60 transition-all flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-tertiary-container/30 text-tertiary font-mono">
                        {m.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-outline font-mono">
                        Provenance: <strong className="text-on-surface font-normal">{m.provenance}</strong>
                      </span>
                    </div>

                    {editingId === m.id ? (
                      <div className="space-y-2 mt-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={2}
                          className="w-full text-xs p-2.5 rounded-lg border border-primary-container outline-hidden bg-surface-container text-on-surface font-body"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => saveEdit(m.id)}
                            className="px-3 py-1 rounded bg-primary-container text-on-primary-container text-xs font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 rounded bg-surface-container text-on-surface-variant text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-on-surface leading-relaxed font-body">{m.content}</div>
                    )}

                    <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center gap-4 text-[10px] text-outline font-mono">
                      <span>Saved: {new Date(m.created_at).toLocaleDateString()}</span>
                      {m.last_verified_at && (
                        <span>
                          Last verified: {new Date(m.last_verified_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {editingId !== m.id && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(m)}
                        className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                        title="Edit memory"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteMemory(m.id)}
                        className="w-7 h-7 rounded-lg hover:bg-primary-container/20 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                        title="Delete memory"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* Threads tab */
          <div className="space-y-3">
            {conversations.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-outline-variant/30 bg-surface-container-low/40 text-center text-on-surface-variant text-xs">
                No active conversation threads. Start a question in Ask PulseDesk to create one.
              </div>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectConversation(c.id)}
                  className="bg-surface-container-low rounded-xl hairline-border p-4 shadow-md hover:border-primary-container/50 hover:bg-surface-container cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-on-surface font-headline">{c.title}</h4>
                      <p className="text-[10px] text-on-surface-variant mt-0.5 font-mono">
                        {c.messages.length} messages · Last updated {new Date(c.updated_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-primary font-medium font-body">Resume thread →</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
