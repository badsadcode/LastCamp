const RaidsLogic = {
    checkForRaid: function() {
        // Base chance starts after day 3
        if (window.gameState.day < 3) return null;

        let raidChance = window.Balance ? window.Balance.baseRaidChance : 0.15;

        // Security reduces chance
        raidChance -= (window.gameState.resources.security / 200);

        // Resource wealth increases chance
        const totalResources = window.gameState.resources.food + window.gameState.resources.scrap + window.gameState.resources.medicine;
        raidChance += (totalResources / 500);

        // Minimum and maximum chance
        raidChance = Math.max(0.05, Math.min(0.5, raidChance));

        if (Math.random() < raidChance) {
            return this.resolveRaid();
        }

        return null; // No raid
    },

    resolveRaid: function() {
        let logs = [];
        logs.push("--- RAID! The camp is being attacked! ---");

        let defenseScore = window.gameState.resources.security;

        // Add guard bonus
        const guards = window.gameState.survivors.filter(s => s.current_task === 'Guard' && s.health > 0);
        let guardScore = 0;
        guards.forEach(g => {
            guardScore += (g.skills.combat || 1) * 5;
            // Ammo usage
            if (window.gameState.resources.ammo > 0) {
                window.gameState.resources.ammo -= 1;
                guardScore += 10;
                logs.push(`${g.name} used ammo to defend the camp.`);
            }
        });
        defenseScore += guardScore;

        // Watchtower bonus
        const watchtower = window.gameState.buildings.find(b => b.id === 'watchtower');
        if (watchtower && watchtower.built) {
            defenseScore += watchtower.level * 10;
        }

        // Raid strength increases with days
        let raidStrength = 20 + (window.gameState.day * 2) + Math.floor(Math.random() * 20);

        logs.push(`Defense Score: ${defenseScore} vs Raid Strength: ${raidStrength}`);

        if (defenseScore >= raidStrength) {
            logs.push("The raid was successfully repelled without major losses.");
            window.gameState.resources.morale += 5;
            logs.push("Camp morale increased from a successful defense.");
        } else {
            logs.push("The camp's defenses were breached!");
            window.gameState.resources.morale -= 15;

            // Resource loss
            const stolenFood = Math.floor(window.gameState.resources.food * 0.2);
            const stolenScrap = Math.floor(window.gameState.resources.scrap * 0.2);
            window.gameState.resources.food -= stolenFood;
            window.gameState.resources.scrap -= stolenScrap;
            if (stolenFood > 0 || stolenScrap > 0) {
                logs.push(`Raiders stole ${stolenFood} food and ${stolenScrap} scrap.`);
            }

            // Injury chance for guards first, then others
            const aliveSurvivors = window.gameState.survivors.filter(s => s.health > 0);
            if (aliveSurvivors.length > 0) {
                // Pick a random survivor to injure
                const target = aliveSurvivors[Math.floor(Math.random() * aliveSurvivors.length)];
                const damage = 20 + Math.floor(Math.random() * 30);
                target.health -= damage;
                target.injuries.push("Combat Wound");
                logs.push(`${target.name} was injured in the raid (Lost ${damage} HP).`);

                if (target.health <= 0) {
                    target.health = 0;
                    target.status = 'dead';
                    logs.push(`${target.name} was killed during the raid!`);
                }
            }

            // Building damage chance
            const builtBuildings = window.gameState.buildings.filter(b => b.built);
            if (builtBuildings.length > 0 && Math.random() < 0.3) {
                const bTarget = builtBuildings[Math.floor(Math.random() * builtBuildings.length)];
                // For MVP, just log it. Maybe downgrade level or require repair.
                // Downgrade level or unbuild if level 1
                if (bTarget.level > 1) {
                    bTarget.level -= 1;
                    logs.push(`The ${bTarget.name} was damaged and lost a level.`);
                } else {
                    bTarget.built = false;
                    bTarget.level = 0;
                    logs.push(`The ${bTarget.name} was completely destroyed!`);
                }
            }
        }

        // Security drops after a raid
        window.gameState.resources.security = Math.max(0, window.gameState.resources.security - 10);

        return logs;
    }
};

window.RaidsLogic = RaidsLogic;
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RaidsLogic;
}
