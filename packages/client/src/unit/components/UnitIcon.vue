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
  width: var(--unit-icon-size, calc(1.5 * 78px));
  aspect-ratio: 1;
  background: url('/assets/ui/card-icon-border.png'), v-bind(bg),
    url('/assets/ui/card-image-background.png');
  background-size:
    cover,
    cover,
    105px 105px;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
