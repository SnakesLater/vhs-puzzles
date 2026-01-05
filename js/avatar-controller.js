// Avatar Video Controller - Plays MP4 forward, pauses at end frames

class AvatarVideoController {
    constructor(videoElement) {
        this.video = videoElement;
        this.endFrames = [3.5, 7.2, 10.8, 14.5];
        this.currentFrameIndex = 0;
        this.playbackRate = 0.4;
        this.isPaused = false;
        this.isSetup = false;
        
        this.setup();
    }
    
    setup() {
        if (!this.video) {
            console.error('Avatar video element not found');
            return;
        }
        
        this.video.volume = 0;
        this.video.muted = true;
        this.video.loop = false;
        
        this.video.addEventListener('loadedmetadata', () => {
            this.isSetup = true;
            this.startPlayback();
        });
        
        if (this.video.readyState >= 1) {
            this.isSetup = true;
            this.startPlayback();
        }
    }
    
    startPlayback() {
        if (this.isPaused) return;
        this.playForward();
    }
    
    async playForward() {
        if (this.isPaused) return;
        
        const targetTime = this.endFrames[this.currentFrameIndex];
        
        try {
            this.video.playbackRate = this.playbackRate;
            await this.video.play();
        } catch (e) {
            return;
        }
        
        await this.waitForTime(targetTime);
        
        if (this.isPaused) return;
        this.video.pause();
        
        setTimeout(() => {
            if (!this.isPaused && this.isSetup) {
                this.restartFromBeginning();
            }
        }, 800);
    }
    
    async restartFromBeginning() {
        this.video.currentTime = 0;
        this.playForward();
    }
    
    waitForTime(targetTime) {
        return new Promise((resolve) => {
            const checkTime = () => {
                if (this.isPaused) {
                    resolve();
                    return;
                }
                if (this.video.currentTime >= targetTime) {
                    resolve();
                } else {
                    requestAnimationFrame(checkTime);
                }
            };
            requestAnimationFrame(checkTime);
        });
    }
    
    onCorrectGuess() {
        this.currentFrameIndex = (this.currentFrameIndex + 1) % this.endFrames.length;
    }
    
    pause() {
        this.isPaused = true;
        this.video.pause();
    }
    
    resume() {
        this.isPaused = false;
        this.restartFromBeginning();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('avatar-video');
    if (videoElement) {
        window.avatarController = new AvatarVideoController(videoElement);
    }
});
