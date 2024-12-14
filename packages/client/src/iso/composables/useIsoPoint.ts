import { useIsoWorld } from './useIsoWorld';
import type { Nullable, Point3D } from '@game/shared';
import { useIso } from './useIso';
import type { MaybeRefOrGetter } from 'vue';
import { config } from '@/utils/config';

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
    const raw =
      isoPosition.value.y +
      config.TILE_SIZE.z * (z + 1) +
      (toValue(zIndexOffset) ?? 0);

    return Math.round(raw * 10) / 10;
  });

  return { isoPosition, zIndex };
};
