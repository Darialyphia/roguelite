import { isNumber, Vec3, type Point3D } from '@game/shared';

export class Position extends Vec3 {
  static fromPoint3D(pt: Point3D) {
    return new Position(pt.x, pt.y, pt.z);
  }

  clone() {
    return new Position(this.x, this.y, this.y);
  }

  isWithinCells(point: Point3D, range: number | Point3D) {
    if (isNumber(range)) {
      range = { x: range, y: range, z: range };
    }

    return (
      Math.abs(point.x - this.x) <= range.x &&
      Math.abs(point.y - this.y) <= range.y &&
      Math.abs(point.z - this.z) <= range.z
    );
  }

  isNearby(point: Point3D) {
    return this.isWithinCells(point, 1);
  }

  isSamePlane(point: Point3D) {
    return point.z === this.z;
  }

  isAxisAligned(point: Point3D) {
    return this.x === point.x || this.y === this.y;
  }
}
