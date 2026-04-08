# VHS Horror Puzzle Collection - Games

## Overview
Game implementations: Connections (complete), Wordle (complete), Strands (partial), LetterBoxed (not started).

## Structure
```
js/games/
├── base-game.js       # Base class - extend for new games
├── connections.js     # ✅ Complete (354 lines)
├── wordle.js          # ✅ Complete (242 lines)
├── strands.js         # ⚠️ Partial - 9 TODOs remain
└── letterboxed.js    # ❌ Not started
```

## Where to Look
| Task | Location | Notes |
|------|----------|-------|
| New game template | base-game.js | Extend BaseGame class |
| Complete reference | connections.js | Best pattern to follow |
| TODOs | strands.js | selectLetter, isAdjacent, validatePath, submitWord, checkWord, highlightFoundWord, updateFoundWords, checkSpangram, showHint |

## Conventions
- Each game is a class extending BaseGame
- Constructor takes (containerId, puzzleData)
- Must implement: render(), setupEventListeners(), cleanup()
- Use cleanupManager for event listeners and timers
- Use vhsEffects for audio/visual feedback
- Use tapeQualitySystem for difficulty tracking
- Use eventManager.emit() for game events

## Anti-Patterns
- DO NOT use inline event handlers (use cleanupManager.addListener)
- DO NOT forget cleanup() method
- DO NOT hardcode puzzle data (use data/puzzles.json)
- DO NOT bypass VHS effects system

## Gotchas
- Wordle has bug: getFeedbackClass returns 'G' for both green and gray
- Wordle cleanup doesn't remove keypress handler properly
- Connections uses global currentConnectionsGame (always null)
- Strands has NO implementation beyond render()
