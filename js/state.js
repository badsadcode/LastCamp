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
    survivors: [
        {
            id: 'survivor_1',
            name: 'Mara Voss',
            health: 100,
            morale: 55,
            fatigue: 20,
            skills: { scavenging: 4, combat: 3, construction: 2, medicine: 1 },
            traits: ['Practical', 'Light Sleeper'],
            current_task: 'Rest'
        },
        {
            id: 'survivor_2',
            name: 'Eli Ward',
            health: 80,
            morale: 60,
            fatigue: 30,
            skills: { scavenging: 1, combat: 1, construction: 1, medicine: 4 },
            traits: ['Medic', 'Sickly'],
            current_task: 'Rest'
        },
        {
            id: 'survivor_3',
            name: 'Jonas Pike',
            health: 100,
            morale: 45,
            fatigue: 10,
            skills: { scavenging: 2, combat: 2, construction: 4, medicine: 0 },
            traits: ['Builder', 'Short Temper'],
            current_task: 'Rest'
        },
        {
            id: 'survivor_4',
            name: 'Rina Vale',
            health: 100,
            morale: 50,
            fatigue: 5,
            skills: { scavenging: 3, combat: 2, construction: 1, medicine: 1 },
            traits: ['Quiet Step', 'Stealthy'],
            current_task: 'Rest'
        },
        {
            id: 'survivor_5',
            name: 'Cal Mercer',
            health: 100,
            morale: 65,
            fatigue: 15,
            skills: { scavenging: 1, combat: 5, construction: 1, medicine: 0 },
            traits: ['Reckless', 'Combat-focused'],
            current_task: 'Rest'
        }
    ]
};

let gameState = JSON.parse(JSON.stringify(initialState));

function advanceDay() {
    let logs = [];
    logs.push(`--- End of Day ${gameState.day} ---`);

    // 1. Each survivor consumes 1 food
    const numSurvivors = gameState.survivors.length;
    if (gameState.resources.food >= numSurvivors) {
        gameState.resources.food -= numSurvivors;
        logs.push(`The camp consumed ${numSurvivors} food.`);
    } else {
        const foodEaten = gameState.resources.food;
        gameState.resources.food = 0;
        logs.push(`The camp only had ${foodEaten} food. People are starving!`);
        gameState.resources.morale -= 10;
        logs.push(`Camp morale decreased due to lack of food.`);
    }

    // Check built buildings for passive/modifier effects
    const isBuilt = (id) => {
        const b = gameState.buildings.find(b => b.id === id);
        return b && b.built;
    };

    const shelterLevel = isBuilt('shelter') ? gameState.buildings.find(b => b.id === 'shelter').level : 0;
    const infirmaryLevel = isBuilt('infirmary') ? gameState.buildings.find(b => b.id === 'infirmary').level : 0;
    const watchtowerLevel = isBuilt('watchtower') ? gameState.buildings.find(b => b.id === 'watchtower').level : 0;
    const gardenLevel = isBuilt('garden') ? gameState.buildings.find(b => b.id === 'garden').level : 0;

    // Passive Watchtower Effect
    if (watchtowerLevel > 0) {
        gameState.resources.security += (2 * watchtowerLevel);
    }

    // Passive Garden Effect (assuming someone works it or it just produces passively based on level as per simple GDD)
    if (gardenLevel > 0) {
        const foodProd = gardenLevel * 2;
        gameState.resources.food += foodProd;
        logs.push(`The garden produced ${foodProd} food.`);
    }

    // 2. Process tasks
    gameState.survivors.forEach(survivor => {
        // Apply shelter fatigue reduction to all tasks conceptually, or just reduce base fatigue here
        if (shelterLevel > 0) {
            survivor.fatigue = Math.max(0, survivor.fatigue - (shelterLevel * 2));
        }

        switch (survivor.current_task) {
            case 'Rest':
                let recovery = 15;
                if (infirmaryLevel > 0) recovery += (infirmaryLevel * 5); // Infirmary boosts rest recovery
                survivor.fatigue = Math.max(0, survivor.fatigue - recovery);
                logs.push(`${survivor.name} rested and recovered fatigue.`);
                break;
            case 'Guard':
                gameState.resources.security += 5;
                survivor.fatigue += 10;
                logs.push(`${survivor.name} stood guard, increasing camp security.`);
                break;
            case 'Local Scavenge':
                survivor.fatigue += 15;
                const roll = Math.random();
                if (roll < 0.4) {
                    const foodFound = Math.floor(Math.random() * 3) + 1;
                    gameState.resources.food += foodFound;
                    logs.push(`${survivor.name} scavenged and found ${foodFound} food.`);
                } else if (roll < 0.8) {
                    const scrapFound = Math.floor(Math.random() * 3) + 1;
                    gameState.resources.scrap += scrapFound;
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

    // 3. Apply Storage Caps
    const isBuiltLocal = (id) => {
        const b = gameState.buildings.find(b => b.id === id);
        return b && b.built;
    };
    const storageLevel = isBuiltLocal('storage') ? gameState.buildings.find(b => b.id === 'storage').level : 0;

    const baseCap = 50;
    const currentCap = baseCap + (storageLevel * 25);

    for (const res of ['food', 'medicine', 'scrap', 'tools', 'fuel', 'ammo']) {
        if (gameState.resources[res] > currentCap) {
            gameState.resources[res] = currentCap;
            // Optionally log cap reached
            // logs.push(`${res} capacity reached. Excess lost.`);
        }
    }

    // 4. Advance Day
    gameState.day += 1;
    logs.push(`--- Day ${gameState.day} Begins ---`);

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
