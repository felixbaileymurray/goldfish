# AGENTS.md

This file provides guidance to AI coding assistants working with code in this repository.

> **Read [CLAUDE.md](CLAUDE.md) first.** This is **Goldfish**, a product built on Handy's engine —
> not Handy itself. The fork relationship is **pull-only (Handy → Goldfish)**: never open PRs or
> issues against `cjpais/Handy`, never keep code upstream-compatible, and never apply Handy's
> contribution etiquette. All work stays in `felixbaileymurray/goldfish`.

## Development Commands

**Prerequisites:**

- [Rust](https://rustup.rs/) (latest stable)
- [Bun](https://bun.sh/) package manager

**Core Development:**

```bash
# Install dependencies
bun install

# Run in development mode
bun run tauri dev
# On macOS, `bun run tauri` is wired to scripts/tauri.sh, which handles
# CMake 4.x policy compatibility, Apple SDK env vars, and resolving an
# arm64 node binary (sidestepping Bun's x64 node shim). No manual
# CMAKE_POLICY_VERSION_MINIMUM prefix is needed on this fork.

# Build for production
bun run tauri build

# Frontend only development
bun run dev        # Start Vite dev server
bun run build      # Build frontend (TypeScript + Vite)
bun run preview    # Preview built frontend
```

**Linting and Formatting (run before committing):**

```bash
bun run lint              # ESLint for frontend
bun run lint:fix          # ESLint with auto-fix
bun run format            # Prettier + cargo fmt
bun run format:check      # Check formatting without changes
bun run format:frontend   # Prettier only
bun run format:backend    # cargo fmt only
```

**Model Setup (Required for Development):**

```bash
mkdir -p src-tauri/resources/models
curl -o src-tauri/resources/models/silero_vad_v4.onnx https://blob.handy.computer/silero_vad_v4.onnx
```

For detailed platform-specific build setup, see [BUILD.md](BUILD.md).

## Architecture Overview

Goldfish is a cross-platform desktop speech-to-text application built with Tauri 2.x (Rust backend + React/TypeScript frontend). It reuses Handy's engine (audio capture, VAD, `transcribe-rs`, model downloads, paste pipeline) and adds its own capture pipeline (Dictate/Keep modes, an always-on Clean stage), persistence model, summarisation, and Astryx-based UI on top. The architecture below is the shared foundation; see [docs/fork-strategy.md](docs/fork-strategy.md) for which layers are Goldfish's own versus pulled from upstream.

### Backend Structure (src-tauri/src/)

- `lib.rs` - Main entry point, Tauri setup, manager initialization
- `managers/` - Core business logic:
  - `audio.rs` - Audio recording and device management
  - `model.rs` - Model downloading and management
  - `transcription.rs` - Speech-to-text processing pipeline
  - `history.rs` - Transcription history storage
- `audio_toolkit/` - Low-level audio processing:
  - `audio/` - Device enumeration, recording, resampling
  - `vad/` - Voice Activity Detection (Silero VAD)
- `commands/` - Tauri command handlers for frontend communication
- `cli.rs` - CLI argument definitions (clap derive)
- `shortcut.rs` - Global keyboard shortcut handling
- `settings.rs` - Application settings management
- `overlay.rs` - Recording overlay window (platform-specific)
- `signal_handle.rs` - `send_transcription_input()` reusable function
- `utils.rs` - Platform detection helpers

### Frontend Structure (src/)

- `App.tsx` - Main component with onboarding flow
- `components/` - React UI components:
  - `settings/` - Settings UI
  - `model-selector/` - Model management interface
  - `onboarding/` - First-run experience
  - `overlay/` - Recording overlay UI
  - `update-checker/` - App update notifications
  - `shared/`, `ui/`, `icons/`, `footer/` - Shared components
- `hooks/useSettings.ts` - Settings state management hook
- `stores/settingsStore.ts` - Zustand store for settings
- `bindings.ts` - Auto-generated Tauri type bindings (via tauri-specta)
- `overlay/` - Recording overlay window entry point
- `lib/types.ts` - Shared TypeScript type definitions

### Key Architecture Patterns

**Manager Pattern:** Core functionality organized into managers (Audio, Model, Transcription) initialized at startup and managed via Tauri state.

**Command-Event Architecture:** Frontend → Backend via Tauri commands; Backend → Frontend via events.

**Pipeline Processing:** Audio → VAD → Whisper/Parakeet → Text output → Clipboard/Paste

**State Flow:** Zustand → Tauri Command → Rust State → Persistence (tauri-plugin-store)

### Technology Stack

**Core Libraries:**

- `whisper-rs` - Local Whisper inference with GPU acceleration
- `cpal` - Cross-platform audio I/O
- `vad-rs` - Voice Activity Detection
- `rdev` - Global keyboard shortcuts
- `rubato` - Audio resampling
- `rodio` - Audio playback for feedback sounds

### Application Flow

1. **Initialization:** App starts minimized to tray, loads settings, initializes managers
2. **Model Setup:** First-run downloads preferred Whisper model (Small/Medium/Turbo/Large)
3. **Recording:** Global shortcut triggers audio recording with VAD filtering
4. **Processing:** Audio sent to Whisper model for transcription
5. **Output:** Text pasted to active application via system clipboard

### Settings System

Settings are stored using Tauri's store plugin with reactive updates:

- Keyboard shortcuts (configurable, supports push-to-talk)
- Audio devices (microphone/output selection)
- Model preferences (Small/Medium/Turbo/Large Whisper variants)
- Audio feedback and translation options

### Single Instance Architecture

The app enforces single instance behavior — launching when already running brings the settings window to front rather than creating a new process. Remote control flags (`--toggle-transcription`, etc.) work by launching a second instance that sends args to the running instance via `tauri_plugin_single_instance`, then exits.

## Internationalization (i18n)

All user-facing strings must use i18next translations. ESLint enforces this (no hardcoded strings in JSX).

**Adding new text:**

1. Add key to `src/i18n/locales/en/translation.json`
2. Use in component: `const { t } = useTranslation(); t('key.path')`

**File structure:**

```
src/i18n/
├── index.ts           # i18n setup
├── languages.ts       # Language metadata
└── locales/
    ├── en/translation.json  # English (source)
    ├── de/, es/, fr/, ja/, ru/, zh/, ...
    └── ...
```

For translation contribution guidelines, see [CONTRIBUTING_TRANSLATIONS.md](CONTRIBUTING_TRANSLATIONS.md).

## Code Style

**Rust:**

- Run `cargo fmt` and `cargo clippy` before committing
- Handle errors explicitly (avoid unwrap in production); use `anyhow::Error` with descriptive
  context messages and the `?` operator
- Prefer `Arc<Mutex<T>>` for shared state in managers; builder pattern for initialization chains
- Log with appropriate levels (`debug!`, `info!`, `eprintln!` for errors)
- Snake_case for functions/variables, PascalCase for types; add doc comments for public APIs
- Separate logical sections with comment blocks: `/* ─────────── */`

**TypeScript/React:**

- Strict TypeScript, avoid `any` types; use `type` imports (`import type { Settings }`)
- Functional components with hooks; `useCallback` for stable function references
- Zod schemas for runtime validation and type inference
- Destructure props with defaults (`disabled = false`); prefer interface aliases for object shapes
- Named imports over default exports; group imports external → internal → relative
- Tailwind CSS for styling; Astryx components for UI (see CLAUDE.md)
- Path aliases: `@/` → `./src/`

**Error handling:**

- Frontend: try/catch with user feedback; roll back optimistic updates on failure
- Backend: `?` with `anyhow` context; log at the appropriate debug level

## CLI Parameters

Handy supports command-line parameters on all platforms for integration with scripts, window managers, and autostart configurations.

**Implementation:** `cli.rs` (definitions), `main.rs` (parsing), `lib.rs` (applying), `signal_handle.rs` (shared logic)

| Flag                     | Description                                                |
| ------------------------ | ---------------------------------------------------------- |
| `--toggle-transcription` | Toggle recording on/off on a running instance              |
| `--toggle-post-process`  | Toggle recording with post-processing on/off               |
| `--cancel`               | Cancel the current operation on a running instance         |
| `--start-hidden`         | Launch without showing the main window (tray icon visible) |
| `--no-tray`              | Launch without system tray (closing window quits the app)  |
| `--debug`                | Enable debug mode with verbose (Trace) logging             |

**Key design decisions:**

- CLI flags are runtime-only overrides — they do NOT modify persisted settings
- Remote control flags work via `tauri_plugin_single_instance`: second instance sends args, then exits
- `send_transcription_input()` in `signal_handle.rs` is shared between signal handlers and CLI

## Debug Mode

Access debug features: `Cmd+Shift+D` (macOS) or `Ctrl+Shift+D` (Windows/Linux)

## Platform Notes

- **macOS**: Metal acceleration, accessibility permissions required for keyboard shortcuts
- **Windows**: Vulkan acceleration, code signing
- **Linux**: OpenBLAS + Vulkan, limited Wayland support, overlay uses GTK layer shell (disable with `HANDY_NO_GTK_LAYER_SHELL=1`)

## Troubleshooting

See the [Troubleshooting](README.md#troubleshooting) section in README.md.

## GitHub workflow for AI coding assistants

This is Felix's personal fork (`felixbaileymurray/goldfish`); `main` here is deployable and PRs merge into it, not into upstream `cjpais/Handy`. Always target `felixbaileymurray/goldfish` explicitly (`gh pr create --repo felixbaileymurray/goldfish ...`) — `gh` defaults to the upstream parent on a fork.

**MANDATORY. Before opening any PR in this repo: you MUST read and follow [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md) exactly.** It has five sections: Description, What changed, Tickets, Testing, AI-assisted development approach.

- **Description is human-written.** Ask Felix for this paragraph before opening or merging the PR — never invent it.
- **What changed** is a bullet list, bold lead-in per bullet.
- **Tickets** lists the Notion Feature Backlog ticket title(s) this PR closes.
- **Testing** lists commands run and what was manually verified.
- **AI-assisted development approach** is a fixed boilerplate paragraph (already in the template) — reuse it verbatim unless the actual dev approach differs.

The upstream Handy conventions this fork inherited (feature-freeze ceremony, community-feedback links, issue templates gated on `cjpais/Handy` Discussions) do not apply here — this is a solo fork, not a contribution to the upstream project.

**Commits:** Use conventional commit prefixes (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`). Focus the message on _why_, not _what_.
