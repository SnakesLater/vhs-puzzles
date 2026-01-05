// Large Movie Cover Art Renderer - Full-screen artwork with unique layouts and sprinkles

class VHSTapeRenderer {
    constructor() {
        this.fonts = {
            horror: '"Creepster", cursive',
            thriller: '"VT323", monospace',
            mystery: '"Special Elite", monospace',
            default: '"Courier New", monospace',
            danger: '"Butcherman", cursive',
            success: '"Black Ops One", sans-serif',
            warning: '"Nosifer", cursive',
            purple: '"Butcherman", cursive',
            decorative: '"Butcherman", cursive',
            detective: '"Special Elite", monospace'
        };
    }

    clearCanvas(ctx, width, height, color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
    }

    // STORY MODE - Dark horror with dripping blood and floating particles
    drawStoryCover(ctx, width, height) {
        this.clearCanvas(ctx, width, height, '#0a0505');
        
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a0000');
        gradient.addColorStop(0.5, '#3d0d0d');
        gradient.addColorStop(1, '#0a0505');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Floating dust particles
        ctx.fillStyle = 'rgba(139, 0, 0, 0.3)';
        for(let i = 0; i < 30; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 3 + 1;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Blood drips from top
        ctx.fillStyle = 'rgba(139, 0, 0, 0.7)';
        for(let i = 0; i < 8; i++) {
            const x = width * (0.1 + i * 0.1);
            const dripHeight = 20 + Math.random() * 60;
            ctx.beginPath();
            ctx.moveTo(x - 3, 0);
            ctx.lineTo(x + 3, 0);
            ctx.lineTo(x + 5, dripHeight);
            ctx.lineTo(x, dripHeight + 10);
            ctx.lineTo(x - 5, dripHeight);
            ctx.closePath();
            ctx.fill();
        }
        
        this.drawLargeSkull(ctx, width/2, height * 0.35, width * 0.25);
        
        ctx.font = `${width * 0.12}px "Creepster"`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff2222';
        ctx.shadowColor = '#8b0000';
        ctx.shadowBlur = 20;
        ctx.fillText('STORY MODE', width/2, height * 0.78);
        ctx.shadowBlur = 0;
        
        ctx.font = `${width * 0.05}px "Special Elite"`;
        ctx.fillStyle = '#aa6666';
        ctx.fillText('Full Narrative Horror Experience', width/2, height * 0.88);
        
        this.drawCornerDecorations(ctx, width, height, '#8b0000');
    }

    // GAME MODE - Puzzle pieces with floating elements
    drawGameCover(ctx, width, height) {
        this.clearCanvas(ctx, width, height, '#050510');
        
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(0.5, '#1a1a3d');
        gradient.addColorStop(1, '#050510');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Floating puzzle fragments
        ctx.fillStyle = 'rgba(255, 107, 53, 0.4)';
        for(let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            this.drawSmallPuzzle(ctx, x, y, 15 + Math.random() * 20);
        }
        
        this.drawLargePuzzle(ctx, width/2, height * 0.32, width * 0.3);
        
        ctx.font = `${width * 0.12}px "VT323"`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff6b35';
        ctx.shadowColor = '#ff4500';
        ctx.shadowBlur = 15;
        ctx.fillText('GAME MODE', width/2, height * 0.78);
        ctx.shadowBlur = 0;
        
        ctx.font = `${width * 0.05}px "Courier New"`;
        ctx.fillStyle = '#88aacc';
        ctx.fillText('Quick Puzzles • Solo Play', width/2, height * 0.88);
        
        this.drawCornerDecorations(ctx, width, height, '#ff6b35');
    }

    // EASY - Green checkmarks with stars
    drawEasyCover(ctx, width, height) {
        this.clearCanvas(ctx, width, height, '#051005');
        
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0a1a0a');
        gradient.addColorStop(0.5, '#1a3d1a');
        gradient.addColorStop(1, '#051005');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Floating checkmarks
        ctx.fillStyle = 'rgba(46, 204, 113, 0.3)';
        for(let i = 0; i < 25; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            this.drawSmallCheck(ctx, x, y, 10 + Math.random() * 15);
        }
        
        this.drawLargeCheck(ctx, width/2, height * 0.32, width * 0.25);
        
        // Stars
        ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
        for(let i = 0; i < 10; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height * 0.4;
            this.drawStar(ctx, x, y, 5 + Math.random() * 8);
        }
        
        ctx.font = `${width * 0.12}px "Black Ops One"`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#2ecc71';
        ctx.shadowColor = '#27ae60';
        ctx.shadowBlur = 15;
        ctx.fillText('EASY', width/2, height * 0.78);
        ctx.shadowBlur = 0;
        
        ctx.font = `${width * 0.05}px "Courier New"`;
        ctx.fillStyle = '#88cc88';
        ctx.fillText('3 Rewinds • Gentle Horror', width/2, height * 0.88);
        
        this.drawCornerDecorations(ctx, width, height, '#2ecc71');
    }

    // MEDIUM - Warning triangles with caution stripes
    drawMediumCover(ctx, width, height) {
        this.clearCanvas(ctx, width, height, '#1a1a00');
        
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a1a00');
        gradient.addColorStop(0.5, '#3d3d0a');
        gradient.addColorStop(1, '#1a1a00');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Caution stripes
        ctx.strokeStyle = 'rgba(243, 156, 18, 0.3)';
        ctx.lineWidth = 10;
        for(let i = 0; i < 10; i++) {
            const y = height * 0.1 * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y + 20);
            ctx.stroke();
        }
        
        // Floating warning signs
        ctx.fillStyle = 'rgba(243, 156, 18, 0.4)';
        for(let i = 0; i < 15; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            this.drawSmallWarning(ctx, x, y, 15 + Math.random() * 15);
        }
        
        this.drawLargeWarning(ctx, width/2, height * 0.32, width * 0.25);
        
        ctx.font = `${width * 0.12}px "Nosifer"`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f39c12';
        ctx.shadowColor = '#d68910';
        ctx.shadowBlur = 15;
        ctx.fillText('MEDIUM', width/2, height * 0.78);
        ctx.shadowBlur = 0;
        
        ctx.font = `${width * 0.05}px "Courier New"`;
        ctx.fillStyle = '#ccaa55';
        ctx.fillText('2 Rewinds • Standard Horror', width/2, height * 0.88);
        
        this.drawCornerDecorations(ctx, width, height, '#f39c12');
    }

    // HARD - Red skulls with fire effect
    drawHardCover(ctx, width, height) {
        this.clearCanvas(ctx, width, height, '#1a0000');
        
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#2a0000');
        gradient.addColorStop(0.5, '#4d0d0d');
        gradient.addColorStop(1, '#1a0000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Fire particles
        ctx.fillStyle = 'rgba(255, 100, 0, 0.4)';
        for(let i = 0; i < 40; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height * 0.6;
            const size = Math.random() * 8 + 3;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Floating skulls
        ctx.fillStyle = 'rgba(231, 76, 60, 0.5)';
        for(let i = 0; i < 12; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            this.drawSmallSkull(ctx, x, y, 10 + Math.random() * 15);
        }
        
        this.drawLargeSkull(ctx, width/2, height * 0.32, width * 0.28);
        
        ctx.font = `${width * 0.12}px "Butcherman"`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#e74c3c';
        ctx.shadowColor = '#c0392b';
        ctx.shadowBlur = 20;
        ctx.fillText('HARD', width/2, height * 0.78);
        ctx.shadowBlur = 0;
        
        ctx.font = `${width * 0.05}px "Courier New"`;
        ctx.fillStyle = '#cc6666';
        ctx.fillText('1 Rewind • Nightmare Mode', width/2, height * 0.88);
        
        this.drawCornerDecorations(ctx, width, height, '#e74c3c');
    }

    // INSANE - Purple pentagram with mystical effects
    drawInsaneCover(ctx, width, height) {
        this.clearCanvas(ctx, width, height, '#0a001a');
        
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a0a2a');
        gradient.addColorStop(0.5, '#3d1a4d');
        gradient.addColorStop(1, '#0a001a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Mystical floating runes
        ctx.fillStyle = 'rgba(155, 89, 182, 0.4)';
        for(let i = 0; i < 25; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            this.drawRune(ctx, x, y, 8 + Math.random() * 10);
        }
        
        // Stars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for(let i = 0; i < 15; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height * 0.4;
            this.drawStar(ctx, x, y, 4 + Math.random() * 6);
        }
        
        this.drawLargePentagram(ctx, width/2, height * 0.32, width * 0.22);
        
        ctx.font = `${width * 0.12}px "Butcherman"`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#9b59b6';
        ctx.shadowColor = '#8e44ad';
        ctx.shadowBlur = 20;
        ctx.fillText('INSANE', width/2, height * 0.78);
        ctx.shadowBlur = 0;
        
        ctx.font = `${width * 0.05}px "Courier New"`;
        ctx.fillStyle = '#aa88cc';
        ctx.fillText('No Rewinds • Pure Terror', width/2, height * 0.88);
        
        this.drawCornerDecorations(ctx, width, height, '#9b59b6');
    }

    // CONNECTIONS - Magnifying glass with evidence theme
    drawConnectionsCover(ctx, width, height) {
        this.clearCanvas(ctx, width, height, '#05101a');
        
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0a1525');
        gradient.addColorStop(0.5, '#1a3050');
        gradient.addColorStop(1, '#05101a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Floating evidence markers
        ctx.fillStyle = 'rgba(52, 152, 219, 0.4)';
        for(let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.beginPath();
            ctx.arc(x, y, 3 + Math.random() * 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Dotted lines like evidence board
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        for(let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * width, Math.random() * height);
            ctx.lineTo(Math.random() * width, Math.random() * height);
            ctx.stroke();
        }
        ctx.setLineDash([]);
        
        this.drawLargeMagnify(ctx, width/2, height * 0.32, width * 0.22);
        
        ctx.font = `${width * 0.12}px "Special Elite"`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#3498db';
        ctx.shadowColor = '#2980b9';
        ctx.shadowBlur = 15;
        ctx.fillText('CONNECTIONS', width/2, height * 0.78);
        ctx.shadowBlur = 0;
        
        ctx.font = `${width * 0.05}px "Special Elite"`;
        ctx.fillStyle = '#88aacc';
        ctx.fillText('Evidence Analysis • Find the Links', width/2, height * 0.88);
        
        this.drawCornerDecorations(ctx, width, height, '#3498db');
    }

    // WORDLE - Green letter with word theme
    drawWordleCover(ctx, width, height) {
        this.clearCanvas(ctx, width, height, '#051005');
        
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0a1a0a');
        gradient.addColorStop(0.5, '#1a3d1a');
        gradient.addColorStop(1, '#051005');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Floating letters
        ctx.fillStyle = 'rgba(46, 204, 113, 0.3)';
        for(let i = 0; i < 30; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            ctx.font = `${10 + Math.random() * 15}px "Courier New"`;
            ctx.fillText(letter, x, y);
        }
        
        // Grid squares
        ctx.fillStyle = 'rgba(46, 204, 113, 0.2)';
        for(let row = 0; row < 6; row++) {
            for(let col = 0; col < 5; col++) {
                ctx.strokeStyle = '#2ecc71';
                ctx.lineWidth = 2;
                ctx.strokeRect(width * 0.35 + col * 35, height * 0.15 + row * 35, 30, 30);
            }
        }
        
        this.drawLargeLetter(ctx, width/2, height * 0.35, width * 0.2, 'W');
        
        ctx.font = `${width * 0.12}px "Black Ops One"`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#2ecc71';
        ctx.shadowColor = '#27ae60';
        ctx.shadowBlur = 15;
        ctx.fillText('WORDLE', width/2, height * 0.78);
        ctx.shadowBlur = 0;
        
        ctx.font = `${width * 0.05}px "Courier New"`;
        ctx.fillStyle = '#88cc88';
        ctx.fillText('COMING SOON', width/2, height * 0.88);
        
        this.drawCornerDecorations(ctx, width, height, '#2ecc71');
    }

    // STRANDS - Spider web with strands
    drawStrandsCover(ctx, width, height) {
        this.clearCanvas(ctx, width, height, '#0a0a0a');
        
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1a1a1a');
        gradient.addColorStop(0.5, '#2a2a2a');
        gradient.addColorStop(1, '#0a0a0a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Spider web background
        ctx.strokeStyle = 'rgba(149, 165, 166, 0.3)';
        ctx.lineWidth = 1;
        for(let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(width/2, height/2);
            ctx.lineTo(width/2 + Math.cos(angle) * width * 0.5, height/2 + Math.sin(angle) * height * 0.5);
            ctx.stroke();
        }
        for(let r = 1; r <= 5; r++) {
            ctx.beginPath();
            ctx.arc(width/2, height/2, r * 30, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Floating threads
        ctx.strokeStyle = 'rgba(149, 165, 166, 0.4)';
        for(let i = 0; i < 15; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * width, Math.random() * height);
            ctx.bezierCurveTo(
                Math.random() * width, Math.random() * height,
                Math.random() * width, Math.random() * height,
                Math.random() * width, Math.random() * height
            );
            ctx.stroke();
        }
        
        this.drawLargeWeb(ctx, width/2, height * 0.32, width * 0.2);
        
        ctx.font = `${width * 0.12}px "VT323"`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#95a5a6';
        ctx.shadowColor = '#7f8c8d';
        ctx.shadowBlur = 15;
        ctx.fillText('STRANDS', width/2, height * 0.78);
        ctx.shadowBlur = 0;
        
        ctx.font = `${width * 0.05}px "Courier New"`;
        ctx.fillStyle = '#aaabac';
        ctx.fillText('COMING SOON', width/2, height * 0.88);
        
        this.drawCornerDecorations(ctx, width, height, '#95a5a6');
    }

    // SPELLING BEE - Yellow bee with honeycomb
    drawSpellingBeeCover(ctx, width, height) {
        this.clearCanvas(ctx, width, height, '#1a1a00');
        
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#2a2a00');
        gradient.addColorStop(0.5, '#4d4d0a');
        gradient.addColorStop(1, '#1a1a00');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Honeycomb pattern
        ctx.fillStyle = 'rgba(241, 196, 15, 0.2)';
        for(let row = 0; row < 8; row++) {
            for(let col = 0; col < 6; col++) {
                const x = 20 + col * 40 + (row % 2) * 20;
                const y = 20 + row * 35;
                this.drawHexagon(ctx, x, y, 18);
            }
        }
        
        // Floating bees
        ctx.fillStyle = 'rgba(241, 196, 15, 0.5)';
        for(let i = 0; i < 12; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            this.drawSmallBee(ctx, x, y, 8 + Math.random() * 12);
        }
        
        this.drawLargeBee(ctx, width/2, height * 0.32, width * 0.18);
        
        ctx.font = `${width * 0.12}px "Nosifer"`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f1c40f';
        ctx.shadowColor = '#d4ac0d';
        ctx.shadowBlur = 15;
        ctx.fillText('SPELLING BEE', width/2, height * 0.78);
        ctx.shadowBlur = 0;
        
        ctx.font = `${width * 0.05}px "Courier New"`;
        ctx.fillStyle = '#ccaa55';
        ctx.fillText('COMING SOON', width/2, height * 0.88);
        
        this.drawCornerDecorations(ctx, width, height, '#f1c40f');
    }

    // LETTER BOXED - Red box with X
    drawLetterBoxedCover(ctx, width, height) {
        this.clearCanvas(ctx, width, height, '#1a0505');
        
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#2a0a0a');
        gradient.addColorStop(0.5, '#4d1515');
        gradient.addColorStop(1, '#1a0505');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Cracked glass effect
        ctx.strokeStyle = 'rgba(192, 57, 43, 0.3)';
        ctx.lineWidth = 2;
        for(let i = 0; i < 10; i++) {
            const startX = Math.random() * width;
            const startY = Math.random() * height;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + (Math.random() - 0.5) * 100, startY + (Math.random() - 0.5) * 100);
            ctx.lineTo(startX + (Math.random() - 0.5) * 150, startY + (Math.random() - 0.5) * 150);
            ctx.stroke();
        }
        
        // Trapped letters
        ctx.fillStyle = 'rgba(192, 57, 43, 0.4)';
        for(let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.font = `${12 + Math.random() * 15}px "Courier New"`;
            ctx.fillText(['A','B','C','D','E','F'][Math.floor(Math.random() * 6)], x, y);
        }
        
        this.drawLargeBox(ctx, width/2, height * 0.32, width * 0.22);
        
        ctx.font = `${width * 0.12}px "Butcherman"`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#c0392b';
        ctx.shadowColor = '#922b21';
        ctx.shadowBlur = 15;
        ctx.fillText('LETTER BOXED', width/2, height * 0.78);
        ctx.shadowBlur = 0;
        
        ctx.font = `${width * 0.05}px "Courier New"`;
        ctx.fillStyle = '#aa6666';
        ctx.fillText('COMING SOON', width/2, height * 0.88);
        
        this.drawCornerDecorations(ctx, width, height, '#c0392b');
    }

    // Helper drawing functions
    drawLargeSkull(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = '#8b0000';
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.6, size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath();
        ctx.ellipse(-size * 0.2, -size * 0.1, size * 0.15, size * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(size * 0.2, -size * 0.1, size * 0.15, size * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, size * 0.1);
        ctx.lineTo(-size * 0.1, size * 0.3);
        ctx.lineTo(size * 0.1, size * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#0a0a0a';
        for(let i = 0; i < 4; i++) {
            ctx.fillRect(-size * 0.25 + i * size * 0.13, size * 0.5, size * 0.1, size * 0.15);
        }
        ctx.restore();
    }

    drawSmallSkull(ctx, x, y, size) {
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.5, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath();
        ctx.arc(x - size * 0.15, y - size * 0.1, size * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + size * 0.15, y - size * 0.1, size * 0.12, 0, Math.PI * 2);
        ctx.fill();
    }

    drawLargePuzzle(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = '#ff6b35';
        ctx.beginPath();
        const s = size * 0.7;
        ctx.moveTo(-s, -s);
        ctx.lineTo(s * 0.3, -s);
        ctx.bezierCurveTo(s * 0.5, -s * 0.7, s * 0.5, -s * 0.3, s * 0.7, -s * 0.3);
        ctx.lineTo(s, -s * 0.3);
        ctx.lineTo(s, s * 0.3);
        ctx.bezierCurveTo(s * 0.7, s * 0.3, s * 0.5, s * 0.5, s * 0.3, s);
        ctx.lineTo(-s * 0.3, s);
        ctx.bezierCurveTo(-s * 0.5, s * 0.7, -s * 0.5, s * 0.3, -s * 0.7, s * 0.3);
        ctx.lineTo(-s, s * 0.3);
        ctx.lineTo(-s, -s * 0.3);
        ctx.bezierCurveTo(-s * 0.7, -s * 0.3, -s * 0.5, -s * 0.5, -s * 0.3, -s);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    drawSmallPuzzle(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x - size/2, y - size/2);
        ctx.lineTo(x + size * 0.15, y - size/2);
        ctx.bezierCurveTo(x + size * 0.25, y - size * 0.35, x + size * 0.25, y - size * 0.15, x + size * 0.35, y - size * 0.15);
        ctx.lineTo(x + size/2, y - size * 0.15);
        ctx.lineTo(x + size/2, y + size * 0.15);
        ctx.bezierCurveTo(x + size * 0.35, y + 0.15, x + size * 0.25, y + 0.25, x + size * 0.15, y + size/2);
        ctx.lineTo(x - size * 0.15, y + size/2);
        ctx.bezierCurveTo(x - size * 0.25, y + size * 0.35, x - size * 0.25, y + size * 0.15, x - size * 0.35, y + size * 0.15);
        ctx.lineTo(x - size/2, y + size * 0.15);
        ctx.lineTo(x - size/2, y - size * 0.15);
        ctx.bezierCurveTo(x - size * 0.35, y - size * 0.15, x - size * 0.25, y - size * 0.35, x - size * 0.15, y - size/2);
        ctx.closePath();
        ctx.fill();
    }

    drawLargeCheck(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = size * 0.12;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(-size * 0.5, 0);
        ctx.lineTo(-size * 0.1, size * 0.4);
        ctx.lineTo(size * 0.6, -size * 0.4);
        ctx.stroke();
        ctx.restore();
    }

    drawSmallCheck(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x - size/2, y);
        ctx.lineTo(x - size * 0.1, y + size * 0.3);
        ctx.lineTo(x + size * 0.4, y - size * 0.3);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#2ecc71';
        ctx.stroke();
    }

    drawLargeWarning(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.8, size * 0.6);
        ctx.lineTo(-size * 0.8, size * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#1a1a00';
        ctx.font = `bold ${size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', 0, size * 0.1);
        ctx.restore();
    }

    drawSmallWarning(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size * 0.7, y + size * 0.5);
        ctx.lineTo(x - size * 0.7, y + size * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#1a1a00';
        ctx.font = `bold ${size * 0.8}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('!', x, y + size * 0.05);
    }

    drawLargePentagram(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#9b59b6';
        ctx.lineWidth = 4;
        const points = [];
        for(let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
            points.push({ x: Math.cos(angle) * size, y: Math.sin(angle) * size });
        }
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for(let i = 1; i < 5; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    drawLargeMagnify(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = size * 0.1;
        ctx.beginPath();
        ctx.arc(-size * 0.1, -size * 0.1, size * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(size * 0.3, size * 0.3);
        ctx.lineTo(size * 0.7, size * 0.7);
        ctx.lineWidth = size * 0.12;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
    }

    drawLargeLetter(ctx, x, y, size, letter) {
        ctx.save();
        ctx.translate(x, y);
        ctx.font = `bold ${size}px "Courier New"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#2ecc71';
        ctx.fillText(letter, 0, 0);
        ctx.restore();
    }

    drawLargeWeb(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#95a5a6';
        ctx.lineWidth = 2;
        for(let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    drawLargeBee(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.6, size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        for(let i = -1; i <= 1; i++) {
            ctx.fillRect(i * size * 0.25, -size * 0.35, size * 0.1, size * 0.7);
        }
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.ellipse(-size * 0.5, -size * 0.3, size * 0.3, size * 0.2, -0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(size * 0.5, -size * 0.3, size * 0.3, size * 0.2, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawSmallBee(ctx, x, y, size) {
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.5, size * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(x - size * 0.15, y - size * 0.3, size * 0.08, size * 0.6);
    }

    drawHexagon(ctx, x, y, size) {
        ctx.beginPath();
        for(let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
        }
        ctx.closePath();
        ctx.fill();
    }

    drawLargeBox(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.rect(-size * 0.5, -size * 0.5, size, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-size * 0.5, -size * 0.5);
        ctx.lineTo(size * 0.5, size * 0.5);
        ctx.moveTo(size * 0.5, -size * 0.5);
        ctx.lineTo(-size * 0.5, size * 0.5);
        ctx.stroke();
        ctx.restore();
    }

    drawRune(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size * 0.5, y + size * 0.5);
        ctx.lineTo(x - size * 0.5, y + size * 0.5);
        ctx.closePath();
        ctx.fill();
    }

    drawStar(ctx, x, y, size) {
        ctx.beginPath();
        for(let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
            const px = x + Math.cos(angle) * size;
            const py = y + Math.sin(angle) * size;
            if(i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
    }

    drawCornerDecorations(ctx, width, height, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.lineTo(20, 20);
        ctx.lineTo(20, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width, 20);
        ctx.lineTo(width - 20, 20);
        ctx.lineTo(width - 20, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, height - 20);
        ctx.lineTo(20, height - 20);
        ctx.lineTo(20, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width, height - 20);
        ctx.lineTo(width - 20, height - 20);
        ctx.lineTo(width - 20, height);
        ctx.stroke();
    }

    drawCoverBack(ctx, width, height, lines, theme) {
        this.clearCanvas(ctx, width, height, '#0a0a0a');
        const themeColors = {
            story: '#8b0000', game: '#ff6b35', easy: '#27ae60',
            medium: '#d68910', hard: '#c0392b', insane: '#8e44ad',
            connections: '#2980b9', wordle: '#27ae60', strands: '#7f8c8d',
            'spelling-bee': '#d4ac0d', 'letter-boxed': '#922b21'
        };
        const borderColor = themeColors[theme] || '#8b0000';
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(15, 15, width - 30, height - 30);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(18, 18, width - 36, height - 36);
        ctx.font = `${Math.min(width, height) * 0.045}px "Courier New"`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ccc';
        lines.forEach((line, i) => {
            ctx.fillText(line, width / 2, height * 0.3 + (i * height * 0.1));
        });
    }

    drawCounterTape(ctx, width, height, isActive) {
        this.clearCanvas(ctx, width, height, isActive ? '#1a1a1a' : '#0a0a0a');
        ctx.strokeStyle = isActive ? '#ff6b35' : '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, width - 2, height - 2);
        ctx.fillStyle = isActive ? '#ff6b35' : '#333';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    initialize() {
        this.renderMenuButtons();
        this.renderCounterTapes();
    }

    renderMenuButtons() {
        document.querySelectorAll('.mode-btn.tape-btn').forEach((btn, index) => {
            const frontCanvas = btn.querySelector('.tape-canvas.front');
            const backCanvas = btn.querySelector('.tape-canvas.back');
            if (frontCanvas && backCanvas) {
                const frontCtx = frontCanvas.getContext('2d');
                const backCtx = backCanvas.getContext('2d');
                const isStory = index === 0;
                if (isStory) this.drawStoryCover(frontCtx, frontCanvas.width, frontCanvas.height);
                else this.drawGameCover(frontCtx, frontCanvas.width, frontCanvas.height);
                this.drawCoverBack(backCtx, backCanvas.width, backCanvas.height,
                    isStory ? ['Rating: NC-17', 'Runtime: 94 MIN', 'Genre: Horror'] : ['Rating: R', 'Runtime: VARIES', 'Genre: Puzzle'],
                    isStory ? 'story' : 'game');
            }
        });
        
        document.querySelectorAll('.difficulty-btn').forEach((btn) => {
            const frontCanvas = btn.querySelector('.tape-canvas.front');
            const backCanvas = btn.querySelector('.tape-canvas.back');
            if (frontCanvas && backCanvas) {
                const difficulty = btn.dataset.difficulty;
                const frontCtx = frontCanvas.getContext('2d');
                const backCtx = backCanvas.getContext('2d');
                switch(difficulty) {
                    case 'easy': this.drawEasyCover(frontCtx, frontCanvas.width, frontCanvas.height); break;
                    case 'medium': this.drawMediumCover(frontCtx, frontCanvas.width, frontCanvas.height); break;
                    case 'hard': this.drawHardCover(frontCtx, frontCanvas.width, frontCanvas.height); break;
                    case 'insane': this.drawInsaneCover(frontCtx, frontCanvas.width, frontCanvas.height); break;
                }
                this.drawCoverBack(backCtx, backCanvas.width, backCanvas.height,
                    ['Difficulty Setting', 'Horror Level', difficulty.toUpperCase()], difficulty);
            }
        });
        
        document.querySelectorAll('.game-btn').forEach((btn) => {
            const frontCanvas = btn.querySelector('.tape-canvas.front');
            const backCanvas = btn.querySelector('.tape-canvas.back');
            if (frontCanvas && backCanvas) {
                const game = btn.dataset.game;
                const frontCtx = frontCanvas.getContext('2d');
                const backCtx = backCanvas.getContext('2d');
                switch(game) {
                    case 'connections': this.drawConnectionsCover(frontCtx, frontCanvas.width, frontCanvas.height); break;
                    case 'wordle': this.drawWordleCover(frontCtx, frontCanvas.width, frontCanvas.height); break;
                    case 'strands': this.drawStrandsCover(frontCtx, frontCanvas.width, frontCanvas.height); break;
                    case 'spelling-bee': this.drawSpellingBeeCover(frontCtx, frontCanvas.width, frontCanvas.height); break;
                    case 'letter-boxed': this.drawLetterBoxedCover(frontCtx, frontCanvas.width, frontCanvas.height); break;
                }
                this.drawCoverBack(backCtx, backCanvas.width, backCanvas.height,
                    btn.disabled ? ['COMING SOON', 'Stay Tuned', 'Coming Soon'] : ['Puzzle Game', 'Single Player', 'Horror Theme'],
                    game);
            }
        });
    }

    renderCounterTapes() {
        const tapes = document.querySelectorAll('.vhs-counter-canvas');
        tapes.forEach((canvas, index) => {
            const ctx = canvas.getContext('2d');
            const isActive = index < tapeQualitySystem.rewinds;
            this.drawCounterTape(ctx, canvas.width, canvas.height, isActive);
        });
    }

    updateCounterDisplay() {
        this.renderCounterTapes();
    }

    drawStoryText(ctx, width, height) {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.5, '#0f0f0f');
        gradient.addColorStop(1, '#0a0a0a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        for(let i = 0; i < 1000; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const gray = Math.random() * 25;
            ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, 0.25)`;
            ctx.fillRect(x, y, 2, 2);
        }
        
        // Border
        ctx.shadowColor = '#8b0000';
        ctx.shadowBlur = 6;
        ctx.strokeStyle = '#8b0000';
        ctx.lineWidth = 3;
        ctx.strokeRect(4, 4, width - 8, height - 8);
        ctx.shadowBlur = 0;
        
        // Layout - maximized for readability, grainy terminal look
        const padding = height * 0.03;
        const labelWidth = width * 0.26;
        const lineHeight = height * 0.12;
        const fontSize = height * 0.075;
        
        // "Case File:" label on left - Special Elite for grainy terminal look
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ff9966';
        ctx.font = `bold ${fontSize}px "Special Elite"`;
        ctx.fillText('Case File:', padding, padding + fontSize + lineHeight * 0.5);
        
        // Indented story text
        ctx.textAlign = 'left';
        ctx.fillStyle = '#eeeeee';
        ctx.font = `${fontSize}px "Special Elite"`;
        
        const storyLines = [
            'The evidence bags are scattered across my desk.',
            'Three victims. Three cabins.',
            'Each one a piece of the puzzle waiting to connect.'
        ];
        
        storyLines.forEach((line, i) => {
            ctx.fillText(line, padding + labelWidth, padding + fontSize + lineHeight * 0.5 + (i * lineHeight));
        });
        
        // Quote
        const quoteStartY = padding + fontSize + lineHeight * 0.5 + (storyLines.length * lineHeight) + lineHeight * 0.3;
        ctx.fillStyle = '#ffbb99';
        ctx.font = `italic ${fontSize}px "Special Elite"`;
        ctx.fillText('"Let\'s see what secrets', padding + labelWidth, quoteStartY);
        ctx.fillText('this puzzle hides."', padding + labelWidth, quoteStartY + lineHeight);
        
        // Attribution
        ctx.fillStyle = '#999';
        ctx.font = `${fontSize * 0.8}px "Special Elite"`;
        ctx.fillText('- Det. Mills', padding + labelWidth, quoteStartY + lineHeight * 2);
        
        // Subtle scanlines
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for(let i = 0; i < height; i += 3) {
            ctx.fillRect(0, i, width, 1);
        }
        
        // Random bright pixels for terminal effect
        for(let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }

    renderStoryText() {
        const canvas = document.getElementById('story-text-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            this.drawStoryText(ctx, canvas.width, canvas.height);
        }
    }
}

const vhsTapeRenderer = new VHSTapeRenderer();

document.addEventListener('DOMContentLoaded', () => {
    vhsTapeRenderer.initialize();
    vhsTapeRenderer.renderStoryText();
    tapeQualitySystem.onRewindUse(() => {
        vhsTapeRenderer.updateCounterDisplay();
    });
});
