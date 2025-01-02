import { GAME_EVENTS } from '../../game/game';
import type { ObstacleBlueprint } from '../obstacle-blueprint';

export const shrine: ObstacleBlueprint = {
  id: 'shrine',
  name: 'Victory Shrine',
  description: 'Grant 1 Victory point to its owner at the end of the turn.',
  spriteId: 'shrine',
  walkable: true,
  attackable: false,
  onCreated(game, obstacle) {
    obstacle.meta.unsub = game.on(GAME_EVENTS.TURN_END, () => {
      if (obstacle.occupant) {
        obstacle.occupant.player.team.earnVictoryPoints(game.config.SHRINE_VP_REWARD);
        obstacle.playerId = obstacle.occupant.player.id;
      } else {
        obstacle.playerId = undefined;
      }
    });
  },
  onDestroyed(game, obstacle) {
    obstacle.meta.unsub();
  }
};
