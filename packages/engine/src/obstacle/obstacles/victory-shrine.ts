import { PLAYER_EVENTS } from '../../player/player-enums';
import type { ObstacleBlueprint } from '../obstacle-blueprint';

export const victoryShrine: ObstacleBlueprint = {
  id: 'victory-shrine',
  name: 'Victory Shrine',
  description:
    'Grant 1 Victory point to the owner of the minion standing on it at start of their turn.',
  spriteId: 'victory-shrine',
  iconId: 'obstacle_victory-shrine',
  walkable: true,
  attackable: false,
  onDestroyed(game, obstacle) {
    obstacle.meta.unsub();
  },
  onEnter(game, obstacle) {
    if (obstacle.occupant!.isGeneral) return;
    obstacle.playerId = obstacle.occupant!.player.id;

    obstacle.meta.unsub = obstacle.occupant?.player.on(PLAYER_EVENTS.START_TURN, () => {
      obstacle.occupant!.player.team.earnVictoryPoints(game.config.VICTORY_SHRINE_REWARD);
    });
  },
  onLeave(game, obstacle) {
    obstacle.meta.unsub?.();
    obstacle.playerId = undefined;
  }
};
