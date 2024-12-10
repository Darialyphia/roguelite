import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { MeleeTargetingStrategy } from '../../../targeting/melee-targeting.straegy';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import type { VFXSequenceTrack } from '../../../vfx/vfx-sequencer';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS } from '../../card-enums';

export const testUnit: UnitCardBlueprint = {
  id: 'testUnit',
  spriteId: 'lancer',
  iconId: 'unit-lancer',
  name: 'Test Unit',
  description: '',
  kind: CARD_KINDS.UNIT,
  aiHints: {},
  cost: {
    gold: 3,
    runes: [RUNES.RED]
  },
  jobs: [JOBS.FIGHTER],
  atk: 3,
  maxHp: 8,
  speed: 6,
  reward: 1,
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new UnitSummonTargetingtrategy(card);
      }
    }
  ],
  getAttackPattern(game, unit) {
    return new MeleeTargetingStrategy(game, unit, TARGETING_TYPE.ENEMY, {
      allowDiagonals: false
    });
  },
  getAoe(game, card, points) {
    return new PointAOEShape(game, points[0]);
  },
  vfx: {
    play(game, card) {
      return {
        tracks: [
          {
            steps: [
              {
                type: 'TINT_SCREEN',
                params: {
                  blendMode: 2,
                  steps: [
                    { color: '#ff0000aa', transitionDuration: 500, duration: 1000 }
                  ],
                  endTransitionDuration: 500
                }
              }
            ]
          },
          ...game.unitSystem.units
            .filter(u => !u.equals(card.unit))
            .map<VFXSequenceTrack>(unit => ({
              steps: [
                {
                  type: 'WAIT',
                  params: {
                    duration: 500
                  }
                },
                {
                  type: 'SHAKE_UNIT',
                  params: {
                    isBidirectional: true,
                    amplitude: 15,
                    duration: 800,
                    unit
                  }
                }
              ]
            }))
        ]
      };
    },
    destroy() {
      return { tracks: [] };
    }
  },
  onPlay() {
    return;
  }
};
