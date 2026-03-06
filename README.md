# Phase 10 Web Companion

A **mobile-first web app** to assist real-world players of the classic _Phase 10_ card game.

## 🎯 Purpose

This app is not a full digital version of Phase 10. Instead, it helps players who are playing the physical card game to:

- Track which **phase** each player is on.
- Record each player’s **penalty points** per hand.
- Show a small **leaderboard** after each hand.
- Optionally start another round quickly without losing the current game state.

## ✅ Requirements (high level)

### Core functionality

- [x] Prompt for **player count and player names** at game start.
- [x] Track each player's **current phase** (1–10) and whether they completed it.
- [x] Allow entering the **hand score** (penalty points) for each player.
- [x] Show a **leaderboard** after each hand, sorted by lowest score.
- [x] Allow the group to **play another hand** and continue tracking phases.

### Behavior & UX

- [x] Must be **mobile-first** (primary target) and still usable on desktop.
- [x] Runs **entirely in the browser** (no backend, no login).
- [x] Retains game state if the page is **reloaded** (via browser storage).
- [x] Provide a way to **reset** the game and clear stored state.
- [ ] Should allow to change language to german

### Phase handling

- [x] Use the **default classic phase list** (10 phases) initially.
- [ ] (Future extension) Optionally support **random or custom phase sets**.

## 🧠 Project structure

- `docs/phase10_rules.md` — canonical rules reference for the classic game.
- `data/phase10_phases.json` — structured definition of the 10 phases.
- `data/phase10_scoring.json` — scoring values for penalty points.
- `src/App.tsx` — main app component with game state management.
- `src/helpers/gameState.ts` — game state types and localStorage persistence.
- `src/screens/SetupScreen.tsx` — player setup form.
- `src/screens/GameScreen.tsx` — game play with score entry and leaderboard.
- `tests/e2e/` — playwright e2e-tests.

## 🧱 Tech stack

### Implemented

- **Language:** TypeScript (strict mode, strict compiler settings)
- **Framework:** React 19.2.4 (with Strict Mode)
- **Design system / UI components:** PrimeReact 10.9.7
- **Build tooling:** Vite 7.3.1
- **E2E testing:** Playwright 1.48.1
- **Formatter:** Prettier 3.2.5
- **Linter:** ESLint 9.39.3
- **Persistence:** `localStorage` key strategy
- **Package manager:** npm

### Design decisions

- **Unit tests:** Skipped in favor of comprehensive E2E coverage with Playwright
- **State lifting:** Game state managed at App component level
- **Lazy initialization:** Using `useState(() => loadGameState())` to hydrate from localStorage
- **Mobile-first:** Responsive design with Flexbox, optimized for touch/mobile interaction
