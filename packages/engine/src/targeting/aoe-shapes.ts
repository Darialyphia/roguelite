import type { Game } from '../game/game';
import { isDefined, type Point3D } from '@game/shared';
import type { Cell } from '../board/cell';
import type { TargetingType } from './targeting-strategy';
import { match } from 'ts-pattern';
import type { Unit } from '../unit/unit.entity';

export type AOEShape = {
  getCells(shapeOrigin: Point3D): Cell[];
};

export class PointAOEShape implements AOEShape {
  constructor(private game: Game) {}

  getCells(shapeOrigin: Point3D) {
    return [this.game.boardSystem.getCellAt(shapeOrigin)].filter(isDefined);
  }
}

export type RingAOEShapeOptions = {
  allow3D: boolean;
  targetingType: TargetingType;
};
export class RingAOEShape implements AOEShape {
  constructor(
    private game: Game,
    private unit: Unit,
    private options: RingAOEShapeOptions
  ) {}

  getCells(shapeOrigin: Point3D) {
    const cells = this.options.allow3D
      ? this.game.boardSystem.getNeighbors3D(shapeOrigin)
      : this.game.boardSystem.getNeighbors(shapeOrigin);

    return cells.filter(cell => {
      const unit = this.game.unitSystem.getUnitAt(cell);

      match(this.options.targetingType)
        .with('any', () => true)
        .with('empty', () => !unit)
        .with('ally', () => !!unit?.isAlly(this.unit))
        .with('enemy', () => !!unit?.isEnemy(this.unit))
        .with('both', () => !!unit)
        .exhaustive();
    });
  }
}
