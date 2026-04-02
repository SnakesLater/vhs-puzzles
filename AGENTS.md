# VHS Horror Puzzle Collection

## Core Commands

• Build: `npm ci` or `npm install`
• Test: Manual via test-connections.html / test-wordle.html
• Lint: `npm run lint`
• Security: `npm audit`

## Architecture Overview

Vanilla JS horror puzzle games with VHS aesthetic.
- `js/games/` - Game implementations (Connections, Wordle, Strands, LetterBoxed)
- `js/systems/` - Shared systems (CleanupManager, AssetLoader, EventManager)
- `js/vhs-effects.js` - Canvas/static effects
- `css/main.css` - VHS styling
- `data/puzzles.json` - Puzzle data
- `js/main.js` - Main entry point

## Development Patterns & Constraints

Coding style
- ES6+ with modular architecture
- Cleanup on game termination (CleanupManager)
- VHS aesthetic preserved
- Canvas optimizations (60fps → 10fps for static)
- Error handling for game crashes

## Git Workflow Essentials

1. Branch from `main` with descriptive name: `feature/<slug>` or `fix/<slug>`
2. Run `npm run lint` before committing
3. Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
4. Commit message should explain why, not just what

## Evidence Required for Every PR

A pull request is reviewable when it includes:
- All linter checks pass (`npm run lint`)
- No new dependencies added
- Diff confined to agreed paths
- Horror theme implementation where applicable
- Performance maintained (canvas redraws, memory cleanup)

## Build & Test

- Build: No build step needed (vanilla JS)
- Test: Manual testing via HTML files
- Lint: `npm run lint`
- Audit: `npm audit`

## Run Locally

Open `index.html` in browser or run:
- Server: `node server.js`
- Open: `http://localhost:8000`

## Conventions

- All game code in `js/games/`
- Systems in `js/systems/`
- CSS in `css/main.css`
- Data in `data/puzzles.json`
- Use `BaseGame` class for new games

## External Services

- VHS tape covers: `js/systems/tape-cover-renderer.js`
- Audio: Fallback formats (ogg, mp3, wav)
- GitLab CI for automated testing

## Security

- No API keys in code
- GitLab token in `.gitlab-token` (gitignored)
- Rotate token periodically
- Enable DroidShield for secret scanning

## Gotchas

- Test snapshot paths are relative
- Canvas redraws can be slow - optimize static effects
- Memory cleanup must run on game termination
- VHS tape quality starts at 100 (not random)
- Letter Boxed game file does NOT exist yet
- Strands game has TODOs that need completion

## AI Team Members

| Agent | Role | Strengths |
|-------|------|-----------|
| Pi | Planning, Documentation, Context | Session continuity, architecture docs |
| Opencode | Code Generation, Implementation | New features, game logic |
| Openclaw | Verification, Security, Debugging | Code review, testing, API validation |
| Droid | Build Automation, Git Ops, State | Git commands, npm audit, build checks |

## AI Task Assignments

### Pi Tasks
- Plan new game architecture
- Write documentation
- Update session notes
- Review codebase state

### Opencode Tasks
- Implement new games (Letter Boxed)
- Complete partial implementations (Strands)
- Write unit tests
- Refactor code
- Performance optimization

### Openclaw Tasks
- Review code for correctness
- Security scanning
- Memory leak detection
- API validation
- Debug assistance

### Droid Tasks
- Git operations (clone, push, commit, PR)
- npm audit and dependency updates
- Build verification (lint, test)
- Asset management (copy, optimize)
- Environment setup (shell scripts)
- State monitoring

## Next Session Tasks

1. Create Letter Boxed implementation (Opencode)
2. Complete Strands game logic (Opencode)
3. Set up unit tests directory
4. Add error boundaries if needed
5. Update AGENTS.md as changes occur

## AI Collaboration Notes

- Not competition, but cooperation
- Each agent has unique strengths
- Droid handles state-awareness tasks
- Opencode handles implementation
- Openclaw handles verification
- Pi handles planning and docs

## Documentation Policy

- Keep AGENTS.md concise (≤150 lines)
- Use concrete commands in backticks
- Update as code changes
- Link to design docs, not duplicate
- One source of truth principle

## Common Workflows

### New Game Implementation

```
1. Pi: Plan architecture and API contract
2. Opencode: Implement game logic
3. Openclaw: Review code
4. Droid: Commit with conventional message
```

### Bug Fix

```
1. Openclaw: Detect and verify bug
2. Opencode: Generate fix
3. Pi: Review architecture impact
4. Droid: Commit if approved
```

### Build Automation

```
Droid handles:
- Git operations
- npm audit
- Build verification
- Asset management
```

## Version

v1.0 - Initial AGENTS.md
