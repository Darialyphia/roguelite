<script setup lang="ts">
import { config } from '@/utils/config';

const { value, icon } = defineProps<{
  value: number;
  icon: string;
  invalid?: boolean;
}>();

const iconPath = computed(() => `url(/assets/ui/${icon}.png)`);
</script>

<template>
  <div class="stat-circle" :class="invalid && 'invalid'">
    <div :data-text="value">{{ value }}</div>
  </div>
</template>

<style scoped lang="postcss">
.stat-circle {
  width: calc(1px * v-bind('config.STAT_CIRCLE_SIZE'));
  aspect-ratio: 1;
  background: url('/assets/ui/stat-circle.png');
  display: grid;
  font-family: 'Press Start 2P';
  font-weight: bold;
  font-size: var(--font-size-4);
  position: relative;
  z-index: 0;

  > div {
    place-self: center;
    background: linear-gradient(
      #fffe00,
      #fffe00 calc(50% + 3px),
      #feb900 calc(50% + 3px)
    );
    background-clip: text;
    color: transparent;
    position: relative;
    .invalid & {
      background: linear-gradient(
        #ff0000,
        #ff0000 calc(50% + 3px),
        #aa0000 calc(50% + 3px)
      );
      background-clip: text;
    }
    &:after {
      background: none;
      content: attr(data-text);
      position: absolute;
      text-shadow: 0 3px black;
      inset: 0;
      z-index: -1;
    }
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    right: 3px;
    background: v-bind(iconPath);
    width: 30px;
    aspect-ratio: 1;
  }
}
</style>
