<script setup lang="ts">
import { useBattleEvent, useBattleStore } from '@/pages/battle/battle.store';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { type Filter, BlurFilter } from 'pixi.js';
import { config } from '@/utils/config';
import { useMultiLayerTexture } from '@/shared/composables/useMultiLayerTexture';
import { useIsoWorld } from '@/iso/composables/useIsoWorld';
import type { UnitViewModel } from '../unit.model';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const spritesheet = useSpritesheet(() => unit.spriteId);

const blurFilter = new BlurFilter(0.5, 0.5);

const filters = computed(() => {
  const result: Filter[] = [blurFilter];

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
const isSpriteFlipped = computed(() => {
  let value = unit
    .getUnit()
    .player.isEnemy(battleStore.state.userPlayer.getPlayer())
    ? true
    : false;
  if (camera.angle.value === 180 || camera.angle.value === 270) {
    value = !value;
  }

  return value;
});

const skewX = computed(() => {
  let base = 0.6;
  if (isSpriteFlipped.value) base *= -1;

  return base;
});

const scaleY = computed(() => {
  if (camera.angle.value === 180 || camera.angle.value === 270) return -0.5;
  return 0.5;
});
const y = computed(() => {
  if (camera.angle.value === 180 || camera.angle.value === 270) {
    return config.UNIT_SPRITE_SIZE.height * 0.7 - config.TILE_SIZE.z - 4;
  }

  return config.UNIT_SPRITE_SIZE.height - config.TILE_SIZE.z - 4;
});

useBattleEvent('unit.after_move', e => {
  return new Promise(resolve => {
    if (!e.unit.equals(unit.getUnit())) return resolve();

    gsap.to(blurFilter, {
      blur: 2.5,
      duration: config.MOVEMENT_SPEED_PER_TILE / 2,
      repeat: 1,
      yoyo: true,
      onComplete: resolve
    });
  });
});
</script>

<template>
  <animated-sprite
    v-if="textures.length"
    :textures="textures"
    event-mode="none"
    :filters="filters"
    :anchor="{ x: 0, y: 1 }"
    :alpha="0.5"
    :tint="0"
    :y="y"
    :x="7"
    :scale-y="scaleY"
    :skew-x="skewX"
  />
</template>

<style scoped lang="postcss"></style>
