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
import { Unit } from '../unit/unit.entity';

export class AIPlayerAgent implements AIAgent {
  private nextSimulationId = 0;

  constructor(
    private game: Game,
    private player: Player,
    private heuristics: AiHeuristics
  ) {}

  get activeUnit() {
    return this.game.turnSystem.activeUnit;
  }

  getNextInput(): SerializedInput {
    if (this.game.phase === GAME_PHASES.MULLIGAN) {
      return this.handleMulligan();
    }
    const moveScores = this.computeMoveScores();
    const combatScores = this.computeCombatScores();
    const cardScores = this.computeCardScores();
    const resourceScores = this.computeResourceActionScores();

    // console.log({ moveScores, combatScores, cardScores });
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

  handleMulligan(): SerializedInput {
    return { type: 'mulligan', payload: { playerId: this.player.id, indices: [] } };
  }

  private runSimulation(input: SerializedInput) {
    const id = this.nextSimulationId++;
    try {
      const simulator = new InputSimulator(this.game, [input], id);
      const scorer = new AIScorer(this.player.id, this.heuristics, simulator);
      const score = scorer.getScore();

      return {
        input,
        score
      };
    } catch (err) {
      console.log(`[Simulation ${id}]: error`, err);
      return { input, score: Number.NEGATIVE_INFINITY };
    }
  }

  private computeResourceActionScores(): ScoredInput[] {
    if (!this.player.canPerformResourceAction) {
      return [];
    }
    const runeWeights = this.player.hand
      .filter(card => card instanceof UnitCard || card instanceof SpellCard)
      .filter(card => !this.player.hasUnlockedRunes(card.cost.runes))
      .reduce(
        (total, card) => {
          const missing = this.player.getMissingRunes(card.cost.runes);
          const missingCount = this.player.runes.length - card.cost.runes.length;

          Object.entries(missing).forEach(([runeName, count]) => {
            if (runeName === RUNES.COLORLESS.id) return total;
            if (!isDefined(total[runeName])) {
              total[runeName] = 0;
            }
            total[runeName] += count * (missingCount === 1 ? 4 : 1); // give more weight to cards that are 1 rune away from being playable
          });

          return total;
        },
        {} as Record<string, number>
      );
    let bestRune: string | undefined = undefined;
    Object.entries(runeWeights).forEach(([key, weight]) => {
      if (!bestRune) {
        bestRune = key;
      } else if (runeWeights[bestRune] < weight) {
        bestRune = key;
      }
    });
    if (bestRune) {
      return [
        {
          input: {
            type: 'runeResourceAction',
            payload: { playerId: this.player.id, rune: bestRune }
          },
          score: Infinity
        }
      ];
    }

    const needGold = this.player.hand
      .filter(card => card instanceof UnitCard)
      .every(card => {
        card.cost.gold > this.player.gold;
      });
    if (needGold) {
      return [
        {
          input: { type: 'goldResourceAction', payload: { playerId: this.player.id } },
          score: Infinity
        }
      ];
    }

    return [
      {
        input: { type: 'drawResourceAction', payload: { playerId: this.player.id } },
        score: Infinity
      }
    ];
  }

  private computeMoveScores() {
    const results: ScoredInput[] = [];

    const cells = this.game.boardSystem
      .getNeighbors3D(this.activeUnit.position)
      .filter(
        cell =>
          this.activeUnit.canMoveTo(cell) && this.activeUnit.position.isAxisAligned(cell)
      );

    for (const cell of cells) {
      results.push(
        this.runSimulation({
          type: 'move',
          payload: { playerId: this.player.id, x: cell.x, y: cell.y, z: cell.z }
        })
      );
    }

    return results;
  }

  private computeCombatScores() {
    const results: ScoredInput[] = [];

    const targets = this.game.unitSystem.units.filter(
      u => this.activeUnit.isEnemy(u) && this.activeUnit.canAttackAt(u.position)
    );

    for (const target of targets) {
      results.push(
        this.runSimulation({
          type: 'attack',
          payload: { playerId: this.player.id, x: target.x, y: target.y, z: target.z }
        })
      );
    }

    return results;
  }

  private computeCardScores() {
    const results: ScoredInput[] = [];

    // cells is a computed getter, let's evaluate it early instead of doing it in every loop iteration
    const cells = this.game.boardSystem.cells;

    for (const [index, card] of this.activeUnit.player.hand.entries()) {
      const canPlay =
        this.activeUnit.player.canPlayCardAt(index) &&
        !this.heuristics.shouldAvoidPlayingCard(card); // @TODO make it so that AI plays a card it shouldn't avoid if it has no other possible option
      if (!canPlay) continue;

      const targets = this.getPotentialTargets(card, cells);
      for (const permutation of targets) {
        results.push(
          this.runSimulation({
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
