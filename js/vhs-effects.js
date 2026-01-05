// VHS Effects Engine - Generates horror atmosphere effects

class VHSEffects {
    constructor() {
        this.staticCanvas = document.getElementById('static-canvas');
        this.staticCtx = this.staticCanvas.getContext('2d');
        this.scanlines = document.getElementById('scanlines');
        this.trackingLines = document.getElementById('tracking-lines');
        this.currentTypewriterTimeout = null;
        
        this.initAudio();
        this.initCanvas();
        this.startStatic();
    }

    initAudio() {
        try {
            this.jumpscareAudio = new Audio('assets/audio/jumpscare.mp3');
            this.jumpscareAudio.volume = 1.0;
            
            this.errorAudio = new Audio('assets/audio/error.wav');
            this.errorAudio.volume = 0.5;
            
            this.successAudio = new Audio('assets/audio/success.ogg');
            this.successAudio.volume = 0.5;
            
            this.clickAudio = new Audio('assets/audio/click.wav');
            this.clickAudio.volume = 0.3;
        } catch (e) {
            console.warn('Audio not available:', e);
        }
    }

    initCanvas() {
        this.staticCanvas.width = window.innerWidth;
        this.staticCanvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            this.staticCanvas.width = window.innerWidth;
            this.staticCanvas.height = window.innerHeight;
        });
    }

    startStatic() {
        const drawStatic = () => {
            const width = this.staticCanvas.width;
            const height = this.staticCanvas.height;
            
            const imageData = this.staticCtx.createImageData(width, height);
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
                const value = Math.random() * 255;
                data[i] = value;
                data[i + 1] = value;
                data[i + 2] = value;
                data[i + 3] = 255;
            }
            
            this.staticCtx.putImageData(imageData, 0, 0);
            requestAnimationFrame(drawStatic);
        };
        
        drawStatic();
    }

    // Effect: Screen shake on errors
    shake() {
        const container = document.getElementById('main-container');
        container.classList.add('shake');
        
        setTimeout(() => {
            container.classList.remove('shake');
        }, 500);
    }

    // Effect: Color shift based on tape quality
    colorShift() {
        const container = document.getElementById('main-container');
        container.classList.add('color-shift');
        
        setTimeout(() => {
            container.classList.remove('color-shift');
        }, 500);
    }

    // Effect: Scanline flicker (increases with degradation)
    flickerScanlines(intensity = 1) {
        this.scanlines.style.animationDuration = `${0.1 / intensity}s`;
        this.scanlines.classList.add('scanline-flicker');
        
        setTimeout(() => {
            this.scanlines.classList.remove('scanline-flicker');
        }, 1000);
    }

    // Effect: Tracking error (tape misalignment)
    trackingError() {
        const container = document.getElementById('main-container');
        container.classList.add('tracking-error');
        
        setTimeout(() => {
            container.classList.remove('tracking-error');
        }, 500);
    }

    // Effect: Dropout (momentary loss of signal)
    dropout() {
        const container = document.getElementById('main-container');
        container.classList.add('dropout');
        
        setTimeout(() => {
            container.classList.remove('dropout');
        }, 300);
    }

    // Effect: Vertical hold loss (screen rolls)
    verticalHold() {
        const container = document.getElementById('main-container');
        container.classList.add('vertical-hold');
        
        setTimeout(() => {
            container.classList.remove('vertical-hold');
        }, 1000);
    }

    // Effect: Apply effects based on tape quality
    applyEffectsBasedOnQuality(quality) {
        if (quality <= 80 && quality > 60) {
            // Minor static
            this.staticCanvas.style.opacity = '0.05';
        } else if (quality <= 60 && quality > 40) {
            // Moderate effects
            this.staticCanvas.style.opacity = '0.08';
            this.flickerScanlines(1);
        } else if (quality <= 40 && quality > 20) {
            // Heavy effects
            this.staticCanvas.style.opacity = '0.12';
            this.flickerScanlines(2);
            this.colorShift();
        } else if (quality <= 20 && quality > 0) {
            // Critical effects
            this.staticCanvas.style.opacity = '0.15';
            this.flickerScanlines(3);
            this.trackingError();
            this.colorShift();
        } else if (quality <= 0) {
            // Tape corrupted
            this.staticCanvas.style.opacity = '0.2';
            this.verticalHold();
        }
    }

    // Effect: Trigger jumpscare
    jumpscare() {
        const overlay = document.getElementById('jumpscare-overlay');
        const horrorDoor = document.getElementById('horror-door');
        
        overlay.classList.remove('hidden');
        
        if (horrorDoor) {
            horrorDoor.classList.add('open');
        }
        
        if (this.jumpscareAudio) {
            this.jumpscareAudio.currentTime = 0;
            this.jumpscareAudio.play().catch(() => {});
        }
        
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 3000);
    }

    // Effect: Play error sound
    playError() {
        if (this.errorAudio) {
            this.errorAudio.currentTime = 0;
            this.errorAudio.play().catch(() => {});
        }
    }

    // Effect: Play success sound
    playSuccess() {
        if (this.successAudio) {
            this.successAudio.currentTime = 0;
            this.successAudio.play().catch(e => console.log('Success audio play failed:', e));
        }
    }

    // Effect: Play click sound
    playClick() {
        if (this.clickAudio) {
            this.clickAudio.currentTime = 0;
            this.clickAudio.play().catch(() => {});
        }
    }

    // Effect: Typewriter text animation
    typeText(element, text, speed = 15) {
        return new Promise((resolve) => {
            // Cancel any ongoing typing
            if (this.currentTypewriterTimeout) {
                clearTimeout(this.currentTypewriterTimeout);
            }
            
            let index = 0;
            element.textContent = '';
            
            const typeChar = () => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    this.currentTypewriterTimeout = setTimeout(typeChar, speed);
                } else {
                    this.currentTypewriterTimeout = null;
                    resolve();
                }
            };
            
            typeChar();
        });
    }
    
    // Cancel any ongoing typewriter animation
    cancelTypewriter() {
        if (this.currentTypewriterTimeout) {
            clearTimeout(this.currentTypewriterTimeout);
            this.currentTypewriterTimeout = null;
        }
    }

    // Effect: Glitch text
    glitchText(element, originalText, duration = 2000) {
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        let iterations = 0;
        
        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((letter, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            
            if (iterations >= originalText.length) {
                clearInterval(interval);
            }
            
            iterations += 1 / 3;
        }, 30);
    }
}

// Global VHS effects instance
const vhsEffects = new VHSEffects();
