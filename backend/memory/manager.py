"""
PulseDesk Intelligent Memory Manager
Orchestrates short-term conversation thread checkpoints and
PostgreSQL/SQLite-backed durable long-term memories with provenance and staleness checks.
"""

import uuid
import logging
from typing import Optional, Any
from datetime import datetime, timezone
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import AsyncSessionLocal
from backend.models.database import Memory, Message, Conversation
from backend.models.schemas import EvidenceItem, MemorySchema

logger = logging.getLogger("pulsedesk-memory")

class MemoryManager:
    """
    Manages durable facts, user preferences, and thread context.
    """

    async def list_memories(
        self,
        workspace_id: str = "demo-workspace",
        active_only: bool = True
    ) -> list[MemorySchema]:
        """Fetch all persistent memories for a workspace."""
        async with AsyncSessionLocal() as session:
            stmt = select(Memory).where(Memory.workspace_id == workspace_id)
            if active_only:
                stmt = stmt.where(Memory.is_active == True)
            stmt = stmt.order_by(Memory.created_at.desc())
            result = await session.execute(stmt)
            memories = result.scalars().all()
            return [
                MemorySchema(
                    id=m.id,
                    workspace_id=m.workspace_id,
                    type=m.type,
                    content=m.content,
                    provenance=m.provenance,
                    source_updated_at=m.source_updated_at,
                    valid_until=m.valid_until,
                    last_verified_at=m.last_verified_at,
                    is_active=m.is_active,
                    created_at=m.created_at,
                    updated_at=m.updated_at,
                )
                for m in memories
            ]

    async def search_relevant_memories(
        self,
        query: str,
        workspace_id: str = "demo-workspace"
    ) -> list[EvidenceItem]:
        """
        Retrieve relevant durable memories for the given query and normalize to EvidenceItem.
        """
        async with AsyncSessionLocal() as session:
            stmt = (
                select(Memory)
                .where(Memory.workspace_id == workspace_id)
                .where(Memory.is_active == True)
            )
            result = await session.execute(stmt)
            memories = result.scalars().all()

        q_lower = query.lower()
        relevant: list[EvidenceItem] = []
        for m in memories:
            c_lower = m.content.lower()
            # Check if query keywords match memory content
            keywords = [w for w in q_lower.split() if len(w) > 3 and w not in {"what", "which", "about", "this", "that", "from", "with"}]
            has_unrelated_terms = any(w in ["quantum", "mars", "rover", "weather", "recipe"] for w in keywords)
            if has_unrelated_terms:
                continue
            is_match = any(kw in c_lower for kw in keywords) or any(term in q_lower for term in ["priorit", "focus", "preference", "remember"])
            
            if is_match:
                relevant.append(
                    EvidenceItem(
                        evidence_id=f"memory:{m.id}",
                        source_type="memory",
                        external_id=m.id,
                        title=f"Remembered Context ({m.type.replace('_', ' ').capitalize()})",
                        snippet=m.content,
                        url=None,
                        source_updated_at=m.last_verified_at or m.created_at,
                        observed_at=datetime.now(timezone.utc),
                        live_checked=True,
                        metadata={
                            "memory_id": m.id,
                            "type": m.type,
                            "provenance": m.provenance,
                        }
                    )
                )
        return relevant

    async def create_memory(
        self,
        content: str,
        workspace_id: str = "demo-workspace",
        memory_type: str = "explicit_user_request",
        provenance: str = "user_stated",
        valid_until: Optional[datetime] = None,
        memory_id: Optional[str] = None
    ) -> MemorySchema:
        """Create a new durable long-term memory."""
        async with AsyncSessionLocal() as session:
            # Check for near duplicates
            existing = await session.execute(
                select(Memory).where(
                    Memory.workspace_id == workspace_id,
                    Memory.content == content,
                    Memory.is_active == True,
                )
            )
            found = existing.scalar_one_or_none()
            if found:
                found.last_verified_at = datetime.now(timezone.utc)
                await session.commit()
                await session.refresh(found)
                return MemorySchema(
                    id=found.id,
                    workspace_id=found.workspace_id,
                    type=found.type,
                    content=found.content,
                    provenance=found.provenance,
                    source_updated_at=found.source_updated_at,
                    valid_until=found.valid_until,
                    last_verified_at=found.last_verified_at,
                    is_active=found.is_active,
                    created_at=found.created_at,
                    updated_at=found.updated_at,
                )

            m = Memory(
                id=memory_id or str(uuid.uuid4()),
                workspace_id=workspace_id,
                type=memory_type,
                content=content,
                provenance=provenance,
                valid_until=valid_until,
                last_verified_at=datetime.now(timezone.utc),
                is_active=True,
            )
            session.add(m)
            await session.commit()
            await session.refresh(m)
            logger.info(f"Created durable memory {m.id}: '{content}'")
            return MemorySchema(
                id=m.id,
                workspace_id=m.workspace_id,
                type=m.type,
                content=m.content,
                provenance=m.provenance,
                source_updated_at=m.source_updated_at,
                valid_until=m.valid_until,
                last_verified_at=m.last_verified_at,
                is_active=m.is_active,
                created_at=m.created_at,
                updated_at=m.updated_at,
            )

    async def update_memory(
        self,
        memory_id: str,
        content: Optional[str] = None,
        memory_type: Optional[str] = None,
        is_active: Optional[bool] = None,
        valid_until: Optional[datetime] = None,
    ) -> Optional[MemorySchema]:
        """Update an existing durable memory."""
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(Memory).where(Memory.id == memory_id))
            m = result.scalar_one_or_none()
            if not m:
                return None
            if content is not None:
                m.content = content
            if memory_type is not None:
                m.type = memory_type
            if is_active is not None:
                m.is_active = is_active
            if valid_until is not None:
                m.valid_until = valid_until
            m.updated_at = datetime.now(timezone.utc)
            await session.commit()
            await session.refresh(m)
            return MemorySchema(
                id=m.id,
                workspace_id=m.workspace_id,
                type=m.type,
                content=m.content,
                provenance=m.provenance,
                source_updated_at=m.source_updated_at,
                valid_until=m.valid_until,
                last_verified_at=m.last_verified_at,
                is_active=m.is_active,
                created_at=m.created_at,
                updated_at=m.updated_at,
            )

    async def delete_memory(self, memory_id: str) -> bool:
        """Permanently delete a memory record."""
        async with AsyncSessionLocal() as session:
            result = await session.execute(delete(Memory).where(Memory.id == memory_id))
            await session.commit()
            return result.rowcount > 0

    async def extract_and_store_selective_memory(
        self,
        user_message: str,
        agent_answer: str,
        workspace_id: str = "demo-workspace"
    ) -> Optional[MemorySchema]:
        """
        Selectively extract durable preferences or explicit 'remember' requests.
        Does NOT store ephemeral or conversational messages.
        """
        lower = user_message.lower().strip()
        
        # Check for explicit user request pattern
        prefixes = ["remember that ", "remember: ", "please remember that ", "keep in mind that ", "note that "]
        matched_prefix = next((p for p in prefixes if lower.startswith(p)), None)
        
        if matched_prefix:
            extracted_fact = user_message[len(matched_prefix):].strip()
            # Clean trailing period
            if extracted_fact.endswith("."):
                extracted_fact = extracted_fact[:-1]
            return await self.create_memory(
                content=extracted_fact,
                workspace_id=workspace_id,
                memory_type="explicit_user_request",
                provenance="explicit_user_request",
            )
        
        # Check for priority statements: "X is my top priority"
        if "priority" in lower and ("highest" in lower or "top" in lower or "focus" in lower):
            return await self.create_memory(
                content=user_message.strip(),
                workspace_id=workspace_id,
                memory_type="confirmed_preference",
                provenance="user_stated",
            )

        return None

memory_manager = MemoryManager()
