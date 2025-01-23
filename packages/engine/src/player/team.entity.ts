import { Player } from './player.entity';
import { createEntityId, Entity, type EntityId } from '../entity';
import type { Game } from '../game/game';
import type { Point3D } from '@game/shared';
import { CARDS_DICTIONARY } from '../card/cards/_index';
import { GAME_PHASES } from '../game/game-phase.system';
import { makeCardId } from '../card/card.utils';

export type TeamOptions = {
  id: string;
  players: Array<{
    id: string;
    name: string;
    deck: { altar: { blueprintId: string }; cards: { blueprintId: string }[] };
    altarPosition: Point3D;
  }>;
};

export class Team extends Entity {
  private playerMap = new Map<EntityId, Player>();

  private _victoryPoints = 0;

  private game: Game;

  isWinner = false;

  constructor(game: Game, options: TeamOptions) {
    super(createEntityId(options.id));
    this.game = game;
    options.players.forEach(player => {
      const altarBlueprint =
        CARDS_DICTIONARY[player.deck.altar.blueprintId as keyof typeof CARDS_DICTIONARY];
      if (!altarBlueprint) {
        throw new Error(`blueprint not found: ${player.deck.altar.blueprintId}`);
      }

      const entity = new Player(game, this, {
        altarPosition: player.altarPosition,
        id: player.id,
        name: player.name,
        deck: {
          altar: {
            id: `${player.id}_altar_${player.deck.altar.blueprintId}`,
            blueprint: altarBlueprint
          },
          cards: player.deck.cards.map(card => {
            const blueprint =
              CARDS_DICTIONARY[card.blueprintId as keyof typeof CARDS_DICTIONARY];
            if (!blueprint) {
              throw new Error(`blueprint not found: ${card.blueprintId}`);
            }
            return {
              id: makeCardId(card.blueprintId, player.id),
              blueprint
            };
          })
        }
      });
      this.playerMap.set(entity.id, entity);
    });
  }

  get players() {
    return [...this.playerMap.values()];
  }

  get opponents() {
    return this.game.playerSystem.players.filter(p => p.team.id !== this.id);
  }

  get victoryPoints() {
    return this._victoryPoints;
  }

  getPlayerById(id: EntityId) {
    return this.playerMap.get(id);
  }

  earnVictoryPoints(amount: number) {
    this.players.forEach(player => {
      player.onBeforeTeamVPChange(amount);
    });
    this._victoryPoints += amount;

    if (
      this._victoryPoints >= this.game.config.VP_WIN_THRESHOLD &&
      this.game.gamePhaseSystem.phase === GAME_PHASES.BATTLE
    ) {
      this.isWinner = true;
      this.game.gamePhaseSystem.endBattle();
    }

    this.players.forEach(player => {
      player.onAfterTeamVPChange(amount);
    });
  }
}
