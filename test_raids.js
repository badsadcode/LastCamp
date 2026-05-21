const assert = require('assert');

// Mock browser environment
window = {
    gameState: null,
    Balance: { baseRaidChance: 1.0 }, // Force raid
    UI: { addLogMessage: () => {} }
};

// Load modules
require('./js/state.js');
require('./js/raids.js');

// Reset state
window.gameState = JSON.parse(JSON.stringify(window.initialState));
window.gameState.day = 5; // Day > 3 to allow raids
window.gameState.resources.security = 0; // Ensure weak defense
window.gameState.resources.food = 100; // Give resources to steal

const logs = window.RaidsLogic.resolveRaid();

assert(logs.join('').includes("RAID!"), "Raid should occur and be logged.");
assert(window.gameState.resources.morale < 55, "Morale should decrease on failed defense.");

console.log("Raid logic tests passed!");
