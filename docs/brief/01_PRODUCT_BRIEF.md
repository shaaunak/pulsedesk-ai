# 01 — Product Brief: PulseDesk

## Positioning

**One-liner:** The AI workspace analyst that checks your connected tools, remembers durable priorities, and provides answers with inspectable evidence.

**Tagline:** Your workspace. Connected. Remembered. Understood.

**Primary persona (v1):** A developer or student with one or more GitHub repositories and project-related Gmail messages; wants a daily snapshot of blockers, commitments, updates, and what to do next.

**Secondary persona (later):** A small engineering team with Notion/Jira/GitHub communication spread across systems. Design for this, do **not** imply it works in v1.

## Three jobs to be done

1. **Know what matters:** "Which blockers and commitments affect my highest-priority project?"
2. **Know what changed:** "What changed since my last check, and what is the source of that change?"
3. **Know what to do:** "Give me a grounded list of next steps, ranked by deadline, dependency and user-stated priority."

## Product promise and trust contract

- Cite factual claims with source title, URL/record ID, source and freshness timestamp.
- Distinguish **verified source facts**, **derived interpretation**, and **unknowns**.
- Allow partial answers when integrations fail; label the gap.
- Memory is useful context, never authoritative proof that a live issue is still open.
- Do not present a demo fixture as live data.
- Make it clear which tools were actually called; no fake "thinking" animation.

## The one killer interaction

User: "What's blocking Alpha this week, what changed since yesterday, and what's the next best action?"

Expected UI:
- A short answer with a confidence/freshness note (not a fabricated numerical probability).
- A ranked blocker/action list, each item linked to evidence.
- An expandable evidence drawer showing the exact GitHub issue/email snippets with timestamps.
- A compact, truthful execution timeline (e.g., GitHub issue search → Gmail query → project memory lookup → synthesis).
- Visible source failures/conflicts if any.

## Product differentiators

1. **Evidence-native:** citations are data objects validated before display, not numbered text invented by the model.
2. **Freshness-aware:** direct lookups for current state, cached vectors for semantic discovery, timestamps visible.
3. **Memory you control:** selective writes with provenance; view/edit/delete; previous preferences survive new sessions.
4. **Inspectable actions:** clear summary of called tools, errors and source counts; optional LangSmith deep trace.
5. **Proof-oriented demo:** recruiter can toggle a fixture issue from open→closed and see the system change its answer, or run against a real permitted repository.

## Scope

**Required first:** GitHub read-only, real MCP server/client path, LangGraph bounded graph, citations, persistent thread memory, long-term memory, test fixtures, clean UI.

**Second wave:** Gmail OAuth read-only, ingestion, source freshness, observability, eval suite and deployment.

**Later:** Notion/Jira, multi-user accounts, team controls, supervised write actions.

## Design principle

The product must be useful without explanatory buzzwords. Replace "Autonomous neural intelligence" with "Found 2 open blockers and 1 pending approval".
