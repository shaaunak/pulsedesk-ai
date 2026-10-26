# 05 — Design Direction & Wireframes

## Visual identity

Mood: *quietly premium, precise, warm, fast*. More like an excellent developer productivity tool than a generic AI startup landing page.

**Palette (starter suggestion, adjust for contrast):**
- Warm canvas `#F7F7F4`
- Paper/primary surface `#FFFFFF`
- Ink `#171C23`
- Secondary text `#667085`
- Borders `#E6E9ED`
- Accent deep teal `#147D72`
- Positive `#218568`; warning `#B66B15`; destructive `#C44F4F`

Typography: Inter or Geist with strong hierarchy; a modest monospaced accent for IDs, timestamps, trace nodes. Support light mode first; dark mode optional after core flows.

Avoid purple-blue glow, random blobby gradients, decorative bots, fake charts, overly rounded cards, or animation that obscures evidence.

## Core screen: intelligence workspace

```text
┌─────────────────────┬────────────────────────────────────┬──────────────────────────┐
│  PULSE DESK         │  Project Alpha / Intelligence      │  EVIDENCE              │
│                     │                                    │                        │
│  + New question     │  What should I focus on?           │  4 sources reviewed    │
│                     │                                    │                        │
│  WORKSPACE          │  Release at risk                   │  [GitHub] Issue #42    │
│  · Ask PulseDesk     │  CI failing; approval pending     │  Updated 2 hours ago   │
│  · Overview         │                                    │  Open original ↗       │
│  · Connections      │  TOP PRIORITIES                    │                        │
│  · Memory           │  1. Fix release CI     [1]         │  [Gmail] Approval mail │
│  · Agent activity   │  2. Get sign-off      [2]          │  Received yesterday    │
│  · Settings         │                                    │  View evidence ↗       │
│                     │  WHAT CHANGED                      │                        │
│  SOURCES            │  1 issue reopened ...  [3]        │  AGENT ACTIVITY        │
│  ● GitHub           │                                    │  ✓ Checked GitHub      │
│  ● Gmail            │  Ask a follow-up...                │  ✓ Searched email      │
│  ○ Notion / later   │  [________________________] Send   │  ✓ Recalled priority   │
└─────────────────────┴────────────────────────────────────┴──────────────────────────┘
```

**Do not make the 3-panel layout mandatory on mobile.** Collapse navigation to a sheet and render evidence/activity in a bottom sheet or tabbed drawer. The middle response must remain pleasant to read.

## Screen 2: connection center

- Compact provider cards with real status: Connected / Setup required / Error / Syncing.
- Show data permissions clearly, read-only scope, last sync/last live check.
- Each connection has configure, reconnect, disconnect and explanatory states.
- Never simulate OAuth authorization as a successful connection.

## Screen 3: memory studio

- Two tabbed views: `Saved facts & preferences` and `Conversation threads`.
- Long-term memory items show source (explicit request, confirmed preference, source-backed fact), modified time and edit/delete.
- Explain when a memory was used in an answer and whether it may be outdated.
- No magical "brain visualization" required; real control is more impressive.

## Screen 4: activity inspector

- Expandable ordered tool run list: query rewrite summary, selected tool, duration, result count, error state, evidence IDs.
- Display actual execution events, never hallucinated agent actions.
- Deep link into LangSmith when configured and allowed.

## Visual excellence acceptance

- Well-crafted empty, loading, partial-data and error states.
- Realistic density: generous whitespace but never huge empty panels.
- Accessible keyboard/focus support; useful hover tooltips; screen reader semantics.
- No lorem ipsum, fake badges, dummy completion metrics, or hardcoded "99% accurate".
- Use tasteful motion only for events that occur: new message, source connected, evidence panel opened.
- Actual clickable citations with hover/source previews.

## Landing page? Later.

Do not waste initial milestone on a flashy marketing site. Make the **working workspace interface** compelling first. A launch/portfolio page is valuable after the real product is demonstrable.
