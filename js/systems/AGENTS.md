# VHS Horror Puzzle Collection - Systems

## Overview
Shared systems used by all games: cleanup, events, assets, tape quality, story rendering, tape covers.

## Structure
```
js/systems/
├── cleanup-manager.js       # Centralized resource cleanup (66 lines)
├── event-manager.js         # Event pub/sub system (50 lines)
├── asset-loader.js          # Audio loading with caching (103 lines)
├── tape-quality.js          # Tape degradation/rewind mechanics (197 lines)
├── story-text-renderer.js   # Horror narrative text display
├── tape-cover-renderer.js   # VHS cover artwork generation
└── index.js                # Module exports (if exists)
```

## Where to Look
| Task | Location | Notes |
|------|----------|-------|
| Memory management | cleanup-manager.js | Tracks listeners, timers, animations |
| Event handling | event-manager.js | on/off/emit pattern |
| Audio loading | asset-loader.js | Async with ogg/mp3/wav fallback |
| Difficulty tracking | tape-quality.js | Quality %, rewinds, callbacks |
| Horror narrative | story-text-renderer.js | Progressive story text |
| VHS covers | tape-cover-renderer.js | Canvas-generated artwork |

## Conventions
- All systems export global singleton (cleanupManager, eventManager, etc.)
- Use cleanupManager.addListener() NOT element.addEventListener()
- Use cleanupManager.addTimer() NOT setInterval() directly
- Use eventManager.emit() for game events, NOT global callbacks
- Use assetLoader.loadAudio() for audio with caching

## Anti-Patterns
- DO NOT create new global singletons (use existing systems)
- DO NOT bypass cleanupManager (causes memory leaks)
- DO NOT use setTimeout without cleanupManager.addTimer()
- DO NOT hardcode audio paths (use assetLoader)
- DO NOT manipulate tape quality directly (use system methods)

## Gotchas
- cleanupManager.cleanupAll() clears ALL listeners (use carefully)
- eventManager has no cleanup - listeners persist across games
- tapeQualitySystem uses global DOM queries (updateUI, updateChains)
- assetLoader cache never clears during session
- story-text-renderer uses window.storyRenderer global
