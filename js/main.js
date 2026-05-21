document.addEventListener('DOMContentLoaded', () => {
    // If there is a save system, we will load it here later
    // Load and render initial state
    if (window.SaveSystem && window.SaveSystem.hasSave()) {
        window.SaveSystem.loadGame();
    }

    UI.renderAll();
    UI.addLogMessage(`Day ${window.gameState.day} has begun.`);

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