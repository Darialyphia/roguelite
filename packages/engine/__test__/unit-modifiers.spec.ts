import { expect, test } from 'vitest';
import { testGameBuilder } from './test-utils';
import { FearsomeModifier } from '../src/unit/modifiers/fearsome.modifier';

test('Fearsome', () => {
  const { game, player1, player2 } = testGameBuilder()
    .withP2Deck({
      altar: { blueprintId: 'red-general-flame-lord' },
      cards: Array.from({ length: 10 }, () => ({ blueprintId: 'red-footman' }))
    })
    .build();

  player1.altar.teleport({
    x: player2.altar.position.x - 1,
    y: player2.altar.y,
    z: player2.altar.z
  });

  player1.altar.addModifier(new FearsomeModifier(game, player1.altar.card));

  player1.altar.attack(player2.altar.position);
  expect(player2.altar.counterAttacksPerformedThisTurn).toBe(0);
});
