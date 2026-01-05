// Connections Game - Detective Footage Aesthetic

class ConnectionsGame {
    constructor(containerId, puzzle) {
        this.container = document.getElementById(containerId);
        this.puzzle = puzzle;
        this.selectedWords = [];
        this.solvedGroups = [];
        this.mistakes = 0;
        this.maxMistakes = 4;
        this.isComplete = false;
        this.timer = null;
        this.timeRemaining = null;
        
        this.render();
        this.setupEventListeners();
    }

    render() {
        const html = `
            <div class="connections-container">
                <div id="connections-solved-groups" class="solved-groups"></div>
                
                <div id="connections-grid" class="connections-grid">
                    ${this.renderWordTiles()}
                </div>
                
                <div class="connections-message" id="connections-message"></div>
                
                <div class="connections-controls">
                    <button class="connections-btn" id="deselect-btn" disabled>Deselect All</button>
                    <button class="connections-btn primary" id="submit-btn" disabled>Submit</button>
                    <button class="connections-btn" id="shuffle-btn">Shuffle</button>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
    }

    renderWordTiles() {
        const allWords = [];
        this.puzzle.groups.forEach(group => {
            group.words.forEach(word => {
                allWords.push(word);
            });
        });
        
        // Shuffle words
        const shuffled = [...allWords].sort(() => Math.random() - 0.5);
        
        return shuffled.map(word => `
            <div class="word-tile" data-word="${word}" data-word-length="${word.length}">${word}</div>
        `).join('');
    }

    setupEventListeners() {
        const wordTiles = this.container.querySelectorAll('.word-tile');
        const deselectBtn = document.getElementById('deselect-btn');
        const submitBtn = document.getElementById('submit-btn');
        const shuffleBtn = document.getElementById('shuffle-btn');

        wordTiles.forEach(tile => {
            tile.addEventListener('click', () => this.toggleWord(tile));
        });

        deselectBtn.addEventListener('click', () => this.deselectAll());
        submitBtn.addEventListener('click', () => this.submitGuess());
        shuffleBtn.addEventListener('click', () => this.shuffleWords());
    }

    toggleWord(tile) {
        if (this.isComplete || tile.classList.contains('solved')) return;
        
        const word = tile.dataset.word;
        
        if (this.selectedWords.includes(word)) {
            this.selectedWords = this.selectedWords.filter(w => w !== word);
            tile.classList.remove('selected');
        } else if (this.selectedWords.length < 4) {
            this.selectedWords.push(word);
            tile.classList.add('selected');
            vhsEffects.playClick();
        }
        
        this.updateButtons();
    }

    deselectAll() {
        this.selectedWords = [];
        const tiles = this.container.querySelectorAll('.word-tile');
        tiles.forEach(tile => tile.classList.remove('selected'));
        this.updateButtons();
    }

    updateButtons() {
        const deselectBtn = document.getElementById('deselect-btn');
        const submitBtn = document.getElementById('submit-btn');

        deselectBtn.disabled = this.selectedWords.length === 0;
        submitBtn.disabled = this.selectedWords.length !== 4;

        if (submitBtn.disabled) {
            submitBtn.textContent = 'SELECT 4 WORDS';
        } else {
            submitBtn.textContent = this.correctGroups.size === 3 ? 'FINISH' : 'SUBMIT';
        }
    }

    submitGuess() {
        if (this.selectedWords.length !== 4) return;
        
        // Check if any selected word is already solved
        const alreadySolved = this.selectedWords.some(word => {
            return this.solvedGroups.some(group => group.words.includes(word));
        });
        if (alreadySolved) {
            this.showMessage('These words are already solved!', 'warning');
            this.deselectAll();
            return;
        }
        
        // Check if words form a valid group
        let foundGroup = null;
        
        for (const group of this.puzzle.groups) {
            const groupWords = new Set(group.words);
            const selectedWordsSet = new Set(this.selectedWords);
            
            if (this.setsEqual(groupWords, selectedWordsSet)) {
                foundGroup = group;
                break;
            }
        }
        
        if (foundGroup) {
            this.correctGroup(foundGroup);
        } else {
            this.incorrectGuess();
        }
    }

    setsEqual(set1, set2) {
        if (set1.size !== set2.size) return false;
        for (const item of set1) {
            if (!set2.has(item)) return false;
        }
        return true;
    }

    correctGroup(group) {
        // Remove words from grid
        const tiles = this.container.querySelectorAll('.word-tile');
        tiles.forEach(tile => {
            if (group.words.includes(tile.dataset.word)) {
                tile.remove();
            }
        });

        // Check if this is the 3rd correct group for story mode
        if (this.correctGroups.size === 3) {
            eventManager.emit('after3');
        }

        // Add solved group display
        const solvedContainer = document.getElementById('connections-solved-groups');
        const groupElement = document.createElement('div');
        groupElement.className = 'group-container';
        groupElement.innerHTML = `
            <div class="group-row ${group.difficulty || 'medium'}">
                <div class="group-header">${group.category}</div>
                <div class="group-words">${group.words.join(', ')}</div>
            </div>
        `;
        solvedContainer.appendChild(groupElement);
        
        this.solvedGroups.push(group);
        this.showMessage('Group found!', 'success');
        vhsEffects.playSuccess();
        vhsEffects.colorShift();
        
        // Trigger avatar video to alternate end frame on correct guess
        if (window.avatarController && typeof window.avatarController.onCorrectGuess === 'function') {
            window.avatarController.onCorrectGuess();
        }
        
        // Deselect all words for next guess
        this.deselectAll();
        
        // Check for win
        if (this.solvedGroups.length === this.puzzle.groups.length) {
            this.completeGame(true);
        }
    }

    incorrectGuess() {
        this.mistakes++;
        vhsEffects.shake();
        vhsEffects.playError();
        tapeQualitySystem.decreaseQuality(15);
        tapeQualitySystem.rewinds = Math.max(0, tapeQualitySystem.rewinds - 1);
        tapeQualitySystem.updateUI();

        if (window.updateBloodTrail) {
            window.updateBloodTrail(this.mistakes, this.maxMistakes);
        }
        
        const mistakesRemaining = this.maxMistakes - this.mistakes;
        
        if (mistakesRemaining === 0) {
            this.showMessage('Too many mistakes! The evidence is corrupted...', 'error');
            this.completeGame(false);
        } else {
            this.showMessage('Incorrect group. Try again.', 'error');
        }
    }

    shuffleWords() {
        const grid = document.getElementById('connections-grid');
        const tiles = Array.from(grid.children);
        
        // Shuffle
        tiles.sort(() => Math.random() - 0.5);
        
        // Re-append in new order
        tiles.forEach(tile => grid.appendChild(tile));
    }

    showMessage(text, type) {
        const messageEl = document.getElementById('connections-message');
        messageEl.textContent = text;
        messageEl.className = 'connections-message ' + type;
        
        setTimeout(() => {
            messageEl.textContent = '';
        }, 3000);
    }

    completeGame(won) {
        this.isComplete = true;
        
        const controls = this.container.querySelector('.connections-controls');
        controls.innerHTML = won 
            ? '<button class="connections-btn primary" id="continue-btn">Continue</button>'
            : '<button class="connections-btn" id="rewind-btn">Rewind Scene</button>';
        
        if (won) {
            tapeQualitySystem.increaseQuality(10);
            this.showMessage('All groups found! The evidence makes sense now.', 'success');
        } else {
            this.showMessage('Case incomplete. The truth remains hidden...', 'error');
        }
        
        // Event listeners for new buttons
        const continueBtn = document.getElementById('continue-btn');
        const rewindBtn = document.getElementById('rewind-btn');
        
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                eventManager.emit('gameComplete', won);
            });
        }

        if (rewindBtn) {
            rewindBtn.addEventListener('click', () => {
                eventManager.emit('rewindRequested');
            });
        }
    }

    startTimer(seconds) {
        this.timeRemaining = seconds;
        
        const timerDisplay = document.getElementById('timer-count');
        timerDisplay.textContent = this.formatTime(this.timeRemaining);
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            timerDisplay.textContent = this.formatTime(this.timeRemaining);
            
            if (this.timeRemaining <= 10) {
                timerDisplay.classList.add('timer-warning');
            }
            
            if (this.timeRemaining <= 0) {
                clearInterval(this.timer);
                this.completeGame(false);
            }
        }, 1000);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

// Global game instance
let currentConnectionsGame = null;
