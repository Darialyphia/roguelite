# PHASE 1: Prototype

The goal of this phase is to shape up the core game mechanics and the UI for the battle screen. This is so we can iterate quickly on game mechanics and "find the fun".
There is no need for a back end as this point, and the games will be single player VS AI with hardcoded decks that we change manually as we need to test cards and implement mechanics.

## High Priority (core mechanics)

### Gameplay

- [ ] Add a machanic that allows a player to choose between multiple card effects when playing a card (for example: draw a card OR deal one damage to a unit).
- [ ] Add a mechanic that allows a player to search their deck for a specific card.
- [ ] Add a mechanic that allows a player to choose one card to pick among 3 randomized choices. It needs to have flexibility in how the pool of cards for the randomized choices is defined.
- [ ] Remake the tutorial to account for the changes in core game mechanics.
- [ ] Add the ability for units to have activated abilities.
- [ ] Implement card modifiers.
- [ ] Add an `AmbushModifierMixin` that implements the Ambush keyword.
- [ ] Add a `DescendModifierMixin` that implements the Descend keyword.
- [ ] Add a `VigilantModifierMixin` that implements the Vigilant keyword.
- [ ] Add a `Taunt` [keyword](packages/engine/src/unit/keywords.ts) that makes nearby enemies unable to move and forced to attack the taunter if they attack. Add the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts) implementing the keyword
- [ ] Add a `Frozen` [keyword](packages/engine/src/unit/keywords.ts) that makes a unit unable to move, attack, or use abilities. Add the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword.
- [ ] Add a `Barrier` [keyword](packages/engine/src/unit/keywords.ts) that blocks the next damage instance a unit receives. Add the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword.
- [ ] Add a 'Blast' [keyword](packages/engine/src/unit/keywords.ts) that makes the unit deal damage to ALL units nearby the target. Damage to those units should be halved (rounded up). Add the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword
- [ ] Add a `Magic Guard` [keyword](packages/engine/src/unit/keywords.ts) that prevent a unit from receiving damage from spell cards, or be targeted by spell cards. Implement the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword
- [ ] Add a `Rooted` [keyword](packages/engine/src/unit/keywords.ts) that prevents a unit from moving. Implement the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword
- [ ] Add a `Silenced` [keyword](packages/engine/src/unit/keywords.ts) that prevents a unit from using abilities. Implement the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword
- [ ] Add a `Slowed` [keyword](packages/engine/src/unit/keywords.ts) that make a unit spend 50% more AP to move one tile. Implement the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword
- [ ] Add a `Swift` [keyword](packages/engine/src/unit/keywords.ts) that make a unit able to move after attacking. Implement the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword


### UI
- [ ] Remake the way runes and gold are displayed, they're not eye catching enough space
- [ ] Allows users to hover other card names in the description to display that card on the side, like it does for keywords.
- [ ] Display the progress of ongoing quests. What to display will probably need to be setup on a per-card basis in the blueprint.
- [ ] Add the ability for the user to see what cards are in a player discard pile
- [ ] Add some visual feedback whenever a player fulfills a quest.
- [ ] Improve the TextWithKeyword component to be able to display things like rune, AP or gold icons. Then rename it to CardDescription

### Refactoring

- [ ] Maybe we don't need all the bells and whistles with scaling and mitigations for the Damage class, inerceptors on `dealtDamage` and `receivedDamage` should be enough. Let's keep the Damage class though, it might still be useful down the line.
- [ ] Make the AI less stupid. while it's probably pointless to try to make the AI look further ahead (too slow), better adjustments to the game state scoring system, more AI hint "archetypes" and better filtering of pointless inputs would be great.
- [ ] Refactor the card target selection to be handled by the engine and not the client

### Bugs
- [ ] [KeywordImuunity](packages/engine/src/unit/modifiers/keyword-immunity.modifier.ts) is not working
- [ ] Server session crashes as soon as an error occurs during an input. It needs error handling, at least for recoverable errors
- [ ] AI or automatic attacks (for exemple because of [RageModifierMixin](packages/engine/src/unit//modifier-mixins/rage.mixin.ts)) sometimes fire from range but the attacker should be melee.
- [ ] AI sometimes just moves units to the top of the map without any specific reason.
- [ ] AI will always spend all of it action points, which sometimes maks it step out of shrines for no reason.
- [ ] The card spacing in the opponent's hand after the first turn is incorrect, resulting in cards being spaced too much.
- [ ] Avoid a shrine

## Medium Priority (enhancements)

- [ ] make the Battle Log interactive by giving it the possibility to hover pars of the events to highlight them on the board.

## Low Priority (nice to have)

- [ ] When drawing a card, it would be cool if the card appeared from the deck icon in the player infos then went into the hand


# PHASE 2: MVP

The goal of this phase is to use the prototype to make a minimalistic versions that can be presented for user testing.
Players will be able to choose between a few predefined decks or create their own with access to all the cards.
Players will be able 
- follow a game tutorial
- play vs AI 
- create lobbies to play pvp games
However, players wont have a user account yet as there won't be any backend API besides the websocket server for PVP games
At this point, a good target would be to publish the game on itch.io

# PHASE 3: Full game

The goal of this stage is to refine the game, taking players feedback into account, to make a game worthy of being officially released to broader platforms such as steam.
Players will be able to
- make an account / login
- manage their cards collection
- manage their friends via a friendlist
- play ranked games vs other players
- play friendly games versus players in their friend list
- play single player gams vs AI, with different themes like boss battles, survival, etc
- play puzzle games when they need to do X within the current turn
- buy booster packs and craft cards
- spectate and replay gams
- consult player profile pages rankings, leaderboards...

# Change Log

- [x] 25/01/2025: Disable the card shimmer effect while it is being dragged as it is costly and can cause dropped frames
- [x] 24/01/2025: Add a commanding shrine on the middle of the board that allows a player to summon unit on it
- [x] 24/01/2025!Add a highlight on a board cell to show the AOE of a unit attack or a spell.
- [x] 24/01/2025: When a player has many cards in hand, it becomes hard to hover the one after the other.
- [x] 24/01/2025: Add a `Berzerk` [keyword](packages/engine/src/unit/keywords.ts) that makes a unit move to the nearest unit or general at the beginning of its turn, and attack it. Add the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword.
- [x] 19/01/2025: In sandbox mode, the player informations keep swapping position along with the active player.
- [x] 19/01/2025: - [Red Exorcist](packages/engine//src/card/cards/core/red_exorcist.ts) Damage amplification on shrines seems to not be working.
- [x] 17/01/2025: Sandbox first draft
- [x] 14/01/2025: Tutorial first draft
- [x] 11/01/2025: Fixed auras persisting after the unit was destroyed
- [x] 10/01/2025: Add a Fortune Shrine obstacle that grants 1 gold at the start of the turn when standing on it
- [x] 10/01/2025: Removed the reward for bringing a general to half HP. Doubled the reward t bringing them to 0hp.
- [x] 10/01/2025: Add some visual feedback to shos the modifiers applied to a unit.
- [x] 09/01/2025: Units appear below tiles when they are on some places in the top row.
- [x] 09/01/2025: Display tooltips on the resource actions of the ActionWheel
- [x] 09/01/2025: Add some visual feedback whenever a player earns Vicory Points.
- [x] 09/01/2025: Add some visual feedback whenever a player gains gold.
- [x] 09/01/2025: Add some visual feedback whenever a player unlocks a rune.
- [x] 08/1/2025: Add some visual feedbacks on units to easily know how much AP they have left. Be careful not to clutter the board too much, it could decrease readability when multiple units are packed close to each other.
- [x] 08/01/2025: - [ ] Add a `Burn` [keyword](packages/engine/src/unit/keywords.ts) that makes a unit take damage at the beginning of its turn equal to the amount of burn stacks it has. Add the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword.
- [x] 08/01/2025: add a `Spellcaster` keyword [keyword](packages/engine/src/unit/keywords.ts) that allows spell cards to use the unit position as a base for spell that have a range. Implement the [UnitModifierMixin](packages/engine/src/unit/modifier-mixins/unit-modifier-mixin.ts)implementing the keyword
- [x] 07/01/2025: Adds the Comeback mechanic that draws cards for the opponent when you reach see some VP thresholds. See the [General section](docs/DESIGN_DOCUMENT.md#comeback-mechanic) in the design document.
- [x] 07/01/2025: Rework the way shrine work to match the current design in the [Design document](docs/DESIGN_DOCUMENT.md#shrines)
- [x] 07/01/2025: The altar mechanic has been replaced by a moving general. See the [General section](docs/DESIGN_DOCUMENT.md#generals) in the design document.
  - [x] Distinguish between generals and minion
  - [x] Add a player general to the board at the start of the game
  - [x] Provide visual feedback to distinguish generals from minions 
  - [x] General rewards at 50% HP and when destroyed
  - [x] General Ghost mechanic
- [X] 07/01/2025: Remove the Reward points from units as this feature has been removed from the design document.
- [x] 06/01/2025: Cards in the opponent's hand are sometimes not displayed properly.