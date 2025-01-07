import { Player } from './player.entity';
import { createEntityId, Entity, type EntityId } from '../entity';
import type { Game } from '../game/game';
import type { Unit } from '../unit/unit.entity';
import type { Point3D } from '@game/shared';
import { CARDS_DICTIONARY } from '../card/cards/_index';
import { nanoid } from 'nanoid';

export type TeamOptions = {
  id: string;
  players: Array<{
    id: string;
    name: string;
    deck: { general: { blueprintId: string }; cards: { blueprintId: string }[] };
    generalPosition: Point3D;
  }>;
};

export class Team extends Entity {
  private playerMap = new Map<EntityId, Player>();

  private _victoryPoints = 0;

  private game: Game;

  constructor(game: Game, options: TeamOptions) {
    super(createEntityId(options.id));
    this.game = game;
    options.players.forEach(player => {
      const generalBlueprint =
        CARDS_DICTIONARY[
          player.deck.general.blueprintId as keyof typeof CARDS_DICTIONARY
        ];
      if (!generalBlueprint) {
        throw new Error(`blueprint not found: ${player.deck.general.blueprintId}`);
      }

      const entity = new Player(game, this, {
        generalPosition: player.generalPosition,
        id: player.id,
        name: player.name,
        deck: {
          general: {
            id: `${player.id}_general_${player.deck.general.blueprintId}`,
            blueprint: generalBlueprint
          },
          cards: player.deck.cards.map(card => {
            const blueprint =
              CARDS_DICTIONARY[card.blueprintId as keyof typeof CARDS_DICTIONARY];
            if (!blueprint) {
              throw new Error(`blueprint not found: ${card.blueprintId}`);
            }
            return {
              id: `${player.id}_card_${card.blueprintId}_${nanoid(4)}`,
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
    const prev = this._victoryPoints;
    this._victoryPoints += amount;

    if (
      prev < this.game.config.VP_SECOND_REWARD_THRESHOLD &&
      this.victoryPoints >= this.game.config.VP_SECOND_REWARD_THRESHOLD
    ) {
      this.opponents.forEach(opponent => {
        opponent.draw(1);
      });
    }
    if (
      prev < this.game.config.VP_FIRST_REWARD_THRESHOLD &&
      this.victoryPoints >= this.game.config.VP_FIRST_REWARD_THRESHOLD
    ) {
      this.opponents.forEach(opponent => {
        opponent.draw(1);
      });
    }
    if (this._victoryPoints >= this.game.config.VP_WIN_THRESHOLD) {
      this.game.gamePhaseSystem.endBattle();
    }
  }
}
