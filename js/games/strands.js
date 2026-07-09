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
                this.startSelection(cell);
            });
            
            cleanupManager.addListener(cell, 'mouseenter', () => {
                if (this.isDragging) {
                    this.continueSelection(cell);
                }
            });
        });

        // Global mouse up to end drag
        cleanupManager.addListener(document, 'mouseup', () => {
            this.isDragging = false;
        });

        // Touch support - registered with cleanupManager
        const touchStartHandler = (e) => {
            const touch = e.touches[0];
            const cell = document.elementFromPoint(touch.clientX, touch.clientY);
            if (cell && cell.classList.contains('strands-cell')) {
                e.preventDefault();
                this.isDragging = true;
                this.startSelection(cell);
            }
        };
        
        const touchMoveHandler = (e) => {
            if (!this.isDragging) {return;}
            e.preventDefault();
            const touch = e.touches[0];
            const cell = document.elementFromPoint(touch.clientX, touch.clientY);
            if (cell && cell.classList.contains('strands-cell')) {
                this.continueSelection(cell);
            }
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
        
        // Check adjacency to last selected cell
        if (this.selectedPath.length > 0) {
            const lastPos = this.selectedPath[this.selectedPath.length - 1];
            if (!this.isAdjacent({row, col}, lastPos)) {
                return;
            }
        }
        
        this.selectedPath.push({row, col});
        this.updateCurrentWord();
        this.highlightSelectedPath();
    }

    isAdjacent(pos1, pos2) {
        const rowDiff = Math.abs(pos1.row - pos2.row);
        const colDiff = Math.abs(pos1.col - pos2.col);
        return rowDiff <= 1 && colDiff <= 1 && (rowDiff !== 0 || colDiff !== 0);
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
    }

    clearSelection() {
        this.selectedPath = [];
        this.currentWord = '';
        this.updateCurrentWord();
        this.highlightSelectedPath();
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
        const isValidDictWord = strandsDictionary && strandsDictionary.isValidWord(this.currentWord);
        const isTraceable = this.isWordTraceable(this.currentWord);

        if (isThemeWord) {
            // Found a correct theme word
            this.foundWords.push(this.currentWord);
            this.showMessage(`"${this.currentWord}" found!`, 'success');
            vhsEffects.playSuccess();
            vhsEffects.colorShift();
            tapeQualitySystem.increaseQuality(5);

            // Mark cells as found
            this.selectedPath.forEach(pos => {
                const cell = this.container.querySelector(
                    `[data-row="${pos.row}"][data-col="${pos.col}"]`
                );
                if (cell) {cell.classList.add('found');}
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
            // THIS board (easy to misread on a scrambled grid). NYT behaviour:
            // acknowledge it, give no hint (not placeable), and never burn a
            // mistake — only true non-words cost a mistake.
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
            wordListEl.innerHTML = this.foundWords.map(word => 
                `<span class="found-word">${word}</span>`
            ).join('');
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

