<script setup lang="ts">
import type { CardBlueprint } from '@game/engine/src/card/card-blueprint';

const { card } = defineProps<{ card: CardBlueprint }>();

const imagePath = computed(() => `url(/assets/icons/${card.iconId}.png)`);
</script>

<template>
  <div class="card-icon"></div>
</template>

<style scoped lang="postcss">
.card-icon {
  width: 64px;
  aspect-ratio: 1;
  background: url('/assets/ui/card-icon-border.png'), v-bind(imagePath);
  background-size: cover;
  background-position: center;
}
</style>
