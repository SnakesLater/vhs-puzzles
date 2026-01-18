// Wordle Game - Horror Detective Theme

class WordleGame extends BaseGame {
    constructor(containerId, puzzle) {
        super(containerId, puzzle);
        this.secretWord = puzzle.targetWord.toUpperCase();
        this.currentGuess = '';
        this.guesses = [];
        this.maxGuesses = 6;
        this.currentRow = 0;
        this.gameComplete = false;
        
        this.init();
    }

    render() {
        const html = `
            <div class="wordle-container">
                <div class="wordle-header">
                    <h2>WORD DETECTIVE</h2>
                    <p class="horror-hint">${this.gameData.hint}</p>
                </div>
                
                <div id="wordle-grid" class="wordle-grid">
                    ${this.renderGrid()}
                </div>
                
                <div id="wordle-keyboard" class="wordle-keyboard">
                    ${this.renderKeyboard()}
                </div>
                
                <div id="wordle-message" class="wordle-message"></div>
            </div>
        `;
        
        this.container.innerHTML = html;
    }

    renderGrid() {
        let gridHtml = '';
        const wordLength = this.secretWord.length;
        
        for (let row = 0; row < this.maxGuesses; row++) {
            gridHtml += '<div class="wordle-row">';
            for (let col = 0; col < wordLength; col++) {
                const letter = this.guesses[row]?.[col] || '';
                gridHtml += `
                    <div class="wordle-tile ${this.getTileClass(row, col)}" data-row="${row}" data-col="${col}">
                        ${letter}
                    </div>
                `;
            }
            gridHtml += '</div>';
        }
        
        return gridHtml;
    }

    getTileClass(row, col) {
        if (row >= this.currentRow) return '';
        
        const guess = this.guesses[row];
        const letter = guess[col];
        const secretLetter = this.secretWord[col];
        
        if (letter === secretLetter) {
            return 'correct';
        } else if (this.secretWord.includes(letter)) {
            return 'present';
        } else {
            return 'absent';
        }
    }

    renderKeyboard() {
        const rows = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
        ];

        return rows.map(row => `
            <div class="keyboard-row">
                ${row.map(key => `
                    <button class="key-btn" data-key="${key}">
                        ${key}
                    </button>
                `).join('')}
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Physical keyboard
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // On-screen keyboard
        const keyboard = this.container.querySelector('#wordle-keyboard');
        keyboard.addEventListener('click', (e) => {
            if (e.target.classList.contains('key-btn')) {
                const key = e.target.dataset.key;
                this.handleKeyPress(key);
            }
        });
    }

    handleKeyDown(e) {
        if (this.gameComplete) return;
        
        const key = e.key.toUpperCase();
        
        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === 'BACKSPACE') {
            this.removeLetter();
        } else if (/^[A-Z]$/.test(key)) {
            this.addLetter(key);
        }
    }

    handleKeyPress(key) {
        if (this.gameComplete) return;
        
        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === 'BACK') {
            this.removeLetter();
        } else if (/^[A-Z]$/.test(key)) {
            this.addLetter(key);
        }
    }

    addLetter(letter) {
        if (this.currentGuess.length < this.secretWord.length) {
            this.currentGuess += letter;
            this.updateGrid();
        }
    }

    removeLetter() {
        if (this.currentGuess.length > 0) {
            this.currentGuess = this.currentGuess.slice(0, -1);
            this.updateGrid();
        }
    }

    submitGuess() {
        if (this.currentGuess.length !== this.secretWord.length) {
            this.showMessage('Not enough letters', 'error');
            return;
        }

        this.guesses.push(this.currentGuess);
        this.currentRow++;
        
        if (this.currentGuess === this.secretWord) {
            this.showMessage('DETECTED!', 'success');
            vhsEffects.playSuccess();
            tapeQualitySystem.increaseQuality(10);
            this.gameComplete = true;
            this.completeGame(true);
            return;
        }
        
        if (this.currentRow === this.maxGuesses) {
            this.showMessage(`GAME OVER - The word was: ${this.secretWord}`, 'error');
            vhsEffects.playError();
            tapeQualitySystem.decreaseQuality(15);
            this.gameComplete = true;
            this.completeGame(false);
            return;
        }
        
        this.currentGuess = '';
        this.updateGrid();
        this.updateKeyboard();
    }

    updateGrid() {
        const tiles = this.container.querySelectorAll('.wordle-tile');
        const currentGuessIndex = this.currentRow * this.secretWord.length;
        
        for (let i = 0; i < this.secretWord.length; i++) {
            const tileIndex = currentGuessIndex + i;
            if (tileIndex < tiles.length) {
                const tile = tiles[tileIndex];
                tile.textContent = this.currentGuess[i] || '';
                tile.className = 'wordle-tile';
            }
        }
    }

    updateKeyboard() {
        const keys = this.container.querySelectorAll('.key-btn');
        const usedLetters = new Set();
        
        this.guesses.forEach(guess => {
            guess.split('').forEach(letter => usedLetters.add(letter));
        });
        
        keys.forEach(key => {
            const letter = key.dataset.key;
            if (letter.length === 1 && usedLetters.has(letter)) {
                const row = this.guesses.findIndex(guess => guess.includes(letter));
                if (row !== -1) {
                    const guess = this.guesses[row];
                    const col = guess.indexOf(letter);
                    const secretLetter = this.secretWord[col];
                    
                    if (letter === secretLetter) {
                        key.classList.add('correct');
                    } else if (this.secretWord.includes(letter)) {
                        key.classList.add('present');
                    } else {
                        key.classList.add('absent');
                    }
                }
            }
        });
    }

    showMessage(text, type) {
        const messageEl = this.container.querySelector('#wordle-message');
        messageEl.textContent = text;
        messageEl.className = `wordle-message ${type}`;
        
        setTimeout(() => {
            messageEl.textContent = '';
        }, 3000);
    }
}