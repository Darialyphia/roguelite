<script setup lang="ts">
import type { UnitViewModel } from '../unit.model';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const bg = computed(() => `url(/assets/icons/${unit.iconId}.png)`);
</script>

<template>
  <div class="unit-icon" />
</template>

<style scoped lang="postcss">
.unit-icon {
  width: var(--unit-icon-size, 78px);
  aspect-ratio: 1;
  background: url('/assets/ui/card-icon-border.png'), v-bind(bg),
    url('/assets/ui/card-icon-border-bg.png');

  background-size: cover, cover, cover;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
