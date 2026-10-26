"""
PulseDesk Base Connector Interface
Defines standard contracts for authorization, resource synchronization,
and evidence normalization.
"""

from abc import ABC, abstractmethod
from typing import Any, Optional
from datetime import datetime, timezone
from backend.models.schemas import EvidenceItem, SourceStatusSchema

class BaseConnector(ABC):
    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Name of the connector provider (e.g., 'github', 'gmail', 'notion')"""
        pass

    @abstractmethod
    async def check_status(self, workspace_id: str) -> SourceStatusSchema:
        """Return the current connectivity status of the connector."""
        pass

    @abstractmethod
    async def fetch_evidence(self, query: str, workspace_id: str, demo_mode: bool = False) -> list[EvidenceItem]:
        """Fetch and normalize relevant evidence from the source."""
        pass

    def create_evidence_item(
        self,
        evidence_id: str,
        source_type: str,
        external_id: str,
        title: str,
        snippet: str,
        url: Optional[str] = None,
        source_updated_at: Optional[datetime] = None,
        live_checked: bool = True,
        metadata: Optional[dict[str, Any]] = None,
    ) -> EvidenceItem:
        """Helper to create a verified evidence item with current timestamp."""
        return EvidenceItem(
            evidence_id=evidence_id,
            source_type=source_type,
            external_id=external_id,
            title=title,
            snippet=snippet,
            url=url,
            source_updated_at=source_updated_at,
            observed_at=datetime.now(timezone.utc),
            live_checked=live_checked,
            metadata=metadata or {},
        )

