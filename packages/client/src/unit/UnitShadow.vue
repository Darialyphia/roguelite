<script setup lang="ts">
import type { UnitViewModel } from '@/pages/battle/battle.store';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import type { Filter } from 'pixi.js';
import { config } from '@/utils/config';
import { useMultiLayerTexture } from '@/shared/composables/useMultiLayerTexture';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const spritesheet = useSpritesheet(() => unit.spriteId);

const filters = computed(() => {
  const result: Filter[] = [];

  return result;
});

const textures = useMultiLayerTexture({
  sheet: spritesheet,
  parts: () => unit.cosmetics,
  tag: 'idle',
  dimensions: config.UNIT_SPRITE_SIZE
});
</script>

<template>
  <animated-sprite
    v-if="textures.length"
    :textures="textures"
    event-mode="none"
    :filters="filters"
    :anchor="{ x: 0, y: 1 }"
    :y="config.UNIT_SPRITE_SIZE.height - config.TILE_SIZE.z"
    :scale-y="0.5"
    :skew-x="0.5"
    :tint="0"
    :alpha="0.5"
  />
</template>

<style scoped lang="postcss"></style>
