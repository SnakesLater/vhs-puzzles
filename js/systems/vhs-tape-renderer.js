// VHS Tape Renderer - Orchestrates specialized rendering modules
class VHSTapeRenderer {
    constructor() {
        // Initialize specialized renderers
        this.coverRenderer = new TapeCoverRenderer();
        this.counterRenderer = new CounterRenderer();
        this.storyRenderer = new StoryTextRenderer();

        // Animation frame for counter reels
        this.animationFrame = null;
        this.startReelAnimation();
    }

    // Delegated cover drawing methods
    drawStoryCover(ctx, width, height) {
        this.coverRenderer.drawStoryCover(ctx, width, height);
    }

    drawGameCover(ctx, width, height) {
        this.coverRenderer.drawGameCover(ctx, width, height);
    }

    drawEasyCover(ctx, width, height) {
        this.coverRenderer.drawEasyCover(ctx, width, height);
    }

    drawMediumCover(ctx, width, height) {
        this.coverRenderer.drawMediumCover(ctx, width, height);
    }

    drawHardCover(ctx, width, height) {
        this.coverRenderer.drawHardCover(ctx, width, height);
    }

    drawInsaneCover(ctx, width, height) {
        this.coverRenderer.drawInsaneCover(ctx, width, height);
    }

    drawConnectionsCover(ctx, width, height) {
        this.coverRenderer.drawConnectionsCover(ctx, width, height);
    }

    drawWordleCover(ctx, width, height) {
        this.coverRenderer.drawWordleCover(ctx, width, height);
    }

    drawStrandsCover(ctx, width, height) {
        this.coverRenderer.drawStrandsCover(ctx, width, height);
    }

    drawSpellingBeeCover(ctx, width, height) {
        this.coverRenderer.drawSpellingBeeCover(ctx, width, height);
    }

    drawLetterBoxedCover(ctx, width, height) {
        this.coverRenderer.drawLetterBoxedCover(ctx, width, height);
    }

    // Draw back of cover (utility method kept here)
    drawCoverBack(ctx, width, height, lines, theme) {
        // Mirror the back cover to simulate tape flipping
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-width, 0);

        this.coverRenderer.clearCanvas(ctx, width, height, '#0a0a0a');

        // Dark gradient background
        const backGradient = ctx.createLinearGradient(0, 0, width, height);
        backGradient.addColorStop(0, '#1a1a1a');
        backGradient.addColorStop(0.5, '#0a0a0a');
        backGradient.addColorStop(1, '#000000');
        ctx.fillStyle = backGradient;
        ctx.fillRect(0, 0, width, height);

        // VHS tape reel patterns
        ctx.strokeStyle = 'rgba(139, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        for(let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(width * 0.2, height * (0.2 + i * 0.15), 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(width * 0.8, height * (0.2 + i * 0.15), 20, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Corner decorations
        ctx.fillStyle = 'rgba(139, 0, 0, 0.5)';
        ctx.fillRect(0, 0, 30, 30);
        ctx.fillRect(width - 30, 0, 30, 30);
        ctx.fillRect(0, height - 30, 30, 30);
        ctx.fillRect(width - 30, height - 30, 30, 30);

        // Back panel style - VHS tape back cover layout
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(8, 8, width - 16, height - 16);

        // Border
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 10, width - 20, height - 20);

        // Title section
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.min(width, height) * 0.06}px "Courier New"`;
        ctx.textAlign = 'center';
        ctx.fillText(lines[0] || 'TITLE', width / 2, height * 0.15);

        // Rating and runtime
        ctx.fillStyle = '#ff6b35';
        ctx.font = `${Math.min(width, height) * 0.04}px "Courier New"`;
        ctx.fillText(lines[1] || 'RATING: R', width / 2, height * 0.25);
        ctx.fillText(lines[2] || 'RUNTIME: VARIES', width / 2, height * 0.32);

        // Genre
        ctx.fillStyle = '#ccc';
        ctx.fillText(lines[3] || 'GENRE: PUZZLE', width / 2, height * 0.4);

        // Achievements/Badges
        if (lines[4]) {
            ctx.fillStyle = '#ffa';
            ctx.font = `${Math.min(width, height) * 0.035}px "Courier New"`;
            ctx.fillText(lines[4], width / 2, height * 0.5);
        }
        if (lines[5]) {
            ctx.fillStyle = '#ffa';
            ctx.fillText(lines[5], width / 2, height * 0.55);
        }

        // VHS tape warnings
        ctx.fillStyle = '#666';
        ctx.font = `${Math.min(width, height) * 0.025}px "Courier New"`;
        ctx.fillText('THIS TAPE CONTAINS HORROR ELEMENTS', width / 2, height * 0.8);
        ctx.fillText('NOT RECOMMENDED FOR CHILDREN UNDER 13', width / 2, height * 0.85);

        ctx.restore();
    }

    // Animation methods
    startReelAnimation() {
        let angle = 0;
        const animate = () => {
            angle += 0.05;
            // Keep counter visuals updated each frame so the "reel" animation is visible
            if (this.counterRenderer && typeof this.counterRenderer.renderCounterTapes === 'function') {
                try {
                    this.counterRenderer.renderCounterTapes();
                } catch (e) {
                    console.error('Error rendering counter tapes:', e);
                }
            }
            this.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    }

    renderMenuButtons() {
        document.querySelectorAll('.mode-btn.tape-btn').forEach((btn, index) => {
            const frontCanvas = btn.querySelector('.tape-canvas.front');
            const backCanvas = btn.querySelector('.tape-canvas.back');
            if (frontCanvas && backCanvas) {
                const frontCtx = frontCanvas.getContext('2d');
                const backCtx = backCanvas.getContext('2d');
                const isStory = index === 0;
                const backLines = isStory ? ['VHS HORROR PUZZLE COLLECTION', 'Rating: NC-17', 'Runtime: 94 MIN', 'Genre: Horror', 'Solve puzzles to survive', 'the nightmarish campaign'] : ['GAME NIGHT', 'Rating: R', 'Runtime: VARIES', 'Genre: Puzzle', 'Challenge your mind', 'with individual puzzles'];
                if (isStory) {
                    this.coverRenderer.drawStoryCover(frontCtx, frontCanvas.width, frontCanvas.height, backLines);
                    this.coverRenderer.drawStoryBackCover(backCtx, backCanvas.width, backCanvas.height, backLines, true);
                } else {
                    this.coverRenderer.drawGameCover(frontCtx, frontCanvas.width, frontCanvas.height, backLines);
                    this.coverRenderer.drawGameBackCover(backCtx, backCanvas.width, backCanvas.height, backLines, true);
                }
                // Attach flip listeners for all tape buttons (was previously restricted to a single index)
                if (!btn.hasAttribute('data-flip-listeners')) {
                    let flipTimeout;
                    frontCanvas.addEventListener('mouseenter', () => {
                        clearTimeout(flipTimeout);
                        btn.classList.add('flipped');
                    });
                    frontCanvas.addEventListener('mouseleave', () => {
                        flipTimeout = setTimeout(() => btn.classList.remove('flipped'), 1000);
                    });
                    btn.setAttribute('data-flip-listeners', 'true');
                }
            }
        });

        document.querySelectorAll('.difficulty-btn').forEach((btn) => {
            const frontCanvas = btn.querySelector('.tape-canvas.front');
            const backCanvas = btn.querySelector('.tape-canvas.back');
            if (frontCanvas && backCanvas) {
                const difficulty = btn.dataset.difficulty;
                const frontCtx = frontCanvas.getContext('2d');
                const backCtx = backCanvas.getContext('2d');
                const backLines = ['DIFFICULTY: ' + difficulty.toUpperCase(), 'Rating: R', 'Runtime: VARIES', 'Genre: Puzzle', 'Horror Level: ' + difficulty.toUpperCase(), 'Test your limits'];
                switch(difficulty) {
                    case 'easy':
                        this.coverRenderer.drawEasyCover(frontCtx, frontCanvas.width, frontCanvas.height, backLines);
                        this.coverRenderer.drawEasyCover(backCtx, backCanvas.width, backCanvas.height, backLines);
                        break;
                    case 'medium':
                        this.coverRenderer.drawMediumCover(frontCtx, frontCanvas.width, frontCanvas.height, backLines);
                        this.coverRenderer.drawMediumCover(backCtx, backCanvas.width, backCanvas.height, backLines);
                        break;
                    case 'hard':
                        this.coverRenderer.drawHardCover(frontCtx, frontCanvas.width, frontCanvas.height, backLines);
                        this.coverRenderer.drawHardCover(backCtx, backCanvas.width, backCanvas.height, backLines);
                        break;
                    case 'insane':
                        if (typeof window.progress !== 'undefined' && window.progress.insaneUnlocked) {
                            this.coverRenderer.drawInsaneCover(frontCtx, frontCanvas.width, frontCanvas.height, backLines);
                            this.coverRenderer.drawInsaneCover(backCtx, backCanvas.width, backCanvas.height, backLines);
                        } else {
                            this.renderGreyedOutCover(frontCtx, frontCanvas.width, frontCanvas.height, 'LOCKED');
                            this.renderGreyedOutCover(backCtx, backCanvas.width, backCanvas.height, 'LOCKED');
                        }
                        break;
                }
            }
        });

        document.querySelectorAll('.story-card').forEach((btn) => {
            const frontCanvas = btn.querySelector('.tape-canvas.front');
            const backCanvas = btn.querySelector('.tape-canvas.back');
            if (frontCanvas && backCanvas) {
                const story = btn.dataset.story;
                const frontCtx = frontCanvas.getContext('2d');
                const backCtx = backCanvas.getContext('2d');
                const storyData = puzzleLoader.getStory(story) || { title: "STORY", premise: "A chilling tale" };
                const isCompleted = window.progress && window.progress.storiesCompleted && window.progress.storiesCompleted.includes(story);
                const achievement = isCompleted ? 'Achievement: Story Completed' : 'Achievement: Not Completed';
                const badge = isCompleted ? 'Badge: Horror Survivor' : 'Badge: Locked';
                const backLines = [storyData ? storyData.title.toUpperCase() : 'STORY', 'Rating: NC-17', 'Runtime: VARIES', 'Genre: Horror', achievement, badge];
                switch(story) {
                    case 'cabin_stalkings':
                        this.coverRenderer.drawCabinStalkingsCover(frontCtx, frontCanvas.width, frontCanvas.height, backLines);
                        this.coverRenderer.drawCabinStalkingsCover(backCtx, backCanvas.width, backCanvas.height, backLines, true);
                        break;
                    case 'midnight_broadcast':
                        this.coverRenderer.drawMidnightBroadcastCover(frontCtx, frontCanvas.width, frontCanvas.height, backLines);
                        this.coverRenderer.drawMidnightBroadcastCover(backCtx, backCanvas.width, backCanvas.height, backLines, true);
                        break;
                    case 'the_archive':
                        this.coverRenderer.drawArchiveCover(frontCtx, frontCanvas.width, frontCanvas.height, backLines);
                        this.coverRenderer.drawArchiveCover(backCtx, backCanvas.width, backCanvas.height, backLines, true);
                        break;
                }
            }
        });

        document.querySelectorAll('.game-btn').forEach((btn) => {
            const frontCanvas = btn.querySelector('.tape-canvas.front');
            const backCanvas = btn.querySelector('.tape-canvas.back');
            if (frontCanvas && backCanvas) {
                const game = btn.dataset.game;
                const frontCtx = frontCanvas.getContext('2d');
                const backCtx = backCanvas.getContext('2d');
                const backLines = game === 'connections' ? ['CONNECTIONS PUZZLE', 'Players: 1', 'Skill: Analytical', 'Rating: R', 'Genre: Puzzle', 'Link the clues together'] :
                    game === 'wordle' ? ['WORD DETECTIVE', 'COMING SOON', 'Rating: R', 'Genre: Puzzle', 'Solve the mystery word', 'in limited attempts'] :
                    game === 'strands' ? ['WEB OF CLUES', 'COMING SOON', 'Rating: R', 'Genre: Puzzle', 'Unravel the tangled web', 'of hidden connections'] :
                    game === 'spelling-bee' ? ['HIVE MIND', 'COMING SOON', 'Rating: R', 'Genre: Puzzle', 'Buzz through letters', 'to build perfect words'] :
                    ['TRAPPED WORDS', 'COMING SOON', 'Rating: R', 'Genre: Puzzle', 'Break free from the letter', 'prison with clever words'];
                switch(game) {
                    case 'connections':
                        this.coverRenderer.drawConnectionsCover(frontCtx, frontCanvas.width, frontCanvas.height, backLines);
                        this.coverRenderer.drawConnectionsCover(backCtx, backCanvas.width, backCanvas.height, backLines, true);
                        break;
                    case 'wordle':
                        this.renderGreyedOutCover(frontCtx, frontCanvas.width, frontCanvas.height, 'COMING SOON');
                        this.renderGreyedOutCover(backCtx, backCanvas.width, backCanvas.height, 'COMING SOON');
                        break;
                    case 'strands':
                        this.renderGreyedOutCover(frontCtx, frontCanvas.width, frontCanvas.height, 'COMING SOON');
                        this.renderGreyedOutCover(backCtx, backCanvas.width, backCanvas.height, 'COMING SOON');
                        break;
                    case 'spelling-bee':
                        this.renderGreyedOutCover(frontCtx, frontCanvas.width, frontCanvas.height, 'COMING SOON');
                        this.renderGreyedOutCover(backCtx, backCanvas.width, backCanvas.height, 'COMING SOON');
                        break;
                    case 'letter-boxed':
                        this.renderGreyedOutCover(frontCtx, frontCanvas.width, frontCanvas.height, 'COMING SOON');
                        this.renderGreyedOutCover(backCtx, backCanvas.width, backCanvas.height, 'COMING SOON');
                        break;
                }
            }
        });
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

    // Initialize
    initialize() {
        this.renderMenuButtons();
        this.counterRenderer.renderCounterTapes();
    }

    // Update counter display
    updateCounterDisplay() {
        this.counterRenderer.updateCounterDisplay();
    }
}

