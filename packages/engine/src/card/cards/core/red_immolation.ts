import { AnywhereTargetingStrategy } from '../../../targeting/anywhere-targeting-strategy';
import { CircleAOEShape } from '../../../targeting/aoe-shapes';
import { TARGETING_TYPE } from '../../../targeting/targeting-strategy';
import { BurnModifier } from '../../../unit/modifiers/burn.modifier';
import { RUNES } from '../../../utils/rune';
import { type SpellCardBlueprint } from '../../card-blueprint';
import { CARD_KINDS, CARD_SETS } from '../../card-enums';

export const redImmolation: SpellCardBlueprint = {
  id: 'red-immolation',
  iconId: 'spell-immolation',
  set: CARD_SETS.CORE,
  name: 'Immolation',
  description: 'Give Burn(3) to minions in a 2 cells area.',
  kind: CARD_KINDS.SPELL,
  aiHints: {},
  cost: {
    gold: 5,
    runes: [RUNES.RED, RUNES.RED, RUNES.COLORLESS, RUNES.COLORLESS]
  },
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new AnywhereTargetingStrategy(game, card.player, TARGETING_TYPE.ANYWHERE);
      }
    }
  ],
  getAoe(game, card) {
    return new CircleAOEShape(game, card, {
      allow3D: true,
      targetingType: TARGETING_TYPE.MINION,
      range: 2
    });
  },
  vfx: {
    play() {
      return { tracks: [] };
    }
  },
  onPlay(game, card, cellTargets, unitTargets) {
    unitTargets.forEach(target => {
      target.addModifier(new BurnModifier(game, card, { initialStacks: 3 }));
    });
  }
};
