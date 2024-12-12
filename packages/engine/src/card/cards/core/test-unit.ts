import { randomInt } from '@game/shared';
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
        return new UnitSummonTargetingtrategy(game, card);
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
      const bubbles = Array.from({ length: 5 }, () => ({
        x: randomInt(150),
        y: randomInt(75)
      }));
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
          },
          ...bubbles.map<VFXSequenceTrack>(bubble => ({
            steps: [
              { type: 'WAIT' as const, params: { duration: 1000 } },
              {
                type: 'ADD_LIGHT_AT',
                params: {
                  blendMode: 1,
                  fadeInDuration: 0,
                  fadeOutDuration: 0,
                  position: card.unit.position,
                  steps: [
                    {
                      duration: 200,
                      radius: 20,
                      offset: { x: bubble.x - 75, y: bubble.y - 75 },
                      colorStops: [
                        [0, '#00000000'],
                        [0.5, '#FFFF00aa'],
                        [1, '#00000000']
                      ]
                    },
                    {
                      duration: 200,
                      radius: 30,
                      offset: { x: bubble.x - 75, y: bubble.y - 75 },
                      colorStops: [
                        [0, '#00000000'],
                        [0.5, '#FFFF0088'],
                        [1, '#00000000']
                      ]
                    },
                    {
                      duration: 200,
                      radius: 40,
                      offset: { x: bubble.x - 75, y: bubble.y - 75 },
                      colorStops: [
                        [0, '#00000000'],
                        [0.5, '#FFFF0066'],
                        [1, '#00000000']
                      ]
                    },
                    {
                      duration: 200,
                      radius: 50,
                      offset: { x: bubble.x - 75, y: bubble.y - 75 },
                      colorStops: [
                        [0, '#00000000'],
                        [0.5, '#FFFF0044'],
                        [1, '#00000000']
                      ]
                    },
                    {
                      duration: 200,
                      radius: 60,
                      offset: { x: bubble.x - 75, y: bubble.y - 75 },
                      colorStops: [
                        [0, '#00000000'],
                        [0.5, '#FFFF0022'],
                        [1, '#00000000']
                      ]
                    }
                  ]
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
