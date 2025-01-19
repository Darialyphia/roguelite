import { expect, test } from 'vitest';
import { testGameBuilder } from '../test-utils';
import { victoryShrine } from '../../src/obstacle/obstacles/victory-shrine';
import { redExorcist } from '../../src/card/cards/core/red_exorcist';

test('Red Exorcist should deal more damage on units standing on shrines', () => {
  const { game, player1, player2 } = testGameBuilder().build();

  const exorcist = player1.generateUnit(redExorcist.id, {
    x: player2.general.position.x + 2,
    y: player2.general.y,
    z: player2.general.z
  });

  player1.endTurn();
  player2.endTurn();

  game.boardSystem.addObstacleAt(victoryShrine.id, player2.general.position);
  const bonus = 2;
  expect(exorcist.getDealtDamage(0, player2.general)).toBe(exorcist.atk + bonus);
  exorcist.attack(player2.general.position);
  expect(player2.general.hp.current).toBe(
    player2.general.hp.max - (exorcist.atk + bonus)
  );
});
