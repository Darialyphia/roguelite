import { PointAOEShape } from '../../targeting/aoe-shapes';
import { MeleeTargetingStrategy } from '../../targeting/melee-targeting.straegy';
import { TARGETING_TYPE } from '../../targeting/targeting-strategy';
import { arcaneServant } from '../../unit/units/arcane-servant';
import type { CardBlueprint } from '../card-blueprint';

export const summonArcaneServant: CardBlueprint = {
  id: 'summon-arcane-servant',
  iconId: 'arcane-servant',
  name: 'Summon Arcane Servant',
  cost: 2,
  description: 'Summon an Arcane Servant.',
  minTargets: 1,
  targets: [
    {
      getTargeting(game, card) {
        return new MeleeTargetingStrategy(game, card.unit, TARGETING_TYPE.EMPTY, {
          allowDiagonals: true
        });
      }
    }
  ],
  getAoe(game, card, points) {
    return new PointAOEShape(game, points[0]);
  },
  onPlay(game, card, cells) {
    game.unitSystem.addUnit({
      blueprint: arcaneServant,
      cosmetics: {},
      deck: [],
      player: card.unit.player,
      position: cells[0]
    });
  },
  aiHints: {
    maxUsesPerTurn: 1
  }
};
