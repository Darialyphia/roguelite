import type { Game } from '../game/game';
import { isDefined, type Point3D } from '@game/shared';
import type { Cell } from '../board/cell';
import type { NonEmptyTargetingType } from './targeting-strategy';
import { match } from 'ts-pattern';
import type { Unit } from '../unit/unit.entity';

export type AOEShape = {
  getCells(): Cell[];
  getUnits(): Unit[];
};

export class NoAOEShape implements AOEShape {
  getCells() {
    return [];
  }

  getUnits(): Unit[] {
    return [];
  }
}

export class PointAOEShape implements AOEShape {
  constructor(
    private game: Game,
    private point: Point3D
  ) {}

  getCells() {
    return [this.game.boardSystem.getCellAt(this.point)].filter(isDefined);
  }

  getUnits(): Unit[] {
    return this.getCells()
      .map(cell => cell.unit)
      .filter(isDefined);
  }
}

export type RingAOEShapeOptions = {
  allow3D: boolean;
  targetingType: NonEmptyTargetingType;
};
export class RingAOEShape implements AOEShape {
  constructor(
    private game: Game,
    private unit: Unit,
    private point: Point3D,
    private options: RingAOEShapeOptions
  ) {}

  getCells() {
    return this.options.allow3D
      ? this.game.boardSystem.getNeighbors3D(this.point)
      : this.game.boardSystem.getNeighbors(this.point);
  }

  getUnits() {
    return this.getCells()
      .map(cell => cell.unit)
      .filter((unit): unit is Unit => {
        if (!isDefined(unit)) return false;

        return match(this.options.targetingType)
          .with('ally', () => !!unit?.isAlly(this.unit))
          .with('enemy', () => !!unit?.isEnemy(this.unit))
          .with('both', () => !!unit)
          .exhaustive();
      });
  }
}
