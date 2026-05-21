# First Coding Prompt

Use this prompt with Codex or another coding AI to start the first prototype.

```text
Create the first prototype of an HTML5 survival camp management game called Last Camp Protocol.

Use vanilla HTML, CSS, and JavaScript. Do not use frameworks.

Create this structure:

index.html
css/style.css
js/main.js
js/state.js
js/ui.js
js/save.js

The game should have:

- A dark survival-themed UI.
- A resource bar showing day, food, medicine, scrap, tools, fuel, ammo, morale, and security.
- A survivor panel with 5 starting survivors.
- Each survivor has health, morale, fatigue, skills, traits, and a current task.
- A task assignment system with Rest, Guard, Build/Repair, Local Scavenge, and Treat Patients.
- An End Day button.
- When End Day is clicked:
  - Each survivor consumes 1 food.
  - Rest reduces fatigue.
  - Guard increases security.
  - Local Scavenge has a chance to add food or scrap.
  - Working increases fatigue.
  - Day advances by 1.
- A daily report log that shows what changed.
- Save and load using LocalStorage.

Keep the code clean, separated into files, and easy to expand.
```

---

# Suggested Development Order

1. Static UI
2. Game state
3. Resource display
4. Survivor display
5. Task assignment
6. End day logic
7. Report log
8. Save/load
9. Buildings
10. Missions
11. Events
12. Injuries
13. Raids
14. World map
15. Victory/loss
16. Polish

Tiny goblin steps. Controlled goblin steps. No feature avalanche yet.
