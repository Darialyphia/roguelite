import { PLAYER_EVENTS } from '../../player/player-enums';
import type { ObstacleBlueprint } from '../obstacle-blueprint';

export const shrine: ObstacleBlueprint = {
  id: 'shrine',
  name: 'Victory Shrine',
  description:
    'Grant 1 Victory point to the owner of the minion standing on it at start of their turn.',
  spriteId: 'shrine',
  iconId: 'obstacle_shrine',
  walkable: true,
  attackable: false,
  onDestroyed(game, obstacle) {
    obstacle.meta.unsub();
  },
  onEnter(game, obstacle) {
    obstacle.playerId = obstacle.occupant!.player.id;
    if (obstacle.occupant!.isGeneral) return;

    obstacle.meta.unsub = obstacle.occupant?.player.on(PLAYER_EVENTS.START_TURN, () => {
      obstacle.occupant!.player.team.earnVictoryPoints(game.config.SHRINE_VP_REWARD);
    });
  },
  onLeave(game, obstacle) {
    obstacle.meta.unsub?.();
    obstacle.playerId = undefined;
  }
};
