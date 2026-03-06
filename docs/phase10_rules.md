# Phase 10 - Official Rules (Classic)

This document provides the standard rules for the classic **Phase 10** card game (10 phases, wild cards, skip cards, two decks). It is intended to be the canonical reference for implementing the game logic in this repository.

---

## Objective

- The object of the game is to be the **first player to complete all ten phases**.
- Players advance through phases in order. A player may only attempt to complete **their current phase** each hand.
- When a player completes Phase 10, the round continues until all other players have either completed Phase 10 in the same hand, or the hand ends by another player going out.
- If more than one player completes Phase 10 in the same hand, the **player with the lowest total score** wins.
- If tied on score, a tiebreaker hand is often played (usually only between the tied players) to determine the winner.

---

## Components (Standard / Classic)

| Component                     | Count                    |
| ----------------------------- | ------------------------ |
| Number cards (1–12) per color | 4 colors × 12 = 48 cards |
| Two decks (x2)                | 96 cards                 |
| Wild cards                    | 8                        |
| Skip cards                    | 4                        |
| Total cards                   | 108                      |

### Card types

- **Number cards:** 1–12 in four colors (commonly red, blue, green, yellow).
- **Wild cards:** Can be used as any number or any color in sets/runs.
- **Skip cards:** Force the next player to lose a turn when played as a discard. Skip cards cannot be used as part of a phase.

---

## Setup

1. Shuffle all cards together into a single deck.
2. Deal **10 cards** to each player.
3. Place the remaining cards face down to form the **draw pile**.
4. Turn the top card of the draw pile face-up to start the **discard pile**.
5. Determine the first dealer (or pick randomly).

---

## Turn Structure

On your turn, perform these steps in order:

1. **Draw** exactly one card from either:
   - The top of the **draw pile**, or
   - The top of the **discard pile**.
2. Optionally **lay down** your current phase if you have completed it.
3. Optionally **hit** (play cards) on any previously laid down phase (your own or another player's)
4. **Discard** exactly one card from your hand onto the discard pile or use a skip card

### Important notes

- You can only play cards on previously laid down phase, when you lay down your current phase
- Do not discard a card, if you play the skip card
- When playing a skip card, another play has to be chosen. That player need to skip his turn once
- You must discard at the end of your turn unless you have gone out by playing your last card (including when you lay down and finish the hand in the same turn).

---

## Completing a Phase

When you have all required cards to complete your current phase, you may lay the phase down on the table.

### Wild cards

- **Wild cards** may substitute for any card needed to complete a phase (any number and any color).

### Skip cards

- Skip cards **cannot** be used as part of a phase.
- Skip cards **cannot** be discarded

---

## Hitting (Playing on Laydowns)

After laying down your phase, you may “hit” by placing cards from your hand onto any phase already laid down by any player.

- You may hit on your own phases and on other players’ phases.
- Hitting is optional.
- You may hit multiple times in one turn (as long as you have cards that fit).

---

## Going Out and Ending a Hand

- A hand ends when a player has laid down their phase (if not already laid down) and discarded their last card, leaving them with an empty hand.
- The player who goes out scores **0 points** for that hand.
- All other players score penalty points based on cards remaining in their hand.

---

## Scoring (Standard)

At the end of each hand, players score penalty points for remaining cards in their hand.

| Card type           | Points         |
| ------------------- | -------------- |
| Number card (1-9)   | 5 points each  |
| Number card (10-12) | 10 points each |
| Skip card           | 15 points      |
| Wild card           | 20 points      |

The goal is to have the **lowest total score** over the course of the game.

---

## The Ten Phases (Classic)

Players must complete phases in numeric order. When a player completes a phase, they progress to the next phase on their next hand.

1. **2 sets of 3**
2. **1 set of 3 + 1 run of 4**
3. **1 set of 4 + 1 run of 4**
4. **Run of 7**
5. **Run of 8**
6. **Run of 9**
7. **2 sets of 4**
8. **7 cards of one color**
9. **1 set of 5 + 1 set of 2**
10. **1 set of 5 + 1 set of 3**

### Definitions

- **Set (a kind):** cards of the same number, any colors.
- **Run (sequence):** cards with consecutive numbers (e.g., 4-5-6), any colors.
- **Color run** (Phase 8): cards of the same color (numbers can be non-sequential).

---

## Implementation Notes (for developers)

- Model the deck, discard pile, hands, and laid phases explicitly.
- Track each player’s **current phase** and whether they have laid it down.
- Enforce turn structure (draw → optional lay/hit → discard).
- Ensure scoring is computed correctly when a player goes out.
