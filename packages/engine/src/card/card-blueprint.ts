import type { Point3D } from '@game/shared';
import type { Game } from '../game/game';
import type { Card } from './card.entity';
import type { TargetingStrategy } from '../targeting/targeting-strategy';
import type { AOEShape } from '../targeting/aoe-shapes';

type CardBlueprintTarget = {
  getTargeting(game: Game, card: Card): TargetingStrategy;
  getAoe(game: Game, card: Card): AOEShape;
};

export type CardBlueprint = {
  id: string;
  name: string;
  description: string;
  cost: number;
  onPlay(game: Game, card: Card, targets: Point3D[]): void;
  targets: [CardBlueprintTarget, ...CardBlueprintTarget[]];
  minTargets: number;
};
