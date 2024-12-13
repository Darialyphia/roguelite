import { isDefined } from '@game/shared';
import { GAME_EVENTS } from '../../game/game';
import type { ObstacleBlueprint } from '../obstacle-blueprint';
import { config } from '../../config';

export const shrine: ObstacleBlueprint = {
  id: 'shrine',
  name: 'Victory Shrine',
  description: 'Grant 1 Victory point to its owner at the end of the turn.',
  spriteId: 'shrine',
  walkable: false,
  onCreated(game, obstacle) {
    obstacle.meta.unsub = game.on(GAME_EVENTS.TURN_END, () => {
      const neighbors = game.boardSystem
        .getNeighbors3D(obstacle.position)
        .map(cell => cell.unit)
        .filter(isDefined);
      const players = new Set(neighbors.map(unit => unit.player));

      const owner =
        players.size === 0
          ? obstacle.player
          : players.size === 1
            ? [...players][0]
            : null;

      if (owner) {
        owner.team.earnVictoryPoints(config.SHRINE_VP_REWARD);
        obstacle.playerId = owner.id;
      } else obstacle.playerId = undefined;
    });
  },
  onDestroyed(game, obstacle) {
    obstacle.meta.unsub();
  }
};
