# Projects

This directory contains all your development projects.

## Structure

```
projects/
├── .opencode/          # OpenCode project config (skills, etc.)
│   └── skills/         # Project-local skills
├── SPEC.md             # Project specification
├── PROGRESS.md         # Progress tracker
├── CONVENTIONS.md      # Code style conventions
├── src/                # Source code
└── opencode.json       # OpenCode project config
```

## OpenCode Skills

Skills are loaded from:
- Global: `~/.config/opencode/skills/`
- Project: `.opencode/skills/`

Available global skills:
- `vhs-aesthetic` - VHS/CRT retro design system
- `web-game-dev` - Game loop, canvas, state patterns
- `code-review` - Code quality checklist

Use `/skill vhs-aesthetic` to load a skill.

## Templates

Project templates are stored in `~/Templates/opencode-setup1/`.
Copy this structure when starting a new project.
