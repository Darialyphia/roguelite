<script setup lang="ts">
import type { UnitViewModel } from '@/unit/unit.model';
import DamageIndicator from './DamageIndicator.vue';
const { unit } = defineProps<{ unit: UnitViewModel }>();
</script>

<template>
  <container>
    <DamageIndicator :unit="unit" />
  </container>
</template>
