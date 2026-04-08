class LetterBoxedGame {
    constructor(containerId, puzzle) {
        this.container = document.getElementById(containerId);
        this.puzzle = puzzle;
        this.sides = puzzle.sides;
        this.pool = this.buildPool();
        this.usedWords = [];
        this.usedLetters = new Set();
        this.currentWord = '';
        this.currentPath = [];
        this.minWords = puzzle.minWords || 3;
        this.maxWords = puzzle.maxWords || null;
        this.solved = false;
        this.lastLetter = null;

        this.render();
        this.setupEventListeners();
    }

    buildPool() {
        const pool = {};
        this.sides.forEach((side, sIdx) => {
            side.forEach(letter => {
                if (!pool[letter]) {pool[letter] = [];}
                pool[letter].push(sIdx);
            });
        });
        return pool;
    }

    render() {
        const html = `
            <div class="letter-boxed-container">
                <div class="letter-boxed-header">
                    <h2>LETTER BOXED</h2>
                    <p class="horror-hint">Chain words - each new word must start with the last letter of the previous</p>
                </div>

                <div class="letter-boxed-sides">
                    ${this.sides.map((side, i) => `
                        <div class="side side-${i}" data-side="${i}">
                            ${side.map(l => `<span class="pool-letter ${this.usedLetters.has(l) ? 'used' : ''}" data-letter="${l}" data-side="${i}">${l}</span>`).join('')}
                        </div>
                    `).join('')}
                </div>

                <div class="letter-boxed-center">
                    <div id="current-word" class="current-word">${this.lastLetter ? this.lastLetter + '_' : '_'}</div>
                    <div id="found-words" class="found-words"></div>
                </div>

                <div class="letter-boxed-controls">
                    <button id="lb-clear">CLEAR</button>
                    <button id="lb-submit" disabled>SUBMIT</button>
                    <button id="lb-shuffle">SHUFFLE</button>
                </div>

                <div id="lb-message" class="letter-boxed-message"></div>
                <div class="lb-progress">
                    <span id="lb-count">0</span> / 12 letters used
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    setupEventListeners() {
        this.container.querySelectorAll('.pool-letter').forEach(el => {
            cleanupManager.addListener(el, 'click', () => {
                const letter = el.dataset.letter;
                const sides = this.pool[letter];
                this.addLetter(letter, sides);
            });
        });

        cleanupManager.addListener(
            document.getElementById('lb-clear'), 'click', () => this.clear()
        );
        cleanupManager.addListener(
            document.getElementById('lb-shuffle'), 'click', () => this.shuffle()
        );
        cleanupManager.addListener(
            document.getElementById('lb-submit'), 'click', () => this.submit()
        );
    }

    addLetter(letter, sides) {
        if (this.solved) {return;}
        
        if (this.currentWord.length > 0 && letter === this.currentWord.slice(-1)) {return;}
        
        if (this.currentWord.length === 0 && this.lastLetter && letter !== this.lastLetter) {
            this.showMessage(`Start with "${this.lastLetter}"`, 'warning');
            return;
        }

        this.currentWord += letter;
        this.currentPath.push({ letter, sides });
        this.updateDisplay();
        vhsEffects.playClick();
    }

    clear() {
        this.currentWord = '';
        this.currentPath = [];
        this.updateDisplay();
    }

    shuffle() {
        const btns = Array.from(this.container.querySelectorAll('.pool-btn'));
        btns.sort(() => Math.random() - 0.5).forEach(b => this.container.querySelector('.pool-ring').appendChild(b));
        vhsEffects.playClick();
    }

    submit() {
        if (!this.currentWord || this.currentWord.length < 3) {return;}

        if (this.usedWords.includes(this.currentWord)) {
            this.showMessage('Already found!', 'warning');
            this.clear();
            return;
        }

        if (!this.isValidWord(this.currentWord)) {
            this.shake();
            this.showMessage('Not in puzzle word list', 'error');
            tapeQualitySystem.decreaseQuality(5);
            this.clear();
            return;
        }

        this.currentWord.split('').forEach(l => this.usedLetters.add(l));
        
        this.usedWords.push(this.currentWord);
        this.lastLetter = this.currentWord.slice(-1);
        
        this.showMessage(`"${this.currentWord}" found!`, 'success');
        tapeQualitySystem.increaseQuality(5);
        vhsEffects.playSuccess();
        vhsEffects.colorShift();
        this.updateDisplay();
        
        if (this.usedLetters.size >= 12) {
            this.completeGame();
        } else {
            this.clear();
        }
    }

    isValidWord(word) {
        if (!wordDictionary.loaded) {
            if (!this.puzzle.answers) {return false;}
            const valid = this.puzzle.answers.map(w => w.toUpperCase());
            if (!valid.includes(word)) {return false;}
        } else {
            if (!wordDictionary.isLetterBoxedAnswer(this.puzzle.id, word)) {
                return false;
            }
        }

        if (word.length < 3) {return false;}

        const first = word[0];
        const last = word.slice(-1);
        const firstSides = this.pool[first] || [];
        const lastSides = this.pool[last] || [];
        const startSide = firstSides[0];
        const endSide = lastSides[0];
        if (startSide === endSide) {return false;}

        return true;
    }

    updateDisplay() {
        const displayWord = this.lastLetter ? (this.currentWord ? this.lastLetter + this.currentWord : this.lastLetter + '_') : (this.currentWord || '_');
        document.getElementById('current-word').textContent = displayWord;
        document.getElementById('lb-count').textContent = this.usedLetters.size;

        const foundEl = document.getElementById('found-words');
        foundEl.innerHTML = this.usedWords.map(w =>
            `<span class="found-word">${w}</span>`
        ).join('');

        this.container.querySelectorAll('.pool-letter').forEach(el => {
            const letter = el.dataset.letter;
            el.classList.toggle('used', this.usedLetters.has(letter));
        });

        document.getElementById('lb-submit').disabled = this.currentWord.length < 3;
    }

    showMessage(text, type) {
        const el = document.getElementById('lb-message');
        el.textContent = text;
        el.className = `letter-boxed-message ${type}`;
        setTimeout(() => { el.textContent = ''; }, 3000);
    }

    shake() {
        vhsEffects.shake();
        vhsEffects.playError();
    }

    completeGame() {
        this.solved = true;
        this.showMessage('All words found! The message is clear.', 'success');
        tapeQualitySystem.increaseQuality(15);

        if (window.avatarController && typeof window.avatarController.onCorrectGuess === 'function') {
            window.avatarController.onCorrectGuess();
        }

        const controls = this.container.querySelector('.letter-boxed-controls');
        controls.innerHTML = '';
        const cont = document.createElement('button');
        cont.className = 'lb-continue';
        cont.textContent = 'CONTINUE';
        cont.addEventListener('click', () => eventManager.emit('gameComplete', true));
        controls.appendChild(cont);
    }

    cleanup() {
        cleanupManager.cleanupAll();
    }
}
