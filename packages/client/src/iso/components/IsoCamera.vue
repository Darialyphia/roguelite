<script setup lang="ts">
import { useApplication } from 'vue3-pixi';
import { type Viewport } from 'pixi-viewport';
import { Container } from 'pixi.js';
import { until, useEventListener } from '@vueuse/core';
import { useIsoCamera } from '../composables/useIsoCamera';
import { config } from '@/utils/config';
import { match } from 'ts-pattern';

const { width, height } = defineProps<{
  width: number;
  height: number;
}>();
const app = useApplication();

const camera = useIsoCamera();
const worldSize = computed(() => ({
  width: ((width + height) / 2) * config.TILE_SIZE.x,
  height: ((width + height) / 2) * config.TILE_SIZE.y + config.TILE_SIZE.z
}));

watchEffect(() => {
  camera.offset.value = {
    x: worldSize.value.width / 2,
    y: worldSize.value.height / 2
  };
});

until(camera.viewport)
  .not.toBe(undefined)
  .then(() => {
    camera.viewport.value
      ?.drag({
        mouseButtons: 'left'
      })
      .pinch()
      .decelerate({ friction: 0.88 })
      .wheel({ smooth: 20, percent: 0.05 })
      .clamp({
        direction: 'all'
      })
      .clampZoom({ minScale: 1, maxScale: 3 })
      .setZoom(2, false)
      .mouseEdges({
        distance: 10,
        speed: 15,
        allowButtons: true
      })
      .pinch({ noDrag: true })
      .moveCenter(worldSize.value.width / 2, worldSize.value.height / 2);
  });

useEventListener('resize', () => {
  setTimeout(() => {
    camera.viewport.value?.resize(window.innerWidth, window.innerHeight);
  }, 50);
});

const containerOffset = computed(() => {
  return match(camera.angle.value)
    .with(0, () => ({
      x: (height / 2) * config.TILE_SIZE.x,
      y: 0
    }))
    .with(90, () => ({
      x: (height / 2) * config.TILE_SIZE.x,
      y: 0
    }))
    .with(180, () => ({
      x: (height / 2) * config.TILE_SIZE.x,
      y: 0
    }))
    .with(270, () => ({
      x: (height / 2) * config.TILE_SIZE.x,
      y: 0
    }))
    .exhaustive();
});
</script>

<template>
  <viewport
    :ref="
      (el: any) => {
        if (!el) return;

        camera.viewport.value = el;
      }
    "
    :screen-width="app.view.width"
    :screen-height="app.view.height"
    :world-width="worldSize.width"
    :world-height="worldSize.height"
    :events="app.renderer.events"
    :disable-on-context-menu="true"
    :sortable-children="true"
  >
    <container :sortable-children="true" v-bind="containerOffset">
      <slot />
    </container>
  </viewport>
</template>
