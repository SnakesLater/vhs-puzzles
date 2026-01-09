// Base Game Template - All puzzle games inherit from this
class BaseGame {
    constructor(containerId, gameData) {
        this.container = document.getElementById(containerId);
        this.gameData = gameData;
        this.isComplete = false;
        this.timer = null;
        this.timeRemaining = null;
        
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    // Override in child classes
    render() {
        throw new Error('render() must be implemented by child class');
    }

    // Override in child classes  
    setupEventListeners() {
        throw new Error('setupEventListeners() must be implemented by child class');
    }

    // Common timer functionality
    startTimer(seconds) {
        this.timeRemaining = seconds;
        this.timer = cleanupManager.addTimer(setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.stopTimer();
                this.onTimeUp();
            }
        }, 1000));
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateTimerDisplay() {
        const display = document.getElementById('timer-count');
        if (display) {
            const mins = Math.floor(this.timeRemaining / 60);
            const secs = this.timeRemaining % 60;
            display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    // Override in child classes
    onTimeUp() {
        this.completeGame(false);
    }

    // Common completion logic
    completeGame(won) {
        this.isComplete = true;
        this.stopTimer();
        
        if (won) {
            vhsEffects.playSuccess();
            tapeQualitySystem.increaseQuality(10);
        } else {
            vhsEffects.playError();
            tapeQualitySystem.decreaseQuality(15);
        }
        
        eventManager.emit('gameComplete', won);
    }

    // Common cleanup
    cleanup() {
        this.stopTimer();
        cleanupManager.cleanupAll();
        this.isComplete = true;
    }
}