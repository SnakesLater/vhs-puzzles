// Tape Cover Renderer - Generates VHS movie-style cover art
class TapeCoverRenderer {
    constructor() {
        this.fonts = {
            horror: "Creepster, cursive",
            thriller: "VT323, monospace", 
            mystery: "Special Elite, monospace",
            default: "Courier New, monospace",
            danger: "Butcherman, cursive",
            success: "Black Ops One, sans-serif",
            warning: "Nosifer, cursive",
            purple: "Butcherman, cursive",
            decorative: "Butcherman, cursive",
            detective: "Special Elite, monospace"
        };
    }

    clearCanvas(ctx, width, height, color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
    }

    drawSkull(ctx, x, y, size) {
        ctx.fillStyle = '#ddd';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        // Eye sockets
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x - size * 0.3, y - size * 0.1, size * 0.2, 0, Math.PI * 2);
        ctx.arc(x + size * 0.3, y - size * 0.1, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        // Nose
        ctx.beginPath();
        ctx.moveTo(x, y + size * 0.1);
        ctx.lineTo(x - size * 0.15, y + size * 0.3);
        ctx.lineTo(x + size * 0.15, y + size * 0.3);
        ctx.fill();
    }

    drawBackInfo(ctx, width, height, lines) {
        ctx.fillStyle = '#fff';
        ctx.font = `${height * 0.04}px "Courier New"`;
        ctx.textAlign = 'left';
        
        let y = height * 0.4;
        lines.forEach((line, index) => {
            if (index < 4) {
                ctx.fillText(line, width * 0.1, y);
                y += height * 0.08;
            }
        });
    }

    // STORY MODE - Dark horror with dripping blood and floating particles
    drawStoryCover(ctx, width, height, backLines = null, isBack = false) {
        this.clearCanvas(ctx, width, height, '#0a0505');

        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a0000');
        gradient.addColorStop(0.5, '#3d0d0d');
        gradient.addColorStop(1, '#0a0505');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Floating dust particles - more
        ctx.fillStyle = 'rgba(139, 0, 0, 0.3)';
        for(let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 4 + 1;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // Blood drips from top - more and varied
        ctx.fillStyle = 'rgba(139, 0, 0, 0.7)';
        for(let i = 0; i < 12; i++) {
            const x = width * (0.05 + i * 0.08);
            const dripHeight = 30 + Math.random() * 80;
            ctx.fillRect(x - 3, 0, 6, dripHeight);
            // Drip tip
            ctx.beginPath();
            ctx.arc(x, dripHeight, 4, 0, Math.PI * 2);
            ctx.fill();
            // Splatter
            for(let j = 0; j < 5; j++) {
                const sx = x + (Math.random() - 0.5) * 20;
                const sy = dripHeight + Math.random() * 10;
                ctx.beginPath();
                ctx.arc(sx, sy, Math.random() * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Add stylized title
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${height * 0.08}px ${this.fonts.horror}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = '#8b0000';
        ctx.shadowBlur = height * 0.02;
        ctx.fillText("CINEMATIC ODYSSEY", width / 2, height * 0.15);
        ctx.shadowBlur = 0;

        // Add skull icon
        this.drawSkull(ctx, width * 0.5, height * 0.4, height * 0.1);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(width * 0.05, height * 0.85, width * 0.2, height * 0.1);
        ctx.strokeStyle = '#8b0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(width * 0.05, height * 0.85, width * 0.2, height * 0.1);
        ctx.fillStyle = '#ff6b35';
        ctx.font = `bold ${height * 0.05}px "Courier New"`;
        ctx.textAlign = 'center';
        ctx.fillText('NC-17', width * 0.15, height * 0.9);

        // Runtime beside rating
        ctx.fillStyle = '#ccc';
        ctx.font = `${height * 0.04}px "Courier New"`;
        ctx.textAlign = 'right';
        ctx.fillText('Runtime: VARIES', width * 0.95, height * 0.9);
    }

    // STORY BACK COVER - Unique back with horror elements
    drawStoryBackCover(ctx, width, height, backLines = null) {
        this.clearCanvas(ctx, width, height, '#0a0a0a');

        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a0000');
        gradient.addColorStop(0.5, '#2a0a0a');
        gradient.addColorStop(1, '#0a0000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Horror elements: chains with links
        ctx.strokeStyle = 'rgba(139, 0, 0, 0.6)';
        ctx.lineWidth = 4;
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(width * 0.05, height * (0.15 + i * 0.1));
            ctx.lineTo(width * 0.95, height * (0.15 + i * 0.1));
            ctx.stroke();
            // Chain links
            for (let j = 0; j < 10; j++) {
                ctx.beginPath();
                ctx.arc(width * (0.1 + j * 0.08), height * (0.15 + i * 0.1), 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(139, 0, 0, 0.8)';
                ctx.fill();
            }
        }

        // Large skull in center
        this.drawSkull(ctx, width / 2, height / 2, height * 0.2);

        // Fun back title
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${height * 0.08}px ${this.fonts.horror}`;
        ctx.textAlign = "center";
        ctx.shadowColor = '#000';
        ctx.shadowBlur = height * 0.01;
        ctx.fillText("CINEMATIC ODYSSEY", width / 2, height * 0.15);
        ctx.shadowBlur = 0;

        // Add back info
        this.drawBackInfo(ctx, width, height, backLines);
    }

    // GAME COVERS
    drawConnectionsCover(ctx, width, height, backLines = null, isBack = false) {
        this.clearCanvas(ctx, width, height, '#2e0a0a');

        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#4e1a1a');
        gradient.addColorStop(0.5, '#8b0000');
        gradient.addColorStop(1, '#2e0a0a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Connection lines pattern
        ctx.strokeStyle = 'rgba(139, 0, 0, 0.6)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(width * 0.2, height * (0.2 + i * 0.1));
            ctx.lineTo(width * 0.8, height * (0.2 + i * 0.1));
            ctx.stroke();
        }

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(width * 0.05, height * 0.85, width * 0.2, height * 0.1);
        ctx.strokeStyle = '#8b0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(width * 0.05, height * 0.85, width * 0.2, height * 0.1);
        ctx.fillStyle = '#ff6b35';
        ctx.font = `bold ${height * 0.05}px "Courier New"`;
        ctx.textAlign = 'center';
        ctx.fillText('R', width * 0.15, height * 0.9);

        // Runtime beside rating
        ctx.fillStyle = '#ccc';
        ctx.font = `${height * 0.04}px "Courier New"`;
        ctx.textAlign = 'right';
        ctx.fillText('Runtime: VARIES', width * 0.95, height * 0.9);
    }

    drawGameCover(ctx, width, height, backLines = null, isBack = false) {
        this.clearCanvas(ctx, width, height, '#1a1a2e');

        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#2a2a4e');
        gradient.addColorStop(0.5, '#4a4a8e');
        gradient.addColorStop(1, '#1a1a2e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Game puzzle pieces pattern
        ctx.strokeStyle = 'rgba(100, 100, 255, 0.4)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                ctx.strokeRect(width * (0.1 + i * 0.15), height * (0.2 + j * 0.12), width * 0.12, height * 0.1);
            }
        }

        // Title
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${height * 0.08}px ${this.fonts.thriller}`;
        ctx.textAlign = 'center';
        ctx.fillText("GAME NIGHT", width / 2, height * 0.15);

        // Rating box
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(width * 0.05, height * 0.85, width * 0.2, height * 0.1);
        ctx.strokeStyle = '#4a4a8e';
        ctx.lineWidth = 2;
        ctx.strokeRect(width * 0.05, height * 0.85, width * 0.2, height * 0.1);
        ctx.fillStyle = '#ff6b35';
        ctx.font = `bold ${height * 0.05}px "Courier New"`;
        ctx.textAlign = 'center';
        ctx.fillText('R', width * 0.15, height * 0.9);

        // Runtime
        ctx.fillStyle = '#ccc';
        ctx.font = `${height * 0.04}px "Courier New"`;
        ctx.textAlign = 'right';
        ctx.fillText('Runtime: VARIES', width * 0.95, height * 0.9);
    }

    drawGameBackCover(ctx, width, height, backLines = null, isBack = false) {
        this.clearCanvas(ctx, width, height, '#0a0a1a');

        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a1a3e');
        gradient.addColorStop(0.5, '#2a2a5e');
        gradient.addColorStop(1, '#0a0a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Puzzle piece decorations
        ctx.fillStyle = 'rgba(100, 100, 255, 0.2)';
        for (let i = 0; i < 8; i++) {
            ctx.fillRect(width * (0.1 + i * 0.1), height * (0.2 + (i % 3) * 0.15), 30, 20);
        }

        // Title
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${height * 0.08}px ${this.fonts.thriller}`;
        ctx.textAlign = 'center';
        ctx.fillText("GAME NIGHT", width / 2, height * 0.15);

        // Add back info
        this.drawBackInfo(ctx, width, height, backLines || ['GAME NIGHT', 'Rating: R', 'Runtime: VARIES', 'Genre: Puzzle']);
    }

    // Render greyed out cover
    renderGreyedOutCover(ctx, width, height, text) {
        // Apply greyscale effect
        ctx.filter = 'grayscale(100%) brightness(0.5)';
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, width, height);
        
        // Add "RENTED OUT" or availability text
        ctx.filter = 'none';
        ctx.fillStyle = '#666';
        ctx.font = `bold ${height * 0.08}px "Courier New"`;
        ctx.textAlign = 'center';
        ctx.fillText(text, width / 2, height / 2);
        
        // VHS label
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(width * 0.15, height * 0.75, width * 0.7, height * 0.15);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.strokeRect(width * 0.15, height * 0.75, width * 0.7, height * 0.15);
    }

    drawEasyCover(ctx, width, height, backLines = null, isBack = false) {
        this.drawSimpleCover(ctx, width, height, '#2e5a2e', 'EASY MODE', backLines);
    }

    drawMediumCover(ctx, width, height, backLines = null, isBack = false) {
        this.drawSimpleCover(ctx, width, height, '#5a5a2e', 'MEDIUM MODE', backLines);
    }

    drawHardCover(ctx, width, height, backLines = null, isBack = false) {
        this.drawSimpleCover(ctx, width, height, '#5a2a2a', 'HARD MODE', backLines);
    }

    drawInsaneCover(ctx, width, height, backLines = null, isBack = false) {
        this.drawSimpleCover(ctx, width, height, '#4a1a4a', 'INSANE MODE', backLines);
    }

    drawWordleCover(ctx, width, height, backLines = null, isBack = false) {
        this.drawSimpleCover(ctx, width, height, '#2e4a5a', 'WORD DETECTIVE', backLines);
    }

    drawStrandsCover(ctx, width, height, backLines = null, isBack = false) {
        this.drawSimpleCover(ctx, width, height, '#4a2e5a', 'WEB OF CLUES', backLines);
    }

    drawSpellingBeeCover(ctx, width, height, backLines = null, isBack = false) {
        this.drawSimpleCover(ctx, width, height, '#5a4a2e', 'HIVE MIND', backLines);
    }

    drawLetterBoxedCover(ctx, width, height, backLines = null, isBack = false) {
        this.drawSimpleCover(ctx, width, height, '#2a2a5a', 'TRAPPED WORDS', backLines);
    }

    drawSimpleCover(ctx, width, height, color, title, backLines) {
        this.clearCanvas(ctx, width, height, color);
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, this.adjustColor(color, 20));
        gradient.addColorStop(1, color);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${height * 0.08}px "Courier New"`;
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, height / 2);
        ctx.fillRect(width * 0.05, height * 0.85, width * 0.2, height * 0.1);
        ctx.fillStyle = '#ff6b35';
        ctx.fillText('R', width * 0.15, height * 0.9);
        ctx.fillStyle = '#ccc';
        ctx.font = `${height * 0.04}px "Courier New"`;
        ctx.textAlign = 'right';
        ctx.fillText('Runtime: VARIES', width * 0.95, height * 0.9);
    }

    adjustColor(color, amount) {
        return color;
    }

    drawCabinStalkingsCover(ctx, width, height, backLines = null, isBack = false) {
        this.drawStoryThemeCover(ctx, width, height, 'CABIN STALKINGS', backLines);
    }

    drawMidnightBroadcastCover(ctx, width, height, backLines = null, isBack = false) {
        this.drawStoryThemeCover(ctx, width, height, 'MIDNIGHT BROADCAST', backLines);
    }

    drawArchiveCover(ctx, width, height, backLines = null, isBack = false) {
        this.drawStoryThemeCover(ctx, width, height, 'THE ARCHIVE', backLines);
    }

    drawStoryThemeCover(ctx, width, height, title, backLines) {
        this.clearCanvas(ctx, width, height, '#1a0a0a');
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#3a1a1a');
        gradient.addColorStop(0.5, '#5a2a2a');
        gradient.addColorStop(1, '#1a0a0a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        this.drawSkull(ctx, width / 2, height * 0.4, height * 0.1);
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${height * 0.08}px ${this.fonts.horror}`;
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, height * 0.15);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(width * 0.05, height * 0.85, width * 0.2, height * 0.1);
        ctx.fillStyle = '#ff6b35';
        ctx.font = `bold ${height * 0.05}px "Courier New"`;
        ctx.fillText('NC-17', width * 0.15, height * 0.9);
        ctx.fillStyle = '#ccc';
        ctx.font = `${height * 0.04}px "Courier New"`;
        ctx.fillText('Runtime: VARIES', width * 0.95, height * 0.9);
    }
}

