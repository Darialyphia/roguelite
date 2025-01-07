import { expect, test } from 'vitest';
import { Game } from '../src/game/game';
import { ServerRngSystem } from '../src/rng/server-rng.system';
import { gameBuilder } from './test-utils';
import { config } from '../src/config';

test('VP threshold draws work properly', () => {
  const { team1, player2 } = gameBuilder()
    .withP2Deck({
      general: { blueprintId: 'red-general-flame-lord' },
      cards: Array.from({ length: 10 }, () => ({ blueprintId: 'red-footman' }))
    })
    .build();
  expect(player2?.hand.length).toBe(config.INITIAL_HAND_SIZE);

  team1.earnVictoryPoints(config.VP_FIRST_REWARD_THRESHOLD);

  expect(player2?.hand.length).toBe(config.INITIAL_HAND_SIZE + 1);

  team1.earnVictoryPoints(
    config.VP_SECOND_REWARD_THRESHOLD - config.VP_FIRST_REWARD_THRESHOLD
  );
  expect(player2?.hand.length).toBe(config.INITIAL_HAND_SIZE + 2);
});
