// Strands game-logic contract tests.
// Locks the behavior of StrandsValidator — the rules engine that decides
// whether a Strands puzzle is solvable and NYT-legal (6x8 grid, spangram
// >=7 letters connecting two opposite edges, every cell covered). This is
// the contract the Founding Game Engineer owns; any future variant merge
// (circular/gravity/hexagon) must keep these invariants true.
//
// NOTE: findAllPaths() is exhaustive (enumerates every self-avoiding walk);
// on a degenerate homogeneous grid + a long same-letter word this is
// exponential and will OOM. Real shipped puzzles are never homogeneous, so
// production is safe. The rejection tests below therefore use grids of
// DISTINCT letters so the validation branches are exercised without
// tripping that worst case. (See SNA-7 known-limitation note.)
const path = require('path');
const fs = require('fs');
const { StrandsValidator } = require('../js/games/strands-validator.js');

// Real, shipped 6x8 puzzle (data/puzzles.json -> strands[0]).
const puzzles = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data', 'puzzles.json'), 'utf-8')
);
const REAL = puzzles.strands[0];

// Build a rows x cols grid of DISTINCT letters so path enumeration for any
// specific word stays tiny (no homogeneous-letter exponential blowup).
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
function makeGrid(rows, cols) {
  const g = [];
  let i = 0;
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(ALPHABET[i % ALPHABET.length]);
      i++;
    }
    g.push(row);
  }
  return g;
}
const GRID6x8 = makeGrid(6, 8);

describe('StrandsValidator — real shipped puzzle', () => {
  const v = new StrandsValidator();

  test('accepts the shipped Gardening puzzle as valid', () => {
    const r = v.validate(REAL);
    expect(r.isValid).toBe(true);
    expect(r.errors).toEqual([]);
  });

  test('covers 100% of cells', () => {
    const r = v.validate(REAL);
    expect(r.stats.totalCells).toBe(48); // 6x8
    expect(r.stats.usedCells).toBe(48);
    expect(r.stats.coverage).toBe('100%');
  });

  test('spangram connects two opposite edges', () => {
    const paths = v.findAllPaths(REAL.grid, REAL.spangram);
    const edgePaths = paths.filter(p => v.connectsOppositeEdges(p, 6, 8));
    expect(edgePaths.length).toBeGreaterThan(0);
  });

  test('every theme answer is traceable on the grid', () => {
    REAL.answers.forEach(answer => {
      expect(v.findAllPaths(REAL.grid, answer).length).toBeGreaterThan(0);
    });
  });
});

describe('StrandsValidator — edge connection geometry', () => {
  const v = new StrandsValidator();

  test('top-to-bottom adjacency counts as opposite edges', () => {
    const top = { row: 0, col: 3 };
    const bottom = { row: 5, col: 4 };
    expect(v.connectsOppositeEdges([top, bottom], 6, 8)).toBe(true);
  });

  test('left-to-right adjacency counts as opposite edges', () => {
    const left = { row: 2, col: 0 };
    const right = { row: 3, col: 7 };
    expect(v.connectsOppositeEdges([left, right], 6, 8)).toBe(true);
  });

  test('two cells on the SAME edge do NOT count as opposite edges', () => {
    const leftA = { row: 1, col: 0 };
    const leftB = { row: 4, col: 0 };
    // Both on the left edge -> not opposite edges (need top<->bottom or left<->right).
    expect(v.connectsOppositeEdges([leftA, leftB], 6, 8)).toBe(false);
  });

  test('a single-cell or degenerate path is never edge-connecting', () => {
    expect(v.connectsOppositeEdges([{ row: 0, col: 0 }], 6, 8)).toBe(false);
    expect(v.connectsOppositeEdges(null, 6, 8)).toBe(false);
  });
});

describe('StrandsValidator — rejection of illegal puzzles', () => {
  const v = new StrandsValidator();

  test('rejects a grid that is not 6x8', () => {
    const bad = { theme: 'x', spangram: 'ABCDEFGH',
      grid: makeGrid(5, 8), answers: [] };
    const r = v.validate(bad);
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('6x8'))).toBe(true);
  });

  test('rejects a spangram shorter than 7 letters', () => {
    const bad = { theme: 'x', spangram: 'ABCDEF',
      grid: GRID6x8, answers: [] };
    const r = v.validate(bad);
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('7+ letters'))).toBe(true);
  });

  test('flags incomplete cell coverage', () => {
    // spangram of 8 distinct letters is traceable, but with no answers only
    // those 8 cells are used -> the other 40 are flagged as unused.
    const bad = { theme: 'x', spangram: 'ABCDEFGH',
      grid: GRID6x8, answers: [] };
    const r = v.validate(bad);
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('unused'))).toBe(true);
  });

  test('flags an answer that cannot be traced through adjacent cells', () => {
    // Grid letters are distinct, so a word needing repeated/adjacent letters
    // not present as a path is untraceable.
    const bad = { theme: 'x', spangram: 'ABCDEFGH',
      grid: GRID6x8, answers: ['ZZZZZZZ'] };
    const r = v.validate(bad);
    expect(r.isValid).toBe(false);
    expect(r.errors.some(e => e.includes('cannot be traced'))).toBe(true);
  });
});

describe('StrandsValidator.findAllPaths — pathfinding', () => {
  const v = new StrandsValidator();

  test('finds a word written in a straight row', () => {
    const g = [
      ['C', 'A', 'T', 'X'],
      ['X', 'X', 'X', 'X'],
      ['X', 'X', 'X', 'X'],
    ];
    expect(v.findAllPaths(g, 'CAT').length).toBe(1);
  });

  test('finds a diagonal word', () => {
    const g = [
      ['D', 'X', 'X'],
      ['X', 'O', 'X'],
      ['X', 'X', 'G'],
    ];
    expect(v.findAllPaths(g, 'DOG').length).toBe(1);
  });

  test('finds every distinct self-avoiding walk (no duplicates, no loopback)', () => {
    // Grid of three 'A's (two in the top row, one below-left) plus a non-A:
    //   A A
    //   A X
    // Distinct A-A-A walks: each must step between adjacent A cells without
    // reusing one. The 6 are the 3 starting cells x their 2 continuation orders.
    const g = [
      ['A', 'A'],
      ['A', 'X'],
    ];
    const paths = v.findAllPaths(g, 'AAA');
    const seen = new Set(paths.map(p => p.map(c => `${c.row},${c.col}`).join('|')));
    expect(paths.length).toBe(seen.size); // no duplicates
    expect(paths.length).toBe(6);
  });

  test('returns no paths when letters are absent', () => {
    const g = [['X', 'Y'], ['Y', 'X']];
    expect(v.findAllPaths(g, 'Z').length).toBe(0);
  });
});
