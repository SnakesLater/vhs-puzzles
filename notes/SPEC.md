# SPEC.md - Project Specification

**Project Name:** VHS Horror Puzzle Collection
**Type:** Web game (Vanilla JS)
**Status:** Active development
**Last Updated:** 2026-04-12

---

## Overview

A retro horror-themed puzzle game collection that brings classic word games into a chilling VHS aesthetic. Games include Connections, Wordle, Strands, and Letter Boxed - all wrapped in 80s horror VHS tape visuals.

**Repo:** https://github.com/Snakeslater/vhs-puzzles

---

## Core Features

### Implemented ✅
- [x] Connections game - fully functional
- [x] Wordle game - fully functional
- [x] Strands game - fully functional
- [x] Letter Boxed game - fully functional
- [x] Spelling Bee game - fully functional
- [x] Core VHS systems (effects, tape quality, story renderer)
- [x] Shared systems (CleanupManager, AssetLoader, EventManager)
- [x] VHS aesthetic (CRT scanlines, static, horror theme)

### Planned 📩
- [ ] Unit tests - not yet implemented
- [ ] GitHub Pages deployment

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
│   │   ├── strands.js
│   │   ├── letter-boxed.js
│   │   └── spelling-bee.js
│   ├── systems/         # Shared systems
│   │   ├── cleanup-manager.js
│   │   ├── asset-loader.js
│   │   ├── event-manager.js
│   │   ├── tape-quality.js
│   │   ├── story-text-renderer.js
│   │   ├── tape-cover-renderer.js
│   │   ├── counter-renderer.js
│   │   ├── puzzle-loader.js
│   │   ├── word-dictionary.js
│   │   └── vhs-tape-renderer.js
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
- **Status:** ✅ Complete
- **Mechanic:** Connect letters in a grid to form words
- **Implementation:** strands.js (360 lines, no TODOs)

### Letter Boxed
- **Status:** ✅ Complete
- **Mechanic:** Form words using letters from a square
- **Implementation:** letter-boxed.js (225 lines)

### Spelling Bee
- **Status:** ✅ Complete
- **Mechanic:** Build words from 7 letters, must include center letter
- **Implementation:** spelling-bee.js (234 lines, ESLint clean)

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
- [x] Strands complete
- [x] Letter Boxed implemented
- [x] Spelling Bee implemented
- [x] VHS aesthetic consistent across games
- [x] Memory cleanup working
- [x] No lint errors (ESLint clean, only harmless unused-var warnings)
