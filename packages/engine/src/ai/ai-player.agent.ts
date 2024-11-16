import type { Nullable } from '@game/shared';
import type { Game } from '../game/game';
import type { Player } from '../player/player.entity';
import { getHighestScoredAction, type AIAgent, type ScoredInput } from './agent';
import { InputSimulator } from '../input/input-simulator';
import type { SerializedInput } from '../input/input-system';
import { AIScorer } from './ai-scorer';

export class AIPlayerAgent implements AIAgent {
  constructor(
    private game: Game,
    private player: Player
  ) {}

  get activeUnit() {
    return this.game.turnSystem.activeUnit;
  }

  async getNextInput(): Promise<Nullable<ScoredInput>> {
    const [moveScores, attackScores, cardScores] = await Promise.all([
      this.computeMoveScores(),
      this.computeCombatScores(),
      this.computeCardScores()
    ]);

    return getHighestScoredAction([...moveScores, ...attackScores, ...cardScores]);
  }

  private async runSimulation(input: SerializedInput) {
    try {
      const simulator = new InputSimulator(this.game, input);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      await simulator.prepare();
      const game = simulator.run();

      return {
        input,
        score: this.evaluateGameState(game)
      };
    } catch (err) {
      console.error('Simulation error', err);
      return { input, score: Number.NEGATIVE_INFINITY };
    }
  }

  private evaluateGameState(game: Game) {
    const scorer = new AIScorer(game, this.player.id);

    return scorer.getScore();
  }

  private async computeMoveScores() {
    const results: ScoredInput[] = [];

    const cells = this.game.boardSystem
      .getNeighbors3D(this.activeUnit.position)
      .filter(cell => this.activeUnit.canMoveTo(cell));

    for (const cell of cells) {
      results.push(
        await this.runSimulation({
          type: 'move',
          payload: { playerId: this.player.id, x: cell.x, y: cell.y, z: cell.z }
        })
      );
    }

    return results;
  }

  private async computeCombatScores() {
    const results: ScoredInput[] = [];

    const targets = this.game.unitSystem.units.filter(
      u => this.activeUnit.isEnemy(u) && this.activeUnit.canAttackAt(u.position)
    );

    for (const target of targets) {
      results.push(
        await this.runSimulation({
          type: 'attack',
          payload: { playerId: this.player.id, x: target.x, y: target.y, z: target.z }
        })
      );
    }

    return results;
  }

  private async computeCardScores() {
    const results: ScoredInput[] = [];
    return results;
  }
}
