<script setup lang="ts">
import { useBattleStore } from '@/pages/battle/battle.store';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import type { Filter } from 'pixi.js';
import { config } from '@/utils/config';
import { useMultiLayerTexture } from '@/shared/composables/useMultiLayerTexture';
import { useIsoWorld } from '@/iso/composables/useIsoWorld';
import type { UnitViewModel } from '../unit.model';

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
const battleStore = useBattleStore();
const camera = useIsoWorld();
const isFlipped = computed(() => {
  let value = unit
    .getUnit()
    .player.isEnemy(battleStore.state.userPlayer.getPlayer())
    ? true
    : false;
  if (camera.angle.value === 90 || camera.angle.value === 180) {
    value = !value;
  }

  return value;
});
</script>

<template>
  <animated-sprite
    v-if="textures.length"
    :textures="textures"
    event-mode="none"
    :filters="filters"
    :anchor="{ x: 0, y: 1 }"
    :y="config.UNIT_SPRITE_SIZE.height - config.TILE_SIZE.z - 4"
    :x="-5"
    :scale-y="0.5"
    :skew-x="isFlipped ? -0.6 : 0.6"
    :tint="0"
    :alpha="0.5"
  />
</template>

<style scoped lang="postcss"></style>
