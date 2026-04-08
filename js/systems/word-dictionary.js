// Unified Word Dictionary - Single source for all word puzzle games

class WordDictionary {
    constructor() {
        this.words = new Set();
        this.answers = new Set();
        this.byLength = new Map();
        this.byFirstLetter = new Map();
        this.byLastLetter = new Map();
        this.byCategory = new Map();
        this.spangrams = new Set();
        this.letterBoxedAnswers = new Map();
        this.loaded = false;
    }

    async load(puzzleData) {
        this.loadFromPuzzles(puzzleData);
        await this.loadExternalWordLists();
        this.buildIndexes();
        this.loaded = true;
    }

    loadFromPuzzles(data) {
        if (data.connections) {
            data.connections.forEach(puzzle => {
                puzzle.groups.forEach(group => {
                    group.words.forEach(word => {
                        this.addWord(word.toUpperCase());
                        this.addToCategory(word.toUpperCase(), group.category);
                    });
                });
            });
        }

        if (data.letterBoxed) {
            data.letterBoxed.forEach(puzzle => {
                if (puzzle.answers) {
                    this.letterBoxedAnswers.set(puzzle.id, new Set(puzzle.answers.map(w => w.toUpperCase())));
                    puzzle.answers.forEach(word => {
                        this.addWord(word.toUpperCase());
                    });
                }
            });
        }

        if (data.spellingBee) {
            data.spellingBee.forEach(puzzle => {
                if (puzzle.answers) {
                    puzzle.answers.forEach(word => {
                        this.addWord(word.toUpperCase());
                        this.answers.add(word.toUpperCase());
                    });
                }
                if (puzzle.spangram) {
                    this.spangrams.add(puzzle.spangram.toUpperCase());
                }
            });
        }
    }

    async loadExternalWordLists() {
        const wordleWords = [
            "CRANE", "SLATE", "CRISP", "PLANT", "CHAIR", "TABLE", "HOUSE", "WATER",
            "MUSIC", "PHONE", "VIDEO", "MOVIE", "BOOKS", "PAPER", "PENCIL", "WINDOW",
            "DOOR", "LIGHT", "DARK", "SHADOW", "GHOST", "BLOOD", "KNIFE", "ROPE",
            "DEATH", "FEAR", "LOVE", "HATE", "NIGHT", "DREAM", "STORM", "FIRE",
            "WITCH", "DEMON", "DEVIL", "ANGEL", "HEART", "SOUL", "MIND", "BODY",
            "BRAIN", "BONE", "BLOOD", "SKIN", "HAIR", "EYES", "EARS", "NOSE",
            "MOUTH", "HAND", "FOOT", "HEAD", "CHEST", "BACK", "ARM", "LEG",
            "ABUSE", "ADULT", "AGENT", "ANGER", "AWARD", "BASIS", "BEACH", "BIRTH",
            "BLOCK", "BOARD", "BREAK", "BROWN", "BUYER", "CAUSE", "CHAIN", "CHECK",
            "CLASS", "CLEAN", "CLEAR", "CLOSE", "COACH", "COUNT", "COURT", "COVER",
            "CREAM", "CRIME", "CROSS", "CROWD", "CROWN", "CYCLE", "DAILY", "DANCE",
            "DEPTH", "DOUBT", "DRAFT", "DRAMA", "DREAM", "DRESS", "DRINK", "DRIVE",
            "EARTH", "ENEMY", "ENTRY", "ERROR", "EVENT", "FAITH", "FAULT", "FIELD",
            "FINAL", "FLESH", "FLOOR", "FOCUS", "FORCE", "FRAME", "FRANK", "FRONT",
            "FRUIT", "GLASS", "GRANT", "GRASS", "GREEN", "GROUP", "GUIDE", "HEAVY",
            "HORSE", "HOTEL", "IMAGE", "INDEX", "INNER", "INPUT", "ISSUE", "JUDGE",
            "KNOWN", "LABEL", "LARGE", "LASER", "LATER", "LAYER", "LEVEL", "LIGHT",
            "LIMIT", "LINKS", "LIVES", "LOCAL", "LOGIC", "LOOSE", "LOWER", "LUCKY",
            "LUNCH", "MAJOR", "MARCH", "MATCH", "METAL", "MODEL", "MONEY", "MONTH",
            "MOTOR", "MOUTH", "MOVED", "MUSIC", "NEEDS", "NERVE", "NEVER", "NEWLY",
            "NOISE", "NORTH", "NOTED", "NOVEL", "NURSE", "OCCUR", "OCEAN", "OFFER",
            "ORDER", "OTHER", "OUTER", "OWNER", "PANEL", "PAPER", "PARTY", "PEACE",
            "PHASE", "PHONE", "PHOTO", "PIECE", "PILOT", "PITCH", "PLACE", "PLAIN",
            "PLANE", "PLANT", "PLATE", "POINT", "POUND", "POWER", "PRESS", "PRICE",
            "PRIDE", "PRIME", "PRINT", "PRIOR", "PRIZE", "PROOF", "PROUD", "PROVE",
            "QUEEN", "QUICK", "QUIET", "QUITE", "RADIO", "RAISE", "RANGE", "RAPID",
            "RATIO", "REACH", "READY", "REFER", "REIGN", "RELAX", "REPLY", "RIGHT",
            "RIVAL", "RIVER", "ROBOT", "ROUGH", "ROUND", "ROUTE", "ROYAL", "RURAL",
            "SCALE", "SCENE", "SCOPE", "SCORE", "SENSE", "SERVE", "SEVEN", "SHALL",
            "SHAPE", "SHARE", "SHARP", "SHEET", "SHELF", "SHELL", "SHIFT", "SHIRT",
            "SHOCK", "SHOOT", "SHORT", "SHOWN", "SIGHT", "SIMON", "SINCE", "SIXTH",
            "SIXTY", "SIZED", "SKILL", "SLEEP", "SLIDE", "SMALL", "SMART", "SMILE",
            "SMITH", "SMOKE", "SOLID", "SOLVE", "SORRY", "SOUND", "SOUTH", "SPACE",
            "SPARE", "SPEAK", "SPEED", "SPEND", "SPENT", "SPLIT", "SPOKE", "SPORT",
            "STAFF", "STAGE", "STAKE", "STAND", "START", "STATE", "STEAM", "STEEL",
            "STICK", "STILL", "STOCK", "STONE", "STOOD", "STORE", "STORM", "STORY",
            "STRIP", "STUCK", "STUDY", "STUFF", "STYLE", "SUGAR", "SUITE", "SUPER",
            "SWEET", "TABLE", "TAKEN", "TASTE", "TAXES", "TEACH", "TEETH", "TERRY",
            "TEXAS", "THANK", "THEFT", "THEIR", "THEME", "THERE", "THESE", "THICK",
            "THING", "THINK", "THIRD", "THOSE", "THREE", "THREW", "THROW", "TIGHT",
            "TIMES", "TIRED", "TITLE", "TODAY", "TOPIC", "TOTAL", "TOUCH", "TOUGH",
            "TOWER", "TRACK", "TRADE", "TRAIN", "TREAT", "TREND", "TRIAL", "TRIBE",
            "TRICK", "TRIED", "TROOP", "TRUCK", "TRULY", "TRUST", "TRUTH", "TWICE",
            "UNDER", "UNDUE", "UNION", "UNITY", "UNTIL", "UPPER", "UPSET", "URBAN",
            "USAGE", "USUAL", "VALID", "VALUE", "VIDEO", "VIRUS", "VISIT", "VITAL",
            "VOICE", "WASTE", "WATCH", "WATER", "WHEEL", "WHERE", "WHICH", "WHILE",
            "WHITE", "WHOLE", "WHOSE", "WOMAN", "WORLD", "WORRY", "WORSE", "WORST",
            "WRITE", "WRONG", "WROTE", "YIELD", "YOUNG", "YOUTH", "ZONES", "ZEBRA"
        ];

        wordleWords.forEach(word => {
            this.answers.add(word);
            this.words.add(word);
        });

        const defaultSpellingBeeWords = [
            "Horror", "Scary", "Creepy", "Spooky", "Eerie", "Dark", "Evil", "Wicked",
            "Ghost", "Spirit", "Demon", "Devil", "Witch", "Vampire", "Zombie", "Mummy",
            "Skeleton", "Skull", "Grave", "Tomb", "Crypt", "Coffin", "Blood", "Gore",
            "Scream", "Cry", "Fear", "Terror", "Panic", "Horror", "Dread", "Fright",
            "Shadow", "Darkness", "Night", "Moon", "Star", "Storm", "Thunder", "Rain"
        ];

        defaultSpellingBeeWords.forEach(word => {
            this.words.add(word.toUpperCase());
        });
    }

    addWord(word) {
        const w = word.toUpperCase();
        this.words.add(w);
    }

    addToCategory(word, category) {
        const w = word.toUpperCase();
        if (!this.byCategory.has(category)) {
            this.byCategory.set(category, new Set());
        }
        this.byCategory.get(category).add(w);
    }

    buildIndexes() {
        this.words.forEach(word => {
            const len = word.length;
            if (!this.byLength.has(len)) {
                this.byLength.set(len, new Set());
            }
            this.byLength.get(len).add(word);

            const first = word[0];
            if (!this.byFirstLetter.has(first)) {
                this.byFirstLetter.set(first, new Set());
            }
            this.byFirstLetter.get(first).add(word);

            const last = word.slice(-1);
            if (!this.byLastLetter.has(last)) {
                this.byLastLetter.set(last, new Set());
            }
            this.byLastLetter.get(last).add(word);
        });
    }

    isValidWord(word) {
        return this.words.has(word.toUpperCase());
    }

    isAnswer(word) {
        return this.answers.has(word.toUpperCase());
    }

    isLetterBoxedAnswer(puzzleId, word) {
        const puzzleAnswers = this.letterBoxedAnswers.get(puzzleId);
        if (!puzzleAnswers) return false;
        return puzzleAnswers.has(word.toUpperCase());
    }

    getWordsByLength(length) {
        return Array.from(this.byLength.get(length) || []);
    }

    getWordsStartingWith(letter) {
        return Array.from(this.byFirstLetter.get(letter.toUpperCase()) || []);
    }

    getWordsEndingWith(letter) {
        return Array.from(this.byLastLetter.get(letter.toUpperCase()) || []);
    }

    getWordsStartingWithAndLength(letter, length) {
        const starts = this.byFirstLetter.get(letter.toUpperCase()) || new Set();
        return Array.from(starts).filter(w => w.length === length);
    }

    getWordsEndingWithAndLength(letter, length) {
        const ends = this.byLastLetter.get(letter.toUpperCase()) || new Set();
        return Array.from(ends).filter(w => w.length === length);
    }

    getWordsInCategory(category) {
        return Array.from(this.byCategory.get(category) || []);
    }

    getCategories() {
        return Array.from(this.byCategory.keys());
    }

    getLetterBoxedWords(puzzleId, startLetter = null, minLength = 3) {
        const answers = this.letterBoxedAnswers.get(puzzleId);
        if (!answers) return [];
        
        let words = Array.from(answers).filter(w => w.length >= minLength);
        
        if (startLetter) {
            words = words.filter(w => w.startsWith(startLetter.toUpperCase()));
        }
        
        return words;
    }

    getRandomWord(length = 5) {
        const words = this.getWordsByLength(length);
        if (words.length === 0) return null;
        return words[Math.floor(Math.random() * words.length)];
    }

    getSpellingBeeWords(puzzleId) {
        return this.getWordsByLength(7).filter(w => w.length === 7);
    }
}

const wordDictionary = new WordDictionary();