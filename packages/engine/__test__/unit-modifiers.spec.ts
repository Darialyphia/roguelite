import { expect, test } from 'vitest';
import { testGameBuilder } from './test-utils';
import { FearsomeModifier } from '../src/unit/modifiers/fearsome.modifier';

test('Fearsome', () => {
  const { game, player1, player2 } = testGameBuilder()
    .withP2Deck({
      general: { blueprintId: 'red-general-flame-lord' },
      cards: Array.from({ length: 10 }, () => ({ blueprintId: 'red-footman' }))
    })
    .build();

  player1.general.teleport({
    x: player2.general.position.x - 1,
    y: player2.general.y,
    z: player2.general.z
  });

  player1.general.addModifier(new FearsomeModifier(game));

  player1.general.attack(player2.general.position);
  expect(player2.general.counterAttacksPerformedThisTurn).toBe(0);
});
