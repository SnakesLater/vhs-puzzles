/**
 * SIGNAL STATIC - VHS Horror Puzzle
 * Player must tune through TV static to find hidden images/messages
 * Static interference creates creepy atmosphere with jump scares
 */

class SignalStaticPuzzle extends BaseGame {
    constructor() {
        super();
        this.name = "Signal Static";
        this.difficulty = "medium";
        this.timeLimit = 180; // 3 minutes
        
        this.channels = [];
        this.currentChannel = 0;
        this.targetSignals = [];
        this.foundSignals = [];
        this.staticIntensity = 0.8;
        this.scanSpeed = 1;
        
        this.initializeChannels();
    }

    initializeChannels() {
        // Create 20 channels with different static patterns
        for (let i = 0; i < 20; i++) {
            this.channels.push({
                frequency: 87.5 + (i * 0.5), // FM frequencies
                hasSignal: Math.random() < 0.3, // 30% chance of hidden signal
                signalType: this.getRandomSignalType(),
                staticPattern: this.generateStaticPattern(),
                interference: Math.random() * 0.9 + 0.1
            });
        }
        
        // Ensure at least 5 channels have signals
        let signalCount = this.channels.filter(c => c.hasSignal).length;
        while (signalCount < 5) {
            let randomChannel = Math.floor(Math.random() * 20);
            if (!this.channels[randomChannel].hasSignal) {
                this.channels[randomChannel].hasSignal = true;
                this.channels[randomChannel].signalType = this.getRandomSignalType();
                signalCount++;
            }
        }
        
        this.targetSignals = this.channels
            .filter(c => c.hasSignal)
            .map(c => c.signalType);
    }

    getRandomSignalType() {
        const signals = [
            "HELP_ME", "BEHIND_YOU", "GET_OUT", "DONT_LOOK", "ITS_COMING",
            "EMERGENCY", "WARNING", "ESCAPE", "HIDE_NOW", "TOO_LATE"
        ];
        return signals[Math.floor(Math.random() * signals.length)];
    }

    generateStaticPattern() {
        // Generate unique static interference pattern
        let pattern = [];
        for (let i = 0; i < 100; i++) {
            pattern.push({
                x: Math.random(),
                y: Math.random(),
                intensity: Math.random(),
                flicker: Math.random() * 10
            });
        }
        return pattern;
    }

    render() {
        return `
            <div class="signal-static-container">
                <div class="tv-screen" id="tvScreen">
                    <div class="static-overlay" id="staticOverlay"></div>
                    <div class="signal-display" id="signalDisplay"></div>
                    <div class="scan-line" id="scanLine"></div>
                </div>
                
                <div class="tuner-controls">
                    <div class="frequency-display">
                        <span id="frequencyValue">${this.channels[this.currentChannel].frequency}</span> MHz
                    </div>
                    
                    <div class="tuner-dial">
                        <input type="range" 
                               id="channelTuner" 
                               min="0" 
                               max="19" 
                               value="${this.currentChannel}"
                               class="dial-slider">
                    </div>
                    
                    <div class="signal-strength">
                        <div class="strength-bars">
                            ${Array(10).fill().map((_, i) => 
                                `<div class="bar" data-level="${i}"></div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="found-signals">
                    <h3>Intercepted Signals:</h3>
                    <div id="foundList">
                        ${this.foundSignals.map(signal => 
                            `<div class="signal-item">${signal}</div>`
                        ).join('')}
                    </div>
                    <div class="progress">${this.foundSignals.length}/${this.targetSignals.length}</div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const tuner = document.getElementById('channelTuner');
        const tvScreen = document.getElementById('tvScreen');
        
        tuner.addEventListener('input', (e) => {
            this.currentChannel = parseInt(e.target.value);
            this.updateChannel();
        });
        
        // Auto-scan mode
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleAutoScan();
            }
        });
        
        // Start static animation
        this.animateStatic();
        this.updateChannel();
    }

    updateChannel() {
        const channel = this.channels[this.currentChannel];
        const frequencyDisplay = document.getElementById('frequencyValue');
        const signalDisplay = document.getElementById('signalDisplay');
        const strengthBars = document.querySelectorAll('.strength-bars .bar');
        
        // Update frequency display
        frequencyDisplay.textContent = channel.frequency;
        
        // Update signal strength bars
        const signalStrength = channel.hasSignal ? 
            (1 - channel.interference) * 10 : 
            Math.random() * 3;
            
        strengthBars.forEach((bar, i) => {
            bar.classList.toggle('active', i < signalStrength);
        });
        
        // Show signal if present and strong enough
        if (channel.hasSignal && channel.interference < 0.6) {
            this.revealSignal(channel);
        } else {
            signalDisplay.innerHTML = '';
        }
        
        // Update static intensity
        this.staticIntensity = channel.interference;
        
        // Play tuning sound
        this.playTuningSound();
    }

    revealSignal(channel) {
        const signalDisplay = document.getElementById('signalDisplay');
        
        // Check if already found
        if (this.foundSignals.includes(channel.signalType)) {
            signalDisplay.innerHTML = `<div class="clear-signal">${channel.signalType}</div>`;
            return;
        }
        
        // Gradually reveal signal through static
        let clarity = 1 - channel.interference;
        let revealedText = this.scrambleText(channel.signalType, clarity);
        
        signalDisplay.innerHTML = `
            <div class="emerging-signal" style="opacity: ${clarity}">
                ${revealedText}
            </div>
        `;
        
        // If signal is clear enough, mark as found
        if (clarity > 0.7) {
            setTimeout(() => {
                this.foundSignal(channel.signalType);
            }, 1000);
        }
    }

    scrambleText(text, clarity) {
        const chars = '█▓▒░▄▀■□▪▫';
        return text.split('').map(char => {
            if (char === '_') return '_';
            return Math.random() < clarity ? char : 
                   chars[Math.floor(Math.random() * chars.length)];
        }).join('');
    }

    foundSignal(signalType) {
        if (this.foundSignals.includes(signalType)) return;
        
        this.foundSignals.push(signalType);
        this.updateFoundSignals();
        
        // Jump scare effect
        this.triggerStaticBurst();
        
        // Check win condition
        if (this.foundSignals.length >= 5) {
            setTimeout(() => this.completeGame(), 1500);
        }
    }

    updateFoundSignals() {
        const foundList = document.getElementById('foundList');
        foundList.innerHTML = this.foundSignals.map(signal => 
            `<div class="signal-item found">${signal}</div>`
        ).join('');
        
        document.querySelector('.progress').textContent = 
            `${this.foundSignals.length}/${Math.min(5, this.targetSignals.length)}`;
    }

    animateStatic() {
        const staticOverlay = document.getElementById('staticOverlay');
        
        const updateStatic = () => {
            let staticHTML = '';
            const density = this.staticIntensity * 200;
            
            for (let i = 0; i < density; i++) {
                staticHTML += `<div class="static-dot" 
                    style="left: ${Math.random() * 100}%; 
                           top: ${Math.random() * 100}%; 
                           opacity: ${Math.random() * this.staticIntensity}">
                </div>`;
            }
            
            staticOverlay.innerHTML = staticHTML;
            
            if (this.gameActive) {
                requestAnimationFrame(updateStatic);
            }
        };
        
        updateStatic();
    }

    triggerStaticBurst() {
        const tvScreen = document.getElementById('tvScreen');
        tvScreen.classList.add('static-burst');
        
        // Brief white noise flash
        this.staticIntensity = 1.0;
        
        setTimeout(() => {
            tvScreen.classList.remove('static-burst');
            this.staticIntensity = this.channels[this.currentChannel].interference;
        }, 300);
    }

    playTuningSound() {
        // Create brief static/tuning sound effect
        if (this.audioContext) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(
                200 + Math.random() * 1000, 
                this.audioContext.currentTime
            );
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.001, 
                this.audioContext.currentTime + 0.1
            );
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.1);
        }
    }

    getCSS() {
        return `
            .signal-static-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                padding: 20px;
                background: #000;
                min-height: 100vh;
            }
            
            .tv-screen {
                position: relative;
                width: 600px;
                height: 400px;
                background: #111;
                border: 20px solid #333;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 0 50px rgba(0,255,0,0.3);
            }
            
            .static-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }
            
            .static-dot {
                position: absolute;
                width: 2px;
                height: 2px;
                background: white;
                animation: flicker 0.1s infinite;
            }
            
            .signal-display {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-family: 'Courier New', monospace;
                font-size: 24px;
                color: #00ff00;
                text-shadow: 0 0 10px #00ff00;
                text-align: center;
                z-index: 10;
            }
            
            .emerging-signal {
                animation: emerge 2s ease-in-out;
            }
            
            .clear-signal {
                color: #ffffff;
                text-shadow: 0 0 15px #ffffff;
            }
            
            .scan-line {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: rgba(0,255,0,0.5);
                animation: scan 2s linear infinite;
            }
            
            .tuner-controls {
                display: flex;
                align-items: center;
                gap: 30px;
                background: #222;
                padding: 20px;
                border-radius: 10px;
                border: 2px solid #444;
            }
            
            .frequency-display {
                font-family: 'Courier New', monospace;
                font-size: 18px;
                color: #00ff00;
                text-shadow: 0 0 5px #00ff00;
            }
            
            .dial-slider {
                width: 300px;
                height: 10px;
                background: #333;
                border-radius: 5px;
                outline: none;
            }
            
            .dial-slider::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                background: #00ff00;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 0 10px #00ff00;
            }
            
            .strength-bars {
                display: flex;
                gap: 3px;
                align-items: end;
            }
            
            .strength-bars .bar {
                width: 8px;
                height: 20px;
                background: #333;
                border-radius: 2px;
                transition: background 0.2s;
            }
            
            .strength-bars .bar.active {
                background: #00ff00;
                box-shadow: 0 0 5px #00ff00;
            }
            
            .found-signals {
                background: #111;
                padding: 20px;
                border-radius: 10px;
                border: 2px solid #333;
                min-width: 300px;
            }
            
            .found-signals h3 {
                color: #00ff00;
                margin-bottom: 15px;
                text-shadow: 0 0 5px #00ff00;
            }
            
            .signal-item {
                font-family: 'Courier New', monospace;
                color: #666;
                padding: 5px;
                margin: 5px 0;
                border-left: 3px solid #333;
            }
            
            .signal-item.found {
                color: #00ff00;
                border-left-color: #00ff00;
                text-shadow: 0 0 3px #00ff00;
                animation: signalFound 0.5s ease-out;
            }
            
            .progress {
                color: #888;
                font-size: 14px;
                margin-top: 10px;
            }
            
            .static-burst {
                animation: staticFlash 0.3s ease-out;
            }
            
            @keyframes flicker {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
            
            @keyframes emerge {
                0% { opacity: 0; transform: scale(0.8); }
                100% { opacity: 1; transform: scale(1); }
            }
            
            @keyframes scan {
                0% { top: 0; }
                100% { top: 100%; }
            }
            
            @keyframes signalFound {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            @keyframes staticFlash {
                0% { filter: brightness(1); }
                50% { filter: brightness(3) contrast(2); }
                100% { filter: brightness(1); }
            }
        `;
    }
}

// Register the puzzle
window.SignalStaticPuzzle = SignalStaticPuzzle;