// Quick verification script for strands puzzle grids
// Usage: node tools/verify-strands.js

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/puzzles.json', 'utf8'));

function findPath(grid, word) {
    const rows = grid.length;
    const cols = grid[0].length;
    const letters = word.split('');

    function dfs(r, c, idx, visited) {
        if (idx === letters.length) return visited.slice();
        if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
        if (visited.some(v => v[0] === r && v[1] === c)) return null;
        if (grid[r][c] !== letters[idx]) return null;

        visited.push([r, c]);
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const result = dfs(r + dr, c + dc, idx + 1, visited);
                if (result) return result;
            }
        }
        visited.pop();
        return null;
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const result = dfs(r, c, 0, []);
            if (result) return result;
        }
    }
    return null;
}

function touchesEdge(pos, rows, cols) {
    return pos[0] === 0 || pos[0] === rows - 1 || pos[1] === 0 || pos[1] === cols - 1;
}

function connectsOppositeEdges(path, rows, cols) {
    if (path.length < 2) return false;
    const first = path[0];
    const last = path[path.length - 1];
    if (!touchesEdge(first, rows, cols) || !touchesEdge(last, rows, cols)) return false;

    const topBot = (first[0] === 0 && last[0] === rows - 1) || (first[0] === rows - 1 && last[0] === 0);
    const leftRight = (first[1] === 0 && last[1] === cols - 1) || (first[1] === cols - 1 && last[1] === 0);
    return topBot || leftRight;
}

data.strands.forEach(puzzle => {
    console.log(`\n=== ${puzzle.id}: "${puzzle.theme}" ===`);
    const grid = puzzle.grid;
    const rows = grid.length;
    const cols = grid[0].length;
    console.log(`Grid: ${rows}x${cols}`);

    // Print grid
    grid.forEach((row, i) => console.log(`  ${i}: ${row.join(' ')}`));

    // Check spangram
    const spPath = findPath(grid, puzzle.spangram);
    if (!spPath) {
        console.log(`  ✗ SPANGRAM "${puzzle.spangram}" NOT TRACEABLE`);
    } else {
        const connects = connectsOppositeEdges(spPath, rows, cols);
        console.log(`  ${connects ? '✓' : '⚠'} Spangram "${puzzle.spangram}" ${connects ? 'connects edges' : 'does NOT connect edges'}`);
    }

    // Check answers
    const usedCells = new Set();
    puzzle.answers.forEach(answer => {
        const path = findPath(grid, answer);
        if (!path) {
            console.log(`  ✗ ANSWER "${answer}" NOT TRACEABLE`);
        } else {
            console.log(`  ✓ Answer "${answer}" found`);
            path.forEach(p => usedCells.add(`${p[0]},${p[1]}`));
        }
    });
    if (spPath) spPath.forEach(p => usedCells.add(`${p[0]},${p[1]}`));

    const totalCells = rows * cols;
    console.log(`  Coverage: ${usedCells.size}/${totalCells} (${Math.round(usedCells.size/totalCells*100)}%)`);
});
