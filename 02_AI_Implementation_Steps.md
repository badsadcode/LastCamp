# Last Camp Protocol

## AI Implementation Steps

This file divides the project into chunks that an AI coding assistant can follow one by one.

Rule: complete and test each chunk before moving to the next one.

---

# Chunk 1: Project Setup

Create the basic HTML5 project structure.

```text
survivor-camp-game/
│
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── state.js
│   ├── ui.js
│   ├── data.js
│   ├── survivors.js
│   ├── buildings.js
│   ├── missions.js
│   ├── events.js
│   └── save.js
│
└── data/
    ├── survivors.json
    ├── buildings.json
    ├── missions.json
    ├── events.json
    └── traits.json
```

Build:

- Basic dark HTML page
- Header with game title
- Main layout with left panel, center panel, right panel
- Placeholder sections for resources, camp, survivors, and actions

Acceptance criteria:

- Page loads without errors
- Layout is readable
- JavaScript files are connected
- Console shows `Game initialized`

---

# Chunk 2: Core Game State

Create the main game state object.

Include:

- Day number
- Resources
- Morale
- Security
- Survivors array
- Buildings array
- Available missions
- Active missions
- Event queue
- Game flags

Create functions:

```js
createNewGame()
getGameState()
setGameState(newState)
advanceDay()
```

Acceptance criteria:

- New game creates valid starting state
- Day starts at 1
- Resources display correctly
- State can be logged in console

---

# Chunk 3: Resource Display

Create UI rendering for resources.

Display:

- Food
- Medicine
- Scrap
- Tools
- Fuel
- Ammo
- Morale
- Security
- Current day

Create function:

```js
renderResources()
```

Acceptance criteria:

- Resource values appear on screen
- Updating gameState updates displayed values
- Morale and security are visually clear

---

# Chunk 4: Survivor Data

Create `survivors.json` with 5 starting survivors.

Each survivor should include:

- ID
- Name
- Health
- Morale
- Fatigue
- Status
- Skills
- Traits
- Backstory

Create function:

```js
loadSurvivors()
renderSurvivorList()
```

Acceptance criteria:

- Survivors load into game state
- Survivor names appear in UI
- Clicking survivor shows details
- Health, fatigue, morale, skills, and traits are visible

---

# Chunk 5: Basic Survivor Assignment System

Add task assignment.

Available tasks:

- Rest
- Guard
- Build/Repair
- Local Scavenge
- Treat Patients

Each survivor can have one task.

Create functions:

```js
assignTask(survivorId, taskId)
clearTask(survivorId)
renderTaskControls(survivorId)
```

Acceptance criteria:

- Player can assign a task to each survivor
- Survivor status changes visually
- Assigned task is saved in game state
- Survivor cannot have multiple tasks

---

# Chunk 6: End Day Logic

Create the first version of `advanceDay()`.

When the day ends:

- Food is consumed
- Fatigue changes based on tasks
- Guard duty increases security
- Rest reduces fatigue
- Local scavenge produces small random resources
- Build/Repair does nothing yet except fatigue
- Day increases by 1

Example food rule:

```text
Each survivor consumes 1 food per day.
```

Acceptance criteria:

- Clicking End Day advances the day
- Food decreases
- Resting survivors recover fatigue
- Working survivors gain fatigue
- Local scavengers produce resources
- UI updates after day advances

---

# Chunk 7: Buildings Data

Create `buildings.json`.

Include:

- Shelter
- Storage
- Infirmary
- Watchtower
- Workshop
- Garden

Each building should have:

- ID
- Name
- Level
- Built status
- Build cost
- Upgrade cost
- Description
- Effects

Create functions:

```js
loadBuildings()
renderBuildings()
buildStructure(buildingId)
upgradeStructure(buildingId)
```

Acceptance criteria:

- Buildings appear in Build screen
- Player can build available structures if they have enough resources
- Resources are deducted
- Built structures appear in camp view
- Upgrade button appears for built structures

---

# Chunk 8: Building Effects

Implement basic effects.

Examples:

- Shelter reduces fatigue gain
- Storage increases resource caps
- Infirmary improves healing
- Watchtower improves security
- Garden produces food if assigned workers
- Workshop unlocks advanced construction later

Acceptance criteria:

- Building levels affect daily calculations
- Watchtower improves security
- Garden can produce food
- Infirmary improves recovery
- UI explains building effects

---

# Chunk 9: Mission Data

Create `missions.json`.

Add 5 starting missions:

1. Abandoned Store
2. Burned Clinic
3. Old Garage
4. Empty Houses
5. Radio Tower

Each mission has:

- ID
- Name
- Type
- Duration
- Danger
- Rewards
- Skill checks
- Description
- Possible events

Create functions:

```js
loadMissions()
renderMissionList()
selectMission(missionId)
```

Acceptance criteria:

- Missions appear on Mission screen
- Each mission shows danger, duration, and possible rewards
- Player can select a mission

---

# Chunk 10: Mission Team Assignment

Allow player to assign available survivors to a selected mission.

Rules:

- Survivor must not already be on another mission
- Survivor must be alive
- Survivor must be available
- Mission has minimum and maximum team size

Create functions:

```js
assignSurvivorToMission(survivorId, missionId)
removeSurvivorFromMission(survivorId, missionId)
sendMission(missionId)
```

Acceptance criteria:

- Player can build a mission team
- Team size rules are enforced
- Sending mission changes survivor status to `on_mission`
- Mission appears in active missions list

---

# Chunk 11: Mission Duration System

Active missions should take one or more days.

Each active mission has:

```js
{
  missionId: "abandoned_store",
  team: ["survivor_001", "survivor_004"],
  daysRemaining: 1
}
```

During `advanceDay()`:

- Reduce days remaining
- If days reach 0, resolve mission

Acceptance criteria:

- Missions remain active while daysRemaining > 0
- Survivors on missions cannot be assigned to camp tasks
- Missions resolve when timer ends
- Survivors return after mission resolution

---

# Chunk 12: Mission Resolution

Implement mission outcome calculation.

Use:

- Relevant team skills
- Mission danger
- Fatigue penalties
- Health penalties
- Random roll

Create possible outcomes:

- Great Success
- Success
- Partial Success
- Failure
- Disaster

Each outcome affects:

- Loot gained
- Fatigue gained
- Injury chance
- Morale
- Survivor health

Acceptance criteria:

- Mission result appears in report screen
- Loot is added to resources
- Survivors may be injured
- Survivors return to available status
- Mission danger matters

---

# Chunk 13: Daily Report Screen

Create a report/log system.

Every day should generate messages like:

```text
Day 3
- The camp consumed 5 food.
- Mara returned from Abandoned Store with 8 food and 2 scrap.
- Rina suffered a minor injury.
- Morale increased by 2.
```

Create function:

```js
addReportMessage(message)
renderReport()
```

Acceptance criteria:

- End Day produces readable report
- Mission outcomes appear in report
- Resource changes appear in report
- Report history can show recent days

---

# Chunk 14: Event System

Create basic random events.

Each event has:

- ID
- Title
- Description
- Trigger conditions
- Choices
- Effects

Example:

```js
{
  id: "food_theft",
  title: "Missing Food",
  description: "Someone has stolen food from the storage crate.",
  choices: [
    {
      text: "Forgive it this time.",
      effects: { morale: 5, food: -2 }
    },
    {
      text: "Punish the thief.",
      effects: { morale: -5, security: 5 }
    }
  ]
}
```

Create functions:

```js
checkForRandomEvent()
showEvent(eventId)
resolveEventChoice(eventId, choiceIndex)
```

Acceptance criteria:

- Random events can appear after ending day
- Event screen blocks normal play until choice is made
- Choices modify game state
- Choice result appears in report

---

# Chunk 15: Survivor Injuries and Healing

Add injury system.

Example injuries:

- Minor Cut
- Sprained Ankle
- Fever
- Deep Wound
- Broken Rib
- Infection

Each injury affects stats.

Example:

```js
{
  id: "sprained_ankle",
  name: "Sprained Ankle",
  severity: 1,
  effects: {
    scavenging: -1,
    stealth: -2
  },
  healingDays: 3
}
```

Healing rules:

- Rest helps slowly
- Infirmary helps more
- Medicine speeds recovery
- Untreated severe wounds can worsen

Acceptance criteria:

- Survivors can receive injuries
- Injuries show in survivor detail panel
- Injuries affect mission calculations
- Injuries can heal over days

---

# Chunk 16: Morale and Breakdown System

Implement personal and camp morale effects.

Rules:

- Death lowers morale
- Hunger lowers morale
- Success raises morale
- Rest and common area can improve morale
- Low morale can trigger events

Add possible morale states:

- Stable
- Worried
- Shaken
- Broken

Acceptance criteria:

- Camp morale changes from events and outcomes
- Personal morale changes per survivor
- Low morale increases negative event chance
- UI shows morale clearly

---

# Chunk 17: Camp Security and Raids

Implement raid events.

Raid chance depends on:

- Day number
- Security
- Noise/resource wealth
- Previous choices

Raid resolution depends on:

- Security
- Guards assigned
- Watchtower level
- Barricades
- Combat skills
- Ammo

Possible outcomes:

- Raid repelled
- Resources stolen
- Survivor injured
- Building damaged
- Survivor killed

Acceptance criteria:

- Raids can happen at night
- Guards and buildings matter
- Raid results appear in report
- Security becomes meaningful

---

# Chunk 18: Save and Load

Use LocalStorage.

Create functions:

```js
saveGame()
loadGame()
deleteSave()
hasSave()
```

Add UI buttons:

- New Game
- Save Game
- Load Game
- Delete Save

Acceptance criteria:

- Player can save game
- Player can reload browser and continue
- New game resets state
- Save data includes survivors, buildings, missions, resources, flags, and reports

---

# Chunk 19: Balancing Pass

Create `balance.js` or `balance.json`.

Move important numbers into one place:

- Food consumed per survivor
- Base raid chance
- Base event chance
- Fatigue gain
- Rest recovery
- Mission random range
- Injury chance
- Morale modifiers

Acceptance criteria:

- Balance numbers are easy to tweak
- No major numbers are hardcoded everywhere
- Game can be made easier or harder quickly

---

# Chunk 20: Visual Camp View

Create a better camp screen.

Options:

- DOM cards arranged like buildings
- Canvas camp map
- Clickable building icons

For MVP, use DOM cards first.

Each building card should show:

- Name
- Level
- Built/unbuilt state
- Assigned workers
- Effect summary
- Upgrade/build button

Acceptance criteria:

- Camp feels like a place, not just a spreadsheet
- Built buildings are visually distinct
- Damaged buildings can be shown later

---

# Chunk 21: World Map View

Create simple node-based map.

Each mission location appears as a node.

Node shows:

- Name
- Danger
- Loot type
- Depletion
- Locked/unlocked state

Clicking node opens mission panel.

Acceptance criteria:

- Missions are presented as world locations
- Locked locations are hidden or disabled
- Completed/depleted locations change visually

---

# Chunk 22: Location Depletion

Each location should have a loot remaining value.

After missions:

- Reduce loot remaining
- Reduce reward ranges
- Possibly increase danger
- Mark empty when depleted

Acceptance criteria:

- Repeating same mission becomes less useful
- Player is encouraged to scout new locations
- Location state is saved

---

# Chunk 23: Recon and Unlocking

Add recon missions that reveal new locations.

Example:

- Radio Tower unlocks distant locations
- Highway Recon unlocks convoy and gas station
- School Shelter unlocks rescue mission

Acceptance criteria:

- Not all missions are available on Day 1
- Recon creates progression
- World feels larger over time

---

# Chunk 24: Survivor Recruitment

Add recruitment events and rescue missions.

New survivors should have random or predefined stats.

Recruitment sources:

- Stranger at gate
- Rescue mission
- Radio call
- Trade caravan
- Story event

Acceptance criteria:

- Camp population can grow
- Shelter capacity matters
- New survivors appear in survivor list
- More people means more food pressure

---

# Chunk 25: Game Over Conditions

Implement failure states.

Game over can happen if:

- No survivors remain
- Food is 0 for too long
- Morale reaches 0
- Camp is destroyed
- Story failure happens

Acceptance criteria:

- Game detects failure
- Game over screen explains what happened
- Player can start new game

---

# Chunk 26: Victory Path

Add first victory condition.

Recommended MVP victory:

**Repair the Radio Tower and survive until rescue contact is established.**

Requirements:

- Build Radio Room
- Complete Radio Tower mission
- Gather fuel
- Survive final raid
- Keep at least one survivor alive

Acceptance criteria:

- Player has a long-term goal
- Victory screen appears
- Final report summarizes the camp’s fate

---

# Chunk 27: Better Writing Pass

Improve all event and mission text.

Add:

- More atmospheric descriptions
- Survivor names in reports
- Personal consequences
- Small dark humor
- Emotional weight

Acceptance criteria:

- Game text feels less generic
- Events feel connected to survivors
- Reports feel like an actual survival chronicle

---

# Chunk 28: UI Polish

Improve visual readability.

Add:

- Tooltips
- Color-coded danger
- Icons for resources
- Better buttons
- Disabled button states
- Warning messages
- Confirmation before dangerous actions

Acceptance criteria:

- Player understands what is happening
- Important information is visible
- Bad clicks are reduced

---

# Chunk 29: Audio and Atmosphere

Add optional audio.

Audio files:

```text
/audio/wind_loop.mp3
/audio/campfire_loop.mp3
/audio/radio_static.mp3
/audio/button_click.wav
/audio/raid_alarm.wav
/audio/mission_success.wav
/audio/mission_failure.wav
```

Acceptance criteria:

- Audio can be toggled on/off
- Background ambience loops softly
- Events have small sound cues

---

# Chunk 30: Final Prototype Packaging

Prepare the game for testing.

Tasks:

- Clean folder structure
- Remove console spam
- Add README
- Add known issues section
- Add version number
- Add changelog
- Test new game, save/load, 20-day run

Acceptance criteria:

- Game can be zipped and shared
- Game runs locally
- Game runs on basic web hosting
- No fatal errors during normal play
