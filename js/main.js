document.addEventListener('DOMContentLoaded', () => {
    // If there is a save system, we will load it here later
    // Load and render initial state
    if (window.SaveSystem && window.SaveSystem.hasSave()) {
        window.SaveSystem.loadGame();
    }

    UI.renderAll();
    UI.addLogMessage(`Day ${window.gameState.day} has begun.`);

    // Ensure data is loaded before initial render
    const loadPromises = [];
    if (window.BuildingsLogic) loadPromises.push(window.BuildingsLogic.loadBuildings());
    if (window.MissionsLogic) loadPromises.push(window.MissionsLogic.loadMissions());
    if (window.EventsLogic) loadPromises.push(window.EventsLogic.loadEvents());

    Promise.all(loadPromises).then(() => {
        UI.renderAll();
    });

    // Handle Task Selection Changes
    document.getElementById('survivor-list').addEventListener('change', (event) => {
        if (event.target.classList.contains('task-select')) {
            const survivorId = event.target.getAttribute('data-id');
            const newTask = event.target.value;

            const survivor = window.gameState.survivors.find(s => s.id === survivorId);
            if (survivor) {
                survivor.current_task = newTask;
            }
        }
    });

    // Handle Build/Upgrade buttons
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('build-btn')) {
            const id = event.target.getAttribute('data-id');
            const action = event.target.getAttribute('data-action');

            if (action === 'build') {
                window.BuildingsLogic.buildStructure(id);
            } else if (action === 'upgrade') {
                window.BuildingsLogic.upgradeStructure(id);
            } else if (action === 'send-mission') {
                window.MissionsLogic.sendMission(id);
            }
            UI.renderAll(); // Re-render to update UI and disabled states

            if (window.SaveSystem) {
                window.SaveSystem.saveGame();
            }
        } else if (event.target.classList.contains('unassign-btn')) {
            const survivorId = event.target.getAttribute('data-survivor-id');
            const action = event.target.getAttribute('data-action');

            if (action === 'unassign-mission') {
                window.MissionsLogic.removeSurvivorFromMission(survivorId);
                UI.renderAll();
            }
        }
    });

    // Handle Mission Assignment Changes
    document.addEventListener('change', (event) => {
        if (event.target.classList.contains('mission-assign-select')) {
            const survivorId = event.target.value;
            const missionId = event.target.getAttribute('data-mission-id');
            if (survivorId) {
                window.MissionsLogic.assignSurvivorToMission(survivorId, missionId);
                UI.renderAll();
            }
        }
    });

    // End Day Button Logic
    document.getElementById('end-day-btn').addEventListener('click', () => {
        const logs = window.advanceDay();
        logs.forEach(msg => UI.addLogMessage(msg));
        UI.renderAll();

        if (window.SaveSystem) {
            window.SaveSystem.saveGame();
        }
    });
});