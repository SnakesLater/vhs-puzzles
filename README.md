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

- **✅ Connections** - Link words into mysterious categories
- **🚧 Wordle** - Solve the victim's final word *(Available)*
- **🚧 Strands** - Unravel webs of connected clues *(In Progress)*
- **🚧 Letter Boxed** - Escape the letter prison *(Coming Soon)*
- **🚧 Spelling Bee** - Buzz through letters to build words *(Coming Soon)*

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
| Strands | ⚠️ In Progress | High |
| Letter Boxed | ❌ Planned | High |
| Spelling Bee | ❌ Planned | Medium |

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
│   │   ├── strands.js (incomplete)
│   │   ├── wordle.js
│   │   └── letterboxed.js (NOT YET CREATED)
│   ├── systems/
│   │   ├── cleanup-manager.js
│   │   ├── asset-loader.js
│   │   ├── event-manager.js
│   │   ├── tape-quality.js
│   │   ├── story-text-renderer.js
│   │   ├── tape-cover-renderer.js
│   │   └── other-systems/
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

## 📄 Next Steps

1. **Opencode Assignment**: Create Letter Boxed implementation
2. **Opencode Assignment**: Complete Strands game logic
3. **Opencode Assignment**: Write unit tests when ready
4. **Droid**: CI/CD automation, local validation
5. **Pi/QP**: Document sessions, track progress

## 📚 Documentation

- `PROJECT_STATUS.md` - Accurate game implementation status
- `AGENTS.md` - Agent workflow and task assignments
- `CONTRIBUTING.md` - For external contributors
- `DEVELOPER_NOTES.md` - For developer notes
- `CHANGELOG.md` - Version history

## 🤖 Documentation Policy

- Keep docs accurate (update when status changes)
- Letter Boxed marked as "Coming Soon" until implemented
- Verify all claims against actual codebase
- Opencode + Openclaw verify implementation status

---

**Version**: 2.0 (Verified)  
**Verified Date**: 2026-04-01  
**Verified By**: QP (Pi + Opencode + Openclaw + Droid)
