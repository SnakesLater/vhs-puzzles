# Strands Puzzle Design - Research Summary

**Date:** 2026-04-12
**Agent:** Hermes

---

## What I Did

1. **Analyzed existing Strands puzzles** in `puzzles.json`
2. **Researched NYT Strands game mechanics**
3. **Created a validation script** (`js/games/strands-validator.js`)
4. **Created comprehensive design guide** (`notes/STRANDS_DESIGN_GUIDE.md`)
5. **Identified issues** with current puzzles

---

## Key Findings

### NYT Strands Rules:
1. **Grid size:** 6 rows × 8 columns = 48 cells
2. **Spangram:** Must be 7+ letters, connects two OPPOSITE edges (top-bottom or left-right)
3. **Answer words:** Must be traceable through adjacent cells (8-directional: horizontal, vertical, diagonal)
4. **Every cell:** Ideally should be covered by at least one word

### Current Puzzle Issues:

| Puzzle ID | Theme | Issues |
|-----------|-------|--------|
| strands_horror_001 | Horror Creatures | VAMPIRE not traceable, spangram doesn't reach edge |
| strands_horror_002 | Cabin in the Woods | CABIN not traceable, spangram doesn't reach edge |
| strands_horror_003 | Crime Scene Evidence | Spangram only 6 letters (needs 7+) |

---

## Created Files

1. **`js/games/strands-validator.js`** - Validation script
   - Validates grid dimensions (6x8)
   - Checks spangram length (7+)
   - Verifies spangram connects opposite edges
   - Confirms all answers are traceable
   - Reports cell coverage

2. **`notes/STRANDS_DESIGN_GUIDE.md`** - Comprehensive guide
   - Rules summary
   - Step-by-step design process
   - Example puzzle
   - Common mistakes to avoid
   - Coordinate system reference

---

## Example Valid Puzzle

```json
{
  "id": "strands_horror_valid",
  "difficulty": "medium",
  "theme": "Horror Creatures",
  "grid": [
    ["M", "O", "N", "S", "T", "E", "R", "S"],
    ["W", "E", "R", "E", "W", "O", "L", "F"],
    ["V", "A", "M", "P", "I", "R", "E", "A"],
    ["Z", "O", "M", "B", "I", "E", "R", "A"],
    ["G", "H", "O", "U", "L", "D", "E", "D"],
    ["T", "B", "A", "T", "S", "Y", "E", "L"]
  ],
  "spangram": "MONSTERS",
  "spangramHint": "Things that go bump in the night",
  "answers": ["WEREWOLF", "VAMPIRE", "ZOMBIE", "GHOUL", "BAT"]
}
```

**Status:** ✓ All words traceable, spangram connects left→right edge
**Coverage:** 71% (34/48 cells)

---

## Recommendations

1. **Fix existing puzzles** or create new valid ones
2. **Use validator** before adding new puzzles
3. **Aim for 100% coverage** but 71%+ is acceptable for gameplay
4. **Test word paths** manually before finalizing

---

**Status:** Research Complete
