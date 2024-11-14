import { PointAOEShape } from '../../targeting/aoe-shapes';
import { SelfTargetingPatternStrategy } from '../../targeting/self-targeting-strategy';
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
      getTargeting(game, card) {
        return new SelfTargetingPatternStrategy(card.unit);
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
