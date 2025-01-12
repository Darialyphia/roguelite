import { expect, test } from 'vitest';
import { testGameBuilder } from './test-utils';
import { config } from '../src/config';
import { Damage } from '../src/combat/damage/damage';
import { NoScalingStrategy } from '../src/combat/damage/scaling/no-scaling.strategy';
import { NoMitigationStrategy } from '../src/combat/damage/mitigation/no-mitigation.strategy';

test('General damage Victory Point reward trigger properly', () => {
  const { player1, player2 } = testGameBuilder()
    .withP2Deck({
      general: { blueprintId: 'red-general-flame-lord' },
      cards: Array.from({ length: 10 }, () => ({ blueprintId: 'red-footman' }))
    })
    .build();

  player1.general.dealDamage(
    [player2.general],
    new Damage({
      baseAmount: player2.general.hp.current,
      source: player1.general.card,
      scalings: [new NoScalingStrategy()],
      mitigations: [new NoMitigationStrategy()]
    })
  );

  expect(player1.team.victoryPoints).toBe(config.GENERAL_VP_REWARD);
});
