<script setup lang="ts">
import { config } from '@/utils/config';
import UnitOrientation from './UnitOrientation.vue';
import UnitSprite from './UnitSprite.vue';
import UnitShadow from './UnitShadow.vue';
import UnitStatBars from './UnitStatBars.vue';
import UnitPositioner from './UnitPositioner.vue';
import type { UnitViewModel } from '../unit.model';
import UnitVFX from './vfx/UnitVFX.vue';

const { unit } = defineProps<{ unit: UnitViewModel }>();
</script>

<template>
  <UnitPositioner :unit="unit" bounce>
    <UnitOrientation :unit="unit">
      <UnitShadow :unit="unit" />
      <UnitSprite :unit="unit" />
    </UnitOrientation>
    <UnitVFX :unit="unit" />
    <UnitStatBars :unit="unit" :x="config.TILE_SIZE.x / 3" />
  </UnitPositioner>
</template>

<style scoped lang="postcss"></style>
