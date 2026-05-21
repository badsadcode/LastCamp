const assert = require('assert');

// Mock window and logic
window = {
    gameState: {
        availableMissions: [
            { id: "m1", name: "Mission 1" },
            { id: "m2", name: "Mission 2" }
        ]
    }
};

require('./js/map.js');

window.MapLogic.generateMap();
assert(window.gameState.mapNodes, "Map nodes should be generated");
assert.equal(window.gameState.mapNodes.length, 3, "Should have home node + 2 mission nodes");

const t1 = window.MapLogic.getTravelTime("m1");
assert(t1 >= 1, "Travel time should be calculated and >= 1");

console.log("Map generation tests passed!");
