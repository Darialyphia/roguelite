<script setup lang="ts">
import { BLEND_MODES } from 'pixi.js';
import { onTick } from 'vue3-pixi';
import type { UnitViewModel } from '@/unit/unit.model';
import PointLight from '@/vfx/PointLight.vue';
import type { PointLightConfig } from '@/vfx/usePointLight';
import { useVFXEvent } from '@/battle/stores/battle.store';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const isVFxPlaying = ref(false);
const firstPass = ref<PointLightConfig>({
  group: unit.id,
  blendMode: BLEND_MODES.OVERLAY,
  position: { x: 0, y: 0 },
  radius: 120,
  colorStops: [
    [0, 'hsla(60, 100%, 60%, 0%)'],
    [1, 'rgba(0,0,0,0)']
  ]
});
let diff = 0.4;
onTick(() => {
  if (isVFxPlaying.value) return;
  if (firstPass.value.radius >= 120 || firstPass.value.radius <= 60) {
    diff *= -1;
  }
  firstPass.value.radius += diff;
});

const secondPass = ref<PointLightConfig>({
  group: unit.id,
  blendMode: BLEND_MODES.ADD,
  position: { x: 0, y: 0 },
  radius: 100,
  colorStops: [
    [0, 'hsla(250, 65%, 75%, 0%)'],
    [0.25, 'hsla(60, 65%, 75%, 0%)'],
    [1, 'rgba(0,0,0,0)']
  ]
});

useVFXEvent('UPDATE_UNIT_LIGHT', async params => {
  if (!params.unit.equals(unit.getUnit())) return;

  isVFxPlaying.value = true;
  const light = params.pass === 0 ? firstPass.value : secondPass.value;
  const copy = {
    ...light,
    position: { ...light.position },
    colorStops: [...light.colorStops]
  };

  light.blendMode = params.blendMode;
  for (const step of params.steps) {
    light.colorStops = step.colorStops;

    await Promise.all([
      gsap.to(light.position, {
        x: step.offset.x,
        y: step.offset.y,
        duration: step.animated ? step.duration / 1000 : 0.05,
        ease: Power0.easeNone
      }),

      gsap.to(light, {
        radius: step.radius,
        duration: step.animated ? step.duration / 1000 : 0.05,
        ease: Power0.easeNone
      })
    ]);
  }

  light.blendMode = copy.blendMode;
  light.colorStops = copy.colorStops;
  await Promise.all([
    gsap.to(light.position, {
      x: copy.position.x,
      y: copy.position.y,
      duration: 0.5,
      ease: Power2.easeOut
    }),

    gsap.to(light, {
      radius: copy.radius,
      duration: 0.5,
      ease: Power2.easeOut
    })
  ]);
  isVFxPlaying.value = false;
});
</script>

<template>
  <PointLight :light="firstPass" />
  <PointLight :light="secondPass" />
</template>
