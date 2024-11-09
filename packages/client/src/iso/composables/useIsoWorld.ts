import type { Nullable, Point3D } from '@game/shared';
import type { Ref, ComputedRef, MaybeRefOrGetter } from 'vue';
import type { Angle } from './useIso';
import { useSafeInject } from '@/shared/composables/useSafeInject';

export type IsoWorldContext = {
  angle: Ref<Angle>;
  scale: ComputedRef<Point3D>;
  width: ComputedRef<number>;
  height: ComputedRef<number>;
};

export const ISO_GRID_INJECTION_KEY = Symbol(
  'iso_grid'
) as InjectionKey<IsoWorldContext>;

export type UseIsoWorldProviderOptions = {
  angle: MaybeRefOrGetter<Nullable<Angle>>;
  tileSize: MaybeRefOrGetter<Nullable<Point3D>>;
  width: MaybeRefOrGetter<number>;
  height: MaybeRefOrGetter<number>;
};
export const useIsoWorldProvider = (options: UseIsoWorldProviderOptions) => {
  const angle = ref(toValue(options.angle) ?? 0);
  const ctx: IsoWorldContext = {
    angle,
    width: computed(() => toValue(options.width)),
    height: computed(() => toValue(options.height)),
    scale: computed(() => toValue(options.tileSize) ?? { x: 1, y: 1, z: 1 })
  };

  provide(ISO_GRID_INJECTION_KEY, ctx);

  return ctx;
};

export const useIsoWorld = () => useSafeInject(ISO_GRID_INJECTION_KEY);
