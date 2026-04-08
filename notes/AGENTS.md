# VHS Horror Puzzle Collection

Vanilla JS horror puzzle games with VHS aesthetic.

## Core Commands
• Install: `npm ci`
• Lint: `npm run lint`
• Test: Open test-*.html files
• Server: `node server.js` → http://localhost:8000
• Security: `npm audit`

## Structure
```
vhs-puzzles/
├── js/
│   ├── games/           # Game implementations (see js/games/AGENTS.md)
│   ├── systems/         # Shared systems (see js/systems/AGENTS.md)
│   ├── vhs-effects.js  # Canvas/static effects
│   └── main.js         # Entry point
├── css/                # VHS styling (see css/AGENTS.md)
├── data/puzzles.json   # Puzzle data
└── index.html          # Main page
```

## Subdirectory Knowledge
- [js/games/AGENTS.md](js/games/AGENTS.md) - Game implementations, patterns, TODOs
- [js/systems/AGENTS.md](js/systems/AGENTS.md) - Shared systems conventions
- [css/AGENTS.md](css/AGENTS.md) - VHS aesthetic styling

## Development Patterns
- ES6+ modular architecture
- Use `BaseGame` class for new games
- Use `cleanupManager.addListener()` NOT `element.addEventListener()`
- Use `eventManager.emit()` for game events
- VHS aesthetic preserved across all games
- Canvas optimizations: 60fps → 10fps for static effects

## Git Workflow
1. Branch: `feature/<slug>` or `fix/<slug>`
2. Run `npm run lint` before commit
3. Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
4. Explain why, not just what

## Gotchas
- Letter Boxed game file does NOT exist yet
- Strands game has 9 TODOs in strands.js
- Wordle getFeedbackClass bug: returns 'G' for both green and gray
- Memory cleanup must run on game termination
- VHS tape quality starts at 100 (not random)

## Next Session Tasks
1. Create Letter Boxed implementation
2. Complete Strands game logic (9 TODOs)
3. Set up unit tests directory
4. Add error boundaries if needed
