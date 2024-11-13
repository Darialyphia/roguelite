import type { Game } from '@game/engine';
import type { EntityId } from '@game/engine/src/entity';
import type { RosterUnit } from '@game/engine/src/player/player-roster.component';
import type { Player } from '@game/engine/src/player/player.entity';

export type PlayerViewModel = {
  id: EntityId;
  roster: RosterUnit[];
  getPlayer(): Player;
};

export const makePlayerViewModel = (
  game: Game,
  player: Player
): PlayerViewModel => {
  return {
    id: player.id,
    roster: player.roster.units,
    getPlayer() {
      return player;
    }
  };
};
