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

const { sheet, tag, parts } = defineProps<{
  sheet: ParsedAsepriteSheet<TGroups, TBaseLayers, TGroupLayers>;
  tag: string;
  parts: Record<TGroupLayers, TGroups | null>;
}>();

watchEffect(() => {
  console.log(parts);
});

const sheets = computed(() => {
  console.log('compute sheets');
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
  <container>
    <animated-sprite
      v-for="(textures, index) in texturesGroups"
      :key="index"
      :textures="textures"
      :anchor="0.5"
      event-mode="none"
    />
  </container>
</template>

<style scoped lang="postcss"></style>
