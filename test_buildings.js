const assert = require('assert');

// Mock browser
global.window = {};

// Load modules
const stateModule = require('./js/state.js');
global.window.gameState = stateModule.gameState;
global.window.initialState = stateModule.initialState;
global.window.advanceDay = stateModule.advanceDay || global.advanceDay;
if (typeof global.window.advanceDay !== 'function') {
    global.window.advanceDay = global.advanceDay;
}

const buildingsLogicModule = require('./js/buildings.js');
global.window.BuildingsLogic = buildingsLogicModule;

async function runTests() {
    console.log("Loading buildings...");
    await window.BuildingsLogic.loadBuildings();

    assert(window.gameState.buildings.length > 0, "Buildings should have loaded");

    // Test building action
    const oldScrap = window.gameState.resources.scrap;
    const oldTools = window.gameState.resources.tools;

    // Attempt to build watchtower
    // Watchtower cost is scrap: 25, tools: 2. Initial state has scrap 18, tools 2.
    // Give ourselves some resources to build it and a garden
    window.gameState.resources.scrap = 100;
    window.gameState.resources.tools = 100;

    // Build Watchtower
    const builtWT = window.BuildingsLogic.buildStructure('watchtower');
    assert(builtWT === true, "Should have built watchtower");

    const wt = window.gameState.buildings.find(b => b.id === 'watchtower');
    assert(wt.built === true, "Watchtower built flag should be true");
    assert(wt.level === 1, "Watchtower level should be 1");

    // Build Garden
    window.gameState.resources.food = 10;
    const builtGarden = window.BuildingsLogic.buildStructure('garden');
    assert(builtGarden === true, "Should have built garden");

    const initialSecurity = window.gameState.resources.security;
    const initialFood = window.gameState.resources.food;

    // Advance day
    window.advanceDay();

    // Security should go up by 2 passively from level 1 watchtower
    // But Eli is also guarding by default? Let's check Eli's task:
    const eli = window.gameState.survivors.find(s => s.id === 'survivor_2');
    const eliGuarding = eli.current_task === 'Guard' ? 5 : 0;

    // Security expected: initial + 2 (passive) + eli (if guard)
    const expectedSecurity = initialSecurity + 2 + eliGuarding;
    assert.strictEqual(window.gameState.resources.security, expectedSecurity, "Security should increase from watchtower (and possibly guard)");

    // Food expected: initial - 5 (consumption) + 2 (garden passive)
    const expectedFood = initialFood - 5 + 2;
    assert(window.gameState.resources.food >= expectedFood, "Food should have passive production from garden");

    console.log("Buildings end-to-end tests passed!");
}

runTests().catch(console.error);