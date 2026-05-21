const initialState = {
    day: 1,
    resources: {
        food: 24,
        medicine: 4,
        scrap: 18,
        tools: 2,
        fuel: 0,
        ammo: 6,
        morale: 55,
        security: 30
    },
    buildings: [],
    availableMissions: [],
    activeMissions: [],
    survivors: [
        {
            id: 'survivor_1',
            name: 'Mara Voss',
            health: 100,
            morale: 55,
            fatigue: 20,
            skills: { scavenging: 4, combat: 3, construction: 2, medicine: 1 },
            traits: ['Practical', 'Light Sleeper'],
            current_task: 'Rest',
            status: 'available',
            injuries: []
        },
        {
            id: 'survivor_2',
            name: 'Eli Ward',
            health: 80,
            morale: 60,
            fatigue: 30,
            skills: { scavenging: 1, combat: 1, construction: 1, medicine: 4 },
            traits: ['Medic', 'Sickly'],
            current_task: 'Rest',
            status: 'available',
            injuries: []
        },
        {
            id: 'survivor_3',
            name: 'Jonas Pike',
            health: 100,
            morale: 45,
            fatigue: 10,
            skills: { scavenging: 2, combat: 2, construction: 4, medicine: 0 },
            traits: ['Builder', 'Short Temper'],
            current_task: 'Rest',
            status: 'available',
            injuries: []
        },
        {
            id: 'survivor_4',
            name: 'Rina Vale',
            health: 100,
            morale: 50,
            fatigue: 5,
            skills: { scavenging: 3, combat: 2, construction: 1, medicine: 1 },
            traits: ['Quiet Step', 'Stealthy'],
            current_task: 'Rest',
            status: 'available',
            injuries: []
        },
        {
            id: 'survivor_5',
            name: 'Cal Mercer',
            health: 100,
            morale: 65,
            fatigue: 15,
            skills: { scavenging: 1, combat: 5, construction: 1, medicine: 0 },
            traits: ['Reckless', 'Combat-focused'],
            current_task: 'Rest',
            status: 'available',
            injuries: []
        }
    ]
};

let gameState = JSON.parse(JSON.stringify(initialState));

function advanceDay() {
    let logs = [];
    logs.push(`--- End of Day ${window.gameState.day} ---`);

    // 1. Each survivor consumes food (only alive survivors)
    const aliveSurvivors = window.gameState.survivors.filter(s => s.health > 0).length;
    const foodNeeded = aliveSurvivors * (window.Balance ? window.Balance.foodConsumptionPerSurvivor : 1);

    if (window.gameState.resources.food >= foodNeeded) {
        window.gameState.resources.food -= foodNeeded;
        logs.push(`The camp consumed ${foodNeeded} food.`);
    } else {
        const foodEaten = window.gameState.resources.food;
        window.gameState.resources.food = 0;
        logs.push(`The camp only had ${foodEaten} food. People are starving!`);
        window.gameState.resources.morale -= (window.Balance ? window.Balance.moraleStarvingPenalty : 10);
        logs.push(`Camp morale decreased due to lack of food.`);
    }

    // Check built buildings for passive/modifier effects
    const isBuilt = (id) => {
        if (!window.gameState.buildings) return false;
        const b = window.gameState.buildings.find(b => b.id === id);
        return b && b.built;
    };

    const shelterLevel = isBuilt('shelter') ? window.gameState.buildings.find(b => b.id === 'shelter').level : 0;
    const infirmaryLevel = isBuilt('infirmary') ? window.gameState.buildings.find(b => b.id === 'infirmary').level : 0;
    const watchtowerLevel = isBuilt('watchtower') ? window.gameState.buildings.find(b => b.id === 'watchtower').level : 0;
    const gardenLevel = isBuilt('garden') ? window.gameState.buildings.find(b => b.id === 'garden').level : 0;

    // Passive Watchtower Effect
    if (watchtowerLevel > 0) {
        window.gameState.resources.security += (2 * watchtowerLevel);
    }

    // Passive Garden Effect (assuming someone works it or it just produces passively based on level as per simple GDD)
    if (gardenLevel > 0) {
        const foodProd = gardenLevel * 2;
        window.gameState.resources.food += foodProd;
        logs.push(`The garden produced ${foodProd} food.`);
    }

    // 2. Process tasks
    window.gameState.survivors.forEach(survivor => {
        if (survivor.health <= 0) {
            return; // Dead survivors don't process tasks or heal
        }

        // Apply shelter fatigue reduction to all tasks conceptually, or just reduce base fatigue here
        if (shelterLevel > 0) {
            survivor.fatigue = Math.max(0, survivor.fatigue - (shelterLevel * 2));
        }

        // Injury Healing Mechanics
        if (survivor.health < 100) {
            let healAmount = 0;
            if (survivor.current_task === 'Rest' || survivor.current_task === 'Treat Patients') {
                healAmount += 5;
                if (infirmaryLevel > 0) healAmount += (infirmaryLevel * 5);

                // If we have medicine, consume some to heal faster
                if (window.gameState.resources.medicine > 0 && survivor.health < 80) {
                    window.gameState.resources.medicine -= 1;
                    healAmount += 15;
                    logs.push(`Medicine was used to treat ${survivor.name}.`);
                }
            }
            survivor.health = Math.min(100, survivor.health + healAmount);
        }

        switch (survivor.current_task) {
            case 'Rest':
                let recovery = 15;
                if (infirmaryLevel > 0) recovery += (infirmaryLevel * 5); // Infirmary boosts rest recovery
                survivor.fatigue = Math.max(0, survivor.fatigue - recovery);
                logs.push(`${survivor.name} rested and recovered fatigue.`);
                break;
            case 'Guard':
                window.gameState.resources.security += 5;
                survivor.fatigue += 10;
                logs.push(`${survivor.name} stood guard, increasing camp security.`);
                break;
            case 'Local Scavenge':
                survivor.fatigue += 15;
                const roll = Math.random();
                if (roll < 0.4) {
                    const foodFound = Math.floor(Math.random() * 3) + 1;
                    window.gameState.resources.food += foodFound;
                    logs.push(`${survivor.name} scavenged and found ${foodFound} food.`);
                } else if (roll < 0.8) {
                    const scrapFound = Math.floor(Math.random() * 3) + 1;
                    window.gameState.resources.scrap += scrapFound;
                    logs.push(`${survivor.name} scavenged and found ${scrapFound} scrap.`);
                } else {
                    logs.push(`${survivor.name} scavenged but found nothing.`);
                }
                break;
            case 'Build/Repair':
            case 'Treat Patients':
                survivor.fatigue += 10;
                logs.push(`${survivor.name} worked on camp tasks.`);
                break;
        }
    });

    // 3. Resolve active missions
    if (window.gameState.activeMissions) {
        for (let i = window.gameState.activeMissions.length - 1; i >= 0; i--) {
            const mission = window.gameState.activeMissions[i];
            mission.daysRemaining -= 1;

            if (mission.daysRemaining <= 0) {
                if (window.MissionsLogic) {
                    const missionLogs = window.MissionsLogic.resolveMission(mission);
                    logs = logs.concat(missionLogs);
                }
                window.gameState.activeMissions.splice(i, 1);
            }
        }
    }

    // 4. Apply Storage Caps
    const isBuiltLocal = (id) => {
        if (!window.gameState.buildings) return false;
        const b = window.gameState.buildings.find(b => b.id === id);
        return b && b.built;
    };
    const storageLevel = isBuiltLocal('storage') ? window.gameState.buildings.find(b => b.id === 'storage').level : 0;

    const baseCap = 50;
    const currentCap = baseCap + (storageLevel * 25);

    for (const res of ['food', 'medicine', 'scrap', 'tools', 'fuel', 'ammo']) {
        if (window.gameState.resources[res] > currentCap) {
            window.gameState.resources[res] = currentCap;
            // Optionally log cap reached
            // logs.push(`${res} capacity reached. Excess lost.`);
        }
    }

    // 5. Check for Raids (Happens before random events)
    if (window.RaidsLogic) {
        const raidLogs = window.RaidsLogic.checkForRaid();
        if (raidLogs) {
            logs = logs.concat(raidLogs);
        }
    }

    // 6. Check for random events
    if (window.EventsLogic) {
        const triggeredEvent = window.EventsLogic.checkForRandomEvent();
        if (triggeredEvent) {
            window.EventsLogic.triggerEvent(triggeredEvent);
            logs.push(`A random event occurred: ${triggeredEvent.title}`);
        }
    }

    // 7. Advance Day
    window.gameState.day += 1;
    logs.push(`--- Day ${window.gameState.day} Begins ---`);

    return logs;
}

// We'll expose these globally for the browser environment
window.gameState = gameState;
window.advanceDay = advanceDay;
window.initialState = initialState;

// In a real module system, we would export these, but for this vanilla setup
// we are attaching them to the global window object.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gameState, initialState, advanceDay };
}
