<script setup lang="ts">
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { createSpritesheetFrameObject } from '@/utils/sprite';

const { assetId, tag = 'idle' } = defineProps<{
  assetId: string;
  tag?: string;
}>();

const sheet = useSpritesheet<'', 'base'>(toValue(assetId));
const textures = computed(() => {
  if (!sheet.value) return null;
  return createSpritesheetFrameObject(tag, sheet.value.sheets.base.base);
});
</script>

<template>
  <animated-sprite
    v-if="textures"
    :x="0"
    :event-mode="'none'"
    playing
    :anchor="0.5"
    :textures="textures"
  />
</template>
