# VHS Horror Puzzle Collection - CSS

## Overview
VHS horror aesthetic styling for all games. Main styles in main.css, game-specific overrides in css/games/.

## Structure
```
css/
├── main.css              # Core VHS styles (scanlines, CRT effects, typography)
├── games/
│   └── wordle.css        # Wordle-specific overrides
└── (other game CSS as needed)
```

## Where to Look
| Task | Location | Notes |
|------|----------|-------|
| VHS effects | main.css | Scanlines, static, chromatic aberration |
| Game tiles | main.css | Word tiles, grid layouts |
| Horror theme | main.css | Dark colors, blood effects |
| Game-specific | css/games/ | Per-game overrides |

## Conventions
- Use CSS variables for colors (--vhs-black, --vhs-red, etc.)
- Use horror-hint class for story text
- Use retro-button class for all buttons
- Use VHS font classes (VT323, Press Start 2P)

## Anti-Patterns
- DO NOT add inline styles (use CSS classes)
- DO NOT override VHS colors with hardcoded values
- DO NOT create new game CSS without updating main.css first

## Gotchas
- Scanlines overlay uses pointer-events: none
- CRT effects may impact performance on low-end devices
- Some CSS animations may conflict with VHS canvas effects
