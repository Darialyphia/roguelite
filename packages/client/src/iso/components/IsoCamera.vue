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
  x: 0,
  y: 0
};

const worldSize = computed(() => ({
  width: WORLD_PADDING.x + ((width + height) / 2) * config.TILE_SIZE.x,
  height: WORLD_PADDING.y + ((width + height) / 2) * config.TILE_SIZE.y
}));

watchEffect(() => {
  camera.offset.value = {
    x: worldSize.value.width / 2,
    y: worldSize.value.height / 2
  };
  console.log(worldSize.value);
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
  }, 100);
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
    <container :sortable-children="true">
      <graphics
        @render="
          g => {
            g.clear();
            g.beginFill('blue');
            g.drawRect(0, 0, worldSize.width, worldSize.height);
            g.endFill();
          }
        "
      />
      <slot />
    </container>
  </viewport>
</template>
