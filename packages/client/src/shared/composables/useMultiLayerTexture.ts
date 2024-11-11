import type { ParsedAsepriteSheet } from '@/utils/aseprite-parser';
import { objectEntries, type Nullable } from '@game/shared';
import { type RenderTexture, Graphics } from 'pixi.js';
import { useApplication } from 'vue3-pixi';

export const useMultiLayerTexture = <
  TGroups extends string,
  TBaseLayers extends string,
  TGroupLayers extends string
>({
  sheet,
  tag,
  parts,
  dimensions
}: {
  sheet: MaybeRefOrGetter<
    Nullable<ParsedAsepriteSheet<TGroups, TBaseLayers, TGroupLayers>>
  >;
  tag: MaybeRefOrGetter<string>;
  parts: MaybeRefOrGetter<Record<TGroupLayers, TGroups | null>>;
  dimensions: { width: number; height: number };
}) => {
  const sheets = computed(() => {
    const _sheet = toValue(sheet);
    if (!_sheet) return [];
    const result = objectEntries(_sheet.sheets.base).map(([, sheet]) => ({
      sheet
    }));
    Object.entries(toValue(parts)).forEach(([part, group]) => {
      if (!group) return;
      result.push({
        //@ts-expect-error sorry I'm not Matt Pocock
        sheet: _sheet.sheets[group][part]
      });
    });

    return result;
  });

  const texturesGroups = computed(() => {
    return sheets.value.map(({ sheet }) => {
      return sheet.animations[toValue(tag)];
      // return createSpritesheetFrameObject(tag, sheet);
    });
  });

  const app = useApplication();

  const textures = shallowRef<RenderTexture[]>([]);
  watchEffect(() => {
    const _sheet = toValue(sheet);
    if (!_sheet) return;

    textures.value = [];
    const graphics: Graphics[] = [];

    texturesGroups.value.forEach(groupTextures => {
      groupTextures.forEach((texture, index) => {
        if (!graphics[index]) {
          graphics[index] = new Graphics();
        }

        const g = graphics[index];
        g.beginTextureFill({ texture });
        g.drawRect(0, 0, dimensions.width, dimensions.height);
      });
    });

    graphics.forEach(g => {
      textures.value.push(app.value.renderer.generateTexture(g));
    });
  });

  return textures;
};
