import { expect, test } from 'vitest';
import { testGameBuilder } from '../test-utils';
import { victoryShrine } from '../../src/obstacle/obstacles/victory-shrine';
import { redExorcist } from '../../src/card/cards/core/red_exorcist';

test('Red Exorcist should deal more damage on units standing on shrines', () => {
  const { game, player1, player2 } = testGameBuilder().build();

  const exorcist = player1.generateUnit(redExorcist.id, {
    x: player2.altar.position.x + 2,
    y: player2.altar.y,
    z: player2.altar.z
  });

  player1.endTurn();
  player2.endTurn();

  game.boardSystem.addObstacleAt(victoryShrine.id, player2.altar.position);
  const bonus = 2;
  expect(exorcist.getDealtDamage(0, player2.altar)).toBe(exorcist.atk + bonus);
  exorcist.attack(player2.altar.position);
  expect(player2.altar.hp.current).toBe(player2.altar.hp.max - (exorcist.atk + bonus));
});
