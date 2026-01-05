// Tape Quality System - Manages tape degradation and rewind mechanics

class TapeQualitySystem {
    constructor() {
        this.quality = 100;
        this.maxQuality = 100;
        this.minQuality = 0;
        this.rewinds = 3;
        this.maxRewinds = 3;
        this.difficulty = 'medium';
        this.callbacks = {
            onQualityChange: null,
            onQualityCritical: null,
            onRewindUse: null,
            onGameOver: null
        };
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        
        switch (difficulty) {
            case 'easy':
                this.maxRewinds = 3;
                break;
            case 'medium':
                this.maxRewinds = 2;
                break;
            case 'hard':
                this.maxRewinds = 1;
                break;
            case 'insane':
                this.maxRewinds = 1;
                break;
            default:
                this.maxRewinds = 3;
        }
        
        this.reset();
    }

    reset() {
        this.quality = this.maxQuality;
        this.rewinds = this.maxRewinds;

        resetBloodTrail();
        this.updateUI();
    }

    decreaseQuality(amount = 10) {
        this.quality = Math.max(this.minQuality, this.quality - amount);
        
        if (this.quality <= 0) {
            this.handleGameOver();
        } else if (this.quality <= 20) {
            if (this.callbacks.onQualityCritical) {
                this.callbacks.onQualityCritical();
            }
        }
        
        if (this.callbacks.onQualityChange) {
            this.callbacks.onQualityChange(this.quality);
        }
        
        this.updateUI();
    }

    increaseQuality(amount = 5) {
        this.quality = Math.min(this.maxQuality, this.quality + amount);
        
        if (this.callbacks.onQualityChange) {
            this.callbacks.onQualityChange(this.quality);
        }
        
        this.updateUI();
    }

    useRewind() {
        if (this.rewinds <= 0) {
            return false;
        }
        
        this.rewinds--;
        
        if (this.callbacks.onRewindUse) {
            this.callbacks.onRewindUse(this.rewinds);
        }
        
        this.updateUI();
        return true;
    }

    getQuality() {
        return this.quality;
    }

    getRewinds() {
        return this.rewinds;
    }

    getQualityLevel() {
        if (this.quality >= 80) return 'high';
        if (this.quality >= 60) return 'medium-high';
        if (this.quality >= 40) return 'medium';
        if (this.quality >= 20) return 'medium-low';
        return 'critical';
    }

    updateUI() {
        const qualityFill = document.querySelectorAll('.quality-fill');
        qualityFill.forEach(fill => {
            fill.style.width = `${this.quality}%`;
        });

        const rewindCount = document.getElementById('rewind-count');
        if (rewindCount) {
            rewindCount.textContent = this.rewinds;
        }

        // Update chain visuals
        this.updateChains();

        // Update tape quality class on container
        const container = document.getElementById('main-container');
        if (container) {
            container.className = '';
            if (this.quality >= 80) container.classList.add('tape-quality-100');
            else if (this.quality >= 60) container.classList.add('tape-quality-60');
            else if (this.quality >= 40) container.classList.add('tape-quality-40');
            else if (this.quality >= 20) container.classList.add('tape-quality-20');
            else container.classList.add('tape-quality-0');
        }
    }

    updateChains() {
        // Update chains (old style)
        const chains = document.querySelectorAll('.chain');
        chains.forEach((chain, index) => {
            const chainNum = index + 1;
            chain.classList.remove('active', 'lost');
            
            if (chainNum <= this.rewinds) {
                chain.classList.add('active');
            } else {
                chain.classList.add('lost');
            }
        });
        
        // Update VHS counter SVG elements
        const vhsIcons = document.querySelectorAll('.vhs-icon');
        vhsIcons.forEach((icon, index) => {
            const iconNum = index + 1;
            icon.classList.remove('active', 'lost', 'hidden');

            if (iconNum <= this.maxRewinds) {
                if (iconNum <= this.rewinds) {
                    icon.classList.add('active');
                } else {
                    icon.classList.add('lost');
                }
            } else {
                icon.classList.add('hidden');
            }
        });
    }

    onQualityChange(callback) {
        this.callbacks.onQualityChange = callback;
    }

    onQualityCritical(callback) {
        this.callbacks.onQualityCritical = callback;
    }

    onRewindUse(callback) {
        this.callbacks.onRewindUse = callback;
    }

    onGameOver(callback) {
        this.callbacks.onGameOver = callback;
    }

    handleGameOver() {
        if (this.callbacks.onGameOver) {
            this.callbacks.onGameOver();
        }
    }
}

// Global tape quality system instance
const tapeQualitySystem = new TapeQualitySystem();
