"""
PulseDesk Retrieval & Vector Store Service
Handles document chunking, embeddings generation, vector similarity search,
and hybrid keyword/metadata filtering.
"""

import os
import json
import logging
from typing import Optional, Any
from datetime import datetime, timezone
import numpy as np
from sqlalchemy import select
from backend.database import AsyncSessionLocal
from backend.models.database import SourceDocument, DocumentChunk
from backend.models.schemas import EvidenceItem

logger = logging.getLogger("pulsedesk-retrieval")

def _compute_fallback_embedding(text: str, dim: int = 128) -> list[float]:
    """
    Deterministic pseudo-embedding for testing and offline environments.
    Generates normalized 128-dim vector based on word hash distributions.
    """
    vec = np.zeros(dim, dtype=np.float32)
    words = text.lower().split()
    if not words:
        return vec.tolist()
    for w in words:
        h = hash(w) % dim
        vec[h] += 1.0
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec /= norm
    return vec.tolist()

class VectorStoreService:
    def __init__(self):
        self.openai_key = os.environ.get("OPENAI_API_KEY")

    async def get_embedding(self, text: str) -> list[float]:
        """Generate text embedding using configured provider or deterministic fallback."""
        if self.openai_key:
            try:
                from langchain_openai import OpenAIEmbeddings
                embeddings = OpenAIEmbeddings(
                    model="text-embedding-3-small",
                    api_key=self.openai_key
                )
                return await embeddings.aembed_query(text)
            except Exception as e:
                logger.warning(f"OpenAI embedding generation failed, falling back to local: {e}")
        return _compute_fallback_embedding(text)

    async def index_document(
        self,
        workspace_id: str,
        title: str,
        body: str,
        source_type: str,
        external_id: str,
        url: Optional[str] = None,
        metadata: Optional[dict[str, Any]] = None,
        chunk_size: int = 500,
    ) -> str:
        """
        Store a document and split into indexed chunks with embeddings.
        """
        async with AsyncSessionLocal() as session:
            # Check if document already exists
            stmt = select(SourceDocument).where(
                SourceDocument.workspace_id == workspace_id,
                SourceDocument.source_type == source_type,
                SourceDocument.external_id == external_id,
            )
            existing = (await session.execute(stmt)).scalar_one_or_none()
            if existing:
                doc = existing
                doc.title = title
                doc.body = body
                doc.url = url
                doc.source_updated_at = datetime.now(timezone.utc)
                doc.metadata_json = json.dumps(metadata or {})
            else:
                doc = SourceDocument(
                    workspace_id=workspace_id,
                    source_type=source_type,
                    external_id=external_id,
                    title=title,
                    url=url,
                    body=body,
                    metadata_json=json.dumps(metadata or {}),
                    source_updated_at=datetime.now(timezone.utc),
                )
                session.add(doc)
            
            await session.commit()
            await session.refresh(doc)

            # Simple chunking by character length
            chunks = []
            for i in range(0, len(body), chunk_size):
                chunk_text = body[i:i + chunk_size]
                if chunk_text.strip():
                    emb = await self.get_embedding(chunk_text)
                    chunk_obj = DocumentChunk(
                        document_id=doc.id,
                        chunk_index=len(chunks),
                        content=chunk_text,
                        embedding_json=json.dumps(emb),
                    )
                    chunks.append(chunk_obj)
            
            if chunks:
                session.add_all(chunks)
                await session.commit()
            
            logger.info(f"Indexed document {doc.id} with {len(chunks)} chunks")
            return doc.id

    async def search_evidence(
        self,
        query: str,
        workspace_id: str = "demo-workspace",
        top_k: int = 4
    ) -> list[EvidenceItem]:
        """
        Semantic vector similarity search across indexed documents.
        """
        query_vec = np.array(await self.get_embedding(query), dtype=np.float32)
        async with AsyncSessionLocal() as session:
            stmt = (
                select(DocumentChunk, SourceDocument)
                .join(SourceDocument, DocumentChunk.document_id == SourceDocument.id)
                .where(SourceDocument.workspace_id == workspace_id)
            )
            rows = (await session.execute(stmt)).all()

        scored_results = []
        for chunk, doc in rows:
            if not chunk.embedding_json:
                continue
            emb = np.array(json.loads(chunk.embedding_json), dtype=np.float32)
            # Cosine similarity
            denom = (np.linalg.norm(query_vec) * np.linalg.norm(emb))
            sim = float(np.dot(query_vec, emb) / denom) if denom > 0 else 0.0
            scored_results.append((sim, chunk, doc))

        scored_results.sort(key=lambda x: x[0], reverse=True)
        top_results = scored_results[:top_k]

        evidence_items = []
        for sim, chunk, doc in top_results:
            if sim < 0.1 and len(top_results) > 1:
                continue
            evidence_items.append(
                EvidenceItem(
                    evidence_id=f"rag:{doc.id}:{chunk.chunk_index}",
                    source_type=doc.source_type,
                    external_id=doc.external_id,
                    title=f"{doc.title} (Part {chunk.chunk_index + 1})",
                    snippet=chunk.content,
                    url=doc.url,
                    source_updated_at=doc.source_updated_at,
                    observed_at=doc.observed_at,
                    live_checked=False,  # Retrieved from indexed store, not live API
                    metadata={"document_id": doc.id, "similarity": round(sim, 3)},
                )
            )
        return evidence_items

vector_store_service = VectorStoreService()

