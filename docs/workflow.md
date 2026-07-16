# Development workflow

How a ticket moves from a rough idea to shipped code. This is the single source of truth for
the pipeline — `.claude/commands/refine.md`, `build.md`, and `ship.md` implement it in Claude
Code; this doc explains how the pieces fit together and why.

## The pipeline

```
New (draft)
  │  /refine
  ▼
Ready
  │  /build
  │    - resolve branch (own branch, or shared parent branch — see below)
  │    - Status → In progress, Date.start set
  │    - implement + commit on the branch
  ▼
Testing
  │  (user tests manually)
  │  user moves Status → Done in Notion when satisfied
  ▼
Done (Notion)
  │  /ship
  │    - commit any remaining changes on the branch
  │    - Date.end set
  │    - standalone or parent ticket: push branch + open PR (confirm first)
  │    - child ticket: commit only, no push/PR — ships when the parent does
  ▼
PR open (standalone tickets, or once the parent ticket is Done)
  │  /code-review (local, against the PR diff)
  │  fix anything it finds
  ▼
Merge PR into main → delete branch → sync local main
```

Notion status and git state move together but are tracked separately: Notion's `Status` reflects
where the _ticket_ is (New/Ready/In progress/Testing/Done); git branch + PR state reflects where
the _code_ is. A ticket can sit at Notion `Done` for a while before its PR is actually merged —
that's fine, `Done` means "tested and accepted," not "merged."

## Commands & skills

The pipeline is implemented by a set of local Claude Code slash commands plus one tracked skill.
The commands live in `.claude/commands/` — **gitignored**, because they hold the personal Notion
database IDs kept out of version control (see [decisions.md](./decisions.md), 2026-06-01). The
`ticket-writer` skill is tracked in `.claude/skills/`.

| Tool | Type | Does | Status move | Commits? |
| ---- | ---- | ---- | ----------- | -------- |
| `/refine` | command (local) | Turns a New/In Design draft into a buildable Ready story, grounded in the codebase; flags loose parent/child groupings | New → Ready | no |
| `/build` | command (local) | Picks up a Ready ticket, resolves its branch, implements, writes post-build notes | Ready → In progress → Testing | no |
| `/ship` | command (local) | On a ticket the user has moved to Done, commits remaining changes; for standalone/parent tickets pushes + opens the PR (confirm first) | sets `Date.end` | **yes** |
| `/commit` | command | Stages current changes and writes a conventional-commit message | — | yes |
| `ticket-writer` | skill (tracked) | Owns ticket **body prose** only — per-type section templates + style rules; invoked explicitly by `/refine` and `/build`, never `/ship` | — | no |

Ownership split: `ticket-writer` owns body *content*; the commands own ticket *fields* (Status, Date,
Tags, Blocked by/Blocking) and git mechanics. If a new command writes ticket prose, wire it to call
`ticket-writer` the same way rather than duplicating the conventions.

The **human testing gate** is load-bearing: `/build` stops at Testing and never commits; the user
tests in the app and moves the ticket to Done themselves; only then does `/ship` commit. Claude never
marks a ticket Done. The move to Testing must happen at the end of any completed build turn — **even
if `/build` wasn't the entry point** (e.g. the user asked to build something directly).

## Notion backlog conventions

**Workspace & connector.** All goldfish backlog work is in the **`notion-goldfish`** MCP workspace
(tools `mcp__notion-goldfish__API-*`). Never use the generic Notion connector or `notion-mindfuldevices`
— they're authenticated to different workspaces and cannot see this database. If the `notion-goldfish`
tools aren't loaded at session start, wait for MCP servers to finish connecting; as a fallback, reach
the workspace via the Notion REST API with the token from the Claude desktop config
(`~/Library/Application Support/Claude/claude_desktop_config.json`, key `notion-goldfish`). The
database/data-source IDs live in the local `.claude/commands/` files, not in this repo.

**Statuses.** New → In Design → Ready → In progress → Testing → Done, plus Blocked and Descoped.

| Status | Group | Meaning |
| ------ | ----- | ------- |
| New | to do | Unrefined idea |
| In Design | to do | Being designed before dev |
| Ready | to do | Refined; `/build` can pick it up |
| In progress | in progress | Being implemented |
| Testing | in progress | Implementation done; human verifying |
| Blocked | in progress | Waiting on a dependency |
| Done | complete | Human-confirmed; `/ship` commits |
| Descoped | complete | Won't be built |

**Tags** drive the branch prefix (see [Branch naming](#branch-naming)) and signal the kind of work.
Two research-flavoured tags are deliberately distinct:

- **Spike** — a concrete, time-boxed "build-it-to-learn" investigation (install a lib and migrate one
  component to test feasibility; upgrade a dep in a throwaway worktree to see what breaks).
- **Plan / Research** — broader, conceptual planning/research (architecture exploration, scoping,
  comparative analysis) with no single hands-on experiment.

**Ticket bodies** have two parts, and the boundary is strict:

- `# Context` — the user's own words (the ask). **Never rewritten or paraphrased by an agent**, even
  when it contains thinking-aloud ("maybe also…", "inspiration – …").
- `# Implementation Notes` — the agent's post-build notes (what was built, key decisions). On **Plan /
  Research** tickets this heading is `# Research Notes` instead (findings, options, recommendation),
  since nothing is implemented.

Two cautions when building from a ticket:

- A ticket's Acceptance Criteria may have been **drafted by an earlier agent session**, not written by
  Felix — don't treat it as committed spec. Before building a bullet that adds a *new user-facing
  surface* (a new field, list editor, toggle), confirm rather than implementing straight from the text.
  A new surface that closely parallels an existing one is a strong scope-drift signal.
- Prose content and section templates are owned by the `ticket-writer` skill — call it, don't
  reinvent the conventions inline.

## PRs are per revertable unit, not per ticket (2026-07-08)

A PR is the unit that gets reverted if something goes wrong, so it should be the unit that's
actually revertable on its own — not every individual commit. Most tickets are already that unit.
But work organized as a **parent ticket with Sub-items underneath** is different:
the children are only meaningful together, so they share one branch and ship as one PR.

This grouping is a purely structural signal — `Parent item` / `Sub-items` — and is deliberately
**decoupled from Tags**. The `Feature` tag describes what kind of work something is (a
user-facing unit of functionality), not whether it ships as a group. Most parent tickets happen
to be tagged `Feature`, but a multi-stage backend refactor or migration with Sub-items groups the
same way even when it's tagged `Refactor` or something else — keep the tag honest to the work,
and let the Notion structure drive the git mechanics.

**The bar for grouping is cohesion, not category.** A parent+children group is only valid when
the children are coupled tightly enough that none of them makes sense shipped or reverted on its
own — that's true whether the group is a user-facing feature or backend/infra work (a migration,
a multi-stage refactor). If sub-items are only loosely related — bundled under a parent for
organizational convenience, but each could ship and revert independently — they should be
separate standalone tickets instead. This gets checked twice:

- **`/refine`**, whenever a ticket is being given a `Parent item`, or an existing parent's
  Sub-items are being reviewed — flag loose groupings and suggest splitting before marking Ready.
  This is a suggestion, not a hard block; the user decides.
- **`/build`**, before resolving/reusing the shared branch for a child ticket — re-validate the
  grouping still holds, since scope can drift after `/refine`. If it no longer looks cohesive,
  flag it and ask whether to detach the ticket into its own standalone branch instead.

- **Standalone ticket** (no `Parent item`, no Sub-items): unchanged — own branch, own PR, per the
  original per-ticket model below.
- **Child ticket** (`Parent item` is set): implements on the
  _parent's_ branch, not its own. `/build` resolves the parent's branch name and checks it out
  if a sibling already created it, or creates it off `main` if this is the first child touched. If
  the parent is still `New`/`Ready`, `/build` also bumps the parent to `In progress`. At `/ship`
  time, a child ticket just commits onto the shared branch and stops — no push, no PR. The child
  still gets its own `Status`/`Date` transitions for accountability; it just doesn't trigger a ship.
- **Parent ticket** (has Sub-items): the ship trigger. When _you_ manually move the parent's own
  `Status` to `Done` — after judging the children work together as a whole — `/ship` finds it,
  commits any final changes, and pushes + opens the one PR covering the entire branch.
  `/ship` sanity-checks that all Sub-items are themselves `Done` first and flags (doesn't block on)
  any that aren't, since you moved the parent to Done deliberately.

Branch name always derives from the **parent ticket's** title when one exists, never a child's.

## Branch naming

One branch per revertable unit (a standalone ticket, or a parent+children group), created at the
start of `/build`, off `main`. Prefix follows Handy's convention, derived from Tags:

| Tag                                      | Prefix      |
| ---------------------------------------- | ----------- |
| Bug                                      | `fix/`      |
| Feature, Enhancement, UX/UI, Performance | `feat/`     |
| Refactor                                 | `refactor/` |
| Docs                                     | `docs/`     |
| Security / Privacy                       | `fix/`      |
| everything else / mixed                  | `chore/`    |

Slug is a short kebab-case summary of the ticket title (the parent ticket's title, for grouped
work).

## PR mechanics

- `main` = stable/deployable. Build/install the app from it for daily use.
- Base and head are both on `felixbaileymurray/goldfish` (`origin`) — not `upstream`
  (`cjpais/Handy`). `gh` commands need `--repo felixbaileymurray/goldfish` or the correct
  remote context, since `origin` isn't always `gh`'s inferred default.
- Squash-merge, then delete the branch.
- Review is local `/code-review` before merge — no CI reviewer is wired in (declined
  deliberately: cost/secrets, and reviews aren't done by Felix personally anyway).
- Inherited Handy CI (`code-quality.yml`) still runs ESLint/Prettier/translations on every PR —
  free gate, already there.
- PR body is short and honest — the full upstream `PULL_REQUEST_TEMPLATE.md` ceremony
  (issue/PR search checkboxes, Community Feedback, Related Issues/Discussions, Screenshots)
  only applies to contributions going to `cjpais/Handy`, not self-PRs into this fork's own
  `main`. Self-PRs use their own fixed heading structure instead — always these five headings,
  in this order, nothing extra (no "Summary", no "Test plan" checkbox list):

  ```markdown
  ## Description

  [Why this change, in Felix's own words.]

  ## What changed

  - [Bullet list of concrete changes — technical and factual, not a narrative.]

  ## Tickets

  [Link(s) to the Feature Backlog ticket(s) this PR covers. For work that isn't tracked as a
  ticket: "N/A — ad hoc infrastructure patch, not tracked as a Feature Backlog ticket."]

  ## Testing

  - [Bullet list of verification actually performed — commands run and their result, manual
    checks actually done. Not a TODO checklist of things left to verify.]

  ## AI-assisted development approach

  I use Notion to manage an end-to-end research, design and development pipeline. Development
  is typically executed by Claude Sonnet 5, with Opus 4.8 handling planning and architecture
  decisions.
  ```
- `Description` is Felix's own words, never Claude's. Claude asks Felix for this content
  when drafting a self-PR — it does not guess at it or leave a placeholder for later; the
  question is part of opening the PR, same turn.
- Pushing to origin and opening PRs are outward-facing actions — always confirm before doing
  them, even though the rest of `/ship` can run unattended.

## Notion mechanics (unchanged by the PR workflow)

- `Date` is a single Notion date-range property. `/build` sets `start` (only if empty) when
  Status moves to In progress; `/ship` sets `end` (only if empty) when Status is confirmed Done.
- `Blocked by` / `Blocking` are Notion's dual relation properties — `/build` won't start a
  ticket with an un-Done blocker; `/ship` reports newly-unblocked tickets after closing one out.
- Ticket body sections (`# Context`, `# Implementation Notes` / `# Research Notes`) are covered under
  [Notion backlog conventions](#notion-backlog-conventions) above.

## Catch-up commits

Work that's already finished (e.g. reconciling history after the fact) can go straight to `main`
without a PR — the PR ceremony is for work in flight, not backfilling done history. See
`docs/decisions.md` if a judgment call like this needs a record.
