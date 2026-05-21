# Last Camp Protocol

## Game Design Document

**Genre:** Survival camp management / strategy / narrative simulation  
**Platform:** HTML5 browser game  
**Technology:** HTML, CSS, JavaScript, Canvas, JSON, LocalStorage  
**Perspective:** Management UI with 2D camp and node-based world map  
**Session Style:** Turn-based daily survival loop  

---

# 1. High Concept

**Last Camp Protocol** is a 2D HTML5 survival management game where the player controls a small camp of survivors after a societal collapse. The player does not directly control characters in real time. Instead, they manage resources, assign jobs, build and upgrade camp structures, send survivors on dangerous missions, handle events, and make difficult decisions that affect morale, safety, food, loyalty, and long-term survival.

The game is designed for browser play, using HTML5, JavaScript, Canvas, CSS, and JSON-driven data. It should be playable as a single-page web app, with save/load using LocalStorage at first.

The core fantasy:

> I am responsible for a fragile group of survivors. Every day I decide who works, who rests, who risks their life outside the walls, and what kind of community we become.

---

# 2. Core Pillars

## 2.1 Camp Management

The camp is the heart of the game. The player builds structures, assigns survivors to tasks, manages supplies, and improves defenses.

The camp should feel alive, fragile, and slowly growing.

## 2.2 Survivor Stories

Survivors are not just numbers. Each survivor has a name, traits, skills, mood, health, fatigue, and possibly hidden personal events.

Survivors can become valuable, unreliable, heroic, broken, loyal, sick, injured, or lost.

## 2.3 Mission Risk

The outside world is dangerous. Missions are necessary to gather food, tools, fuel, medicine, scrap, and information.

Every mission should feel like a gamble:

- Do you send your best scavenger and risk losing them?
- Do you send weak survivors to keep your best workers safe?
- Do you abandon someone to save supplies?
- Do you push tired survivors too hard?

## 2.4 Hard Choices

The game should constantly present morally uncomfortable choices.

Examples:

- Accept strangers into camp or turn them away?
- Spend medicine on a weak survivor or save it for later?
- Punish theft harshly or forgive it?
- Risk a rescue mission or protect the camp?

## 2.5 Simple Interface, Deep Consequences

The interface should be clear and readable, not overly complex. The depth should come from the interaction between systems: resources, morale, fatigue, injuries, danger, camp upgrades, survivor traits, and event chains.

---

# 3. Target Platform

## 3.1 Technology

Initial version:

- HTML5
- CSS
- Vanilla JavaScript
- HTML Canvas for camp view and map/mission view
- JSON files for game data
- LocalStorage for saving

Optional later:

- IndexedDB for larger saves
- WebAudio for atmosphere
- PWA support
- Modding through external JSON files
- Electron version for desktop release

## 3.2 Screen Layout

Recommended resolution target:

- 1280x720 minimum
- 16:9 friendly
- Responsive scaling for browser windows

The game should work with mouse only at first.

Keyboard shortcuts can be added later.

---

# 4. Game Loop

The game is turn-based by day.

Each day follows this structure:

1. **Morning Report**
   - Food consumed
   - Morale changes
   - Injuries/sickness updates
   - Random camp event chance
   - Mission teams return if their mission duration ended

2. **Camp Planning**
   - Assign survivors to camp jobs
   - Build or upgrade structures
   - Review resources
   - Treat injured survivors
   - Manage morale and fatigue

3. **Mission Planning**
   - Choose missions from available locations
   - Assign survivors
   - Prepare gear/supplies
   - Accept risk and send team out

4. **End Day**
   - Camp workers produce resources
   - Construction progresses
   - Defenses are checked
   - Events may trigger
   - Time advances

5. **Night Phase**
   - Possible raids, storms, sickness, fire, sabotage, nightmares, arguments
   - Defense and morale matter heavily

Then the next day begins.

---

# 5. Main Resources

## 5.1 Food

Used daily to feed survivors.

If food is low:

- Morale drops
- Survivors become weaker
- Illness chance increases
- Conflict events become more common

## 5.2 Water

Optional for early version, but recommended for deeper survival.

Used daily.

If water is low:

- Fatigue increases faster
- Sickness chance rises
- Morale drops sharply

## 5.3 Medicine

Used to heal injuries, sickness, infection, and trauma.

Rare and valuable.

## 5.4 Scrap

Main construction and repair material.

Used for:

- Building structures
- Upgrading defenses
- Repairing damage
- Crafting tools

## 5.5 Fuel

Used for generators, vehicles, heating, and advanced buildings.

Can also be consumed during certain missions.

## 5.6 Tools

Abstract resource representing useful equipment.

Used to improve work efficiency or unlock buildings.

## 5.7 Ammo

Used for defense and some missions.

Optional in early version, but very useful for tension.

## 5.8 Morale

Global camp emotional state.

Morale affects:

- Work speed
- Event outcomes
- Desertion chance
- Conflict chance
- Recovery speed
- Mission confidence

Morale scale:

```text
0-20   Broken
21-40  Low
41-60  Stable
61-80  Hopeful
81-100 Inspired
```

## 5.9 Camp Security

Represents how safe the camp is from attacks, theft, and chaos.

Security is affected by:

- Defenses
- Assigned guards
- Lighting
- Watchtower
- Survivor traits
- Recent events

## 5.10 Camp Reputation

Optional later system.

Represents how outsiders see the camp.

High reputation:

- More recruits
- Better trade
- More alliances

Low reputation:

- Raiders notice you
- People fear you
- Desperate survivors may attack

---

# 6. Survivors

## 6.1 Survivor Data Structure

Each survivor should have:

```js
{
  id: "survivor_001",
  name: "Mara Voss",
  age: 32,
  portrait: "portrait_mara.png",

  health: 85,
  maxHealth: 100,

  morale: 55,
  fatigue: 20,
  hunger: 0,
  sickness: 0,

  status: "available",
  currentTask: null,

  skills: {
    scavenging: 4,
    medicine: 1,
    construction: 2,
    combat: 3,
    farming: 0,
    leadership: 2,
    stealth: 3
  },

  traits: ["Practical", "Light Sleeper"],
  injuries: [],
  relationships: {},
  loyalty: 60,
  stress: 25,
  backstory: "Former courier who knows how to move through dangerous streets."
}
```

## 6.2 Core Survivor Stats

### Health

If health reaches 0, the survivor dies.

Health is affected by:

- Injuries
- Combat
- Sickness
- Starvation
- Harsh events

### Fatigue

Fatigue increases from work, missions, wounds, poor sleep, and lack of food.

High fatigue causes:

- Lower work output
- Higher injury chance
- Lower mission success
- Morale damage
- Collapse events

### Morale

Personal morale separate from global camp morale.

Low personal morale can cause:

- Refusing tasks
- Arguments
- Theft
- Desertion
- Breakdown events

### Loyalty

Represents how strongly the survivor believes in the camp and the player’s leadership.

Low loyalty can cause:

- Disobedience
- Secret hoarding
- Leaving camp
- Helping outsiders against your wishes

### Stress

Stress rises during raids, starvation, death, injury, long missions, and harsh decisions.

High stress can trigger:

- Panic
- Nightmares
- Violence
- Mental breakdown
- Skill penalties

---

# 7. Skills

Skills should range from 0 to 10.

## 7.1 Scavenging

Improves mission loot.

Useful for:

- Finding food
- Finding scrap
- Finding hidden caches
- Avoiding wasted time

## 7.2 Medicine

Improves healing.

Useful for:

- Treating injuries
- Reducing sickness
- Avoiding death after missions
- Improving infirmary effectiveness

## 7.3 Construction

Improves building speed and repair.

Useful for:

- Camp upgrades
- Barricades
- Watchtower
- Water collectors
- Workshops

## 7.4 Combat

Improves survival during dangerous missions and raids.

Useful for:

- Defending camp
- Fighting raiders
- Protecting mission teams
- Reducing casualties

## 7.5 Farming

Improves food production.

Useful after building garden/farm structures.

## 7.6 Leadership

Improves morale and group performance.

Useful for:

- Reducing conflict
- Improving mission outcomes
- Managing large teams
- Preventing panic

## 7.7 Stealth

Helps avoid danger during missions.

Useful for:

- Sneaking past enemies
- Reducing injury chance
- Improving loot extraction
- Special missions

---

# 8. Traits

Traits make survivors feel unique.

## 8.1 Positive Traits

### Practical

Reduces resource waste during construction.

### Medic

+2 Medicine.

### Old Hunter

+2 Combat, +1 Scavenging.

### Light Sleeper

Improves night defense if assigned to guard duty.

### Optimist

Small daily morale boost to nearby survivors.

### Mechanic

Improves workshop and generator efficiency.

### Quiet Step

Improves stealth missions.

### Cook

Improves food efficiency.

## 8.2 Negative Traits

### Cowardly

Higher chance to panic during dangerous missions.

### Short Temper

Higher chance to start arguments.

### Sickly

Higher chance to become ill.

### Addict

May consume medicine or alcohol if that system exists.

### Pessimist

Can lower group morale during bad events.

### Reckless

Higher chance of injury, but sometimes better loot.

### Hoarder

May hide resources.

### Grieving

Morale recovers slowly after death events.

## 8.3 Mixed Traits

### Former Raider

Good combat, but lowers trust with some survivors.

### Haunted

Suffers stress spikes, but may detect danger earlier.

### Fanatic

Very loyal, but may react badly to mercy decisions.

### Lone Wolf

Excellent solo missions, weaker team morale.

---

# 9. Camp Structures

The camp should be represented visually as a grid or node-based layout.

Each structure has:

```js
{
  id: "workshop",
  name: "Workshop",
  level: 1,
  maxLevel: 3,
  built: true,
  workersAssigned: [],
  buildCost: {
    scrap: 20,
    tools: 2
  },
  upgradeCost: {
    scrap: 35,
    tools: 4
  },
  effects: ["unlock_crafting", "repair_bonus"]
}
```

## 9.1 Core Buildings

### Shelter

Houses survivors.

Higher levels increase survivor capacity and reduce fatigue gain.

### Campfire / Kitchen

Improves food efficiency and morale.

Upgrades:

- Campfire
- Field Kitchen
- Communal Kitchen

### Storage

Increases resource capacity.

Without storage, excess resources may be lost.

### Infirmary

Allows better healing.

Assigned medics can treat survivors.

### Workshop

Allows crafting and repairs.

Unlocks advanced structures.

### Garden

Produces small amounts of food daily.

Needs workers and water.

### Water Collector

Produces water over time.

Affected by weather.

### Watchtower

Improves security and reduces raid surprise.

### Barricades

Passive defense.

Can be damaged during raids.

### Generator

Unlocks powered buildings.

Consumes fuel.

### Radio Room

Unlocks distant missions, survivor calls, trade, and story events.

### Training Yard

Allows survivors to slowly improve combat and fitness.

### Common Area

Improves morale and reduces conflict.

### Quarantine Tent

Reduces sickness spread.

---

# 10. Camp Jobs

Each day, available survivors can be assigned to camp jobs.

## 10.1 Guard Duty

Improves camp security.

Relevant skills:

- Combat
- Perception if added
- Leadership

Fatigue gain: medium  
Risk: low, unless raid happens

## 10.2 Scavenge Nearby

Low-risk local scavenging.

Produces small resources.

Relevant skills:

- Scavenging
- Stealth

Fatigue gain: medium  
Risk: low-medium

## 10.3 Build / Repair

Progresses construction and repairs defenses.

Relevant skills:

- Construction

Fatigue gain: medium

## 10.4 Farm / Food Work

Produces food if garden exists.

Relevant skills:

- Farming

Fatigue gain: low-medium

## 10.5 Treat Patients

Assigned in infirmary.

Relevant skills:

- Medicine

Fatigue gain: low

## 10.6 Rest

Reduces fatigue and stress.

No resource production.

## 10.7 Maintain Morale

A survivor with leadership or social traits can improve camp morale.

Relevant skills:

- Leadership

Fatigue gain: low

## 10.8 Craft

Uses workshop to convert resources.

Examples:

- Scrap + Tools = Barricade parts
- Scrap + Fuel = Generator repair
- Medicine + Herbs = Med kits

---

# 11. Missions

Missions are off-camp expeditions.

Each mission has:

```js
{
  id: "mission_abandoned_store",
  name: "Abandoned Store",
  type: "scavenge",
  duration: 1,
  danger: 25,
  requiredSurvivors: 1,
  maxSurvivors: 3,
  rewards: {
    food: [5, 15],
    water: [0, 5],
    medicine: [0, 2],
    scrap: [2, 8]
  },
  skillChecks: {
    scavenging: 3,
    stealth: 2
  },
  possibleEvents: ["locked_door", "infected_inside", "hidden_cache"]
}
```

## 11.1 Mission Types

### Scavenge Mission

Main resource-gathering mission.

Rewards:

- Food
- Scrap
- Tools
- Medicine
- Fuel

### Rescue Mission

Can bring new survivors.

Risk is usually high.

Rewards:

- New survivor
- Morale gain
- Reputation gain

Failure can cause:

- Injury
- Death
- Morale loss

### Recon Mission

Reveals new locations.

Rewards:

- Map information
- Future mission unlocks
- Danger reduction for nearby zones

### Trade Mission

Exchange resources with outsiders.

Requires radio room or known settlement.

### Story Mission

Advances narrative arcs.

Usually involves hard choices.

### Hunt Mission

Produces food, but may require weapons.

### Salvage Mission

Targets large amounts of scrap/tools.

Higher danger.

### Medical Run

Targets medicine.

Often morally complicated.

Example: hospital has medicine, but also trapped survivors.

---

# 12. Mission Resolution

Mission outcome should be calculated using:

- Survivor skills
- Survivor fatigue
- Survivor health
- Traits
- Mission danger
- Equipment
- Random factor
- Previous scouting
- Weather
- Team size

Simple formula:

```js
teamScore =
  scavenging * missionScavengingWeight +
  combat * missionCombatWeight +
  stealth * missionStealthWeight +
  leadershipBonus -
  fatiguePenalty -
  injuryPenalty +
  equipmentBonus +
  randomRoll
```

Then compare against mission difficulty.

Possible results:

## Great Success

- Better loot
- No injury
- Morale boost
- Possible rare item

## Success

- Normal loot
- Minor fatigue
- Small risk of minor injury

## Partial Success

- Reduced loot
- Injury chance
- Stress increase

## Failure

- Little or no loot
- Injuries likely
- Morale loss

## Disaster

- Severe injury
- Death chance
- Lost equipment
- Team may be delayed

---

# 13. World Map

The world map can be a node-based map instead of a full open-world map.

Each node represents a location.

Examples:

- Abandoned Store
- Burned Clinic
- Collapsed Highway
- Old Police Station
- Flooded Suburb
- Radio Tower
- Farmhouse
- Train Yard
- School Shelter
- Raider Checkpoint
- Silent Church
- Military Convoy

Each location has:

- Danger level
- Loot types
- Mission options
- Discovery status
- Depletion level
- Special events

## 13.1 Location Depletion

Locations should not give infinite loot.

Each mission reduces the location’s remaining resources.

Eventually:

- Loot becomes poor
- Danger may increase
- Location becomes empty
- Special event may trigger

---

# 14. Events

Events are crucial to the game’s personality.

## 14.1 Camp Events

### Food Theft

A survivor is caught stealing food.

Choices:

1. Forgive them
   - Morale + small
   - Food lost
   - Security - small

2. Punish them
   - Morale - medium
   - Security + small
   - Survivor loyalty - large

3. Investigate
   - Requires leadership or security
   - May reveal deeper issue

### Fever Spreads

A survivor becomes sick.

Choices:

1. Use medicine
2. Isolate them
3. Ignore for now
4. Risk experimental treatment

### Stranger at the Gate

A wounded stranger asks for help.

Choices:

1. Let them in
2. Give supplies but refuse entry
3. Turn them away
4. Search them first

Possible outcomes:

- New survivor
- Thief
- Spy
- Disease carrier
- Future ally
- Morale shift

### Argument at Night

Two survivors fight.

Choices:

1. Side with survivor A
2. Side with survivor B
3. Mediate
4. Ignore

Can affect relationships.

## 14.2 Mission Events

### Locked Pharmacy

The team finds medicine behind a locked security door.

Options:

- Force it open
- Use tools
- Leave it
- Search for another entrance

### Screams Nearby

The team hears someone calling for help.

Options:

- Investigate
- Ignore
- Set an ambush
- Retreat

### Raider Patrol

The team spots armed raiders.

Options:

- Hide
- Fight
- Negotiate
- Create distraction

---

# 15. Player Decisions and Consequences

The game should remember important decisions.

Examples:

```js
gameState.flags = {
  turnedAwayChildren: true,
  savedDoctor: false,
  raidersAngered: true,
  radioSignalAnswered: true
}
```

These flags can affect future events.

Example:

If player turned away desperate survivors earlier, later the same group may join raiders.

If player saved a doctor, medical events become easier.

---

# 16. Progression

## 16.1 Camp Progression

The camp starts weak:

- Few survivors
- Poor shelter
- Low food
- No radio
- Weak defenses

Over time, the player can build:

- Reliable food production
- Better healing
- Stronger defenses
- Trade routes
- Radio contact
- Specialized survivor roles

## 16.2 Survivor Progression

Survivors gain skill experience from tasks and missions.

Example:

- Build work improves construction
- Medical work improves medicine
- Guard duty improves combat slowly
- Missions improve relevant skills faster

Survivors can also gain new traits from events.

Example:

- Hardened after surviving a deadly raid
- Traumatized after losing a friend
- Trusted after completing many missions
- Infected Wound after untreated injury

## 16.3 World Progression

The world becomes more dangerous over time.

Day 1-5:

- Low danger
- Local scavenging
- Few events

Day 6-15:

- More sickness
- More strangers
- Larger raids
- More distant missions

Day 16-30:

- Resource scarcity
- Faction threats
- Harsh weather
- Story missions

Day 30+:

- Endgame pressure
- Major faction conflict
- Evacuation, settlement, or collapse paths

---

# 17. Win and Lose Conditions

## 17.1 Lose Conditions

The player loses if:

- All survivors die
- Camp morale reaches 0 and rebellion/desertion happens
- Camp is destroyed in a raid
- Food/water collapse causes total failure
- Story-specific failure occurs

## 17.2 Win Conditions

Possible endings:

### Hold the Camp

Survive a fixed number of days, for example 40.

### Build a Beacon

Repair radio tower and contact outside help.

### Evacuation

Gather fuel, vehicle parts, medicine, and people, then leave.

### Found a Settlement

Reach high stability, food production, defenses, and population.

### Dark Ending

The camp survives, but becomes brutal, feared, and morally broken.

---

# 18. Art Direction

## 18.1 Style

Simple but atmospheric 2D.

Recommended:

- Dark UI
- Muted colors
- Strong silhouettes
- Small survivor portraits
- Camp structures as readable icons/buildings
- World map as rough illustrated nodes
- Weather overlays
- Minimal animation at first

## 18.2 Camp View

The camp can be shown as:

- Side-view base layout
- Top-down grid
- Node-based structure map

For HTML5 simplicity, use a **node-based camp screen** first.

Each building appears as a card or icon placed around the camp.

## 18.3 UI Mood

The UI should feel like:

- Survival notebook
- Camp command board
- Radio terminal
- Worn paper mixed with digital panels

Avoid overly complex simulation UI at first.

---

# 19. Audio Direction

Optional for early prototype.

Recommended sounds:

- Wind loop
- Distant thunder
- Campfire crackle
- Radio static
- Button clicks
- Mission result sting
- Raid alarm
- Survivor death sting
- Morning report ambience

Music should be minimal and tense.

---

# 20. UI Screens

## 20.1 Main Camp Screen

Shows:

- Current day
- Resource bar
- Global morale/security
- Camp structures
- Survivor list
- Current tasks
- End Day button

## 20.2 Survivor Screen

Shows:

- Survivor portrait
- Stats
- Skills
- Traits
- Injuries
- Current assignment
- Backstory

## 20.3 Build Screen

Shows:

- Available structures
- Costs
- Effects
- Build/upgrade buttons
- Required workers

## 20.4 Mission Screen

Shows:

- Available locations
- Danger level
- Expected loot
- Required skills
- Survivor assignment
- Send mission button

## 20.5 Event Screen

Shows:

- Event title
- Narrative description
- Choices
- Consequences after choice

## 20.6 Report Screen

Shows:

- Daily summary
- Resource changes
- Mission results
- Injuries/deaths
- New unlocks

---

# 21. Data-Driven Design

The game should use JSON-style data wherever possible.

Recommended files:

```text
/data/survivors.json
/data/traits.json
/data/buildings.json
/data/missions.json
/data/events.json
/data/items.json
/data/balance.json
```

This makes the game easier to expand without rewriting logic.

---

# 22. Minimum Viable Prototype

The first playable version should include:

- Day system
- Resource system
- 5 survivors
- Basic survivor stats
- 4 buildings
- 4 camp jobs
- 5 missions
- Mission resolution
- Simple event system
- Save/load using LocalStorage
- Basic HTML/CSS UI
- Canvas or simple DOM-based camp view

## MVP Buildings

- Shelter
- Storage
- Infirmary
- Watchtower

## MVP Jobs

- Rest
- Guard
- Build/Repair
- Local Scavenge

## MVP Resources

- Food
- Medicine
- Scrap
- Morale
- Security

## MVP Mission Locations

- Abandoned Store
- Burned Clinic
- Old Garage
- Empty Houses
- Radio Tower

---

# 23. Example Starting State

```js
const gameState = {
  day: 1,

  resources: {
    food: 24,
    medicine: 4,
    scrap: 18,
    tools: 2,
    fuel: 0,
    ammo: 6
  },

  morale: 55,
  security: 30,

  survivors: [],
  buildings: [],
  missions: [],
  activeMissions: [],
  eventQueue: [],
  flags: {},

  difficulty: "normal"
};
```

Starting survivors:

1. **Mara Voss**
   - Strong scavenger
   - Practical
   - Slightly low trust

2. **Eli Ward**
   - Medic
   - Sickly
   - High loyalty

3. **Jonas Pike**
   - Builder
   - Short Temper

4. **Rina Vale**
   - Stealthy
   - Quiet Step

5. **Cal Mercer**
   - Combat-focused
   - Reckless

---

# 24. Tone and Writing Style

The writing should be serious, grounded, and human.

Avoid cartoonish apocalypse nonsense unless used very carefully.

The tone should be:

- Tense
- Emotional
- Practical
- Occasionally darkly funny
- Focused on people surviving together

Example event text:

> The rain has not stopped for two days. The shelter roof leaks over the sleeping area, and the floor has turned into cold mud. Jonas says he can patch it before nightfall, but he needs scrap meant for the watchtower repairs.

Choices:

1. Patch the shelter roof.
2. Save the scrap for defenses.
3. Ask the survivors to endure it.
4. Let Jonas improvise with poor materials.
