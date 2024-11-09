import { deg2Rad, type Point, type Point3D } from '@game/shared';

export type Angle = 0 | 90 | 180 | 270;

export interface TransformOptions {
  rotation: boolean;
  isometric: boolean;
  scale: boolean;
}

export function applyTransforms(
  { x, y, z }: Point3D,
  angle: Angle,
  scale: Point3D,
  dimensions: { width: number; height: number }
): Point {
  const center = {
    x: Math.floor(dimensions.width / 2),
    y: Math.floor(dimensions.height / 2)
  };
  const rotated = {
    x:
      Math.cos(deg2Rad(angle)) * (x - center.x) -
      Math.sin(deg2Rad(angle)) * (y - center.y) +
      center.x,
    y:
      Math.sin(deg2Rad(angle)) * (x - center.x) +
      Math.cos(deg2Rad(angle)) * (y - center.y) +
      center.y
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
  dimensions: { width: number; height: number }
): Point => {
  const transformed = applyTransforms(point, angle, scale, dimensions);

  return transformed;
};

export const toCartesian = ({ x, y }: Point) => {
  return {
    x: Math.round((2 * y + x) / 2),
    y: Math.round((2 * y - x) / 2)
  };
};

export type UseIsoOptions = {
  dimensions: { width: number; height: number };
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
      _options.dimensions
    );
  });
};
