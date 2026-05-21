const Balance = {
    // Core rates
    foodConsumptionPerSurvivor: 1,

    // Raids
    baseRaidChance: 0.15,
    raidChanceIncreasePerDay: 0.05,
    raidSecurityDivider: 200,
    raidWealthDivider: 500,

    // Events
    baseEventChance: 0.1,

    // Morale
    moraleDeathPenalty: 25,
    moraleStarvingPenalty: 10,
    moraleRaidDefenseBonus: 5,
    moraleRaidLossPenalty: 15,

    // Fatigue
    restRecoveryBase: 15,
    infirmaryRestBonusPerLevel: 5,
    shelterFatigueReductionPerLevel: 2,

    // Tasks
    fatigueLocalScavenge: 15,
    fatigueGuard: 10,
    fatigueBuildRepair: 10,
    fatigueTreatPatients: 10,

    // Mission specific
    missionDangerBaseInjuryChanceMultiplier: 1.0
};

window.Balance = Balance;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Balance;
}
