"""
PulseDesk MCP Client Gateway
Manages subprocess lifecycles, JSON-RPC protocol negotiation, session timeouts,
and structured tool execution via official Model Context Protocol (MCP 2.x).
"""

import sys
import os
import json
import logging
from typing import Any, Optional
import asyncio
from mcp.client.stdio import stdio_client, StdioServerParameters
from mcp import ClientSession

logger = logging.getLogger("pulsedesk-mcp-client")

class PulseDeskMCPClient:
    """
    Client gateway for interacting with PulseDesk MCP servers.
    """
    def __init__(self, server_script_path: Optional[str] = None):
        if not server_script_path:
            server_script_path = os.path.join(
                os.path.dirname(__file__), "github_server.py"
            )
        self.server_script_path = server_script_path
        self._python_executable = sys.executable

    def _get_server_params(self) -> StdioServerParameters:
        # Pass current environment (including GITHUB_TOKEN if set)
        env = dict(os.environ)
        return StdioServerParameters(
            command=self._python_executable,
            args=[self.server_script_path],
            env=env
        )

    async def list_available_tools(self) -> list[dict[str, Any]]:
        """List all tools exposed by the MCP server."""
        params = self._get_server_params()
        async with stdio_client(params) as (read_stream, write_stream):
            async with ClientSession(read_stream, write_stream) as session:
                await session.initialize()
                tools_result = await session.list_tools()
                return [
                    {
                        "name": tool.name,
                        "description": tool.description,
                        "input_schema": getattr(tool, "input_schema", getattr(tool, "inputSchema", {})),
                    }
                    for tool in tools_result.tools
                ]

    async def call_tool(self, tool_name: str, arguments: dict[str, Any], timeout_seconds: float = 15.0) -> dict[str, Any]:
        """
        Invoke an MCP tool with structured arguments and timeout safety.
        """
        params = self._get_server_params()
        try:
            async with asyncio.timeout(timeout_seconds):
                async with stdio_client(params) as (read_stream, write_stream):
                    async with ClientSession(read_stream, write_stream) as session:
                        await session.initialize()
                        result = await session.call_tool(tool_name, arguments)
                        
                        # Parse returned content
                        if result.content and len(result.content) > 0:
                            first_block = result.content[0]
                            if hasattr(first_block, "text"):
                                try:
                                    parsed = json.loads(first_block.text)
                                    return {"status": "success", "data": parsed}
                                except json.JSONDecodeError:
                                    return {"status": "success", "data": first_block.text}
                        return {"status": "success", "data": None}
        except asyncio.TimeoutError:
            logger.error(f"MCP tool call '{tool_name}' timed out after {timeout_seconds}s")
            return {"status": "error", "error": f"Tool call timed out after {timeout_seconds}s"}
        except Exception as e:
            logger.error(f"MCP tool call '{tool_name}' failed: {e}")
            return {"status": "error", "error": str(e)}

# Global MCP Client instance
mcp_client = PulseDeskMCPClient()
