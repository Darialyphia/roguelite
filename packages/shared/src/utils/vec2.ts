import type { Point } from '../types/geometry';
import type { Serializable } from '../types/utils';

export class Vec2 implements Serializable {
  static fromPoint(pt: Point) {
    return new Vec2(pt.x, pt.y);
  }

  static add(v1: Point, v2: Point) {
    return Vec2.fromPoint(v1).add(v2);
  }

  static sub(vec1: Point, vec2: Point) {
    return Vec2.fromPoint(vec1).sub(vec2);
  }

  static mul(vec1: Point, vec2: Point) {
    return Vec2.fromPoint(vec1).mul(vec2);
  }

  static div(vec1: Point, vec2: Point) {
    return Vec2.fromPoint(vec1).div(vec2);
  }

  constructor(
    public x: number,
    public y: number
  ) {}

  serialize() {
    return { x: this.x, y: this.y };
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  equals(vec: Point) {
    return this.x === vec.x && this.y === vec.y;
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    return this;
  }

  add({ x, y }: Point) {
    this.x += x;
    this.y += y;

    return this;
  }

  sub({ x, y }: Point) {
    this.x -= x;
    this.y -= y;

    return this;
  }

  mul({ x, y }: Point) {
    this.x *= x;
    this.y *= y;

    return this;
  }

  div({ x, y }: Point) {
    this.x /= x;
    this.y /= y;

    return this;
  }

  dist({ x, y }: Point) {
    const diff = {
      x: x - this.x,
      y: y - this.y
    };

    return Math.sqrt(diff.x ** 2 + diff.y ** 2);
  }
}
