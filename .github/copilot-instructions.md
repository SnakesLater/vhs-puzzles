# VHS Horror Puzzle Collection - AI Coding Agent Instructions

## Project Overview
A browser-based horror-themed puzzle game collection styled as VHS tapes. Combines multiple puzzle types (Connections, Wordle, Strands, Spelling Bee, Letter Boxed) with narrative story campaigns. No external dependencies—vanilla JavaScript and CSS only.

**Tech Stack:** HTML/CSS/JavaScript (ES6+), JSON for data, Python HTTP server for local development

## Architecture Overview

### Three-Tier Navigation Model
```
Main Menu → Mode Selection (Story/Game) → Content Selection
├─ Story Mode: Campaign Selection → Scenes (with narrative)
└─ Game Mode: Difficulty Selection → Game Type Selection → Individual Puzzle
```

### Core Systems (in `js/systems/`)

| System | Purpose | Key Files |
|--------|---------|-----------|
| **EventManager** | Centralized event dispatch for UI interactions | [event-manager.js](../js/systems/event-manager.js) |
| **PuzzleLoader** | Loads JSON data with dual-transport fallback (fetch + XMLHttpRequest) | [puzzle-loader.js](../js/systems/puzzle-loader.js) |
| **VHSTapeRenderer** | Orchestrates UI canvas rendering (uses delegate renderers) | [vhs-tape-renderer.js](../js/systems/vhs-tape-renderer.js) |
| **VHSEffects** | Audio playback (static hum, clicks, victory sounds) | [vhs-effects.js](../js/vhs-effects.js) |
| **StoryTextRenderer** | Typewriter effect and narrative text display | [story-text-renderer.js](../js/systems/story-text-renderer.js) |
| **TapeQuality** | Simulates VHS degradation effect based on "tape quality" slider | [tape-quality.js](../js/systems/tape-quality.js) |
| **CounterRenderer** | Renders animated tape counter reels | [counter-renderer.js](../js/systems/counter-renderer.js) |
| **TapeCoverRenderer** | Renders individual tape cover art (delegates) | [tape-cover-renderer.js](../js/systems/tape-cover-renderer.js) |

### Data Flow
1. **Entry**: [index.html](../index.html) loads all system modules in order
2. **Initialization**: [main.js](../js/main.js) calls `puzzleLoader.loadAll()` to fetch [data/puzzles.json](../data/puzzles.json) and [data/stories.json](../data/stories.json)
3. **State Management**: Progress tracked in [data/progress.json](../data/progress.json) (lastPlayed, storiesCompleted, insaneUnlocked)
4. **Game Logic**: Individual game classes instantiate in containers, use `eventManager.emit()` to signal completion

## Data Structures

### Puzzles Format (`data/puzzles.json`)
```json
{
  "connections": [
    {
      "id": "conn_detective_001",
      "difficulty": "easy|medium|hard",
      "groups": [
        {
          "category": "Theme description",
          "difficulty": "easy|medium|hard|tricky",
          "words": ["WORD1", "WORD2", "WORD3", "WORD4"]
        }
      ]
    }
  ]
}
```

**Requirements**: Exactly 4 groups per puzzle, 4 words per group, all uppercase, unique IDs using `conn_/word_/etc_` prefix.

### Stories Format (`data/stories.json`)
```json
{
  "campaigns": [
    {
      "id": "cabin_stalkings",
      "title": "Story Title",
      "scenes": [
        {
          "gameType": "connections|wordle|strands|spelling-bee|letter-boxed",
          "puzzleId": "conn_detective_001",
          "timer": null,
          "narrative": {
            "before": "Text shown before puzzle",
            "after": "Text shown after solving"
          }
        }
      ]
    }
  ]
}
```

## Key Patterns & Conventions

### 1. Canvas-Based UI (VHS Aesthetic)
- All buttons are canvas-rendered "tape covers" (no HTML buttons except functionality)
- [TapeCoverRenderer](../js/systems/tape-cover-renderer.js) draws decorative labels on canvas
- Each tape button has a "flipper" div that rotates to show front/back
- Style: Nostalgic horror fonts (Nosifer, VT323, Creepster) from Google Fonts

### 2. Event-Driven Puzzle Completion
Puzzle games emit events through `eventManager`:
```javascript
eventManager.emit('puzzle-complete', { puzzleId, correct: true });
eventManager.emit('story-complete', { storyId });
```

Listen in [main.js](../js/main.js) to trigger progression and save progress to [progress.json](../data/progress.json).

### 3. Modular Rendering Delegation
`VHSTapeRenderer` delegates to specialized renderers:
- **TapeCoverRenderer**: All tape cover art
- **CounterRenderer**: Animated reels
- **StoryTextRenderer**: Typewriter + narrative
- Each renderer owns its canvas drawing logic

### 4. Dual-Transport Loading
[PuzzleLoader](../js/systems/puzzle-loader.js) tries `fetch()` first, falls back to `XMLHttpRequest` for older browsers. This is intentional for maximum compatibility.

### 5. Game Module Pattern
Each game type (e.g., [ConnectionsGame](../js/games/connections.js)) is a class that:
- Takes `(containerId, puzzleData)` in constructor
- Manages own state (`selectedWords`, `mistakes`, `isComplete`)
- Calls `eventManager.emit()` when solved
- Does NOT modify global state directly

## Development Workflow

### Running Locally
```bash
npm run start  # Starts Python HTTP server on port 8000
# Then visit http://localhost:8000
```

### Adding New Content
1. **New Puzzle**: Add object to correct game type array in [data/puzzles.json](../data/puzzles.json)
2. **New Story**: Add campaign to [data/stories.json](../data/stories.json), reference valid puzzle IDs
3. **New Game Type**: Create [js/games/new-game.js](../js/games/new-game.js), add selector button in index.html, handle in main.js

### Progress Persistence
- [progress.json](../data/progress.json) persists `lastPlayed`, `storiesCompleted`, `insaneUnlocked`
- Modified by `saveProgress()` in [main.js](../js/main.js) when story completes
- Load at startup with `loadProgress()` to unlock story chains

## Critical Implementation Details

- **No Build Step**: Modules loaded via `<script>` tags in order (order matters!)
- **No External Libraries**: DOM manipulation + Canvas only
- **Canvas Performance**: Tape rendering animates reels continuously; optimize draw calls if adding new animated elements
- **Browser Compatibility**: XMLHttpRequest fallback ensures older browsers work
- **VHS Effects**: Static overlay layer and scanlines applied globally via CSS; opacity tied to "tape quality" state

## When Adding Features

✅ Add game types by extending the Connection/Wordle pattern  
✅ Expand story campaigns by adding scenes with existing puzzle references  
✅ Add new puzzle difficulties by updating puzzle.json and difficulty.css  
⚠️ Avoid adding external dependencies (stays vanilla JS)  
⚠️ Ensure canvas rendering delegates through appropriate renderer class  
⚠️ Always update both puzzle.json AND stories.json if adding new puzzles for story mode
