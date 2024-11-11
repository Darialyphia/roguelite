import type { Game } from '@game/engine';
import type { Player } from '@game/engine/src/player/player.entity';

export type PlayerViewModel = ReturnType<typeof makePlayerViewModel>;
export const makePlayerViewModel = (game: Game, player: Player) => {
  return {
    id: player.id,
    roster: player.roster,
    getPlayer() {
      return player;
    }
  };
};
