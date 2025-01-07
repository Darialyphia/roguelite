import { isDefined, type Defined, type Point3D } from '@game/shared';
import type { CardAiHints } from '../card/card-blueprint';

export const mergeTraits = (...traits: CardAiHints[]): CardAiHints => {
  const run = <TKey extends keyof CardAiHints>(
    key: TKey,
    args: Parameters<Defined<CardAiHints[TKey]>>
  ): ReturnType<Defined<CardAiHints[TKey]>> => {
    if (key === 'maxUsesPerTurn') {
      return traits.reduce((current, trait) => {
        if (!trait[key]) return current;
        // @ts-expect-error
        const maxUses = trait[key](...args) as number;

        return maxUses < current ? maxUses : current;
      }, Infinity) as any;
    }

    if (key === 'isRelevantTarget') {
      return traits.reduce((current, trait) => {
        if (!trait[key]) return current;
        // @ts-expect-error
        const isRelevant = trait[key](...args) as boolean;

        return isRelevant && current;
      }, true) as any;
    }

    if (key === 'relevantMoves') {
      const moves: Point3D[] = [];
      traits.forEach(trait => {
        moves.push(
          // @ts-expect-error
          ...(trait.relevantMoves?.(...args) as Point3D[]).filter(move => {
            return !moves.some(m => m.x === move.x && m.y === move.y && m.z === move.z);
          })
        );
      });
      return moves as any;
    }

    return traits.reduce((totalScore, trait) => {
      if (!trait[key]) return totalScore;
      // @ts-expect-error
      const score = trait[key](...args) as number;

      return score + totalScore;
    }, 0) as any;
  };

  return {
    isRelevantTarget: (...args) => run('isRelevantTarget', args),
    maxUsesPerTurn: (...args) => run('maxUsesPerTurn', args),
    preAttackScoreModifier: (...args) => run('preAttackScoreModifier', args),
    postAttackScoreModifier: (...args) => run('postAttackScoreModifier', args),
    preMoveScoreModifier: (...args) => run('preMoveScoreModifier', args),
    postMoveScoreModifier: (...args) => run('postMoveScoreModifier', args),
    prePlayScoreModifier: (...args) => run('prePlayScoreModifier', args),
    postPlayScoreModifier: (...args) => run('postPlayScoreModifier', args),
    endTurnWhileInHandScoreModifier: (...args) =>
      run('endTurnWhileInHandScoreModifier', args),
    endTurnWhileOnBoardScoreModifier: (...args) =>
      run('endTurnWhileOnBoardScoreModifier', args)
  };
};

export const attackIfAble = (weight = 100): CardAiHints => {
  return {
    endTurnWhileOnBoardScoreModifier(game, unit) {
      if (unit.attacksPerformedThisTurn === 0) return 0;
      return weight;
    }
  };
};

export const avoidEnemiesInMelee = (weight = 5): CardAiHints => {
  return {
    endTurnWhileOnBoardScoreModifier(game, unit) {
      const isNearbyEnemy = game.boardSystem
        .getNeighbors3D(unit.position)
        .some(cell => cell.unit?.isEnemy(unit));

      return isNearbyEnemy ? 0 : weight;
    }
  };
};

/**
 * Indicates that the point where the card is targeted doesnt mapGetters
 * this forces it to be cast on its owner's altar, to eliminate a lot of unnecessary moves when creating the decision tree
 */
export const irrelevantTarget = (): CardAiHints => {
  return {
    isRelevantTarget(point, game, card) {
      const forcedTarget = card.player.generalPosition;
      return (
        point.x === forcedTarget.x &&
        point.y === forcedTarget.y &&
        point.z === forcedTarget.z
      );
    }
  };
};

export const walkTowardsEnemies = (): CardAiHints => {
  return {
    relevantMoves(game, unit) {
      const allMoves = unit.getPossibleMoves();

      const enemiesNeighbors = [
        ...new Set(
          unit.player.enemiesPositions
            .map(pos =>
              game.boardSystem
                .getNeighbors3D(pos)
                .filter(cell => cell.isWalkable && !cell.unit)
            )
            .flat()
        )
      ];

      const paths = enemiesNeighbors.map(cell => unit.getPathTo(cell)).filter(isDefined);
      const moves = paths
        .map(path => {
          if (path.distance <= unit.remainingMovement) return path.path.at(-1)!;
          return path.path[unit.remainingMovement - 1];
        })
        .filter(point => {
          allMoves.some(p => p.x === point.x && p.y === point.y && p.z === point.z);
        });

      return moves;
    }
  };
};

export const meleeFighter = mergeTraits(attackIfAble(), walkTowardsEnemies());
