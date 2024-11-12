<script setup lang="ts">
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { OutlineFilter } from '@pixi/filter-outline';
import type { Filter } from 'pixi.js';
import { useMultiLayerTexture } from '@/shared/composables/useMultiLayerTexture';
import { config } from '@/utils/config';
import type { UnitViewModel } from '../unit.model';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const spritesheet = useSpritesheet(() => unit.spriteId);

const ui = useBattleUiStore();

const selectedFilter = new OutlineFilter(1, 0xffffff);

const filters = computed(() => {
  const result: Filter[] = [];

  if (ui.highlightedUnit?.equals(unit)) {
    result.push(selectedFilter);
  }
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
    :anchor="0.5"
    event-mode="none"
    :filters="filters"
  />
</template>

<style scoped lang="postcss"></style>
