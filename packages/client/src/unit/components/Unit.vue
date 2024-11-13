<script setup lang="ts">
import UnitOrientation from './UnitOrientation.vue';
import UnitSprite from './UnitSprite.vue';
import UnitShadow from './UnitShadow.vue';
import UnitStatBars from './UnitStatBars.vue';
import UnitPositioner from './UnitPositioner.vue';
import type { UnitViewModel } from '../unit.model';
import UnitVFX from './vfx/UnitVFX.vue';
import { whenever } from '@vueuse/core';
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import { useIsoPoint } from '@/iso/composables/useIsoPoint';
import { useBattleEvent } from '@/pages/battle/battle.store';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const camera = useIsoCamera();
const { isoPosition } = useIsoPoint({
  position: computed(() => unit.position)
});

const centerCamera = () => {
  camera.viewport.value?.animate({
    position: {
      x: isoPosition.value.x + camera.offset.value.x,
      y: isoPosition.value.y + camera.offset.value.y
    },
    time: 250,
    ease: 'easeOutSine'
  });
};
whenever(() => unit.isActive(), centerCamera);

useBattleEvent('unit.before_attack', e => {
  if (e.unit.equals(unit.getUnit())) {
    centerCamera();
  }
  return Promise.resolve();
});
</script>

<template>
  <UnitPositioner :unit="unit" bounce>
    <UnitOrientation :unit="unit">
      <UnitShadow :unit="unit" />
      <UnitSprite :unit="unit" />
    </UnitOrientation>
    <UnitVFX :unit="unit" />
    <UnitStatBars :unit="unit" />
  </UnitPositioner>
</template>

<style scoped lang="postcss"></style>
