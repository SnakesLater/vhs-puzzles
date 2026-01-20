// Puzzle Loader System - Simple JSON-based puzzle loading

class PuzzleLoader {
    constructor() {
        this.puzzles = null;
        this.stories = null;
        this.loaded = false;
    }

    async loadAll() {
        try {
            // Try fetch first (modern API)
            const puzzlesResponse = await fetch('data/puzzles.json');
            const storiesResponse = await fetch('data/stories.json');
            
            this.puzzles = await puzzlesResponse.json();
            this.stories = await storiesResponse.json();
            
            this.loaded = true;
            console.log('Puzzles and stories loaded successfully');
            return true;
        } catch (error) {
            console.error('Fetch failed, trying XMLHttpRequest fallback:', error);
            
            // Fallback to XMLHttpRequest (older API, bypasses some browser security)
            try {
                const puzzles = await this.loadJSON('data/puzzles.json');
                const stories = await this.loadJSON('data/stories.json');
                
                this.puzzles = puzzles;
                this.stories = stories;
                this.loaded = true;
                console.log('Puzzles and stories loaded via XMLHttpRequest');
                return true;
            } catch (xhrError) {
                console.error('XMLHttpRequest also failed:', xhrError);
                return false;
            }
        }
    }
    
    async loadJSON(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.overrideMimeType('application/json');
            xhr.open('GET', url, true);
            xhr.responseType = 'json';
            
            xhr.onload = () => {
                if (xhr.status === 200) {
                    try {
                        resolve(JSON.parse(xhr.responseText));
                    } catch (e) {
                        reject(new Error(`Failed to parse ${url}: ${e.message}`));
                    }
                } else {
                    reject(new Error(`Failed to load ${url}: HTTP ${xhr.status}`));
                }
            };
            
            xhr.onerror = () => {
                reject(new Error(`Failed to load ${url}: Network error`));
            };
            
            xhr.send();
        });
    }

    getPuzzle(gameType, puzzleId) {
        if (!this.puzzles || !this.puzzles[gameType]) {
            console.error(`Game type ${gameType} not found`);
            return null;
        }

        return this.puzzles[gameType].find(p => p.id === puzzleId);
    }

    getRandomPuzzle(gameType, difficulty = null) {
        if (!this.puzzles || !this.puzzles[gameType]) {
            console.error(`Game type ${gameType} not found`);
            return null;
        }

        let puzzles = this.puzzles[gameType];
        
        if (difficulty) {
            puzzles = puzzles.filter(p => p.difficulty === difficulty);
        }

        if (puzzles.length === 0) {
            console.error(`No puzzles found for ${gameType} with difficulty ${difficulty}`);
            return null;
        }

        const randomIndex = Math.floor(Math.random() * puzzles.length);
        return puzzles[randomIndex];
    }

    getAllPuzzles(gameType) {
        return this.puzzles && this.puzzles[gameType] ? this.puzzles[gameType] : [];
    }

    getStory(storyId) {
        if (!this.stories || !this.stories.campaigns) {
            // Data not loaded yet
            return null;
        }

        return this.stories.campaigns.find(s => s.id === storyId);
    }

    getAllStories() {
        return this.stories && this.stories.campaigns ? this.stories.campaigns : [];
    }

    getScene(storyId, sceneIndex) {
        const story = this.getStory(storyId);
        if (!story || !story.scenes || !story.scenes[sceneIndex]) {
            return null;
        }

        return story.scenes[sceneIndex];
    }

    getNextScene(storyId, currentSceneIndex) {
        const story = this.getStory(storyId);
        if (!story || !story.scenes) {
            return null;
        }

        if (currentSceneIndex + 1 < story.scenes.length) {
            return story.scenes[currentSceneIndex + 1];
        }

        return null;
    }
}

// Global puzzle loader instance
const puzzleLoader = new PuzzleLoader();
