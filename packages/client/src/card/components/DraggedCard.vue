<script setup lang="ts">
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { lerp, type Point } from '@game/shared';
import { useMouse, useRafFn } from '@vueuse/core';

const { offset } = defineProps<{ offset: Point }>();
const cardRotation = ref({ x: 0, y: 0 });
const { x, y } = useMouse();
let prev = { x: x.value, y: y.value };
let delta = { x: 0, y: 0 };
const MAX_ANGLE = 45;
const SCALE_FACTOR = 1.4;
const LERP_FACTOR = 0.3;

useRafFn(() => {
  delta = {
    x: x.value - prev.x,
    y: y.value - prev.y
  };

  prev = { x: x.value, y: y.value };

  cardRotation.value = {
    x: lerp(
      cardRotation.value.x,
      Math.round(
        Math.max(Math.min(delta.y * SCALE_FACTOR, MAX_ANGLE), -MAX_ANGLE) * -1
      ),
      LERP_FACTOR
    ),
    y: lerp(
      cardRotation.value.y,
      Math.round(
        Math.max(Math.min(delta.x * SCALE_FACTOR, MAX_ANGLE), -MAX_ANGLE)
      ),
      LERP_FACTOR
    )
  };
});

const ui = useBattleUiStore();
</script>

<template>
  <Teleport to="#dragged-card-container">
    <div
      id="dragged-card"
      :style="{
        '--x': `${x}px`,
        '--y': `${y}px`,
        opacity: ui.hoveredCell ? 0.9 : 1
      }"
    >
      <slot />
    </div>
  </Teleport>
</template>

<style lang="postcss">
#dragged-card-container {
  perspective: 800px;
  position: fixed;
  inset: 0;
  pointer-events: none;
}
#dragged-card {
  pointer-events: none !important;
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  transform-style: preserve-3d;
  transform-origin: center center;
  transform: translateY(var(--y)) translateX(var(--x))
    rotateX(calc(1deg * v-bind('cardRotation.x')))
    rotateY(calc(1deg * v-bind('cardRotation.y')));
}
</style>
