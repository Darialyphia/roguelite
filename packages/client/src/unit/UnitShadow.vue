<script setup lang="ts">
import type { UnitViewModel } from '@/pages/battle/battle.store';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import MultiLayerAnimatedSprite from '@/shared/components/MultiLayerAnimatedSprite.vue';
import type { Filter } from 'pixi.js';
import { config } from '@/utils/config';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const spritesheet = useSpritesheet(() => unit.spriteId);

const filters = computed(() => {
  const result: Filter[] = [];

  return result;
});
</script>

<template>
  <MultiLayerAnimatedSprite
    v-if="spritesheet"
    :filters="filters"
    :sheet="spritesheet"
    tag="idle"
    :parts="unit.cosmetics"
    :anchor="{ x: 0, y: 1 }"
    :y="config.UNIT_SPRITE_SIZE.height - config.TILE_SIZE.z"
    :scale-y="0.6"
    :skew-x="0.5"
    :tint="0"
    :alpha="0.3"
  />
</template>

<style scoped lang="postcss"></style>
