const BuildingsLogic = {
    loadBuildings: async function() {
        if (!window.gameState.buildings || window.gameState.buildings.length === 0) {
            try {
                // Determine path based on environment (node test or browser)
                const isNode = typeof process !== 'undefined' && process.release.name === 'node';
                if (isNode) {
                    const fs = require('fs');
                    const path = require('path');
                    const data = fs.readFileSync(path.join(__dirname, '../data/buildings.json'), 'utf8');
                    window.gameState.buildings = JSON.parse(data);
                } else {
                    const response = await fetch('data/buildings.json');
                    const data = await response.json();
                    window.gameState.buildings = data;
                }
            } catch (e) {
                console.error("Failed to load buildings data.", e);
            }
        }
    },

    canAfford: function(costObj) {
        for (const [resource, cost] of Object.entries(costObj)) {
            if (window.gameState.resources[resource] < cost) {
                return false;
            }
        }
        return true;
    },

    payCost: function(costObj) {
        for (const [resource, cost] of Object.entries(costObj)) {
            window.gameState.resources[resource] -= cost;
        }
    },

    buildStructure: function(buildingId) {
        const building = window.gameState.buildings.find(b => b.id === buildingId);
        if (!building) return false;

        if (!building.built) {
            if (this.canAfford(building.buildCost)) {
                this.payCost(building.buildCost);
                building.built = true;
                building.level = 1;

                // If UI log is available
                if (window.UI && window.UI.addLogMessage) {
                    window.UI.addLogMessage(`Built ${building.name}.`);
                }
                return true;
            }
        }
        return false;
    },

    upgradeStructure: function(buildingId) {
        const building = window.gameState.buildings.find(b => b.id === buildingId);
        if (!building) return false;

        if (building.built && building.level < building.maxLevel) {
            if (this.canAfford(building.upgradeCost)) {
                this.payCost(building.upgradeCost);
                building.level += 1;

                if (window.UI && window.UI.addLogMessage) {
                    window.UI.addLogMessage(`Upgraded ${building.name} to level ${building.level}.`);
                }
                return true;
            }
        }
        return false;
    }
};

window.BuildingsLogic = BuildingsLogic;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BuildingsLogic;
}
