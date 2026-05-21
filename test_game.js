const assert = require('assert');

// Mock a browser environment
global.window = {};

// Load modules
const stateModule = require('./js/state.js');
global.window.gameState = stateModule.gameState;
global.window.initialState = stateModule.initialState;
global.window.advanceDay = stateModule.advanceDay || global.advanceDay;

if (typeof global.window.advanceDay !== 'function') {
    // some manual binding just in case
    global.window.advanceDay = global.advanceDay;
}

// Ensure the state starts correctly
assert.strictEqual(window.gameState.day, 1, 'Initial day should be 1');
assert.strictEqual(window.gameState.resources.food, 24, 'Initial food should be 24');

// Simulate changing a task
const survivor1 = window.gameState.survivors.find(s => s.id === 'survivor_1'); // Mara
const survivor2 = window.gameState.survivors.find(s => s.id === 'survivor_2'); // Eli

assert(survivor1.current_task === 'Rest', 'Initial task should be Rest');

survivor1.current_task = 'Local Scavenge';
survivor2.current_task = 'Guard';

const oldSecurity = window.gameState.resources.security;
const oldFatigueS1 = survivor1.fatigue;

// Advance the day
const logs = window.advanceDay();

// Assertions after advanceDay
assert.strictEqual(window.gameState.day, 2, 'Day should have advanced to 2');
// Note: Local Scavenge can add 1-3 food if the 40% roll hits, so food is >= 19.
assert(window.gameState.resources.food >= 19, 'Food should decrease by 5 initially, but scavenging might increase it');
assert.strictEqual(window.gameState.resources.security, oldSecurity + 5, 'Security should have increased by 5 due to Eli guarding');
assert.strictEqual(survivor1.fatigue, oldFatigueS1 + 15, 'Mara fatigue should increase by 15 due to scavenging');
assert(logs.length > 0, 'Logs should have been generated');

console.log("End-to-End tests passed successfully!");
