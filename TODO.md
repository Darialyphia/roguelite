# TODOS

## High Priority (core mechanics)

### Gameplay

- [ ] The altar mechanic has been replaced by a moving general. See the [General section](docs/DESIGN_DOCUMENT.md#generals) in the design document.
  - [x] Distinguish between generals and minion
  - [x] Add a player general to the board at the start of the game
  - [x] Provide visual feedback to distinguish generals from minions 
  - [ ] General rewards at 50% HP and when destroyed
  - [ ] General Ghost mechanic
- [ ] Adds the Comeback mechanic that draws cards for the opponent when you reach see some VP thresholds. See the [General section](docs/DESIGN_DOCUMENT.md#comeback-mechanic) in the design document.
- [ ] Rework the way shrine work to match the current design in the [Design document](docs/DESIGN_DOCUMENT.md#shrines)
- [ ] Add the ability for units to have activated abilities.
- [ ] Add a `VigilantModifierMixin` that implements the Vigilant keyword.
- [ ] Add a `Taunt` [keyword](packages/engine/src/unit/keywords.ts) that makes nearby enemies unable to move and forced to attack the taunter if they attack. Add the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts) implementing the keyword
- [ ] Add a `Frozen` [keyword](packages/engine/src/unit/keywords.ts) that makes a unit unable to move, attack, or use abilities. Add the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword.
- [ ] Add a `Burn` [keyword](packages/engine/src/unit/keywords.ts) that makes a unit take damage at the beginning of its turn equal to the amount of burn stacks it has. Add the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword.
- [ ] Add a `Berzerk` [keyword](packages/engine/src/unit/keywords.ts) that makes a unit move to the nearest unit or general at the beginning of its turn, and attack it. Add the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword.
- [ ] Add a `Barrier` [keyword](packages/engine/src/unit/keywords.ts) that blocks the next damage instance a unit receives. Add the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword.
- [ ] Add a 'Blast' [keyword](packages/engine/src/unit/keywords.ts) that makes the unit deal damage to ALL units nearby the target. Damage to those units should be halved (rounded up). Add the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword
- [ ] Add a `Magic Guard` [keyword](packages/engine/src/unit/keywords.ts) that prevent a unit from receiving damage from spell cards, or be targeted by spell cards. Implement the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword
- [ ] Add a `Disarmed` [keyword](packages/engine/src/unit/keywords.ts) that prevents a unit from attacking. Implement the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword
- [ ] Add a `Rooted` [keyword](packages/engine/src/unit/keywords.ts) that prevents a unit from moving. Implement the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword
- [ ] Add a `Silenced` [keyword](packages/engine/src/unit/keywords.ts) that prevents a unit from using abilities. Implement the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword
- [ ] Add a `Slowed` [keyword](packages/engine/src/unit/keywords.ts) that make a unit spend 50% more AP to move one tile. Implement the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword
- [ ] add a `Spellcaster` keyword [keyword](packages/engine/src/unit/keywords.ts) that allows spell cards to use the unit position as a base for spell that have a range. Implement the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword

### UI

- [ ] Display tooltips on the resource actions of the ActionWheel
- [ ] Display the progress of ongoing quests. What to display will probably need to be setup on a per-card basis in the blueprint.
- [ ] Add the ability for the user to see what cards are in a player discard pile
- [ ] Add some visual feedback whenever a player earns Vicory Points.
- [ ] Add some visual feedback whenever a player gains gold.
- [ ] Add some visual feedback whenever a player unlocks a rune.
- [ ] Add some visual feedback whenever a player fulfills a quest.
- [ ] Add some visual feedbacks on units to easily know how much AP they have left. Be careful not to clutter the board too much, it could decrease readability when multiple units are packed close to each other.
- [ ] Add a highlight on a board cell to show the AOE of a unit attack or a spell.
- [ ] Improve the TextWithKeyword component to be able to display things like rune, AP or gold icons. Then rename it to CardDescription

### Refactoring

- [ ] Maybe we don't need al lthe bells and whistles with scaling and mitigations for the Damage class

### Bugs

- [ ] You can click and drag the camera vertically but that shouldn't be possible. The worldSize in the Camera component is probably wrong. In a last resort, remove the ability to drag the viewport altogether.
- [ ] Units appear below tiles when they are on some places in the top row.
- [ ] AI sometimes just oves units to the top of the map withotu any specific reason.
- [ ] The card spacing in the opponent's hand after the first turn is incorrect, resulting in cards being spaced too much.

## Medium Priority (enhancements)

- [ ] make the Battle Log interactive by giving it the possibility to hover pars of the events to highlight them on the board.

## Low Priority (nice to have)

- [ ] When drawing a card, it would be cool if the card appeared from the deck icon in the player infos then went into the hand

## Change Log

- [X] 07/01/2025: Remove the Reward points from units as this feature has been removed from the design document.
- [x] 06/01/2025: Cards in the opponent's hand are sometimes not displayed properly.
