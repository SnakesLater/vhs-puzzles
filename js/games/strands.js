// Strands Game - Web of Horror Connections

class StrandsGame extends BaseGame {
    constructor(containerId, puzzle) {
        super(containerId, puzzle);
        this.theme = puzzle.theme;
        this.words = puzzle.words;
        this.spangram = puzzle.spangram || this.generateSpangram();
        this.foundWords = [];
        this.selectedPath = [];
        this.grid = this.generateGrid();
        this.gameComplete = false;
        
        this.init();
    }

    generateSpangram() {
        // Create a word that connects all theme words
        const themeWords = this.words.join('');
        const uniqueLetters = [...new Set(themeWords.split(''))];
        return uniqueLetters.slice(0, 8).join('').toUpperCase();
    }

    generateGrid() {
        // Create 6x8 grid with theme words embedded
        const rows = 6;
        const cols = 8;
        const grid = Array(rows).fill().map(() => Array(cols).fill(''));
        
        // Fill with random letters first
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
        
        // Place theme words in the grid
        this.words.forEach(word => {
            this.placeWordInGrid(grid, word);
        });
        
        return grid;
    }

    placeWordInGrid(grid, word) {
        const rows = grid.length;
        const cols = grid[0].length;
        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0], // horizontal/vertical
            [1, 1], [1, -1], [-1, 1], [-1, -1] // diagonal
        ];
        
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 100) {
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const startRow = Math.floor(Math.random() * rows);
            const startCol = Math.floor(Math.random() * cols);
            
            // Check if word fits
            let fits = true;
            for (let i = 0; i < word.length; i++) {
                const r = startRow + dir[0] * i;
                const c = startCol + dir[1] * i;
                if (r < 0 || r >= rows || c < 0 || c >= cols) {
                    fits = false;
                    break;
                }
            }
            
            if (fits) {
                // Place the word
                for (let i = 0; i < word.length; i++) {
                    const r = startRow + dir[0] * i;
                    const c = startCol + dir[1] * i;
                    grid[r][c] = word[i];
                }
                placed = true;
            }
            
            attempts++;
        }
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
                    <div id="current-word" class="current-word"></div>
                    <div id="found-words" class="found-words">
                        <h3>Found Words:</h3>
                        <div class="word-list"></div>
                    </div>
                    <div class="strands-controls">
                        <button id="clear-selection">Clear</button>
                        <button id="submit-word">Submit</button>
                    </div>
                </div>
                
                <div id="strands-message" class="strands-message"></div>
            </div>
        `;
        
        this.container.innerHTML = html;
    }

    renderLetterGrid() {
        let gridHtml = '';
        
        for (let row = 0; row < this.grid.length; row++) {
            gridHtml += '<div class="strands-row">';
            for (let col = 0; col < this.grid[row].length; col++) {
                const letter = this.grid[row][col];
                const isSelected = this.selectedPath.some(pos => pos.row === row && pos.col === col);
                const isFound = this.isLetterInFoundWord(row, col);
                
                gridHtml += `
                    <div class="strands-tile ${isSelected ? 'selected' : ''} ${isFound ? 'found' : ''}" 
                         data-row="${row}" data-col="${col}">
                        ${letter}
                    </div>
                `;
            }
            gridHtml += '</div>';
        }
        
        return gridHtml;
    }

    isLetterInFoundWord(row, col) {
        // Check if this letter is part of any found word
        return false; // Simplified for now
    }

    setupEventListeners() {
        const grid = this.container.querySelector('#strands-grid');
        
        // Mouse events for letter selection
        grid.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        grid.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        grid.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // Touch events for mobile
        grid.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        grid.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        grid.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Button handlers
        this.container.querySelector('#clear-selection').addEventListener('click', () => this.clearSelection());
        this.container.querySelector('#submit-word').addEventListener('click', () => this.submitWord());
    }

    handleMouseDown(e) {
        const tile = e.target.closest('.strands-tile');
        if (tile) {
            this.selectLetter(parseInt(tile.dataset.row), parseInt(tile.dataset.col));
        }
    }

    handleMouseMove(e) {
        if (!e.buttons) return;
        
        const tile = e.target.closest('.strands-tile');
        if (tile) {
            const row = parseInt(tile.dataset.row);
            const col = parseInt(tile.dataset.col);
            const lastPos = this.selectedPath[this.selectedPath.length - 1];
            
            if (lastPos && this.isAdjacent(lastPos, { row, col })) {
                this.selectLetter(row, col);
            }
        }
    }

    handleMouseUp() {
        // Selection complete
    }

    handleTouchStart(e) {
        const touch = e.touches[0];
        const tile = document.elementFromPoint(touch.clientX, touch.clientY);
        if (tile && tile.classList.contains('strands-tile')) {
            this.selectLetter(parseInt(tile.dataset.row), parseInt(tile.dataset.col));
        }
    }

    handleTouchMove(e) {
        const touch = e.touches[0];
        const tile = document.elementFromPoint(touch.clientX, touch.clientY);
        if (tile && tile.classList.contains('strands-tile')) {
            const row = parseInt(tile.dataset.row);
            const col = parseInt(tile.dataset.col);
            const lastPos = this.selectedPath[this.selectedPath.length - 1];
            
            if (lastPos && this.isAdjacent(lastPos, { row, col })) {
                this.selectLetter(row, col);
            }
        }
    }

    handleTouchEnd() {
        // Touch selection complete
    }

    selectLetter(row, col) {
        const pos = { row, col };
        
        // Check if already selected
        if (this.selectedPath.some(p => p.row === row && p.col === col)) {
            return;
        }
        
        // Check if adjacent to last selection
        if (this.selectedPath.length > 0) {
            const lastPos = this.selectedPath[this.selectedPath.length - 1];
            if (!this.isAdjacent(lastPos, pos)) {
                return;
            }
        }
        
        this.selectedPath.push(pos);
        this.updateGrid();
        this.updateCurrentWord();
    }

    isAdjacent(pos1, pos2) {
        const dr = Math.abs(pos1.row - pos2.row);
        const dc = Math.abs(pos1.col - pos2.col);
        return (dr <= 1 && dc <= 1) && !(dr === 0 && dc === 0);
    }

    clearSelection() {
        this.selectedPath = [];
        this.updateGrid();
        this.updateCurrentWord();
    }

    submitWord() {
        if (this.selectedPath.length < 3) {
            this.showMessage('Word must be at least 3 letters', 'error');
            return;
        }
        
        const word = this.getSelectedWord();
        
        if (this.words.includes(word) && !this.foundWords.includes(word)) {
            this.foundWords.push(word);
            this.showMessage('Word found!', 'success');
            vhsEffects.playSuccess();
            tapeQualitySystem.increaseQuality(5);
            this.updateFoundWords();
            this.clearSelection();
            
            // Check if all words found
            if (this.foundWords.length === this.words.length) {
                this.completeGame(true);
            }
        } else {
            this.showMessage('Not a valid word', 'error');
            vhsEffects.playError();
            tapeQualitySystem.decreaseQuality(5);
            this.clearSelection();
        }
    }

    getSelectedWord() {
        return this.selectedPath.map(pos => this.grid[pos.row][pos.col]).join('');
    }

    updateGrid() {
        const tiles = this.container.querySelectorAll('.strands-tile');
        tiles.forEach(tile => {
            const row = parseInt(tile.dataset.row);
            const col = parseInt(tile.dataset.col);
            const isSelected = this.selectedPath.some(pos => pos.row === row && pos.col === col);
            
            tile.classList.toggle('selected', isSelected);
        });
    }

    updateCurrentWord() {
        const currentWordEl = this.container.querySelector('#current-word');
        const word = this.getSelectedWord();
        currentWordEl.textContent = word || 'Select letters to form a word';
    }

    updateFoundWords() {
        const wordListEl = this.container.querySelector('.word-list');
        wordListEl.innerHTML = this.foundWords.map(word => `
            <div class="found-word">${word}</div>
        `).join('');
    }

    showMessage(text, type) {
        const messageEl = this.container.querySelector('#strands-message');
        messageEl.textContent = text;
        messageEl.className = `strands-message ${type}`;
        
        setTimeout(() => {
            messageEl.textContent = '';
        }, 3000);
    }
}