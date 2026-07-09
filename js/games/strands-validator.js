/**
 * Strands Puzzle Validator
 * Validates that a Strands puzzle follows all NYT Strands rules
 */

class StrandsValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
    }

    /**
     * Validate a complete Strands puzzle
     * @param {Object} puzzle - The puzzle object with grid, spangram, and answers
     * @returns {Object} Validation result with errors, warnings, and stats
     */
    validate(puzzle) {
        this.errors = [];
        this.warnings = [];
        
        const grid = puzzle.grid;
        const rows = grid.length;
        const cols = grid[0].length;
        
        // 1. Check grid dimensions
        if (rows !== 6 || cols !== 8) {
            this.errors.push(`Grid must be 6x8, got ${rows}x${cols}`);
        }
        
        // 2. Check spangram length (must be 7+ letters)
        if (!puzzle.spangram || puzzle.spangram.length < 7) {
            this.errors.push(`Spangram must be 7+ letters, got ${puzzle.spangram?.length || 0}`);
        }
        
        // 3. Find spangram paths and check edge connection
        const spangram = puzzle.spangram;
        const allSpangramPaths = this.findAllPaths(grid, spangram);
        const edgePaths = allSpangramPaths.filter(p => this.connectsOppositeEdges(p, rows, cols));
        
        if (edgePaths.length === 0) {
            this.errors.push('Spangram does not connect two opposite edges');
        }
        
        // 4. Track all used cells (union ALL edge paths for the spangram)
        const usedCells = new Set();
        edgePaths.forEach(p => p.forEach(pos => usedCells.add(pos.row + ',' + pos.col)));

        // 5. Validate all answers are traceable (union ALL found paths for coverage)
        if (puzzle.answers) {
            puzzle.answers.forEach(answer => {
                const paths = this.findAllPaths(grid, answer);
                if (paths.length === 0) {
                    this.errors.push(`Answer "${answer}" cannot be traced through adjacent cells`);
                } else {
                    paths.forEach(p => p.forEach(pos => usedCells.add(pos.row + ',' + pos.col)));
                }
            });
        }
        
        // 6. Check all cells are used (every cell must be covered)
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!usedCells.has(r + ',' + c)) {
                    this.errors.push(`Cell (${r},${c}) = "${grid[r][c]}" is unused`);
                }
            }
        }
        
        return {
            isValid: this.errors.length === 0,
            errors: [...this.errors],
            warnings: [...this.warnings],
            stats: {
                totalCells: rows * cols,
                usedCells: usedCells.size,
                coverage: Math.round((usedCells.size / (rows * cols)) * 100) + '%'
            }
        };
    }

    /**
     * Find all possible paths for a word in the grid
     * Uses 8-directional adjacency
     */
    findAllPaths(grid, word) {
        const rows = grid.length;
        const cols = grid[0].length;
        const results = [];
        
        const search = (row, col, index, path) => {
            if (index === word.length) {
                results.push([...path]);
                return;
            }
            
            // Bounds check
            if (row < 0 || row >= rows || col < 0 || col >= cols) {return;}
            
            // Check if already in path (no self-crossing)
            if (path.some(p => p.row === row && p.col === col)) {return;}
            
            // Check if letter matches
            if (grid[row][col] !== word[index]) {return;}
            
            // Check adjacency to previous cell
            if (path.length > 0) {
                const last = path[path.length - 1];
                const rowDiff = Math.abs(row - last.row);
                const colDiff = Math.abs(col - last.col);
                // Must be adjacent (max 1 step in each direction)
                if (rowDiff > 1 || colDiff > 1) {return;}
            }
            
            path.push({row, col});
            
            // Explore all 8 directions
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) {continue;}
                    search(row + dr, col + dc, index + 1, path);
                }
            }
            
            path.pop();
        };
        
        // Try all starting positions
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                search(r, c, 0, []);
            }
        }
        
        return results;
    }

    /**
     * Check if a path connects two opposite edges
     * Edges: top row (row 0), bottom row (row 5), left col (col 0), right col (col 7)
     */
    connectsOppositeEdges(path, rows, cols) {
        if (!path || path.length < 2) {return false;}
        
        const first = path[0];
        const last = path[path.length - 1];
        
        // Check top-to-bottom connection
        const topToBottom = (first.row === 0 && last.row === rows - 1) ||
                           (first.row === rows - 1 && last.row === 0);
        
        // Check left-to-right connection
        const leftToRight = (first.col === 0 && last.col === cols - 1) ||
                           (first.col === cols - 1 && last.col === 0);
        
        return topToBottom || leftToRight;
    }

    /**
     * Generate a summary report
     */
    generateReport(puzzle, result) {
        const lines = [];
        lines.push('═══════════════════════════════════════════════════════');
        lines.push('              STRANDS PUZZLE VALIDATION REPORT');
        lines.push('═══════════════════════════════════════════════════════');
        lines.push('');
        lines.push(`Theme: ${puzzle.theme}`);
        lines.push(`Spangram: ${puzzle.spangram}`);
        lines.push(`Answers: ${puzzle.answers.join(', ')}`);
        lines.push('');
        lines.push('Grid:');
        for (let r = 0; r < puzzle.grid.length; r++) {
            lines.push(`  Row ${r}: ${puzzle.grid[r].join(' ')}`);
        }
        lines.push('');
        lines.push(`Status: ${result.isValid ? '✓ VALID' : '✗ INVALID'}`);
        
        if (result.errors.length > 0) {
            lines.push('');
            lines.push('ERRORS:');
            result.errors.forEach(e => lines.push(`  • ${e}`));
        }
        
        if (result.warnings.length > 0) {
            lines.push('');
            lines.push('WARNINGS:');
            result.warnings.forEach(w => lines.push(`  • ${w}`));
        }
        
        lines.push('');
        lines.push(`Cell Coverage: ${result.stats.usedCells}/${result.stats.totalCells} (${result.stats.coverage})`);
        
        return lines.join('\n');
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StrandsValidator };
}
if (typeof window !== 'undefined') {
    window.StrandsValidator = StrandsValidator;
}
