import type { ParsedAsepriteSheet } from '@/utils/aseprite-parser';
import { useAssets } from './useAssets';

export const useSpritesheet = <
  TGroups extends string = string,
  TBaseLayers extends string = string,
  TGroupLayers extends string = string
>(
  assetId: MaybeRefOrGetter<string>
) => {
  const sheet =
    shallowRef<ParsedAsepriteSheet<TGroups, TBaseLayers, TGroupLayers>>();

  const assets = useAssets();

  watchEffect(() => {
    assets
      .loadSpritesheet<TGroups, TBaseLayers, TGroupLayers>(toValue(assetId))
      .then(result => {
        sheet.value = result;
      });
  });

  return sheet;
};
