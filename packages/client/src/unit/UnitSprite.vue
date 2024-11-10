<script setup lang="ts">
import type { UnitViewModel } from '@/pages/battle/battle.store';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import MultiLayerAnimatedSprite from '@/shared/components/MultiLayerAnimatedSprite.vue';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { OutlineFilter } from '@pixi/filter-outline';
import type { Filter } from 'pixi.js';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const spritesheet = useSpritesheet(() => unit.spriteId);

const ui = useBattleUiStore();

const isHovered = computed(() =>
  ui.hoveredCell?.position.equals(unit.position)
);

const selectedFilter = new OutlineFilter(1, 0xffffff);

const filters = computed(() => {
  const result: Filter[] = [];

  if (isHovered.value) {
    result.push(selectedFilter);
  }
  return result;
});
</script>

<template>
  <MultiLayerAnimatedSprite
    v-if="spritesheet"
    event-mode="none"
    :filters="filters"
    :sheet="spritesheet"
    tag="idle"
    :parts="unit.cosmetics"
  />
</template>

<style scoped lang="postcss"></style>
