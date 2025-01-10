import { meleeFighter } from '../../../ai/ai-traits';
import { createEntityId } from '../../../entity';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import {
  isValidTargetingType,
  TARGETING_TYPE
} from '../../../targeting/targeting-strategy';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { SelfEventModifierMixin } from '../../../unit/modifier-mixins/self-event.mixin';
import { BurnModifier } from '../../../unit/modifiers/burn.modifier';
import { UNIT_EVENTS } from '../../../unit/unit-enums';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, UNIT_TYPES } from '../../card-enums';

export const redWillOWisp: UnitCardBlueprint = {
  id: 'red-will-o-wisp',
  spriteId: 'will-o-wisp',
  iconId: 'unit_will-o-wisp',
  name: 'Will-o-wisp',
  description: 'Inflict @Burn(1)@ to minions damaged by this unit.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 2,
    runes: [RUNES.RED]
  },
  jobs: [JOBS.FIGHTER],
  atk: 2,
  maxHp: 1,
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
    const burnOnDamageMixin = new SelfEventModifierMixin(game, {
      eventName: UNIT_EVENTS.AFTER_DEAL_DAMAGE,
      handler(event) {
        event.targets.forEach(target => {
          const shouldBurn = isValidTargetingType(
            game,
            target.position,
            card.unit.player,
            TARGETING_TYPE.ENEMY_MINION
          );
          if (shouldBurn) {
            target.addModifier(
              new BurnModifier(game, card, { source: card, initialStacks: 1 })
            );
          }
        });
      }
    });

    const modifier = new UnitModifier(createEntityId('willowisp_on_attack'), game, card, {
      stackable: false,
      mixins: [burnOnDamageMixin]
    });

    card.unit.addModifier(modifier);
  }
};
