# VHS Horror Puzzle Collection

A horror-themed puzzle game collection featuring Connections, Wordle, Strands, Spelling Bee, and Letter Boxed.

## How to Add More Puzzles

### Adding Connections Puzzles

Edit `data/puzzles.json` and add new puzzles to the `connections` array:

```json
{
  "id": "conn_your_puzzle_001",
  "difficulty": "easy", // or "medium", "hard", "tricky"
  "groups": [
    {
      "category": "Your category name",
      "difficulty": "easy",
      "words": ["WORD1", "WORD2", "WORD3", "WORD4"]
    },
    {
      "category": "Another category",
      "difficulty": "medium",
      "words": ["WORD5", "WORD6", "WORD7", "WORD8"]
    },
    {
      "category": "Third category",
      "difficulty": "hard",
      "words": ["WORD9", "WORD10", "WORD11", "WORD12"]
    },
    {
      "category": "Fourth category",
      "difficulty": "tricky",
      "words": ["WORD13", "WORD14", "WORD15", "WORD16"]
    }
  ]
}
```

**Requirements:**
- Each puzzle must have exactly 4 groups
- Each group must have exactly 4 words
- All words must be unique across the puzzle
- Word IDs must be unique (use `conn_yourname_###` format)
- All words must be in UPPERCASE
- Difficulty levels: `easy`, `medium`, `hard`, `tricky`

### Adding Wordle Puzzles (Coming Soon)

Edit `data/puzzles.json` and add to the `wordle` array:

```json
{
  "id": "word_your_puzzle_001",
  "difficulty": "easy",
  "secretWord": "DREAD",
  "theme": "horror_emotions",
  "vhsQuality": "flicker"
}
```

### Adding Story Campaigns

Edit `data/stories.json` and add to the `campaigns` array:

```json
{
  "id": "your_story_id",
  "title": "Your Story Title",
  "premise": "Brief description of the story...",
  "characters": {
    "protagonist": "Character name",
    "antagonist": "Character name"
  },
  "scenes": [
    {
      "sceneId": "your_story_001",
      "gameType": "connections",
      "puzzleId": "conn_your_puzzle_001",
      "timer": null, // or number of seconds (e.g., 60)
      "narrative": {
        "before": "Text displayed before the puzzle...",
        "after": "Text displayed after solving the puzzle..."
      }
    }
  ],
  "epilogue": "Final text shown when story is completed..."
}
```

**Story Requirements:**
- Story IDs must be unique
- Each scene must reference a valid puzzle ID
- Game types: `connections`, `wordle`, `strands`, `spelling-bee`, `letter-boxed`
- Timer is optional (null for no timer)
- Narrative text will be displayed with typewriter effect

## Adding New Stories to Progression

Stories are unlocked sequentially. The first story is always unlocked. To add a new story:

1. Create the story in `data/stories.json`
2. Ensure it's placed in the `campaigns` array in the desired order
3. The previous story must be completed to unlock the next one
4. No code changes needed - progression is automatic

## File Structure

```
vhs_horror_puzzles/
├── index.html                          # Main HTML
├── css/                                # Stylesheets
├── js/                                 # JavaScript
│   ├── main.js                         # Core game logic
│   ├── vhs-effects.js                  # Horror effects
│   └── games/                          # Game logic
├── data/
│   ├── puzzles.json                    # All puzzle definitions
│   ├── stories.json                    # Story campaigns
│   └── progress.json                   # Auto-generated save data
└── assets/                             # Images, audio, characters
```

## Tips for Puzzle Creation

### Connections Tips
- Make categories thematically linked (e.g., "Weapons," "Locations," "Characters")
- Include tricky categories that could mislead the player
- Words should be 4-8 letters long for readability
- Test your puzzle to ensure categories are solveable
- Consider the horror theme in your category choices

### Story Writing Tips
- Keep before/after text concise (2-3 sentences)
- Build tension across scenes
- Make puzzles feel relevant to the story
- Leave cliffhangers between scenes
- Consider how difficulty increases through the story
- Epilogues should be satisfying but hint at more horror

## Testing Your Puzzles

1. Add your puzzle to `puzzles.json`
2. Open `index.html` in a browser
3. Select "Game Mode" → "Connections"
4. Puzzles are randomly selected - keep playing until you see yours
5. Or create a story scene with your puzzle to test it specifically

## Save Data

Player progress is saved to localStorage in the browser. Key data:
- Completed stories
- Unlocked INSANE mode
- Last played timestamp

To reset progress: Clear browser localStorage or use the browser's dev tools.

## Coming Soon

- Wordle game implementation
- Strands game implementation
- Spelling Bee game implementation
- Letter Boxed game implementation
- Audio system enhancement
- Character sprite system
- Achievement system
- More story campaigns
