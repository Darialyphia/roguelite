import type { EntityId } from '../entity';
import type { Game } from '../game/game';
import type { Player } from '../player/player.entity';
import type { Unit } from '../unit/unit.entity';

const sum = (arr: number[]) => arr.reduce((total, curr) => total + curr, 0);

const WEIGHTS = {
  HP: 1,
  AP: 10,
  CARD_IN_HAND: 5
} as const;

export class AIScorer {
  private player: Player;

  constructor(
    private game: Game,
    private playerId: EntityId
  ) {
    this.player = game.playerSystem.getPlayerById(this.playerId)!;
  }

  getScore() {
    let finalScore = 0;

    this.getPlayerScores().forEach(({ player, score }) => {
      const multiplier = player.isAlly(this.player) ? 1 : -1;
      finalScore += score * multiplier;
    });

    return finalScore;
  }

  private getPlayerScores() {
    return this.game.playerSystem.players
      .filter(p => p.isAlly(this.player))
      .map(player => ({
        player,
        score: sum(
          player.units.map(
            unit =>
              unit.hp.current * WEIGHTS.HP +
              unit.ap.current * WEIGHTS.AP +
              unit.hand.length * WEIGHTS.CARD_IN_HAND -
              this.getClosestDistanceFromEnemy(unit)
          )
        )
      }));
  }

  private getClosestDistanceFromEnemy(unit: Unit) {
    const enemies = this.game.unitSystem.units.filter(u => u.isEnemy(unit));

    return Math.min(...enemies.map(enemy => unit.position.dist(enemy.position)));
  }
}
