"""
PulseDesk LangGraph Agent State Definition
Tracks the full stateful trajectory of an agent run through classification,
subtask planning, tool execution, evidence collection, synthesis, and citation verification.
"""

from typing import Annotated, Sequence, Optional, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field
import operator
from backend.models.schemas import EvidenceItem, ToolEventSchema, Subtask, CitationSchema, SourceStatusSchema

def utc_now():
    return datetime.now(timezone.utc)

class AgentState(BaseModel):
    # User input and identifiers
    user_message: str
    conversation_id: str
    workspace_id: str = "demo-workspace"
    demo_mode: bool = True
    
    # Intent and planning
    intent: Optional[str] = None
    subtasks: list[Subtask] = Field(default_factory=list)
    needs_external_evidence: bool = True
    
    # Evidence collection & Tool execution
    evidence: list[EvidenceItem] = Field(default_factory=list)
    tool_events: list[ToolEventSchema] = Field(default_factory=list)
    source_status: list[SourceStatusSchema] = Field(default_factory=list)
    
    # Conflict and freshness evaluation
    conflicts_detected: list[str] = Field(default_factory=list)
    freshness_notes: list[str] = Field(default_factory=list)
    
    # Synthesis & Citations
    raw_answer: Optional[str] = None
    final_answer: Optional[str] = None
    citations: list[CitationSchema] = Field(default_factory=list)
    limitations: list[str] = Field(default_factory=list)
    
    # Memory decision
    extracted_memory_id: Optional[str] = None
    
    # Execution metadata
    run_id: str = ""
    started_at: datetime = Field(default_factory=utc_now)
    latency_ms: int = 0
