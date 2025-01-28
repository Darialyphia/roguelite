import { createEntityId } from '../../entity';
import { GAME_EVENTS } from '../../game/game';
import { PLAYER_EVENTS } from '../../player/player-enums';
import { KEYWORDS } from '../../unit/keywords';
import { CommanderModifier } from '../../unit/modifiers/commander.modifier';
import { UNIT_EVENTS } from '../../unit/unit-enums';
import type { ObstacleBlueprint } from '../obstacle-blueprint';

export const commandingShrine: ObstacleBlueprint = {
  id: 'commanding-shrine',
  name: 'Summoning Shrine',
  description:
    'At the start of the turn, if a unit is standing on this, give it @Commander@ until the end of the turn or until it moves.',
  spriteId: 'commanding-shrine',
  iconId: 'obstacle_commanding-shrine',
  walkable: true,
  attackable: false,
  onCreated(game, obstacle) {
    game.on(GAME_EVENTS.PLAYER_START_TURN, event => {
      obstacle.playerId = obstacle.occupant?.player.id;

      if (!obstacle.occupant) return;

      if (obstacle.occupant.player.isEnemy(event.player)) {
        return;
      }
      const unit = obstacle.occupant;
      const modifierId = createEntityId(KEYWORDS.COMMANDER.id);

      const isAlreadyCommander = unit.hasModifier(modifierId);
      if (isAlreadyCommander) {
        event.player.once(PLAYER_EVENTS.END_TURN, () => {
          obstacle.playerId = undefined;
        });
        return;
      }

      unit.addModifier(new CommanderModifier(game, event.player.altar.card));
      const unsub = unit.once(UNIT_EVENTS.AFTER_MOVE, () => {
        unit.removeModifier(modifierId);
      });
      event.player.once(PLAYER_EVENTS.END_TURN, () => {
        unsub();
        unit.removeModifier(modifierId);
        obstacle.playerId = undefined;
      });
    });
  },
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
