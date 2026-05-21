document.addEventListener('DOMContentLoaded', () => {
    // If there is a save system, we will load it here later
    // Load and render initial state
    if (window.SaveSystem && window.SaveSystem.hasSave()) {
        window.SaveSystem.loadGame();
    }

    UI.renderAll();
    UI.addLogMessage(`Day ${window.gameState.day} has begun.`);

    // Ensure buildings are loaded before initial render
    if (window.BuildingsLogic) {
        window.BuildingsLogic.loadBuildings().then(() => {
            UI.renderAll();
        });
    }

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
            const buildingId = event.target.getAttribute('data-id');
            const action = event.target.getAttribute('data-action');

            if (action === 'build') {
                window.BuildingsLogic.buildStructure(buildingId);
            } else if (action === 'upgrade') {
                window.BuildingsLogic.upgradeStructure(buildingId);
            }
            UI.renderAll(); // Re-render to update UI and disabled states

            if (window.SaveSystem) {
                window.SaveSystem.saveGame();
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