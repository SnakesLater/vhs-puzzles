# VHS Horror Puzzle Collection - Technology Stack

## Programming Languages and Versions
- **HTML5**: Semantic markup with canvas elements for custom rendering
- **CSS3**: Modern styling with custom properties, animations, and grid layouts
- **JavaScript (ES6+)**: Vanilla JavaScript with modern features (modules, classes, async/await)
- **JSON**: Data configuration for puzzles, stories, and game content

## Core Technologies

### Frontend Framework
- **Vanilla JavaScript**: No external frameworks - pure DOM manipulation and canvas rendering
- **HTML5 Canvas**: Custom graphics rendering for VHS effects and tape interfaces
- **CSS Grid/Flexbox**: Responsive layout system for different screen sections
- **Web Audio API**: Audio playback for sound effects and ambient audio

### Development Tools
- **ESLint**: Code linting and style enforcement (configured in `.eslintrc.json`)
- **Package.json**: Project metadata and script management
- **Git**: Version control with `.gitignore` for build artifacts

### Browser APIs Used
- **LocalStorage**: Player progress persistence and save data
- **Canvas 2D Context**: Custom graphics rendering and animations
- **HTML5 Video**: Character avatar playback with loop and autoplay
- **Fetch API**: JSON data loading for puzzles and stories
- **CSS Custom Properties**: Dynamic theming and VHS effect parameters

## Build System and Dependencies

### Development Dependencies
```json
{
  "eslint": "^9.39.2"
}
```

### Development Scripts
```json
{
  "start": "python -m http.server 8000",
  "lint": "echo 'No linter configured yet'",
  "test": "echo 'No tests configured yet'"
}
```

### Local Development Setup
1. **HTTP Server**: Python's built-in server for local development
2. **Port 8000**: Default development server port
3. **File Serving**: Static file serving for assets and content

## Architecture Patterns

### Module System
- **ES6 Modules**: Import/export syntax for code organization
- **System-Based Architecture**: Modular components in `js/systems/` directory
- **Dependency Injection**: Systems receive dependencies through parameters

### Canvas Rendering Pipeline
- **2D Context**: All custom graphics use Canvas 2D API
- **Animation Frames**: `requestAnimationFrame` for smooth animations
- **Layered Rendering**: Multiple canvas elements for different visual layers

### Event System
- **Custom Event Manager**: Centralized event handling across components
- **DOM Events**: Standard browser events for user interactions
- **State Management**: Event-driven state changes and component updates

## Performance Considerations
- **Asset Preloading**: Audio and video files loaded on demand
- **Canvas Optimization**: Efficient redraw cycles and dirty region updates
- **Memory Management**: Proper cleanup of event listeners and timers
- **Modular Loading**: JavaScript files loaded in dependency order

## Browser Compatibility
- **Modern Browsers**: Requires ES6+ support (Chrome 60+, Firefox 55+, Safari 12+)
- **Canvas Support**: HTML5 Canvas 2D context required
- **Video Playback**: HTML5 video with MP4 support
- **LocalStorage**: Browser storage API for save data persistence

## Development Commands
- **Start Server**: `npm start` (launches Python HTTP server on port 8000)
- **Linting**: `npm run lint` (placeholder for future ESLint integration)
- **Testing**: `npm test` (placeholder for future test framework)