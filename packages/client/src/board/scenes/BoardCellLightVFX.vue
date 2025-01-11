<script setup lang="ts">
import PointLight from '@/vfx/PointLight.vue';
import type { PointLightConfig } from '@/vfx/usePointLight';
import type { CellViewModel } from '../models/cell.model';
import { BLEND_MODES } from 'pixi.js';
import { useVFXEvent } from '@/battle/stores/battle.store';

const { cell } = defineProps<{ cell: CellViewModel }>();
type BoardLight = PointLightConfig & { alpha: number; id: number };
let nextId = 0;
const lights = ref<Array<BoardLight>>([]);

const cellLight: BoardLight = {
  id: ++nextId,
  group: cell.id,
  alpha: 1,
  blendMode: cell.light?.blendMode ?? BLEND_MODES.NORMAL,
  colorStops: cell.light?.colorStops ?? [],
  position: cell.light?.offset ?? { x: 0, y: 0 },
  radius: cell.light?.radius ?? 0
};

watch(
  () => cell,
  cell => {
    const idx = lights.value.indexOf(cellLight);
    if (cell.light) {
      cellLight.blendMode = cell.light.blendMode;
      cellLight.colorStops = cell.light.colorStops;
      cellLight.radius = cell.light.radius;
      cellLight.position = cell.light.offset;
      if (idx === -1) {
        lights.value.push(cellLight);
      }
    } else {
      if (idx !== -1) {
        lights.value.splice(idx, 1);
      }
    }
  }
);
useVFXEvent('ADD_LIGHT_AT', async params => {
  if (!cell.getCell().position.equals(params.position)) return;
  const light: BoardLight = {
    id: ++nextId,
    group: cell.id,
    alpha: 0,
    position: { x: 0, y: 0 },
    blendMode: params.blendMode,
    radius: 0,
    colorStops: [
      [0, '#00000000'],
      [1, '#00000000']
    ]
  };
  lights.value.push(light);
  const l = lights.value[lights.value.indexOf(light)]; // have to do this for reactivity reasons, mutating the light object directly will not trigger it
  for (const step of params.steps) {
    l.colorStops = step.colorStops;

    await Promise.all([
      gsap.to(l.position, {
        x: step.offset.x,
        y: step.offset.y,
        duration: step.duration / 1000,
        ease: Power0.easeNone
      }),

      gsap.to(l, {
        radius: step.radius,
        duration: step.duration / 1000,
        ease: Power0.easeNone
      })
    ]);
  }

  lights.value.splice(lights.value.indexOf(light), 1);
});
</script>

<template>
  <PointLight v-for="light in lights" :key="light.id" :light />
</template>
