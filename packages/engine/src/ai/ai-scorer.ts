import { isDefined } from '@game/shared';
import { SpellCard } from '../card/spell-card.entity';
import { UnitCard } from '../card/unit-card.entity';
import type { EntityId } from '../entity';
import type { Game } from '../game/game';
import type { InputSimulator } from '../input/input-simulator';
import type { SerializedInput } from '../input/input-system';
import type { Player } from '../player/player.entity';
import type { Unit } from '../unit/unit.entity';
import { RUNES } from '../utils/rune';
import type { AiHeuristics } from './ai-heuristics';

const sum = (arr: number[]) => arr.reduce((total, curr) => total + curr, 0);

const WEIGHTS = {
  HP: 1,
  CARD_IN_HAND: 2
} as const;

const BASE_SCORES = {
  UNIT: 20
};

export type ScoreModifier = {
  pre: (game: Game) => number;
  post: (game: Game, score: number) => number;
};
export class AIScorer {
  private player: Player;

  constructor(
    private playerId: EntityId,
    private heuristics: AiHeuristics,
    private simulator: InputSimulator
  ) {
    this.simulator.prepare();
    this.player = this.game.playerSystem.getPlayerById(this.playerId)!;
  }

  get game() {
    return this.simulator.game;
  }

  getScore() {
    let result = 0;
    let scoreModifier: ScoreModifier;

    this.simulator.run({
      onBeforeInput: (game, input) => {
        scoreModifier = this.heuristics.getScoreModifier(game, input);
        result += scoreModifier.pre(game);
      },
      onAfterInput: game => {
        result += scoreModifier.post(game, result);
      }
    });

    this.getTeamScores().forEach(({ team, score }) => {
      const multiplier = team.equals(this.player.team) ? 1 : -1;
      result += score * multiplier;
    });

    this.game.shutdown();

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
                // base score for a unit just existing - helps the AI killing off a low hp unit rather than doing full damage on another one
                BASE_SCORES.UNIT +
                unit.hp.current * WEIGHTS.HP +
                unit.player.hand.length * WEIGHTS.CARD_IN_HAND;

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
