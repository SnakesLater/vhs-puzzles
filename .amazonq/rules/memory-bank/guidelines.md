# VHS Horror Puzzle Collection - Development Guidelines

## Code Quality Standards

### JavaScript Conventions
- **ES6+ Features**: Use modern JavaScript (classes, async/await, arrow functions, template literals)
- **Semicolon Usage**: Consistent semicolon termination for all statements
- **Indentation**: 4-space indentation throughout the codebase
- **Variable Naming**: camelCase for variables and functions, PascalCase for classes
- **String Literals**: Template literals preferred for multi-line strings and interpolation

### Code Structure Patterns
- **Class-Based Architecture**: All major components implemented as ES6 classes
- **Constructor Initialization**: Initialize all properties in constructor with clear defaults
- **Method Organization**: Public methods first, private/helper methods last
- **Error Handling**: Try-catch blocks for async operations with fallback mechanisms

### Documentation Standards
- **Inline Comments**: Descriptive comments for complex logic and business rules
- **Function Headers**: Brief comments describing purpose for non-obvious methods
- **TODO Comments**: Clear action items for future development
- **Console Logging**: Informative console messages for debugging and status updates

## Architectural Patterns

### Event-Driven Communication
```javascript
// Global event manager for component communication
eventManager.emit('gameComplete', won);
eventManager.on('rewindRequested', () => { /* handler */ });
eventManager.clear('gameComplete'); // Cleanup listeners
```

### System-Based Modular Design
- **Single Responsibility**: Each system handles one specific domain (events, rendering, data)
- **Dependency Injection**: Systems receive dependencies through parameters or global instances
- **Global Instances**: Core systems exposed as global variables (vhsEffects, puzzleLoader, tapeQualitySystem)

### Canvas Rendering Pipeline
```javascript
// Standard canvas setup pattern
this.canvas = document.getElementById('canvas-id');
this.ctx = this.canvas.getContext('2d');
this.canvas.width = desiredWidth;
this.canvas.height = desiredHeight;
```

### Async Data Loading with Fallbacks
```javascript
// Primary fetch with XMLHttpRequest fallback
try {
    const response = await fetch('data/file.json');
    const data = await response.json();
} catch (error) {
    // Fallback to XMLHttpRequest for compatibility
    const data = await this.loadJSON('data/file.json');
}
```

## Common Implementation Patterns

### DOM Element Management
```javascript
// Consistent DOM element caching
const elements = {
    container: document.getElementById('container-id'),
    button: document.querySelector('.button-class')
};

// Event listener setup with arrow functions
elements.button.addEventListener('click', () => this.handleClick());
```

### State Management
- **Local State**: Component state stored as class properties
- **Global State**: Game state managed in main.js with clear variable naming
- **Persistence**: LocalStorage for save data with JSON serialization
- **State Reset**: Explicit reset methods for component cleanup

### Animation and Effects
```javascript
// RequestAnimationFrame for smooth animations
const animate = () => {
    // Update logic
    requestAnimationFrame(animate);
};
requestAnimationFrame(animate);

// Timeout-based effects with cleanup
this.currentTimeout = setTimeout(() => {
    // Effect logic
}, duration);
```

### Audio System Integration
```javascript
// Audio with error handling and browser compatibility
try {
    this.audio = new Audio('path/to/file.mp3');
    this.audio.volume = 0.5;
    this.audio.play().catch(e => console.log('Audio play failed:', e.message));
} catch (e) {
    console.warn('Audio not available:', e);
}
```

## Game-Specific Patterns

### Puzzle Game Structure
- **Constructor Pattern**: Accept containerId and puzzle data
- **Render Method**: Generate HTML structure with template literals
- **Event Setup**: Separate method for event listener initialization
- **State Updates**: Dedicated methods for UI state synchronization

### VHS Effects Integration
```javascript
// Standard effect calls
vhsEffects.playClick();     // User interactions
vhsEffects.playError();     // Error states
vhsEffects.playSuccess();   // Success states
vhsEffects.shake();         // Visual feedback
```

### Timer Implementation
```javascript
// Standard timer pattern with cleanup
this.timer = setInterval(() => {
    this.timeRemaining--;
    // Update UI
    if (this.timeRemaining <= 0) {
        clearInterval(this.timer);
        // Handle timeout
    }
}, 1000);
```

## Error Handling and Debugging

### Graceful Degradation
- **Audio Failures**: Continue gameplay without audio if unavailable
- **Data Loading**: Provide fallback mechanisms for network issues
- **Browser Compatibility**: Handle missing APIs with feature detection

### Console Logging Strategy
```javascript
console.log('Status updates for successful operations');
console.warn('Non-critical issues that don't break functionality');
console.error('Critical errors that affect gameplay');
```

### Cleanup Patterns
```javascript
// Component cleanup on navigation
if (this.timer) {
    clearInterval(this.timer);
    this.timer = null;
}
eventManager.clear('eventName');
```

## Performance Considerations

### Memory Management
- **Event Listener Cleanup**: Remove listeners when components are destroyed
- **Timer Cleanup**: Clear intervals and timeouts on component destruction
- **Canvas Optimization**: Efficient redraw cycles with dirty region updates

### Asset Loading
- **On-Demand Loading**: Load assets when needed rather than upfront
- **Error Recovery**: Graceful handling of missing or corrupted assets
- **Browser Caching**: Leverage browser caching for repeated asset requests