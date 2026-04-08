# Code Review: VHS Horror Puzzle Collection

**Date:** 2026-04-07
**Reviewer:** Sisyphus (opencode/big-pickle)
**Commit:** Current HEAD

---

## Executive Summary

The project is well-structured with a solid foundation. Two games are complete (Connections, Wordle), Strands is actually **functional** (not partial as previously thought), and Letter Boxed needs implementation. The VHS effects system is comprehensive. Main concerns are in `main.js` (787 lines, too large) and event listener management.

---

## Game Status

### Connections ✅ Complete (354 lines)
- Clean implementation following base-game pattern
- Proper cleanup via cleanupManager
- Timer, rewind, eject mechanics all working
- **Minor:** `currentConnectionsGame` global is always null (line 354)

### Wordle ✅ Complete (242 lines)
- Functional word guessing game
- **BUG:** `getFeedbackClass()` returns 'G' for both green AND gray (lines 176-178)
- **BUG:** `cleanup()` references `this.handleKeyPress` which doesn't exist
- **Minor:** Hardcoded word list instead of using data/puzzles.json
- **Minor:** Uses emojis in messages (🎉, 😔) - breaks VHS aesthetic

### Strands ✅ Functional (343 lines)
- **NOT partial as previously thought** - fully implemented
- Drag selection, word submission, spangram detection all working
- Proper cleanup, VHS effects integration
- **Minor:** Touch event listeners not tracked by cleanupManager (lines 89-111)
- **Minor:** Win condition is `foundWords.length >= 3` (should match puzzle.answers.length)

### Letter Boxed ❌ Not Started
- Referenced in main.js but no implementation file exists
- main.js tries to instantiate `LetterBoxedGame` which doesn't exist

---

## Systems Quality

### CleanupManager ✅ Good (66 lines)
- Centralized resource management
- Tracks: listeners, timers, animations
- **Issue:** `cleanupAll()` clears ALL listeners globally, not per-game
- **Issue:** No way to cleanup specific game's resources independently

### EventManager ⚠️ Needs Work (50 lines)
- Simple pub/sub pattern
- **Major:** No cleanup between games - listeners accumulate
- **Major:** `eventManager.clear('gameComplete')` only called in goBack(), not on game switch
- **Issue:** No error handling for missing callbacks

### AssetLoader ✅ Good (103 lines)
- Async loading with caching
- Format fallback (ogg, mp3, wav)
- **Minor:** Cache never clears during session

### TapeQualitySystem ✅ Good (197 lines)
- Well-designed state management
- Difficulty levels, rewinds, callbacks
- **Minor:** Direct DOM manipulation in updateUI()

### VHSEffects ✅ Excellent (372 lines)
- Comprehensive effects: static, shake, colorShift, tracking, dropout, verticalHold
- Canvas optimization (10fps instead of 60fps)
- Audio unlock pattern
- **Minor:** No cleanup for static animation (requestAnimationFrame)

---

## Critical Issues

### 1. main.js is 787 Lines (Too Large)
- Should be split into: `game-manager.js`, `scene-manager.js`, `progress-manager.js`
- Contains game logic, UI management, progress tracking, blood trail animation

### 2. Event Listener Accumulation
- `eventManager.on('gameComplete', ...)` called in `loadPuzzle()` without cleanup
- Each game switch adds new listeners without removing old ones
- Will cause multiple callbacks firing after several game switches

### 3. Wordle Feedback Bug
```javascript
// js/games/wordle.js:174-179
const classes = {
    'G': 'green',
    'Y': 'yellow',
    'G': 'gray'  // This overwrites 'G': 'green'!
};
```
All non-yellow letters show as green instead of gray.

### 4. Missing LetterBoxedGame
- main.js references `LetterBoxedGame` on lines 342, 453
- File `js/games/letterboxed.js` does not exist
- Will crash if user selects Letter Boxed

---

## Recommendations

### Priority 1 (Fix Now)
1. Fix Wordle `getFeedbackClass()` bug
2. Fix event listener accumulation in main.js
3. Create LetterBoxedGame stub to prevent crashes

### Priority 2 (Next Sprint)
1. Split main.js into modules
2. Add per-game event cleanup
3. Move Wordle word list to data/puzzles.json

### Priority 3 (Polish)
1. Remove emojis from Wordle messages
2. Add VHS effects to all game transitions
3. Implement unit tests

---

## Architecture Assessment

| Aspect | Score | Notes |
|--------|-------|-------|
| Game Architecture | 8/10 | BaseGame pattern is solid |
| Memory Management | 6/10 | CleanupManager good, but eventManager leaks |
| VHS Aesthetic | 9/10 | Comprehensive effects system |
| Code Organization | 7/10 | Good separation, but main.js too large |
| Error Handling | 6/10 | Basic try/catch, no error boundaries |
| Testing | 2/10 | No unit tests |

---

## Next Steps

1. **Implement Letter Boxed** - Highest priority missing feature
2. **Fix Wordle bug** - Quick fix, high impact
3. **Refactor main.js** - Split into modules
4. **Fix event accumulation** - Critical for long sessions
