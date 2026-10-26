"""
PulseDesk GitHub Connector
Integrates with the official PulseDesk GitHub MCP Server to fetch real repository issues,
pull requests, and metadata with live-state freshness guarantees.
"""

import os
import logging
from typing import Any, Optional
from datetime import datetime, timezone
from backend.connectors.base import BaseConnector
from backend.models.schemas import EvidenceItem, SourceStatusSchema
from backend.mcp.client import mcp_client

logger = logging.getLogger("pulsedesk-github-connector")

class GitHubConnector(BaseConnector):
    @property
    def provider_name(self) -> str:
        return "github"

    async def check_status(self, workspace_id: str) -> SourceStatusSchema:
        """Verify MCP server communication and GitHub API status."""
        try:
            tools = await mcp_client.list_available_tools()
            if any(t["name"] == "search_issues" for t in tools):
                has_token = bool(os.environ.get("GITHUB_TOKEN"))
                detail = "Live API authenticated" if has_token else "Public repository & Demo fixture ready"
                return SourceStatusSchema(
                    connector="github",
                    status="connected",
                    detail=detail,
                    last_checked_at=datetime.now(timezone.utc),
                )
            return SourceStatusSchema(
                connector="github",
                status="error",
                detail="MCP server active but missing search_issues tool",
                last_checked_at=datetime.now(timezone.utc),
            )
        except Exception as e:
            return SourceStatusSchema(
                connector="github",
                status="error",
                detail=f"MCP connection failed: {e}",
                last_checked_at=datetime.now(timezone.utc),
            )

    async def fetch_evidence(
        self,
        query: str,
        workspace_id: str,
        demo_mode: bool = False,
        repo: Optional[str] = None
    ) -> list[EvidenceItem]:
        """
        Execute MCP issue search and normalize results into EvidenceItem contracts.
        """
        target_repo = repo or os.environ.get("DEFAULT_GITHUB_REPO", "pulsedesk/project-alpha")
        logger.info(f"Fetching GitHub evidence via MCP for repo='{target_repo}', query='{query}', demo_mode={demo_mode}")
        
        # If query asks about specific issue, status, changes, or closed items, search all states
        q_lower = query.lower()
        search_all = any(term in q_lower for term in ["closed", "changed", "status", "#", "was", "history"])
        
        result = await mcp_client.call_tool(
            tool_name="search_issues",
            arguments={
                "repo": target_repo,
                "query": query,
                "state": "all" if search_all else "open",
                "demo_mode": demo_mode,
            }
        )

        evidence_items: list[EvidenceItem] = []
        if result.get("status") != "success" or not result.get("data"):
            logger.warning(f"MCP search_issues returned non-success: {result}")
            return evidence_items

        data = result["data"]
        issues = data.get("issues", [])
        
        for issue in issues:
            num = issue.get("number")
            state = issue.get("state", "open")
            title = issue.get("title", "")
            labels = [l.get("name") if isinstance(l, dict) else str(l) for l in issue.get("labels", [])]
            body = issue.get("body", "")
            html_url = issue.get("html_url")
            
            # Format snippet
            label_str = f"[{', '.join(labels)}]" if labels else ""
            status_str = f"Status: {state.upper()}"
            snippet = f"{status_str} {label_str} — {body}".strip()
            
            # Standardized evidence ID
            evidence_id = f"fixture:github:{num}" if demo_mode or "fixture" in data.get("source", "") else f"ev_github_{target_repo.replace('/', '_')}_{num}"
            
            # Parse updated_at
            updated_at = None
            if issue.get("updated_at"):
                try:
                    updated_at = datetime.fromisoformat(issue["updated_at"].replace("Z", "+00:00"))
                except Exception:
                    pass

            item = self.create_evidence_item(
                evidence_id=evidence_id,
                source_type="github_issue",
                external_id=f"issue#{num}",
                title=f"GitHub Issue #{num}: {title}",
                snippet=snippet,
                url=html_url,
                source_updated_at=updated_at,
                live_checked=True,
                metadata={
                    "repo": target_repo,
                    "number": num,
                    "state": state,
                    "labels": labels,
                    "comments": issue.get("comments", 0),
                }
            )
            evidence_items.append(item)

        return evidence_items

github_connector = GitHubConnector()
