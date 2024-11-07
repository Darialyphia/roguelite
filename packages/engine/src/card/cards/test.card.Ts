import type { CardBlueprint } from '../card-blueprint';

export const testCard: CardBlueprint = {
  id: 'test',
  name: 'Test card',
  cost: 1,
  description: 'This is a test card',
  minTargets: 0,
  targets: [],
  onPlay(game, card, targets) {
    console.log(game, card, targets);
  }
};
