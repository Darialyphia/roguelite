# PLACEHOLDER-NAME-BUT-ITS-COOL-TRUST-ME

Note: all numbers provided in this design document are subject to change and are here just as an exemple.

## Overview

The game is a trading card game - board game hybrid

The game opposes two players.

Each player has a deck of cards and an altar that starts on the board.

On their turn, players increase their resources, draw and play cards, move their units and attack with them

The goal of the game is to accumulate more victory points (called VP in this document) than your opponent (see below about victory points).

## Game Board and Range

The game board consists of hexagonal tiles, allowing for six possible directions of movement per tile.

All ranges in the game are calculated using a "ring-based" approach. For example:

- A range of 1 includes all hexes directly adjacent to the unit or tile in question.

- A range of 2 includes all hexes that are two steps away, forming a concentric ring.

## PLAYERS

Players start with 3 cards in their hand. They can, at the beginning of the game, choose to replace any of those 3 cards. This is called the mulligan phase.

The players alternate taking their turn. The first player to play is determined via a rock-paper-scissors minigame at the start of the game.

As a compensation, the player who plays second gets an additional special card at the beginning of the game. This card costs 0 gold and allows a player to either

- gain one gold

- draw one card

- deal 1 damage to a unit.

At the beginning of their turn, players draw one card.

During their turn, the player can

- move their units

- make the unit attack one times

- play one or more cards

- use their resource action for the turn (see below about resources actions).

## Resources

There are two resources in the game : Gold and Runes.

### Gold

Gold is used to play cards, and gets acquired at a fixed rate (3 per turn).

Gold does not reset between turns: it is possible to accumulate gold for several turns in order to play an expensive card.

While a player has no upper limit to the amount of gold they have, at the end of their turn, their gold will be soft capped to 12, meaning that if they end their turn with more than 12 gold, only 12 gold will carry on to the next turn.

### Runes

Runes serves as a gating mechanism for cards and unit abilities.

There are 5 types of runes of different color:

- Creation (Green)
- Destruction (Red)
- Order (Yellow),
- Oblivion (Purple)
- Arcane (Blue)

Once a player acquires a rune, it is never spent: for example once you have 2 red runes, you can play as many cards that have up to 2 red runes as a requirement

### Resource actions

Players get one Resource Action per turn that they can activate during any of their unit's turn. They can either

- Add a rune to their rune pool

- Gain one additional gold

- Draw an additional card

## Altar

Each player starts the game with an altar, which is use as an anchor for summoning unit on the board.

Victory points: altars are high-value targets. Bringing their HP to zero awards 6 Victory Points.

Abilties: each altar possesses unique abilities, which may include passive effects, activated powers, or buffs. Once destroyed, an altar loses these effects.

## Cards

See [here](https://docs.google.com/spreadsheets/d/1Kxi_LxDMIQihuY53rrvQ4qTDpE6dk17BTxk4E4K7dKA/edit?usp=sharing) for the list of implemented and planned cards.

There are three types of cards.

### Unit Cards

Units have the following stats:

- Gold cost: the amount of gold needed to play the unit.

- Rune cost: the runes requirement to play the card. Some of those runes can be "Colorless Runes" and can be fulfilled by a rune of any kind.

- Attack (ATK): the amount of damage this unit inflicts when it attacks.

- Health Points (HP): the amount of damage a unit can take before being destroyed

Units cannot act the turn they are summoned (unless specified otherwise on the card text).

Units can usually only be summoned nearby its player's altar, but some effects may circumvent this restriction.

### Movement

Unit can move up to 2 hexes on the board.

A unit is no longer able to move during their turn once they have attacked.

### Attack

Unit can attack another nearby unit (although a card may have special effects that allows attacking other attack patterns).

The first attack in a turn costs 1 AP.

Attacked units can counterattack. A counterattack means the unit will attack back the attacker, if able to. For example, some units are ranged but cannot attack in melee range, so when attack in melee range, they will not counterattack.

A unit will counterattack even if it was destroyed by the attacker. A killing blow will not prevent a counterattack.

### Abilities

Units may also have activated abilities that are used by spending the correspondiong AP cost.

Abilities and unit passive effect may be gated by a higher rune requirement than what they needed to be played.

Some example abilities would be: dealing damagz to another unit, modifying another unit's stats, healing another unit, granting an ally Action Points, increasing an enemy Reward Points, drawing cards, etc...

## Spell Cards

Spell cards are played using gold. They are usually one-time effect, but they can also have ongoing effects, like granting a stat bonus to an ally.

In the same way as unit cards, spells have a gold cost and runes requirements.

## Quest Cards

A quest card has an ongoing effect that has requirements of things happening on the board.

Once those requirements are met, the quest is removed from the board, and its player gets the quest reward.

Quest rewards are usually Victory Points, but they can be something else.

A player can have a maximum of 2 ongoing quests at the same time. While they have two, they are not able to play another quest card.

## Shrines

Some special tiles on the board are called shrines.

Units can walk on those shrines freely.

At the start of every player's turn, if a unit is standing on a shrine, its effect trigger.

A shrine can only be controlled by one player. While multiple units cannot normally be on the same board tile, If that case were to happen due to special conditions, the shrine won't award Victory Points to any player.

The different kind of shrines are:

- Victory Shrine: grants 1 victory point
- Fortune Shrine: grants 1 gold

## Victory Condition

Players accumulate Victory Points (VP) by accomplishing certain feats.

A player win the game by having 12 VP.

VPs can be earned by

- Controlling shrines.

- Fulfilling quest cards.

- Destroying the enemy altar awards 6 VP.

## Turn Limit and Endgame

The game has a turn limit of 15 turns per player (20 turns total). If neither player has reached 15 VP by the end of the game, bonus turns are introduced:

Both players take additional turns until one player has more VP than the other at the end of a full round (both players have completed a turn).

If a limit of 3 additional rounds is reached and the game is still tied, the game ends in a draw.
