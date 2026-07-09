// Builds NYT-style Strands grids: every word is an INDEPENDENT winding
// 8-directional path (NOT a readable straight line), the board tiles 100% with
// no overlaps, and the spangram is a HINTING PHRASE (not the stated theme)
// that spans opposite edges. Validated by StrandsValidator; aborts if <100%.
//
// Algorithm:
//   1. Pick a hinting-phrase spangram (concatenated, >=7, no spaces).
//   2. Choose 6-8 themed answers whose total length == 48 - spangram.length.
//   3. Place spangram as a self-avoiding walk from top edge to bottom edge.
//   4. Place each answer as a random self-avoiding walk on EMPTY cells.
//   5. Retry whole layout until every word fits (no overlap, all traceable).
// By construction: 48 cells used exactly once -> 100% coverage, no gaps.

const path = require('path');
const fs = require('fs');
const { StrandsValidator } = require(path.join(__dirname, '..', 'js', 'games', 'strands-validator.js'));

const ROWS = 6, COLS = 8, CAP = ROWS * COLS;
const DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

// Hinting-phrase spangrams: hint the theme, don't name it.
const PUZZLES = [
  {
    theme: 'Gardening',
    spangram: 'PLANTLIFE', // "PLANT LIFE" — not "GARDENING"
    candidates: ['ROSES','SEEDS','TREE','BUDS','SOIL','GROW','STEM','PETAL','SPROUT','BRANCH','LEAVES','PETALS','ROOTS','BLOOMS','FERNS','WEEDS','VINES','BRAINS','FLOWER','GARDEN']
  },
  {
    theme: 'Space',
    spangram: 'OUTERSPACE', // "OUTER SPACE" — not "SPACE"
    candidates: ['PLANETS','MOON','COMET','STARS','ORBIT','NOVA','VENUS','MARS','COSMOS','NEBULA','METEOR','SOLAR','SATURN','GALAXY','ROCKET','ASTERO','PLUTO','URANUS','CRATER']
  },
  {
    theme: 'Colors',
    spangram: 'COLORWHEEL', // "COLOR WHEEL" — not "COLORS"
    candidates: ['BLUE','GREEN','PURPLE','ORANGE','PINK','CYAN','RED','TEAL','GOLD','AMBER','INDIGO','CORAL','SCARLET','OLIVE','VIOLET','MAROON','YELLOW','MAGENTA','CRIMSON']
  }
];

function pickAnswers(spLen, cands) {
  const need = CAP - spLen;
  const sorted = [...cands].sort((a,b) => b.length - a.length);
  const res = [];
  const dfs = (i, sum, cur) => {
    if (sum === need && cur.length >= 6 && cur.length <= 8) { res.push([...cur]); return true; }
    if (i >= sorted.length || sum >= need) return false;
    if (dfs(i+1, sum + sorted[i].length, cur.concat(sorted[i]))) return true;
    return dfs(i+1, sum, cur);
  };
  dfs(0, 0, []);
  return res[0] || null;
}

const rnd = (n) => Math.floor(Math.random() * n);
const key = (r,c) => r + ',' + c;
const inB = (r,c) => r>=0 && r<ROWS && c>=0 && c<COLS;

// Self-avoiding walk of `len` from a start cell over EMPTY cells, 8-dir.
function walk(grid, start, len) {
  const path = [start];
  const used = new Set([key(...start)]);
  const rec = (r,c) => {
    if (path.length === len) return true;
    const order = DIRS.map(d => [d[0], d[1]]);
    for (let i = order.length - 1; i > 0; i--) { // shuffle
      const j = rnd(i + 1); [order[i], order[j]] = [order[j], order[i]];
    }
    for (const [dr, dc] of order) {
      const nr = r + dr, nc = c + dc;
      if (!inB(nr, nc) || used.has(key(nr, nc)) || grid[nr][nc] !== ' ') continue;
      used.add(key(nr, nc)); path.push([nr, nc]);
      if (rec(nr, nc)) return true;
      used.delete(key(nr, nc)); path.pop();
    }
    return false;
  };
  return rec(...start) ? path : null;
}

function placeSpangram(grid, word) {
  // start on top edge (row 0), must end on bottom edge (row ROWS-1)
  for (let attempt = 0; attempt < 4000; attempt++) {
    const start = [0, rnd(COLS)];
    const p = walk(grid, start, word.length);
    if (p && p[p.length - 1][0] === ROWS - 1) {
      p.forEach(([r, c], i) => grid[r][c] = word[i]);
      return p;
    }
  }
  return null;
}

function build(p) {
  const answers = pickAnswers(p.spangram.length, p.candidates);
  if (!answers) { console.error(`  ! ${p.theme}: no answer subset sums to ${CAP - p.spangram.length}`); return null; }
  for (let attempt = 0; attempt < 3000; attempt++) {
    const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(' '));
    const sp = placeSpangram(grid, p.spangram);
    if (!sp) continue;
    let ok = true;
    for (const w of answers) {
      // pick a random empty start cell
      const empties = [];
      for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) if (grid[r][c]===' ') empties.push([r,c]);
      if (!empties.length) { ok = false; break; }
      const start = empties[rnd(empties.length)];
      const wp = walk(grid, start, w.length);
      if (!wp) { ok = false; break; }
      wp.forEach(([r, c], i) => grid[r][c] = w[i]);
    }
    if (ok) { return { grid, answers }; }
  }
  console.error(`  ! ${p.theme}: layout failed after retries`);
  return null;
}

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'puzzles.json'), 'utf8'));
const v = new StrandsValidator();
let ok = true;
const out = data.strands.map((old, i) => {
  const def = PUZZLES[i];
  const built = build(def);
  if (!built) { ok = false; return old; }
  const puzzle = { ...old, theme: def.theme, spangram: def.spangram, answers: built.answers, grid: built.grid };
  const res = v.validate(puzzle);
  console.log(`THEME ${def.theme}: valid=${res.isValid} coverage=${res.stats.coverage} spangram="${def.spangram}" answers=${built.answers.length}`);
  if (!res.isValid) { ok = false; console.log('  ERRORS:', res.errors.join(' | ')); }
  return puzzle;
});

if (ok) {
  data.strands = out;
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'puzzles.json'), JSON.stringify(data, null, 2) + '\n');
  console.log('WROTE data/puzzles.json — all strands puzzles 100% covered, scrambled, phrase-spangrams');
} else {
  console.error('ABORT: not writing (invalid puzzle present)');
  process.exit(1);
}
