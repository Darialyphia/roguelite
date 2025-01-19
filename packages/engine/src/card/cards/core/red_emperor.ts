import { meleeFighter } from '../../../ai/ai-traits';
import { createEntityId } from '../../../entity';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { NearbyTargetingStrategy } from '../../../targeting/nearby-targeting-strategy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { InterceptorModifierMixin } from '../../../unit/modifier-mixins/interceptor.mixin';
import { UntilEndOfTurnModifierMixin } from '../../../unit/modifier-mixins/until-end-of-turn.mixin';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, UNIT_TYPES } from '../../card-enums';

export const redEmperor: UnitCardBlueprint = {
  id: 'red-emperor',
  spriteId: 'emperor',
  iconId: 'unit_emperor',
  name: 'Emperor',
  description: '@Summon@: give a nearby ally +2 / +0 this turn.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 4,
    runes: [RUNES.RED, RUNES.RED]
  },
  jobs: [JOBS.SHOOTER],
  atk: 3,
  maxHp: 4,
  minTargets: 2,
  targets: [
    {
      getTargeting(game, card) {
        return new UnitSummonTargetingtrategy(game, card);
      }
    },
    {
      getTargeting(game, card, points) {
        return new NearbyTargetingStrategy(
          game,
          card,
          points[0],
          TARGETING_TYPE.ALLY_UNIT
        );
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
  onPlay(game, card, cells, unitTargets) {
    unitTargets[1].addModifier(
      new UnitModifier(createEntityId('red_emperor'), game, card, {
        stackable: true,
        initialStacks: 1,
        iconId: 'keyword-attack-buff',
        name: 'Emperor buff',
        description: '+1 / +0 this turn',
        mixins: [
          new InterceptorModifierMixin(game, {
            key: 'attack',
            interceptor: (value, modifier) => value + modifier.stacks * 2
          }),
          new UntilEndOfTurnModifierMixin(game)
        ]
      })
    );
  }
};
