import { meleeFighter } from '../../../ai/ai-traits';
import { createEntityId } from '../../../entity';
import { shrine } from '../../../obstacle/obstacles/shrine';
import { PointAOEShape } from '../../../targeting/aoe-shapes';
import { UnitSummonTargetingtrategy } from '../../../targeting/unit-summon-targeting.strategy';
import { AmplifyDamagedModifierMixin } from '../../../unit/modifier-mixins/amplify-damage.mixin';
import { RangedModifier } from '../../../unit/modifiers/ranged.modifier';
import { SpellCasterModifier } from '../../../unit/modifiers/spellcaster.modifier';
import { UnitModifier } from '../../../unit/unit-modifier.entity';
import { JOBS } from '../../../utils/job';
import { RUNES } from '../../../utils/rune';
import { type UnitCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, UNIT_TYPES } from '../../card-enums';

export const redExorcist: UnitCardBlueprint = {
  id: 'red-exorcist',
  spriteId: 'exorcist',
  iconId: 'unit_exorcist',
  name: 'Exorcist',
  description: '@Ranged(2)@.\n@Spellcaster@.\nThis deals +2 damage to units on shrines.',
  kind: CARD_KINDS.UNIT,
  unitType: UNIT_TYPES.MINION,
  aiHints: meleeFighter,
  cost: {
    gold: 2,
    runes: [RUNES.RED, RUNES.COLORLESS]
  },
  jobs: [JOBS.MAGE],
  atk: 1,
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
    card.unit.addModifier(new RangedModifier(game, card, 2));
    card.unit.addModifier(new SpellCasterModifier(game, card));

    card.unit.addModifier(
      new UnitModifier(createEntityId('exorcist_amplify_damage'), game, card, {
        stackable: false,
        mixins: [
          new AmplifyDamagedModifierMixin(game, {
            when(attacker, defender) {
              const cell = game.boardSystem.getCellAt(defender.position)!;
              return cell.obstacle?.id === shrine.id;
            },
            amount: () => 2
          })
        ]
      })
    );
  }
};
