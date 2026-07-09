class LetterBoxedGame {
    constructor(containerId, puzzle) {
        this.container = document.getElementById(containerId);
        this.puzzle = puzzle;
        this.sides = puzzle.sides;
        this.pool = this.buildPool();
        this.usedWords = [];
        this.usedLetters = new Set();
        this.currentWord = '';
        this.minWords = puzzle.minWords || 3;
        this.maxWords = puzzle.maxWords || null;
        this.solved = false;
        this.lastLetter = null;
        this.lastSide = null;
        this.typebox = null;

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
                    <p class="horror-hint">Chain words - each new word must start with the last letter of the previous. Type or click letters; consecutive letters must come from different sides of the box.</p>
                </div>

                <div class="letter-boxed-sides">
                    <svg class="lb-path"></svg>
                    ${this.sides.map((side, i) => `
                        <div class="side side-${i}" data-side="${i}">
                            ${side.map(l => `<span class="pool-letter ${this.usedLetters.has(l) ? 'used' : ''}" data-letter="${l}" data-side="${i}">${l}</span>`).join('')}
                        </div>
                    `).join('')}
                </div>

                <div class="letter-boxed-center">
                    <input id="lb-typebox" class="lb-typebox" type="text"
                           autocomplete="off" autocorrect="off" autocapitalize="characters"
                           spellcheck="false" maxlength="24" placeholder="_"
                           aria-label="Type your word" />
                    <div class="lb-hint">Type a word, press Enter to add it. Backspace on an empty box pulls the last word back to edit — unwind all the way to restart. Use every letter in as few words as you can.</div>
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
                    &nbsp;·&nbsp;
                    <span id="lb-words">0</span> words
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    setupEventListeners() {
        this.typebox = this.container.querySelector('#lb-typebox');
        this.boxEl = this.container.querySelector('.letter-boxed-sides');
        this.pathSvg = this.container.querySelector('.lb-path');
        if (this.typebox) { this.typebox.focus(); }

        const tiles = this.container.querySelectorAll('.pool-letter');
        tiles.forEach(el => {
            cleanupManager.addListener(el, 'click', () => {
                this.appendLetter(el.dataset.letter);
            });
        });

        // Typebox is the single source of truth: live validation on every keystroke.
        cleanupManager.addListener(this.typebox, 'input', () => this.applyTypebox());
        cleanupManager.addListener(this.typebox, 'keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (this.currentWord.length >= 3) { this.commitWord(); }
            } else if (e.key === 'Backspace') {
                // Empty draft -> pull the previous committed word back as an
                // editable draft (one step of undo). Non-empty -> let the input
                // delete a char natively (fires 'input' -> applyTypebox).
                if (this.currentWord.length === 0) {
                    e.preventDefault();
                    this.uncommitLastWord();
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.clear();
            }
        });

        // Global free-typing: if focus is elsewhere (e.g. after a tile click),
        // route physical letter keys into the typebox so typing still works.
        const container = this.container.querySelector('.letter-boxed-container');
        cleanupManager.addListener(container, 'keydown', (e) => {
            if (document.activeElement === this.typebox) { return; }
            if (e.target.matches('button')) { return; }
            if (/^[a-zA-Z]$/.test(e.key)) {
                e.preventDefault();
                this.appendLetter(e.key.toUpperCase());
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                if (this.currentWord.length > 0) {
                    this.typebox.value = this.currentWord.slice(0, -1);
                    this.applyTypebox();
                } else {
                    this.uncommitLastWord();
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.clear();
            }
        });

        cleanupManager.addListener(
            document.getElementById('lb-clear'), 'click', () => this.clear()
        );
        cleanupManager.addListener(
            document.getElementById('lb-shuffle'), 'click', () => this.shuffle()
        );
        cleanupManager.addListener(
            document.getElementById('lb-submit'), 'click', () => this.commitWord()
        );
    }

    // Append a letter (from a tile click or a physical key) and re-validate.
    appendLetter(letter) {
        if (!this.pool[letter]) { return; }
        this.typebox.value += letter;
        this.applyTypebox();
        this.typebox.focus();
    }

    // Re-derive currentWord from the typebox, enforcing LB rules:
    //  - first char must equal lastLetter (carry-over from previous word)
    //  - no two consecutive identical letters
    //  - consecutive letters must come from different sides
    // Invalid tail chars are dropped (the box reverts to the valid prefix).
    applyTypebox() {
        const raw = this.typebox.value.toUpperCase().replace(/[^A-Z]/g, '');
        let word = '';
        let lastSide = null;
        for (let i = 0; i < raw.length; i++) {
            const ch = raw[i];
            const sides = this.pool[ch];
            if (!sides) { break; }
            if (i === 0 && this.lastLetter && ch !== this.lastLetter) { break; }
            if (word.length > 0 && ch === word.slice(-1)) { break; }
            const eligible = sides.filter(s => s !== lastSide);
            if (lastSide !== null && eligible.length === 0) { break; }
            word += ch;
            lastSide = eligible.length ? eligible[0] : sides[0];
        }
        if (word !== raw) { this.typebox.value = word; }
        this.currentWord = word;
        this.lastSide = lastSide;
        this.updateDisplay();
        this.drawPath();
    }

    // Center of a letter's DOM node in box-relative coordinates.
    letterCenter(letter, side) {
        const el = this.container.querySelector(
            `.pool-letter[data-letter="${letter}"][data-side="${side}"]`
        );
        if (!el) { return null; }
        const box = this.boxEl.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
    }

    // Draw letter-to-letter lines across the box (NYT style):
    //  - live lines for the in-progress word (bright cyan)
    //  - persistent lines for every submitted word (dimmer, per-word hue)
    drawPath() {
        const svg = this.pathSvg;
        if (!svg) { return; }
        const box = this.boxEl.getBoundingClientRect();
        svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);

        let svgInner = '';

        // Persistent (submitted) words
        this.usedWords.forEach((w, wi) => {
            const pts = this.wordPoints(w);
            if (pts.length >= 2) {
                svgInner += `<polyline points="${pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" `
                    + `fill="none" stroke="var(--vhs-accent)" stroke-width="2.5" `
                    + `stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/>`;
            }
        });

        // Live (in-progress) word
        const live = this.wordPoints(this.currentWord);
        if (live.length >= 2) {
            svgInner += `<polyline points="${live.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" `
                + `fill="none" stroke="var(--vhs-bright)" stroke-width="3" `
                + `stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`;
        }

        svg.innerHTML = svgInner;
    }

    // Build box-relative points for a word's letters (first side slot each).
    wordPoints(word) {
        const pts = [];
        for (const ch of word) {
            const side = this.pool[ch] ? this.pool[ch][0] : 0;
            const c = this.letterCenter(ch, side);
            if (c) { pts.push(c); }
        }
        return pts;
    }

    clear() {
        this.usedWords = [];
        this.currentWord = '';
        this.lastSide = null;
        this.lastLetter = null;
        if (this.typebox) { this.typebox.value = ''; }
        this.updateDisplay();
        if (this.typebox) { this.typebox.focus(); }
    }

    // Pull the last committed word back into the typebox as an editable draft,
    // one step of undo. The whole board (letters used, lastLetter) is then
    // recomputed from the remaining committed words via updateDisplay().
    uncommitLastWord() {
        if (this.solved) { return; }
        if (this.usedWords.length === 0) { return; }
        const w = this.usedWords.pop();
        // Restart the draft with the reclaimed word.
        this.currentWord = w;
        this.typebox.value = w;
        this.updateDisplay();
        if (this.typebox) { this.typebox.focus(); }
    }

    shuffle() {
        this.container.querySelectorAll('.side').forEach(side => {
            const letters = Array.from(side.querySelectorAll('.pool-letter'));
            for (let i = letters.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                side.insertBefore(letters[j], letters[i]);
            }
        });
        this.drawPath();
        vhsEffects.playClick();
    }

    // Enter: commit the current word into the player's progress sequence.
    // This is REVERSIBLE — it never locks the board. The word is appended to
    // usedWords only if it's a real, box-legal word; otherwise it stays in the
    // typebox as an editable draft. Letters-used is always derived live from
    // the full sequence, so backspacing a word (via uncommitLastWord) rewinds
    // the whole board. Solve is reported but play continues until CONTINUE.
    commitWord() {
        if (!this.currentWord || this.currentWord.length < 3) { return; }

        if (this.usedWords.includes(this.currentWord)) {
            this.showMessage('Already used!', 'warning');
            this.currentWord = '';
            this.typebox.value = '';
            this.updateDisplay();
            return;
        }

        if (!this.isValidWord(this.currentWord)) {
            this.shake();
            this.showMessage('Not a real word', 'error');
            tapeQualitySystem.decreaseQuality(5);
            return;
        }

        this.usedWords.push(this.currentWord);
        this.lastLetter = this.currentWord.slice(-1);
        this.currentWord = '';
        this.typebox.value = '';
        this.showMessage(`"${this.usedWords[this.usedWords.length - 1]}" added`, 'success');
        tapeQualitySystem.increaseQuality(5);
        vhsEffects.playSuccess();
        vhsEffects.colorShift();
        this.updateDisplay();

        if (this.usedLetters.size >= 12) {
            this.completeGame();
        }
    }

    isValidWord(word) {
        // Open-ended: Letter Boxed accepts ANY real English word that follows
        // the box rules (chain + alternate sides), not a curated answer set.
        // So validity = present in the broad dictionary (length >= 3).
        if (word.length < 3) { return false; }

        if (!unifiedDictionary.loaded) {
            // Dictionary not ready yet — fall back to the puzzle's curated
            // answers only if present, else reject (don't guess-accept).
            if (!this.puzzle.answers) { return false; }
            return this.puzzle.answers.map(w => w.toUpperCase()).includes(word);
        }
        return unifiedDictionary.isValidWord(word);
    }

    updateDisplay() {
        // The board state is DERIVED from the committed sequence, so that
        // unwinding a word (uncommitLastWord) rewinds letters-used and the
        // chain automatically.
        this.usedLetters = new Set();
        this.usedWords.forEach(w => w.split('').forEach(l => this.usedLetters.add(l)));
        if (this.usedWords.length) {
            this.lastLetter = this.usedWords[this.usedWords.length - 1].slice(-1);
        } else {
            this.lastLetter = null;
        }

        // While the user is actively typing, don't fight the caret — applyTypebox
        // already keeps the box in sync. Otherwise reflect currentWord (e.g. after
        // commit/uncommit). The placeholder shows the required starting letter.
        if (this.typebox && document.activeElement !== this.typebox) {
            this.typebox.value = this.currentWord;
        }
        if (this.typebox) {
            this.typebox.placeholder = this.lastLetter
                ? `${this.lastLetter}_`
                : '_';
        }
        document.getElementById('lb-count').textContent = this.usedLetters.size;
        const wordsEl = document.getElementById('lb-words');
        if (wordsEl) { wordsEl.textContent = this.usedWords.length; }

        const foundEl = document.getElementById('found-words');
        foundEl.innerHTML = this.usedWords.map(w =>
            `<span class="found-word">${w}</span>`
        ).join('');

        this.container.querySelectorAll('.pool-letter').forEach(el => {
            const letter = el.dataset.letter;
            el.classList.toggle('used', this.usedLetters.has(letter));
        });

        document.getElementById('lb-submit').disabled = this.currentWord.length < 3;
        this.drawPath();
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
        const n = this.usedWords.length;
        this.showMessage(`Solved in ${n} word${n === 1 ? '' : 's'} — every letter used!`, 'success');
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
