<script setup lang="ts">
import { useBattleEvent, useBattleStore } from '@/pages/battle/battle.store';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { type Filter, BlurFilter } from 'pixi.js';
import { config } from '@/utils/config';
import { useMultiLayerTexture } from '@/shared/composables/useMultiLayerTexture';
import type { UnitViewModel } from '../unit.model';
import { GAME_EVENTS } from '@game/engine/src/game/game';
import { useCamera } from '@/board/composables/useCamera';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const spritesheet = useSpritesheet(() => unit.spriteId);

const blurFilter = new BlurFilter(0.3, 0.5);

const filters = computed(() => {
  const result: Filter[] = [blurFilter];

  return result;
});

const textures = useMultiLayerTexture({
  sheet: spritesheet,
  parts: {},
  tag: 'idle',
  dimensions: config.UNIT_SPRITE_SIZE
});
const battleStore = useBattleStore();
const camera = useCamera();
const isSpriteFlipped = computed(() => {
  let value = unit
    .getUnit()
    .player.isEnemy(battleStore.state.userPlayer.getPlayer())
    ? true
    : false;

  return value;
});

const skewX = computed(() => {
  let base = 0.6;
  if (isSpriteFlipped.value) base *= -1;

  return base;
});

const scaleY = computed(() => {
  return 0.5;
});
const y = computed(() => {
  return config.UNIT_SPRITE_SIZE.height * 0.3;
});

useBattleEvent(GAME_EVENTS.UNIT_AFTER_MOVE, e => {
  return new Promise(resolve => {
    if (!e.unit.equals(unit.getUnit())) return resolve();

    gsap.to(blurFilter, {
      blur: 2,
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
    :anchor="{ x: 0, y: 1 }"
    :y="y"
    :x="-56"
    :tint="0"
    :filters="filters"
    :alpha="0.5"
    :scale-y="scaleY"
    :skew-x="skewX"
  />
</template>

<style scoped lang="postcss"></style>
