<script setup lang="ts">
import { providePixiApp } from './shared/composables/usePixiApp';

const canvas = useTemplateRef('canvas');

const { isReady } = providePixiApp(canvas);
</script>

<template>
  <main class="app">
    <canvas ref="canvas" />
    <div class="ui" v-if="isReady">
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
.app {
  height: 100dhv;
  overflow: hidden;
}

.ui {
  position: absolute;
  inset: 0;
}
</style>
