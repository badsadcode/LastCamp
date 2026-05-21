const assert = require('assert');

window = {};
require('./js/balance.js');
assert(window.Balance !== undefined, "Balance object should be loaded.");
assert(window.Balance.foodConsumptionPerSurvivor === 1, "Values should exist.");

console.log("Balance logic tests passed!");
