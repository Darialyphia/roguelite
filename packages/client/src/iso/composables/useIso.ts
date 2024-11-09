import { deg2Rad, type Point, type Point3D } from '@game/shared';

export type Angle = 0 | 90 | 180 | 270;

export interface TransformOptions {
  rotation: boolean;
  isometric: boolean;
  scale: boolean;
}

export function applyTransforms(
  { x, y, z }: Point3D,
  angle: number,
  scale: Point3D,
  roationCenter: Point
): Point {
  const centered = {
    x: x - roationCenter.x,
    y: y - roationCenter.y
  };
  console.log({ x, y }, centered);
  const radius = Math.sqrt(Math.pow(centered.x, 2) + Math.pow(centered.y, 2));
  const rotationAngle = Math.atan2(centered.y, centered.x) + angle;

  const rotated = {
    x: roationCenter.x + radius * Math.cos(rotationAngle),
    y: roationCenter.x + radius * Math.sin(rotationAngle)
  };

  const iso = {
    x: (rotated.x - rotated.y) / 2,
    y: (rotated.x + rotated.y) / 2
  };

  return {
    x: iso.x * scale.x,
    y: iso.y * scale.y - z * scale.z
  };
}

export const toIso = (
  point: Point3D,
  angle: Angle,
  scale: Point3D,
  rotationCenter: Point
): Point => {
  const transformed = applyTransforms(
    point,
    deg2Rad(angle),
    scale,
    rotationCenter
  );

  return transformed;
};

export const toCartesian = ({ x, y }: Point) => {
  return {
    x: Math.round((2 * y + x) / 2),
    y: Math.round((2 * y - x) / 2)
  };
};

export type UseIsoOptions = {
  rotationCenter?: Point;
  angle?: Angle;
  scale?: Point3D;
};
export const useIso = (
  point: MaybeRefOrGetter<Point3D>,
  options: MaybeRefOrGetter<UseIsoOptions>
) => {
  return computed(() => {
    const _options = toValue(options);
    return toIso(
      toValue(point),
      _options.angle ?? 0,
      _options.scale ?? { x: 1, y: 1, z: 1 },
      _options.rotationCenter ?? { x: 0, y: 0 }
    );
  });
};
