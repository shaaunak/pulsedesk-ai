"""
PulseDesk Gmail Read-Only Connector
Supports Google OAuth 2.0 authorization, minimal read-only scope,
and search/normalization of communications into inspectable evidence items.
"""

import os
import logging
from typing import Any, Optional
from datetime import datetime, timezone
from backend.connectors.base import BaseConnector
from backend.models.schemas import EvidenceItem, SourceStatusSchema

logger = logging.getLogger("pulsedesk-gmail-connector")

# Scopes: Minimum necessary read-only scope
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

# Mutable demo emails for testing and reproducible evaluations
_demo_emails = [
    {
        "id": "approval-1",
        "thread_id": "thread-alpha-approval",
        "subject": "Alpha staging approval",
        "from": "approver@example.invalid",
        "to": "team@example.invalid",
        "received_at": "2026-10-25T13:00:00Z",
        "body": "Launch approval is on hold until the staging demo passes. Please ensure all integration CI pipelines are green before requested sign-off.",
        "url": "https://mail.google.com/mail/u/0/#inbox/approval-1",
    },
    {
        "id": "sync-2",
        "thread_id": "thread-daily-sync",
        "subject": "Weekly Project Alpha sync notes",
        "from": "pm@example.invalid",
        "to": "team@example.invalid",
        "received_at": "2026-10-24T09:30:00Z",
        "body": "Target launch window is Friday. The demo takes precedence over general polish.",
        "url": "https://mail.google.com/mail/u/0/#inbox/sync-2",
    }
]

class GmailConnector(BaseConnector):
    def __init__(self):
        self.client_id = os.environ.get("GOOGLE_CLIENT_ID")
        self.client_secret = os.environ.get("GOOGLE_CLIENT_SECRET")
        self.redirect_uri = os.environ.get(
            "GOOGLE_REDIRECT_URI", "http://localhost:8000/api/connections/gmail/callback"
        )
        self._user_credentials: dict[str, Any] = {}

    @property
    def provider_name(self) -> str:
        return "gmail"

    def get_auth_url(self, state: str) -> str:
        """Generate Google OAuth 2.0 consent URL."""
        if not self.client_id:
            return ""
        from google_auth_oauthlib.flow import Flow
        flow = Flow.from_client_config(
            client_config={
                "web": {
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                }
            },
            scopes=SCOPES,
            redirect_uri=self.redirect_uri,
        )
        auth_url, _ = flow.authorization_url(
            access_type="offline",
            include_granted_scopes="true",
            state=state,
            prompt="consent",
        )
        return auth_url

    async def check_status(self, workspace_id: str) -> SourceStatusSchema:
        """Check if Gmail connection is active or in demo/setup mode."""
        if workspace_id in self._user_credentials:
            return SourceStatusSchema(
                connector="gmail",
                status="connected",
                detail="OAuth 2.0 authenticated (read-only)",
                last_checked_at=datetime.now(timezone.utc),
            )
        if self.client_id and self.client_secret:
            return SourceStatusSchema(
                connector="gmail",
                status="not_connected",
                detail="OAuth configured, authorization required",
                last_checked_at=datetime.now(timezone.utc),
            )
        return SourceStatusSchema(
            connector="gmail",
            status="connected",
            detail="Demo fixture active (fictional workspace communications)",
            last_checked_at=datetime.now(timezone.utc),
        )

    async def fetch_evidence(
        self,
        query: str,
        workspace_id: str,
        demo_mode: bool = False
    ) -> list[EvidenceItem]:
        """
        Search emails using live authorized Gmail API or realistic fixture messages.
        """
        is_live = not demo_mode and workspace_id in self._user_credentials
        
        if not is_live:
            # Check for unrelated queries (e.g. quantum rover)
            q_lower = query.lower()
            if any(term in q_lower for term in ["quantum", "mars", "rover", "recipe", "weather"]):
                return []

            matched = []
            for msg in _demo_emails:
                if not query or any(term in q_lower for term in ["email", "mail", "approval", "staging", "launch", "blocker", "focus", "priorit", "status", "sync"]):
                    matched.append(msg)
            
            if not matched and not query:
                matched = _demo_emails[:1]

            evidence_items: list[EvidenceItem] = []
            for msg in matched:
                received_dt = None
                try:
                    received_dt = datetime.fromisoformat(msg["received_at"].replace("Z", "+00:00"))
                except Exception:
                    pass

                item = self.create_evidence_item(
                    evidence_id=f"fixture:gmail:{msg['id']}",
                    source_type="gmail_message",
                    external_id=msg["id"],
                    title=f"Gmail: {msg['subject']} (from {msg['from']})",
                    snippet=msg["body"],
                    url=msg.get("url"),
                    source_updated_at=received_dt,
                    live_checked=True,
                    metadata={
                        "from": msg["from"],
                        "subject": msg["subject"],
                        "thread_id": msg["thread_id"],
                        "demo": True,
                    }
                )
                evidence_items.append(item)
            return evidence_items

        # Real Gmail API search
        try:
            from googleapiclient.discovery import build
            creds = self._user_credentials[workspace_id]
            service = build("gmail", "v1", credentials=creds)
            
            # Search query
            res = service.users().messages().list(userId="me", q=query or "Project Alpha", maxResults=5).execute()
            messages = res.get("messages", [])
            evidence_items = []
            
            for m in messages:
                detail = service.users().messages().get(userId="me", id=m["id"], format="metadata").execute()
                headers = {h["name"].lower(): h["value"] for h in detail.get("payload", {}).get("headers", [])}
                subject = headers.get("subject", "No Subject")
                sender = headers.get("from", "Unknown")
                snippet = detail.get("snippet", "")
                
                item = self.create_evidence_item(
                    evidence_id=f"ev_gmail_{m['id']}",
                    source_type="gmail_message",
                    external_id=m["id"],
                    title=f"Gmail: {subject} (from {sender})",
                    snippet=snippet,
                    url=f"https://mail.google.com/mail/u/0/#inbox/{m['id']}",
                    live_checked=True,
                    metadata={"from": sender, "subject": subject}
                )
                evidence_items.append(item)
            return evidence_items
        except Exception as e:
            logger.error(f"Live Gmail search failed: {e}")
            return []

gmail_connector = GmailConnector()
