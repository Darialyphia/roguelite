import { PLAYER_EVENTS } from '../../player/player-enums';
import type { ObstacleBlueprint } from '../obstacle-blueprint';

export const fortuneShrine: ObstacleBlueprint = {
  id: 'fortune-shrine',
  name: 'Fortune Shrine',
  description:
    'Grant 1 gold to the owner of the minion standing on it at start of their turn.',
  spriteId: 'gold-shrine',
  iconId: 'obstacle_fortune-shrine',
  walkable: true,
  attackable: false,
  onDestroyed(game, obstacle) {
    obstacle.meta.unsub();
  },
  onEnter(game, obstacle) {
    if (obstacle.occupant!.isGeneral) return;
    obstacle.playerId = obstacle.occupant!.player.id;

    obstacle.meta.unsub = obstacle.occupant?.player.on(PLAYER_EVENTS.START_TURN, () => {
      obstacle.occupant!.player.addGold(game.config.GOLD_SHRINE_REWARD);
    });
  },
  onLeave(game, obstacle) {
    obstacle.meta.unsub?.();
    obstacle.playerId = undefined;
  }
};
