# 07 — Implementation Gates: No Paper Features

The purpose of gates is to prevent an Antigravity run from building 50 impressive-looking screens without a working retrieval pipeline.

## Gate A — Working chat
- Backend starts and exposes health/chat endpoints.
- Frontend asks backend, model response actually comes from configured provider.
- Proper errors when API key is absent.
- Clean repository and `.env.example`.
- Screenshot is from running app.

## Gate B — Actual GitHub + MCP
- Authorized or public GitHub source used.
- Custom MCP tool declared on server, discovered/called by actual MCP client.
- A tool call fetches a real issue with its original URL and updated-at.
- Agent graph consumes returned tool result.
- One source-grounded answer is visibly verified.

## Gate C — Retrieval and persistence
- Postgres migrations successful.
- Indexed records have unique source IDs and synchronization timestamps.
- Conversation history survives application restart.
- Long-term memory survives across different conversation threads.
- Memories can be edited/deleted and are scoped to current user/workspace.

## Gate D — Gmail + synthesis
- Setup steps for OAuth documented and manual consent requested.
- After actual account connection, read-only Gmail search works.
- At least one query uses evidence from GitHub and Gmail together.
- If integration absent, UI shows "Not connected" with no mocked success.

## Gate E — Trust and release
- Agent execution trace visible.
- Citation verification and conflict scenario tested.
- Eval fixture suite runs and results published accurately.
- Prompt injection, latency limits, and connector errors tested.
- Responsive UI validated in browser.
- README includes architecture, actual features, demo, setup, measured results, limitations.

## Required ongoing artifact

Maintain `docs/implemented-vs-planned.md` with three columns: Feature, Status (working/partial/planned), Evidence (test command or demo step). Update only after verification.

## Anti-patterns to reject

- MCP only in project name, not in protocol interactions.
- "Persistent memory" implemented only via a frontend state variable.
- "Live" answers derived only from old vector embeddings.
- Citations that aren't backed by retrieved evidence IDs.
- Pretend integrations, synthetic tracing presented as real, fabricated metrics.
- Cross-workspace data leakage or plaintext credential persistence.
