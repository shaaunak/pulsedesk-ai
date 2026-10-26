# ADR 001: PulseDesk Core Architecture Decisions

## Context
PulseDesk is designed as an intelligent AI workspace analyst that connects dynamic external tools (GitHub, Gmail), remembers long-term context across conversations, and produces evidence-grounded answers with inspectable citations.

## Decisions

### 1. LangGraph State Machine Topology
- **Topology**: Cyclic directed graph with bounded iterations (max tool calls = 8).
- **Nodes**:
  - `classify_intent`: Classifies user input into simple conversational vs complex workspace inquiry.
  - `plan_subtasks`: Generates a structured multi-step retrieval plan across connected sources and memory.
  - `execute_tools`: Dispatches parallel tool calls to registered gateways (GitHub MCP, Gmail, Memory Search, Vector RAG) with timeouts and retry logic.
  - `validate_evidence`: Filters duplicate or malformed evidence, computes source freshness, and detects discrepancies.
  - `synthesize_answer`: Generates the response grounded exclusively on normalized evidence IDs.
  - `verify_citations`: Code-level verification that all emitted citation tags match genuine evidence objects belonging to the active workspace.
  - `selective_memory`: Analyzes conversation for durable user preferences or explicit memory requests and persists them.

### 2. Model Context Protocol (MCP) Architecture
- **Transport**: Standard input/output (`stdio`) subprocess transport using the official MCP Python SDK (`mcp`).
- **Server**: PulseDesk GitHub MCP Server (`backend/mcp/github_server.py`) exposing typed tools (`search_issues`, `get_issue`, `get_repository_info`, `search_pull_requests`).
- **Client**: PulseDesk MCP Client Gateway (`backend/mcp/client.py`) managing subprocess lifecycles, JSON-RPC protocol negotiation, session timeouts, and tool schema reflection.

### 3. Database & Hybrid Persistence
- **ORM & Dialect**: SQLAlchemy 2.0 with async engine support.
- **Dialect Portability**: Dual-engine architecture. When `DATABASE_URL` specifies PostgreSQL, native `pgvector` indexing and connection pooling are utilized. When running in constrained environments (such as sandboxed testing or local development without Postgres daemons), SQLite with an in-memory/disk vector cosine-similarity index is transparently activated without changing API or ORM models.
- **Short-Term Memory**: Conversation checkpoints keyed by `thread_id` using LangGraph persistent checkpointer.
- **Long-Term Memory**: Scoped `memory` table keyed by `workspace_id` with metadata for provenance, verification timestamp, and validity horizon.

### 4. Live vs. Cache Retrieval Policy
- **Direct Live API Lookups**: Used for operational states that change frequently (e.g., current open/closed issue state, current branch/PR status, unread email confirmations).
- **Hybrid Vector Search**: Used for semantic discovery over indexed documentation, past message discussions, and historical context.
- **Precedence Rule**: Live API observations always supersede cached embeddings or durable memory facts when determining current status. If sources disagree, both timestamps are presented to the user.

### 5. Untrusted Source Material & Prompt Injection
- Retrieved text from external sources (GitHub issues, comments, emails) is wrapped in data envelopes and treated strictly as untrusted content, never executed as agent instructions.

