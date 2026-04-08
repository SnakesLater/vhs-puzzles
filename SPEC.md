# SPEC.md - Project Specification

**Project Name:** VHS Horror Puzzle Collection
**Type:** Web game (Vanilla JS)
**Status:** Active development
**Last Updated:** 2026-04-06

---

## Overview

A retro horror-themed puzzle game collection that brings classic word games into a chilling VHS aesthetic. Games include Connections, Wordle, Strands, and Letter Boxed - all wrapped in 80s horror VHS tape visuals.

**Repo:** https://github.com/Snakeslater/vhs-puzzles

---

## Core Features

### Implemented ✅
- [x] Connections game - fully functional
- [x] Wordle game - fully functional
- [x] Core VHS systems (effects, tape quality, story renderer)
- [x] Shared systems (CleanupManager, AssetLoader, EventManager)
- [x] VHS aesthetic (CRT scanlines, static, horror theme)

### In Progress ⚠️
- [ ] Strands game - partial implementation (9 TODOs)
- [ ] Unit tests - not yet implemented

### Planned 🚧
- [ ] Letter Boxed game - needs full implementation
- [ ] Spelling Bee - planned
- [ ] Error boundaries - optional

---

## Tech Stack

- **Frontend:** Vanilla JavaScript (ES6+), HTML5 Canvas
- **Styling:** CSS with VHS aesthetic
- **Backend:** Node.js server.js (optional, for local hosting)
- **Linting:** ESLint
- **Testing:** Manual via test-*.html files

### Architecture

```
vhs-puzzles/
├── js/
│   ├── games/           # Game implementations
│   │   ├── base-game.js
│   │   ├── connections.js
│   │   ├── wordle.js
│   │   ├── strands.js    # Partial
│   │   └── letterboxed.js # Not started
│   ├── systems/         # Shared systems
│   │   ├── cleanup-manager.js
│   │   ├── asset-loader.js
│   │   ├── event-manager.js
│   │   ├── tape-quality.js
│   │   ├── story-text-renderer.js
│   │   └── tape-cover-renderer.js
│   ├── vhs-effects.js   # Canvas effects
│   └── main.js          # Entry point
├── css/
├── data/
│   └── puzzles.json
├── assets/
└── index.html
```

---

## Design Language (VHS Aesthetic)

### Core Effects
- CRT scanlines overlay
- Static noise animations
- Chromatic aberration
- Phosphor glow (green/amber text)
- Tape tracking artifacts
- VHS tape quality degradation on mistakes

### Color Palette
- VHS Black: `#0a0a0a`
- VHS White: `#e8e8e8`
- Tracking Red: `#ff2a2a`
- Ghost Blue: `#2a8fff`
- Phosphor Green: `#2aff2a`

### Typography
- Primary: VT323 (retro terminal font)
- Display: Press Start 2P (pixel font)
- Fallback: monospace

---

## Game Specifications

### Connections
- **Status:** ✅ Complete
- **Mechanic:** Link words into 4 categories
- **Categories:** 4 groups of 4 words each
- **Lives:** 4 wrong guesses

### Wordle
- **Status:** ✅ Complete
- **Mechanic:** Guess 5-letter word in 6 tries
- **Feedback:** Green (correct), Yellow (wrong position), Gray (not in word)

### Strands
- **Status:** ⚠️ Partial (~40%)
- **Mechanic:** Connect letters in a grid to form words
- **TODOs:** selectLetter, isAdjacent, validatePath, submitWord, checkWord, highlightFoundWord, updateFoundWords, checkSpangram, showHint

### Letter Boxed
- **Status:** ❌ Not started
- **Mechanic:** Form words using letters from a square
- **File needed:** `js/games/letterboxed.js`

---

## Dependencies

### Production
None (vanilla JS)

### Development
| Package | Purpose |
|---------|---------|
| eslint | Code linting |
| node (optional) | Local server |

---

## Run Commands

```bash
npm install     # Install deps (none needed currently)
npm run lint    # Run ESLint
node server.js  # Start local server
# Open http://localhost:8000
```

---

## Success Criteria
- [x] Connections functional
- [x] Wordle functional
- [ ] Strands complete
- [ ] Letter Boxed implemented
- [ ] VHS aesthetic consistent across games
- [ ] Memory cleanup working
- [ ] No lint errors
