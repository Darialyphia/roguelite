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
              { type: 'WAIT', params: { duration: 500 } },
              {
                type: 'UPDATE_UNIT_LIGHT',
                params: {
                  unit: card.unit,
                  pass: 1,
                  blendMode: 1,
                  steps: [
                    {
                      animated: false,
                      duration: 500,
                      offset: { x: 0, y: 0 },
                      radius: 250,
                      colorStops: [
                        [0, '#FFFF0000'],
                        [0.5, '#FF0000FF'],
                        [1, '#00000000']
                      ]
                    },
                    {
                      animated: true,
                      duration: 500,
                      offset: { x: 0, y: 0 },
                      radius: 200,
                      colorStops: [
                        [0, '#FFFF0000'],
                        [0.5, '#FF0000FF'],
                        [1, '#00000000']
                      ]
                    },
                    {
                      animated: true,
                      duration: 500,
                      offset: { x: 0, y: 0 },
                      radius: 150,
                      colorStops: [
                        [0, '#FFFF0000'],
                        [0.5, '#FF0000FF'],
                        [1, '#00000000']
                      ]
                    },
                    {
                      animated: true,
                      duration: 500,
                      offset: { x: 0, y: 0 },
                      radius: 100,
                      colorStops: [
                        [0, '#FFFF0000'],
                        [0.5, '#FF0000FF'],
                        [1, '#00000000']
                      ]
                    },
                    {
                      animated: true,
                      duration: 500,
                      offset: { x: 0, y: 0 },
                      radius: 50,
                      colorStops: [
                        [0, '#FFFF0000'],
                        [0.5, '#FF0000FF'],
                        [1, '#00000000']
                      ]
                    }
                  ]
                }
              }
            ]
          }
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
