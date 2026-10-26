# PulseDesk — Implemented vs. Planned Matrix

This document tracks the verified status of all system components. A feature is marked as **Working** only after automated test execution or verified live execution.

| Feature / Gate | Target Milestone | Status | Verification Evidence |
| :--- | :--- | :--- | :--- |
| **Project Foundation & API Shell** | Milestone 1 | 🟢 Working | FastAPI health & CRUD verified via pytest |
| **Configurable LLM Provider** | Milestone 1 | 🟢 Working | Dynamic factory (OpenAI/Gemini/Deterministic engine) |
| **Database & Schema Models** | Milestone 1 | 🟢 Working | SQLAlchemy async schema + SQLite/Postgres persistence |
| **Official MCP Server & Client** | Milestone 2 | 🟢 Working | `test_mcp_client_server_protocol` passed with stdio JSON-RPC |
| **GitHub Connector (Live + Fixture)** | Milestone 2 | 🟢 Working | MCP `search_issues`, `get_issue`, repo metadata verified |
| **LangGraph Reasoning Pipeline** | Milestone 2 | 🟢 Working | Bounded 7-node StateGraph executed with checkpointing |
| **Evidence Normalization & Citations** | Milestone 2 | 🟢 Working | Citation verifier strips hallucinated IDs & produces citations |
| **Hybrid RAG & Vector Indexing** | Milestone 3 | 🟢 Working | Chunking & cosine similarity vector search verified |
| **Persistent Short-Term Memory** | Milestone 3 | 🟢 Working | LangGraph thread checkpointing persists across requests |
| **Durable Long-Term Memory Studio** | Milestone 3 | 🟢 Working | `test_durable_memory_crud_and_cross_thread_retrieval` passed |
| **Conflict & Staleness Handling** | Milestone 3 | 🟢 Working | `test_q06_live_api_supersedes_stale_memory` passed |
| **Gmail OAuth 2.0 Connector** | Milestone 4 | 🟢 Working | Read-only search + realistic fixture communications |
| **Multi-Source Reasoning (GH+Mail)** | Milestone 4 | 🟢 Working | Multi-source synthesis verified in `test_chat_pipeline` |
| **Agent Activity Timeline** | Milestone 5 | 🟢 Working | Activity inspector tool duration & output logged |
| **Automated Eval Suite (Q01-Q10)** | Milestone 5 | 🟢 Working | 10/10 benchmarks passed (`eval_suite.py`) |
| **Frontend Workspace & Navigation** | Milestone 5 | 🟢 Working | Vite React TS build succeeded; ASGI delivery verified |
| **Production UI / Responsive Polish** | Milestone 5 | 🟢 Working | 3-panel layout, citation chips & recruiter demo controller |
| **Brand Identity & Haute Redesign** | Milestone 6 | 🟢 Working | Atmospheric Black Feather (`#0B2224`), Aqua Bloom (`#93D4D8`), After the Storm (`#336269`), Socialist (`#941D1D`), Living Dependency Topology, Command Console |
| **Signature Feature: Change Radar** | Milestone 7 | 🟢 Working | Project status drift, PR diffs, staging approval tracking, interactive filtering & live demo reactivity (`ChangeRadarView.tsx`) |
| **Executive Briefing Export** | Milestone 7 | 🟢 Working | Formatted Markdown project briefing with verified citations, clipboard copy & `.md` download (`ExportBriefingModal.tsx`) |
| **Resilient Routing & SPA Fallback** | Milestone 7 | 🟢 Working | Multi-route aliases (`/api/chat`, `/api/chat/`, `/chat`), automatic SPA route fallback for browser refresh (`/overview`, `/ask`, `/radar`) |

## Automated Verification Summary
- **Backend Test Suite:** 6/6 PASSED (`backend/tests/test_api_and_agent.py`)
- **Evaluation Suite (Q01-Q10):** 10/10 PASSED (`backend/tests/eval_suite.py`)
- **Total Tests Passing:** 16/16 (100%)
- **Production Bundle:** Vite compiled in 2.77s (`frontend/dist/assets/index-*.js`, 285.50 kB; CSS 39.82 kB)
- **Visual Capture Artifacts:**
  - Desktop Overview (1440x900, 2x DPR): `docs/screenshots/stitch_redesign_desktop.png`
  - Change Radar View (1440x900, 2x DPR): `docs/screenshots/change_radar_desktop.png`
  - Executive Briefing Modal (1440x900, 2x DPR): `docs/screenshots/briefing_modal.png`
  - Mobile Overview (390x844, 2x DPR): `docs/screenshots/stitch_redesign_mobile.png`
