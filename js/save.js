const SAVE_KEY = 'last_camp_protocol_save';

const SaveSystem = {
    saveGame: function() {
        try {
            const stateString = JSON.stringify(window.gameState);
            localStorage.setItem(SAVE_KEY, stateString);
            console.log('Game saved successfully.');
        } catch (e) {
            console.error('Failed to save game', e);
        }
    },

    loadGame: function() {
        try {
            const stateString = localStorage.getItem(SAVE_KEY);
            if (stateString) {
                window.gameState = JSON.parse(stateString);
                console.log('Game loaded successfully.');
                return true;
            }
        } catch (e) {
            console.error('Failed to load game', e);
        }
        return false;
    },

    hasSave: function() {
        return localStorage.getItem(SAVE_KEY) !== null;
    },

    deleteSave: function() {
        localStorage.removeItem(SAVE_KEY);
        console.log('Save deleted.');
    }
};

window.SaveSystem = SaveSystem;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SaveSystem;
}
