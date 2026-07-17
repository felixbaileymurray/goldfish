# CLAUDE.md

Orientation for AI coding assistants working in this repo. Read this first, then `@AGENTS.md`.

## What this is

**Goldfish** is a desktop speech-to-text product built on the technical foundation of
[Handy](https://github.com/cjpais/Handy). It began as a fork of Handy and still reuses Handy's
engine (audio capture, VAD, `transcribe-rs`, model downloads, the paste pipeline), but it is its
own product with its own pipeline, persistence model, and UI — not a rebrand of Handy.

## The one-way rule (Handy → Goldfish only)

The relationship with upstream Handy is **pull-only**. Goldfish takes engine and stability fixes
_from_ Handy; nothing ever flows _back_. Treat `cjpais/Handy` as a read-only source, never a target.

Concretely, when working here you must **never**:

- open pull requests or issues against `cjpais/Handy`;
- keep code "upstream-compatible" or shape a change so it could be contributed back — that is a
  non-goal, and "will this merge back cleanly?" is never a reason to do anything;
- follow Handy's contribution etiquette (feature freeze, community-feedback-before-PR, their
  issue/PR templates). None of it applies.

All PRs, issues, and reviews happen inside `felixbaileymurray/goldfish` only. See
[docs/fork-strategy.md](docs/fork-strategy.md) for how the fork is kept mergeable (isolation by
layer, not by directory) and [UPSTREAM.md](UPSTREAM.md) for the pull-only merge workflow.

## Where to look

- **[AGENTS.md](AGENTS.md)** — build/dev commands, architecture, code style, i18n, CLI params, platform notes.
- **[docs/README.md](docs/README.md)** — index for `docs/`: workflow, fork strategy, codebase overview, decision log.
- **[docs/workflow.md](docs/workflow.md)** — the Notion → branch-per-ticket → PR-into-own-`main` pipeline (`/refine`, `/build`, `/ship`).
- **[docs/decisions.md](docs/decisions.md)** — why the product is shaped the way it is; read before proposing anything structural.
- **Agent memory** — durable, non-obvious project facts and working preferences; consult it for context this repo doesn't record.

## Gotchas worth knowing up front

- **Active work: the Astryx design-system migration.** UI work should use Astryx components — check
  Astryx's own docs / design-system reference before building a settings surface, and don't
  hand-roll primitives.
- **Verify with `bun run build`, not the Vite preview** — the preview renders blank in this project.
- **The user tests UI manually.** Don't block on trying to drive the UI yourself to confirm a fix.
- **Naming: "post-processing" in code is "Clean" in the UI.** The capture flow has Dictate/Keep
  modes and an always-on Clean stage — see [docs/decisions.md](docs/decisions.md).
