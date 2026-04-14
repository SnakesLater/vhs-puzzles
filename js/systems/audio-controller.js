// Audio Controller - Sound toggle and volume management
class AudioController {
    constructor() {
        this.muted = this.loadMuteState();
        this.volume = 0.5; // Default 50%
        this.audioElements = new Set();
    }

    // Load mute preference from localStorage
    loadMuteState() {
        try {
            return localStorage.getItem('vhsAudioMuted') === 'true';
        } catch (e) {
            return false;
        }
    }

    // Save mute preference to localStorage
    saveMuteState() {
        try {
            localStorage.setItem('vhsAudioMuted', this.muted);
        } catch (e) {
            console.warn('Could not save audio preference');
        }
    }

    // Toggle mute state
    toggleMute() {
        this.muted = !this.muted;
        this.saveMuteState();

        // Mute/unmute all active audio
        this.audioElements.forEach(audio => {
            audio.muted = this.muted;
        });

        return this.muted;
    }

    // Set muted state
    setMuted(muted) {
        this.muted = muted;
        this.saveMuteState();
        this.audioElements.forEach(audio => {
            audio.muted = muted;
        });
    }

    // Check if muted
    isMuted() {
        return this.muted;
    }

    // Register audio element for tracking
    registerAudio(audio) {
        if (audio) {
            audio.muted = this.muted;
            audio.volume = this.volume;
            this.audioElements.add(audio);

            // Auto-cleanup when audio finishes
            audio.addEventListener('ended', () => {
                this.unregisterAudio(audio);
            }, { once: true });
        }
        return audio;
    }

    // Unregister audio element
    unregisterAudio(audio) {
        this.audioElements.delete(audio);
    }

    // Play sound with mute check
    async playSound(audioPromise) {
        if (this.muted) {return null;}

        try {
            const audio = await audioPromise;
            if (audio) {
                this.registerAudio(audio);
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        // Audio play failed (common on mobile without user interaction)
                        console.log('Audio play prevented:', e.message);
                    });
                }
            }
            return audio;
        } catch (e) {
            console.warn('Error playing sound:', e);
            return null;
        }
    }

    // Create a click sound (uses browser's built-in click)
    playClick() {
        return this.playSound(assetLoader.loadAudio('assets/audio/click', ['mp3', 'ogg']));
    }

    // Play success sound
    playSuccess() {
        return this.playSound(assetLoader.loadAudio('assets/audio/success', ['mp3', 'ogg']));
    }

    // Play error sound
    playError() {
        return this.playSound(assetLoader.loadAudio('assets/audio/error', ['wav', 'mp3', 'ogg']));
    }

    // Cleanup
    cleanup() {
        this.audioElements.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.audioElements.clear();
    }
}

const audioController = new AudioController();
