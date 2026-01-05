// Main JavaScript - VHS Horror Puzzle Collection

document.addEventListener('DOMContentLoaded', async () => {
    // Game state
    let currentMode = null;
    let currentDifficulty = 'medium';
    let currentStory = null;
    let currentSceneIndex = 0;
    let currentGameType = null;

    // DOM elements
    const screens = {
        tapeSelection: document.getElementById('tape-selection'),
        storyMode: document.getElementById('story-mode'),
        gameMode: document.getElementById('game-mode')
    };

    const buttons = {
        storyMode: document.querySelector('[data-mode="story"]'),
        gameMode: document.querySelector('[data-mode="game"]'),
        difficulty: document.querySelectorAll('.difficulty-btn'),
        gameSelection: document.querySelectorAll('.game-btn'),
        back: document.getElementById('back-btn'),
        rewind: document.getElementById('rewind-btn'),
        gameModeBack: document.getElementById('game-mode-back')
    };

    // Initialize
    await initializeGame();

    async function initializeGame() {
        // Load puzzles and stories
        const loaded = await puzzleLoader.loadAll();
        
        if (!loaded) {
            alert('Failed to load game data. Please refresh.');
            return;
        }

        // Check for saved progress
        loadProgress();

        // Set up event listeners
        setupEventListeners();

        // Update tape number
        updateTapeNumber();

        // Show main menu
        showScreen('tapeSelection');
    }

    function setupEventListeners() {
        // Mode selection
        buttons.storyMode.addEventListener('click', () => selectMode('story'));
        buttons.gameMode.addEventListener('click', () => selectMode('game'));

        // Difficulty selection
        buttons.difficulty.forEach(btn => {
            btn.addEventListener('click', () => selectDifficulty(btn.dataset.difficulty));
        });

        // Game selection
        buttons.gameSelection.forEach(btn => {
            btn.addEventListener('click', () => selectGame(btn.dataset.game));
        });

        // Back buttons
        buttons.back.addEventListener('click', () => goBack());
        buttons.gameModeBack.addEventListener('click', () => goBack());

        // Rewind button
        buttons.rewind.addEventListener('click', () => rewindScene());

        // Tape quality callbacks
        tapeQualitySystem.onQualityChange((quality) => {
            vhsEffects.applyEffectsBasedOnQuality(quality);
        });

        tapeQualitySystem.onQualityCritical(() => {
            vhsEffects.trackingError();
            vhsEffects.colorShift();
        });

        tapeQualitySystem.onGameOver(() => {
            vhsEffects.jumpscare();
            setTimeout(() => {
                alert('TAPE CORRUPTED\n\nThe footage has been completely consumed.\nRestarting campaign...');
                restartStory();
            }, 3000);
        });
    }

    function showScreen(screenName) {
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });
        
        screens[screenName].classList.add('active');
        screens[screenName].classList.remove('hidden');
    }

    function selectMode(mode) {
        currentMode = mode;
        
        document.getElementById('mode-selection').classList.add('hidden');
        
        if (mode === 'story') {
            document.getElementById('difficulty-selection').classList.remove('hidden');
        } else {
            document.getElementById('game-selection').classList.remove('hidden');
        }
        
        buttons.back.classList.remove('hidden');
        
        // NEW: Update button active states
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === currentDifficulty) {
                btn.classList.add('active');
            }
        });
    }

    function selectDifficulty(difficulty) {
        currentDifficulty = difficulty;
        tapeQualitySystem.setDifficulty(difficulty);
        
        document.getElementById('difficulty-selection').classList.add('hidden');
        
        if (currentMode === 'story') {
            showStorySelection();
        }
    }

    function selectGame(gameType) {
        currentGameType = gameType;
        
        if (gameType === 'connections') {
            const puzzle = puzzleLoader.getRandomPuzzle('connections');
            startSingleGame(puzzle);
        } else {
            alert(`${gameType} is coming soon!`);
        }
    }

    function showStorySelection() {
        const stories = puzzleLoader.getAllStories();
        const container = document.getElementById('story-selection');
        container.innerHTML = '';
        container.classList.remove('hidden');
        
        stories.forEach(story => {
            const isUnlocked = isStoryUnlocked(story.id);
            const isCompleted = isStoryCompleted(story.id);
            
            const card = document.createElement('div');
            card.className = `story-card ${isUnlocked ? '' : 'locked'}`;
            card.dataset.story = story.id;
            
            card.innerHTML = `
                <div class="story-front">
                    ${isUnlocked && story.id !== 'cabin_stalkings' ? '<div class="new-release-label">NEW RELEASE</div>' : ''}
                    <h3 class="story-title">${story.title}</h3>
                    <p class="story-premise">${story.premise}</p>
                </div>
                <div class="story-back">
                    <p class="story-desc">${story.premise}</p>
                    <div class="story-meta">
                        <p class="scenes-count">
                            <span>Scenes:</span>
                            <span>${story.scenes.length}</span>
                        </p>
                        <p class="difficulty-level">
                            <span>Difficulty:</span>
                            <span>${getStoryDifficulty(story.id)}</span>
                        </p>
                    </div>
                    <p class="story-status ${isUnlocked ? 'available' : 'rented-out'}">
                        ${isUnlocked ? 'Available for viewing' : 'RENTED OUT'}
                    </p>
                </div>
            `;
            
            if (isUnlocked) {
                card.addEventListener('click', () => startStory(story.id));
            }
            
            container.appendChild(card);
        });
    }

    function getStoryDifficulty(storyId) {
        const difficultyMap = {
            'cabin_stalkings': 'Medium',
            'midnight_broadcast': 'Hard',
            'the_archive': 'Insane'
        };
        return difficultyMap[storyId] || 'Unknown';
    }

    function startStory(storyId) {
        currentStory = storyId;
        currentSceneIndex = 0;
        
        document.getElementById('story-selection').classList.add('hidden');
        
        showScreen('storyMode');
        loadScene(0);
    }

    async function loadScene(index) {
        currentSceneIndex = index;
        
        const scene = puzzleLoader.getScene(currentStory, index);
        
        if (!scene) {
            completeStory();
            return;
        }
        
        // Cancel any ongoing text animation
        vhsEffects.cancelTypewriter();
        
        // Reset blood trail for new scene
        resetBloodTrail();
        
        // Start typewriter immediately but don't wait for it
        const narrativeEl = document.getElementById('narrative-text');
        narrativeEl.textContent = '';
        vhsEffects.typeText(narrativeEl, scene.narrative.before, 10);
        
        // Load puzzle immediately - player can start playing right away
        loadPuzzle(scene.gameType, scene.puzzleId, scene.timer);
        
        // Update rewind button
        const rewindBtn = document.getElementById('rewind-btn');
        rewindBtn.classList.add('hidden');
    }

    function loadPuzzle(gameType, puzzleId, timer = null) {
        const puzzle = puzzleLoader.getPuzzle(gameType, puzzleId);
        
        if (!puzzle) {
            console.error(`Puzzle ${puzzleId} not found for ${gameType}`);
            return;
        }
        
        // Clear previous game
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = '';
        
        // Set condensed header
        const puzzleGameType = document.getElementById('puzzle-game-type');
        const detectiveDialogue = document.getElementById('detective-dialogue');
        
        const gameTypeMap = {
            'connections': 'CONNECTIONS',
            'wordle': 'WORDLE',
            'strands': 'STRANDS',
            'spelling-bee': 'SPELLING BEE',
            'letter-boxed': 'LETTER BOXED'
        };
        
        if (puzzleGameType) {
            puzzleGameType.textContent = gameTypeMap[gameType] || gameType.toUpperCase();
        }
        if (detectiveDialogue) {
            const dialogues = [
                'Well, look what just came across my desk. Lucky me...',
                'Another night, another puzzle. This should be interesting.',
                'The pieces are scattered, but I\'ll make sense of it all.',
                'Something doesn\'t add up. I need to find the connection.',
                'This looks like the work of a twisted mind.',
                'Let\'s see what secrets this puzzle hides.'
            ];
            detectiveDialogue.textContent = dialogues[Math.floor(Math.random() * dialogues.length)];
        }
        
        // Start appropriate game
        if (gameType === 'connections') {
            currentConnectionsGame = new ConnectionsGame('game-container', puzzle);
            
            // Set callbacks
            window.onGameComplete = async (won) => {
                if (won) {
                    await showAfterNarrative();
                }
            };
            
            window.onRewindRequested = () => {
                rewindScene();
            };
            
            // Start timer if specified
            if (timer) {
                showTimer(timer, () => {
                    currentConnectionsGame.startTimer(timer);
                });
            }
        }
    }

    async function showAfterNarrative() {
        const scene = puzzleLoader.getScene(currentStory, currentSceneIndex);
        const narrativeEl = document.getElementById('narrative-text');
        
        await vhsEffects.typeText(narrativeEl, scene.narrative.after, 30);
        
        // Show continue button
        setTimeout(() => {
            if (puzzleLoader.getNextScene(currentStory, currentSceneIndex)) {
                const btn = document.createElement('button');
                btn.className = 'action-btn';
                btn.textContent = '▶ CONTINUE';
                btn.addEventListener('click', nextScene);
                document.getElementById('game-container').appendChild(btn);
            } else {
                completeStory();
            }
        }, 1000);
    }

    function nextScene() {
        loadScene(currentSceneIndex + 1);
    }

    function startSingleGame(puzzle) {
        document.getElementById('game-selection').classList.add('hidden');
        showScreen('gameMode');
        
        const gameContainer = document.getElementById('single-game-container');
        gameContainer.innerHTML = '';
        
        if (puzzle) {
            tapeQualitySystem.reset();
            currentConnectionsGame = new ConnectionsGame('single-game-container', puzzle);
            
            window.onGameComplete = (won) => {
                if (won) {
                    setTimeout(() => {
                        alert('Puzzle completed! Returning to menu...');
                        goBack();
                    }, 1000);
                } else {
                    setTimeout(() => {
                        alert('Puzzle failed. Try again!');
                        goBack();
                    }, 1000);
                }
            };
            
            window.onRewindRequested = null;
        }
    }

    function rewindScene() {
        if (tapeQualitySystem.useRewind()) {
            // Reload current scene
            loadScene(currentSceneIndex);
        } else {
            alert('No rewinds remaining!');
        }
    }

    function restartStory() {
        tapeQualitySystem.reset();
        resetBloodTrail();
        loadScene(0);
    }

    function completeStory() {
        const story = puzzleLoader.getStory(currentStory);
        
        // Mark as completed
        markStoryCompleted(currentStory);
        
        // Show completion message
        const narrativeEl = document.getElementById('narrative-text');
        narrativeEl.textContent = story.epilogue || 'Story Complete!';
        
        // Unlock next story if available
        const allStories = puzzleLoader.getAllStories();
        const currentIndex = allStories.findIndex(s => s.id === currentStory);
        
        if (currentIndex < allStories.length - 1) {
            markStoryUnlocked(allStories[currentIndex + 1].id);
        }
        
        // Show return button
        setTimeout(() => {
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.textContent = '▶ RETURN TO MENU';
            btn.addEventListener('click', () => goBack());
            document.getElementById('game-container').appendChild(btn);
        }, 2000);
    }

    function goBack() {
        // Clear game instances
        if (currentConnectionsGame) {
            currentConnectionsGame.stopTimer();
            currentConnectionsGame = null;
        }
        
        // Hide timer overlay if shown
        document.getElementById('timer-overlay').classList.add('hidden');
        
        // Return to main menu
        showScreen('tapeSelection');
        
        document.getElementById('mode-selection').classList.remove('hidden');
        document.getElementById('story-selection').classList.add('hidden');
        document.getElementById('game-selection').classList.add('hidden');
        document.getElementById('difficulty-selection').classList.add('hidden');
        
        buttons.back.classList.add('hidden');
        
        currentMode = null;
        currentStory = null;
        currentSceneIndex = 0;
        currentGameType = null;
        
        saveProgress();
    }

    // Max mistakes constant
    const MAX_MISTAKES = 4;
    
    // Blood trail animation state
    let bloodTrailAnimationId = null;
    let bloodTrailProgress = 0;
    const BASE_ANIMATION_DURATION = 15000; // 15 seconds for full blood trail at 0 mistakes
    let currentAnimationDuration = BASE_ANIMATION_DURATION;

    // Update blood trail meter with time-based animation
    window.updateBloodTrail = function(mistakes, maxMistakes) {
        const bloodPath = document.getElementById('blood-path');
        const bloodPool = document.querySelector('.blood-pool');
        
        // Calculate animation speed based on mistakes (faster with more mistakes)
        // 0 mistakes = 15 seconds, 1 mistake = 11.25 seconds, 2 = 7.5, 3 = 3.75, 4 = 1.87
        const mistakeMultiplier = Math.pow(0.75, mistakes);
        currentAnimationDuration = BASE_ANIMATION_DURATION * mistakeMultiplier;
        
        if (bloodPath) {
            const pathLength = bloodPath.getTotalLength();
            bloodPath.style.strokeDasharray = pathLength + ' ' + pathLength;
            
            // Calculate target progress based on mistakes
            const percentage = mistakes / maxMistakes;
            const targetDashOffset = pathLength * (1 - percentage);
            
            // Start/update the blood trail animation
            animateBloodTrail(targetDashOffset, currentAnimationDuration);
        }
        
        if (bloodPool && mistakes > 0) {
            bloodPool.classList.add('visible');
        }
    };

    // Animate blood trail flowing over time
    function animateBloodTrail(targetDashOffset, duration) {
        const bloodPath = document.getElementById('blood-path');
        if (!bloodPath) return;
        
        // Cancel any existing animation
        if (bloodTrailAnimationId) {
            cancelAnimationFrame(bloodTrailAnimationId);
        }
        
        const pathLength = bloodPath.getTotalLength();
        const startTime = performance.now();
        const startDashOffset = pathLength; // Start with no blood visible
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth blood flow
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            // Interpolate from current position to target
            const currentDashOffset = startDashOffset + (targetDashOffset - startDashOffset) * easedProgress;
            bloodPath.style.strokeDashoffset = currentDashOffset;
            
            if (progress < 1) {
                bloodTrailAnimationId = requestAnimationFrame(animate);
            }
        }
        
        bloodTrailAnimationId = requestAnimationFrame(animate);
    }

    // Reset blood trail
    window.resetBloodTrail = function() {
        // Cancel any running animation
        if (bloodTrailAnimationId) {
            cancelAnimationFrame(bloodTrailAnimationId);
            bloodTrailAnimationId = null;
        }
        
        const bloodPath = document.getElementById('blood-path');
        const bloodPool = document.querySelector('.blood-pool');
        
        if (bloodPath) {
            const pathLength = bloodPath.getTotalLength();
            bloodPath.style.strokeDasharray = pathLength + ' ' + pathLength;
            bloodPath.style.strokeDashoffset = pathLength; // Reset to no blood visible
        }
        
        if (bloodPool) {
            bloodPool.classList.remove('visible');
        }
        
        bloodTrailProgress = 0;
        currentAnimationDuration = BASE_ANIMATION_DURATION;
    };

    function showTimer(seconds, callback) {
        const timerOverlay = document.getElementById('timer-overlay');
        const timerCount = document.getElementById('timer-count');
        
        timerCount.textContent = formatTime(seconds);
        timerOverlay.classList.remove('hidden');
        
        setTimeout(() => {
            timerOverlay.classList.add('hidden');
            if (callback) callback();
        }, 3000);
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateTapeNumber() {
        const tapeNumber = document.getElementById('tape-number');
        tapeNumber.textContent = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0');
    }
  
    // Progress management
    function loadProgress() {
        const saved = localStorage.getItem('vhsHorrorProgress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                // Check for unlocked INSANE mode
                if (progress.insaneUnlocked) {
                    document.querySelector('[data-difficulty="insane"]').classList.remove('hidden');
                }
            } catch (e) {
                console.error('Error loading progress:', e);
            }
        }
    }

    function saveProgress() {
        const progress = {
            lastPlayed: Date.now(),
            storiesCompleted: getCompletedStories(),
            insaneUnlocked: document.querySelector('[data-difficulty="insane"]').classList.contains('hidden') === false
        };
        localStorage.setItem('vhsHorrorProgress', JSON.stringify(progress));
    }

    function isStoryUnlocked(storyId) {
        const saved = localStorage.getItem('vhsHorrorProgress');
        if (!saved) return storyId === 'cabin_stalkings'; // First story always unlocked
        
        try {
            const progress = JSON.parse(saved);
            if (storyId === 'cabin_stalkings') return true;
            
            // Check if previous story is completed
            const allStories = puzzleLoader.getAllStories();
            const currentIndex = allStories.findIndex(s => s.id === storyId);
            
            if (currentIndex <= 0) return true;
            
            const previousStoryId = allStories[currentIndex - 1].id;
            return progress.storiesCompleted && progress.storiesCompleted.includes(previousStoryId);
        } catch (e) {
            return storyId === 'cabin_stalkings';
        }
    }

    function isStoryCompleted(storyId) {
        const saved = localStorage.getItem('vhsHorrorProgress');
        if (!saved) return false;
        
        try {
            const progress = JSON.parse(saved);
            return progress.storiesCompleted && progress.storiesCompleted.includes(storyId);
        } catch (e) {
            return false;
        }
    }

    function markStoryCompleted(storyId) {
        const saved = localStorage.getItem('vhsHorrorProgress');
        let progress = { storiesCompleted: [] };
        
        if (saved) {
            try {
                progress = JSON.parse(saved);
            } catch (e) {}
        }
        
        if (!progress.storiesCompleted) {
            progress.storiesCompleted = [];
        }
        
        if (!progress.storiesCompleted.includes(storyId)) {
            progress.storiesCompleted.push(storyId);
            localStorage.setItem('vhsHorrorProgress', JSON.stringify(progress));
        }
    }

    function markStoryUnlocked(storyId) {
        // Stories are unlocked when previous is completed
        // This is handled in isStoryUnlocked()
    }

    function getCompletedStories() {
        const saved = localStorage.getItem('vhsHorrorProgress');
        if (!saved) return [];
        
        try {
            const progress = JSON.parse(saved);
            return progress.storiesCompleted || [];
        } catch (e) {
            return [];
        }
    }
});
