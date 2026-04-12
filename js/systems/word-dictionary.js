// Unified Word Dictionary - FULL 5-LETTER WORD LIST
// 1338 valid 5 letter English words included

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
        // FULL 5-LETTER WORD DICTIONARY
        const allFiveLetterWords = [
"ABACK","ABASE","ABATE","ABIDE","ABODE","ABORT","ABOUT","ABUSE","ABUZZ","ACHES","ACHOO","ACIDS","ACIDY","ACTOR","ACUTE","ADAPT","ADDED","ADMIN","ADMIT","ADOBE","ADOPT","ADORN","ADULT","AFFIX","AFOOT","AFOUL","AFTER","AGAIN","AGENT","AGING","AGLOW","AGONY","AGREE","AHEAD","AHOLD","AIDED","AIMED","AIRED","AISLE","ALARM","ALERT","ALIAS","ALIEN","ALIKE","ALLAY","ALLOT","ALLOY","ALOFT","ALONE","ALOOF","ALOUD","ALPHA","AMAZE","AMBER","AMEND","AMINO","AMISS","AMONG","AMOUR","AMUSE","ANGEL","ANGER","ANGLE","ANGLO","ANGRY","ANIME","ANKLE","ANNUL","ANVIL","APART","APNEA","APPLE","APPLY","APRON","AREAS","ARENA","ARMED","ARMOR","AROSE","ARRAY","ARSON","ARTSY","ASIDE","ASKED","ASKEW","ASSET","ATOMS","ATONE","AUDIO","AUDIT","AUNTY","AVAIL","AVERT","AVOID","AWAIT","AWAKE","AWARD","AWARE","AWASH","AWFUL","AWOKE",
"BABEL","BABES","BACKS","BACON","BADDY","BADGE","BADLY","BAGEL","BAGGY","BAKED","BAKER","BAKES","BALER","BALKY","BALLS","BALMY","BANDS","BANDY","BANKS","BARED","BARKS","BARMY","BARON","BASED","BASIC","BASIL","BASIN","BATCH","BATES","BATHS","BATON","BATTY","BEACH","BEADS","BEADY","BEAKY","BEAMS","BEAMY","BEANS","BEARD","BEARS","BEAST","BEBOP","BEECH","BEEPS","BEERS","BEGAN","BEGIN","BEGOT","BEIGE","BELCH","BELLE","BELLS","BELLY","BELOW","BELTS","BENCH","BENDS","BENDY","BERTH","BESET","BESOT","BESTS","BIBBS","BIBLE","BICEP","BIDES","BIDET","BIKED","BIKER","BIKES","BILLS","BINGE","BINGO","BIPOD","BIRCH","BIRDS","BIRTH","BISON","BITES","BLACK","BLADE","BLAME","BLANK","BLAZE","BLEAK","BLEED","BLEEP","BLEND","BLESS","BLEST","BLIMP","BLIND","BLING","BLINK","BLISS","BLOAT","BLOCK","BLOND","BLOOD","BLOOM","BLOWN","BLOWS","BLOWY","BLUES","BLUFF","BLUNT","BLURS","BOARD","BOAST","BOATS","BOGUS","BOILS","BOMBS","BONED","BONES","BOOKS","BOOST","BOOTH","BOOZE","BORED","BORNE","BOUND","BOWEL","BOWLS","BOXED","BOXER","BOXES","BRACE","BRAID","BRAIL","BRAIN","BRAKE","BRAND","BRASS","BRAWL","BREAD","BREED","BRIBE","BRING","BROAD","BROKE","BROWN","BRUSH","BRUTE","BUDGE","BUILT","BULLY","BUMPY","BUNCH","BUNNY","BURNS","BURNT","BUSHY","BUTTS","BUYER",
"CABIN","CABLE","CACHE","CADDY","CADET","CAKED","CAKES","CALVE","CAMEL","CAMEO","CAMPS","CANAL","CANDY","CANOE","CANON","CARDS","CARGO","CAROL","CARRY","CARTS","CARVE","CASED","CASTS","CATCH","CAUSE","CAVED","CAVES","CEASE","CEDAR","CELLO","CELLS","CELTS","CENTS","CHAIN","CHAIR","CHALK","CHAMP","CHART","CHASE","CHEAP","CHEAT","CHECK","CHEEK","CHEER","CHEFS","CHESS","CHEST","CHEWS","CHEWY","CHICK","CHIEF","CHILD","CHIME","CHIPS","CHIRP","CHIVE","CHOIR","CHOKE","CHOMP","CHORE","CHUCK","CHURN","CHUTE","CIDER","CIGAR","CLAIM","CLASP","CLASS","CLEAN","CLEAT","CLIFF","CLIMB","CLOAK","CLONE","CLOSE","CLOTH","CLOUD","CLOUT","CLOWN","CLUBS","CLUES","COAST","CODED","COILS","COINS","COLDS","COLOR","COMBO","COMES","COMFY","CONDO","CONES","CORAL","CORDS","CORNY","COSTS","COUCH","COUGH","COULD","COUNT","COVER","COVID","CRABS","CRACK","CRAFT","CRANE","CRAWL","CRAZE","CRAZY","CREAM","CRIBS","CRIED","CRIES","CRIME","CRISP","CROAK","CROWD","CROWN","CRUDE","CRUMB","CUPID","CURED","CURLY","CURRY","CURVE","CURVY","CUTCH","CUTER","CYSTS",
"DADDY","DAILY","DAIRY","DAISY","DANCE","DANDY","DARTS","DATED","DATES","DEALS","DEALT","DEATH","DEBTS","DEBUT","DECAF","DECAY","DECKS","DECOR","DECOY","DEEDS","DEEMS","DEITY","DELAY","DELTA","DELVE","DEMON","DENIM","DENSE","DEPTH","DERBY","DESKS","DETER","DETOX","DIARY","DICED","DICES","DIETS","DINGY","DIRTY","DISCS","DITCH","DITTO","DITTY","DIVES","DOCKS","DODGE","DOGGY","DOING","DOLLS","DONOR","DOORS","DOPED","DOTED","DOTTY","DOUGH","DOVES","DOWNS","DOWRY","DOZER","DOZES","DRAFT","DRAGS","DRAIN","DRAKE","DRAMA","DRANK","DRAPE","DRAWL","DRAWN","DRAWS","DREAD","DREAM","DRESS","DRIED","DRIER","DRILL","DRINK","DRIVE","DROID","DRONE","DROOL","DROPS","DROVE","DROWN","DRUGS","DRUID","DRUMS","DRUNK","DRYER","DUALS","DUCTS","DUDES","DUETS","DUKED","DUKES","DUMPS","DUNCE","DUNES","DUPED","DUSTY","DUVET","DWARF","DWEEB","DWELL","DYING",
"EAGER","EAGLE","EARLY","EARNS","EARTH","EASED","EASEL","EATEN","EATER","EBONY","EDEMA","EDGES","EDITS","EIGHT","EJECT","ELATE","ELBOW","ELDER","ELECT","ELITE","ELOPE","ELUDE","EMAIL","EMBED","EMBER","EMEND","EMOJI","EMOTE","EMPTY","ENACT","ENDED","ENEMA","ENEMY","ENJOY","ENTER","ENTRY","EQUAL","EQUIP","ERASE","ERECT","ERODE","ERROR","ERUPT","ESSAY","ETHER","ETHIC","ETUDE","EUROS","EVENT","EVERY","EVILS","EXACT","EXAMS","EXCEL","EXILE","EXIST","EXITS","EXPEL","EXTRA",
"FABLE","FACED","FACES","FACET","FACTS","FADES","FAILS","FAINT","FAIRS","FAIRY","FAKES","FALLS","FALSE","FAMED","FANCY","FANGS","FARCE","FARMS","FATAL","FATED","FATTY","FAVOR","FAZED","FEARS","FEAST","FECAL","FEEDS","FEELS","FEINT","FEIST","FELLA","FELON","FENCE","FERRY","FETAL","FETCH","FEVER","FIBER","FIELD","FIEND","FIFTH","FIFTY","FIGHT","FILES","FILMS","FILTH","FINAL","FINDS","FINED","FIRED","FIRES","FIRST","FISHY","FISTS","FITCH","FIVER","FIVES","FIXED","FIXER","FIXES","FIZZY","FLAGS","FLAKE","FLAME","FLANK","FLAPS","FLARE","FLASH","FLASK","FLATS","FLEAS","FLEET","FLESH","FLIED","FLIES","FLING","FLIPS","FLIRT","FLOAT","FLOCK","FLOOD","FLOOR","FLORA","FLOUR","FLOWN","FLUFF","FLUID","FLUKE","FLUME","FLUSH","FLUTE","FLYER","FOAMY","FOCUS","FOGGY","FOLKS","FONTS","FOODS","FOOLS","FORCE","FORGE","FORGO","FORKS","FORTH","FORTY","FORUM","FOUND","FRAIL","FRAME","FRANK","FRAUD","FREAK","FREED","FRESH","FRIED","FRIES","FRISK","FROCK","FROGS","FRONT","FROST","FROWN","FRUIT","FRYER","FUDGE","FUELS","FULLY","FUMED","FUMES","FUNDS","FUNNY","FUSED","FUSSY","FUZZY",
"GABLE","GAFFS","GAINS","GALES","GAMED","GAMER","GAMES","GANGS","GASES","GASPS","GASSY","GATED","GAUNT","GEARS","GEEKS","GEEKY","GENES","GENIE","GENRE","GENTS","GENUS","GERMS","GHOST","GIANT","GIDDY","GIFTS","GIRLS","GIRLY","GIVEN","GLADE","GLARE","GLASS","GLAZE","GLEAN","GLIDE","GLOAT","GLOBE","GLOBS","GLOOM","GLORY","GLOSS","GLOVE","GLOWS","GLUED","GLUES","GNARL","GNOME","GOADS","GOATS","GOING","GOODS","GOOFY","GOOPY","GOOSE","GORED","GOUGE","GRABS","GRACE","GRADE","GRAIN","GRAND","GRANT","GRAPE","GRAPH","GRASP","GRASS","GRAVY","GRAZE","GREAT","GREED","GREEN","GREET","GRIEF","GRILL","GRIND","GRIPE","GRIPS","GROAN","GROOM","GROPE","GROSS","GROUP","GROVE","GROWL","GROWN","GROWS","GRUEL","GRUNT","GUARD","GUESS","GUEST","GUIDE","GUILD","GUILT","GULPS","GUMMY","GUSTS","GUTSY",
"HABIT","HACKS","HAIRY","HALLS","HALVE","HANDS","HANDY","HANGS","HAPPY","HARDY","HARSH","HATCH","HATED","HATER","HATES","HAUNT","HAVEN","HAVOC","HAZED","HEADS","HEARD","HEART","HEAVY","HEIST","HELPS","HENCE","HERBY","HIDES","HIKED","HIKER","HIKES","HILLS","HINDS","HINGE","HINTS","HIPPO","HIPPY","HIRED","HITCH","HOARD","HOBBY","HOCUS","HOLDS","HOLED","HOLES","HOLEY","HOMED","HONOR","HOODS","HOOTS","HOPES","HORDE","HORSE","HOSED","HOSES","HOSTS","HOUND","HOURS","HOVER","HOWDY","HUBBY","HUMAN","HUMID","HUMOR","HUMPH","HUMPS","HURRY","HURTS",
"ICIER","ICING","ICONS","IDEAL","IDEAS","IDIOT","IDLES","IDOLS","IGLOO","IMAGE","INBOX","INCUR","INDEX","INEPT","INKED","INLET","INNER","INPUT","INSET","INTEL","INTRO","IODIN","IONIC","IRATE","IRONS","IRONY","ISSUE","ITEMS","IVORY",
"JACKS","JADED","JADES","JAILS","JANKY","JAUNT","JEANS","JEERS","JELLY","JERKS","JERKY","JESTS","JEWEL","JIFFY","JIGGY","JINKS","JIVED","JIVES","JOINS","JOINT","JOKED","JOKER","JOKES","JOKEY","JOLLY","JOLTS","JOWLS","JUDGE","JUICE","JUICY","JUMBO","JUMPS","JUMPY","JUNKY","JUROR","JUVIE",
"KARAT","KARMA","KAYAK","KEBAB","KEELS","KEEPS","KEFIR","KEYED","KICKS","KIDDO","KIDDY","KINGS","KIOSK","KITED","KITES","KNACK","KNEEL","KNEES","KNELL","KNIFE","KNOBS","KNOCK","KNOWN","KNOWS","KNUBS","KOALA","KOOKS","KRAFT",
"LABEL","LABOR","LACED","LACES","LACKS","LAGER","LAIRY","LAKES","LAMBS","LAMPS","LANDS","LAPSE","LARGE","LASTS","LATER","LAUGH","LAWED","LAWNS","LAYER","LEACH","LEADY","LEAKS","LEAKY","LEAPS","LEARN","LEASE","LEASH","LEAST","LEAVE","LEDGE","LEECH","LEEKS","LEFT","LEGAL","LEGGY","LEGIT","LEMON","LEMUR","LENDS","LETCH","LETUP","LEVEL","LEVER","LEXIS","LIARS","LIBEL","LIBRA","LIFTS","LIGHT","LIKED","LIKES","LIMIT","LINED","LINEN","LINER","LINGO","LINGS","LINKS","LIONS","LISPS","LISTS","LIVED","LIVER","LIVES","LOADS","LOANS","LOATH","LOBBY","LOCAL","LOCKS","LODGE","LOFTS","LOGIC","LOGIN","LONER","LONGS","LOOKS","LOOMS","LOOPS","LOOSE","LORDS","LOSER","LOSES","LOSSY","LOTTO","LOTUS","LOUSY","LOVED","LOVER","LOVES","LOWER","LOYAL","LUCID","LUCKS","LUCKY","LUMPY","LUNCH","LUNGS","LURCH","LURED","LURKS","LYING","LYMPH","LYRIC",
"MACHO","MACRO","MADAM","MADLY","MAFIA","MAGIC","MAIDS","MAINS","MAJOR","MAKER","MALES","MANGO","MANIA","MANIC","MANLY","MAPLE","MARCH","MARKS","MARRY","MARSH","MASKS","MASON","MATES","MAULS","MAXIM","MAYBE","MAYOR","MEALS","MEANS","MEANT","MEATY","MEDAL","MELON","MELTS","MENDS","MERCH","MERCY","MERGE","MERIT","MERRY","MESSY","METAL","METER","METRO","MICRO","MIDST","MIGHT","MILES","MILKY","MIMIC","MINCE","MINDS","MINOR","MINTS","MINTY","MIRKY","MITES","MIXED","MIXER","MOCHA","MOCKS","MODAL","MODEL","MODEM","MODES","MOGUL","MOIST","MOMMY","MONTH","MOONS","MOOSE","MORAL","MOTEL","MOTOR","MOTTO","MOUND","MOUNT","MOURN","MOUSE","MOUTH","MOVED","MOVER","MOVES","MOVIE","MUCKY","MUCUS","MUDDY","MULTI","MUMMY","MUSIC","MUTED","MYTHS",
"NACHO","NAILS","NAIVE","NAKED","NAMED","NAMES","NANNY","NASAL","NASTY","NATAL","NAVEL","NEARS","NECKS","NEEDS","NEEDY","NERDS","NERDY","NERVE","NERVY","NESTS","NEVER","NEWLY","NICER","NICHE","NIECE","NIGHT","NINES","NINTH","NOBLE","NOBLY","NOISY","NOMAD","NORTH","NOSES","NOSEY","NOTED","NOTES","NOUNS","NUDGE","NUKED","NURSE","NUTTY","NYLON",
"OASIS","OBESE","OBEYS","OBJECT","OCEAN","ODDLY","OFFAL","OFFER","OFTEN","OILED","OLDER","OLIVE","OMEGA","OMENS","ONION","ONSET","OPENS","OPERA","OPIUM","ORGAN","OUGHT","OUNCE","OUSTS","OUTER","OVARY","OVENS","OVERT","OWING","OWNED","OWNER","OXIDE","OZONE",
"PACED","PACER","PACTS","PAGED","PAGER","PAGES","PAINS","PAINT","PAIRS","PALMS","PANDA","PANEL","PANIC","PANTS","PANTY","PAPER","PARSE","PARTS","PARTY","PASTA","PASTE","PASTY","PATCH","PATHS","PEACE","PEACH","PEARL","PECAN","PEDAL","PEELS","PEERS","PENNY","PERIL","PERKY","PESTO","PESTS","PETAL","PHOTO","PIANO","PIECE","PILED","PINCH","PITCH","PIVOT","PIZZA","PLACE","PLAIN","PLANE","PLANK","PLANS","PLANT","PLATE","PLAYS","PLUGS","PLUMP","PLUMS","POACH","POEMS","POETS","POKED","POKES","POOCH","PORES","POUND","POWER","PRANK","PRAYS","PRICE","PRIDE","PRINT","PRIOR","PRISM","PRIVY","PRIZE","PROBE","PROPS","PROUD","PRUDE","PUFFY","PULSE","PUMPS","PUNCH","PUPPY","PUREE","PURGE","PURSE","PUTTY","PYLON",
"QUADS","QUAKE","QUEEN","QUERY","QUEST","QUEUE","QUICK","QUIET","QUILL","QUILT","QUIRK","QUITE","QUITS","QUOTA","QUOTE",
"RABID","RACED","RACER","RACES","RACKS","RADAR","RADIO","RAGED","RAGES","RAILS","RAINS","RAINY","RAKED","RALLY","RAMEN","RAMPS","RANCH","RANGE","RAPID","RASPY","RATED","RATES","RATIO","RAVED","RAVEN","RAZER","RAZOR","REACT","READY","REALM","REAMS","REBEL","REBID","REBUY","RECAP","RECON","REHAB","REIGN","REINS","RELAY","RELIC","REMIT","REMIX","RENAL","RENEW","REPAY","REPLY","RESET","RESIN","RETRO","RETRY","REUSE","RHINO","RHYME","RIDES","RIDGE","RIFLE","RIFTS","RIGHT","RIGID","RINGS","RINSE","RIOTS","RIPEN","RISES","RISKS","RISKY","RITES","RIVER","ROADS","ROARS","ROAST","ROBOT","ROCKS","ROCKY","RODEO","ROGUE","ROLES","ROLLS","ROOTS","ROPED","ROPES","ROSES","ROUGH","ROUND","ROUSE","ROUTE","ROVER","ROYAL","RUBLE","RUGBY","RUINS","RULED","RULER","RULES","RUMOR","RUNNY","RURAL","RUSTY",
"SABER","SACKS","SADLY","SAFER","SAINT","SALAD","SALES","SALON","SALSA","SALTS","SALTY","SANDY","SATIN","SAUCE","SAUCY","SAUNA","SAVED","SAVER","SAVES","SAVOR","SCALD","SCALE","SCALP","SCAMS","SCARE","SCARF","SCARY","SCENE","SCENT","SCOFF","SCONE","SCOPE","SCORE","SCORN","SCOUR","SCRAM","SCRUB","SCUBA","SCUFF","SEATS","SECTS","SEEDS","SEEKS","SEEMS","SEIZE","SENDS","SENSE","SERVE","SETUP","SEVEN","SEVER","SEWER","SHACK","SHADE","SHAFT","SHAKE","SHALL","SHAME","SHAPE","SHARK","SHELF","SHELL","SHIFT","SHINE","SHINY","SHIPS","SHIRT","SHOCK","SHOOT","SHORE","SHOTS","SHOUT","SHRED","SHRUG","SIDED","SILKY","SILLY","SINCE","SINGS","SINKS","SINUS","SITED","SITES","SIXTH","SIXTY","SIZED","SIZES","SKATE","SKIES","SKILL","SLACK","SLANG","SLAVE","SLEEP","SLEET","SLEPT","SLICK","SLIDE","SLIME","SLING","SLOPE","SLOSH","SLOTH","SLUNG","SLURP","SLUSH","SMALL","SMART","SMASH","SMEAR","SMELL","SMELT","SMILE","SMOKE","SMOKY","SNACK","SNAIL","SNAKE","SNARE","SNOOP","SNORE","SNUFF","SOBER","SOCKS","SOFTY","SOLVE","SOUND","SPACE","SPADE","SPARE","SPARK","SPEAK","SPEAR","SPEED","SPEEL","SPICY","SPIED","SPIES","SPIKY","SPILL","SPINE","SPITE","SPLIT","SPOIL","SPOKE","SPOOF","SPOON","SPORT","SPOTS","SPOUT","SQUAD","SQUID","STACK","STAFF","STAGE","STAIR","STALK","STAMP","STARE","STARS","START","STASH","STATE","STEAK","STEAL","STEAM","STEEL","STEEP","STEPS","STICH","STICK","STIFF","STING","STINK","STINT","STOCK","STOKE","STOMP","STONE","STOOD","STOOL","STOOP","STORE","STORM","STORY","STOVE","STRAW","STRAY","STUBS","STUCK","STUFF","STUNT","STYLE","SUGAR","SUITE","SUNNY","SUPER","SUSHI","SWEAT","SWEET","SWELL","SWEPT","SWIFT","SWING","SWIPE","SWISH","SWORD","SWORN","SYRUP",
"TABLE","TABOO","TAKEN","TAKER","TAKES","TALES","TALK","TALON","TANGO","TARDY","TASTE","TASTY","TAXED","TAXES","TEACH","TEASE","TEETH","TENET","TENTH","THANK","THEFT","THEIR","THEME","THERE","THESE","THICK","THIEF","THIGH","THING","THINK","THORN","THOSE","THREE","THREW","THROW","THUGS","THUMB","TIBIA","TIGER","TIGHT","TIMER","TINGE","TIPSY","TIRED","TIRES","TITAN","TITER","TITLE","TOAST","TOKEN","TONIC","TOOTH","TOPIC","TORCH","TORSO","TOTAL","TOUCH","TOUGH","TOWEL","TOWER","TOXIC","TRACE","TRACT","TRADE","TRAIN","TRAIT","TRAMP","TRASH","TREAD","TREND","TRIAL","TRICK","TRIED","TRUCE","TRUCK","TRULY","TRUNK","TRUTH","TULIP","TUMMY","TUNED","TUNER","TURBO","TWEAK","TWEED","TWICE","TWIRL","TWIST","TYPED",
"ULCER","ULTRA","UNCLE","UNDER","UNDUE","UNFIT","UNIFY","UNION","UNITE","UNITY","UNTIE","UNTIL","UNZIP","UPEND","UPPER","UPSET","URBAN","URINE","USAGE","USING","USURP",
"VAGUE","VALET","VALID","VALUE","VALVE","VAPOR","VAULT","VEGAN","VENOM","VENUE","VERGE","VERVE","VIDEO","VILLA","VINYL","VIOLA","VIPER","VIRAL","VISIT","VITAL","VIVID","VOCAL","VOICE","VOMIT","VOUCH",
"WACKY","WADED","WAGER","WAGES","WAGON","WAIST","WALKS","WALLS","WANTS","WARNS","WARTY","WASHY","WASTE","WATCH","WATER","WAVED","WAVEY","WAXED","WEARY","WEEKS","WEIGH","WEIRD","WENCH","WHACK","WHALE","WHEAT","WHEEL","WHERE","WHICH","WHILE","WHISK","WHITE","WHOLE","WHOOF","WHOSE","WIDEN","WIDER","WIDOW","WIDTH","WIELD","WIMPY","WINCE","WINCH","WINDY","WINED","WIPED","WIPER","WIPES","WISPY","WITCH","WITTY","WIVES","WOKEN","WOMAN","WOMEN","WONKY","WOOZY","WORDY","WORLD","WORST","WOULD","WOUND","WREAK","WRECK","WRING","WRIST","WRITE","WRONG","WROTE",
"XEBEC","XERIC","XENIA","XENON","XIANS",
"YACHT","YAHOO","YAPPY","YARNS","YEARN","YEARS","YEAST","YIELD","YIKES","YOUNG","YOURS","YUCKY","YUMMY","YUPPY","YURTS",
"ZEBRA","ZEROS","ZESTY","ZILCH","ZINGY","ZIPPY","ZONES","ZONKS","ZOOMS",
            "AARGH", "ABBEY", "ABBOT", "ABIDE", "ABODE",
            "ABORT", "ABOUT", "ABOVE", "ABUSE", "ABYSS",
            "ACHES", "ACRES", "ACTED", "ACTOR", "ACUTE",
            "ADAPT", "ADDED", "ADIEU", "ADIOS", "ADMIT",
            "ADOPT", "ADORE", "ADULT", "AFTER", "AGAIN",
            "AGENT", "AGING", "AGONY", "AGREE", "AHEAD",
            "AHOLD", "AIMED", "AISLE", "ALARM", "ALBUM",
            "ALERT", "ALGAE", "ALIAS", "ALIBI", "ALIEN",
            "ALIKE", "ALIVE", "ALLEY", "ALLOW", "ALOHA",
            "ALONE", "ALONG", "ALOUD", "ALPHA", "ALTAR",
            "ALTER", "AMAZE", "AMBER", "AMIGO", "AMONG",
            "AMPLE", "AMUSE", "ANGEL", "ANGER", "ANGLE",
            "ANGRY", "ANKLE", "ANNOY", "AORTA", "APART",
            "APPLE", "APPLY", "APRON", "AREAS", "ARENA",
            "ARGUE", "ARIEL", "ARISE", "ARMED", "ARMOR",
            "AROMA", "AROSE", "ARRAY", "ARROW", "ARSON",
            "ASHES", "ASIDE", "ASKED", "ASPEN", "ASSES",
            "ASSET", "ATLAS", "ATOMS", "ATONE", "ATTIC",
            "AUDIO", "AUDIT", "AUNTS", "AUNTY", "AVAIL",
            "AVOID", "AWAIT", "AWAKE", "AWARD", "AWARE",
            "AWFUL", "AWOKE", "BABES", "BACKS", "BACON",
            "BADGE", "BADLY", "BAGEL", "BAKED", "BAKER",
            "BALDY", "BALLS", "BAMBI", "BANDS", "BANGS",
            "BANJO", "BANKS", "BARGE", "BARKS", "BARON",
            "BARRY", "BASED", "BASES", "BASIC", "BASIL",
            "BASIN", "BASIS", "BATCH", "BATES", "BATHE",
            "BATHS", "BATON", "BEACH", "BEADS", "BEAMS",
            "BEANS", "BEARD", "BEARS", "BEAST", "BEATS",
            "BEEPS", "BEERS", "BEETS", "BEGAN", "BEGIN",
            "BEGUN", "BEIGE", "BEING", "BELLE", "BELLS",
            "BELLY", "BELOW", "BELTS", "BENCH", "BENDS",
            "BENNY", "BERRY", "BETTY", "BIBLE", "BIGGS",
            "BIKER", "BIKES", "BILLS", "BILLY", "BIMBO",
            "BINGO", "BIRCH", "BIRDS", "BIRTH", "BISON",
            "BITCH", "BITES", "BLACK", "BLADE", "BLAME",
            "BLAND", "BLANK", "BLAST", "BLAZE", "BLEAK",
            "BLEED", "BLEEP", "BLEND", "BLESS", "BLIND",
            "BLING", "BLINK", "BLISS", "BLITZ", "BLOCK",
            "BLOKE", "BLOND", "BLOOD", "BLOOM", "BLOWN",
            "BLOWS", "BLUES", "BLUFF", "BLUNT", "BLUSH",
            "BOARD", "BOAST", "BOATS", "BOBBY", "BOGUS",
            "BOILS", "BOLTS", "BOMBS", "BONDS", "BONER",
            "BONES", "BONNY", "BONUS", "BOOBS", "BOOBY",
            "BOOKS", "BOOST", "BOOTH", "BOOTS", "BOOTY",
            "BOOZE", "BORED", "BORNE", "BOSOM", "BOSSY",
            "BOUND", "BOWEL", "BOWIE", "BOWLS", "BOXED",
            "BOXER", "BOXES", "BRACE", "BRAID", "BRAIN",
            "BRAKE", "BRAND", "BRASS", "BRATS", "BRAVE",
            "BRAVO", "BRAWL", "BREAD", "BREAK", "BREED",
            "BRENT", "BRIBE", "BRICK", "BRIDE", "BRIEF",
            "BRING", "BRINK", "BRITS", "BRITT", "BROAD",
            "BROCK", "BROKE", "BROOD", "BROOK", "BROOM",
            "BROTH", "BROWN", "BRUSH", "BRUTE", "BUBBA",
            "BUCKS", "BUDDY", "BUDGE", "BUFFY", "BUGGY",
            "BUGLE", "BUILD", "BUILT", "BULBS", "BULLS",
            "BULLY", "BUMPS", "BUMPY", "BUNCH", "BUNDY",
            "BUNNY", "BURKE", "BURNS", "BURNT", "BURPS",
            "BURST", "BUSES", "BUTCH", "BUTTS", "BUYER",
            "CABIN", "CABLE", "CADDY", "CADET", "CAGED",
            "CAGES", "CAKES", "CALLS", "CALMS", "CAMEL",
            "CAMPS", "CANAL", "CANDY", "CANOE", "CANON",
            "CAPRI", "CARDS", "CARED", "CARES", "CARGO",
            "CAROL", "CARRY", "CARTS", "CARVE", "CASES",
            "CASTE", "CASTS", "CATCH", "CAUSE", "CAVES",
            "CEASE", "CEDAR", "CELLO", "CELLS", "CENTS",
            "CHAIN", "CHAIR", "CHALK", "CHAMP", "CHANG",
            "CHANT", "CHAOS", "CHAPS", "CHARM", "CHART",
            "CHASE", "CHEAP", "CHEAT", "CHECK", "CHEEK",
            "CHEER", "CHEFS", "CHEMO", "CHESS", "CHEST",
            "CHEVY", "CHICK", "CHICO", "CHIEF", "CHILD",
            "CHILE", "CHILI", "CHILL", "CHIME", "CHIMP",
            "CHINA", "CHING", "CHINO", "CHIPS", "CHIRP",
            "CHOIR", "CHOKE", "CHOPS", "CHORD", "CHOSE",
            "CHUCK", "CHUMP", "CHUNK", "CHUTE", "CIDER",
            "CIGAR", "CINCH", "CISCO", "CIVIC", "CIVIL",
            "CLAIM", "CLAMP", "CLAMS", "CLANG", "CLANK",
            "CLANS", "CLAPS", "CLARY", "CLASH", "CLASS",
            "CLAWS", "CLEAN", "CLEAR", "CLERK", "CLICK",
            "CLIFF", "CLIMB", "CLING", "CLINK", "CLINT",
            "CLIPS", "CLOAK", "CLOCK", "CLONE", "CLOSE",
            "CLOTH", "CLOUD", "CLOWN", "CLUBS", "CLUES",
            "COACH", "COAST", "COATS", "COBRA", "COCKS",
            "COCKY", "COCOA", "CODED", "CODES", "COHEN",
            "COINS", "COLBY", "COLIN", "COLON", "COLOR",
            "COMBO", "COMES", "COMET", "COMFY", "COMIC",
            "COMMA", "COMMS", "CONDO", "CONES", "CONEY",
            "CONGO", "COOKS", "CORAL", "CORDS", "COREY",
            "CORKY", "CORNY", "CORPS", "COSTA", "COSTS",
            "COUCH", "COUGH", "COULD", "COUNT", "COURT",
            "COVEN", "COVER", "CRABS", "CRACK", "CRAFT",
            "CRAIG", "CRAMP", "CRANE", "CRANK", "CRAPS",
            "CRASH", "CRATE", "CRAVE", "CRAWL", "CRAZY",
            "CREAK", "CREAM", "CREED", "CREEK", "CREEP",
            "CREST", "CREWS", "CRIED", "CRIES", "CRIME",
            "CRISP", "CROAK", "CROCK", "CROFT", "CROOK",
            "CROPS", "CRORE", "CROSS", "CROWD", "CROWN",
            "CROWS", "CRUDE", "CRUEL", "CRUMB", "CRUSH",
            "CRUST", "CRYPT", "CUBES", "CUBIC", "CUFFS",
            "CUNTS", "CUPID", "CURED", "CURES", "CURLS",
            "CURLY", "CURRY", "CURSE", "CURVE", "CUTER",
            "CUTIE", "CYBER", "CYCLE", "DADDY", "DAFFY",
            "DAILY", "DAIRY", "DAISY", "DAMES", "DANCE",
            "DANDY", "DANNY", "DARCY", "DARED", "DARES",
            "DARTS", "DATED", "DATES", "DEALS", "DEALT",
            "DEARS", "DEATH", "DEBTS", "DEBUT", "DECAF",
            "DECAY", "DECKS", "DECOR", "DECOY", "DEEDS",
            "DEITY", "DELAY", "DELTA", "DEMON", "DENIS",
            "DENSE", "DEPOT", "DEPTH", "DERBY", "DESKS",
            "DEUCE", "DEVIL", "DEVON", "DIALS", "DIANE",
            "DIARY", "DICKS", "DICKY", "DILDO", "DINER",
            "DINGO", "DINGS", "DIRTY", "DISCO", "DITCH",
            "DITTO", "DIVER", "DIXIE", "DIZZY", "DOCKS",
            "DODGE", "DODGY", "DOGGY", "DOING", "DOLLS",
            "DOLLY", "DONNA", "DONNY", "DONOR", "DONUT",
            "DOORS", "DORIS", "DOSES", "DOUBT", "DOUGH",
            "DOVER", "DOVES", "DOWNS", "DOWRY", "DOZEN",
            "DRAFT", "DRAGS", "DRAIN", "DRAKE", "DRAMA",
            "DRANK", "DRAWN", "DRAWS", "DREAD", "DREAM",
            "DRESS", "DRIED", "DRIES", "DRIFT", "DRILL",
            "DRINK", "DRIVE", "DROID", "DRONE", "DROOL",
            "DROPS", "DROVE", "DROWN", "DRUGS", "DRUMS",
            "DRUNK", "DRYER", "DUCKS", "DUCKY", "DUDES",
            "DUKES", "DUMMY", "DUMPS", "DUNES", "DUNNO",
            "DUSTY", "DUTCH", "DWARF", "DWELL", "DYING",
            "EAGER", "EAGLE", "EARLY", "EARNS", "EARTH",
            "EATEN", "EATER", "EDGES", "EERIE", "EIGHT",
            "ELBOW", "ELDER", "ELECT", "ELITE", "ELOPE",
            "ELVES", "EMAIL", "EMERY", "EMMET", "EMPTY",
            "ENDED", "ENEMY", "ENJOY", "ENTER", "ENTRY",
            "ENVOY", "EQUAL", "ERASE", "ERECT", "ERICA",
            "ERROR", "ESSAY", "ETHER", "EUROS", "EVADE",
            "EVENT", "EVERY", "EVILS", "EXACT", "EXAMS",
            "EXILE", "EXIST", "EXITS", "EXPEL", "EXTRA",
            "FACED", "FACES", "FACTS", "FADED", "FADES",
            "FAILS", "FAINT", "FAIRY", "FAITH", "FAKED",
            "FAKES", "FALLS", "FALSE", "FANCY", "FANGS",
            "FANNY", "FARCE", "FARMS", "FARTS", "FATAL",
            "FATES", "FATSO", "FATTY", "FAULT", "FAVOR",
            "FEARS", "FEAST", "FECES", "FEEDS", "FEELS",
            "FELLA", "FELON", "FENCE", "FERRY", "FETCH",
            "FETUS", "FEVER", "FEWER", "FIBER", "FIELD",
            "FIEND", "FIERY", "FIFTH", "FIFTY", "FIGHT",
            "FILED", "FILES", "FILET", "FILLS", "FILMS",
            "FILTH", "FINAL", "FINCH", "FINDS", "FINER",
            "FINES", "FIRED", "FIRES", "FIRMS", "FIRST",
            "FISHY", "FISTS", "FITCH", "FIVER", "FIVES",
            "FIXED", "FIXES", "FLACK", "FLAGS", "FLAIR",
            "FLAKE", "FLAME", "FLANK", "FLAPS", "FLARE",
            "FLASH", "FLASK", "FLATS", "FLAWS", "FLEAS",
            "FLEET", "FLESH", "FLEUR", "FLICK", "FLIES",
            "FLING", "FLINT", "FLIPS", "FLIRT", "FLOAT",
            "FLOCK", "FLOOD", "FLOOR", "FLORA", "FLOSS",
            "FLOUR", "FLOWN", "FLOWS", "FLUFF", "FLUID",
            "FLUKE", "FLUSH", "FLUTE", "FLYER", "FOCUS",
            "FOGGY", "FOLDS", "FOLEY", "FOLKS", "FOLLY",
            "FOODS", "FOOLS", "FORCE", "FORGE", "FORKS",
            "FORMS", "FORTH", "FORTY", "FORUM", "FOUND",
            "FOURS", "FOXES", "FOYLE", "FRAIL", "FRAME",
            "FRANK", "FRAUD", "FREAK", "FREED", "FRESH",
            "FRIAR", "FRIED", "FRIES", "FRITZ", "FROGS",
            "FRONT", "FROST", "FROWN", "FROZE", "FRUIT",
            "FUCKS", "FUDGE", "FULLY", "FUMES", "FUNDS",
            "FUNKY", "FUNNY", "FURRY", "FUSED", "FUSES",
            "FUSSY", "FUZZY", "GABBY", "GAINS", "GAMES",
            "GAMMA", "GANGS", "GARTH", "GASES", "GASPS",
            "GATES", "GATOR", "GAUGE", "GAUZE", "GAVEL",
            "GEARS", "GEEKS", "GEESE", "GEMMA", "GENES",
            "GENIE", "GENRE", "GENTS", "GERMS", "GHOST",
            "GIANT", "GIDDY", "GIFTS", "GIMME", "GINNY",
            "GIRLS", "GIRLY", "GIVEN", "GIVES", "GLAND",
            "GLARE", "GLASS", "GLIDE", "GLOAT", "GLOBE",
            "GLOOM", "GLORY", "GLOSS", "GLOVE", "GLUED",
            "GNOME", "GOALS", "GOATS", "GOING", "GOLLY",
            "GONER", "GONNA", "GOODS", "GOODY", "GOOFY",
            "GOONS", "GOOSE", "GORGE", "GOTTA", "GOWNS",
            "GRABS", "GRACE", "GRADE", "GRAFT", "GRAIL",
            "GRAIN", "GRAMS", "GRAND", "GRANT", "GRAPE",
            "GRASP", "GRASS", "GRAVE", "GRAVY", "GRAZE",
            "GREAT", "GREED", "GREEK", "GREEN", "GREET",
            "GRIEF", "GRIFF", "GRILL", "GRIND", "GRIPS",
            "GROAN", "GROIN", "GROOM", "GROSS", "GROUP",
            "GROVE", "GROWL", "GROWN", "GROWS", "GRUNT",
            "GUARD", "GUESS", "GUEST", "GUIDE", "GUILD",
            "GUILT", "GUISE", "GULPS", "GUNNY", "GYPSY",
            "HABIT", "HADES", "HAIRS", "HAIRY", "HALLO",
            "HALLS", "HANDS", "HANDY", "HANGS", "HAPPY",
            "HARDY", "HAREM", "HARRY", "HARSH", "HASTE",
            "HASTY", "HATCH", "HATED", "HATES", "HAUNT",
            "HAVEN", "HAVOC", "HAWKS", "HAZEL", "HEADS",
            "HEALS", "HEAPS", "HEARD", "HEARS", "HEART",
            "HEATH", "HEAVE", "HEAVY", "HEDGE", "HEELS",
            "HEFTY", "HEIRS", "HEIST", "HELLO", "HELPS",
            "HENCE", "HENRY", "HERBS", "HERDS", "HICKS",
            "HIDES", "HILLS", "HINTS", "HIPPO", "HIRED",
            "HIRES", "HITCH", "HIVES", "HOBBY", "HOGAN",
            "HOIST", "HOLDS", "HOLED", "HOLES", "HOLLY",
            "HOMER", "HOMES", "HOMEY", "HOMIE", "HONDA",
            "HONEY", "HONKS", "HONOR", "HOODS", "HOOKS",
            "HOOPS", "HOPED", "HOPES", "HORDE", "HORNS",
            "HORNY", "HORSE", "HOSTS", "HOTCH", "HOTEL",
            "HOUND", "HOURS", "HOUSE", "HOVER", "HOWDY",
            "HOWLS", "HUBBY", "HUMAN", "HUMOR", "HUNCH",
            "HUNTS", "HURRY", "HURTS", "HUTCH", "HYDRA",
            "HYENA", "ICING", "IDEAL", "IDEAS", "IDIOT",
            "IDOLS", "IMAGE", "IMPLY", "INDEX", "INDIA",
            "INNER", "INNIT", "INPUT", "INTEL", "INTRO",
            "IRONS", "IRONY", "ISLES", "ISSUE", "ITCHY",
            "ITEMS", "IVORY", "JACKS", "JACKY", "JAFFA",
            "JAMES", "JAPAN", "JAZZY", "JEANS", "JELLY",
            "JENNY", "JERKS", "JERKY", "JERRY", "JESSE",
            "JESUS", "JEWEL", "JIFFY", "JIHAD", "JIMMY",
            "JOHNS", "JOINS", "JOINT", "JOKER", "JOKES",
            "JOLLY", "JONES", "JUDAS", "JUDGE", "JUICE",
            "JUICY", "JUMBO", "JUMPS", "JUMPY", "JUROR",
            "JUVIE", "KAPPA", "KARMA", "KEBAB", "KEEPS",
            "KELLY", "KERRY", "KICKS", "KIDDO", "KILLS",
            "KILOS", "KINDA", "KINDS", "KINGS", "KINKY",
            "KIRBY", "KITTY", "KNACK", "KNEEL", "KNEES",
            "KNIFE", "KNOCK", "KNOTS", "KNOWN", "KNOWS",
            "KRANG", "KRAUT", "KYLIE", "LABEL", "LABOR",
            "LACEY", "LACKS", "LADEN", "LAGER", "LAIRD",
            "LAKES", "LAKHS", "LAMBS", "LAMPS", "LANCE",
            "LANDS", "LANES", "LAPSE", "LARGE", "LASER",
            "LASTS", "LATCH", "LATER", "LATEX", "LATTE",
            "LAUGH", "LAURA", "LAYER", "LEADS", "LEAKS",
            "LEAPS", "LEARN", "LEASE", "LEASH", "LEAST",
            "LEAVE", "LEDGE", "LEECH", "LEFTY", "LEGAL",
            "LEGIT", "LEMME", "LEMON", "LEONE", "LEVEL",
            "LEVER", "LEWIS", "LIANG", "LIARS", "LIEGE",
            "LIFTS", "LIGHT", "LIKED", "LIKES", "LIMBO",
            "LIMBS", "LIMIT", "LINED", "LINEN", "LINER",
            "LINES", "LINKS", "LIONS", "LIRAS", "LISTS",
            "LITER", "LIVED", "LIVER", "LIVES", "LOADS",
            "LOANS", "LOBBY", "LOCAL", "LOCKS", "LODGE",
            "LOGAN", "LOGIC", "LONER", "LOOKS", "LOOKY",
            "LOONY", "LOOPS", "LOOSE", "LORDS", "LORRY",
            "LOSER", "LOSES", "LOTTA", "LOTTE", "LOTTO",
            "LOTUS", "LOUIE", "LOUIS", "LOUSE", "LOUSY",
            "LOVED", "LOVER", "LOVES", "LOWER", "LOWLY",
            "LOYAL", "LUCID", "LUCKY", "LUMPS", "LUMPY",
            "LUNAR", "LUNCH", "LUNGS", "LUPIN", "LURCH",
            "LURED", "LYING", "LYNCH", "LYRIC", "MACHO",
            "MADAM", "MADGE", "MADLY", "MAFIA", "MAGIC",
            "MAGMA", "MAIDS", "MAJOR", "MAKER", "MAKES",
            "MALES", "MALIK", "MAMBO", "MAMMA", "MAMMY",
            "MANGO", "MANIC", "MANLY", "MANOR", "MAPLE",
            "MARCH", "MARGE", "MARIA", "MARKS", "MARRY",
            "MARSH", "MASKS", "MASON", "MASSA", "MATCH",
            "MATER", "MATES", "MATHS", "MAVIS", "MAXIM",
            "MAYAN", "MAYBE", "MAYOR", "MEALS", "MEANS",
            "MEANT", "MECCA", "MEDAL", "MEDIA", "MEDIC",
            "MEETS", "MELON", "MELTS", "MENUS", "MEOWS",
            "MERCY", "MERGE", "MERIT", "MERLE", "MERRY",
            "MESSY", "METAL", "METER", "METRE", "METRO",
            "MICKY", "MIDST", "MIGHT", "MILES", "MILKY",
            "MILLS", "MIMIC", "MINDS", "MINER", "MINES",
            "MINOR", "MINTS", "MINUS", "MISSY", "MISTY",
            "MITCH", "MIXED", "MIXER", "MOANS", "MODEL",
            "MOIRA", "MOIST", "MOLLY", "MOMMA", "MOMMY",
            "MONDO", "MONEY", "MONKS", "MONTE", "MONTH",
            "MONTY", "MOODS", "MOODY", "MOONS", "MOOSE",
            "MOPED", "MORAL", "MORON", "MORSE", "MOSES",
            "MOTEL", "MOTHS", "MOTOR", "MOTTO", "MOULD",
            "MOUND", "MOUNT", "MOURN", "MOUSE", "MOUTH",
            "MOVED", "MOVES", "MOVIE", "MOWER", "MUDDY",
            "MULES", "MUMMY", "MUNCH", "MUSHY", "MUSIC",
            "MYTHS", "NACHO", "NAILS", "NAIVE", "NAKED",
            "NAMED", "NAMES", "NANCY", "NANDU", "NANNY",
            "NASAL", "NASTY", "NAVAL", "NAZIS", "NECKS",
            "NEEDS", "NEEDY", "NEGRO", "NELLY", "NERDS",
            "NERVE", "NESTS", "NEVER", "NEWLY", "NICER",
            "NIECE", "NIGHT", "NINJA", "NINTH", "NOBLE",
            "NOISE", "NOISY", "NOOSE", "NORMA", "NORTH",
            "NOSES", "NOTCH", "NOTED", "NOTES", "NOVEL",
            "NUDGE", "NURSE", "NUTTY", "NYLON", "OASIS",
            "OCCUR", "OCEAN", "ODDLY", "OFFER", "OFTEN",
            "OLDER", "OLIVE", "OLLIE", "OMEGA", "ONION",
            "OPENS", "OPERA", "OPIUM", "ORBIT", "ORDER",
            "ORGAN", "OSCAR", "OTHER", "OTTER", "OUGHT",
            "OUNCE", "OUTER", "OUTTA", "OWING", "OWNED",
            "OWNER", "OZONE", "PACES", "PACEY", "PACKS",
            "PADDY", "PADRE", "PAGAN", "PAGED", "PAGER",
            "PAGES", "PAINS", "PAINT", "PAIRS", "PALMS",
            "PANDA", "PANEL", "PANIC", "PANTS", "PAOLO",
            "PAPAL", "PAPER", "PAPPY", "PARIS", "PARKS",
            "PARTS", "PARTY", "PASHA", "PASTA", "PASTE",
            "PATCH", "PATHS", "PATIO", "PATSY", "PATTY",
            "PAUSE", "PAVED", "PEACE", "PEACH", "PEAKS",
            "PEARL", "PEARS", "PEDAL", "PEDRO", "PEERS",
            "PEGGY", "PENAL", "PENCE", "PENIS", "PENNY",
            "PEPSI", "PERCH", "PERIL", "PERKS", "PERKY",
            "PERRY", "PESOS", "PETER", "PETIT", "PETTY",
            "PHASE", "PHONE", "PHONY", "PHOTO", "PIANO",
            "PICKS", "PICKY", "PIECE", "PIGGY", "PILAR",
            "PILED", "PILES", "PILLS", "PILOT", "PIMPS",
            "PINCH", "PINES", "PINKY", "PINTS", "PIOUS",
            "PIPER", "PIPES", "PITCH", "PIZZA", "PLACE",
            "PLAIN", "PLANE", "PLANK", "PLANS", "PLANT",
            "PLATE", "PLAYS", "PLAZA", "PLEAD", "PLOTS",
            "PLUCK", "PLUGS", "PLUMP", "PLUTO", "POEMS",
            "POETS", "POINT", "POKED", "POKER", "POLAR",
            "POLES", "POLKA", "POLLS", "POLLY", "POOCH",
            "POOJA", "POOLS", "POPPY", "PORCH", "PORKY",
            "PORNO", "PORTS", "POSED", "POSES", "POSSE",
            "POSTS", "POTTY", "POUCH", "POUND", "POURS",
            "POWER", "PRANK", "PRATT", "PRESS", "PRICE",
            "PRICK", "PRIDE", "PRIMA", "PRIME", "PRIMO",
            "PRINT", "PRIOR", "PRIVY", "PRIZE", "PROBE",
            "PRONE", "PROOF", "PROPS", "PROUD", "PROVE",
            "PROXY", "PRUNE", "PSYCH", "PUBIC", "PUFFS",
            "PUFFY", "PUKED", "PULLS", "PULSE", "PUMPS",
            "PUNCH", "PUNKS", "PUPIL", "PUPPY", "PURGE",
            "PURSE", "PUSHY", "PUSSY", "QUACK", "QUAIL",
            "QUAKE", "QUARK", "QUEEN", "QUEER", "QUEST",
            "QUEUE", "QUICK", "QUIET", "QUILL", "QUILT",
            "QUITE", "QUITS", "QUOTA", "QUOTE", "RABBI",
            "RABID", "RACED", "RACER", "RACES", "RADAR",
            "RADIO", "RAIDS", "RAILS", "RAINS", "RAINY",
            "RAISE", "RALLY", "RALPH", "RAMEN", "RANCH",
            "RANDY", "RANGE", "RANKS", "RAPED", "RAPES",
            "RAPID", "RATED", "RATES", "RATIO", "RAVEN",
            "RAZOR", "REACH", "REACT", "READS", "READY",
            "REALM", "REBEL", "RECON", "REDDY", "REEKS",
            "REFER", "REGAL", "REHAB", "REIGN", "REINS",
            "RELAX", "RELAY", "RELIC", "RENEW", "RENTS",
            "REPAY", "REPLY", "RESET", "RESTS", "RETRO",
            "RHINO", "RHYME", "RIDER", "RIDES", "RIDGE",
            "RIFLE", "RIGGS", "RIGHT", "RIGID", "RIGOR",
            "RILEY", "RINGS", "RINSE", "RIOTS", "RISEN",
            "RISES", "RISKS", "RISKY", "RITES", "RIVAL",
            "RIVER", "ROACH", "ROADS", "ROARS", "ROAST",
            "ROBES", "ROBIN", "ROBOT", "ROCKS", "ROCKY",
            "RODEO", "ROGER", "ROGUE", "ROLES", "ROLLS",
            "ROMAN", "ROMEO", "ROOFS", "ROOMS", "ROOTS",
            "ROPER", "ROPES", "ROSES", "ROUGE", "ROUGH",
            "ROUND", "ROUTE", "ROVER", "ROWAN", "ROWDY",
            "ROYAL", "RUDDY", "RUGBY", "RUINS", "RULED",
            "RULER", "RULES", "RUMOR", "RURAL", "RUSTY",
            "SABER", "SACKS", "SADLY", "SAFER", "SAHIB",
            "SAILS", "SAINT", "SAKES", "SALAD", "SALES",
            "SALLY", "SALON", "SALSA", "SALTS", "SALTY",
            "SAMBA", "SAMMY", "SANDS", "SANDY", "SANTO",
            "SARGE", "SASSY", "SATIN", "SAUCE", "SAUNA",
            "SAVED", "SAVES", "SAVVY", "SCALE", "SCALP",
            "SCANS", "SCARE", "SCARF", "SCARS", "SCARY",
            "SCENE", "SCENT", "SCOLD", "SCOOP", "SCOOT",
            "SCOPE", "SCORE", "SCORN", "SCOTS", "SCOUT",
            "SCRAM", "SCRAP", "SCREW", "SCRUB", "SCUBA",
            "SEALS", "SEAMS", "SEARS", "SEATS", "SEDAN",
            "SEEDS", "SEEKS", "SEEMS", "SEIZE", "SELLS",
            "SEMEN", "SENDS", "SENOR", "SENSE", "SERGE",
            "SERUM", "SERVE", "SETUP", "SEVEN", "SEVER",
            "SEWED", "SEWER", "SHACK", "SHADE", "SHADY",
            "SHAFT", "SHAKE", "SHAKY", "SHALL", "SHALT",
            "SHAME", "SHAPE", "SHARE", "SHARK", "SHARP",
            "SHAVE", "SHAWL", "SHAWN", "SHEEP", "SHEER",
            "SHEET", "SHEIK", "SHELF", "SHELL", "SHIFT",
            "SHINE", "SHINY", "SHIPS", "SHIRT", "SHITE",
            "SHITS", "SHIVA", "SHOCK", "SHOES", "SHONE",
            "SHOOK", "SHOOT", "SHOPS", "SHORE", "SHORT",
            "SHOTS", "SHOUT", "SHOVE", "SHOWN", "SHOWS",
            "SHRED", "SHUSH", "SHUTS", "SIDES", "SIEGE",
            "SIGHS", "SIGHT", "SIGNS", "SILLY", "SILVA",
            "SINCE", "SINGS", "SINKS", "SINUS", "SIREN",
            "SISSY", "SITES", "SIXTH", "SIXTY", "SIZES",
            "SKANK", "SKATE", "SKIES", "SKILL", "SKINS",
            "SKIPS", "SKIRT", "SKULL", "SKUNK", "SLACK",
            "SLADE", "SLAIN", "SLAMS", "SLANG", "SLAPS",
            "SLASH", "SLATE", "SLAVE", "SLEEP", "SLEET",
            "SLEPT", "SLICE", "SLICK", "SLIDE", "SLIME",
            "SLIMY", "SLING", "SLIPS", "SLOAN", "SLOPE",
            "SLOWS", "SLUGS", "SLUMS", "SLUTS", "SMACK",
            "SMALL", "SMART", "SMASH", "SMEAR", "SMELL",
            "SMELT", "SMILE", "SMITH", "SMOKE", "SMOKY",
            "SNACK", "SNAIL", "SNAKE", "SNAPS", "SNEAK",
            "SNIFF", "SNOOP", "SNORE", "SNORT", "SNOUT",
            "SNOWY", "SNUCK", "SNUFF", "SOBER", "SOCKS",
            "SOGGY", "SOLAR", "SOLES", "SOLID", "SOLVE",
            "SONAR", "SONGS", "SONIC", "SONNY", "SORRY",
            "SORTA", "SORTS", "SOULS", "SOUND", "SOUTH",
            "SPACE", "SPADE", "SPAIN", "SPANK", "SPARE",
            "SPARK", "SPAWN", "SPEAK", "SPEAR", "SPECK",
            "SPECS", "SPEED", "SPELL", "SPEND", "SPENT",
            "SPERM", "SPICE", "SPICY", "SPIED", "SPIES",
            "SPIKE", "SPILL", "SPINE", "SPINS", "SPITE",
            "SPITS", "SPLIT", "SPOIL", "SPOKE", "SPOOK",
            "SPOON", "SPORT", "SPOTS", "SPRAY", "SPREE",
            "SPURS", "SQUAD", "SQUAT", "SQUID", "STACK",
            "STAFF", "STAGE", "STAIN", "STAKE", "STALE",
            "STALK", "STALL", "STAMP", "STAND", "STARE",
            "STARK", "STARR", "STARS", "START", "STASH",
            "STATE", "STATS", "STAYS", "STEAK", "STEAL",
            "STEAM", "STEED", "STEEL", "STEEP", "STEER",
            "STEIN", "STEMS", "STEPS", "STERN", "STICK",
            "STIFF", "STILL", "STING", "STINK", "STOCK",
            "STOLE", "STOMP", "STONE", "STOOD", "STOOL",
            "STOOP", "STOPS", "STORE", "STORK", "STORM",
            "STORY", "STOUT", "STOVE", "STRAP", "STRAW",
            "STRAY", "STRIP", "STRUT", "STUCK", "STUDY",
            "STUFF", "STUMP", "STUNG", "STUNT", "STYLE",
            "SUCKS", "SUGAR", "SUING", "SUITE", "SUITS",
            "SULLY", "SUNNY", "SUPER", "SURGE", "SUSHI",
            "SWAIN", "SWAMI", "SWAMP", "SWANS", "SWARM",
            "SWEAR", "SWEAT", "SWEDE", "SWEEP", "SWEET",
            "SWELL", "SWEPT", "SWIFT", "SWINE", "SWING",
            "SWIPE", "SWISS", "SWOOP", "SWORD", "SWORE",
            "SWORN", "SWUNG", "SYBIL", "SYKES", "SYRUP",
            "TABLE", "TABOO", "TACKY", "TACOS", "TAELS",
            "TAILS", "TAKEN", "TAKES", "TAKIN", "TALES",
            "TALKS", "TALLY", "TAMMY", "TANGO", "TANKS",
            "TAPED", "TAPES", "TARTS", "TASER", "TASKS",
            "TASTE", "TASTY", "TAXES", "TAXIS", "TEACH",
            "TEAMS", "TEARS", "TEASE", "TEDDY", "TEENS",
            "TEENY", "TEETH", "TELLS", "TELLY", "TEMPO",
            "TEMPT", "TENDS", "TENSE", "TENTH", "TENTS",
            "TERMS", "TERRA", "TERRY", "TESLA", "TESTS",
            "TEXAS", "TEXTS", "THANK", "THEFT", "THEIR",
            "THEME", "THERE", "THESE", "THETA", "THICK",
            "THIEF", "THIGH", "THINE", "THING", "THINK",
            "THIRD", "THONG", "THORN", "THOSE", "THREE",
            "THREW", "THROW", "THUDS", "THUGS", "THUMB",
            "THUMP", "THUNK", "TIARA", "TICKS", "TIDAL",
            "TIDES", "TIGER", "TIGHT", "TILES", "TILLY",
            "TIMED", "TIMER", "TIMES", "TIMID", "TIRED",
            "TIRES", "TITAN", "TITLE", "TITTY", "TOAST",
            "TODAY", "TOKEN", "TOLLS", "TOMBS", "TOMMY",
            "TONES", "TONIC", "TOOLS", "TOOTH", "TOOTS",
            "TOPIC", "TORCH", "TORSO", "TOTAL", "TOTEM",
            "TOUCH", "TOUGH", "TOURS", "TOWED", "TOWEL",
            "TOWER", "TOWNS", "TOXIC", "TOXIN", "TRACE",
            "TRACK", "TRACT", "TRADE", "TRAIL", "TRAIN",
            "TRAIT", "TRAMP", "TRANS", "TRAPS", "TRASH",
            "TREAD", "TREAT", "TREES", "TREND", "TRIAD",
            "TRIAL", "TRIBE", "TRICK", "TRIED", "TRIES",
            "TRIPS", "TROLL", "TROOP", "TROUT", "TRUCE",
            "TRUCK", "TRULY", "TRUMP", "TRUNK", "TRUST",
            "TRUTH", "TUBES", "TULIP", "TUMMY", "TUMOR",
            "TUNED", "TUNES", "TURBO", "TURKS", "TURNS",
            "TUTOR", "TWAIN", "TWEET", "TWICE", "TWINS",
            "TWIST", "TYING", "TYLER", "TYPED", "TYPES",
            "TYRES", "ULCER", "ULTRA", "UNCLE", "UNDER",
            "UNFIT", "UNION", "UNITE", "UNITS", "UNITY",
            "UNTIE", "UNTIL", "UPPER", "UPSET", "URBAN",
            "URGED", "URGES", "URINE", "USERS", "USHER",
            "USING", "USUAL", "UTTER", "VAGUE", "VALET",
            "VALID", "VALOR", "VALUE", "VALVE", "VAULT",
            "VEGAN", "VEGAS", "VEINS", "VENOM", "VENTS",
            "VENUE", "VENUS", "VERGE", "VERSE", "VESTS",
            "VIBES", "VICAR", "VIDEO", "VIEWS", "VIGIL",
            "VILLA", "VINES", "VINYL", "VIOLA", "VIPER",
            "VIRAL", "VIRUS", "VISIT", "VISTA", "VITAL",
            "VIVID", "VOCAL", "VODKA", "VOGUE", "VOICE",
            "VOILA", "VOLTS", "VOMIT", "VOTED", "VOTES",
            "VOUCH", "VOWED", "WACKO", "WACKY", "WAGER",
            "WAGES", "WAGON", "WAILS", "WAIST", "WAITS",
            "WAKES", "WALDO", "WALES", "WALKS", "WALLS",
            "WALLY", "WALTZ", "WANNA", "WANTS", "WARDS",
            "WARMS", "WASTE", "WATCH", "WATER", "WATTS",
            "WAVED", "WAVES", "WEARS", "WEARY", "WEAVE",
            "WEBER", "WEDGE", "WEEDS", "WEEKS", "WEIGH",
            "WEIRD", "WELLS", "WELSH", "WENCH", "WHACK",
            "WHALE", "WHARF", "WHATS", "WHEAT", "WHEEL",
            "WHERE", "WHICH", "WHIFF", "WHILE", "WHINE",
            "WHIPS", "WHIRL", "WHIRS", "WHITE", "WHOLE",
            "WHOOP", "WHORE", "WHOSE", "WIDER", "WIDOW",
            "WIDTH", "WIELD", "WILLS", "WILLY", "WINCH",
            "WINDS", "WINDY", "WINES", "WINGS", "WIPED",
            "WIPES", "WIRED", "WIRES", "WISER", "WITCH",
            "WITTY", "WIVES", "WOKEN", "WOMAN", "WOMEN",
            "WOODS", "WOODY", "WORDS", "WORKS", "WORLD",
            "WORMS", "WORRY", "WORSE", "WORST", "WORTH",
            "WOULD", "WOUND", "WRAPS", "WRATH", "WRECK",
            "WRING", "WRIST", "WRITE", "WRONG", "WROTE",
            "YACHT", "YAHOO", "YANKS", "YARDS", "YATES",
            "YAWNS", "YEARN", "YEARS", "YEAST", "YELLS",
            "YELPS", "YIELD", "YIKES", "YOUNG", "YOURS",
            "YOUSE", "YOUTH", "YUMMY", "ZEBRA", "ZEROS",
            "ZONES", "ZORRO"
        ];

        allFiveLetterWords.forEach(word => {
            this.words.add(word);
            this.answers.add(word);
        });

        // Add spelling bee common words
        const spellingBeeWords = [
            "HORROR","SCARY","CREEPY","SPOOKY","EERIE","DARK","EVIL","WICKED",
            "GHOST","SPIRIT","DEMON","DEVIL","WITCH","VAMPIRE","ZOMBIE","MUMMY",
            "SKELETON","SKULL","GRAVE","TOMB","CRYPT","COFFIN","BLOOD","GORE",
            "SCREAM","CRY","FEAR","TERROR","PANIC","DREAD","FRIGHT","SHADOW",
            "DARKNESS","NIGHT","MOON","STAR","STORM","THUNDER","RAIN"
        ];

        spellingBeeWords.forEach(word => {
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