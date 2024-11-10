<script setup lang="ts">
import Stats from 'stats.js';
import { onTick } from 'vue3-pixi';

const stats = new Stats();

const statsRoot = useTemplateRef('statsRoot');
onMounted(() => {
  stats.showPanel(0);
  statsRoot.value?.appendChild(stats.dom);
});

stats.begin();
onTick(() => {
  stats.end();
  stats.begin();
});

const isDev = import.meta.env.DEV;
</script>

<template>
  <div v-if="isDev" ref="statsRoot" class="fps" />
</template>

<style scoped>
.fps {
  position: fixed;
  top: var(--size-2);
  left: var(--size-2);
  transform: translateZ(0);
}
</style>
