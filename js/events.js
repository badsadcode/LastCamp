const EventsLogic = {
    loadEvents: async function() {
        if (!window.gameState.eventsPool) {
            try {
                const isNode = typeof process !== 'undefined' && process.release.name === 'node';
                if (isNode) {
                    const fs = require('fs');
                    const path = require('path');
                    const data = fs.readFileSync(path.join(__dirname, '../data/events.json'), 'utf8');
                    window.gameState.eventsPool = JSON.parse(data);
                } else {
                    const response = await fetch('data/events.json');
                    const data = await response.json();
                    window.gameState.eventsPool = data;
                }
            } catch (e) {
                console.error("Failed to load events data.", e);
            }
        }
    },

    checkForRandomEvent: function() {
        if (!window.gameState.eventsPool) return null;

        // Don't trigger if one is already active (we only support one per day right now)
        if (window.gameState.activeEvent) return null;

        const possibleEvents = window.gameState.eventsPool.filter(e => {
            if (e.triggerConditions) {
                if (e.triggerConditions.dayMin && window.gameState.day < e.triggerConditions.dayMin) {
                    return false;
                }
            }
            return true;
        });

        // Basic randomization
        for (const event of possibleEvents) {
            const chance = event.triggerConditions.chance || 0.1;
            const roll = Math.random();
            // Lower morale increases event chance slightly in this prototype
            const moralePenalty = (100 - window.gameState.resources.morale) * 0.001;
            if (roll < (chance + moralePenalty)) {
                return event;
            }
        }

        return null;
    },

    triggerEvent: function(event) {
        window.gameState.activeEvent = event;
        if (window.UI) {
            window.UI.renderEventModal(event);
        }
    },

    resolveEventChoice: function(choiceIndex) {
        const event = window.gameState.activeEvent;
        if (!event) return;

        const choice = event.choices[choiceIndex];
        if (choice && choice.effects) {
            let logMsg = `Event "${event.title}" resolved: ${choice.text} `;
            for (const [res, change] of Object.entries(choice.effects)) {
                // Apply change
                if (window.gameState.resources[res] !== undefined) {
                    window.gameState.resources[res] += change;

                    // Simple bounds clamping
                    if (res === 'morale' || res === 'security') {
                        window.gameState.resources[res] = Math.max(0, Math.min(100, window.gameState.resources[res]));
                    } else {
                        window.gameState.resources[res] = Math.max(0, window.gameState.resources[res]);
                    }
                }
            }

            if (window.UI && window.UI.addLogMessage) {
                window.UI.addLogMessage(logMsg);
            }
        }

        // Clear active event
        window.gameState.activeEvent = null;

        if (window.UI) {
            window.UI.hideEventModal();
            window.UI.renderAll();
        }

        if (window.SaveSystem) {
            window.SaveSystem.saveGame();
        }
    }
};

window.EventsLogic = EventsLogic;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventsLogic;
}