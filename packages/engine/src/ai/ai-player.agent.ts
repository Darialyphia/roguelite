import { type Point3D } from '@game/shared';
import type { Game } from '../game/game';
import type { Player } from '../player/player.entity';
import { type AIAgent } from './agent';
import { InputSimulator } from '../input/input-simulator';
import type { SerializedInput } from '../input/input-system';
import { AIScorer } from './ai-scorer';
import type { Card } from '../card/card.entity';
import type { Cell } from '../board/cell';
import type { AiHeuristics } from './ai-heuristics';
import { GAME_PHASES } from '../game/game-phase.system';
import { RUNES } from '../utils/rune';
import { Minimax, Node } from 'minimaxer';
import { NODE_AIM, NODE_TYPE, PRUNING_TYPES, SEARCH_METHODS } from './ai-enums';

export class AIPlayerAgent implements AIAgent {
  private nextSimulationId = 0;

  constructor(
    private player: Player,
    private heuristics: AiHeuristics
  ) {}

  makeTree(game: Game) {
    const root = new Node(
      NODE_TYPE.ROOT,
      game.clone(this.nextSimulationId++),
      { type: 'rootNode', payload: {} } as unknown as SerializedInput,
      0,
      NODE_AIM.MAX
    );
    root.value = 0;

    const tree = new Minimax(root);
    tree.opts.method = SEARCH_METHODS.TIME;
    tree.opts.pruning = PRUNING_TYPES.ALPHA_BETA;
    tree.opts.timeout = 2000;
    tree.GetMoves = parent => {
      return this.getValidMoves(parent.gamestate);
    };
    tree.CreateChildNode = (parent, move) => {
      const simulator = new InputSimulator(
        parent.gamestate,
        [move],
        this.nextSimulationId++
      );

      const isLeafNode = move.type === 'endTurn' || move.type === 'mulligan';
      const scorer = new AIScorer(this.player.id, this.heuristics, simulator);

      const score = scorer.getScore(false);

      const node = new Node(
        isLeafNode ? NODE_TYPE.LEAF : NODE_TYPE.INNER,
        simulator.game,
        move,
        0,
        NODE_AIM.MAX
      );

      node.value = score;

      return node;
    };

    return tree;
  }

  getOptimalPath(game: Game): SerializedInput[] {
    const tree = this.makeTree(game);
    const now = performance.now();
    tree.evaluate();
    console.log('Tree evaluated in', performance.now() - now);

    const path = tree.getOptimalMoves().slice(1);

    return path;
  }

  getNextInput(game: Game): SerializedInput {
    const tree = this.makeTree(game);
    const result = tree.evaluate();

    return result.move;
  }

  private getValidMoves(game: Game) {
    if (game.phase === GAME_PHASES.MULLIGAN) {
      return [this.handleMulligan()];
    }

    const moves = game.turnSystem.activePlayer.canPerformResourceAction
      ? this.computeResourceActions(game)
      : [
          ...this.computeMoveActions(game),
          ...this.computeCombatActions(game),
          ...this.computeCardActions(game)
        ];
    moves.push({ type: 'endTurn', payload: { playerId: this.player.id } });

    return moves;
  }

  private handleMulligan(): SerializedInput {
    return { type: 'mulligan', payload: { playerId: this.player.id, indices: [] } };
  }

  private computeResourceActions(game: Game): SerializedInput[] {
    if (!game.turnSystem.activePlayer.canPerformResourceAction) {
      return [];
    }

    const results: SerializedInput[] = [];
    const relevantRunes = Object.values(RUNES).filter(rune => {
      if (rune === RUNES.COLORLESS) return false;

      const player = game.turnSystem.activePlayer;
      return (
        player.hand.some(card => card.cost.runes.some(r => rune.equals(r))) ||
        player.deck.cards.some(card => card.cost.runes.some(r => rune.equals(r)))
      );
    });

    relevantRunes.forEach(rune => {
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

    return results;
  }

  private computeMoveActions(game: Game) {
    const results: SerializedInput[] = [];

    game.turnSystem.activePlayer.units.forEach(unit => {
      const points = this.heuristics.getRelevantMoves(game, unit);

      for (const point of points) {
        results.push({
          type: 'move',
          payload: {
            playerId: this.player.id,
            x: point.x,
            y: point.y,
            z: point.z,
            unitId: unit.id
          }
        });
      }
    });
    return results;
  }

  private computeCombatActions(game: Game) {
    const results: SerializedInput[] = [];

    game.turnSystem.activePlayer.units.forEach(unit => {
      const targets = game.unitSystem.units.filter(
        u => unit.isEnemy(u) && unit.canAttackAt(u.position)
      );

      for (const target of targets) {
        results.push({
          type: 'attack',
          payload: {
            playerId: this.player.id,
            x: target.x,
            y: target.y,
            z: target.z,
            unitId: unit.id
          }
        });
      }
    });

    return results;
  }

  private computeCardActions(game: Game) {
    const results: SerializedInput[] = [];

    // cells is a computed getter, let's evaluate it early instead of doing it in every loop iteration
    const cells = game.boardSystem.cells;

    for (const [index, card] of game.turnSystem.activePlayer.hand.entries()) {
      const canPlay =
        game.turnSystem.activePlayer.canPlayCardAt(index) &&
        !this.heuristics.shouldAvoidPlayingCard(game, card);
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
    if (index === 0) {
      const targeting = card.targetsDefinition[index].getTargeting(game, card as any, []);
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
