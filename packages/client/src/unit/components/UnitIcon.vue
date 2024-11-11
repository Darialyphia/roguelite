<script setup lang="ts">
import type { UnitViewModel } from '../unit.model';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const bg = computed(() => `url(/assets/icons/${unit.spriteId}.png)`);
</script>

<template>
  <div class="unit-icon" />
</template>

<style scoped lang="postcss">
.unit-icon {
  width: var(--unit-icon-size, 96px);
  aspect-ratio: 1;
  background: url('/assets/ui/unit-icon-frame.png'), v-bind(bg),
    var(--unit-icon-bg, #32021b);
  background-size: cover;
}
</style>
