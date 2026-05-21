const assert = require('assert');

// Mock localStorage
const store = {};
window = {
    gameState: { day: 1, testKey: "test" },
    localStorage: {
        setItem: (key, val) => { store[key] = val; },
        getItem: (key) => store[key] || null,
        removeItem: (key) => { delete store[key]; }
    }
};
global.localStorage = window.localStorage;

require('./js/save.js');

window.SaveSystem.saveGame();
assert(store['last_camp_protocol_save'], "Should save to mock storage");

window.gameState = null; // Clear state
window.SaveSystem.loadGame();
assert.equal(window.gameState.day, 1, "Should load state");

window.SaveSystem.deleteSave();
assert(!store['last_camp_protocol_save'], "Should delete save");

console.log("Save system tests passed!");
