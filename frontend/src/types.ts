export interface EvidenceItem {
  evidence_id: string;
  source_type: string;
  external_id: string;
  title: string;
  url?: string | null;
  snippet: string;
  source_updated_at?: string | null;
  observed_at: string;
  live_checked: boolean;
  metadata?: Record<string, any>;
}

export interface Citation {
  evidence_id: string;
  label: string;
  url?: string | null;
  snippet?: string | null;
  source_type?: string | null;
}

export interface ToolEvent {
  name: string;
  tool: string;
  duration_ms: number;
  status: string;
  input_summary?: string | null;
  output_summary?: string | null;
  error?: string | null;
}

export interface SourceStatus {
  connector: string;
  status: string;
  detail?: string | null;
  last_checked_at?: string | null;
}

export interface AgentResponse {
  answer: string;
  citations: Citation[];
  source_status: SourceStatus[];
  activity: ToolEvent[];
  limitations: string[];
  evidence: EvidenceItem[];
  run_id: string;
  conversation_id: string;
  latency_ms: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: {
    citations?: Citation[];
    tool_events?: ToolEvent[];
    run_id?: string;
  };
  created_at: string;
}

export interface Conversation {
  id: string;
  workspace_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
}

export interface Memory {
  id: string;
  workspace_id: string;
  type: string;
  content: string;
  provenance: string;
  source_updated_at?: string | null;
  valid_until?: string | null;
  last_verified_at?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Connection {
  id: string;
  workspace_id: string;
  provider: string;
  status: string;
  config: Record<string, any>;
  last_sync_at?: string | null;
}

export interface DemoState {
  mode: string;
  workspace: string;
  issue_42_state: string;
  issue_42_updated_at?: string | null;
  total_issues: number;
  total_pull_requests: number;
}
