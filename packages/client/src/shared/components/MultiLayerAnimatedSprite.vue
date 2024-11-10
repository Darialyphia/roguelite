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
import { createSpritesheetFrameObject } from '@/utils/sprite';
import { objectEntries } from '@game/shared';
import type { AnimatedSprite, IPointData } from 'pixi.js';
import type { ContainerProps } from 'vue3-pixi';

const {
  sheet,
  tag,
  parts,
  anchor,
  tint = 'white',
  ...props
} = defineProps<
  ContainerProps & {
    sheet: ParsedAsepriteSheet<TGroups, TBaseLayers, TGroupLayers>;
    tag: string;
    parts: Record<TGroupLayers, TGroups | null>;
    anchor?: number | IPointData;
    tint?: AnimatedSprite['tint'];
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
    return createSpritesheetFrameObject(tag, sheet);
  });
});
</script>

<template>
  <container v-bind="props">
    <animated-sprite
      v-for="(textures, index) in texturesGroups"
      :key="index"
      :textures="textures"
      :anchor="anchor"
      event-mode="none"
      :tint="tint"
    />
  </container>
</template>

<style scoped lang="postcss"></style>
