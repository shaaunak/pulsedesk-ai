"""
PulseDesk API Route Handlers
Implements clean REST endpoints for chat, conversations, memory studio,
connection status, activity timeline, and demo toggles.
"""

import time
import uuid
import json
import logging
from typing import Optional, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from backend.database import get_db, AsyncSessionLocal
from backend.models.database import (
    Workspace, Connection, Conversation, Message, AgentRun, ToolEvent, Citation, Memory
)
from backend.models.schemas import (
    ChatRequest, AgentResponse, CitationSchema, ToolEventSchema, SourceStatusSchema,
    EvidenceItem, MemoryCreateRequest, MemoryUpdateRequest, MemorySchema,
    ConnectionSchema, ConversationSchema, MessageSchema
)
from backend.agents.graph import agent_executor
from backend.agents.state import AgentState
from backend.memory.manager import memory_manager
from backend.connectors.github import github_connector
from backend.connectors.gmail import gmail_connector
from backend.mcp.github_server import set_issue_state, get_demo_state

logger = logging.getLogger("pulsedesk-routes")
api_router = APIRouter(prefix="/api")

# ---------------------------------------------------------
# Health Check
# ---------------------------------------------------------
@api_router.get("/health")
@api_router.get("/health/", include_in_schema=False)
async def health_check():
    return {
        "status": "healthy",
        "service": "PulseDesk API",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "providers": {
            "github_mcp": "ready",
            "gmail_connector": "ready",
            "memory_store": "ready",
            "rag_vector_engine": "ready",
        }
    }

# ---------------------------------------------------------
# Core Intelligence Chat
# ---------------------------------------------------------
@api_router.post("/chat", response_model=AgentResponse)
@api_router.post("/chat/", response_model=AgentResponse, include_in_schema=False)
async def chat_endpoint(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    start_time = time.perf_counter()
    workspace_id = request.workspace_id or "demo-workspace"
    
    # 1. Resolve or create Conversation
    conv_id = request.conversation_id
    if not conv_id:
        conv_id = f"conv-{uuid.uuid4().hex[:8]}"
        conv = Conversation(
            id=conv_id,
            workspace_id=workspace_id,
            title=request.message[:40] + ("..." if len(request.message) > 40 else ""),
        )
        db.add(conv)
        await db.commit()
    else:
        conv_res = await db.execute(select(Conversation).where(Conversation.id == conv_id))
        conv = conv_res.scalar_one_or_none()
        if not conv:
            conv = Conversation(
                id=conv_id,
                workspace_id=workspace_id,
                title=request.message[:40] + ("..." if len(request.message) > 40 else ""),
            )
            db.add(conv)
            await db.commit()

    # 2. Persist User Message
    user_msg_id = f"msg-{uuid.uuid4().hex[:8]}"
    user_msg = Message(
        id=user_msg_id,
        conversation_id=conv_id,
        role="user",
        content=request.message,
    )
    db.add(user_msg)
    await db.commit()

    # 3. Build Agent State & Invoke LangGraph
    run_id = f"run-{uuid.uuid4().hex[:8]}"
    initial_state = AgentState(
        user_message=request.message,
        conversation_id=conv_id,
        workspace_id=workspace_id,
        demo_mode=request.demo_mode,
        run_id=run_id,
    )

    try:
        # LangGraph invocation with persistent thread_id for short-term memory
        result_state = await agent_executor.ainvoke(
            initial_state,
            config={"configurable": {"thread_id": conv_id}}
        )
        total_latency = int((time.perf_counter() - start_time) * 1000)

        final_answer = result_state.get("final_answer") or result_state.get("raw_answer") or "No answer produced."
        citations = result_state.get("citations", [])
        tool_events = result_state.get("tool_events", [])
        source_statuses = result_state.get("source_status", [])
        evidence_items = result_state.get("evidence", [])
        limitations = result_state.get("limitations", [])

        # 4. Persist Assistant Message & Agent Run
        assistant_msg = Message(
            id=f"msg-{uuid.uuid4().hex[:8]}",
            conversation_id=conv_id,
            role="assistant",
            content=final_answer,
            metadata_json=json.dumps({
                "run_id": run_id,
                "citations": [c.model_dump() for c in citations],
                "tool_events": [e.model_dump() for e in tool_events],
            })
        )
        db.add(assistant_msg)

        agent_run = AgentRun(
            id=run_id,
            conversation_id=conv_id,
            workspace_id=workspace_id,
            status="success",
            intent=result_state.get("intent", "workspace_query"),
            plan_json=json.dumps([s.model_dump() for s in result_state.get("subtasks", [])]),
            answer=final_answer,
            limitations_json=json.dumps(limitations),
            latency_ms=total_latency,
        )
        db.add(agent_run)

        # Persist Tool Events
        for te in tool_events:
            tool_event_row = ToolEvent(
                id=f"te-{uuid.uuid4().hex[:8]}",
                run_id=run_id,
                tool_name=te.name,
                status=te.status,
                duration_ms=te.duration_ms,
                input_summary=te.input_summary,
                output_summary=te.output_summary,
                error_message=te.error,
            )
            db.add(tool_event_row)

        # Persist Citations
        for c in citations:
            citation_row = Citation(
                id=f"cit-{uuid.uuid4().hex[:8]}",
                run_id=run_id,
                evidence_id=c.evidence_id,
                label=c.label,
                url=c.url,
                snippet=c.snippet,
            )
            db.add(citation_row)

        conv.updated_at = datetime.now(timezone.utc)
        await db.commit()

        return AgentResponse(
            answer=final_answer,
            citations=citations,
            source_status=source_statuses,
            activity=tool_events,
            limitations=limitations,
            evidence=evidence_items,
            run_id=run_id,
            conversation_id=conv_id,
            latency_ms=total_latency,
        )

    except Exception as e:
        logger.error(f"Chat pipeline error: {e}", exc_info=True)
        total_latency = int((time.perf_counter() - start_time) * 1000)
        raise HTTPException(status_code=500, detail=str(e))

# ---------------------------------------------------------
# Conversations
# ---------------------------------------------------------
@api_router.get("/conversations", response_model=list[ConversationSchema])
async def list_conversations(
    workspace_id: str = "demo-workspace",
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Conversation)
        .where(Conversation.workspace_id == workspace_id)
        .order_by(Conversation.updated_at.desc())
    )
    res = await db.execute(stmt)
    convs = res.scalars().all()
    
    out = []
    for c in convs:
        # Load messages
        msg_stmt = select(Message).where(Message.conversation_id == c.id).order_by(Message.created_at.asc())
        msg_res = await db.execute(msg_stmt)
        msgs = msg_res.scalars().all()
        
        out.append(ConversationSchema(
            id=c.id,
            workspace_id=c.workspace_id,
            title=c.title,
            created_at=c.created_at,
            updated_at=c.updated_at,
            messages=[
                MessageSchema(
                    id=m.id,
                    role=m.role,
                    content=m.content,
                    metadata=json.loads(m.metadata_json or "{}"),
                    created_at=m.created_at,
                )
                for m in msgs
            ]
        ))
    return out

@api_router.delete("/conversations/{conv_id}")
async def delete_conversation(conv_id: str, db: AsyncSession = Depends(get_db)):
    stmt = delete(Conversation).where(Conversation.id == conv_id)
    res = await db.execute(stmt)
    await db.commit()
    return {"status": "deleted", "success": res.rowcount > 0}

# ---------------------------------------------------------
# Memory Studio
# ---------------------------------------------------------
@api_router.get("/memories", response_model=list[MemorySchema])
async def list_memories(
    workspace_id: str = "demo-workspace",
    active_only: bool = True
):
    return await memory_manager.list_memories(workspace_id=workspace_id, active_only=active_only)

@api_router.post("/memories", response_model=MemorySchema)
async def create_memory(req: MemoryCreateRequest):
    return await memory_manager.create_memory(
        content=req.content,
        workspace_id=req.workspace_id,
        memory_type=req.type,
        provenance=req.provenance,
        valid_until=req.valid_until,
    )

@api_router.patch("/memories/{memory_id}", response_model=MemorySchema)
async def update_memory(memory_id: str, req: MemoryUpdateRequest):
    updated = await memory_manager.update_memory(
        memory_id=memory_id,
        content=req.content,
        memory_type=req.type,
        is_active=req.is_active,
        valid_until=req.valid_until,
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Memory record not found")
    return updated

@api_router.delete("/memories/{memory_id}")
async def delete_memory(memory_id: str):
    success = await memory_manager.delete_memory(memory_id=memory_id)
    if not success:
        raise HTTPException(status_code=404, detail="Memory record not found")
    return {"status": "deleted", "id": memory_id}

# ---------------------------------------------------------
# Connections Center
# ---------------------------------------------------------
@api_router.get("/connections", response_model=list[ConnectionSchema])
async def list_connections(workspace_id: str = "demo-workspace", db: AsyncSession = Depends(get_db)):
    stmt = select(Connection).where(Connection.workspace_id == workspace_id)
    res = await db.execute(stmt)
    conns = res.scalars().all()
    return [
        ConnectionSchema(
            id=c.id,
            workspace_id=c.workspace_id,
            provider=c.provider,
            status=c.status,
            config=json.loads(c.config_json or "{}"),
            last_sync_at=c.last_sync_at,
        )
        for c in conns
    ]

@api_router.post("/connections/{provider}/toggle")
async def toggle_connection(provider: str, workspace_id: str = "demo-workspace", db: AsyncSession = Depends(get_db)):
    stmt = select(Connection).where(Connection.workspace_id == workspace_id, Connection.provider == provider)
    res = await db.execute(stmt)
    conn = res.scalar_one_or_none()
    if not conn:
        raise HTTPException(status_code=404, detail=f"Connection {provider} not found")
    
    new_status = "not_connected" if conn.status == "connected" else "connected"
    conn.status = new_status
    conn.updated_at = datetime.now(timezone.utc)
    await db.commit()
    return {"provider": provider, "status": new_status}

# ---------------------------------------------------------
# Agent Activity Inspector
# ---------------------------------------------------------
@api_router.get("/activity")
async def get_recent_activity(workspace_id: str = "demo-workspace", limit: int = 15, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(AgentRun)
        .where(AgentRun.workspace_id == workspace_id)
        .order_by(AgentRun.created_at.desc())
        .limit(limit)
    )
    res = await db.execute(stmt)
    runs = res.scalars().all()
    
    activity_timeline = []
    for r in runs:
        te_stmt = select(ToolEvent).where(ToolEvent.run_id == r.id).order_by(ToolEvent.created_at.asc())
        te_res = await db.execute(te_stmt)
        events = te_res.scalars().all()
        
        cit_stmt = select(Citation).where(Citation.run_id == r.id)
        cit_res = await db.execute(cit_stmt)
        cits = cit_res.scalars().all()
        
        activity_timeline.append({
            "run_id": r.id,
            "conversation_id": r.conversation_id,
            "status": r.status,
            "intent": r.intent,
            "latency_ms": r.latency_ms,
            "created_at": r.created_at.isoformat(),
            "tool_events": [
                {
                    "id": te.id,
                    "name": te.tool_name,
                    "status": te.status,
                    "duration_ms": te.duration_ms,
                    "input_summary": te.input_summary,
                    "output_summary": te.output_summary,
                    "error": te.error_message,
                }
                for te in events
            ],
            "citations": [
                {"id": c.id, "evidence_id": c.evidence_id, "label": c.label, "url": c.url}
                for c in cits
            ]
        })
    return activity_timeline

# ---------------------------------------------------------
# Demo Mode Control Panel
# ---------------------------------------------------------
@api_router.get("/demo/state")
async def get_demo_workspace_state():
    state = get_demo_state()
    issue_42 = next((i for i in state.get("issues", []) if i.get("number") == 42), None)
    return {
        "mode": "SYNTHETIC_DEMO_READY",
        "workspace": "Project Alpha",
        "issue_42_state": issue_42.get("state") if issue_42 else "unknown",
        "issue_42_updated_at": issue_42.get("updated_at") if issue_42 else None,
        "total_issues": len(state.get("issues", [])),
        "total_pull_requests": len(state.get("pull_requests", [])),
    }

@api_router.post("/demo/toggle-issue-42")
async def toggle_demo_issue_state():
    state = get_demo_state()
    issue_42 = next((i for i in state.get("issues", []) if i.get("number") == 42), None)
    curr_state = issue_42.get("state") if issue_42 else "open"
    new_state = "closed" if curr_state == "open" else "open"
    updated = set_issue_state(42, new_state)
    return {
        "status": "success",
        "issue_number": 42,
        "previous_state": curr_state,
        "current_state": new_state,
        "updated_at": updated.get("updated_at") if updated else None,
        "message": f"Issue #42 toggled from {curr_state.upper()} to {new_state.upper()}."
    }
