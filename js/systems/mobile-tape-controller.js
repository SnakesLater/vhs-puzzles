// Mobile Tape Carousel Controller
// Parallel, mobile-only entry point. Reuses the SAME canvas cover renderers
// as desktop so the art is identical. Activated only when matchMedia matches
// (narrow / coarse-pointer) or ?mobile=1. Desktop DOM + logic are never touched.
//
// Gesture model (per spec):
//   horizontal swipe (L<->R)  -> flip current tape front<->back (description)
//   vertical swipe   (U<->D)  -> at top: switch tape; in a step: cycle item
//   tap                       -> advance / select; final tap launches
//
// Navigation mirrors the DESKTOP flow:
//   GAME NIGHT  tape -> [ GAME MODES ]              -> tap plays that game
//   STORY MODE  tape -> [ DIFFICULTY ] -> [ STORIES ] -> tap plays that story
(function () {
    'use strict';

    // Activate on touch / narrow screens. Desktop stays on the classic grid.
    // ?mobile=1 forces the mobile UI on desktop for preview/QA (non-breaking).
    const FORCE = new URLSearchParams(location.search).has('mobile');
    // Broad detection: any one of these means "treat as mobile". We do NOT rely
    // on the CSS @media matching — if JS thinks it's mobile we add a class and
    // drive the layout from that class so JS and CSS can never disagree.
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isNarrow = window.matchMedia('(max-width: 768px)').matches;
    const noHover  = window.matchMedia('(hover: none)').matches;
    const isTouch  = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const MOBILE = FORCE || isCoarse || isNarrow || noHover || isTouch;
    if (!MOBILE) { return; }
    document.documentElement.classList.add('mtc-mode');

    // Items per step. GAME path has one step (the game modes); STORY path has
    // two (difficulty, then stories) — exactly like the desktop menu.
    const GAMES   = ['connections', 'wordle', 'strands', 'spelling-bee', 'letter-boxed'];
    const DIFFS   = ['easy', 'medium', 'hard', 'insane'];
    const STORIES = ['cabin_stalkings', 'midnight_broadcast', 'the_archive'];

    function initMobileCarousel() {
        const stage = document.getElementById('mtc-stage');
        const carousel = document.getElementById('mobile-tape-carousel');
        const hintEl = document.getElementById('mtc-hint');
        if (!stage || !carousel) { return; }

        const renderer = (window.tapeRenderer && window.tapeRenderer.coverRenderer)
            ? window.tapeRenderer.coverRenderer
            : (function () { try { return (new VHSTapeRenderer()).coverRenderer; } catch { return null; } })();

        const TAPE_W = 300, TAPE_H = 420;

        // ---- State ----
        let atTop = true;        // true = on the top GAME/STORY tape
        let topIndex = 0;        // 0 = game night, 1 = story mode
        let stepIndex = 0;       // index into the current path's steps
        let itemIndex = 0;       // index within the current step's items
        let picks = [];          // picks[step] = chosen item index
        let flipped = false;

        function currentPath() { return topIndex === 0 ? 'game' : 'story'; }
        function steps() { return currentPath() === 'game' ? ['game'] : ['diff', 'story']; }
        function stepItems(key) {
            if (key === 'game')  return GAMES;
            if (key === 'diff')  return DIFFS;
            if (key === 'story') return STORIES;
            return [];
        }

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
        function itemLines(key, item) {
            if (key === 'game') {
                const m = {
                    'connections':   ['CONNECTIONS', 'Link the clues'],
                    'wordle':        ['WORDLE', 'Guess the word'],
                    'strands':       ['STRANDS', 'Unravel the web'],
                    'spelling-bee':  ['SPELLING BEE', 'Build words'],
                    'letter-boxed':  ['LETTER BOXED', 'Chain words']
                };
                return m[item] || [item.toUpperCase(), ''];
            }
            if (key === 'diff')  return ['DIFFICULTY', 'Level: ' + item.toUpperCase()];
            if (key === 'story') {
                const m = {
                    'cabin_stalkings':    ['CABIN STALKINGS'],
                    'midnight_broadcast': ['MIDNIGHT BROADCAST'],
                    'the_archive':        ['THE ARCHIVE']
                };
                return m[item] || [item.toUpperCase()];
            }
            return ['TAPE'];
        }

        function drawGameItem(ctx, item, lines) {
            if (item === 'connections')        renderer.drawConnectionsCover(ctx, TAPE_W, TAPE_H, lines);
            else if (item === 'wordle')        renderer.drawWordleCover(ctx, TAPE_W, TAPE_H, lines);
            else if (item === 'strands')       renderer.drawStrandsCover(ctx, TAPE_W, TAPE_H, lines);
            else if (item === 'spelling-bee')  renderer.drawSpellingBeeCover(ctx, TAPE_W, TAPE_H, lines);
            else if (item === 'letter-boxed')  renderer.drawLetterBoxedCover(ctx, TAPE_W, TAPE_H, lines);
        }
        function drawDiffItem(ctx, item, lines) {
            if (item === 'easy')        renderer.drawEasyCover(ctx, TAPE_W, TAPE_H, lines);
            else if (item === 'medium') renderer.drawMediumCover(ctx, TAPE_W, TAPE_H, lines);
            else if (item === 'hard')   renderer.drawHardCover(ctx, TAPE_W, TAPE_H, lines);
            else if (item === 'insane') renderer.drawInsaneCover(ctx, TAPE_W, TAPE_H, lines);
        }
        function drawStoryItem(ctx, item, lines) {
            if (item === 'cabin_stalkings')         renderer.drawCabinStalkingsCover(ctx, TAPE_W, TAPE_H, lines);
            else if (item === 'midnight_broadcast') renderer.drawMidnightBroadcastCover(ctx, TAPE_W, TAPE_H, lines);
            else if (item === 'the_archive')        renderer.drawArchiveCover(ctx, TAPE_W, TAPE_H, lines);
        }

        function drawCover(fctx2, bctx2) {
            [fctx2, bctx2].forEach(c => {
                c.clearRect(0, 0, TAPE_W, TAPE_H);
                c.fillStyle = '#0a0a0a';
                c.fillRect(0, 0, TAPE_W, TAPE_H);
            });
            if (!renderer) { return; }

            if (atTop) {
                const isStory = topIndex === 1;
                const lines = isStory
                    ? ['VHS HORROR PUZZLE COLLECTION', 'Rating: NC-17', 'Runtime: 94 MIN', 'Genre: Horror', 'Solve puzzles to survive', 'the nightmarish campaign']
                    : ['GAME NIGHT', 'Rating: R', 'Runtime: VARIES', 'Genre: Puzzle', 'Challenge your mind', 'with individual puzzles'];
                if (isStory) {
                    renderer.drawStoryCover(fctx2, TAPE_W, TAPE_H, lines);
                    if (renderer.drawStoryBackCover) renderer.drawStoryBackCover(bctx2, TAPE_W, TAPE_H, lines, true);
                } else {
                    renderer.drawGameCover(fctx2, TAPE_W, TAPE_H, lines);
                    if (renderer.drawGameBackCover) renderer.drawGameBackCover(bctx2, TAPE_W, TAPE_H, lines, true);
                }
                return;
            }

            const key = steps()[stepIndex];
            const items = stepItems(key);
            const item = items[itemIndex];
            const lines = itemLines(key, item);
            if (key === 'game')       drawGameItem(fctx2, item, lines);
            else if (key === 'diff')   drawDiffItem(fctx2, item, lines);
            else if (key === 'story')  drawStoryItem(fctx2, item, lines);

            // Back face: simple info panel (flip reveals it).
            bctx2.fillStyle = '#1a1a1a'; bctx2.fillRect(0, 0, TAPE_W, TAPE_H);
            bctx2.fillStyle = '#fff'; bctx2.textAlign = 'center';
            bctx2.font = 'bold 22px "Courier New"';
            bctx2.fillText(lines[0] || 'TAPE', TAPE_W / 2, TAPE_H * 0.45);
            bctx2.font = '14px "Courier New"';
            bctx2.fillStyle = '#ff6b35';
            bctx2.fillText('↔ FLIP FOR INFO', TAPE_W / 2, TAPE_H * 0.55);
        }

        function setHint() {
            if (atTop) {
                hintEl.textContent = '↕ SWITCH TAPE · ↔ FLIP · TAP OPEN';
                return;
            }
            const key = steps()[stepIndex];
            const isLast = stepIndex === steps().length - 1;
            if (key === 'game')       hintEl.textContent = '↕ GAME · ↔ FLIP · TAP TO PLAY ▶';
            else if (key === 'diff')  hintEl.textContent = '↕ DIFFICULTY · ↔ FLIP · TAP NEXT';
            else if (key === 'story') hintEl.textContent = isLast ? '↕ STORY · ↔ FLIP · TAP TO PLAY ▶' : '↕ STORY · ↔ FLIP · TAP NEXT';
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
            if (!atTop) { return; }
            topIndex = (topIndex + dir + 2) % 2;
            render();
        }
        function cycleItem(dir) {
            if (atTop) { return; }
            const len = stepItems(steps()[stepIndex]).length;
            itemIndex = (itemIndex + dir + len) % len;
            render();
        }
        function advance() {
            if (atTop) {
                atTop = false; stepIndex = 0; itemIndex = 0; picks = [];
                render();
                return;
            }
            picks[stepIndex] = itemIndex;
            if (stepIndex < steps().length - 1) {
                stepIndex++; itemIndex = 0; render();
            } else {
                launch();
            }
        }
        function launch() {
            const path = currentPath();
            hideCarousel();
            if (path === 'game') {
                const game = GAMES[itemIndex];
                if (window.__mobileStartGame) window.__mobileStartGame(game);
            } else {
                const diff = DIFFS[picks[0]];
                const story = STORIES[itemIndex];
                if (window.__mobileStartStory) window.__mobileStartStory(diff, story);
            }
        }
        function hideCarousel() {
            carousel.classList.add('hidden');
            carousel.classList.remove('active');
        }

        // ---- Gesture handling (pointer events) ----
        let sx = 0, sy = 0, tracking = false;
        const THRESH = 30;
        stage.addEventListener('pointerdown', (e) => {
            tracking = true; sx = e.clientX; sy = e.clientY;
        });
        stage.addEventListener('pointerup', (e) => {
            if (!tracking) { return; }
            tracking = false;
            const dx = e.clientX - sx, dy = e.clientY - sy;
            if (Math.abs(dx) < THRESH && Math.abs(dy) < THRESH) {
                advance();            // tap
                return;
            }
            if (Math.abs(dx) > Math.abs(dy)) {
                flip();               // horizontal -> flip
            } else if (atTop) {
                switchTape(dy < 0 ? 1 : -1);       // vertical -> tape
            } else {
                cycleItem(dy < 0 ? 1 : -1);         // vertical -> item
            }
        });
        stage.addEventListener('pointercancel', () => { tracking = false; });

        // Return-to-menu: any desktop back button re-shows the carousel on mobile
        // (goBack() resets to the desktop menu, which is hidden under mtc-mode).
        ['back-btn', 'game-mode-back', 'story-back-btn'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', () => {
                    requestAnimationFrame(() => {
                        if (document.documentElement.classList.contains('mtc-mode')) {
                            carousel.classList.remove('hidden');
                            carousel.classList.add('active');
                        }
                    });
                });
            }
        });

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

    // Wire AFTER the main app initializes. main.js's DOMContentLoaded handler
    // is async (it awaits data load, then calls showScreen('tapeSelection')),
    // so we must run after that settles — otherwise showScreen re-shows the
    // desktop menu and clobbers the mobile carousel. Use window 'load' (fires
    // after main's async DOMContentLoaded work) plus a rAF re-assert.
    function boot() {
        initMobileCarousel();
        // Re-assert mobile override one frame later so it survives showScreen().
        requestAnimationFrame(() => {
            if (document.documentElement.classList.contains('mtc-mode')) {
                const dm = document.getElementById('tape-selection');
                const mc = document.getElementById('mobile-tape-carousel');
                if (dm) { dm.classList.add('hidden'); dm.classList.remove('active'); }
                if (mc && !mc.classList.contains('active')) { mc.classList.remove('hidden'); mc.classList.add('active'); }
            }
        });
    }
    if (document.readyState === 'complete') {
        boot();
    } else {
        window.addEventListener('load', boot);
        // Fallback if 'load' is delayed by the avatar video etc.
        document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 50));
    }
})();
