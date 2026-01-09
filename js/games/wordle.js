// Wordle Game - Horror Detective Theme
// TODO: Agent W - Complete this implementation

class WordleGame extends BaseGame {
    constructor(containerId, puzzle) {
        super(containerId, puzzle);
        this.secretWord = puzzle.secretWord.toUpperCase();
        this.currentGuess = '';
        this.guesses = [];
        this.maxGuesses = 6;
        this.currentRow = 0;
    }

    render() {
        const html = `
            <div class="wordle-container">
                <div class="wordle-header">
                    <h2>WORD DETECTIVE</h2>
                    <p class="horror-hint">The victim's last word holds the key...</p>
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
        // TODO: Agent W - Create 6x5 grid of letter tiles
        // Each tile should have states: empty, filled, correct, present, absent
        return '';
    }

    renderKeyboard() {
        // TODO: Agent W - Create QWERTY keyboard with click handlers
        // Keys should show correct/present/absent states
        return '';
    }

    setupEventListeners() {
        // TODO: Agent W - Add keyboard event listeners
        // Handle physical keyboard input
        // Handle on-screen keyboard clicks
        // Implement Enter and Backspace functionality
    }

    // TODO: Agent W - Implement these methods:
    // addLetter(letter)
    // removeLetter()
    // submitGuess()
    // checkGuess(guess)
    // updateGrid()
    // updateKeyboard()
    // showMessage(text, type)
}

// Export for use in main.js
// TODO: Agent W - Test with sample puzzle data