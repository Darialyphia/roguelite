import { PLAYER_EVENTS } from '../../player/player-enums';
import type { ObstacleBlueprint } from '../obstacle-blueprint';

export const commandingShrine: ObstacleBlueprint = {
  id: 'commanding-shrine',
  name: 'Summoning Shrine',
  description:
    'At the start of the turn, if a unit is standing on this, its owner may summon units on this shrine.',
  spriteId: 'commanding-shrine',
  iconId: 'obstacle_commanding-shrine',
  walkable: true,
  attackable: false,
  onDestroyed(game, obstacle) {
    obstacle.meta.interceptorUnsub?.();
    obstacle.meta.eventUnsub?.();
  },
  onEnter(game, obstacle) {
    obstacle.meta.eventUnsub = obstacle.occupant?.player.on(
      PLAYER_EVENTS.START_TURN,
      () => {
        if (!obstacle.occupant) {
          obstacle.playerId = undefined;
          obstacle.meta.interceptorUnsub?.();
          obstacle.meta.eventUnsub?.();
        }

        if (obstacle.occupant && !obstacle.playerId) {
          obstacle.playerId = obstacle.occupant.player.id;
          obstacle.meta.interceptorUnsub = obstacle.addInterceptor(
            'canBeSummonTarget',
            () => true
          );
        }

        obstacle.player?.once(PLAYER_EVENTS.END_TURN, () => {
          obstacle.meta.interceptorUnsub?.();
          obstacle.playerId = undefined;
          if (!obstacle.occupant) {
            obstacle.meta.eventUnsub?.();
          }
        });
      }
    );
  }
};
