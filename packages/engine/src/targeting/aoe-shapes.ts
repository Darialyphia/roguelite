import type { Game } from '../game/game';
import { isDefined, type Point3D } from '@game/shared';
import type { Cell } from '../board/cell';
import {
  isValidTargetingType,
  TARGETING_TYPE,
  type NonEmptyTargetingType,
  type TargetingType
} from './targeting-strategy';
import { match } from 'ts-pattern';
import type { Unit } from '../unit/unit.entity';
import type { Player } from '../player/player.entity';
import type { Card } from '../card/card.entity';

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
    return points.map(point => this.game.boardSystem.getCellAt(point)).filter(isDefined);
  }

  getUnits(points: Point3D[]): Unit[] {
    return this.getCells(points)
      .map(cell => cell.unit)
      .filter(isDefined);
  }
}

export type CircleAOEShapeOptions = {
  allow3D: boolean;
  targetingType: NonEmptyTargetingType;
  range: number;
};

export class CircleAOEShape implements AOEShape {
  constructor(
    private game: Game,
    private card: Card,
    private options: CircleAOEShapeOptions
  ) {}

  getCells(points: Point3D[]) {
    return this.game.boardSystem.cells.filter(cell =>
      cell.position.isWithinCells(points[0], this.options.range, this.game)
    );
  }

  getUnits(points: Point3D[]) {
    return this.getCells(points)
      .filter(cell => {
        if (!isDefined(cell.unit)) return false;
        return isValidTargetingType(
          this.game,
          cell,
          this.card.player,
          this.options.targetingType
        );
      })
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
    private card: Card,
    private options: RingAOEShapeOptions
  ) {}

  getCells(points: Point3D[]) {
    return this.options.allow3D
      ? this.game.boardSystem.getNeighbors3D(points[0])
      : this.game.boardSystem.getNeighbors(points[0]);
  }

  getUnits(points: Point3D[]) {
    return this.getCells(points)
      .filter(cell => {
        if (!isDefined(cell.unit)) return false;
        return isValidTargetingType(
          this.game,
          cell,
          this.card.player,
          this.options.targetingType
        );
      })
      .map(cell => cell.unit)
      .filter(isDefined);
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
          .with(TARGETING_TYPE.ALLY_ALTAR, () => !!unit.isAlly(this.unit) && unit.isAltar)
          .with(
            TARGETING_TYPE.ALLY_MINION,
            () => !!unit?.isAlly(this.unit) && !unit.isAltar
          )
          .with(TARGETING_TYPE.ENEMY_UNIT, () => !!unit?.isEnemy(this.unit))
          .with(
            TARGETING_TYPE.ENEMY_ALTAR,
            () => !!unit?.isEnemy(this.unit) && unit.isAltar
          )
          .with(
            TARGETING_TYPE.ENEMY_MINION,
            () => !!unit?.isEnemy(this.unit) && !unit.isAltar
          )
          .with(TARGETING_TYPE.UNIT, () => isDefined(unit))
          .with(TARGETING_TYPE.ALTAR, () => isDefined(unit) && unit?.isAltar)
          .with(TARGETING_TYPE.MINION, () => isDefined(unit) && !unit.isAltar)
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

export class ShrineAoeShape implements AOEShape {
  constructor(
    private game: Game,
    private player: Player,
    private options: { targetingType: TargetingType }
  ) {}

  getCells(): Cell[] {
    const shrines = [
      ...this.game.boardSystem.victoryShrines,
      ...this.game.boardSystem.commandingShrines
    ];

    return shrines.map(shrine => this.game.boardSystem.getCellAt(shrine.position)!);
  }

  getUnits(): Unit[] {
    return this.getCells()
      .filter(cell => {
        return isValidTargetingType(
          this.game,
          cell,
          this.player,
          this.options.targetingType
        );
      })
      .map(cell => cell.unit)
      .filter(isDefined);
  }
}
