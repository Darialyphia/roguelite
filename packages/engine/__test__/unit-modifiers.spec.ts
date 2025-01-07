import { expect, test } from 'vitest';
import { gameBuilder } from './test-utils';
import { UnitModifier } from '../src/unit/unit-modifier.entity';
import { FearsomeModifierMixin } from '../src/unit/modifier-mixins/fearsome.mixin';

test('Fearsome', () => {
  const { game, player1, player2 } = gameBuilder()
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

  player1.general.addModifier(
    new UnitModifier(FearsomeModifierMixin.modifierName, game, {
      stackable: false,
      mixins: [new FearsomeModifierMixin(game)]
    })
  );

  player1.general.attack(player2.general.position);
  expect(player2.general.counterAttacksPerformedThisTurn).toBe(0);
});
