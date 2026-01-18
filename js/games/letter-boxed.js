// Letter Boxed Game - Confined Clues
// Horror detective theme implementation

class LetterBoxedGame extends BaseGame {
    constructor(containerId, puzzle) {
        super(containerId, puzzle);
        this.sides = puzzle.sides;
        this.foundWords = [];
        this.currentWord = '';
        this.gameComplete = false;
        
        this.init();
    }

    render() {
        const html = `
            <div class="letter-boxed-container">
                <div class="letter-boxed-header">
                    <h2>CONFINED CLUES</h2>
                    <p class="horror-hint">${this.gameData.hint}</p>
                </div>
                
                <div id="letter-boxed-grid" class="letter-boxed-grid">
                    ${this.renderLetterSides()}
                </div>
                
                <div class="letter-boxed-sidebar">
                    <div id="current-word" class="current-word">${this.currentWord || 'Form words using the letters'}</div>
                    <div id="found-words" class="found-words">
                        <h3>Found Words:</h3>
                        <div class="word-list"></div>
                    </div>
                    <div class="letter-boxed-controls">
                        <button id="clear-word">Clear</button>
                        <button id="submit-word">Submit</button>
                    </div>
                </div>
                
                <div id="letter-boxed-message" class="letter-boxed-message"></div>
            </div>
        `;
        
        this.container.innerHTML = html;
    }

    renderLetterSides() {
        let sidesHtml = '';
        
        this.sides.forEach((side, sideIndex) => {
            sidesHtml += `
                <div class="letter-side side-${sideIndex}">
                    ${side.map(letter => `
                        <div class="letter-tile" data-letter="${letter}" data-side="${sideIndex}">
                            ${letter}
                        </div>
                    `).join('')}
                </div>
            `;
        });
        
        return sidesHtml;
    }

    setupEventListeners() {
        const grid = this.container.querySelector('#letter-boxed-grid');
        
        // Letter selection
        grid.addEventListener('click', (e) => {
            const tile = e.target.closest('.letter-tile');
            if (tile) {
                this.addLetter(tile.dataset.letter);
            }
        });
        
        // Button handlers
        this.container.querySelector('#clear-word').addEventListener('click', () => this.clearWord());
        this.container.querySelector('#submit-word').addEventListener('click', () => this.submitWord());
    }

    addLetter(letter) {
        // Check if letter is valid (must be from different side than last letter)
        if (this.currentWord.length > 0) {
            const lastLetter = this.currentWord[this.currentWord.length - 1];
            const lastSide = this.getLetterSide(lastLetter);
            const currentSide = this.getLetterSide(letter);
            
            if (lastSide === currentSide) {
                this.showMessage('Letters must be from different sides', 'error');
                return;
            }
        }
        
        this.currentWord += letter;
        this.updateCurrentWord();
        this.updateGrid();
    }

    getLetterSide(letter) {
        for (let sideIndex = 0; sideIndex < this.sides.length; sideIndex++) {
            if (this.sides[sideIndex].includes(letter)) {
                return sideIndex;
            }
        }
        return -1;
    }

    clearWord() {
        this.currentWord = '';
        this.updateCurrentWord();
        this.updateGrid();
    }

    submitWord() {
        if (this.currentWord.length < 3) {
            this.showMessage('Word must be at least 3 letters', 'error');
            return;
        }
        
        // Check if word uses only available letters
        const allLetters = this.sides.flat();
        const isValid = this.currentWord.split('').every(letter => allLetters.includes(letter));
        
        if (!isValid) {
            this.showMessage('Word contains invalid letters', 'error');
            return;
        }
        
        // Check if word alternates sides properly
        for (let i = 1; i < this.currentWord.length; i++) {
            const prevSide = this.getLetterSide(this.currentWord[i - 1]);
            const currSide = this.getLetterSide(this.currentWord[i]);
            
            if (prevSide === currSide) {
                this.showMessage('Letters must alternate between sides', 'error');
                return;
            }
        }
        
        // Check if word is already found
        if (this.foundWords.includes(this.currentWord)) {
            this.showMessage('Word already found', 'warning');
            return;
        }
        
        // Valid word found
        this.foundWords.push(this.currentWord);
        this.showMessage('Word found!', 'success');
        vhsEffects.playSuccess();
        tapeQualitySystem.increaseQuality(5);
        this.updateFoundWords();
        this.clearWord();
    }

    updateCurrentWord() {
        const currentWordEl = this.container.querySelector('#current-word');
        currentWordEl.textContent = this.currentWord || 'Form words using the letters';
    }

    updateGrid() {
        const tiles = this.container.querySelectorAll('.letter-tile');
        tiles.forEach(tile => {
            const letter = tile.dataset.letter;
            const isUsed = this.currentWord.includes(letter);
            tile.classList.toggle('used', isUsed);
        });
    }

    updateFoundWords() {
        const wordListEl = this.container.querySelector('.word-list');
        wordListEl.innerHTML = this.foundWords.map(word => `
            <div class="found-word">${word}</div>
        `).join('');
    }

    showMessage(text, type) {
        const messageEl = this.container.querySelector('#letter-boxed-message');
        messageEl.textContent = text;
        messageEl.className = `letter-boxed-message ${type}`;
        
        setTimeout(() => {
            messageEl.textContent = '';
        }, 3000);
    }
}