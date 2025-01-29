import { meleeFighter } from '../../../ai/ai-traits';
import { Damage } from '../../../combat/damage/damage';
import { DAMAGE_TYPES } from '../../../combat/damage/damage.enums';
import { NoMitigationStrategy } from '../../../combat/damage/mitigation/no-mitigation.strategy';
import { NoScalingStrategy } from '../../../combat/damage/scaling/no-scaling.strategy';
import { createEntityId } from '../../../entity';
import { GAME_EVENTS } from '../../../game/game';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { GameEventModifierMixin } from '../../../unit/modifier-mixins/game-event.mixin';
import { RageModifier } from '../../../unit/modifiers/rage.modifier';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS, UNIT_TYPES } from '../../card-enums';

export const redRageEffigy: UnitCardBlueprint = {
  id: 'red-rage-effigy',
  spriteId: 'red-placeholder',
  iconId: 'placeholder',
  set: CARD_SETS.CORE,
  name: 'Rage Effigy',
  description:
    '@Structure@.\n At the start of your turn, Give @Rage@ to the enemy unit with the highest attack.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 4,
    runes: [RUNES.RED, RUNES.COLORLESS]
  },
  jobs: [JOBS.MAGE],
  atk: 0,
  maxHp: 2,
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new UnitSummonTargetingtrategy(game, card);
      }
    }
  ],
  getAoe(game) {
    return new PointAOEShape(game);
  },
  vfx: {
    play() {
      return { tracks: [] };
    },
    destroy() {
      return { tracks: [] };
    }
  },
  onPlay(game, card) {
    card.unit.addModifier(
      new UnitModifier(createEntityId('rage-effigy-buff'), game, card, {
        stackable: false,
        mixins: [
          new GameEventModifierMixin(game, {
            eventName: GAME_EVENTS.PLAYER_START_TURN,
            handler(event) {
              if (!event.player.equals(card.player)) return;

              const target = card.player.enemyUnits
                .slice()
                .sort((a, b) => a.atk - b.atk)[0];
              if (!target) return;

              target.addModifier(new RageModifier(game, card));
            }
          })
        ]
      })
    );
  }
};
