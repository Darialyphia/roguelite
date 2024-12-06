# PLACEHOLDER-NAME-BUT-ITS-COOL-TRUST-ME

Note: all numbers provide din this design document  are subject to change and are here just as an exemple

## Overview

- The game is a TCG - board game hybrid
- The game opposes two players (or teams of players).
- Players have a deck of cards and a starting general that starts on the board.
- On their turn, players increase their resources, draw and play cards, move their units and attack with them
- The goal of the game is to accumulate more victory points (VP) than your opponent (see more below about victory points).

## TURN ORDER
- There are no player turns. Instead, every unit has a speed attribute. Units get to act in decreasing order of speed.
- In case of units with similar speed, priority is given to the unit from the opposing team of the last unit that got to act. If both units are of the same team, they are both given a hidden bonus to their speed between 0 and 0.1 at random. This bonus changes every turn and is just a technical detail.
- During a unit turn, the player can
    - move the unit
    - make the unit attack one or more times
    - play one or more cards
    - use their resource action for the turn (see below about resources actions).

## Resources
- There are three resources in the game : Gold, Runes and Action Points.
    - Gold: Gold is used to play unit cards, and gets aquired at a fixed rate (3 per turn). It does not reset between turns: it is possible to accumulate gold for several turns in order to play an expensive card.
    - Runes: Runes serves as a gating mechanism for cards and unit abilities. There are 5 types runes of different color. Once a rune is added, it is never spent: for example once you have 2 red runes, you can play as many cards that have up to 2 red runes as a requirement to be played.
    - Action Points (AP): Units have 4 AP available that reset every turn. AP are used to play spell cards, move, attack and activate unit 
    abilities.
- Player get one Resource Action per turn that they can activate during any of their unit's turn. They can either
    - Add a rune to their rune pool
    - Gain one additional gold
    - Draw an additional card

## Unit Cards
- Units have the following stats: 
    - type: Minion / General. A Player only has one general, and it sonly difference with a regular unit is that it starts the game already deployed.
    - Gold cost: the amount of gold needed to play the unit.
    - Rune cost: the runes requirement to play the card. A white rune means "a rune of any color"
    - Attack (ATK): the amount of damage this unit inflicts when it attacks
    - Health Points (HP): the amount of damage a unit can take before being destroyed
    - Speed (SPD): the unit's speed that determines its place in the turn order
    - Reward Points (RP): the amount of Victory Points awarded to your opponent when the unit is destroyed.
- Unit can move on the board by spending one AP per tile.
- Unit can attack another nearby unit as long as they are axis aligned (no diagonals), by spending 1AP. The cost increases by 2 for every attack (1, then 3, then 5, etc...)
- [REALLY NOT SURE ABOUT THIS ONE] Units have a class. They can play Spell Cards by spending AP as long as their class align with the spell's class (mages can play mage cards, fighters can play fighter cards, etc...).
- Units may also have activated abilities that are used by spending the correspondiong AP cost. 
- Abilities and unit passive effect gated by a higher rune requirement than what they needed to be played.


## Spell Cards
- Spell cards are played by spending a unit's AP.
- A Spell effect can depend on the the runes in a player rune pool, as well as its caster (for example, a spell that deals damage to enemies nearby the caster)

## Victory Condition
- Players accumulate Victory Points (VP) by accomplishing certain feats.
- The game ends after 7 turns, or when a player accumulates 12 VP.
- VP can be earned by
    - destroying unit: when destroy, VP are awarded according to the unit's Reward Points.
    - controlling shrines: 3 shrines are present on the board. When a turn ends, if units of only one team are nearby the shrine, 1 VP is awarded
    - [NOT SURE ABOUT THIS ONE] Players can add a Quest card to their deck. The quest is activated at the start of the game and, when its conditions are met, the player gains the quest reward as VP.