import { meleeFighter } from '../../../ai/ai-traits';
import { createEntityId } from '../../../entity';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { InterceptorModifierMixin } from '../../../unit/modifier-mixins/interceptor.mixin';
import { SelfEventModifierMixin } from '../../../unit/modifier-mixins/self-event.mixin';
import { UNIT_EVENTS } from '../../../unit/unit-enums';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS, UNIT_TYPES } from '../../card-enums';

export const redMasterAtArms: UnitCardBlueprint = {
  id: 'red-master-at-arms',
  spriteId: 'master-at-arms',
  iconId: 'unit_master-at-arms',
  set: CARD_SETS.CORE,
  name: 'Arms Master',
  description: 'Before this unit attacks, give it +1/+0.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 4,
    runes: [RUNES.RED, RUNES.RED]
  },
  jobs: [JOBS.FIGHTER],
  atk: 1,
  maxHp: 7,
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
    const atkModifier = new UnitModifier(
      createEntityId('master_at_arms_buff'),
      game,
      card,
      {
        stackable: true,
        initialStacks: 1,
        iconId: 'keyword-attack-buff',
        name: 'Master at Arms buff',
        description: '+1/+0',
        mixins: [
          new InterceptorModifierMixin(game, {
            key: 'attack',
            interceptor: (attack, modifier) => attack + modifier.stacks
          })
        ]
      }
    );
    card.unit.addModifier(
      new UnitModifier(createEntityId('master-at-arms-listener'), game, card, {
        stackable: false,
        mixins: [
          new SelfEventModifierMixin(game, {
            eventName: UNIT_EVENTS.BEFORE_ATTACK,
            handler() {
              card.unit.addModifier(atkModifier);
            }
          })
        ]
      })
    );
  }
};
