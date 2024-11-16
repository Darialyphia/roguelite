import type { EntityId } from '../entity';
import type { Game } from '../game/game';
import type { Player } from '../player/player.entity';
import type { Unit } from '../unit/unit.entity';

const sum = (arr: number[]) => arr.reduce((total, curr) => total + curr, 0);

const WEIGHTS = {
  HP: 1,
  CARD_IN_HAND: 2
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
    let result = 0;

    this.getTeamScores().forEach(({ team, score }) => {
      const multiplier = team.equals(this.player.team) ? 1 : -1;
      result += score * multiplier;
    });

    return result;
  }

  private getTeamScores() {
    return this.game.playerSystem.teams.map(team => ({
      team,
      score: sum(
        team.players.map(player =>
          sum(
            player.units.map(unit => {
              let score =
                unit.hp.current * WEIGHTS.HP + unit.hand.length * WEIGHTS.CARD_IN_HAND;

              // Reward allies for being closer to enemy units
              if (this.player.equals(unit.player)) {
                score -= this.getClosestDistanceFromEnemy(unit);
              }

              return score;
            })
          )
        )
      )
    }));
  }

  private getClosestDistanceFromEnemy(unit: Unit) {
    const enemies = this.game.unitSystem.units.filter(u => u.isEnemy(unit));

    return Math.min(...enemies.map(enemy => unit.position.dist(enemy.position)));
  }
}
