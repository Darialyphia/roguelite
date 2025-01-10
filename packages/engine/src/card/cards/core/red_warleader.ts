import { meleeFighter } from '../../../ai/ai-traits';
import { createEntityId } from '../../../entity';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { InterceptorAuraModifierMixin } from '../../../unit/modifier-mixins/interceptor-aura.mixin';
import { SplashAttackModifier } from '../../../unit/modifiers/splash-attack.modifier';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, UNIT_TYPES } from '../../card-enums';

export const redWarLeader: UnitCardBlueprint = {
  id: 'red-warleader',
  spriteId: 'warleader',
  iconId: 'unit_warleader',
  name: 'Warleader',
  description: '@Splash Attack@.\nAllies nearby this unit have +1 / +0.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 6,
    runes: [RUNES.RED, RUNES.RED, RUNES.RED]
  },
  jobs: [JOBS.FIGHTER],
  atk: 4,
  maxHp: 8,
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
    card.unit.addModifier(new SplashAttackModifier(game, card));
    card.unit.addModifier(
      new UnitModifier(createEntityId('warleader_aura'), game, card, {
        stackable: true,
        initialStacks: 1,
        mixins: [
          new InterceptorAuraModifierMixin(game, {
            key: 'attack',
            isElligible(unit, modifier) {
              return (
                unit.isAlly(modifier.target) &&
                unit.position.isNearby(modifier.target, game)
              );
            },
            interceptor(attack) {
              return attack + 1;
            }
          })
        ]
      })
    );
  }
};
