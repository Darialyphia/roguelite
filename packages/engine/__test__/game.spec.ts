import { expect, test } from 'vitest';
import { testGameBuilder } from './test-utils';
import { config } from '../src/config';
import { Damage } from '../src/combat/damage/damage';
import { NoScalingStrategy } from '../src/combat/damage/scaling/no-scaling.strategy';
import { NoMitigationStrategy } from '../src/combat/damage/mitigation/no-mitigation.strategy';

test('Victory Point threshold draws trigger properly', () => {
  const { team1, player2 } = testGameBuilder()
    .withP2Deck({
      general: { blueprintId: 'red-general-flame-lord' },
      cards: Array.from({ length: 10 }, () => ({ blueprintId: 'red-footman' }))
    })
    .build();
  expect(player2.hand.length).toBe(config.INITIAL_HAND_SIZE);

  team1.earnVictoryPoints(config.VP_FIRST_REWARD_THRESHOLD);

  expect(player2.hand.length).toBe(config.INITIAL_HAND_SIZE + 1);

  team1.earnVictoryPoints(
    config.VP_SECOND_REWARD_THRESHOLD - config.VP_FIRST_REWARD_THRESHOLD
  );
  expect(player2.hand.length).toBe(config.INITIAL_HAND_SIZE + 2);
});

test('General damage Victory Point rewards trigger properly', () => {
  const { player1, player2 } = testGameBuilder()
    .withP2Deck({
      general: { blueprintId: 'red-general-flame-lord' },
      cards: Array.from({ length: 10 }, () => ({ blueprintId: 'red-footman' }))
    })
    .build();

  player1.general.dealDamage(
    [player2.general],
    new Damage({
      baseAmount: Math.ceil(player2.general.hp.current / 2),
      source: player1.general.card,
      scalings: [new NoScalingStrategy()],
      mitigations: [new NoMitigationStrategy()]
    })
  );

  expect(player1.team.victoryPoints).toBe(config.GENERAL_VP_HALF_REWARD);

  player1.general.dealDamage(
    [player2.general],
    new Damage({
      baseAmount: player2.general.hp.current,
      source: player1.general.card,
      scalings: [new NoScalingStrategy()],
      mitigations: [new NoMitigationStrategy()]
    })
  );

  expect(player1.team.victoryPoints).toBe(
    config.GENERAL_VP_HALF_REWARD + config.GENERAL_VP_FULL_REWARD
  );
});
