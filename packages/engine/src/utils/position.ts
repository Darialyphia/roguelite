import { isNumber, Vec3, type Point3D } from '@game/shared';
import type { Game } from '../game/game';

export class Position extends Vec3 {
  static fromPoint3D(pt: Point3D) {
    return new Position(pt.x, pt.y, pt.z);
  }

  clone() {
    return new Position(this.x, this.y, this.z);
  }

  isWithinCells(point: Point3D, range: number, game: Game) {
    return game.boardSystem.getDistance(this, point) <= range;
  }

  isNearby(point: Point3D, game: Game) {
    return this.isWithinCells(point, 1, game);
  }

  isSamePlane(point: Point3D) {
    return point.z === this.z;
  }

  isAxisAligned(point: Point3D) {
    return this.x === point.x || this.y === point.y;
  }
}
