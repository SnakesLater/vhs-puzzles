// Strands Game - Web of Horror Connections

class StrandsGame extends BaseGame {
    constructor(containerId, puzzle) {
        super(containerId, puzzle);
        
        // Always use actual puzzle data
        this.theme = puzzle.theme;
        this.answers = puzzle.answers || [];
        this.spangram = puzzle.spangram;
        this.grid = puzzle.grid;
        
        this.foundWords = [];
        this.selectedPath = [];
        this.currentWord = '';
        this.spangramFound = false;
        this.mistakes = 0;
        // NYT-style: mistakes are non-fatal — they fill a meter but never
        // lock the grid. Kept only for display/progress, not game-over.
        this.maxMistakes = Infinity;
        this.isDragging = false;
        // Gravity dot-to-dot: a letter only commits when the pointer is within
        // this radius (px) of its CENTER. Prevents eager/wrong-letter commits
        // (the old "nearest neighbor always wins" bug that blocked L->E).
        this.snapRadius = 30;
        
        // Hint system: track non-theme words found
        this.nonThemeWords = [];
        this.hintRevealedWords = [];
        this.hintPending = false;
    }

    init() {
        // BaseGame constructor calls init() before StrandsGame constructor finishes.
        // If grid isn't ready yet, defer until constructor completes.
        if (!this.grid) {
            setTimeout(() => this.init(), 0);
            return;
        }
        this.render();
        this.setupEventListeners();
        this.setupKeyboardNavigation();
    }

    render() {
        const html = `
            <div class="strands-container">
                <div class="strands-header">
                    <h2>WEB OF CLUES</h2>
                    <p class="horror-hint">Follow the threads... they all connect to: <span class="theme-hint">${this.theme}</span></p>
                </div>
                
                <div id="strands-grid" class="strands-grid">
                    ${this.renderLetterGrid()}
                    <svg class="strands-thread"></svg>
                </div>
                
                <div class="strands-sidebar">
                    <div id="current-word" class="current-word">_</div>
                    <div id="found-words" class="found-words">
                        <h3>Found Words:</h3>
                        <div class="word-list"></div>
                    </div>
                    <div id="hint-counter" class="hint-counter"></div>
                    <div class="strands-controls">
                        <button id="clear-selection">Clear</button>
                        <button id="submit-word" disabled>Submit</button>
                    </div>
                </div>
                
                <div id="strands-message" class="strands-message"></div>
            </div>
        `;
        
        this.container.innerHTML = html;
        this.updateHintDisplay();
    }

    renderLetterGrid() {
        // Grid data must be provided by puzzle - no fallback
        if (!this.grid || !Array.isArray(this.grid) || this.grid.length === 0) {
            console.error('Strands puzzle missing grid data! Puzzle data required.');
            return '<div class="strands-error">Error: Puzzle not loaded correctly</div>';
        }
        
        let gridHTML = '';
        for (let row = 0; row < this.grid.length; row++) {
            gridHTML += '<div class="strands-row">';
            for (let col = 0; col < this.grid[row].length; col++) {
                const letter = this.grid[row][col];
                gridHTML += `<div class="strands-cell" data-row="${row}" data-col="${col}" draggable="false">${letter}</div>`;
            }
            gridHTML += '</div>';
        }
        return gridHTML;
    }

    setupEventListeners() {
        const cells = this.container.querySelectorAll('.strands-cell');
        const clearBtn = document.getElementById('clear-selection');
        const submitBtn = document.getElementById('submit-word');

        // Mouse/touch drag selection
        cells.forEach(cell => {
            cleanupManager.addListener(cell, 'mousedown', (e) => {
                e.preventDefault();
                this.isDragging = true;
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                // Click-to-trace: if a path exists and this cell is a legal
                // neighbor of the last, append it (dot-to-dot, bulletproof
                // per-letter check-in). Otherwise start a fresh selection.
                if (this.selectedPath.length > 0) {
                    const last = this.selectedPath[this.selectedPath.length - 1];
                    if (this.isAdjacent({row, col}, last)) {
                        this.continueSelection(cell);
                        return;
                    }
                    // clicked a non-neighbor -> start fresh from here
                    this.startSelection(cell);
                    return;
                }
                this.startSelection(cell);
            });

            // NOTE: no mouseenter fallback — gravity (nearestNeighborCell in
            // moveHandler) is the single drag source; it only commits a letter
            // when the pointer is within snapRadius of that letter's center.
        });

        // Hit-test the cell literally under the pointer and step toward it.
        // Coalesced events recover the intermediate points a fast drag skips,
        // so diagonals no longer jump past cells.
        // Gravity selection: snap to the legal neighbor (orth/diag) whose CENTER
        // is closest to the pointer. Diagonals become the natural nearest choice;
        // never selects a non-adjacent cell, so grid integrity is preserved.
        const moveHandler = (clientX, clientY) => {
            if (!this.isDragging) {return;}
            const cell = this.nearestNeighborCell(clientX, clientY);
            if (cell) { this.continueSelection(cell); }
        };

        cleanupManager.addListener(this.container, 'mousemove', (e) => {
            const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
            for (const ev of events) { moveHandler(ev.clientX, ev.clientY); }
        });

        // Global mouse up to end drag
        cleanupManager.addListener(document, 'mouseup', () => {
            this.isDragging = false;
        });

        // Touch support - registered with cleanupManager
        const touchStartHandler = (e) => {
            const touch = e.touches[0];
            const el = document.elementFromPoint(touch.clientX, touch.clientY);
            if (el && el.classList.contains('strands-cell')) {
                e.preventDefault();
                this.isDragging = true;
                this.startSelection(el);
            }
        };

        const touchMoveHandler = (e) => {
            if (!this.isDragging) {return;}
            e.preventDefault();
            const touch = e.touches[0];
            moveHandler(touch.clientX, touch.clientY);
        };

        const touchEndHandler = () => {
            this.isDragging = false;
        };

        this.container.addEventListener('touchstart', touchStartHandler, { passive: false });
        this.container.addEventListener('touchmove', touchMoveHandler, { passive: false });
        this.container.addEventListener('touchend', touchEndHandler);

        // Track for cleanup
        if (!this._touchListeners) {this._touchListeners = [];}
        this._touchListeners.push(
            {element: this.container, event: 'touchstart', handler: touchStartHandler},
            {element: this.container, event: 'touchmove', handler: touchMoveHandler},
            {element: this.container, event: 'touchend', handler: touchEndHandler}
        );

        // Button handlers
        cleanupManager.addListener(clearBtn, 'click', () => this.clearSelection());
        cleanupManager.addListener(submitBtn, 'click', () => this.submitWord());
    }

    startSelection(cell) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        this.selectedPath = [{row, col}];
        this.updateCurrentWord();
        this.highlightSelectedPath();
    }

    setupKeyboardNavigation() {
        // Make cells focusable
        const cells = this.container.querySelectorAll('.strands-cell');
        cells.forEach(cell => {
            cell.setAttribute('tabindex', '0');
            cell.setAttribute('role', 'button');
            cell.setAttribute('aria-pressed', 'false');
        });

        // Add keyboard handlers to cells
        cells.forEach(cell => {
            cleanupManager.addListener(cell, 'keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Toggle selection on Enter or Space
                    if (this.selectedPath.length === 0) {
                        this.startSelection(cell);
                    } else {
                        // Check if clicking the previously selected cell
                        if (this.selectedPath[0].row === parseInt(cell.dataset.row) &&
                            this.selectedPath[0].col === parseInt(cell.dataset.col)) {
                            // Deselect
                            this.clearSelection();
                        } else {
                            // Start new selection (replaces old)
                            this.startSelection(cell);
                        }
                    }
                }
            });
        });

        // Global keyboard shortcuts
        cleanupManager.addListener(document, 'keydown', (e) => {
            // Enter to submit word (when a word is selected and cell is focusable)
            if (e.key === 'Enter' && e.target.classList.contains('strands-cell')) {
                if (this.selectedPath.length > 0) {
                    e.preventDefault();
                    this.submitWord();
                }
            }

            // Escape to clear selection
            if (e.key === 'Escape' && this.selectedPath.length > 0) {
                this.clearSelection();
                return;
            }

            // Arrow key navigation
            if (this.selectedPath.length > 0 && e.target.classList.contains('strands-cell')) {
                const currentRow = parseInt(e.target.dataset.row);
                const currentCol = parseInt(e.target.dataset.col);
                let newRow = currentRow;
                let newCol = currentCol;

                if (e.key === 'ArrowUp') {newRow = Math.max(0, currentRow - 1);}
                if (e.key === 'ArrowDown') {newRow = Math.min(this.grid.length - 1, currentRow + 1);}
                if (e.key === 'ArrowLeft') {newCol = Math.max(0, currentCol - 1);}
                if (e.key === 'ArrowRight') {newCol = Math.min(this.grid[0].length - 1, currentCol + 1);}

                // FIX #4: Use || instead of && to allow cardinal directions
                if (newRow !== currentRow || newCol !== currentCol) {
                    e.preventDefault();
                    const newCell = this.container.querySelector(
                        `[data-row="${newRow}"][data-col="${newCol}"]`
                    );
                    if (newCell) {
                        newCell.focus();
                    }
                }
            }
        });
    }

    continueSelection(cell) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        // Check if this is the last selected cell (deselect it)
        if (this.selectedPath.length > 1) {
            const lastPos = this.selectedPath[this.selectedPath.length - 1];
            if (lastPos.row === row && lastPos.col === col) {
                return;
            }
        }
        
        // Check if cell is already in path (go back to that point)
        const existingIndex = this.selectedPath.findIndex(pos => 
            pos.row === row && pos.col === col);
        if (existingIndex !== -1) {
            this.selectedPath = this.selectedPath.slice(0, existingIndex + 1);
            this.updateCurrentWord();
            this.highlightSelectedPath();
            return;
        }
        
        // If not adjacent to the last cell, walk a shortest 8-dir adjacent
        // path from the last cell to this one (covers skipped cells on fast
        // or diagonal drags) instead of dropping the selection.
        if (this.selectedPath.length > 0) {
            const lastPos = this.selectedPath[this.selectedPath.length - 1];
            if (!this.isAdjacent({row, col}, lastPos)) {
                this.walkTo(lastPos, {row, col});
                return;
            }
        }

        this.selectedPath.push({row, col});
        this.updateCurrentWord();
        this.highlightSelectedPath();
    }

    /**
     * Append a shortest 8-directional adjacent path from `a` to `b`, stepping
     * through real grid cells (BFS). Used when a drag skips cells, so fast or
     * diagonal moves connect smoothly without dropping the selection.
     */
    walkTo(a, b) {
        const rows = this.grid.length, cols = this.grid[0].length;
        const key = (r, c) => r * cols + c;
        const prev = new Map();
        const q = [a];
        const seen = new Set([key(a.row, a.col)]);
        while (q.length) {
            const cur = q.shift();
            if (cur.row === b.row && cur.col === b.col) { break; }
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (!dr && !dc) { continue; }
                    const nr = cur.row + dr, nc = cur.col + dc;
                    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) { continue; }
                    const k = key(nr, nc);
                    if (seen.has(k)) { continue; }
                    seen.add(k);
                    prev.set(k, cur);
                    q.push({row: nr, col: nc});
                }
            }
        }
        // Reconstruct b -> a, then append a -> b (minus the start cell)
        const path = [];
        let cur = b;
        while (cur && !(cur.row === a.row && cur.col === a.col)) {
            path.push(cur);
            cur = prev.get(key(cur.row, cur.col));
        }
        path.reverse();
        for (const pos of path) {
            const idx = this.selectedPath.findIndex(p => p.row === pos.row && p.col === pos.col);
            if (idx !== -1) {
                this.selectedPath = this.selectedPath.slice(0, idx + 1);
                break;
            }
            this.selectedPath.push({row: pos.row, col: pos.col});
        }
        this.updateCurrentWord();
        this.highlightSelectedPath();
    }

    isAdjacent(pos1, pos2) {
        const rowDiff = Math.abs(pos1.row - pos2.row);
        const colDiff = Math.abs(pos1.col - pos2.col);
        return rowDiff <= 1 && colDiff <= 1 && (rowDiff !== 0 || colDiff !== 0);
    }

    getCellCenter(cell) {
        const r = cell.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    // Gravity dot-to-dot: from the last selected cell, find the LEGAL neighbor
    // (orth/diag) whose center is within snapRadius of the pointer. Returns that
    // neighbor cell, or null if the pointer isn't near any neighbor's center yet
    // (so a letter only "checks in" when you actually reach its anchor point —
    // no eager/wrong commits). Constrained to neighbors -> never a non-adjacent
    // jump, so the grid + puzzle validity stay intact.
    nearestNeighborCell(clientX, clientY) {
        if (this.selectedPath.length === 0) { return null; }
        const last = this.selectedPath[this.selectedPath.length - 1];
        const r2 = this.snapRadius * this.snapRadius;
        let best = null, bestDist = r2;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (!dr && !dc) { continue; }
                const nr = last.row + dr, nc = last.col + dc;
                if (nr < 0 || nr >= this.grid.length || nc < 0 || nc >= this.grid[0].length) { continue; }
                const cell = this.container.querySelector(`[data-row="${nr}"][data-col="${nc}"]`);
                if (!cell) { continue; }
                const c = this.getCellCenter(cell);
                const d = (c.x - clientX) ** 2 + (c.y - clientY) ** 2;
                if (d <= bestDist) { bestDist = d; best = cell; }
            }
        }
        return best;
    }

    // Draw the connecting "thread" through committed letter centers (dot-to-dot).
    // SVG overlay sits above the floating letters; coords are relative to the grid.
    drawThread() {
        const svg = this.container.querySelector('.strands-thread');
        if (!svg) { return; }
        const grid = this.container.querySelector('#strands-grid');
        if (!grid) { return; }
        const gb = grid.getBoundingClientRect();
        const pts = this.selectedPath.map(pos => {
            const cell = grid.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`);
            const c = this.getCellCenter(cell);
            return `${(c.x - gb.left).toFixed(1)},${(c.y - gb.top).toFixed(1)}`;
        }).join(' ');
        svg.setAttribute('viewBox', `0 0 ${gb.width} ${gb.height}`);
        svg.innerHTML = pts ? `<polyline points="${pts}" fill="none" stroke="#19c3d6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>` : '';
    }

    updateCurrentWord() {
        this.currentWord = this.selectedPath.map(pos => 
            this.grid[pos.row][pos.col]
        ).join('');
        
        const currentWordEl = document.getElementById('current-word');
        if (currentWordEl) {
            currentWordEl.textContent = this.currentWord || '_';
        }
        
        const submitBtn = document.getElementById('submit-word');
        if (submitBtn) {
            // FIX #6: Minimum word length is 4, not 3
            submitBtn.disabled = this.currentWord.length < 4;
        }
    }

    highlightSelectedPath() {
        // Remove all selection highlights
        this.container.querySelectorAll('.strands-cell').forEach(cell => {
            cell.classList.remove('selected', 'first', 'last');
        });
        
        // Highlight current path
        this.selectedPath.forEach((pos, index) => {
            const cell = this.container.querySelector(
                `[data-row="${pos.row}"][data-col="${pos.col}"]`
            );
            if (cell) {
                cell.classList.add('selected');
                if (index === 0) {cell.classList.add('first');}
                if (index === this.selectedPath.length - 1) {cell.classList.add('last');}
            }
        });
        this.drawThread();
    }

    clearSelection() {
        this.selectedPath = [];
        this.currentWord = '';
        this.updateCurrentWord();
        this.highlightSelectedPath();
        const svg = this.container.querySelector('.strands-thread');
        if (svg) { svg.innerHTML = ''; }
    }

    submitWord() {
        // FIX #6: Minimum word length is 4
        if (this.currentWord.length < 4) {
            this.showMessage('Word must be at least 4 letters', 'error');
            return;
        }

        if (this.foundWords.includes(this.currentWord)) {
            this.showMessage(`"${this.currentWord}" already found!`, 'warning');
            this.clearSelection();
            return;
        }

        // Check if it's a theme word (answer or spangram)
        const isThemeWord = this.answers.includes(this.currentWord) || this.currentWord === this.spangram;
        
        // Check if it's a valid dictionary word (for hint system)
        // Use the broad Strands dictionary (4-10 letter English), NOT the
        // 5-letter Wordle list, so any real traced word counts toward hints.
        const isValidDictWord = unifiedDictionary && unifiedDictionary.isValidWord(this.currentWord);
        const isTraceable = this.isWordTraceable(this.currentWord);

        if (isThemeWord) {
            // Found a correct theme word
            this.foundWords.push(this.currentWord);
            this.showMessage(`"${this.currentWord}" found!`, 'success');
            vhsEffects.playSuccess();
            vhsEffects.colorShift();
            tapeQualitySystem.increaseQuality(5);

            // Mark cells as found — with the keyword's own color, and clear any
            // prior hint highlight so a solved hint square takes the keyword color.
            // Spangram gets its own gold slot (index === answers.length).
            const colorIndex = this.answers.includes(this.currentWord)
                ? this.answers.indexOf(this.currentWord)
                : 'spangram';
            this.selectedPath.forEach(pos => {
                const cell = this.container.querySelector(
                    `[data-row="${pos.row}"][data-col="${pos.col}"]`
                );
                if (cell) {
                    cell.classList.remove('hint-revealed');
                    cell.classList.add('found', `found-${colorIndex}`);
                }
            });

            // Check spangram
            if (this.currentWord === this.spangram) {
                this.spangramFound = true;
                this.showMessage('SPANGRAM FOUND!', 'success');
            }

            this.updateFoundWordsDisplay();
            this.clearSelection();

            // Win only when ALL answers AND spangram are found
            const allAnswersFound = this.answers.every(word => this.foundWords.includes(word));
            if (allAnswersFound && this.spangramFound) {
                this.completeGame(true);
            }
        } else if (isValidDictWord && isTraceable) {
            // Valid non-theme word - count toward hints
            this.nonThemeWords.push(this.currentWord);
            this.showMessage(`"${this.currentWord}" - Valid word!`, 'success');
            vhsEffects.playSuccess();
            this.clearSelection();
            this.checkHintSystem();
        } else if (isValidDictWord && !isTraceable) {
            // Real English word, but those exact letters aren't adjacent on
            // THIS board (easy to misread one cell on a scrambled grid).
            // Echo the traced letters so a near-miss is obvious, give no hint
            // (not placeable), and never burn a mistake.
            this.showMessage(`"${this.currentWord}" is a word, but not on this board`, 'warning');
            this.clearSelection();
        } else {
            // Non-fatal: a wrong/non-word trace never locks the grid.
            this.mistakes++;
            this.showMessage(`"${this.currentWord}" not found`, 'error');
            vhsEffects.playError();
            vhsEffects.shake();
            tapeQualitySystem.decreaseQuality(10);

            // Show invalid feedback
            this.selectedPath.forEach(pos => {
                const cell = this.container.querySelector(
                    `[data-row="${pos.row}"][data-col="${pos.col}"]`
                );
                if (cell) {
                    cell.classList.add('invalid-temp');
                    setTimeout(() => cell.classList.remove('invalid-temp'), 600);
                }
            });

            setTimeout(() => this.clearSelection(), 800);
        }
    }

    /**
     * Check if the current selected path traces a valid word on the grid
     */
    isWordTraceable(word) {
        // The current selected path already traces the word
        const pathWord = this.selectedPath.map(pos => this.grid[pos.row][pos.col]).join('');
        return pathWord === word;
    }

    /**
     * Hint system: every 3 valid non-theme words auto-reveals the
     * next unrevealed theme word by highlighting its path on the grid.
     */
    checkHintSystem() {
        const hintCount = Math.floor(this.nonThemeWords.length / 3);
        const revealedCount = this.hintRevealedWords.length;

        if (hintCount > revealedCount) {
            const unrevealed = this.answers.filter(word =>
                !this.foundWords.includes(word) && !this.hintRevealedWords.includes(word)
            );
            if (unrevealed.length > 0) {
                const hintWord = unrevealed[0];
                this.hintRevealedWords.push(hintWord);
                this.revealHintWord(hintWord);
                this.showMessage(`HINT: "${hintWord}" revealed!`, 'warning');
            }
        }

        this.updateHintDisplay();
    }

    /**
     * Visually reveal a hint word on the grid by highlighting its path.
     */
    revealHintWord(word) {
        const validator = new StrandsValidator();
        const paths = validator.findAllPaths(this.grid, word);
        if (paths.length > 0) {
            paths[0].forEach(pos => {
                const cell = this.container.querySelector(
                    `[data-row="${pos.row}"][data-col="${pos.col}"]`
                );
                if (cell) { cell.classList.add('hint-revealed'); }
            });
        }
    }

    /**
     * Update hint counter display (reset on a fresh game).
     */
    updateHintDisplay() {
        const hintEl = document.getElementById('hint-counter');
        if (hintEl) {
            const progress = this.nonThemeWords.length % 3;
            const hintsEarned = Math.floor(this.nonThemeWords.length / 3);
            const hintText = hintsEarned > 0
                ? `Hints: ${hintsEarned} | Next hint: ${progress}/3`
                : `Next hint: ${progress}/3`;
            hintEl.textContent = hintText;
        }
    }

    updateFoundWordsDisplay() {
        const wordListEl = this.container.querySelector('.word-list');
        if (wordListEl) {
            wordListEl.innerHTML = this.foundWords.map(word => {
                const idx = this.answers.indexOf(word);
                const colorClass = idx >= 0 ? `found-word-${idx}` : 'found-word-spangram';
                return `<span class="found-word ${colorClass}">${word}</span>`;
            }).join('');
        }
    }

    showMessage(text, type) {
        const messageEl = document.getElementById('strands-message');
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.className = `strands-message ${type}`;
            setTimeout(() => {
                messageEl.textContent = '';
            }, 3000);
        }
    }

    completeGame(won) {
        this.isComplete = true;
        this.stopTimer();
        
        const controls = this.container.querySelector('.strands-controls');
        if (controls) {controls.innerHTML = '';}
        
        if (won) {
            tapeQualitySystem.increaseQuality(10);
            this.showMessage('All threads unraveled!', 'success');
            
            if (window.avatarController && typeof window.avatarController.onCorrectGuess === 'function') {
                window.avatarController.onCorrectGuess();
            }
            
            const continueBtn = document.createElement('button');
            continueBtn.className = 'strands-btn primary';
            continueBtn.textContent = 'Continue';
            continueBtn.addEventListener('click', () => {
                eventManager.emit('gameComplete', true);
            });
            controls.appendChild(continueBtn);
        } else {
            this.showMessage('The web remains tangled...', 'error');
            
            const retryBtn = document.createElement('button');
            retryBtn.className = 'strands-btn';
            retryBtn.textContent = 'Rewind Scene';
            retryBtn.addEventListener('click', () => {
                eventManager.emit('rewindRequested');
            });
            controls.appendChild(retryBtn);
        }
    }

    cleanup() {
        this.stopTimer();
        this.isDragging = false;
        this.selectedPath = [];
        this.currentWord = '';
        
        // Clean up touch listeners
        if (this._touchListeners) {
            this._touchListeners.forEach(({element, event, handler}) => {
                element.removeEventListener(event, handler);
            });
            this._touchListeners = [];
        }
        
        cleanupManager.cleanupAll();
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.StrandsGame = StrandsGame;
}

