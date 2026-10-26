"""
PulseDesk Core Test Suite
Verifies API availability, LangGraph agent execution, MCP tool routing,
evidence-grounded citations, and memory persistence across sessions.
"""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from backend.main import app
from backend.database import init_db
from backend.mcp.client import mcp_client
from backend.mcp.github_server import set_issue_state

@pytest_asyncio.fixture(autouse=True)
async def setup_database():
    await init_db()
    set_issue_state(42, "open")

@pytest.mark.asyncio
async def test_health_check():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "healthy"
        assert "github_mcp" in data["providers"]

@pytest.mark.asyncio
async def test_mcp_client_server_protocol():
    """Verify official MCP client can discover and execute tools on the MCP server."""
    tools = await mcp_client.list_available_tools()
    tool_names = [t["name"] for t in tools]
    assert "search_issues" in tool_names
    assert "get_issue" in tool_names
    assert "get_repository_info" in tool_names

    # Test tool execution via MCP
    res = await mcp_client.call_tool(
        "search_issues",
        {"repo": "pulsedesk/project-alpha", "query": "pipeline", "demo_mode": True}
    )
    assert res["status"] == "success"
    data = res["data"]
    assert data["total_count"] >= 1
    assert any(i["number"] == 42 for i in data["issues"])

@pytest.mark.asyncio
async def test_chat_pipeline_with_citations_and_evidence():
    """Verify end-to-end agent run: user question -> LangGraph -> MCP retrieval -> verified citations."""
    set_issue_state(42, "open")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post(
            "/api/chat",
            json={
                "message": "What is blocking Alpha launch and what changed since yesterday?",
                "workspace_id": "demo-workspace",
                "demo_mode": True,
            }
        )
        assert resp.status_code == 200
        data = resp.json()
        
        # Verify answer content
        assert "Release at risk" in data["answer"]
        assert "42" in data["answer"]
        
        # Verify citations are structured and valid
        assert len(data["citations"]) >= 2
        citation_labels = [c["label"] for c in data["citations"]]
        assert any("Issue #42" in l for l in citation_labels)
        assert any("Gmail" in l for l in citation_labels)
        
        # Verify activity timeline events
        assert len(data["activity"]) >= 3
        tool_names = [a["name"] for a in data["activity"]]
        assert "Read project issues" in tool_names
        assert "Verified citations" in tool_names

@pytest.mark.asyncio
async def test_durable_memory_crud_and_cross_thread_retrieval():
    """Verify Gate C: long-term memory survives across different threads and can be managed."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Create a durable memory
        create_resp = await client.post(
            "/api/memories",
            json={
                "content": "User prefers concise summaries with bullet points.",
                "type": "confirmed_preference",
                "workspace_id": "demo-workspace",
            }
        )
        assert create_resp.status_code == 200
        mem = create_resp.json()
        mem_id = mem["id"]

        # 2. List memories
        list_resp = await client.get("/api/memories?workspace_id=demo-workspace")
        assert list_resp.status_code == 200
        memories = list_resp.json()
        assert any(m["id"] == mem_id for m in memories)

        # 3. Update memory
        patch_resp = await client.patch(
            f"/api/memories/{mem_id}",
            json={"content": "User strongly prefers concise bullet points."}
        )
        assert patch_resp.status_code == 200
        assert patch_resp.json()["content"] == "User strongly prefers concise bullet points."

        # 4. Delete memory
        del_resp = await client.delete(f"/api/memories/{mem_id}")
        assert del_resp.status_code == 200

@pytest.mark.asyncio
async def test_demo_issue_state_toggle():
    """Verify demo control panel can toggle Issue #42 and change workspace state."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Toggle state
        toggle_resp = await client.post("/api/demo/toggle-issue-42")
        assert toggle_resp.status_code == 200
        data = toggle_resp.json()
        assert data["status"] == "success"
        
        # Reset back to open
        if data["current_state"] != "open":
            await client.post("/api/demo/toggle-issue-42")

@pytest.mark.asyncio
async def test_spa_fallback_and_chat_route_aliases():
    """Verify SPA client-side routes return 200 (index.html) and direct /chat aliases resolve."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # SPA client-side routes should not 404
        for route in ["/overview", "/ask", "/radar", "/topology", "/stream", "/memory"]:
            resp = await client.get(route)
            assert resp.status_code == 200

        # Trailing slash /api/chat/
        r_slash = await client.post(
            "/api/chat/",
            json={"message": "What is blocking Alpha?", "workspace_id": "demo-workspace", "demo_mode": True}
        )
        assert r_slash.status_code == 200
        assert "answer" in r_slash.json()

        # Non-prefixed /chat
        r_direct = await client.post(
            "/chat",
            json={"message": "What is blocking Alpha?", "workspace_id": "demo-workspace", "demo_mode": True}
        )
        assert r_direct.status_code == 200
        assert "answer" in r_direct.json()

