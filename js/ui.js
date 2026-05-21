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

            let actionArea = '';
            if (survivor.status === 'on_mission') {
                actionArea = `<div class="survivor-task" style="color: #ff9800; font-weight: bold;">On Mission</div>`;
            } else if (survivor.health <= 0) {
                actionArea = `<div class="survivor-task" style="color: red; font-weight: bold;">Dead</div>`;
            } else {
                actionArea = `
                <div class="survivor-task">
                    <label for="task-${index}">Task:</label>
                    <select id="task-${index}" class="task-select" data-id="${survivor.id}">
                        ${taskOptions}
                    </select>
                </div>
                `;
            }

            let injuriesHtml = '';
            if (survivor.injuries && survivor.injuries.length > 0) {
                injuriesHtml = `<div style="grid-column: span 2; color: #f44336; font-size: 0.8rem;">Injuries: ${survivor.injuries.join(', ')}</div>`;
            }

            card.innerHTML = `
                <div class="survivor-header">
                    <span class="survivor-name">${survivor.name}</span>
                    <span class="survivor-health">HP: ${survivor.health}/100</span>
                </div>
                <div class="survivor-stats">
                    <div>Morale: ${survivor.morale}</div>
                    <div>Fatigue: ${survivor.fatigue}</div>
                    <div style="grid-column: span 2;">Traits: ${survivor.traits.join(', ')}</div>
                    ${injuriesHtml}
                </div>
                ${actionArea}
            `;
            survivorList.appendChild(card);
        });
    },

    renderMissions: function() {
        const missionList = document.getElementById('mission-list');
        const activeMissionList = document.getElementById('active-mission-list');
        if (!missionList || !activeMissionList) return;

        missionList.innerHTML = '';
        activeMissionList.innerHTML = '';

        if (!window.gameState.availableMissions) return;

        // Render Active Missions
        if (window.gameState.activeMissions && window.gameState.activeMissions.length > 0) {
            window.gameState.activeMissions.forEach((mission) => {
                const card = document.createElement('div');
                card.className = 'building-card survivor-card';
                card.innerHTML = `
                    <div class="survivor-header">
                        <span class="survivor-name">${mission.name}</span>
                        <span class="survivor-health" style="color: #ff9800;">Days left: ${mission.daysRemaining}</span>
                    </div>
                    <div style="font-size: 0.85rem; color: #aaa;">Team size: ${mission.team.length}</div>
                `;
                activeMissionList.appendChild(card);
            });
        } else {
            activeMissionList.innerHTML = '<div style="font-size: 0.85rem; color: #aaa;">No active missions.</div>';
        }

        // Render Available Missions
        window.gameState.availableMissions.forEach((mission) => {
            const card = document.createElement('div');
            card.className = 'building-card survivor-card';

            // Check if any survivors are assigned to this mission intent
            const assignedSurvivors = window.gameState.survivors.filter(s => s.assigned_mission === mission.id);
            const teamSize = assignedSurvivors.length;

            const canSend = teamSize >= mission.requiredSurvivors && teamSize <= mission.maxSurvivors;

            // Generate assignment dropdown for available survivors
            const availableSurvivors = window.gameState.survivors.filter(s => s.status === 'available' && s.health > 0);

            let assignHtml = `<select class="mission-assign-select" data-mission-id="${mission.id}">
                <option value="">Assign Survivor...</option>
                ${availableSurvivors.map(s => {
                    const isAssigned = s.assigned_mission === mission.id;
                    if (!s.assigned_mission || isAssigned) {
                        return `<option value="${s.id}" ${isAssigned ? 'selected disabled' : ''}>${s.name}</option>`;
                    }
                    return '';
                }).join('')}
            </select>`;

            let teamHtml = '';
            if (assignedSurvivors.length > 0) {
                teamHtml = `<div style="margin: 0.5rem 0;"><strong>Team:</strong> `;
                teamHtml += assignedSurvivors.map(s => `
                    <span>${s.name} <button class="unassign-btn" data-survivor-id="${s.id}" data-action="unassign-mission" style="font-size:0.6rem; cursor:pointer;">X</button></span>
                `).join(', ');
                teamHtml += `</div>`;
            }

            card.innerHTML = `
                <div class="survivor-header">
                    <span class="survivor-name">${mission.name} (${mission.type})</span>
                    <span class="survivor-health">Danger: ${mission.danger}%</span>
                </div>
                <div style="font-size: 0.85rem; margin-bottom: 0.5rem; color: #aaa;">
                    ${mission.description}<br>
                    <strong>Duration:</strong> ${mission.duration} days | <strong>Team:</strong> ${mission.requiredSurvivors}-${mission.maxSurvivors}
                </div>
                ${teamHtml}
                <div class="building-action" style="margin-top: 0.5rem; display: flex; gap: 0.5rem; align-items: center;">
                    ${assignHtml}
                    <button class="build-btn" data-id="${mission.id}" data-action="send-mission" ${canSend ? '' : 'disabled'}>Send</button>
                </div>
            `;
            missionList.appendChild(card);
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

            // Find workers associated with this building (very simplified logic, if tasks map to buildings)
            let workersHtml = '';
            if (building.built) {
                let workers = [];
                if (building.id === 'watchtower') {
                    workers = window.gameState.survivors.filter(s => s.current_task === 'Guard' && s.health > 0);
                } else if (building.id === 'infirmary') {
                    workers = window.gameState.survivors.filter(s => s.current_task === 'Treat Patients' && s.health > 0);
                }

                if (workers.length > 0) {
                    workersHtml = `<div style="font-size: 0.8rem; margin-top: 0.5rem; color: #64b5f6;">Workers: ${workers.map(w => w.name).join(', ')}</div>`;
                }
            }

            card.innerHTML = `
                <div class="survivor-header">
                    <span class="survivor-name">${building.name}</span>
                    <span class="survivor-health">${statusHtml}</span>
                </div>
                <div style="font-size: 0.85rem; margin-bottom: 0.5rem; color: #aaa;">
                    ${building.description}
                </div>
                ${workersHtml}
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

    renderEventModal: function(event) {
        const modal = document.getElementById('event-modal');
        const title = document.getElementById('event-title');
        const desc = document.getElementById('event-description');
        const choicesContainer = document.getElementById('event-choices');

        if (!modal || !title || !desc || !choicesContainer) return;

        title.textContent = event.title;
        desc.textContent = event.description;
        choicesContainer.innerHTML = '';

        event.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.textContent = choice.text;
            btn.onclick = () => {
                if (window.EventsLogic) {
                    window.EventsLogic.resolveEventChoice(index);
                }
            };
            choicesContainer.appendChild(btn);
        });

        modal.style.display = 'flex';
    },

    hideEventModal: function() {
        const modal = document.getElementById('event-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    renderAll: function() {
        this.renderResourceBar();
        this.renderSurvivors();
        this.renderBuildings();
        this.renderMissions();

        // If loaded into an active event, show it
        if (window.gameState && window.gameState.activeEvent) {
            this.renderEventModal(window.gameState.activeEvent);
        }
    }
};

window.UI = UI;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
