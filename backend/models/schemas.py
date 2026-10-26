from datetime import datetime, timezone
from typing import Optional, Any
from pydantic import BaseModel, Field

def utc_now():
    return datetime.now(timezone.utc)

# Evidence object contract as defined in 03_AGENT_WORKFLOW.md
class EvidenceItem(BaseModel):
    evidence_id: str
    source_type: str  # github_issue, github_pr, gmail_message, memory, document
    external_id: str
    title: str
    url: Optional[str] = None
    snippet: str
    source_updated_at: Optional[datetime] = None
    observed_at: datetime = Field(default_factory=utc_now)
    live_checked: bool = True
    metadata: dict[str, Any] = Field(default_factory=dict)

# Subtask plan schema as defined in 03_AGENT_WORKFLOW.md
class Subtask(BaseModel):
    id: str
    goal: str
    tool: str
    params: dict[str, Any] = Field(default_factory=dict)

class AgentPlan(BaseModel):
    intent: str
    subtasks: list[Subtask] = Field(default_factory=list)
    allowed_max_tool_calls: int = 8

# Tool event execution log
class ToolEventSchema(BaseModel):
    name: str
    tool: str
    duration_ms: int = 0
    status: str = "success"  # success, error, skipped
    input_summary: Optional[str] = None
    output_summary: Optional[str] = None
    error: Optional[str] = None

# Citation structure
class CitationSchema(BaseModel):
    evidence_id: str
    label: str
    url: Optional[str] = None
    snippet: Optional[str] = None
    source_type: Optional[str] = None

# Source connection status
class SourceStatusSchema(BaseModel):
    connector: str
    status: str  # connected, not_connected, error, syncing
    detail: Optional[str] = None
    last_checked_at: Optional[datetime] = None

# Agent final response structure as defined in 03_AGENT_WORKFLOW.md
class AgentResponse(BaseModel):
    answer: str
    citations: list[CitationSchema] = Field(default_factory=list)
    source_status: list[SourceStatusSchema] = Field(default_factory=list)
    activity: list[ToolEventSchema] = Field(default_factory=list)
    limitations: list[str] = Field(default_factory=list)
    evidence: list[EvidenceItem] = Field(default_factory=list)
    run_id: str
    conversation_id: str
    latency_ms: int = 0

# Chat API request / response
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    workspace_id: str = "demo-workspace"
    demo_mode: bool = True

# Conversation Schemas
class MessageSchema(BaseModel):
    id: str
    role: str
    content: str
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime

class ConversationSchema(BaseModel):
    id: str
    workspace_id: str
    title: str
    created_at: datetime
    updated_at: datetime
    messages: list[MessageSchema] = Field(default_factory=list)

# Memory Schemas
class MemoryCreateRequest(BaseModel):
    content: str
    type: str = "explicit_user_request"  # explicit_user_request, confirmed_preference, time_bound_context, episodic_summary
    provenance: str = "user_stated"
    valid_until: Optional[datetime] = None
    workspace_id: str = "demo-workspace"

class MemoryUpdateRequest(BaseModel):
    content: Optional[str] = None
    type: Optional[str] = None
    is_active: Optional[bool] = None
    valid_until: Optional[datetime] = None

class MemorySchema(BaseModel):
    id: str
    workspace_id: str
    type: str
    content: str
    provenance: str
    source_updated_at: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    last_verified_at: Optional[datetime] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

# Connection Schemas
class ConnectionSchema(BaseModel):
    id: str
    workspace_id: str
    provider: str
    status: str
    config: dict[str, Any] = Field(default_factory=dict)
    last_sync_at: Optional[datetime] = None

# Workspace Schema
class WorkspaceSchema(BaseModel):
    id: str
    display_name: str
    created_at: datetime
