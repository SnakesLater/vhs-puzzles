// Spelling Bee Game - NYT Style
class SpellingBeeGame {
    constructor(containerId, puzzle) {
        this.container = document.getElementById(containerId);
        this.puzzle = puzzle;
        this.centerLetter = puzzle.centerLetter.toUpperCase();
        this.outerLetters = puzzle.outerLetters.map(l => l.toUpperCase());
        this.allLetters = [...this.outerLetters, this.centerLetter];
        this.validAnswers = new Set(puzzle.answers.map(w => w.toUpperCase()));
        this.foundWords = [];
        this.currentWord = '';
        this.score = 0;
        this.gameOver = false;
        
        this.render();
        this.setupEventListeners();
    }

    render() {
        const html = `
            <div class="spelling-bee-container">
                <div class="spelling-bee-header">
                    <h2>SPELLING BEE</h2>
                    <div class="bee-score">
                        SCORE: <span id="bee-score">0</span>
                    </div>
                    <div class="bee-rank">RANK: <span id="bee-rank">Beginner</span></div>
                    <div class="bee-progress-bar">
                        <div id="bee-progress-fill" class="bee-progress-fill"></div>
                    </div>
                </div>

                <div class="bee-center-letter">
                    <div class="center-letter">${this.centerLetter}</div>
                </div>

                <div class="bee-outer-ring">
                    ${this.outerLetters.map(l => `
                        <button class="bee-letter" data-letter="${l}">${l}</button>
                    `).join('')}
                </div>

                <div class="bee-input-area">
                    <div id="bee-current-word" class="bee-current-word">_</div>
                    <div class="bee-controls">
                        <button id="bee-delete">DELETE</button>
                        <button id="bee-submit" disabled>SUBMIT</button>
                    </div>
                </div>

                <div id="bee-message" class="bee-message"></div>

                <div class="bee-progress">
                    <span id="bee-found-count">0</span> / ${this.validAnswers.size} words
                    <div id="bee-found-words" class="bee-found-list"></div>
                </div>

                <div class="bee-info">
                    <p>Must include <strong>${this.centerLetter}</strong></p>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    setupEventListeners() {
        this.container.querySelectorAll('.bee-letter').forEach(btn => {
            cleanupManager.addListener(btn, 'click', () => {
                this.addLetter(btn.dataset.letter);
            });
        });

        cleanupManager.addListener(
            document.getElementById('bee-delete'), 'click', () => this.deleteLetter()
        );
        cleanupManager.addListener(
            document.getElementById('bee-submit'), 'click', () => this.submitWord()
        );

        document.addEventListener('keydown', this.handleKeydown = (e) => {
            if (this.gameOver) {return;}
            
            if (e.key === 'Enter') {
                this.submitWord();
            } else if (e.key === 'Backspace') {
                this.deleteLetter();
            } else if (/^[a-zA-Z]$/.test(e.key)) {
                this.addLetter(e.key.toUpperCase());
            }
        });
    }

    addLetter(letter) {
        if (this.gameOver) {return;}
        if (!this.allLetters.includes(letter)) {return;}
        
        this.currentWord += letter;
        this.updateDisplay();
        vhsEffects.playClick();
    }

    deleteLetter() {
        if (this.gameOver) {return;}
        if (this.currentWord.length === 0) {return;}
        
        this.currentWord = this.currentWord.slice(0, -1);
        this.updateDisplay();
        vhsEffects.playClick();
    }

    updateDisplay() {
        document.getElementById('bee-current-word').textContent = this.currentWord || '_';
        document.getElementById('bee-submit').disabled = this.currentWord.length < 4;
    }

    submitWord() {
        if (this.gameOver) {return;}
        if (this.currentWord.length < 4) {
            this.showMessage('Too short', 'error');
            return;
        }

        const word = this.currentWord.toUpperCase();

        const invalid = this.isValidWord(word);
        if (invalid) {
            const msg = invalid === 'needs-center'
                ? `Must include ${this.centerLetter}`
                : invalid === 'bad-letter'
                    ? 'Invalid letter'
                    : 'Not in word list';
            this.showMessage(msg, 'error');
            this.shake();
            tapeQualitySystem.decreaseQuality(3);
            this.currentWord = '';
            this.updateDisplay();
            return;
        }

        if (this.foundWords.includes(word)) {
            this.showMessage('Already found', 'warning');
            this.currentWord = '';
            this.updateDisplay();
            return;
        }

        this.foundWords.push(word);
        const wordScore = this.calculateScore(word);
        this.score += wordScore;
        
        this.showMessage(`${word} (+${wordScore})`, 'success');
        this.updateScore();
        
        if (this.foundWords.length === this.validAnswers.size) {
            this.completeGame();
        }

        this.currentWord = '';
        this.updateDisplay();
        this.updateFoundWords();
        
        vhsEffects.playSuccess();
        vhsEffects.colorShift();
    }

    isValidWord(word) {
        if (!this.validAnswers.has(word)) { return 'not-in-list'; }
        if (!word.includes(this.centerLetter)) { return 'needs-center'; }
        for (const letter of word.split('')) {
            if (!this.allLetters.includes(letter)) { return 'bad-letter'; }
        }
        return null; // valid
    }

    calculateScore(word) {
        let score = word.length; // 1 point per letter (NYT)
        const uniqueLetters = new Set(word.split('')).size;
        if (uniqueLetters === 7) { score += 7; } // pangram bonus
        return score;
    }

    getRank() {
        // NYT-style rank tiers by share of total possible score.
        const pct = this.totalPossibleScore() === 0 ? 0 : this.score / this.totalPossibleScore();
        if (pct === 0) { return 'Beginner'; }
        if (pct < 0.25) { return 'Good Start'; }
        if (pct < 0.5) { return 'Moving Up'; }
        if (pct < 0.75) { return 'Good'; }
        if (pct < 1) { return 'Amazing'; }
        return 'Genius';
    }

    totalPossibleScore() {
        let total = 0;
        this.validAnswers.forEach(w => { total += this.calculateScore(w); });
        return total;
    }

    updateScore() {
        document.getElementById('bee-score').textContent = this.score;
        document.getElementById('bee-found-count').textContent = this.foundWords.length;
        const rankEl = document.getElementById('bee-rank');
        if (rankEl) { rankEl.textContent = this.getRank(); }
        const fill = document.getElementById('bee-progress-fill');
        if (fill) {
            const pct = this.totalPossibleScore() === 0 ? 0
                : Math.round((this.score / this.totalPossibleScore()) * 100);
            fill.style.width = pct + '%';
        }
    }

    updateFoundWords() {
        const container = document.getElementById('bee-found-words');
        container.innerHTML = this.foundWords.map(w => 
            `<span class="found-bee-word">${w}</span>`
        ).join('');
    }

    showMessage(text, type) {
        const el = document.getElementById('bee-message');
        el.textContent = text;
        el.className = `bee-message ${type}`;
        setTimeout(() => { el.textContent = ''; }, 2500);
    }

    shake() {
        vhsEffects.shake();
        vhsEffects.playError();
    }

    completeGame() {
        this.gameOver = true;
        this.showMessage('GENIUS! All words found!', 'success');
        tapeQualitySystem.increaseQuality(20);
        
        if (window.avatarController && typeof window.avatarController.onCorrectGuess === 'function') {
            window.avatarController.onCorrectGuess();
        }

        const controls = this.container.querySelector('.bee-controls');
        controls.innerHTML = '';
        const cont = document.createElement('button');
        cont.className = 'bee-continue';
        cont.textContent = 'CONTINUE';
        cont.addEventListener('click', () => eventManager.emit('gameComplete', true));
        controls.appendChild(cont);
    }

    cleanup() {
        document.removeEventListener('keydown', this.handleKeydown);
        cleanupManager.cleanupAll();
    }
}