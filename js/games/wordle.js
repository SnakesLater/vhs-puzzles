// Wordle Game - Standalone Module

class WordleGame {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.wordLength = options.wordLength || 5;
        this.maxGuesses = options.maxGuesses || 6;
        this.answer = this.getRandomAnswer();
        this.guesses = [];
        this.gameOver = false;
        this.won = false;
        
        this.render();
        this.setupEventListeners();
    }

    // Get a random 5-letter word from the dictionary each time - no puzzle data needed!
    getRandomAnswer() {
        // Try unifiedDictionary first (broad 4-10 letter list)
        if (unifiedDictionary.loaded) {
            const word = unifiedDictionary.getRandomWord(5);
            if (word) {return word;}
        }
        
        // Fallback to hardcoded list
        const wordList = [
            "CRANE", "SLATE", "CRISP", "PLANT", "CHAIR",
            "TABLE", "HOUSE", "WATER", "MUSIC", "PHONE",
            "VIDEO", "MOVIE", "BOOKS", "PAPER", "PENCIL",
            "WINDOW", "DOOR", "LIGHT", "DARK", "SHADOW",
            "GHOST", "BLOOD", "KNIFE", "SCARE", "DREAD"
        ];
        return wordList[Math.floor(Math.random() * wordList.length)];
    }

    render() {
        const html = `
            <div class="wordle-container">
                <div class="wordle-header">
                    <h2>WORDLE</h2>
                    <div class="wordle-status">
                        <span id="wordle-guesses-left">${this.maxGuesses - this.guesses.length}</span> guesses left
                    </div>
                </div>
                
                <div class="wordle-grid">
                    ${this.renderGrid()}
                </div>
                
                <div class="wordle-input">
                    <input type="text" id="wordle-input" maxlength="5" placeholder="Type a word">
                    <button id="wordle-submit">Enter</button>
                </div>
                
                <div class="wordle-message" id="wordle-message"></div>
            </div>
        `;
        
        this.container.innerHTML = html;
    }

    renderGrid() {
        let gridHTML = '';
        
        for (let row = 0; row < this.maxGuesses; row++) {
            gridHTML += '<div class="wordle-row">';
            for (let col = 0; col < this.wordLength; col++) {
                gridHTML += '<div class="wordle-tile" data-row="' + row + '" data-col="' + col + '"></div>';
            }
            gridHTML += '</div>';
        }
        
        return gridHTML;
    }

    setupEventListeners() {
        this.input = document.getElementById('wordle-input');
        this.submitBtn = document.getElementById('wordle-submit');
        this.message = document.getElementById('wordle-message');
        
        this.submitBtn.addEventListener('click', () => this.handleSubmit());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSubmit();
            }
        });
    }

    handleSubmit() {
        if (this.gameOver) {return;}
        
        const guess = this.input.value.toUpperCase().trim();
        
        if (!this.isValidWord(guess)) {
            this.showMessage("Please enter a valid 5-letter word", "error");
            return;
        }
        
        if (this.guesses.includes(guess)) {
            this.showMessage("You already guessed that word", "error");
            return;
        }
        
        this.makeGuess(guess);
    }

    isValidWord(word) {
        if (word.length !== this.wordLength || !/^[A-Z]+$/.test(word)) {
            return false;
        }
        
        if (unifiedDictionary.loaded) {
            return unifiedDictionary.isValidWord(word);
        }
        
        return true;
    }

    makeGuess(guess) {
        this.guesses.push(guess);
        
        // Calculate feedback
        const feedback = this.getFeedback(guess, this.answer);
        
        // Update grid
        this.updateGrid(this.guesses.length - 1, guess, feedback);
        
        // Check for win
        if (guess === this.answer) {
            this.winGame();
        } 
        // Check for loss
        else if (this.guesses.length === this.maxGuesses) {
            this.loseGame();
        } 
        // Continue game
        else {
            this.input.value = '';
            this.updateStatus();
        }
    }

    getFeedback(guess, answer) {
        const feedback = [];
        const guessLetters = guess.split('');
        const answerLetters = answer.split('');
        const tempAnswer = [...answerLetters];
        
        // First pass: exact matches (green)
        for (let i = 0; i < guessLetters.length; i++) {
            if (guessLetters[i] === answerLetters[i]) {
                feedback[i] = 'G';
                tempAnswer[i] = null; // Mark as used
            }
        }
        
        // Second pass: wrong position matches (yellow)
        for (let i = 0; i < guessLetters.length; i++) {
            if (feedback[i] !== 'G') {
                const index = tempAnswer.indexOf(guessLetters[i]);
                if (index !== -1) {
                    feedback[i] = 'Y';
                    tempAnswer[index] = null;
                } else {
                    feedback[i] = 'X';
                }
            }
        }
        
        // Third pass: no matches (gray)
        for (let i = 0; i < guessLetters.length; i++) {
            if (!feedback[i]) {
                feedback[i] = 'X';
            }
        }
        
        return feedback;
    }

    updateGrid(row, guess, feedback) {
        const tiles = this.container.querySelectorAll(`.wordle-tile[data-row="${row}"]`);
        
        guess.split('').forEach((letter, index) => {
            const tile = tiles[index];
            tile.textContent = letter;
            tile.className = `wordle-tile ${this.getFeedbackClass(feedback[index])}`;
        });
    }

    getFeedbackClass(feedback) {
        const classes = {
            'G': 'green',
            'Y': 'yellow',
            'X': 'gray'
        };
        return classes[feedback] || '';
    }

    updateStatus() {
        const guessesLeft = document.getElementById('wordle-guesses-left');
        guessesLeft.textContent = this.maxGuesses - this.guesses.length;
    }

    winGame() {
        this.gameOver = true;
        this.won = true;
        this.showMessage("🎉 You got it! The word was " + this.answer, "success");
        this.highlightAnswer();
    }

    loseGame() {
        this.gameOver = true;
        this.won = false;
        this.showMessage("😔 Game over! The word was " + this.answer, "error");
        this.highlightAnswer();
    }

    highlightAnswer() {
        const answer = this.answer.split('');
        const tiles = this.container.querySelectorAll(`.wordle-tile`);
        
        tiles.forEach((tile, index) => {
            if (index < answer.length) {
                tile.textContent = answer[index];
                tile.className = `wordle-tile green`;
            }
        });
    }

    showMessage(text, type) {
        this.message.textContent = text;
        this.message.className = `wordle-message ${type}`;
        
        setTimeout(() => {
            this.message.textContent = '';
        }, 5000);
    }

    // Cleanup method for proper resource disposal
    cleanup() {
        this.submitBtn.removeEventListener('click', this.handleSubmit);
        this.input.removeEventListener('keypress', this.handleKeyPress);
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.WordleGame = WordleGame;
} else {
    module.exports = WordleGame;
}

// Add audio support if available
if (typeof window !== 'undefined' && window.vhsEffects) {
    window.WordleGame.prototype.playClick = window.vhsEffects.playClick;
    window.WordleGame.prototype.playSuccess = window.vhsEffects.playSuccess;
    window.WordleGame.prototype.playError = window.vhsEffects.playError;
}
