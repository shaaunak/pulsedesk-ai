from datetime import datetime, timezone
import json
import uuid
from typing import Optional, Any
from sqlalchemy import (
    Column,
    String,
    Text,
    DateTime,
    ForeignKey,
    Integer,
    Boolean,
    Float,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    display_name = Column(String(255), nullable=False, default="Project Alpha")
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    connections = relationship("Connection", back_populates="workspace", cascade="all, delete-orphan")
    source_documents = relationship("SourceDocument", back_populates="workspace", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="workspace", cascade="all, delete-orphan")
    memories = relationship("Memory", back_populates="workspace", cascade="all, delete-orphan")


class Connection(Base):
    __tablename__ = "connections"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = Column(String(64), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(64), nullable=False)  # github, gmail, notion
    status = Column(String(32), nullable=False, default="not_connected")  # connected, not_connected, error, syncing
    config_json = Column(Text, default="{}")
    last_sync_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)

    workspace = relationship("Workspace", back_populates="connections")
    source_documents = relationship("SourceDocument", back_populates="connection")


class SourceDocument(Base):
    __tablename__ = "source_documents"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = Column(String(64), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    connection_id = Column(String(64), ForeignKey("connections.id", ondelete="SET NULL"), nullable=True)
    source_type = Column(String(64), nullable=False)  # github_issue, github_pr, gmail_message, document
    external_id = Column(String(255), nullable=False)
    title = Column(String(512), nullable=False)
    url = Column(String(1024), nullable=True)
    body = Column(Text, nullable=False)
    metadata_json = Column(Text, default="{}")
    source_updated_at = Column(DateTime(timezone=True), nullable=True)
    observed_at = Column(DateTime(timezone=True), default=get_utc_now)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    workspace = relationship("Workspace", back_populates="source_documents")
    connection = relationship("Connection", back_populates="source_documents")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String(64), ForeignKey("source_documents.id", ondelete="CASCADE"), nullable=False)
    chunk_index = Column(Integer, nullable=False, default=0)
    content = Column(Text, nullable=False)
    embedding_json = Column(Text, nullable=True)  # Store serialized vector embeddings
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    document = relationship("SourceDocument", back_populates="chunks")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = Column(String(64), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False, default="New Conversation")
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)

    workspace = relationship("Workspace", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.created_at")
    runs = relationship("AgentRun", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String(64), ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(32), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    metadata_json = Column(Text, default="{}")
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    conversation = relationship("Conversation", back_populates="messages")


class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String(64), ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False)
    workspace_id = Column(String(64), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(32), nullable=False, default="running")  # running, success, partial, failed
    intent = Column(String(255), nullable=True)
    plan_json = Column(Text, default="{}")
    answer = Column(Text, nullable=True)
    limitations_json = Column(Text, default="[]")
    latency_ms = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    conversation = relationship("Conversation", back_populates="runs")
    tool_events = relationship("ToolEvent", back_populates="run", cascade="all, delete-orphan")
    citations = relationship("Citation", back_populates="run", cascade="all, delete-orphan")


class ToolEvent(Base):
    __tablename__ = "tool_events"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    run_id = Column(String(64), ForeignKey("agent_runs.id", ondelete="CASCADE"), nullable=False)
    tool_name = Column(String(128), nullable=False)
    status = Column(String(32), nullable=False, default="success")  # success, error, skipped
    duration_ms = Column(Integer, default=0)
    input_summary = Column(Text, nullable=True)
    output_summary = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    run = relationship("AgentRun", back_populates="tool_events")


class Citation(Base):
    __tablename__ = "citations"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    run_id = Column(String(64), ForeignKey("agent_runs.id", ondelete="CASCADE"), nullable=False)
    source_document_id = Column(String(64), ForeignKey("source_documents.id", ondelete="SET NULL"), nullable=True)
    evidence_id = Column(String(128), nullable=False)
    label = Column(String(255), nullable=False)
    url = Column(String(1024), nullable=True)
    snippet = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    run = relationship("AgentRun", back_populates="citations")


class Memory(Base):
    __tablename__ = "memories"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = Column(String(64), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(64), nullable=False, default="explicit_user_request")  # explicit_user_request, confirmed_preference, time_bound_context, episodic_summary
    content = Column(Text, nullable=False)
    provenance = Column(String(255), default="user_stated")  # explicit_user_request, inferred, conversation_thread
    source_updated_at = Column(DateTime(timezone=True), nullable=True)
    valid_until = Column(DateTime(timezone=True), nullable=True)
    last_verified_at = Column(DateTime(timezone=True), default=get_utc_now)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)

    workspace = relationship("Workspace", back_populates="memories")


class HistoricalSnapshot(Base):
    __tablename__ = "historical_snapshots"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = Column(String(64), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    source_id = Column(String(128), nullable=False)
    state = Column(String(64), nullable=False)  # open, closed, pending, etc.
    observed_at = Column(DateTime(timezone=True), default=get_utc_now)

