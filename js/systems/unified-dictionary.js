// Unified dictionary for the whole collection. ONE word source:
//   - Broad English list loaded async from /data/strands-dictionary.txt
//     (dwyl/english-words, filtered 3-10 letters). Used by Strands hints,
//     Wordle answers, and as the base for Spelling Bee letter-set scoring.
//     Letter Boxed validates against this broad list (open-ended: any real
//     English word that follows the box rules counts, not a curated set).
//   - Puzzle-registered answers (Connections / Letter-Boxed / Spelling-Bee /
//     Strands) layered on top so curated solution sets are always valid.
//
// The key primitive this adds over the old split systems is wordsFormableFrom:
// "which real words can be built from these N letters, optionally requiring a
// given letter" — exactly what Spelling Bee needs to score on the logical
// letter set instead of a closed whitelist.

class UnifiedDictionary {
    constructor() {
        this.words = new Set();          // broad + registered
        this.letterBoxedAnswers = new Map(); // id -> Set (curated solutions)
        this.spellingBeeTargets = new Map(); // id -> Set (official answer list)
        this.loaded = false;
    }

    async load(puzzleData) {
        await this.loadBroadList();
        if (puzzleData) { this.registerPuzzles(puzzleData); }
        // loaded = we have SOMETHING to validate against. If the broad list
        // failed AND there are no registered words, words stays empty and the
        // games must degrade gracefully (see isValidWord).
        this.loaded = this.words.size > 0 || this.letterBoxedAnswers.size > 0 || this.spellingBeeTargets.size > 0;
        if (!this.loaded) {
            console.warn('[unified-dict] NO words loaded — games will accept guesses without dict validation.');
        }
    }

    async loadBroadList() {
        // Retry a few times: a 2MB plaintext fetch over a slow link (mobile/
        // tailnet) can drop. Failing silently here previously left the games
        // rejecting every guess ("all words not valid").
        const MAX = 3;
        for (let attempt = 1; attempt <= MAX; attempt++) {
            try {
                const res = await fetch('/data/strands-dictionary.txt');
                if (!res.ok) { throw new Error('dict http ' + res.status); }
                const text = await res.text();
                let added = 0;
                text.split('\n').forEach(line => {
                    const w = line.trim().toUpperCase();
                    if (w.length >= 3 && w.length <= 10 && /^[A-Z]+$/.test(w)) {
                        this.words.add(w);
                        added++;
                    }
                });
                console.log(`[unified-dict] loaded ${added} broad words (attempt ${attempt}).`);
                return;
            } catch (e) {
                console.warn(`[unified-dict] broad list load failed (attempt ${attempt}/${MAX}):`, e.message);
                if (attempt < MAX) { await new Promise(r => setTimeout(r, 400 * attempt)); }
            }
        }
        console.warn('[unified-dict] broad list unavailable after retries — falling back to registered words only.');
    }

    registerPuzzles(data) {
        if (data.letterBoxed) {
            data.letterBoxed.forEach(p => {
                if (p.answers) {
                    this.letterBoxedAnswers.set(p.id, new Set(p.answers.map(w => w.toUpperCase())));
                    p.answers.forEach(w => this.words.add(w.toUpperCase()));
                }
            });
        }
        if (data['spelling-bee']) {
            data['spelling-bee'].forEach(p => {
                if (p.answers) {
                    this.spellingBeeTargets.set(p.id, new Set(p.answers.map(w => w.toUpperCase())));
                    p.answers.forEach(w => this.words.add(w.toUpperCase()));
                }
            });
        }
        if (data.strands) {
            data.strands.forEach(p => {
                if (p.answers) { p.answers.forEach(w => this.words.add(w.toUpperCase())); }
                if (p.spangram) { this.words.add(p.spangram.toUpperCase()); }
            });
        }
        if (data.connections) {
            data.connections.forEach(p => {
                p.groups.forEach(g => g.words.forEach(w => this.words.add(w.toUpperCase())));
            });
        }
    }

    isValidWord(word) {
        const w = String(word).toUpperCase();
        // Graceful degradation: if the dictionary couldn't load at all (e.g. the
        // broad list fetch dropped on a slow mobile/tailnet link and no puzzle
        // words were registered), don't reject every guess — accept it so the
        // game stays playable instead of reporting "all words not valid".
        if (this.words.size === 0) { return true; }
        return this.words.has(w);
    }

    // Words buildable from `letters` (array, case-insensitive). Options:
    //   minLen      (default 4)
    //   mustInclude a required letter (e.g. Spelling Bee center)
    // Returns a Set of uppercased words.
    wordsFormableFrom(letters, { minLen = 4, mustInclude = null } = {}) {
        const pool = new Set(letters.map(l => l.toUpperCase()));
        const req = mustInclude ? mustInclude.toUpperCase() : null;
        const out = new Set();
        for (const w of this.words) {
            if (w.length < minLen) { continue; }
            if (req && !w.includes(req)) { continue; }
            let ok = true;
            for (const ch of w) {
                if (!pool.has(ch)) { ok = false; break; }
            }
            if (ok) { out.add(w); }
        }
        return out;
    }

    // Spelling Bee: every valid word for this puzzle's letter set.
    getSpellingBeeWords(puzzleId, centerLetter, outerLetters) {
        return this.wordsFormableFrom([...outerLetters, centerLetter], {
            minLen: 4,
            mustInclude: centerLetter
        });
    }

    getRandomWord(length = 5) {
        const cand = [];
        for (const w of this.words) { if (w.length === length) { cand.push(w); } }
        if (!cand.length) { return null; }
        return cand[Math.floor(Math.random() * cand.length)];
    }

    isLetterBoxedAnswer(puzzleId, word) {
        const set = this.letterBoxedAnswers.get(puzzleId);
        return set ? set.has(String(word).toUpperCase()) : false;
    }

    getSpellingBeeTargetCount(puzzleId) {
        const set = this.spellingBeeTargets.get(puzzleId);
        return set ? set.size : 0;
    }

    isSpellingBeeTarget(puzzleId, word) {
        const set = this.spellingBeeTargets.get(puzzleId);
        return set ? set.has(String(word).toUpperCase()) : false;
    }
}

const unifiedDictionary = new UnifiedDictionary();
