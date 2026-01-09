// Strands Game - Web of Horror Connections
// TODO: Agent S - Complete this implementation

class StrandsGame extends BaseGame {
    constructor(containerId, puzzle) {
        super(containerId, puzzle);
        this.theme = puzzle.theme;
        this.words = puzzle.words;
        this.spangram = puzzle.spangram; // Word that spans the entire theme
        this.foundWords = [];
        this.selectedPath = [];
        this.grid = puzzle.grid; // 6x8 letter grid
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
        // TODO: Agent S - Create 6x8 grid of clickable letters
        // Letters should highlight when selected
        // Path should be visually connected
        return '';
    }

    setupEventListeners() {
        // TODO: Agent S - Add letter selection logic
        // Handle mouse drag for word selection
        // Implement path validation (adjacent letters only)
        // Add clear and submit button handlers
    }

    // TODO: Agent S - Implement these methods:
    // selectLetter(row, col)
    // isAdjacent(pos1, pos2)
    // validatePath()
    // submitWord()
    // checkWord(word)
    // highlightFoundWord(word)
    // updateFoundWords()
    // checkSpangram()
    // showHint()
}

// TODO: Agent S - Create sample puzzle data structure