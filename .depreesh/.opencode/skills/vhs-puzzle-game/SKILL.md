---
name: vhs-puzzle-game
description: VHS Horror Puzzle Collection specifics - game implementation patterns, puzzle data format, horror story integration
---

## VHS Puzzle Game Specifics

Use this skill when working on the VHS Horror Puzzle Collection project.

### Game File Structure

```
js/games/
├── base-game.js      # Abstract base class - extend for new games
├── connections.js    # ✅ Complete
├── wordle.js        # ✅ Complete
├── strands.js       # ⚠️ Partial - TODOs remain
└── letterboxed.js  # ❌ Not started
```

### BaseGame Pattern

```javascript
class BaseGame {
  constructor(containerElement) {
    this.container = containerElement;
    this.cleanupManager = new CleanupManager();
    this.eventManager = new EventManager();
  }

  init() { /* Required */ }
  render() { /* Required */ }
  cleanup() { /* Required - unbind events, clear timers */ }
}
```

### Puzzle Data Format (data/puzzles.json)

```json
{
  "connections": [
    {
      "categories": ["Category1", "Category2", "Category3", "Category4"],
      "words": ["WORD1", "WORD2", "WORD3", "WORD4", "..."],
      "difficulty": "easy|medium|hard"
    }
  ],
  "wordle": {
    "answers": ["APPLE", "BEACH", "CRANE"],
    "valid": ["ALL", "VALID", "GUESSES"]
  }
}
```

### VHS Effects Integration

```javascript
// In your game's init()
import { VHSEffects } from '../vhs-effects.js';

// Apply effects to game container
const vhsContainer = VHSEffects.wrap(this.container);
```

### Horror Story Integration

```javascript
// Story text appears at game milestones
import { StoryTextRenderer } from './systems/story-text-renderer.js';

const story = new StoryTextRenderer(container);
story.display("The tape begins to roll...");

// Progressive story elements
story.addBeat("discovery", "You found a clue.");
story.addBeat("danger", "Something watches from the static.");
```

### Cleanup Pattern

```javascript
// Always cleanup on game end
cleanup() {
  this.eventManager.clear();
  this.cleanupManager.run();
  this.container.innerHTML = '';
}
```

### Key Files

| File | Purpose |
|------|---------|
| `js/systems/cleanup-manager.js` | Memory management |
| `js/systems/event-manager.js` | Event handling |
| `js/systems/tape-quality.js` | Difficulty/VHS degradation |
| `js/systems/story-text-renderer.js` | Horror narrative |
| `js/systems/tape-cover-renderer.js` | VHS cover artwork |
| `js/vhs-effects.js` | Canvas effects |

### Testing

Open `test-{game}.html` files for manual testing:
- `test-connections.html`
- `test-wordle.html`
- `test-letter-boxed.html` (not created yet)

### Commands

```bash
npm run lint    # Check code style
node server.js # Start server on localhost:8000
```
