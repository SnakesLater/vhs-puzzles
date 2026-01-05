// Event Manager - Centralized event system to replace global callbacks
class EventManager {
    constructor() {
        this.events = {};
    }

    // Register an event listener
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    // Remove an event listener
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    // Emit an event with data
    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event ${event} callback:`, error);
            }
        });
    }

    // Clear all listeners for an event
    clear(event) {
        delete this.events[event];
    }

    // Get listener count for debugging
    getListenerCount(event) {
        return this.events[event] ? this.events[event].length : 0;
    }
}

// Global event manager instance
const eventManager = new EventManager();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = eventManager;
}