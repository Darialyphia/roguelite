import { isDefined, type Point3D } from '@game/shared';
import type { Game } from '../game/game';
import type { Player } from '../player/player.entity';
import { getHighestScoredAction, type AIAgent, type ScoredInput } from './agent';
import { InputSimulator } from '../input/input-simulator';
import type { SerializedInput } from '../input/input-system';
import { AIScorer } from './ai-scorer';
import type { Card } from '../card/card.entity';
import type { Cell } from '../board/cell';
import type { AiHeuristics } from './ai-heuristics';
import { GAME_PHASES } from '../game/game-phase.system';
import { UnitCard } from '../card/unit-card.entity';
import { SpellCard } from '../card/spell-card.entity';
import { RUNES } from '../utils/rune';

export class AIPlayerAgent implements AIAgent {
  private nextSimulationId = 0;

  constructor(
    private player: Player,
    private heuristics: AiHeuristics
  ) {}

  getNextInput(game: Game): SerializedInput {
    return {
      type: 'endTurn',
      payload: { playerId: this.player.id }
    };
  }

  getInput(game: Game): SerializedInput {
    if (game.phase === GAME_PHASES.MULLIGAN) {
      return this.handleMulligan();
    }
    const moveScores = this.computeMoveScores(game);
    const combatScores = this.computeCombatScores(game);
    const cardScores = this.computeCardScores(game);
    const resourceScores = this.computeResourceActionScores();

    // console.log({ moveScores, combatScores, cardScores });
    const validMoves = this.getValidMoves(game);
    if (!validMoves.length) {
      return {
        type: 'endTurn',
        payload: { playerId: this.player.id }
      };
    }
    return (
      getHighestScoredAction([
        ...moveScores,
        ...combatScores,
        ...cardScores,
        ...resourceScores
      ])?.input ?? {
        type: 'endTurn',
        payload: { playerId: this.player.id }
      }
    );
  }

  private getValidMoves(game: Game) {
    const moveScores = this.computeMoveScores(game);
    const combatScores = this.computeCombatScores(game);
    const cardScores = this.computeCardScores(game);
    const resourceScores = this.computeResourceActionScores();

    // console.log({ moveScores, combatScores, cardScores });
    return [...moveScores, ...combatScores, ...cardScores, ...resourceScores];
  }

  handleMulligan(): SerializedInput {
    return { type: 'mulligan', payload: { playerId: this.player.id, indices: [] } };
  }

  private runTurnSimulation(game: Game, initialInput: SerializedInput) {
    const series: SerializedInput[][] = [];

    const _game = game;
    const simulationResult = this.runSimulation(_game, initialInput);
    const validMoves = this.getValidMoves(_game);
  }

  recurse(game: Game, inputs: SerializedInput[]) {
    const validMoves = this.getValidMoves(game);
  }

  private runSimulation(game: Game, input: SerializedInput) {
    const id = this.nextSimulationId++;
    try {
      const simulator = new InputSimulator(game, [input], id);
      const scorer = new AIScorer(this.player.id, this.heuristics, simulator);
      const score = scorer.getScore();
      simulator.shutdown();
      return {
        game: simulator.game,
        input,
        score
      };
    } catch (err) {
      console.log(`[Simulation ${id}]: error`, err);
      return { input, score: Number.NEGATIVE_INFINITY };
    }
  }

  private computeResourceActionScores(): SerializedInput[] {
    if (!this.player.canPerformResourceAction) {
      return [];
    }

    const results: SerializedInput[] = [];
    Object.values(RUNES).forEach(rune => {
      results.push({
        type: 'runeResourceAction',
        payload: { playerId: this.player.id, rune: rune.id as any }
      });
    });
    results.push({
      type: 'goldResourceAction',
      payload: { playerId: this.player.id }
    });
    results.push({
      type: 'drawResourceAction',
      payload: { playerId: this.player.id }
    });
    // const runeWeights = this.player.hand
    //   .filter(card => card instanceof UnitCard || card instanceof SpellCard)
    //   .filter(card => !this.player.hasUnlockedRunes(card.cost.runes))
    //   .reduce(
    //     (total, card) => {
    //       const missing = this.player.getMissingRunes(card.cost.runes);
    //       const missingCount = this.player.runes.length - card.cost.runes.length;

    //       Object.entries(missing).forEach(([runeName, count]) => {
    //         if (runeName === RUNES.COLORLESS.id) return total;
    //         if (!isDefined(total[runeName])) {
    //           total[runeName] = 0;
    //         }
    //         total[runeName] += count * (missingCount === 1 ? 4 : 1); // give more weight to cards that are 1 rune away from being playable
    //       });

    //       return total;
    //     },
    //     {} as Record<string, number>
    //   );
    // let bestRune: string | undefined = undefined;
    // Object.entries(runeWeights).forEach(([key, weight]) => {
    //   if (!bestRune) {
    //     bestRune = key;
    //   } else if (runeWeights[bestRune] < weight) {
    //     bestRune = key;
    //   }
    // });
    // if (bestRune) {
    //   return [
    //     {
    //       input: {
    //         type: 'runeResourceAction',
    //         payload: { playerId: this.player.id, rune: bestRune }
    //       },
    //       score: Infinity
    //     }
    //   ];
    // }

    // const needGold = this.player.hand
    //   .filter(card => card instanceof UnitCard)
    //   .every(card => {
    //     card.cost.gold > this.player.gold;
    //   });
    // if (needGold) {
    //   return [
    //     {
    //       input: { type: 'goldResourceAction', payload: { playerId: this.player.id } },
    //       score: Infinity
    //     }
    //   ];
    // }

    // return [
    //   {
    //     input: { type: 'drawResourceAction', payload: { playerId: this.player.id } },
    //     score: Infinity
    //   }
    // ];

    return results;
  }

  private computeMoveScores(game: Game) {
    const results: SerializedInput[] = [];

    const neighbors = game.boardSystem.getNeighbors3D(
      game.turnSystem.activeUnit.position
    );
    const cells = neighbors.filter(cell => {
      return (
        game.turnSystem.activeUnit.canMoveTo(cell) &&
        game.turnSystem.activeUnit.position.isAxisAligned(cell)
      );
    });

    for (const cell of cells) {
      results.push({
        type: 'move',
        payload: { playerId: this.player.id, x: cell.x, y: cell.y, z: cell.z }
      });
    }

    return results;
  }

  private computeCombatScores(game: Game) {
    const results: SerializedInput[] = [];

    const targets = game.unitSystem.units.filter(
      u =>
        game.turnSystem.activeUnit.isEnemy(u) &&
        game.turnSystem.activeUnit.canAttackAt(u.position)
    );

    for (const target of targets) {
      results.push({
        type: 'attack',
        payload: { playerId: this.player.id, x: target.x, y: target.y, z: target.z }
      });
    }

    return results;
  }

  private computeCardScores(game: Game) {
    const results: SerializedInput[] = [];

    // cells is a computed getter, let's evaluate it early instead of doing it in every loop iteration
    const cells = game.boardSystem.cells;

    for (const [index, card] of game.turnSystem.activeUnit.player.hand.entries()) {
      const canPlay =
        game.turnSystem.activeUnit.player.canPlayCardAt(index) &&
        !this.heuristics.shouldAvoidPlayingCard(card);
      if (!canPlay) continue;

      const targets = this.getPotentialTargets(game, card, cells);
      for (const permutation of targets) {
        results.push({
          type: 'playCard',
          payload: { playerId: this.player.id, index, targets: permutation }
        });
      }
    }

    return results;
  }

  private getPotentialTargets(
    game: Game,
    card: Card,
    cells: Cell[],
    acc: Point3D[][] = [],
    index = 0
  ): Point3D[][] {
    const targeting = card.targetsDefinition[index].getTargeting(game, card);

    if (index === 0) {
      const candidates = cells.filter(
        cell =>
          targeting.canTargetAt(cell) &&
          (card.aiHints.isRelevantTarget?.(cell, game, card, index) ?? true)
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
                (card.aiHints.isRelevantTarget?.(cell, game, card, index) ?? true)
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
      return this.getPotentialTargets(game, card, cells, acc, index + 1);
    }
  }
}
