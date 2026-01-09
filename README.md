<<<<<<< HEAD
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
=======
# vhs-puzzles



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

* [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
* [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/ourobor05/vhs-puzzles.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

* [Set up project integrations](https://gitlab.com/ourobor05/vhs-puzzles/-/settings/integrations)

## Collaborate with your team

* [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
* [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
* [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
* [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
* [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

* [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
* [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
* [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
* [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
* [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
>>>>>>> c9cb89d85b4179c5a253d12f1ce2d355fe3bfab4
