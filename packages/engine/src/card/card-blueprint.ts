import type { Point3D } from '@game/shared';
import type { Game } from '../game/game';
import type { Card } from './card.entity';
import type { TargetingStrategy } from '../targeting/targeting-strategy';
import type { AOEShape } from '../targeting/aoe-shapes';
import type { Unit } from '../unit/unit.entity';

type CardBlueprintTarget = {
  getTargeting(game: Game, card: Card): TargetingStrategy;
};

export type CardBlueprint = {
  id: string;
  name: string;
  iconId: string;
  description: string;
  cost: number;
  onPlay(game: Game, card: Card, cellTargets: Point3D[], unitTargets: Unit[]): void;
  targets: [CardBlueprintTarget, ...CardBlueprintTarget[]];
  minTargets: number;
  getAoe: (game: Game, card: Card, points: Point3D[]) => AOEShape;
  aiHints: {
    isRelevantTarget?: (point: Point3D, game: Game, card: Card, index: number) => boolean;
    maxUsesPerTurn?: number;
  };
};
