<script setup lang="ts">
import type { UnitViewModel } from '@/unit/unit.model';
import DamageIndicator from './DamageIndicator.vue';
import { config } from '@/utils/config';
const { unit } = defineProps<{ unit: UnitViewModel }>();
</script>

<template>
  <container :x="config.UNIT_SPRITE_SIZE.width / 2">
    <DamageIndicator :unit="unit" />
  </container>
</template>
