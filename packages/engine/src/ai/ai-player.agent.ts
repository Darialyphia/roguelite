import type { Point3D } from '@game/shared';
import type { Game } from '../game/game';
import type { Player } from '../player/player.entity';
import { getHighestScoredAction, type AIAgent, type ScoredInput } from './agent';
import { InputSimulator } from '../input/input-simulator';
import type { SerializedInput } from '../input/input-system';
import { AIScorer } from './ai-scorer';
import type { Card } from '../card/card.entity';
import type { Cell } from '../board/cell';
import type { AiHeuristics } from './ai-heuristics';

export class AIPlayerAgent implements AIAgent {
  constructor(
    private game: Game,
    private player: Player,
    private heuristics: AiHeuristics
  ) {}

  get activeUnit() {
    return this.game.turnSystem.activeUnit;
  }

  async getNextInput(): Promise<SerializedInput> {
    const [moveScores, combatScores, cardScores] = await Promise.all([
      this.computeMoveScores(),
      this.computeCombatScores(),
      this.computeCardScores()
    ]);

    console.log({ moveScores, combatScores, cardScores });
    return (
      getHighestScoredAction([...moveScores, ...combatScores, ...cardScores])?.input ?? {
        type: 'endTurn',
        payload: { playerId: this.player.id }
      }
    );
  }

  private async runSimulation(input: SerializedInput) {
    try {
      const simulator = new InputSimulator(this.game, [input]);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      await simulator.prepare();
      const game = simulator.run();

      const score = this.evaluateGameState(game);
      game.shutdown();
      return {
        input,
        score
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
      .filter(
        cell =>
          this.activeUnit.canMoveTo(cell) && this.activeUnit.position.isAxisAligned(cell)
      );

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

    const cards = this.activeUnit.hand.filter(
      (card, index) =>
        this.activeUnit.canPlayCardAt(index) &&
        !this.heuristics.shouldAvoidPlayingCard(card) // @TODO make it so that AI plays a card it should avoid if it has no other possible option
    );

    // cells is a computed getter, let's ealuate it early instead of doing it in every loop iteration
    const cells = this.game.boardSystem.cells;

    for (const [index, card] of cards.entries()) {
      const targets = this.getPotentialTargets(card, cells);
      for (const permutation of targets) {
        results.push(
          await this.runSimulation({
            type: 'playCard',
            payload: { playerId: this.player.id, index, targets: permutation }
          })
        );
      }
    }

    return results;
  }

  private getPotentialTargets(
    card: Card,
    cells: Cell[],
    acc: Point3D[][] = [],
    index = 0
  ): Point3D[][] {
    const targeting = card.targetsDefinition[index].getTargeting(this.game, card);

    if (index === 0) {
      const candidates = cells.filter(
        cell =>
          targeting.canTargetAt(cell) &&
          (card.aiHints.isRelevantTarget?.(cell, this.game, card, index) ?? true)
      );
      acc.push(...candidates.map(cell => [{ x: cell.x, y: cell.y, z: cell.z }]));
    } else {
      const newPermutations: Point3D[][] = [];
      acc.forEach(targets => {
        newPermutations.push(
          ...cells
            .filter(cell => {
              return (
                card.areTargetsValid([...targets, cell]) &&
                (card.aiHints.isRelevantTarget?.(cell, this.game, card, index) ?? true)
              );
            })
            .map(cell => [...targets, { x: cell.x, y: cell.y, z: cell.z }])
        );
      });
      acc.push(...newPermutations);
    }

    const minTargets = card.minTargets;
    const maxTargets = card.maxTargets;
    if (index === maxTargets - 1) {
      return acc.filter(targets => targets.length >= minTargets);
    } else {
      return this.getPotentialTargets(card, cells, acc, index + 1);
    }
  }
}
