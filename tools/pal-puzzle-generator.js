#!/usr/bin/env node
/**
 * 🎬 VHS Horror Puzzle Generator - Powered by PAL Multi-Model AI
 * 
 * Uses PAL MCP server to generate horror-themed puzzle content
 * with multiple AI models collaborating on creepy themes.
 * 
 * Usage:
 *   node pal-puzzle-generator.js generate-puzzle --theme "haunted hospital"
 *   node pal-puzzle-generator.js generate-campaign --title "The Asylum Tapes"
 *   node pal-puzzle-generator.js prompt-only --type puzzle
 * 
 * @author Snak3
 * @license MIT
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════
// 🎭 HORROR THEMES & VOCABULARY
// ═══════════════════════════════════════════════════════════════════════════

const HORROR_THEMES = {
  slasher: {
    name: "Slasher Horror",
    elements: ["masked killer", "final girl", "camp", "prom night", "chase scenes"],
    weapons: ["machete", "chainsaw", "knife", "axe", "hook"],
    locations: ["cabin", "summer camp", "sorority house", "high school", "woods"]
  },
  supernatural: {
    name: "Supernatural Horror", 
    elements: ["ghost", "demon", "possession", "séance", "haunting"],
    artifacts: ["ouija board", "cursed mirror", "ancient tome", "locket", "doll"],
    locations: ["mansion", "cemetery", "church", "asylum", "hotel"]
  },
  cosmic: {
    name: "Cosmic Horror",
    elements: ["elder gods", "madness", "forbidden knowledge", "void", "tentacles"],
    concepts: ["infinity", "time loop", "dimension", "ritual", "cult"],
    locations: ["deep sea", "space station", "underground temple", "observatory", "library"]
  },
  found_footage: {
    name: "Found Footage Horror",
    elements: ["static", "glitch", "timestamp", "night vision", "shaky cam"],
    equipment: ["camcorder", "tripod", "flashlight", "battery", "tape"],
    locations: ["abandoned building", "forest", "tunnel", "basement", "attic"]
  },
  body_horror: {
    name: "Body Horror",
    elements: ["mutation", "transformation", "parasite", "infection", "growth"],
    symptoms: ["fever", "rash", "hunger", "voices", "blackout"],
    locations: ["lab", "hospital", "morgue", "bunker", "clinic"]
  }
};

const DIFFICULTY_GUIDELINES = {
  easy: "Obvious connection, common knowledge, straightforward category",
  medium: "Requires some thought, less obvious grouping, themed connection",
  hard: "Tricky connection, requires horror genre knowledge, subtle link",
  tricky: "Wordplay, double meanings, misdirection, hidden pattern"
};

// ═══════════════════════════════════════════════════════════════════════════
// 📝 PAL PROMPT TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a prompt for PAL consensus to create a Connections puzzle
 */
function generatePuzzlePrompt(options = {}) {
  const theme = options.theme || 'slasher';
  const difficulty = options.difficulty || 'medium';
  const themeData = HORROR_THEMES[theme] || HORROR_THEMES.slasher;
  
  return `
🎬 VHS HORROR PUZZLE GENERATION REQUEST

Generate a horror-themed Connections puzzle for our VHS horror game. The puzzle should feel like it belongs in an 80s VHS slasher/horror aesthetic.

**Theme:** ${themeData.name}
**Overall Difficulty:** ${difficulty}
**Theme Elements:** ${themeData.elements.join(', ')}

**REQUIREMENTS:**
1. Create exactly 4 groups of exactly 4 words each (16 words total)
2. Each group needs a clever horror-themed category name
3. Words should be single words, ALL CAPS, 4-10 letters preferred
4. Include difficulty mixing:
   - One "easy" group (obvious connection)
   - One "medium" group (requires thought)  
   - One "hard" group (horror knowledge needed)
   - One "tricky" group (wordplay/misdirection)

**DIFFICULTY GUIDELINES:**
- easy: ${DIFFICULTY_GUIDELINES.easy}
- medium: ${DIFFICULTY_GUIDELINES.medium}
- hard: ${DIFFICULTY_GUIDELINES.hard}
- tricky: ${DIFFICULTY_GUIDELINES.tricky}

**HORROR QUALITY CHECKLIST:**
- [ ] Categories feel creepy/atmospheric
- [ ] Words could appear in horror movies
- [ ] At least one group has clever misdirection
- [ ] No offensive content, just spooky fun

**OUTPUT FORMAT (JSON):**
\`\`\`json
{
  "id": "conn_${theme}_XXX",
  "difficulty": "${difficulty}",
  "groups": [
    {
      "category": "Category name here",
      "difficulty": "easy|medium|hard|tricky",
      "words": ["WORD1", "WORD2", "WORD3", "WORD4"]
    }
  ]
}
\`\`\`

Generate a complete puzzle now. Be creative and spooky! 👻📼
`;
}

/**
 * Generate a prompt for PAL to create a story campaign
 */
function generateCampaignPrompt(options = {}) {
  const title = options.title || "The Forgotten Tapes";
  const character = options.character || "an unnamed protagonist";
  const theme = options.theme || 'found_footage';
  const sceneCount = options.scenes || 5;
  const themeData = HORROR_THEMES[theme] || HORROR_THEMES.found_footage;

  return `
🎬 VHS HORROR CAMPAIGN GENERATION REQUEST

Create a horror story campaign for our VHS puzzle game. This should feel like an 80s VHS horror movie with atmospheric tension that builds across scenes.

**Campaign Title:** "${title}"
**Main Character:** ${character}
**Theme:** ${themeData.name}
**Number of Scenes:** ${sceneCount}
**Theme Elements:** ${themeData.elements.join(', ')}
**Possible Locations:** ${themeData.locations.join(', ')}

**NARRATIVE REQUIREMENTS:**
1. **Premise:** 2-3 sentences setting up the horror scenario
2. **Character Voice:** Consistent first-person narration style
3. **Scene Progression:** 
   - Scenes 1-2: Discovery and investigation
   - Scene 3: Rising tension, first real danger
   - Scene 4: Time pressure (add timer), chase/escape
   - Scene 5: Climactic revelation
4. **Before/After Narratives:**
   - "Before": Sets up puzzle context, builds tension
   - "After": Reveals what the puzzle solution means, advances plot
5. **Epilogue:** Haunting conclusion that hints the horror isn't over

**VHS AESTHETIC ELEMENTS:**
- References to static, tracking, rewinding
- 80s slang and references where appropriate
- Film noir detective or horror host narrator vibes
- "You are not safe" undertones

**OUTPUT FORMAT (JSON):**
\`\`\`json
{
  "id": "campaign_id_here",
  "title": "${title}",
  "premise": "Campaign premise text...",
  "characters": {
    "protagonist": "Character Name",
    "antagonist": "The threat/killer"
  },
  "scenes": [
    {
      "sceneId": "campaign_scene_001",
      "gameType": "connections",
      "puzzleId": "conn_XXXX_001",
      "timer": null,
      "narrative": {
        "before": "Narrator text before puzzle...",
        "after": "Narrator text after solving..."
      }
    }
  ],
  "epilogue": "Final haunting text..."
}
\`\`\`

Generate a complete campaign now. Make it atmospheric and terrifying! 🎬👻
`;
}

/**
 * Generate a prompt for PAL consensus debate on horror content
 */
function generateConsensusPrompt(options = {}) {
  const topic = options.topic || "puzzle difficulty balance";
  
  return `
🎬 VHS HORROR CONTENT CONSENSUS REQUEST

We need multiple AI perspectives on our VHS horror puzzle game content.

**DEBATE TOPIC:** ${topic}

**CONTEXT:**
This is for a VHS-aesthetic horror puzzle game featuring:
- Connections-style word puzzles
- Horror movie themes (slasher, supernatural, cosmic)
- Detective/reporter/archivist protagonists
- Tape degradation mechanics (mistakes = worse visuals)
- Blood trail counters and jumpscare failure states

**MODELS SHOULD CONSIDER:**
1. **Horror Authenticity:** Does this feel like real 80s horror?
2. **Puzzle Quality:** Is it fair but challenging?
3. **Narrative Impact:** Does the story enhance the scares?
4. **Player Experience:** Is it fun-scary, not frustrating-scary?

**STANCE ASSIGNMENTS:**
- Model 1 (supportive): Focus on what works well and why
- Model 2 (critical): Identify potential issues and improvements
- Model 3 (neutral): Balanced synthesis with recommendations

Please provide structured feedback that helps us create the spookiest, most engaging horror puzzle content possible.

Output recommendations in a clear, actionable format. 📼🎭
`;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate a generated puzzle matches our schema
 */
function validatePuzzle(puzzle) {
  const errors = [];
  
  if (!puzzle.id || !puzzle.id.startsWith('conn_')) {
    errors.push("ID must start with 'conn_'");
  }
  
  if (!['easy', 'medium', 'hard'].includes(puzzle.difficulty)) {
    errors.push("Difficulty must be easy, medium, or hard");
  }
  
  if (!puzzle.groups || puzzle.groups.length !== 4) {
    errors.push("Must have exactly 4 groups");
  } else {
    puzzle.groups.forEach((group, i) => {
      if (!group.category) errors.push(`Group ${i+1} missing category`);
      if (!group.words || group.words.length !== 4) {
        errors.push(`Group ${i+1} must have exactly 4 words`);
      }
      if (!['easy', 'medium', 'hard', 'tricky'].includes(group.difficulty)) {
        errors.push(`Group ${i+1} has invalid difficulty`);
      }
    });
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate a generated campaign matches our schema
 */
function validateCampaign(campaign) {
  const errors = [];
  
  if (!campaign.id) errors.push("Missing campaign ID");
  if (!campaign.title) errors.push("Missing title");
  if (!campaign.premise) errors.push("Missing premise");
  if (!campaign.characters) errors.push("Missing characters");
  if (!campaign.scenes || campaign.scenes.length === 0) {
    errors.push("Must have at least one scene");
  }
  if (!campaign.epilogue) errors.push("Missing epilogue");
  
  campaign.scenes?.forEach((scene, i) => {
    if (!scene.sceneId) errors.push(`Scene ${i+1} missing sceneId`);
    if (!scene.narrative?.before) errors.push(`Scene ${i+1} missing before narrative`);
    if (!scene.narrative?.after) errors.push(`Scene ${i+1} missing after narrative`);
  });
  
  return { valid: errors.length === 0, errors };
}

/**
 * Generate a complete PAL command for Claude Code / Codex CLI
 */
function generatePALCommand(promptType, options = {}) {
  const model = options.model || 'pro';
  const useConsensus = options.consensus || false;
  
  let prompt;
  switch (promptType) {
    case 'puzzle':
      prompt = generatePuzzlePrompt(options);
      break;
    case 'campaign':
      prompt = generateCampaignPrompt(options);
      break;
    case 'consensus':
      prompt = generateConsensusPrompt(options);
      break;
    default:
      throw new Error(`Unknown prompt type: ${promptType}`);
  }
  
  if (useConsensus) {
    return `Use PAL consensus with gemini pro being creative and supportive, and gpt-5 being critical and analytical to: ${prompt}`;
  } else {
    return `Use PAL chat with ${model} to: ${prompt}`;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎮 CLI INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

function printBanner() {
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║  🎬 VHS HORROR PUZZLE GENERATOR - Powered by PAL Multi-Model AI 🎬  ║
║                                                                      ║
║  "The tapes are watching... and generating..."                      ║
╚══════════════════════════════════════════════════════════════════════╝
  `);
}

function printUsage() {
  console.log(`
USAGE:
  node pal-puzzle-generator.js <command> [options]

COMMANDS:
  prompt-puzzle     Generate a PAL prompt for creating a puzzle
  prompt-campaign   Generate a PAL prompt for creating a campaign  
  prompt-consensus  Generate a PAL consensus debate prompt
  validate          Validate puzzle/campaign JSON
  themes            List available horror themes
  help              Show this help message

OPTIONS:
  --theme <theme>      Horror theme (slasher, supernatural, cosmic, found_footage, body_horror)
  --difficulty <diff>  Puzzle difficulty (easy, medium, hard)
  --title <title>      Campaign title
  --character <char>   Protagonist character
  --scenes <n>         Number of scenes (default: 5)
  --model <model>      PAL model to use (pro, flash, o3, gpt5)
  --consensus          Use multi-model consensus mode
  --output <file>      Save output to file

EXAMPLES:
  node pal-puzzle-generator.js prompt-puzzle --theme slasher --difficulty hard
  node pal-puzzle-generator.js prompt-campaign --title "The Asylum Tapes" --theme body_horror
  node pal-puzzle-generator.js prompt-consensus --topic "best horror themes for word puzzles"
  node pal-puzzle-generator.js themes

WORKFLOW:
  1. Run this tool to generate a prompt
  2. Copy the prompt to your AI CLI (Claude Code, Codex, etc.)
  3. Let PAL orchestrate multiple AI models to generate content
  4. Validate the output with 'validate' command
  5. Add to puzzles.json / stories.json

  Happy haunting! 👻📼
  `);
}

function listThemes() {
  console.log("\n🎭 AVAILABLE HORROR THEMES:\n");
  Object.entries(HORROR_THEMES).forEach(([key, theme]) => {
    console.log(`  ${key.padEnd(15)} - ${theme.name}`);
    console.log(`                    Elements: ${theme.elements.slice(0, 3).join(', ')}...`);
    console.log(`                    Locations: ${theme.locations.slice(0, 3).join(', ')}...\n`);
  });
}

function parseArgs(args) {
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      options[key] = value;
      if (value !== true) i++;
    }
  }
  return options;
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const options = parseArgs(args.slice(1));
  
  printBanner();
  
  switch (command) {
    case 'prompt-puzzle':
      console.log("📝 PUZZLE GENERATION PROMPT:\n");
      console.log("─".repeat(70));
      console.log(generatePuzzlePrompt(options));
      console.log("─".repeat(70));
      console.log("\n💡 Copy this prompt and use it with PAL in your AI CLI!");
      if (options.consensus) {
        console.log("\n🤝 CONSENSUS MODE COMMAND:");
        console.log(generatePALCommand('puzzle', { ...options, consensus: true }));
      }
      break;
      
    case 'prompt-campaign':
      console.log("📝 CAMPAIGN GENERATION PROMPT:\n");
      console.log("─".repeat(70));
      console.log(generateCampaignPrompt(options));
      console.log("─".repeat(70));
      console.log("\n💡 Copy this prompt and use it with PAL in your AI CLI!");
      break;
      
    case 'prompt-consensus':
      console.log("📝 CONSENSUS DEBATE PROMPT:\n");
      console.log("─".repeat(70));
      console.log(generateConsensusPrompt(options));
      console.log("─".repeat(70));
      break;
      
    case 'validate':
      if (!options.file) {
        console.log("❌ Please provide --file <path> to validate");
        break;
      }
      try {
        const content = JSON.parse(fs.readFileSync(options.file, 'utf8'));
        const result = content.groups ? validatePuzzle(content) : validateCampaign(content);
        if (result.valid) {
          console.log("✅ Validation passed!");
        } else {
          console.log("❌ Validation failed:");
          result.errors.forEach(e => console.log(`   - ${e}`));
        }
      } catch (e) {
        console.log(`❌ Error: ${e.message}`);
      }
      break;
      
    case 'themes':
      listThemes();
      break;
      
    case 'help':
    case '--help':
    case '-h':
    case undefined:
      printUsage();
      break;
      
    default:
      console.log(`❌ Unknown command: ${command}`);
      printUsage();
  }
}

// Export for use as module
module.exports = {
  generatePuzzlePrompt,
  generateCampaignPrompt,
  generateConsensusPrompt,
  validatePuzzle,
  validateCampaign,
  HORROR_THEMES,
  DIFFICULTY_GUIDELINES
};

// Run CLI if executed directly
if (require.main === module) {
  main();
}
