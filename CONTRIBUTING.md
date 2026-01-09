# 🎬 VHS Horror Puzzle Collection - Contributor Guide

*Transform your creative ideas into playable horror experiences!*

## 🎯 Quick Start for Contributors

### 💡 Got an Idea? Start Here!

**Don't overthink it!** Even half-formed ideas are valuable. We'll help develop them into full experiences.

**[Submit a Quick Idea →](https://github.com/SnakesLater/vhs-connections/issues/new)**

Use this template:
```
Title: [IDEA] Haunted Library Connections

Description:
- Game: Connections  
- Setting: Abandoned university library
- Possible categories: Banned books, ghost types, library sections, escape routes
- Spook level: 7/10
- Story hook: Librarian's ghost won't let you leave until you solve her final puzzle

Credit me as: Director
Name for credits: YourName
```

### 🎭 Contributor Credit System

**Every contribution earns you VHS movie credits:**

- **🎬 Director** - Created complete story campaigns (3+ scenes)
- **🎞️ Producer** - Designed full puzzle sets (5+ puzzles) 
- **✍️ Writer** - Crafted narrative elements and dialogue
- **🎭 Actor** - Provided character concepts and voice
- **🎨 Special Effects** - Code contributions and visual enhancements
- **🎵 Sound Designer** - Audio contributions
- **📋 Script Supervisor** - Testing and quality assurance

## 🧩 Creating Puzzles

### Connections Puzzles

**Perfect for:** Thematic word grouping with horror twists

**Template:**
```json
{
  \"id\": \"conn_yourname_001\",
  \"difficulty\": \"medium\",
  \"theme\": \"haunted_hospital\", 
  \"groups\": [
    {
      \"category\": \"Medical Equipment\",
      \"difficulty\": \"easy\",
      \"words\": [\"SCALPEL\", \"SYRINGE\", \"BANDAGE\", \"STETHOSCOPE\"]
    },
    {
      \"category\": \"Hospital Rooms\", 
      \"difficulty\": \"medium\",
      \"words\": [\"MORGUE\", \"SURGERY\", \"RECOVERY\", \"EMERGENCY\"]
    },
    {
      \"category\": \"Things That Glow\",
      \"difficulty\": \"hard\", 
      \"words\": [\"XRAY\", \"MONITOR\", \"EXIT\", \"GHOST\"]
    },
    {
      \"category\": \"Sounds in the Dark\",
      \"difficulty\": \"tricky\",
      \"words\": [\"DRIP\", \"BEEP\", \"WHISPER\", \"CREAK\"]
    }
  ]
}
```

**Tips:**
- Make one category obviously horror-themed
- Include a \"tricky\" category that could mislead players
- 4-8 letter words work best for readability
- Test your puzzle - can you solve it in under 4 mistakes?

### Wordle Puzzles *(Coming Soon)*

**Perfect for:** Single word mysteries with thematic clues

**Template:**
```json
{
  \"id\": \"word_yourname_001\",
  \"secretWord\": \"DREAD\",
  \"theme\": \"emotions_of_fear\",
  \"hint\": \"What you feel when the lights go out...\",
  \"difficulty\": \"medium\"
}
```

### Other Games
- **Strands** - Web of connected words around a central theme
- **Spelling Bee** - Letter combinations with horror vocabulary  
- **Letter Boxed** - Word chains using specific letter sets

## 📖 Writing Stories

### Story Structure

**Stories are sequences of puzzles connected by narrative.**

**Template:**
```json
{
  \"id\": \"your_story_name\",
  \"title\": \"The Haunted Library\",
  \"premise\": \"A late-night study session becomes a supernatural puzzle challenge.\",
  \"difficulty\": \"Medium\",
  \"estimatedTime\": \"15-20 minutes\",
  \"scenes\": [
    {
      \"sceneId\": \"library_001\", 
      \"gameType\": \"connections\",
      \"puzzleId\": \"conn_library_books\",
      \"timer\": 180,
      \"narrative\": {
        \"before\": \"The library doors slam shut behind you. A ghostly voice whispers: 'Solve my collection, or join it forever...'\",
        \"after\": \"The books glow briefly. 'Impressive,' the voice says. 'But can you handle what's in the restricted section?'\"
      }
    }
  ],
  \"epilogue\": \"You escape into the dawn, but the library card in your pocket suggests this isn't over...\"
}
```

### Writing Guidelines

**Before Text (Scene Setup):**
- 1-2 sentences max
- Set the mood and stakes
- Give context for why this puzzle matters

**After Text (Scene Resolution):**  
- 1-2 sentences max
- Acknowledge the player's success
- Tease what's coming next

**Epilogue:**
- Satisfying conclusion
- Hint at larger mysteries
- Leave room for sequels

### Story Themes We Love

- **Abandoned Places** - Hospitals, schools, malls, amusement parks
- **Supernatural Mysteries** - Ghosts with unfinished business
- **Survival Horror** - Escaping dangerous situations through wit
- **Detective Stories** - Solving crimes through puzzle clues
- **Cosmic Horror** - Mysteries beyond human understanding
- **Folk Horror** - Rural/traditional scary stories

## 🎨 VHS Cover Design

**Every story gets a custom VHS cover with contributor credits!**

### Cover Elements
- **Front**: Movie poster style artwork with title
- **Back**: Plot summary, ratings, runtime, and **YOUR CREDITS**
- **Spine**: Title and horror rating
- **Special Features**: Achievement badges for completed stories

### Credit Examples
```
Directed by: YourName
Produced by: CollaboratorName  
Story by: AnotherContributor
Special Effects: CodeContributor
```

## 🧪 Testing Your Creations

### Puzzle Testing Checklist
- [ ] Can you solve it in under 4 mistakes?
- [ ] Are the categories distinct but not obvious?
- [ ] Do the words fit the horror theme?
- [ ] Is the difficulty appropriate for the target audience?

### Story Testing Checklist  
- [ ] Does each scene advance the plot?
- [ ] Are puzzles relevant to the story?
- [ ] Is the difficulty curve smooth?
- [ ] Does the ending feel satisfying?

### Local Testing
1. Add your content to the appropriate JSON files
2. Run `npm start` 
3. Play through your creation
4. Get feedback from friends/family
5. Iterate based on testing

## 🤝 Collaboration Process

### 1. Idea Submission
- Submit ideas via GitHub Issues
- Use provided templates
- Don't worry about completeness

### 2. Development
- We'll assign the idea to available contributors
- Collaborate via GitHub comments
- Iterate based on feedback

### 3. Implementation  
- Code contributions via Pull Requests
- Content additions via JSON file updates
- Testing and quality assurance

### 4. Credit Assignment
- Credits based on contribution level
- Multiple people can share credits
- Special recognition for exceptional work

### 5. Release
- Your creation goes live in the next version
- VHS cover generated with your credits
- Community showcase and celebration

## 🎪 Community Guidelines

### What We're Looking For
- **Creative horror themes** that aren't gratuitously violent
- **Clever puzzle design** that challenges without frustrating  
- **Engaging stories** that make puzzles feel meaningful
- **Inclusive content** that welcomes all players
- **Quality contributions** that enhance the overall experience

### What We Avoid
- Excessive gore or violence
- Real-world tragedies or sensitive topics
- Copyrighted content without permission
- Puzzles that are unsolvable or unfair
- Content that excludes or alienates players

## 🏆 Recognition System

### Contributor Levels
- **🌟 Rookie** - First contribution accepted
- **🎬 Filmmaker** - 3+ stories created  
- **🧩 Puzzle Master** - 10+ puzzles created
- **👑 Horror Legend** - Major code contributions or exceptional creativity

### Special Recognition
- **Monthly Contributor Spotlight**
- **Featured VHS Cover Gallery**  
- **Community Choice Awards**
- **Developer Collaboration Opportunities**

## 📞 Getting Help

### Questions?
- **GitHub Discussions** - General questions and brainstorming
- **Issues** - Specific problems or bug reports
- **Pull Request Comments** - Code-related discussions

### Stuck on Ideas?
Check out our **[Inspiration Board](https://github.com/SnakesLater/vhs-connections/discussions)** for:
- Unused concept seeds
- Collaboration opportunities  
- Community challenges
- Seasonal themes

---

**Ready to create some horror magic?** 

**[Submit Your First Idea →](https://github.com/SnakesLater/vhs-connections/issues/new)**

*Every great horror story starts with a single, terrifying idea...*