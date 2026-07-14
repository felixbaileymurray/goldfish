---
name: ticket-writer
description: >-
  Writing standard for goldfish Feature Backlog ticket bodies in Notion —
  per-type section templates and prose style rules. Call this explicitly
  whenever drafting a new ticket body or writing/updating any section of an
  existing ticket (refining a draft into Ready, or filling in post-build
  notes). Does not cover ticket fields (Status, Date, Tags, Blocked
  by/Blocking) — those are each command's own responsibility.
---

# Ticket writer

Body-content rules for the goldfish Feature Backlog in Notion. This skill owns
prose and section structure only. Field conventions (Status transitions, Date
ranges, Tags, dependencies) live in the calling command, not here.

## Prose style

- Concise. Plain English, non-technical language where possible.
- Prefer bullets over verbose blocks of text.
- Inline code formatting for short code strings; fenced code blocks for
  larger snippets.
- Callouts (red = risk, yellow = issue, blue = key information) are allowed
  but used sparingly — don't reach for one by default.
- Prefer linking to other tickets or pages (`@` mention by page name) over
  restating or rephrasing their content.

## Section templates by type

Every template has a **pre-build** part (written when the ticket becomes
Ready) and a **post-build** part (written after implementation, once Status
moves toward Done). Never touch the user's own `# Context` — it's Felix's,
untouched, always at the top.

### Standard (Feature / Bug / Enhancement / UX-UI / Performance / Refactor / Security)

Pre-build (written by `/refine`):

```
# Context
(untouched — Felix's original draft)

## Refined Summary
(optional — only if the raw draft is genuinely hard to follow)

# Acceptance Criteria
- Observable, checkable bullets.

# Scope
**In:** …
**Out:** …

# Constraints & Affected Areas
(omit if nothing to flag)

# Design
(UX/UI tickets only — Figma link or interaction states. Omit otherwise.)

# Implementation Notes
(leave empty)
```

Post-build (written by `/build` when Status moves to Testing, or when
backdating a Done item): fill `# Implementation Notes` only. State what was
built and key decisions — not a diff narration. Do not touch any other
section.

### Spike (tag: `Spike`)

Same as Standard. Spikes build code to learn something, so findings still go
under `# Implementation Notes` — state what was tried, what was learned, and
the recommendation that follows from it.

### Plan / Research (tag: `Plan / Research`)

Pre-build: same as Standard, minus `# Design` (rarely applies) — Acceptance
Criteria here describe what question the research must answer, not a
shippable feature.

Post-build: heading is `# Research Notes`, **not** `# Implementation Notes` —
nothing is being implemented. Cover: code/system reality as found, options
considered, recommendation, and any decisions still open.

## Scope discipline

Acceptance Criteria drafted in an earlier session are not committed spec —
they can bundle scope the user never actually asked for. Before implementing
a bullet that introduces a _new user-facing surface_ (new field, new list
editor, new toggle) rather than modifying something already backed by the
current conversation, flag it and confirm instead of building it straight
from the ticket text.
