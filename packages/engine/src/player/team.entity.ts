import { Player, type PlayerOptions } from './player.entity';
import { createEntityId, Entity, type EntityId } from '../entity';
import type { Game } from '../game/game';
import type { Unit } from '../unit/unit.entity';

export type TeamOptions = {
  id: string;
  players: PlayerOptions[];
};

export class Team extends Entity {
  private playerMap = new Map<EntityId, Player>();

  private _victoryPoints = 0;

  private game: Game;

  constructor(game: Game, options: TeamOptions) {
    super(createEntityId(options.id));
    this.game = game;
    options.players.forEach(player => {
      const entity = new Player(game, this, player);
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
