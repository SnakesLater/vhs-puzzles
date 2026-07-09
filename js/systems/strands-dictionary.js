// Strands hint dictionary — broad English wordlist (4-10 letters) used ONLY to
// credit non-theme traced words toward hints. Separate from the 5-letter Wordle
// list, so players can rack up hints with any real word (NYT behaviour).
//
// Source: dwyl/english-words (public domain), filtered to pure-alpha 4-10.
// Loaded async from /data/strands-dictionary.txt.

class StrandsDictionary {
    constructor() {
        this.words = new Set();
        this.loaded = false;
    }

    async load() {
        try {
            const res = await fetch('/data/strands-dictionary.txt');
            if (!res.ok) throw new Error('strands dict http ' + res.status);
            const text = await res.text();
            text.split('\n').forEach(line => {
                const w = line.trim().toUpperCase();
                if (w.length >= 4 && w.length <= 10 && /^[A-Z]+$/.test(w)) {
                    this.words.add(w);
                }
            });
            this.loaded = true;
        } catch (e) {
            console.warn('[strands-dict] load failed:', e.message);
            this.loaded = true; // don't block gameplay if asset missing
        }
    }

    isValidWord(word) {
        return this.words.has(String(word).toUpperCase());
    }
}

const strandsDictionary = new StrandsDictionary();
