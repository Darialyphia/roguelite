import type { Position } from '../utils/position';
import type { Game } from '../game';
import { isDefined, type Point3D } from '@game/shared';
import type { Cell } from '../board/cell';

export type AOEShape = {
  getCells(shapeOrigin: Point3D): Cell[];
};

export class PointAOEShape implements AOEShape {
  constructor(private game: Game) {}

  getCells(shapeOrigin: Point3D) {
    return [this.game.boardSystem.getCellAt(shapeOrigin)].filter(isDefined);
  }
}
