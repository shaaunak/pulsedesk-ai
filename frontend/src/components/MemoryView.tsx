import React, { useState } from 'react';
import {
  Brain,
  Plus,
  Trash2,
  Edit2,
  Check,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
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
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-y-auto pb-32">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto px-6 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Memory Studio</h1>
          <p className="text-sm text-slate-500 mt-1">
            Durable user facts, recorded priorities, and multi-turn conversation checkpoints.
          </p>
        </div>

        {activeTab === 'facts' && (
          <button
            onClick={() => setIsAddingFact(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Durable Fact</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="max-w-6xl w-full mx-auto px-6 pt-1">
        <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('facts')}
            className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'facts'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Saved Facts & Preferences ({memories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('threads')}
            className={`pb-3.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'threads'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Conversation Threads ({conversations.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl w-full mx-auto px-6 py-6 flex-1">
        {activeTab === 'facts' ? (
          <div className="space-y-4">
            {/* Add Fact Form */}
            {isAddingFact && (
              <form
                onSubmit={handleAddSubmit}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3 animate-in fade-in duration-150"
              >
                <div className="text-sm font-semibold text-slate-900">New Durable Memory</div>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="e.g., Project Alpha launch presentation is top priority before Friday."
                  rows={2}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 outline-hidden focus:border-blue-500 focus:bg-white text-slate-800 transition-colors"
                  autoFocus
                />
                <div className="flex items-center justify-between">
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 outline-hidden font-medium"
                  >
                    <option value="explicit_user_request">Explicit User Request</option>
                    <option value="confirmed_preference">Confirmed Preference</option>
                    <option value="time_bound_context">Time-bound Project Context</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingFact(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newContent.trim()}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                    >
                      Save Memory
                    </button>
                  </div>
                </div>
              </form>
            )}

            {memories.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-slate-200 bg-white text-center text-slate-500 text-xs">
                No durable memories recorded yet. Ask the agent to remember something or add one manually above.
              </div>
            ) : (
              memories.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {m.type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Provenance: <strong className="text-slate-700 font-medium">{m.provenance}</strong>
                      </span>
                    </div>

                    {editingId === m.id ? (
                      <div className="space-y-2 mt-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={2}
                          className="w-full text-xs p-2.5 rounded-xl border border-blue-500 outline-hidden bg-slate-50 text-slate-800"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => saveEdit(m.id)}
                            className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-800 leading-relaxed font-normal">{m.content}</div>
                    )}

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-4 text-[11px] text-slate-400">
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
                        className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        title="Edit memory"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteMemory(m.id)}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
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
              <div className="p-8 rounded-2xl border border-dashed border-slate-200 bg-white text-center text-slate-500 text-xs">
                No active conversation threads. Start a question in Ask PulseDesk to create one.
              </div>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectConversation(c.id)}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">{c.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {c.messages.length} messages · Last updated {new Date(c.updated_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                    <span>Resume thread</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
