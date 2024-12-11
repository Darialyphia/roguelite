<script setup lang="ts">
import { waitFor, type BetterOmit, type Point } from '@game/shared';
import { BLEND_MODES, Matrix, Graphics as PixiGraphics } from 'pixi.js';
import { onTick, PTransitionGroup } from 'vue3-pixi';
import { radialGradient } from '@/utils/sprite';
import { config } from '@/utils/config';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { useIsoWorld } from '@/iso/composables/useIsoWorld';
import type { UnitViewModel } from '@/unit/unit.model';
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import { getBlendFilter } from '@pixi/picture';
import PointLight from '@/vfx/PointLight.vue';
import type { PointLightConfig } from '@/vfx/usePointLight';
import { useVFXEvent } from '@/pages/battle/battle.store';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const isVFxPlaying = ref(false);
const firstPass = ref<PointLightConfig>({
  group: unit.id,
  blendMode: BLEND_MODES.OVERLAY,
  position: { x: 0, y: 0 },
  radius: 120,
  colorStops: [
    [0, 'hsla(60, 100%, 60%, 50%)'],
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
    [0, 'hsla(250, 65%, 75%, 50%)'],
    [0.25, 'hsla(60, 65%, 75%, 50%)'],
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
