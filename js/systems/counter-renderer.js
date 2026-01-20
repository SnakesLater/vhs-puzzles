// Counter Renderer - Handles VHS tape counter icons in header
class CounterRenderer {
    constructor() {
        // No initialization needed
    }

    // Draw counter tape (small black tape)
    drawCounterTape(ctx, width, height, isActive = true) {
        // Clear canvas
        ctx.fillStyle = isActive ? '#1a1a1a' : '#0a0a0a';
        ctx.fillRect(0, 0, width, height);

        // Border
        ctx.strokeStyle = isActive ? '#ff6b35' : '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, width - 2, height - 2);

        // Small reel indicator (center circle)
        ctx.fillStyle = isActive ? '#ff6b35' : '#333';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Update counter display for all tapes
    renderCounterTapes() {
        const tapes = document.querySelectorAll('.vhs-counter-canvas');
        tapes.forEach((canvas, index) => {
            const ctx = canvas.getContext('2d');
            const isActive = index < tapeQualitySystem.rewinds;
            this.drawCounterTape(ctx, canvas.width, canvas.height, isActive);
        });
    }

    // Update counter display
    updateCounterDisplay() {
        this.renderCounterTapes();
    }
}