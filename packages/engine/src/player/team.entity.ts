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
    deck: { cards: { blueprintId: string }[] };
    startPosition: Point3D;
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
      const entity = new Player(game, this, {
        startPosition: player.startPosition,
        id: player.id,
        name: player.name,
        deck: player.deck.cards.map(card => ({
          id: `${player.id}_card_${card.blueprintId}_${nanoid(4)}`,
          blueprint: CARDS_DICTIONARY[card.blueprintId as keyof typeof CARDS_DICTIONARY]
        }))
      });
      this.playerMap.set(entity.id, entity);
    });

    this.game.on('unit.after_destroy', this.onUnitDestroyed.bind(this));
  }

  get players() {
    return [...this.playerMap.values()];
  }

  get victoryPoints() {
    return this._victoryPoints;
  }

  getPlayerById(id: EntityId) {
    return this.playerMap.get(id);
  }

  earnVictoryPoints(amount: number) {
    this._victoryPoints += amount;
    if (this._victoryPoints >= this.game.config.VICTORY_POINTS_WIN_THRESHOLD) {
      this.game.gamePhaseSystem.endBattle();
    }
  }

  private onUnitDestroyed({ unit }: { unit: Unit }) {
    if (unit.player.team.equals(this)) return;
    this.earnVictoryPoints(unit.reward);
  }
}
