import { AnywhereTargetingPatternStrategy } from '../../targeting/anywhere-targeting-strategy';
import { PointAOEShape } from '../../targeting/aoe-shapes';
import type { CardBlueprint } from '../card-blueprint';

export const arcaneIntellect: CardBlueprint = {
  id: 'arcane-intellect',
  iconId: 'arcane-intellect',
  name: 'Arcane Intellect',
  cost: 1,
  description: 'Draw 2 cards.',
  minTargets: 1,
  targets: [
    {
      getTargeting() {
        return new AnywhereTargetingPatternStrategy();
      },
      getAoe(game) {
        return new PointAOEShape(game);
      }
    }
  ],
  onPlay(game, card) {
    card.unit.draw(2);
  }
};
