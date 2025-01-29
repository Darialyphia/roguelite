import { meleeFighter } from '../../../ai/ai-traits';
import { createEntityId } from '../../../entity';
import { GAME_EVENTS } from '../../../game/game';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { GameEventModifierMixin } from '../../../unit/modifier-mixins/game-event.mixin';
import { BurnModifier } from '../../../unit/modifiers/burn.modifier';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS, UNIT_TYPES } from '../../card-enums';

export const redFlameHarvester: UnitCardBlueprint = {
  id: 'red-flame-harvester',
  spriteId: 'red-placeholder',
  iconId: 'placeholder',
  set: CARD_SETS.CORE,
  name: 'Flame Harvester',
  description:
    'At the start of your turn, if at least 2 enemy minions have @Burn@, gain 1 gold.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 2,
    runes: [RUNES.RED, RUNES.RED, RUNES.RED]
  },
  jobs: [JOBS.MAGE],
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
    card.unit.addModifier(
      new UnitModifier(createEntityId('flame-harvester-buff'), game, card, {
        stackable: false,
        mixins: [
          new GameEventModifierMixin(game, {
            eventName: GAME_EVENTS.PLAYER_START_TURN,
            handler(event) {
              if (!event.player.equals(card.player)) return;

              const hasBurningEnemies =
                card.player.enemyUnits.filter(unit => unit.hasModifier(BurnModifier))
                  .length >= 2;
              if (hasBurningEnemies) card.player.addGold(1);
            }
          })
        ]
      })
    );
  }
};
