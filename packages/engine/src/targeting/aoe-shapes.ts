import type { Game } from '../game/game';
import { isDefined, type Point3D } from '@game/shared';
import type { Cell } from '../board/cell';
import { TARGETING_TYPE, type NonEmptyTargetingType } from './targeting-strategy';
import { match } from 'ts-pattern';
import type { Unit } from '../unit/unit.entity';

export type AOEShape = {
  getCells(points: Point3D[]): Cell[];
  getUnits(points: Point3D[]): Unit[];
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
  constructor(private game: Game) {}

  getCells(points: Point3D[]) {
    return [this.game.boardSystem.getCellAt(points[0])].filter(isDefined);
  }

  getUnits(points: Point3D[]): Unit[] {
    return this.getCells(points)
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
    private options: RingAOEShapeOptions
  ) {}

  getCells(points: Point3D[]) {
    return this.options.allow3D
      ? this.game.boardSystem.getNeighbors3D(points[0])
      : this.game.boardSystem.getNeighbors(points[0]);
  }

  getUnits(points: Point3D[]) {
    return this.getCells(points)
      .map(cell => cell.unit)
      .filter((unit): unit is Unit => {
        if (!isDefined(unit)) return false;

        return match(this.options.targetingType)
          .with(TARGETING_TYPE.ALLY_UNIT, () => !!unit?.isAlly(this.unit))
          .with(
            TARGETING_TYPE.ALLY_GENERAL,
            () => !!unit.isAlly(this.unit) && unit.isGeneral
          )
          .with(
            TARGETING_TYPE.ALLY_MINION,
            () => !!unit?.isAlly(this.unit) && !unit.isGeneral
          )
          .with(TARGETING_TYPE.ENEMY_UNIT, () => !!unit?.isEnemy(this.unit))
          .with(
            TARGETING_TYPE.ENEMY_GENERAL,
            () => !!unit?.isEnemy(this.unit) && unit.isGeneral
          )
          .with(
            TARGETING_TYPE.ENEMY_MINION,
            () => !!unit?.isEnemy(this.unit) && !unit.isGeneral
          )
          .with(TARGETING_TYPE.UNIT, () => isDefined(unit))
          .with(TARGETING_TYPE.GENERAL, () => isDefined(unit) && unit?.isGeneral)
          .with(TARGETING_TYPE.MINION, () => isDefined(unit) && !unit.isGeneral)
          .exhaustive();
      });
  }
}

export type IntersectiongAOEShapeOptions = {
  allow3D: boolean;
  targetingType: NonEmptyTargetingType;
};
export class IntersectionAoeShape implements AOEShape {
  constructor(
    private game: Game,
    private unit: Unit,
    private options: IntersectiongAOEShapeOptions
  ) {}

  getCells(points: Point3D[]) {
    const selfNeighbors = this.options.allow3D
      ? this.game.boardSystem.getNeighbors3D(this.unit.position)
      : this.game.boardSystem.getNeighbors(this.unit.position);
    const pointNeighbors = this.options.allow3D
      ? this.game.boardSystem.getNeighbors3D(points[0])
      : this.game.boardSystem.getNeighbors(points[0]);

    return selfNeighbors.filter(cell => pointNeighbors.some(other => other.equals(cell)));
  }

  getUnits(points: Point3D[]) {
    return this.getCells(points)
      .map(cell => cell.unit)
      .filter((unit): unit is Unit => {
        if (!isDefined(unit)) return false;

        return match(this.options.targetingType)
          .with(TARGETING_TYPE.ALLY_UNIT, () => !!unit?.isAlly(this.unit))
          .with(
            TARGETING_TYPE.ALLY_GENERAL,
            () => !!unit.isAlly(this.unit) && unit.isGeneral
          )
          .with(
            TARGETING_TYPE.ALLY_MINION,
            () => !!unit?.isAlly(this.unit) && !unit.isGeneral
          )
          .with(TARGETING_TYPE.ENEMY_UNIT, () => !!unit?.isEnemy(this.unit))
          .with(
            TARGETING_TYPE.ENEMY_GENERAL,
            () => !!unit?.isEnemy(this.unit) && unit.isGeneral
          )
          .with(
            TARGETING_TYPE.ENEMY_MINION,
            () => !!unit?.isEnemy(this.unit) && !unit.isGeneral
          )
          .with(TARGETING_TYPE.UNIT, () => isDefined(unit))
          .with(TARGETING_TYPE.GENERAL, () => isDefined(unit) && unit?.isGeneral)
          .with(TARGETING_TYPE.MINION, () => isDefined(unit) && !unit.isGeneral)
          .exhaustive();
      });
  }
}

export class CompositeAOEShape implements AOEShape {
  constructor(private shapes: AOEShape[]) {}

  getCells(points: Point3D[]) {
    const cells = new Set<Cell>();
    this.shapes.forEach(shape => {
      shape.getCells(points).forEach(cell => {
        cells.add(cell);
      });
    });

    return [...cells];
  }

  getUnits(points: Point3D[]) {
    const units = new Set<Unit>();
    this.shapes.forEach(shape => {
      shape.getUnits(points).forEach(unit => {
        units.add(unit);
      });
    });

    return [...units];
  }
}
