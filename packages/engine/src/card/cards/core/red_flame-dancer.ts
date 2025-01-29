import { meleeFighter } from '../../../ai/ai-traits';
import { Damage } from '../../../combat/damage/damage';
import { DAMAGE_TYPES } from '../../../combat/damage/damage.enums';
import { NoMitigationStrategy } from '../../../combat/damage/mitigation/no-mitigation.strategy';
import { NoScalingStrategy } from '../../../combat/damage/scaling/no-scaling.strategy';
import { createEntityId } from '../../../entity';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { SelfEventModifierMixin } from '../../../unit/modifier-mixins/self-event.mixin';
import { BurnModifier } from '../../../unit/modifiers/burn.modifier';
import { UNIT_EVENTS } from '../../../unit/unit-enums';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS, UNIT_TYPES } from '../../card-enums';

export const redFlameDancer: UnitCardBlueprint = {
  id: 'red-flame-dancer',
  spriteId: 'red-placeholder',
  iconId: 'placeholder',
  set: CARD_SETS.CORE,
  name: 'Flame Dancer',
  description: 'After this deals combat damage, deal 1 damage to every enemy with Burn.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 4,
    runes: [RUNES.RED, RUNES.COLORLESS]
  },
  jobs: [JOBS.MAGE],
  atk: 2,
  maxHp: 6,
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
      new UnitModifier(createEntityId('flame-dancer-buff'), game, card, {
        stackable: false,
        mixins: [
          new SelfEventModifierMixin(game, {
            eventName: UNIT_EVENTS.AFTER_DEAL_DAMAGE,
            handler(event) {
              if (event.damage.type !== DAMAGE_TYPES.COMBAT) return;

              const enemiesWithBurn = game.unitSystem.units.filter(
                unit => unit.isEnemy(card.unit) && unit.hasModifier(BurnModifier)
              );

              card.unit.dealDamage(
                enemiesWithBurn,
                new Damage({
                  source: card,
                  baseAmount: 1,
                  type: DAMAGE_TYPES.ABILITY,
                  mitigations: [new NoMitigationStrategy()],
                  scalings: [new NoScalingStrategy()]
                })
              );
            }
          })
        ]
      })
    );
  }
};
