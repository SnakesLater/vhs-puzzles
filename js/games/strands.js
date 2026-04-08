// Strands Game - Web of Horror Connections

class StrandsGame extends BaseGame {
    constructor(containerId, puzzle) {
        super(containerId, puzzle);
        
        // Fallback test puzzle if no puzzle provided
        if (!puzzle) {
            this.theme = "TEST PUZZLE";
            this.answers = ["TEST", "WORD", "GRID", "FIND"];
            this.spangram = "TESTWORD";
            this.grid = [
                ['T', 'E', 'S', 'T', 'W', 'O', 'R', 'D'],
                ['G', 'R', 'I', 'D', 'F', 'I', 'N', 'D'],
                ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
                ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
                ['Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'],
                ['Y', 'Z', 'A', 'B', 'C', 'D', 'E', 'F']
            ];
        } else {
            this.theme = puzzle.theme;
            this.answers = puzzle.answers || [];
            this.spangram = puzzle.spangram;
            this.grid = puzzle.grid;
        }
        
        this.foundWords = [];
        this.selectedPath = [];
        this.currentWord = '';
        this.spangramFound = false;
        this.mistakes = 0;
        this.maxMistakes = 4;
        this.isDragging = false;
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
                    <div class="strands-controls">
                        <button id="clear-selection">Clear</button>
                        <button id="submit-word" disabled>Submit</button>
                    </div>
                </div>
                
                <div id="strands-message" class="strands-message"></div>
            </div>
        `;
        
        this.container.innerHTML = html;
    }

    renderLetterGrid() {
        // SAFETY CHECK: Ensure grid always exists
        if (!this.grid || !Array.isArray(this.grid) || this.grid.length === 0) {
            this.grid = [
                ['T', 'E', 'S', 'T', 'W', 'O', 'R', 'D'],
                ['G', 'R', 'I', 'D', 'F', 'I', 'N', 'D'],
                ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
                ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
                ['Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'],
                ['Y', 'Z', 'A', 'B', 'C', 'D', 'E', 'F']
            ];
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

        // Touch support
        this.container.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const cell = document.elementFromPoint(touch.clientX, touch.clientY);
            if (cell && cell.classList.contains('strands-cell')) {
                e.preventDefault();
                this.isDragging = true;
                this.startSelection(cell);
            }
        }, { passive: false });

        this.container.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            const touch = e.touches[0];
            const cell = document.elementFromPoint(touch.clientX, touch.clientY);
            if (cell && cell.classList.contains('strands-cell')) {
                this.continueSelection(cell);
            }
        }, { passive: false });

        this.container.addEventListener('touchend', () => {
            this.isDragging = false;
        });

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
            submitBtn.disabled = this.currentWord.length < 3;
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
                if (index === 0) cell.classList.add('first');
                if (index === this.selectedPath.length - 1) cell.classList.add('last');
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
        if (this.currentWord.length < 3) {
            this.showMessage('Word must be at least 3 letters', 'error');
            return;
        }

        if (this.foundWords.includes(this.currentWord)) {
            this.showMessage(`"${this.currentWord}" already found!`, 'warning');
            this.clearSelection();
            return;
        }

        if (this.answers.includes(this.currentWord)) {
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
                if (cell) cell.classList.add('found');
            });
            
            // Check spangram
            if (this.currentWord === this.spangram) {
                this.spangramFound = true;
                this.showMessage('SPANGRAM FOUND!', 'success');
            }
            
            this.updateFoundWordsDisplay();
            this.clearSelection();
            
            // Check win condition
            if (this.foundWords.length >= 3) {
                this.completeGame(true);
            }
        } else {
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
            
            if (this.mistakes >= this.maxMistakes) {
                this.completeGame(false);
            } else {
                setTimeout(() => this.clearSelection(), 800);
            }
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
        if (controls) controls.innerHTML = '';
        
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
        cleanupManager.cleanupAll();
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.StrandsGame = StrandsGame;
}
