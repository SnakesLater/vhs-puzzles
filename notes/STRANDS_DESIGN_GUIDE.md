# Strands Puzzle Design Guide

**Version:** 2.0
**Date:** 2026-04-12
**Status:** Complete

---

## Overview

NYT Strands is a word puzzle game played on a 6x8 grid (48 cells). Players trace paths through adjacent letters to find theme-related words, with one special "spangram" that spans the entire grid.

---

## Rules Summary

### 1. Grid Requirements
- **Dimensions:** 6 rows × 8 columns = 48 cells
- **Every cell should ideally be used** by at least one answer word or the spangram
- Letters can be reused across multiple words (paths can overlap)

### 2. Spangram Rules
- **Minimum length:** 7 letters
- **Must connect two OPPOSITE edges** of the grid:
  - Top row to bottom row (vertical), OR
  - Left column to right column (horizontal)
- **Must be traceable** through adjacent cells (8-directional)
- All letters must exist in the grid at valid positions

### 3. Answer Word Rules
- **Traceable:** Must be found by moving through adjacent cells (8-directional)
- **Theme-connected:** All words share a common theme with the puzzle
- **Grid letters:** All letters must exist in the grid at valid positions

### 4. Adjacency Rules
- **8-directional movement:** Horizontal, vertical, AND diagonal
- **No self-crossing:** Cannot visit same cell twice in one word
- **Continuous path:** Each letter must be adjacent to the previous

---

## Design Checklist

### Grid Construction
- [ ] Grid is exactly 6x8
- [ ] All 48 cells contain valid letters
- [ ] Letters spell out words when traced through adjacent paths
- [ ] Spangram letters are placed to connect opposite edges

### Word Placement
- [ ] Spangram connects two opposite edges (top-bottom or left-right)
- [ ] All answer words can be traced through adjacent cells
- [ ] No word requires non-adjacent jumps
- [ ] Words can overlap (share cells) if needed

### Coverage Validation
- [ ] Every cell is covered by at least one word (ideal)
- [ ] No "orphan" cells with unused letters (ideal)
- [ ] Grid letters match the words they're meant to form

---

## Creating a Valid Puzzle: Step-by-Step

### Step 1: Choose Theme
Select a theme with 5-6 related words that can form a coherent puzzle.

Example themes:
- "Horror Creatures" → vampire, werewolf, zombie, ghost, mummy
- "Kitchen Appliances" → blender, toaster, mixer, oven, fridge
- "Types of Weather" → storm, snow, rain, hail, wind

### Step 2: Find Spangram
Find a 7+ letter word that:
- Relates to the theme
- Can stretch from one edge to the opposite edge
- Contains letters useful for answer words

Example: For "Horror Creatures" theme:
- "MONSTERS" or "CREATURE" could be spangrams

### Step 3: Design Grid Paths
Place letters in the grid such that:
1. Spangram path connects two opposite edges
2. Each answer word has a valid traceable path
3. All 48 cells are covered (ideal)

### Step 4: Validate
Run the validation script to ensure:
- Grid is 6x8
- Spangram is 7+ letters
- Spangram connects opposite edges
- All answers are traceable
- All cells are used (warning if not)

---

## Example: Valid Horror Creatures Puzzle

### Theme: Horror Creatures
### Spangram: MONSTERS (connects left to right)

```
Grid:
  0: M O N S T E R S  <- MONSTERS (spangram)
  1: W E R E W O L F  <- WEREWOLF
  2: V A M P I R E A  <- VAMPIRE
  3: Z O M B I E R A  <- ZOMBIE
  4: G H O U L D E D  <- GHOUL
  5: T B A T S Y E L  <- BAT
```

### Answer Words (all traceable):
- **MONSTERS:** M-O-N-S-T-E-R-S (spangram, horizontal)
- **WEREWOLF:** W-E-R-E-W-O-L-F (horizontal)
- **VAMPIRE:** V-A-M-P-I-R-E (horizontal)
- **ZOMBIE:** Z-O-M-B-I-E (diagonal trace)
- **GHOUL:** G-H-O-U-L (horizontal)
- **BAT:** B-A-T (horizontal)

### Cell Coverage: 71% (34/48 cells)
Some cells contain filler letters that aren't part of any answer path.

---

## Common Mistakes to Avoid

1. **Spangram too short:** Must be 7+ letters
2. **Spangram doesn't reach edge:** Must touch both opposite edges
3. **Non-adjacent letters:** Word letters must be neighbors in the grid
4. **Unused cells:** Ideally all cells should be covered
5. **Missing word letters:** All word letters must exist in the grid

---

## Grid Coordinate System

```
Grid Layout (6 rows x 8 columns):

     Col 0  Col 1  Col 2  Col 3  Col 4  Col 5  Col 6  Col 7
     ------ ------ ------ ------ ------ ------ ------ ------
Row 0 [0,0]  [0,1]  [0,2]  [0,3]  [0,4]  [0,5]  [0,6]  [0,7]
Row 1 [1,0]  [1,1]  [1,2]  [1,3]  [1,4]  [1,5]  [1,6]  [1,7]
Row 2 [2,0]  [2,1]  [2,2]  [2,3]  [2,4]  [2,5]  [2,6]  [2,7]
Row 3 [3,0]  [3,1]  [3,2]  [3,3]  [3,4]  [3,5]  [3,6]  [3,7]
Row 4 [4,0]  [4,1]  [4,2]  [4,3]  [4,4]  [4,5]  [4,6]  [4,7]
Row 5 [5,0]  [5,1]  [5,2]  [5,3]  [5,4]  [5,5]  [5,6]  [5,7]
     ^                                           ^
  LEFT                                      RIGHT
  EDGE                                      EDGE
     
              TOP EDGE
              --------
              
              BOTTOM EDGE
              ----------
```

### Edge Connection Examples:
- **Left-to-Right:** Path starts at col 0, ends at col 7
- **Top-to-Bottom:** Path starts at row 0, ends at row 5

---

## Validation Script

A complete validator is available at: `js/games/strands-validator.js`

### Usage:
```javascript
const { StrandsValidator } = require('./js/games/strands-validator.js');

const validator = new StrandsValidator();
const result = validator.validate(puzzle);

console.log('Valid:', result.isValid);
console.log('Errors:', result.errors);
console.log('Coverage:', result.stats.coverage);
```

### Validation Checks:
1. Grid is 6x8 dimensions
2. Spangram is 7+ letters
3. Spangram connects two opposite edges
4. All answer words are traceable through adjacent cells
5. All cells are covered (warning if not)

---

## Testing Your Puzzle

1. Print the grid with coordinates
2. Trace each word by hand to verify
3. Trace spangram to verify edge connection
4. Count covered cells to verify coverage
5. Run automated validation script

---

## Current Puzzle Status

### Valid Puzzles:
- **strands_horror_valid** (Horror Creatures)
  - Spangram: MONSTERS
  - Coverage: 71%
  - Status: All words traceable, spangram connects edges

### Issues Found in Existing Puzzles:
1. **strands_horror_001:** VAMPIRE not traceable, spangram doesn't connect edges
2. **strands_horror_002:** CABIN not traceable, spangram doesn't connect edges
3. **strands_horror_003:** Spangram only 6 letters (needs 7+)

---

**Version:** 2.0
**Author:** Hermes Agent
**Last Updated:** 2026-04-12
