# PASTE THIS IN ANTIGRAVITY AFTER THE MAIN MASTER PROMPT

I am providing a PulseDesk architecture and design context pack inside `docs/brief/`.

**Before implementing more code**, read and cross-reference all of the following files:

- `START_HERE.md`
- `01_PRODUCT_BRIEF.md`
- `02_SYSTEM_ARCHITECTURE.md`
- `03_AGENT_WORKFLOW.md`
- `04_DATA_AND_MEMORY.md`
- `05_DESIGN_AND_WIREFRAMES.md`
- `06_DEMO_AND_EVALUATION.md`
- `07_IMPLEMENTATION_GATES.md`
- `diagrams/` (editable DOT and rendered SVG/PNG files)
- `demo_fixture/` (synthetic sample workspace)

Treat these as the product blueprint **together with** the original master prompt. If there is a technical conflict, identify it, choose the safer and more reliable implementation, and record the decision in an ADR instead of silently ignoring the specification.

I want an unusually impressive result, but not by sacrificing functionality for flashy visuals. The project's differentiators are: verified multi-source evidence, real custom MCP tool integration, bounded and observable LangGraph execution, stale-aware persistent memory, and a beautifully designed evidence-first interface.

Your first deliverables:
1. A dependency-aware implementation plan with milestones and verification gates.
2. A concise architecture decision record: graph topology, MCP transport, auth approach, database schema and live-vs-cache policy.
3. The core interface plan for Ask, Connections, Memory and Activity screens.
4. A first working vertical slice: GitHub question → actual MCP call → retrieved evidence → citation-verified answer in the UI.

**Design bar:** Quietly premium, visually distinctive, polished like a top-tier productivity product. Avoid generic AI gradients, glows, fake dashboards and unnecessary 3D. Thoughtful typography, beautiful spacing, interactive source chips, evidence drawer, real activity timeline, subtle loading states and responsive behavior. Build the working app before the marketing landing page.

**Engineering bar:** Real integrations and data persistence, no hardcoded success flows. Explicit separation between live source state, cached retrieval and remembered facts. Never invent citations. Read-only credentials and secure boundaries. Tests and reproducible demo fixtures. Trace real actions; do not expose hidden model chain of thought.

Do not claim features are complete without verifying them. Maintain `docs/implemented-vs-planned.md` with test evidence. Report blockers honestly and continue with independently testable steps if credentials are needed.

Proceed through the implementation gates, verify each milestone, and leave a clean recruiter-friendly README, architecture diagrams, and a truthful demo.
