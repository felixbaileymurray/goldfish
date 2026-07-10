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
  (AI-disclosure, Community-Feedback, Human-Written-Description) only applies to contributions
  going to `cjpais/Handy`, not self-PRs into this fork's own `main`.
- Every self-PR body includes this verbatim, in its own section:
  > I use Notion to manage an end-to-end research, design and development pipeline. Development
  > is typically executed by Claude Sonnet 5, with Opus 4.8 handling planning and architecture
  > decisions.
- The human description section is Felix's to write — never fabricate his voice; leave a TODO
  placeholder if a section calls for one.
- Pushing to origin and opening PRs are outward-facing actions — always confirm before doing
  them, even though the rest of `/ship` can run unattended.

## Notion mechanics (unchanged by the PR workflow)

- `Date` is a single Notion date-range property. `/build` sets `start` (only if empty) when
  Status moves to In progress; `/ship` sets `end` (only if empty) when Status is confirmed Done.
- `Blocked by` / `Blocking` are Notion's dual relation properties — `/build` won't start a
  ticket with an un-Done blocker; `/ship` reports newly-unblocked tickets after closing one out.
- Tickets get either an `# Implementation Notes` section (filled post-build) or, for
  `Plan / Research`-tagged tickets, a `# Research Notes` section instead. `# Context` is always
  the user's own words — never rewritten.

## Catch-up commits

Work that's already finished (e.g. reconciling history after the fact) can go straight to `main`
without a PR — the PR ceremony is for work in flight, not backfilling done history. See
`docs/decisions.md` if a judgment call like this needs a record.
