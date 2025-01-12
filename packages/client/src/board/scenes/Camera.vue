<script setup lang="ts">
import { useApplication } from 'vue3-pixi';
import { Container } from 'pixi.js';
import { until, useEventListener } from '@vueuse/core';
import { config } from '@/utils/config';
import { useCamera } from '../composables/useCamera';
import { useGame } from '@/battle/stores/battle.store';

const app = useApplication();
const game = useGame();
const camera = useCamera();
const WORLD_PADDING = {
  x: -240,
  y: -50
};

const boardSize = computed(() => ({
  width: (game.value.boardSystem.width + 1) * config.TILE_SIZE.x,
  height: game.value.boardSystem.height * config.TILE_SIZE.y
}));

const worldSize = computed(() => ({
  width: boardSize.value.width + Math.abs(WORLD_PADDING.x) * 2,
  height: boardSize.value.height + Math.abs(WORLD_PADDING.y)
}));

until(camera.viewport)
  .toBeTruthy()
  .then(viewport => {
    viewport
      .drag({
        mouseButtons: 'left'
      })
      .decelerate({ friction: 0.88 })
      .wheel({ smooth: 20, percent: 0.25 })
      .clamp({
        direction: 'all'
      })
      .clampZoom({ minScale: config.MIN_ZOOM, maxScale: config.MAX_ZOOM })
      .setZoom(config.INITIAL_ZOOM, false)
      .pinch({ noDrag: true })
      .moveCenter({ x: 0, y: 0 });
  });

useEventListener('resize', () => {
  setTimeout(() => {
    camera.viewport.value?.resize(window.innerWidth, window.innerHeight);
  }, 50);
});

watchEffect(() => {
  camera.offset.value = {
    x: WORLD_PADDING.x / 2 + config.TILE_SIZE.x * 0.75,
    y: WORLD_PADDING.y + config.TILE_SIZE.y
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
      <slot :worldSize="worldSize" v-if="camera.viewport.value" />
    </container>
  </viewport>
</template>
