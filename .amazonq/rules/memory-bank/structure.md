# VHS Horror Puzzle Collection - Project Structure

## Directory Organization

### Root Level
```
vhs_horror_puzzles/
├── index.html              # Main application entry point
├── package.json            # Project metadata and dependencies
├── .eslintrc.json         # Code linting configuration
└── README.md              # Project documentation and setup guide
```

### Core Application Structure
```
css/                        # Stylesheets and visual design
├── main.css               # Core application styles
├── vhs-effects.css        # VHS aesthetic effects (scanlines, static)
├── difficulty.css         # Difficulty selection styling
└── games/
    └── connections.css    # Connections game-specific styles

js/                        # JavaScript application logic
├── main.js               # Core application controller and navigation
├── vhs-effects.js        # VHS visual effects and animations
├── avatar-controller.js  # Character video management
├── games/
│   └── connections.js    # Connections puzzle game implementation
└── systems/              # Modular system components
    ├── puzzle-loader.js  # Puzzle data loading and management
    ├── event-manager.js  # Global event handling system
    ├── tape-quality.js   # VHS tape quality simulation
    ├── story-text-renderer.js    # Story narrative display
    ├── counter-renderer.js       # UI counter components
    ├── tape-cover-renderer.js    # VHS tape visual rendering
    └── vhs-tape-renderer.js      # Tape interface rendering
```

### Content and Assets
```
data/                      # Game content and configuration
├── puzzles.json          # All puzzle definitions (connections, wordle, etc.)
├── stories.json          # Story campaigns and narrative content
└── progress.json         # Auto-generated player save data

assets/                   # Media files and resources
├── audio/               # Sound effects and ambient audio
├── characters/          # Character video files and SVG avatars
└── images/             # UI graphics and visual elements
```

## Core Components and Relationships

### Application Flow
1. **Main Controller** (`main.js`) - Orchestrates navigation between screens
2. **Screen Management** - Tape selection → Story/Game mode → Puzzle gameplay
3. **System Integration** - Modular systems handle specific functionality
4. **Data Layer** - JSON files provide content, localStorage manages progress

### Key Architectural Patterns

#### Modular System Design
- **Systems Directory**: Each system handles a specific domain (events, rendering, data)
- **Loose Coupling**: Systems communicate through event manager
- **Single Responsibility**: Each module has a focused purpose

#### Canvas-Based Rendering
- **VHS Tape Rendering**: Custom canvas drawing for authentic tape appearance
- **Story Text Display**: Canvas-based typewriter effects for narrative
- **Visual Effects**: Layered canvas elements for VHS aesthetic

#### Event-Driven Architecture
- **Global Event Manager**: Centralized event handling across components
- **Component Communication**: Systems interact through published events
- **State Management**: Event-driven state changes for game progression

#### Data-Driven Content
- **JSON Configuration**: Puzzles and stories defined in external JSON files
- **Dynamic Loading**: Content loaded and parsed at runtime
- **Extensible Design**: New content added without code changes

## Integration Points
- **HTML Structure**: Semantic layout with screen-based navigation
- **CSS Styling**: Modular stylesheets for different game components
- **JavaScript Modules**: System-based architecture with clear dependencies
- **Asset Pipeline**: Direct file references for media and content