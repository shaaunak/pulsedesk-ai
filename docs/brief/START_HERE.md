# PulseDesk — Architecture & Product Context Pack

**Purpose:** Supplement the main Antigravity master prompt with implementation-grade diagrams, design direction, data contracts, and a demonstrable end-to-end story.

## How to use

1. Copy or unzip this entire folder into the root of the PulseDesk repository under `docs/brief/`.
2. Paste the text of `ANTIGRAVITY_FOLLOWUP_PROMPT.md` into Antigravity **after** your original master prompt.
3. Request a plan that references each document by filename. Review the plan, then authorize incremental implementation.
4. Require Antigravity to keep `docs/implemented-vs-planned.md` current. The diagrams are **target architecture**, not claims that features already work.

## What each file contributes

| File | Why it exists |
| --- | --- |
| `01_PRODUCT_BRIEF.md` | Specific audience, jobs to be done, limits, differentiators |
| `02_SYSTEM_ARCHITECTURE.md` | Components, trust boundaries, live-vs-cache policy, failure handling |
| `03_AGENT_WORKFLOW.md` | Bounded LangGraph flow, tools, evidence and citations |
| `04_DATA_AND_MEMORY.md` | Domain model, ERD, memory rules and privacy |
| `05_DESIGN_AND_WIREFRAMES.md` | Distinctive interface, layout and interaction rules |
| `06_DEMO_AND_EVALUATION.md` | Golden demo, reproducible fixtures, measurable tests |
| `07_IMPLEMENTATION_GATES.md` | Progression and evidence required before claiming success |
| `ANTIGRAVITY_FOLLOWUP_PROMPT.md` | Ready-to-paste follow-up prompt |
| `diagrams/` | Editable DOT sources, SVGs and PNGs for architecture, agent, memory, user journey |
| `demo_fixture/` | Synthetic reproducible demo data, not genuine live data |

## North star

> Ask a cross-source project question. Get a precise answer that can be **verified** from live or correctly timestamped evidence. See which tools were run. Correct a saved memory. Ask again later and see context retained without stale facts overruling live truth.

## Non-goals for first version

- No unsupervised sending emails, editing GitHub issues or changing Jira tasks.
- No pretending personal data or APIs are connected.
- No multi-agent swarm solely for a buzzword.
- No production/SOC2 claims from a local portfolio demo.
- No user-facing raw model chain of thought.

## Helpful primary documentation

- LangGraph persistence: https://docs.langchain.com/oss/python/langgraph/persistence
- MCP Python SDK: https://py.sdk.modelcontextprotocol.io/
- LangSmith tracing: https://docs.langchain.com/langsmith/observability
