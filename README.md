# 📼 VHS Horror Puzzle Collection

*A retro horror-themed puzzle game collection that brings classic word games into a chilling VHS aesthetic.*

## 🎮 Play Now

**[Play on GitHub Pages](https://github.com/SnakesLater/vhs-connections)** *(Coming Soon)*

Or run locally:
```bash
git clone https://github.com/SnakesLater/vhs-connections.git
cd vhs-connections
npm start
```
Open `http://localhost:8000` in your browser.

## 🎯 Games Available

- **✅ Connections** - Link words into mysterious categories *(Available)*
- **✅ Wordle** - Solve the victim's final word *(Available)*
- **✅ Strands** - Unravel webs of connected clues *(Available)*
- **✅ Letter Boxed** - Escape the letter prison *(Available)*
- **✅ Spelling Bee** - Buzz through letters to build words *(Available)*

## 🎬 Contribute Your Horror Stories

**I want YOUR creative ideas!** Whether you're a puzzle master, storyteller, or just have a cool idea - we'll credit you as a **Director**, **Producer**, or **Actor** on the VHS tape covers!

### 💡 Quick Idea Submission

Got an Idea? Great! Just half an idea? Perfect! Just toss [create an issue](https://github.com/SnakesLater/vhs-connections/issues/new) with:

```
Title: [IDEA] Your concept in a few words

Description: 
- Puzzle type (Connections, Wordle, etc.)
- Theme/setting (haunted house, abandoned hospital, etc.)  
- Any specific words, categories, or story beats
- How spooky? (1-10 scale)

Credit me as: Director/Producer/Actor/Writer
```

We'll develop it into a full puzzle/story and you'll see your name on the VHS cover!

### 🎭 Full Puzzle Creation

Ready to dive deep? Check out our **[Contributor Guide](CONTRIBUTING.md)** for:
- Complete puzzle creation templates
- Story writing guidelines  
- VHS cover design process
- Testing your creations

### 🏆 Contributor Credits System

**Every contributor gets VHS movie credits:**
- **Directors** - Created complete stories/campaigns
- **Producers** - Designed full puzzle sets
- **Writers** - Crafted narrative elements
- **Actors** - Provided character ideas/dialogue
- **Special Effects** - Contributed code/visual enhancements

## 🎨 The VHS Aesthetic

This isn't just another puzzle game - it's a love letter to 80s horror:
- Authentic VHS tape covers with movie-style artwork
- Glitch effects and static that respond to your performance
- Horror movie atmosphere with detective/survivor storylines
- Tape quality degrades as you make mistakes (rewind to fix!)

## 🛠️ For Developers

### Quick Start
```bash
npm install
npm run lint    # Check code quality
npm start       # Launch development server
```

### Tech Stack
- **Vanilla JavaScript** (ES6+) - No frameworks, pure performance
- **Canvas Rendering** - Custom VHS effects and tape artwork
- **Modular Architecture** - Easy to add new games and features
- **Progressive Enhancement** - Works everywhere, enhanced with modern features

### Adding New Games
1. Extend the `BaseGame` class in `js/games/`
2. Follow existing patterns in `connections.js`
3. Add your game data to `data/puzzles.json`
4. Test with our automated linting and CI

### Current Development Status

| Game | Status | Priority |
|------|--------|----------|
| Connections | ✅ Complete | N/A |
| Wordle | ✅ Complete | N/A |
| Strands | ✅ Complete | N/A |
| Letter Boxed | ✅ Complete | N/A |
| Spelling Bee | ✅ Complete | N/A |

## 🤖 AI Development Team

### Active Agents:
- **Pi**: Conversational planning, documentation, context
- **Opencode**: Code generation, implementation, test writing
- **Openclaw**: Code verification, security, debugging
- **Droid**: CI/CD automation, local validation (deployed)

### Workflow:
1. Pi plans task and discusses approach
2. Opencode generates/implements code
3. Openclaw reviews and validates code
4. Droid handles Git ops and build verification

## 🧪 Testing

### Running Tests:
```bash
npm test
# Expected: Tests run with Jest or similar
```

### Manual Testing:
```bash
npm start
# Open index.html in browser
# Test each game
# Check browser console for errors
```

## 📁 Project Structure

```
vhs-puzzles/
├── js/
│   ├── games/
│   │   ├── base-game.js
│   │   ├── connections.js
│   │   ├── strands.js
│   │   ├── wordle.js
│   │   ├── letter-boxed.js
│   │   └── spelling-bee.js
│   ├── systems/
│   │   ├── cleanup-manager.js
│   │   ├── asset-loader.js
│   │   ├── event-manager.js
│   │   ├── tape-quality.js
│   │   ├── story-text-renderer.js
│   │   ├── tape-cover-renderer.js
│   │   ├── counter-renderer.js
│   │   ├── puzzle-loader.js
│   │   ├── word-dictionary.js
│   │   └── vhs-tape-renderer.js
│   ├── vhs-effects.js
│   ├── main.js
│   └── server.js
├── css/
├── data/
├── assets/
├── .gitlab-ci.yml (working)
├── package.json (updated)
├── eslint.config.js
└── .gitlab-info-README.md
```

## 🔐 Security

- No npm vulnerabilities
- GitLab token secured in `.gitlab-token` (gitignored)
- ESLint rules prevent eval() usage
- Openclaw available for security checks
- DroidShield enabled for secret scanning

## 📋 Next Steps

1. **Add unit tests** — set up Jest or similar test framework
2. **GitHub Pages deployment** — publish live demo
3. **New puzzle content** — expand puzzle data for all games
4. **Droid**: CI/CD automation, local validation

## 📚 Documentation

- `PROJECT_STATUS.md` - Accurate game implementation status
- `AGENTS.md` - Agent workflow and task assignments
- `CONTRIBUTING.md` - For external contributors
- `DEVELOPER_NOTES.md` - For developer notes
- `CHANGELOG.md` - Version history

## 📋 Documentation Policy
- Keep docs accurate (update when status changes)
- Verify all claims against actual codebase
- Opencode + Openclaw verify implementation status

## 📼 Narrative & Content Pipeline

Content is **data, not code**. The Narrative & Content Engineer authors
storylines and puzzle content; runtime logic never forks on a specific theme.

- `data/content-schema.json` — source of truth for the content contract
  (per-gameType shapes, enums, credit roles). Adding a theme/gameType is a
  data change here + a line in `dev/tools/validate-content.js`.
- `data/credits.json` — contributor registry (Director / Producer / Writer /
  Actor / Special Effects). Campaigns reference contributors by `id`+`role`.
- `data/stories.json` — campaigns. Each carries `theme`, `difficulty`, and
  `credits`; scenes bind `gameType`+`puzzleId` to `narrative.{before,after}`.
- `data/puzzles.json` — all puzzle data (connections / wordle / strands /
  letter-boxed / spelling-bee).
- `dev/tools/validate-content.js` — CI validator. Enforces the schema, referential
  integrity (every `scene.puzzleId` must exist), the credit system, and
  **data-vs-runtime drift** (e.g. it flags the hardcoded campaign-difficulty
  map in `js/main.js` that duplicates data now owned by `stories.json`).

Run it: `npm run validate:content`

---
**Version**: 3.0 (Updated — all games implemented)
**Verified Date**: 2026-04-12
**Pipeline Verified**: 2026-07-10 (SNA-8)
**Verified Date**: 2026-04-12
**Verified By**: Hermes Agent
