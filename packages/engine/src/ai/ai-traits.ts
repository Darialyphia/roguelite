import type { Defined } from '@game/shared';
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
