// Mobile Tape Carousel Controller
// Parallel, mobile-only entry point. Reuses the SAME canvas cover renderers
// as desktop so the art is identical. Activated only when matchMedia matches
// (narrow / coarse-pointer). Desktop DOM + logic are never touched.
//
// Gesture model (per user spec):
//   horizontal swipe (L<->R)  -> flip current tape front<->back (description)
//   vertical swipe   (U<->D)  -> switch between Game Night tape and Story Mode tape
//   tap                       -> advance to the next set of buttons, which present
//                                the same swipeable way (difficulty / story cards / start)
(function () {
    'use strict';

    // Only run on touch / narrow screens. Desktop stays on the classic grid.
    // ?mobile=1 forces the mobile UI on desktop for preview/QA (non-breaking).
    const FORCE = new URLSearchParams(location.search).has('mobile');
    const MOBILE_QUERY = '(max-width: 768px), (pointer: coarse)';
    const mq = window.matchMedia(MOBILE_QUERY);
    if (!mq.matches && !FORCE) { return; }

    function initMobileCarousel() {
        const stage = document.getElementById('mtc-stage');
        const carousel = document.getElementById('mobile-tape-carousel');
        const hintEl = document.getElementById('mtc-hint');
        if (!stage || !carousel) { return; }

        const renderer = (window.tapeRenderer && window.tapeRenderer.coverRenderer)
            ? window.tapeRenderer.coverRenderer
            : (function () { try { return (new VHSTapeRenderer()).coverRenderer; } catch (e) { return null; } })();

        const TAPE_W = 300, TAPE_H = 420;

        // ---- State machine ----
        // level 0: top tapes  (game-night, story-mode)
        // level 1: chooser    (game -> difficulty[0..3]; story -> story-card[0..2])
        // level 2: start      (a single confirm tape that launches the game)
        const TOP_TAPES = [
            { id: 'game',  label: 'GAME NIGHT' },
            { id: 'story', label: 'STORY MODE' }
        ];
        const DIFFS = ['easy', 'medium', 'hard', 'insane'];
        const STORIES = ['cabin_stalkings', 'midnight_broadcast', 'the_archive'];

        let level = 0;
        let topIndex = 0;       // 0 game, 1 story
        let chooserIndex = 0;   // within difficulty / story cards
        let flipped = false;

        // ---- Build the tape DOM (two canvases: front + back) ----
        stage.innerHTML = `
            <div class="mtc-tape" id="mtc-tape">
                <canvas class="mtc-canvas mtc-front" width="${TAPE_W}" height="${TAPE_H}"></canvas>
                <canvas class="mtc-canvas mtc-back" width="${TAPE_W}" height="${TAPE_H}"></canvas>
            </div>`;
        const tapeEl = document.getElementById('mtc-tape');
        const front = tapeEl.querySelector('.mtc-front');
        const back = tapeEl.querySelector('.mtc-back');
        const fctx = front.getContext('2d');
        const bctx = back.getContext('2d');

        // ---- Drawing (reuse desktop renderers) ----
        function drawCover(fctx2, bctx2) {
            // Clear both
            [fctx2, bctx2].forEach(c => {
                c.clearRect(0, 0, TAPE_W, TAPE_H);
                c.fillStyle = '#0a0a0a';
                c.fillRect(0, 0, TAPE_W, TAPE_H);
            });
            if (!renderer) { return; }
            if (level === 0) {
                const isStory = topIndex === 1;
                const backLines = isStory
                    ? ['VHS HORROR PUZZLE COLLECTION', 'Rating: NC-17', 'Runtime: 94 MIN', 'Genre: Horror', 'Solve puzzles to survive', 'the nightmarish campaign']
                    : ['GAME NIGHT', 'Rating: R', 'Runtime: VARIES', 'Genre: Puzzle', 'Challenge your mind', 'with individual puzzles'];
                if (isStory) {
                    renderer.drawStoryCover(fctx2, TAPE_W, TAPE_H, backLines);
                    renderer.drawStoryBackCover && renderer.drawStoryBackCover(bctx2, TAPE_W, TAPE_H, backLines, true);
                } else {
                    renderer.drawGameCover(fctx2, TAPE_W, TAPE_H, backLines);
                    renderer.drawGameBackCover && renderer.drawGameBackCover(bctx2, TAPE_W, TAPE_H, backLines, true);
                }
            } else if (level === 1 && topIndex === 0) {
                const d = DIFFS[chooserIndex];
                const backLines = ['DIFFICULTY: ' + d.toUpperCase(), 'Rating: R', 'Runtime: VARIES', 'Genre: Puzzle', 'Horror Level: ' + d.toUpperCase(), 'Test your limits'];
                if (d === 'easy') { renderer.drawEasyCover(fctx2, TAPE_W, TAPE_H, backLines); }
                else if (d === 'medium') { renderer.drawMediumCover(fctx2, TAPE_W, TAPE_H, backLines); }
                else if (d === 'hard') { renderer.drawHardCover(fctx2, TAPE_W, TAPE_H, backLines); }
                else if (d === 'insane') { renderer.drawInsaneCover(fctx2, TAPE_W, TAPE_H, backLines); }
                // back face mirror
                fctx2.save(); fctx2.scale(-1, 1); fctx2.translate(-TAPE_W, 0);
                fctx2.drawImage(bctx2, 0, 0); fctx2.restore();
            } else if (level === 1 && topIndex === 1) {
                const s = STORIES[chooserIndex];
                const backLines = ['STORY', 'Rating: NC-17', 'Runtime: VARIES', 'Genre: Horror', 'Achievement: Not Completed', 'Badge: Locked'];
                if (s === 'cabin_stalkings') { renderer.drawCabinStalkingsCover(fctx2, TAPE_W, TAPE_H, backLines); }
                else if (s === 'midnight_broadcast') { renderer.drawMidnightBroadcastCover(fctx2, TAPE_W, TAPE_H, backLines); }
                else if (s === 'the_archive') { renderer.drawArchiveCover(fctx2, TAPE_W, TAPE_H, backLines); }
            } else if (level === 2) {
                const label = topIndex === 0 ? 'START ' + DIFFS[chooserIndex].toUpperCase() : 'PLAY STORY';
                const backLines = [label, 'TAP TO BEGIN', 'Rating: R', 'Genre: Horror', 'Good luck.', 'the tape is loaded'];
                fctx2.fillStyle = '#8b0000'; fctx2.fillRect(0, 0, TAPE_W, TAPE_H);
                fctx2.fillStyle = '#fff'; fctx2.font = 'bold 28px "Courier New"'; fctx2.textAlign = 'center';
                fctx2.fillText(label, TAPE_W / 2, TAPE_H / 2);
                bctx2.fillStyle = '#1a1a1a'; bctx2.fillRect(0, 0, TAPE_W, TAPE_H);
                bctx2.fillStyle = '#fff'; bctx2.fillText('TAP TO BEGIN', TAPE_W / 2, TAPE_H / 2);
            }
        }

        function setHint() {
            if (level === 0) hintEl.textContent = '↕ SWITCH TAPE · ↔ FLIP · TAP OPEN';
            else if (level === 1) hintEl.textContent = (topIndex === 0 ? '↕ DIFFICULTY' : '↕ STORY') + ' · ↔ FLIP · TAP NEXT';
            else hintEl.textContent = 'TAP TO START ▶';
        }

        function render() {
            flipped = false;
            tapeEl.classList.remove('flipped');
            drawCover(fctx, bctx);
            setHint();
        }

        // ---- Actions ----
        function flip() {
            flipped = !flipped;
            tapeEl.classList.toggle('flipped', flipped);
        }
        function switchTape(dir) {
            if (level !== 0) { return; }
            topIndex = (topIndex + dir + TOP_TAPES.length) % TOP_TAPES.length;
            render();
        }
        function cycleChooser(dir) {
            if (level !== 1) { return; }
            const len = topIndex === 0 ? DIFFS.length : STORIES.length;
            chooserIndex = (chooserIndex + dir + len) % len;
            render();
        }
        function advance() {
            if (level === 0) { level = 1; chooserIndex = 0; render(); }
            else if (level === 1) { level = 2; render(); }
            else if (level === 2) { startSelection(); }
        }
        function startSelection() {
            // Hand off to the main app's existing handlers.
            if (topIndex === 0) {
                // Game Night -> difficulty -> game-selection
                const game = window.__mobileLaunchGame;
                if (game) { game(DIFFS[chooserIndex]); }
                else { document.querySelector('[data-mode="game"]').click(); }
            } else {
                const story = window.__mobileLaunchStory;
                if (story) { story(STORIES[chooserIndex]); }
                else { document.querySelector(`[data-story="${STORIES[chooserIndex]}"]`)?.click(); }
            }
        }

        // Expose hooks so main.js can wire real launches without altering desktop code.
        window.__mobileLaunchGame = function (difficulty) {
            // Reuse the desktop flow: open game mode + difficulty then proceed.
            document.querySelector('[data-mode="game"]').click();
            const diffBtn = document.querySelector(`[data-difficulty="${difficulty}"]`);
            if (diffBtn) { diffBtn.click(); }
            // game-selection is now visible; emulate tap on first game for simplicity? No:
            // Show the game-selection chooser as a second mobile carousel instead.
            openGameChooser();
        };
        window.__mobileLaunchStory = function (storyId) {
            const card = document.querySelector(`[data-story="${storyId}"]`);
            if (card) { card.click(); }
        };

        // For Game Night level 2 we instead surface the game picker as its own
        // swipeable set so the user can pick connections/wordle/etc. Kept minimal:
        // reuse desktop game-selection grid but make it mobile-friendly via CSS.
        let gameChooserActive = false;
        function openGameChooser() {
            gameChooserActive = true;
            document.getElementById('game-selection').classList.remove('hidden');
            // Switch the visible screen to game-selection on mobile; desktop CSS hides
            // the classic grid, but we show it stacked via the mobile media query.
            carousel.classList.add('hidden');
            const gs = document.getElementById('game-selection');
            gs.classList.add('active'); gs.classList.remove('hidden');
            gs.scrollIntoView();
        }

        // ---- Gesture handling (pointer events) ----
        let sx = 0, sy = 0, tracking = false, moved = false;
        const THRESH = 30;
        stage.addEventListener('pointerdown', (e) => {
            tracking = true; moved = false; sx = e.clientX; sy = e.clientY;
        });
        stage.addEventListener('pointerup', (e) => {
            if (!tracking) { return; }
            tracking = false;
            const dx = e.clientX - sx, dy = e.clientY - sy;
            if (Math.abs(dx) < THRESH && Math.abs(dy) < THRESH) {
                // tap
                advance();
                return;
            }
            if (Math.abs(dx) > Math.abs(dy)) {
                flip();                 // horizontal -> flip
            } else {
                if (level === 0) switchTape(dy < 0 ? 1 : -1);       // vertical -> tape
                else if (level === 1) cycleChooser(dy < 0 ? 1 : -1); // vertical -> chooser
            }
        });
        stage.addEventListener('pointermove', (e) => {
            if (!tracking) { return; }
            if (Math.abs(e.clientX - sx) > THRESH || Math.abs(e.clientY - sy) > THRESH) { moved = true; }
        });
        stage.addEventListener('pointercancel', () => { tracking = false; });

        // Back from game-selection: re-show carousel
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (gameChooserActive) {
                    gameChooserActive = false;
                    const gs = document.getElementById('game-selection');
                    gs.classList.remove('active'); gs.classList.add('hidden');
                    carousel.classList.remove('hidden');
                }
            });
        }

        // Sound toggle mirror
        const sound = document.getElementById('mtc-sound');
        if (sound && window.audioController) {
            sound.textContent = window.audioController.isMuted() ? '🔇' : '🔊';
            sound.addEventListener('click', () => {
                const m = window.audioController.toggleMute();
                sound.textContent = m ? '🔇' : '🔊';
            });
        }

        // Show the carousel as the entry screen on mobile
        carousel.classList.remove('hidden');
        carousel.classList.add('active');
        render();

        // Hide the classic desktop grid on mobile
        const desktopMenu = document.getElementById('tape-selection');
        if (desktopMenu) { desktopMenu.classList.add('hidden'); desktopMenu.classList.remove('active'); }
    }

    // Wire after the main app initializes (tapeRenderer must exist).
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initMobileCarousel, 0));
    } else {
        setTimeout(initMobileCarousel, 0);
    }
})();
