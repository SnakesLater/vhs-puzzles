// Cleanup Manager - Centralized resource cleanup
class CleanupManager {
    constructor() {
        this.listeners = new Map();
        this.timers = new Set();
        this.animations = new Set();
    }

    // Track event listeners for cleanup
    addListener(element, event, handler, options) {
        const key = `${element.constructor.name}_${event}`;
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push({ element, event, handler, options });
        element.addEventListener(event, handler, options);
    }

    // Track timers for cleanup
    addTimer(timerId) {
        this.timers.add(timerId);
        return timerId;
    }

    // Track animations for cleanup
    addAnimation(animationId) {
        this.animations.add(animationId);
        return animationId;
    }

    // Clean up specific event type
    cleanupListeners(eventType) {
        if (this.listeners.has(eventType)) {
            this.listeners.get(eventType).forEach(({ element, event, handler }) => {
                element.removeEventListener(event, handler);
            });
            this.listeners.delete(eventType);
        }
    }

    // Clean up all resources
    cleanupAll() {
        // Clear event listeners
        this.listeners.forEach((listeners, key) => {
            listeners.forEach(({ element, event, handler }) => {
                element.removeEventListener(event, handler);
            });
        });
        this.listeners.clear();

        // Clear timers
        this.timers.forEach(timerId => {
            clearTimeout(timerId);
            clearInterval(timerId);
        });
        this.timers.clear();

        // Clear animations
        this.animations.forEach(animationId => {
            cancelAnimationFrame(animationId);
        });
        this.animations.clear();
    }
}

const cleanupManager = new CleanupManager();