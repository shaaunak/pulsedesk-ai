import {
  AgentResponse,
  Conversation,
  Memory,
  Connection,
  DemoState,
} from './types';

const API_BASE = '/api';

export async function sendMessage(
  message: string,
  conversationId?: string,
  demoMode: boolean = true
): Promise<AgentResponse> {
  try {
    const resp = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
        workspace_id: 'demo-workspace',
        demo_mode: demoMode,
      }),
    });
    if (!resp.ok) {
      if (resp.status === 404) {
        throw new Error('PulseDesk AI service endpoint (/api/chat) could not be resolved. Ensure backend is running.');
      }
      const err = await resp.json().catch(() => ({ detail: `Server returned HTTP ${resp.status}` }));
      throw new Error(err.detail || 'Failed to complete agentic synthesis');
    }
    return resp.json();
  } catch (err: any) {
    if (err.message && err.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to PulseDesk backend. Ensure backend is running on http://127.0.0.1:8000.');
    }
    throw err;
  }
}

export async function getConversations(): Promise<Conversation[]> {
  const resp = await fetch(`${API_BASE}/conversations?workspace_id=demo-workspace`);
  if (!resp.ok) throw new Error('Failed to load conversations');
  return resp.json();
}

export async function deleteConversation(id: string): Promise<void> {
  const resp = await fetch(`${API_BASE}/conversations/${id}`, { method: 'DELETE' });
  if (!resp.ok) throw new Error('Failed to delete conversation');
}

export async function getMemories(): Promise<Memory[]> {
  const resp = await fetch(`${API_BASE}/memories?workspace_id=demo-workspace`);
  if (!resp.ok) throw new Error('Failed to load memories');
  return resp.json();
}

export async function createMemory(content: string, type: string = 'explicit_user_request'): Promise<Memory> {
  const resp = await fetch(`${API_BASE}/memories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      type,
      workspace_id: 'demo-workspace',
    }),
  });
  if (!resp.ok) throw new Error('Failed to create memory');
  return resp.json();
}

export async function updateMemory(id: string, updates: Partial<Memory>): Promise<Memory> {
  const resp = await fetch(`${API_BASE}/memories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!resp.ok) throw new Error('Failed to update memory');
  return resp.json();
}

export async function deleteMemory(id: string): Promise<void> {
  const resp = await fetch(`${API_BASE}/memories/${id}`, { method: 'DELETE' });
  if (!resp.ok) throw new Error('Failed to delete memory');
}

export async function getConnections(): Promise<Connection[]> {
  const resp = await fetch(`${API_BASE}/connections?workspace_id=demo-workspace`);
  if (!resp.ok) throw new Error('Failed to load connections');
  return resp.json();
}

export async function toggleConnection(provider: string): Promise<{ provider: string; status: string }> {
  const resp = await fetch(`${API_BASE}/connections/${provider}/toggle?workspace_id=demo-workspace`, {
    method: 'POST',
  });
  if (!resp.ok) throw new Error(`Failed to toggle ${provider}`);
  return resp.json();
}

export async function getRecentActivity(): Promise<any[]> {
  const resp = await fetch(`${API_BASE}/activity?workspace_id=demo-workspace`);
  if (!resp.ok) throw new Error('Failed to load activity');
  return resp.json();
}

export async function getDemoState(): Promise<DemoState> {
  const resp = await fetch(`${API_BASE}/demo/state`);
  if (!resp.ok) throw new Error('Failed to load demo state');
  return resp.json();
}

export async function toggleDemoIssue42(): Promise<any> {
  const resp = await fetch(`${API_BASE}/demo/toggle-issue-42`, { method: 'POST' });
  if (!resp.ok) throw new Error('Failed to toggle demo issue state');
  return resp.json();
}

