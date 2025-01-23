import { expect, test } from 'vitest';
import { testGameBuilder } from './test-utils';
import { defaultConfig } from '../src/config';
import { Damage } from '../src/combat/damage/damage';
import { NoScalingStrategy } from '../src/combat/damage/scaling/no-scaling.strategy';
import { NoMitigationStrategy } from '../src/combat/damage/mitigation/no-mitigation.strategy';

test('General damage Victory Point reward trigger properly', () => {
  const { game, player1, player2 } = testGameBuilder()
    .withP2Deck({
      altar: { blueprintId: 'red-general-flame-lord' },
      cards: Array.from({ length: 10 }, () => ({ blueprintId: 'red-footman' }))
    })
    .build();

  player1.altar.dealDamage(
    [player2.altar],
    new Damage({
      baseAmount: player2.altar.hp.current,
      source: player1.altar.card,
      scalings: [new NoScalingStrategy()],
      mitigations: [new NoMitigationStrategy()]
    })
  );

  expect(player1.team.victoryPoints).toBe(game.config.ALTAR_VP_REWARD);
});
