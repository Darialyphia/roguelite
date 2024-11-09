import type { Nullable, Point, Point3D } from '@game/shared';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import type { Angle } from './useIso';
import { useSafeInject } from '@/shared/composables/useSafeInject';

export type IsoWorldContext = {
  rotationCenter: ComputedRef<Point>;
  angle: ComputedRef<Angle>;
  scale: ComputedRef<Point3D>;
};

export const ISO_GRID_INJECTION_KEY = Symbol(
  'iso_grid'
) as InjectionKey<IsoWorldContext>;

export type UseIsoWorldProviderOptions = {
  rotationCenter: MaybeRefOrGetter<Nullable<Point>>;
  angle: MaybeRefOrGetter<Nullable<Angle>>;
  tileSize: MaybeRefOrGetter<Nullable<Point3D>>;
};
export const useIsoWorldProvider = (options: UseIsoWorldProviderOptions) => {
  const ctx: IsoWorldContext = {
    rotationCenter: computed(
      () => toValue(options.rotationCenter) ?? { x: 0, y: 0 }
    ),
    angle: computed(() => toValue(options.angle) ?? 0),
    scale: computed(() => toValue(options.tileSize) ?? { x: 1, y: 1, z: 1 })
  };

  provide(ISO_GRID_INJECTION_KEY, ctx);

  return ctx;
};

export const useIsoWorld = () => useSafeInject(ISO_GRID_INJECTION_KEY);
