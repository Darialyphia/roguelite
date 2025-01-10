import type { EntityId } from '../entity';
import type { Game } from '../game/game';
import type { InputSimulator } from '../input/input-simulator';
import { fortuneShrine } from '../obstacle/obstacles/fortune-shrine';
import { victoryShrine } from '../obstacle/obstacles/victory-shrine';
import type { Player } from '../player/player.entity';
import type { Unit } from '../unit/unit.entity';
import type { AiHeuristics } from './ai-heuristics';

const sum = (arr: number[]) => arr.reduce((total, curr) => total + curr, 0);

const WEIGHTS = {
  HP: 1,
  ATK: 1,
  UNIT: 4,
  CARD_IN_HAND: 2,
  VICTORY_POINT: 20,
  VICTORY_SHRINE: 10,
  FORTUNE_SHRINE: 7,
  QUEST: 3,
  NO_RESOURCE_ACTION_DONE: -50
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

  getScore(debug = false) {
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

    this.getTeamScores(debug).forEach(({ team, score }) => {
      if (debug) {
        console.log(team.id, score);
      }
      const multiplier = team.equals(this.player.team) ? 1 : -1;
      result += score * multiplier;
    });

    this.game.shutdown();

    return result;
  }

  private getTeamScores(debug = false) {
    return this.game.playerSystem.teams.map(team => ({
      team,
      score:
        team.victoryPoints * WEIGHTS.VICTORY_POINT +
        sum(team.players.map(player => this.getPlayerScore(player, debug)))
    }));
  }

  private getPlayerScore(player: Player, debug = false) {
    const unitScore = sum(
      player.units.map(unit => {
        let score =
          // base score for a unit just existing - helps the AI killing off a low hp unit rather than doing full damage on another one
          BASE_SCORES.UNIT + unit.hp.current * WEIGHTS.HP + unit.atk * WEIGHTS.ATK;

        // Reward allies for being closer to enemy units
        if (this.player.equals(unit.player)) {
          score -= this.getClosestDistanceFromEnemy(unit);
        }

        if (!unit.isGeneral) {
          const obstacle = this.game.boardSystem.getCellAt(unit.position)!.obstacle;

          const isOnVictoryShrine = obstacle?.blueprintId === victoryShrine.id;
          if (isOnVictoryShrine) score += WEIGHTS.VICTORY_SHRINE;
          const isOnFortuneShrine = obstacle?.blueprintId === fortuneShrine.id;
          if (isOnFortuneShrine) score += WEIGHTS.FORTUNE_SHRINE;
        }

        if (debug) {
          console.log(unit, score);
        }
        return score;
      })
    );

    const handScore = player.hand.length * WEIGHTS.CARD_IN_HAND;
    const questScore = player.quests.size * WEIGHTS.QUEST;

    let score = unitScore + handScore + questScore;
    if (debug) {
      console.log({ unitScore, handScore, questScore });
    }

    if (player.id === this.playerId) {
      if (player.canPerformResourceAction) {
        if (debug) console.log('No resource action done');
        score += WEIGHTS.NO_RESOURCE_ACTION_DONE;
      } else {
        const resourceAction = player.lastResourceActionTaken;
        const resourceActionScore = resourceAction
          ? this.heuristics.getResourceActionScore(this.game, resourceAction)
          : 0;
        if (debug) console.log({ resourceActionScore });

        score += resourceActionScore;
      }
    }

    return score;
  }

  private getClosestDistanceFromEnemy(unit: Unit) {
    const positions = unit.player.enemiesPositions;
    if (!positions.length) return 0;

    return Math.min(
      ...positions.map(pos => this.game.boardSystem.getDistance(pos, unit.position))
    );
  }
}
