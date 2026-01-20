// Spelling Bee Game - Hive of Words
// Horror detective theme implementation

class SpellingBeeGame extends BaseGame {
    constructor(containerId, puzzle) {
        super(containerId, puzzle);
        this.letters = puzzle.letters;
        this.centerLetter = puzzle.centerLetter;
        this.foundWords = [];
        this.currentWord = '';
        this.gameComplete = false;
        
        this.init();
    }

    render() {
        const html = `
            <div class="spelling-bee-container">
                <div class="spelling-bee-header">
                    <h2>HIVE OF WORDS</h2>
                    <p class="horror-hint">${this.gameData.hint}</p>
                </div>
                
                <div id="spelling-bee-hive" class="spelling-bee-hive">
                    ${this.renderHive()}
                </div>
                
                <div class="spelling-bee-sidebar">
                    <div id="current-word" class="current-word">${this.currentWord || 'Form words using the letters'}</div>
                    <div id="found-words" class="found-words">
                        <h3>Found Words:</h3>
                        <div class="word-list"></div>
                    </div>
                    <div class="spelling-bee-controls">
                        <button id="clear-word">Clear</button>
                        <button id="submit-word">Submit</button>
                    </div>
                </div>
                
                <div id="spelling-bee-message" class="spelling-bee-message"></div>
            </div>
        `;
        
        this.container.innerHTML = html;
    }

    renderHive() {
        let hiveHtml = '<div class="hive-center">' + this.centerLetter + '</div>';
        
        this.letters.forEach(letter => {
            if (letter !== this.centerLetter) {
                hiveHtml += `<div class="hive-petal">${letter}</div>`;
            }
        });
        
        return hiveHtml;
    }

    setupEventListeners() {
        const hive = this.container.querySelector('#spelling-bee-hive');
        
        // Letter selection
        hive.addEventListener('click', (e) => {
            const petal = e.target.closest('.hive-petal, .hive-center');
            if (petal) {
                this.addLetter(petal.textContent);
            }
        });
        
        // Button handlers
        this.container.querySelector('#clear-word').addEventListener('click', () => this.clearWord());
        this.container.querySelector('#submit-word').addEventListener('click', () => this.submitWord());
    }

    addLetter(letter) {
        this.currentWord += letter;
        this.updateCurrentWord();
        this.updateHive();
    }

    clearWord() {
        this.currentWord = '';
        this.updateCurrentWord();
        this.updateHive();
    }

    submitWord() {
        if (this.currentWord.length < 4) {
            this.showMessage('Word must be at least 4 letters', 'error');
            return;
        }
        
        // Check if word contains center letter
        if (!this.currentWord.includes(this.centerLetter)) {
            this.showMessage('Word must contain the center letter', 'error');
            return;
        }
        
        // Check if word uses only available letters
        const isValid = this.currentWord.split('').every(letter => this.letters.includes(letter));
        
        if (!isValid) {
            this.showMessage('Word contains invalid letters', 'error');
            return;
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

    updateHive() {
        const petals = this.container.querySelectorAll('.hive-petal, .hive-center');
        petals.forEach(petal => {
            const letter = petal.textContent;
            const isUsed = this.currentWord.includes(letter);
            petal.classList.toggle('used', isUsed);
        });
    }

    updateFoundWords() {
        const wordListEl = this.container.querySelector('.word-list');
        wordListEl.innerHTML = this.foundWords.map(word => `
            <div class="found-word">${word}</div>
        `).join('');
    }

    showMessage(text, type) {
        const messageEl = this.container.querySelector('#spelling-bee-message');
        messageEl.textContent = text;
        messageEl.className = `spelling-bee-message ${type}`;
        
        setTimeout(() => {
            messageEl.textContent = '';
        }, 3000);
    }
}