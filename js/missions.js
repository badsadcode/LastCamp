const MissionsLogic = {
    loadMissions: async function() {
        if (!window.gameState.availableMissions || window.gameState.availableMissions.length === 0) {
            try {
                const isNode = typeof process !== 'undefined' && process.release.name === 'node';
                if (isNode) {
                    const fs = require('fs');
                    const path = require('path');
                    const data = fs.readFileSync(path.join(__dirname, '../data/missions.json'), 'utf8');
                    window.gameState.availableMissions = JSON.parse(data);
                } else {
                    const response = await fetch('data/missions.json');
                    const data = await response.json();
                    window.gameState.availableMissions = data;
                }
            } catch (e) {
                console.error("Failed to load missions data.", e);
            }
        }
        if (!window.gameState.activeMissions) {
            window.gameState.activeMissions = [];
        }
    },

    selectMission: function(missionId) {
        return window.gameState.availableMissions.find(m => m.id === missionId);
    },

    assignSurvivorToMission: function(survivorId, missionId) {
        const survivor = window.gameState.survivors.find(s => s.id === survivorId);
        if (!survivor || survivor.health <= 0 || survivor.status === 'on_mission') {
            return false;
        }

        // We temporarily store the assigned mission intent on the survivor
        // before actually sending them out.
        survivor.assigned_mission = missionId;
        return true;
    },

    removeSurvivorFromMission: function(survivorId) {
        const survivor = window.gameState.survivors.find(s => s.id === survivorId);
        if (survivor) {
            delete survivor.assigned_mission;
            return true;
        }
        return false;
    },

    sendMission: function(missionId) {
        const mission = this.selectMission(missionId);
        if (!mission) return false;

        const team = window.gameState.survivors.filter(s => s.assigned_mission === missionId);
        if (team.length < mission.requiredSurvivors || team.length > mission.maxSurvivors) {
            return false;
        }

        // Change their status to on_mission and clear the assignment flag
        const teamIds = [];
        team.forEach(survivor => {
            survivor.status = 'on_mission';
            survivor.current_task = 'None';
            teamIds.push(survivor.id);
            delete survivor.assigned_mission;
        });

        const activeMission = {
            missionId: mission.id,
            name: mission.name,
            team: teamIds,
            daysRemaining: mission.duration,
            danger: mission.danger,
            rewards: mission.rewards,
            skillChecks: mission.skillChecks
        };

        window.gameState.activeMissions.push(activeMission);

        if (window.UI && window.UI.addLogMessage) {
            window.UI.addLogMessage(`Team sent to ${mission.name}. Returning in ${mission.duration} days.`);
        }
        return true;
    },

    resolveMission: function(activeMission) {
        let logs = [];
        logs.push(`--- Mission Return: ${activeMission.name} ---`);

        const team = window.gameState.survivors.filter(s => activeMission.team.includes(s.id));

        let totalScavenging = 0;
        let totalCombat = 0;
        let totalStealth = 0;

        team.forEach(s => {
            totalScavenging += s.skills.scavenging || 0;
            totalCombat += s.skills.combat || 0;
            totalStealth += s.skills.stealth || 0;

            // Re-availablize them
            s.status = 'available';
            s.current_task = 'Rest';

            // Base fatigue penalty for going on a mission
            s.fatigue += 20;
        });

        const reqScavenging = activeMission.skillChecks.scavenging || 0;
        const reqCombat = activeMission.skillChecks.combat || 0;
        const reqStealth = activeMission.skillChecks.stealth || 0;

        let successScore = 0;
        if (totalScavenging >= reqScavenging) successScore += 1;
        if (totalCombat >= reqCombat) successScore += 1;
        if (totalStealth >= reqStealth) successScore += 1;

        const roll = Math.random() * 100;
        // Simple resolution logic for prototype
        if (roll > activeMission.danger && successScore >= Object.keys(activeMission.skillChecks).length - 1) {
            logs.push(`The mission was a success!`);
            // Grant rewards
            for (const [res, range] of Object.entries(activeMission.rewards)) {
                const amount = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
                if (amount > 0) {
                    window.gameState.resources[res] = (window.gameState.resources[res] || 0) + amount;
                    logs.push(`Found ${amount} ${res}.`);
                }
            }
            window.gameState.resources.morale = Math.min(100, window.gameState.resources.morale + 5);
        } else if (roll > activeMission.danger / 2) {
            logs.push(`The mission was partially successful, but they ran into trouble.`);
            // Half rewards
            for (const [res, range] of Object.entries(activeMission.rewards)) {
                const amount = Math.floor((Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0]) / 2);
                if (amount > 0) {
                    window.gameState.resources[res] = (window.gameState.resources[res] || 0) + amount;
                    logs.push(`Found ${amount} ${res}.`);
                }
            }
            // Health penalty
            team.forEach(s => {
                s.health -= 10;
                logs.push(`${s.name} took some damage.`);
            });
        } else {
            logs.push(`The mission was a disaster!`);
            window.gameState.resources.morale -= 10;
            team.forEach(s => {
                s.health -= 30;
                s.fatigue += 20;
                logs.push(`${s.name} was badly injured and exhausted.`);
            });
        }

        return logs;
    }
};

window.MissionsLogic = MissionsLogic;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MissionsLogic;
}
