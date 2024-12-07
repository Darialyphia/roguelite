import { useIsoWorld } from './useIsoWorld';
import type { Nullable, Point3D } from '@game/shared';
import { useIso } from './useIso';
import type { MaybeRefOrGetter } from 'vue';

export type UseIsoTileOptions = {
  position: MaybeRefOrGetter<Point3D>;
  zIndexOffset?: MaybeRefOrGetter<Nullable<number>>;
};

export const useIsoPoint = ({ position, zIndexOffset }: UseIsoTileOptions) => {
  const grid = useIsoWorld();

  const isoPosition = useIso(
    computed(() => toValue(position)),
    computed(() => ({
      dimensions: { width: grid.width.value, height: grid.height.value },
      angle: grid.angle.value,
      scale: grid.scale.value
    }))
  );

  const zIndex = computed(() => {
    const { z } = toValue(position);
    const raw = (z + 1) * isoPosition.value.y + (toValue(zIndexOffset) ?? 0);

    return Math.round(raw * 10) / 10;
  });

  return { isoPosition, zIndex };
};
