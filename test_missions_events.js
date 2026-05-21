const assert = require('assert');

global.window = {};

const stateModule = require('./js/state.js');
global.window.gameState = stateModule.gameState;
global.window.initialState = stateModule.initialState;
global.window.advanceDay = stateModule.advanceDay || global.advanceDay;
if (typeof global.window.advanceDay !== 'function') {
    global.window.advanceDay = global.advanceDay;
}

const missionsLogicModule = require('./js/missions.js');
global.window.MissionsLogic = missionsLogicModule;

const eventsLogicModule = require('./js/events.js');
global.window.EventsLogic = eventsLogicModule;

async function runTests() {
    console.log("Loading modules...");
    await window.MissionsLogic.loadMissions();
    await window.EventsLogic.loadEvents();

    assert(window.gameState.availableMissions.length > 0, "Missions loaded");
    assert(window.gameState.eventsPool.length > 0, "Events loaded");

    // Test Mission
    const survivor1 = window.gameState.survivors[0]; // Mara
    window.MissionsLogic.assignSurvivorToMission(survivor1.id, 'mission_abandoned_store');

    const sent = window.MissionsLogic.sendMission('mission_abandoned_store');
    assert(sent === true, "Should be able to send mission");
    assert(survivor1.status === 'on_mission', "Survivor should be on mission");
    assert(window.gameState.activeMissions.length === 1, "Should have 1 active mission");

    // Force an event to trigger
    const theEvent = window.gameState.eventsPool.find(e => e.id === 'food_theft');
    // Mock the chance check to guarantee trigger
    const originalCheck = window.EventsLogic.checkForRandomEvent;
    window.EventsLogic.checkForRandomEvent = function() { return theEvent; };

    // Simulate day advance
    window.advanceDay();

    // Mission takes 1 day, so it should be resolved
    assert(window.gameState.activeMissions.length === 0, "Mission should be resolved");
    assert(survivor1.status === 'available', "Survivor should be back");

    // Event should be active
    assert(window.gameState.activeEvent.id === 'food_theft', "Food theft event should be active");

    // Test Injury Healing
    const survivor2 = window.gameState.survivors[1]; // Eli
    survivor2.health = 50;
    survivor2.current_task = 'Rest';

    // Advance day to test healing (bypassing event block since we are testing state logic directly)
    const oldHealth = survivor2.health;
    const oldMed = window.gameState.resources.medicine;
    window.advanceDay();

    // Healing should have happened (+5 base, +15 for medicine because health < 80 and med > 0)
    assert(survivor2.health > oldHealth, "Health should increase");
    assert(window.gameState.resources.medicine === oldMed - 1, "Medicine should be consumed");

    // Resolve event manually
    const initialMorale = window.gameState.resources.morale;
    window.EventsLogic.resolveEventChoice(0); // Forgive: Morale +5

    // The previous advanceDay triggers the event again because we mocked checkForRandomEvent
    // But let's just check the effect of resolving it
    assert(window.gameState.activeEvent === null, "Event should be cleared after resolution");

    console.log("Missions & Events End-to-End tests passed!");
}

runTests().catch(console.error);