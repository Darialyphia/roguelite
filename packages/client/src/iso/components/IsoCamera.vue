<script setup lang="ts">
import { useApplication } from 'vue3-pixi';
import { type Viewport } from 'pixi-viewport';
import { Container } from 'pixi.js';
import { until, useEventListener } from '@vueuse/core';
import { useIsoCamera } from '../composables/useIsoCamera';
import { config } from '@/utils/config';

const { width, height } = defineProps<{
  width: number;
  height: number;
}>();
const app = useApplication();

const camera = useIsoCamera();
const WORLD_PADDING = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

const boardSize = computed(() => ({
  width: ((width + height) / 2) * config.TILE_SIZE.x,
  height: ((width + height) / 2) * (config.TILE_SIZE.y + config.TILE_SIZE.z)
}));

const worldSize = computed(() => ({
  width: boardSize.value.width + WORLD_PADDING.x,
  height: boardSize.value.height + WORLD_PADDING.y
}));

until(camera.viewport)
  .toBeTruthy()
  .then(viewport => {
    viewport
      .drag({
        mouseButtons: 'left'
      })
      .pinch()
      .decelerate({ friction: 0.88 })
      .wheel({ smooth: 20, percent: 0.25 })
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

watchEffect(() => {
  camera.offset.value = {
    x: (height / 2) * config.TILE_SIZE.x + WORLD_PADDING.x / 2,
    y: boardSize.value.height / 4 + WORLD_PADDING.y / 2
  };
});
</script>

<template>
  <viewport
    :ref="
      (el: any) => {
        if (!el) return;

        camera.provideViewport(el);
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
    <container :sortable-children="true" v-bind="camera.offset.value">
      <slot />
    </container>
  </viewport>
</template>
