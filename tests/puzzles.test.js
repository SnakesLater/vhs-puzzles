// Puzzle Data Validation Tests
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');

// Helper: Load JSON safely
const loadJSON = (filename) => {
  const content = fs.readFileSync(path.join(DATA_DIR, filename), 'utf-8');
  return JSON.parse(content);
};

// Helper: Validate Connections puzzle structure
const validateConnectionsPuzzle = (puzzle) => {
  expect(puzzle).toHaveProperty('id');
  expect(puzzle.id).toMatch(/^conn_/);
  expect(puzzle).toHaveProperty('difficulty');
  expect(['easy', 'medium', 'hard']).toContain(puzzle.difficulty);
  expect(puzzle).toHaveProperty('groups');
  expect(Array.isArray(puzzle.groups)).toBe(true);
  expect(puzzle.groups.length).toBe(4); // Always 4 groups
  puzzle.groups.forEach((group) => {
    expect(group).toHaveProperty('category');
    expect(group).toHaveProperty('difficulty');
    expect(group).toHaveProperty('words');
    expect(Array.isArray(group.words)).toBe(true);
    expect(group.words.length).toBe(4); // 4 words per group
    group.words.forEach(word => {
      expect(typeof word).toBe('string');
      expect(word).toBe(word.toUpperCase());
    });
  });
};

describe('Puzzle Data Structure', () => {
  let puzzles;

  beforeAll(() => {
    puzzles = loadJSON('puzzles.json');
  });

  test('puzzles.json is valid JSON', () => {
    expect(puzzles).toBeDefined();
  });

  test('has all required game types', () => {
    expect(puzzles).toHaveProperty('connections');
    expect(puzzles).toHaveProperty('wordle');
    expect(puzzles).toHaveProperty('strands');
    expect(puzzles).toHaveProperty('letter-boxed');   // hyphenated!
    expect(puzzles).toHaveProperty('spelling-bee');   // hyphenated!
  });

  describe('Connections', () => {
    let connections;

    beforeAll(() => {
      connections = puzzles.connections;
    });

    test('is an array', () => {
      expect(Array.isArray(connections)).toBe(true);
    });

    test('has at least 5 puzzles', () => {
      expect(connections.length).toBeGreaterThanOrEqual(5);
    });

    test('each puzzle has unique ID', () => {
      const ids = connections.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('each puzzle has valid structure', () => {
      connections.forEach(validateConnectionsPuzzle);
    });
  });

  describe('Wordle', () => {
    let wordle;

    beforeAll(() => {
      wordle = puzzles.wordle;
    });

    test('is an array', () => {
      expect(Array.isArray(wordle)).toBe(true);
    });

    test('has at least 10 puzzles', () => {
      expect(wordle.length).toBeGreaterThanOrEqual(10);
    });

    test('each puzzle has answer field', () => {
      wordle.forEach(puzzle => {
        expect(puzzle).toHaveProperty('answer');
        expect(typeof puzzle.answer).toBe('string');
        expect(puzzle.answer.length).toBeGreaterThanOrEqual(4);
        expect(puzzle.answer.length).toBeLessThanOrEqual(6);
        expect(puzzle.answer).toBe(puzzle.answer.toUpperCase());
      });
    });

    test('each puzzle has valid structure', () => {
      wordle.forEach(puzzle => {
        expect(puzzle).toHaveProperty('id');
        expect(puzzle).toHaveProperty('difficulty');
        expect(puzzle.id).toMatch(/^wordle_/);
      });
    });
  });

  describe('Strands', () => {
    let strands;

    beforeAll(() => {
      strands = puzzles.strands;
    });

    test('is an array', () => {
      expect(Array.isArray(strands)).toBe(true);
    });

    test('each puzzle has required fields', () => {
      strands.forEach(puzzle => {
        expect(puzzle).toHaveProperty('id');
        expect(puzzle).toHaveProperty('theme');
        expect(puzzle).toHaveProperty('spangram');
        expect(puzzle).toHaveProperty('grid');      // Uses grid, not letters
        expect(puzzle).toHaveProperty('answers');     // Uses answers, not words
        expect(Array.isArray(puzzle.answers)).toBe(true);
        expect(puzzle.grid.length).toBeGreaterThan(0); // Grid is non-empty
      });
    });
  });

  describe('Letter Boxed', () => {
    let letterboxed;

    beforeAll(() => {
      letterboxed = puzzles['letter-boxed'];
    });

    test('is an array', () => {
      expect(Array.isArray(letterboxed)).toBe(true);
    });

    test('each puzzle has required fields', () => {
      letterboxed.forEach(puzzle => {
        expect(puzzle).toHaveProperty('id');
        expect(puzzle).toHaveProperty('sides');
        expect(puzzle).toHaveProperty('answers');
        expect(puzzle.sides.length).toBe(4); // 4 sides of the box
      });
    });
  });

  describe('Spelling Bee', () => {
    let spellingbee;

    beforeAll(() => {
      spellingbee = puzzles['spelling-bee'];
    });

    test('is an array', () => {
      expect(Array.isArray(spellingbee)).toBe(true);
    });

    test('each puzzle has required fields', () => {
      spellingbee.forEach(puzzle => {
        expect(puzzle).toHaveProperty('id');
        expect(puzzle).toHaveProperty('centerLetter');
        expect(puzzle).toHaveProperty('outerLetters');
        expect(puzzle.centerLetter.length).toBe(1);   // Single center letter
        expect(puzzle.outerLetters.length).toBe(6); // 6 outer letters
      });
    });
  });
});

describe('Stories Data', () => {
  let stories;

  beforeAll(() => {
    stories = loadJSON('stories.json');
  });

  test('stories.json is valid JSON', () => {
    expect(stories).toBeDefined();
  });

  test('has campaigns array', () => {
    expect(stories).toHaveProperty('campaigns');
    expect(Array.isArray(stories.campaigns)).toBe(true);
  });

  test('each campaign has required fields', () => {
    stories.campaigns.forEach(campaign => {
      expect(campaign).toHaveProperty('id');
      expect(campaign).toHaveProperty('title');
      expect(campaign).toHaveProperty('scenes');
      expect(Array.isArray(campaign.scenes)).toBe(true);
    });
  });
});