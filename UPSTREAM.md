# Upstream sync

Goldfish is forked from [cjpais/Handy](https://github.com/cjpais/Handy). This file
tracks the merge baseline with upstream so engine improvements and bugfixes can
be pulled in without losing track of what's ours vs. theirs.

For the broader strategy see [docs/fork-strategy.md](docs/fork-strategy.md).

## Remotes

```bash
origin    https://github.com/felixbaileymurray/goldfish.git
upstream  https://github.com/cjpais/Handy.git
```

If `upstream` is missing on a fresh clone:

```bash
git remote add upstream https://github.com/cjpais/Handy.git
git fetch upstream
```

## Direction: pull-only

The link to upstream is **one-way (Handy → Goldfish)**. Goldfish pulls engine and stability fixes
from `cjpais/Handy` and contributes nothing back — never open PRs or issues against upstream.

## Branch model

Single `main` for now. What's Goldfish's vs. upstream's is distinguished by **layer** (engine vs.
product), not by directory or branch — see [docs/fork-strategy.md](docs/fork-strategy.md). Switch to
a two-branch model (`upstream-sync` + `goldfish`) only if an upstream merge breaks something and we
need to ship a Goldfish-only fix without pulling in whatever else upstream changed. (Contributing
fixes back upstream is *not* a trigger — the fork is pull-only.)

## Merge workflow (single-main)

```bash
git fetch upstream
git checkout main
git merge upstream/main
# resolve, then:
bun install        # if package.json changed
bun run lint
bun run tauri build   # smoke test the engine
```

Then update the **Merge log** below with the new upstream SHA + date.

Files where conflicts are most likely:

- `src-tauri/tauri.conf.json` (once product identity diverges)
- `src-tauri/src/lib.rs` (one-line `goldfish::register(...)` hook)
- `src/App.tsx`, sidebar composition

Files that almost always merge cleanly:

- `src-tauri/src/audio_toolkit/**`
- `src-tauri/src/managers/**`
- `src-tauri/src/transcription_coordinator.rs`

## Goldfish divergences to watch

Step-changes from upstream that raise merge-conflict or behavioural-drift risk.
Review these when pulling from `upstream/main`.

- **Post-processing promoted out of experimental (2026-05-30).** Upstream Handy
  keeps LLM post-processing behind the Experimental toggle. Goldfish now treats
  it as a first-class feature: the enable toggle lives in Advanced → Processing
  (not Experimental) and is available to all users, though still **off by
  default**. If upstream changes the post-process settings/UI, expect conflicts
  in `src/components/settings/advanced/AdvancedSettings.tsx` and the
  post-process settings components.
- **Summarisation & actions pipeline (2026-05-30, Goldfish-only).** A new
  stage-3 step (cleaned transcript → structured summary + action items) that
  does not exist upstream. Shares the post-process provider + API key; only the
  model and prompt are independent. Touches `settings.rs`, `managers/history.rs`
  (new columns + `ActionItem`), `summarize.rs` (new), `actions.rs` (background
  spawn), `shortcut/mod.rs`, `commands/history.rs`, and the bindings. Off by
  default. Purely additive, so upstream merges should rarely conflict here.

## Merge log

| Date       | Upstream SHA | Notes                                                                                                                                          |
| ---------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-19 | `e3206aa`    | Baseline. `upstream` remote added, fetched. No merge needed — `main` is at upstream HEAD plus 3 local commits (fork docs + macOS build fixes). |
