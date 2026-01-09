// VHS Effects Engine - Generates horror atmosphere effects

class VHSEffects {
    constructor() {
        this.staticCanvas = document.getElementById('static-canvas');
        this.staticCtx = this.staticCanvas.getContext('2d');
        this.scanlines = document.getElementById('scanlines');
        this.trackingLines = document.getElementById('tracking-lines');
        this.currentTypewriterTimeout = null;
        this.audioUnlocked = false;
        this.staticAnimationId = null;
        
        this.initAudio();
        this.initCanvas();
        this.startStatic();
        this.setupAudioUnlock();
    }

    setupAudioUnlock() {
        const unlockAudio = () => {
            if (this.audioUnlocked) {return;}
            this.audioUnlocked = true;
            
            // Try to play and immediately pause each audio to unlock
            const audioElements = [this.clickAudio, this.errorAudio, this.successAudio, this.jumpscareAudio];
            audioElements.forEach(audio => {
                if (audio) {
                    audio.play().then(() => {
                        audio.pause();
                        audio.currentTime = 0;
                    }).catch(() => {});
                }
            });
            
            console.log('Audio unlocked via user interaction');
        };
        
        // Unlock on first click anywhere
        document.addEventListener('click', unlockAudio, { once: true });
        document.addEventListener('keydown', unlockAudio, { once: true });
    }
    
    async initAudio() {
        // Load audio on-demand using asset loader
        this.audioCache = new Map();
        
        // Preload critical audio
        try {
            await assetLoader.preloadCritical();
        } catch (e) {
            console.warn('Failed to preload critical audio:', e);
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
        let lastUpdate = 0;
        const updateInterval = 100; // Update every 100ms instead of every frame
        
        const drawStatic = (timestamp) => {
            if (timestamp - lastUpdate < updateInterval) {
                this.staticAnimationId = requestAnimationFrame(drawStatic);
                return;
            }
            
            lastUpdate = timestamp;
            const width = this.staticCanvas.width;
            const height = this.staticCanvas.height;
            
            // Only update if canvas is visible
            if (this.staticCanvas.style.opacity === '0') {
                this.staticAnimationId = requestAnimationFrame(drawStatic);
                return;
            }
            
            const imageData = this.staticCtx.createImageData(width, height);
            const data = imageData.data;
            
            // Reduce static density for performance
            for (let i = 0; i < data.length; i += 8) { // Skip pixels for performance
                const value = Math.random() * 255;
                data[i] = value;
                data[i + 1] = value;
                data[i + 2] = value;
                data[i + 3] = 255;
            }
            
            this.staticCtx.putImageData(imageData, 0, 0);
            this.staticAnimationId = requestAnimationFrame(drawStatic);
        };
        
        this.staticAnimationId = requestAnimationFrame(drawStatic);
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

    // Effect: Progressive failure visuals for misses
    failureVisual(level = 1) {
        // Play error sound and small shake
        this.playError();
        this.shake();

        if (level === 1) {
            // Small flicker and brief dropout
            this.flickerScanlines(1);
            this.dropout();
        } else if (level === 2) {
            // Stronger glitch: tracking + scanline flicker
            this.flickerScanlines(2);
            this.trackingError();
            this.colorShift();
        } else {
            // Critical: vertical hold + heavier static and insert VHS prompt
            this.staticCanvas.style.opacity = '0.25';
            this.flickerScanlines(3);
            this.trackingError();
            this.verticalHold();
            this.showInsertVHS('PLEASE INSERT VHS #2 TO CONTINUE', 5000);
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
    async playError() {
        const audio = await assetLoader.loadAudio('assets/audio/error');
        if (audio) {
            audio.currentTime = 0;
            audio.volume = 0.5;
            audio.play().catch(e => {
                console.log('Error audio play failed:', e.message);
            });
        }
    }

    // Effect: Play success sound
    async playSuccess() {
        const audio = await assetLoader.loadAudio('assets/audio/success');
        if (audio) {
            audio.currentTime = 0;
            audio.volume = 0.5;
            audio.play().catch(e => {
                console.log('Success audio play failed:', e.message);
            });
        }
    }

    // Effect: Play click sound
    async playClick() {
        const audio = await assetLoader.loadAudio('assets/audio/click');
        if (audio) {
            audio.currentTime = 0;
            audio.volume = 0.3;
            audio.play().catch(e => {
                console.log('Click audio play failed:', e.message);
            });
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

    // Show an overlay prompting for VHS insertion
    showInsertVHS(message = 'PLEASE INSERT VHS', duration = 4000) {
        // avoid duplicates
        if (document.getElementById('vhs-insert-overlay')) {return;}
        const overlay = document.createElement('div');
        overlay.id = 'vhs-insert-overlay';
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = 9999;
        overlay.style.pointerEvents = 'none';
        overlay.style.backdropFilter = 'blur(2px)';

        const box = document.createElement('div');
        box.style.padding = '20px 30px';
        box.style.background = 'rgba(0,0,0,0.75)';
        box.style.border = '2px solid rgba(255,255,255,0.08)';
        box.style.color = '#fff';
        box.style.font = 'bold 28px "Courier New"';
        box.style.letterSpacing = '2px';
        box.style.textAlign = 'center';
        box.textContent = message;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // Glitch the text slightly
        this.glitchText(box, message, 1500);

        setTimeout(() => {
            if (overlay && overlay.parentNode) {overlay.parentNode.removeChild(overlay);}
        }, duration);
    }
}

// Global VHS effects instance
const vhsEffects = new VHSEffects();
