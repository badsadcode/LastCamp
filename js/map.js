const MapLogic = {
    // Map dimensions (for conceptual calculation)
    mapWidth: 800,
    mapHeight: 600,

    // Home camp is always in the center
    homeNode: { x: 400, y: 300, id: 'home', name: 'Home Camp', type: 'camp' },

    generateMap: function() {
        if (!window.gameState.mapNodes) {
            window.gameState.mapNodes = [this.homeNode];
        }

        // We only want to generate nodes if they haven't been generated yet
        if (window.gameState.mapNodes.length === 1 && window.gameState.availableMissions) {
            window.gameState.availableMissions.forEach(mission => {
                // Ensure we don't generate duplicate map nodes for the same mission
                if (!window.gameState.mapNodes.find(n => n.missionId === mission.id)) {
                    const node = this.createNodeForMission(mission);
                    window.gameState.mapNodes.push(node);

                    // Update the mission's duration based on distance
                    mission.duration = node.travelDays;
                }
            });
            console.log("Map nodes generated.");
        }
    },

    createNodeForMission: function(mission) {
        let x, y, dist;
        let valid = false;

        // Attempt to find a suitable location not too close to other nodes
        let attempts = 0;
        while (!valid && attempts < 50) {
            // Generate random position, keeping away from edges
            const margin = 50;
            x = margin + Math.random() * (this.mapWidth - margin * 2);
            y = margin + Math.random() * (this.mapHeight - margin * 2);

            // Check distance from home
            const dxHome = x - this.homeNode.x;
            const dyHome = y - this.homeNode.y;
            dist = Math.sqrt(dxHome * dxHome + dyHome * dyHome);

            // Minimum distance from home
            if (dist < 80) {
                attempts++;
                continue;
            }

            // Minimum distance from other nodes
            let tooClose = false;
            for (let node of window.gameState.mapNodes) {
                const dx = x - node.x;
                const dy = y - node.y;
                if (Math.sqrt(dx * dx + dy * dy) < 60) {
                    tooClose = true;
                    break;
                }
            }

            if (!tooClose) {
                valid = true;
            }
            attempts++;
        }

        // Convert euclidean pixel distance to travel days (e.g., 1 day per 100 pixels)
        const travelDays = Math.max(1, Math.ceil(dist / 120));

        return {
            id: 'node_' + mission.id,
            missionId: mission.id,
            name: mission.name,
            x: x,
            y: y,
            distance: dist,
            travelDays: travelDays,
            type: 'mission'
        };
    },

    getTravelTime: function(missionId) {
        if (!window.gameState.mapNodes) return 1;
        const node = window.gameState.mapNodes.find(n => n.missionId === missionId);
        return node ? node.travelDays : 1;
    }
};

window.MapLogic = MapLogic;
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapLogic;
}
