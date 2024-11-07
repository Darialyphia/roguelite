import type { EntityId } from '../entity';
import { System } from '../system';
import type { Player } from './player.entity';
import { Team, type TeamOptions } from './team.entity';

export type PlayerSystemOptions = { teams: TeamOptions[] };

export class PlayerSystem extends System<PlayerSystemOptions> {
  private teamMap = new Map<EntityId, Team>();

  private playerMap = new Map<EntityId, Player>();

  initialize(options: PlayerSystemOptions): void {
    options.teams.forEach(t => {
      const team = new Team(t);
      this.teamMap.set(team.id, team);
      team.players.forEach(player => {
        this.playerMap.set(player.id, player);
      });
    });
  }

  getTeamById(id: EntityId) {
    return this.teamMap.get(id);
  }

  getPlayerById(id: EntityId) {
    return this.playerMap.get(id);
  }

  get teams() {
    return [...this.teamMap.values()];
  }

  get players() {
    return [...this.playerMap.values()];
  }
}
