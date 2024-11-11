<script
  setup
  lang="ts"
  generic="
    TGroups extends string,
    TBaseLayers extends string,
    TGroupLayers extends string
  "
>
import type { ParsedAsepriteSheet } from '@/utils/aseprite-parser';
import { objectEntries } from '@game/shared';
import { Graphics, RenderTexture, type AnimatedSprite } from 'pixi.js';
import { useApplication, type AnimatedSpriteProps } from 'vue3-pixi';

const { sheet, tag, parts, ...props } = defineProps<
  Omit<AnimatedSpriteProps, 'textures' | 'eventMode'> & {
    sheet: ParsedAsepriteSheet<TGroups, TBaseLayers, TGroupLayers>;
    tag: string;
    parts: Record<TGroupLayers, TGroups | null>;
  }
>();

const sheets = computed(() => {
  const result = objectEntries(sheet.sheets.base).map(([, sheet]) => ({
    sheet
  }));

  Object.entries(parts).forEach(([part, group]) => {
    if (!group) return;

    result.push({
      //@ts-expect-error sorry I'm not Matt Pocock
      sheet: sheet.sheets[group][part]
    });
  });

  return result;
});

const texturesGroups = computed(() => {
  return sheets.value.map(({ sheet }) => {
    return sheet.animations[tag];
    // return createSpritesheetFrameObject(tag, sheet);
  });
});

const app = useApplication();

const textures = shallowRef<RenderTexture[]>([]);
watchEffect(() => {
  textures.value = [];
  const graphics: Graphics[] = [];
  texturesGroups.value.forEach(groupTextures => {
    groupTextures.forEach((texture, index) => {
      if (!graphics[index]) {
        graphics[index] = new Graphics();
      }
      const g = graphics[index];
      g.beginTextureFill({ texture });
      g.drawRect(0, 0, sheet.meta.size.w, sheet.meta.size.h);
    });
  });

  graphics.forEach(g => {
    textures.value.push(app.value.renderer.generateTexture(g));
  });
});
</script>

<template>
  <animated-sprite
    :textures="textures"
    event-mode="none"
    v-bind="props"
    :tint="props.tint ?? 'white'"
  />
</template>

<style scoped lang="postcss"></style>
