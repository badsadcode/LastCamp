const UI = {
    renderResourceBar: function() {
        const resourceBar = document.getElementById('resource-bar');
        if (!resourceBar) return;

        const res = window.gameState.resources;

        resourceBar.innerHTML = `
            <div class="resource-item"><strong>Day:</strong> ${window.gameState.day}</div>
            <div class="resource-item"><strong>Food:</strong> ${res.food}</div>
            <div class="resource-item"><strong>Medicine:</strong> ${res.medicine}</div>
            <div class="resource-item"><strong>Scrap:</strong> ${res.scrap}</div>
            <div class="resource-item"><strong>Tools:</strong> ${res.tools}</div>
            <div class="resource-item"><strong>Fuel:</strong> ${res.fuel}</div>
            <div class="resource-item"><strong>Ammo:</strong> ${res.ammo}</div>
            <div class="resource-item"><strong>Morale:</strong> ${res.morale}</div>
            <div class="resource-item"><strong>Security:</strong> ${res.security}</div>
        `;
    },

    renderSurvivors: function() {
        const survivorList = document.getElementById('survivor-list');
        if (!survivorList) return;

        survivorList.innerHTML = '';

        const tasks = ['Rest', 'Guard', 'Build/Repair', 'Local Scavenge', 'Treat Patients'];

        window.gameState.survivors.forEach((survivor, index) => {
            const card = document.createElement('div');
            card.className = 'survivor-card';

            let taskOptions = tasks.map(t =>
                `<option value="${t}" ${survivor.current_task === t ? 'selected' : ''}>${t}</option>`
            ).join('');

            card.innerHTML = `
                <div class="survivor-header">
                    <span class="survivor-name">${survivor.name}</span>
                    <span class="survivor-health">HP: ${survivor.health}/100</span>
                </div>
                <div class="survivor-stats">
                    <div>Morale: ${survivor.morale}</div>
                    <div>Fatigue: ${survivor.fatigue}</div>
                    <div style="grid-column: span 2;">Traits: ${survivor.traits.join(', ')}</div>
                </div>
                <div class="survivor-task">
                    <label for="task-${index}">Task:</label>
                    <select id="task-${index}" class="task-select" data-id="${survivor.id}">
                        ${taskOptions}
                    </select>
                </div>
            `;
            survivorList.appendChild(card);
        });
    },

    renderBuildings: function() {
        const buildingList = document.getElementById('building-list');
        if (!buildingList) return;

        buildingList.innerHTML = '';

        if (!window.gameState.buildings) return;

        window.gameState.buildings.forEach((building) => {
            const card = document.createElement('div');
            card.className = 'building-card survivor-card'; // Reuse survivor-card styling

            let statusHtml = '';
            let actionHtml = '';

            if (building.built) {
                statusHtml = `<span style="color: #4caf50;">Built (Lv ${building.level}/${building.maxLevel})</span>`;
                if (building.level < building.maxLevel) {
                    const upgradeCostStr = Object.entries(building.upgradeCost)
                        .map(([res, cost]) => `${cost} ${res}`).join(', ');
                    const canAfford = window.BuildingsLogic.canAfford(building.upgradeCost);
                    actionHtml = `<button class="build-btn" data-id="${building.id}" data-action="upgrade" ${canAfford ? '' : 'disabled'}>Upgrade (${upgradeCostStr})</button>`;
                }
            } else {
                statusHtml = `<span style="color: #f44336;">Not Built</span>`;
                const buildCostStr = Object.entries(building.buildCost)
                    .map(([res, cost]) => `${cost} ${res}`).join(', ');
                const canAfford = window.BuildingsLogic.canAfford(building.buildCost);
                actionHtml = `<button class="build-btn" data-id="${building.id}" data-action="build" ${canAfford ? '' : 'disabled'}>Build (${buildCostStr})</button>`;
            }

            card.innerHTML = `
                <div class="survivor-header">
                    <span class="survivor-name">${building.name}</span>
                    <span class="survivor-health">${statusHtml}</span>
                </div>
                <div style="font-size: 0.85rem; margin-bottom: 0.5rem; color: #aaa;">
                    ${building.description}
                </div>
                <div class="building-action" style="margin-top: 0.5rem;">
                    ${actionHtml}
                </div>
            `;
            buildingList.appendChild(card);
        });
    },

    addLogMessage: function(message) {
        const logList = document.getElementById('log-list');
        if (!logList) return;

        const li = document.createElement('li');
        li.textContent = message;

        // Add to the top of the list
        if (logList.firstChild) {
            logList.insertBefore(li, logList.firstChild);
        } else {
            logList.appendChild(li);
        }
    },

    renderAll: function() {
        this.renderResourceBar();
        this.renderSurvivors();
        this.renderBuildings();
    }
};

window.UI = UI;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
