<script setup lang="ts">
import { External } from 'vue3-pixi';
import { useAssets } from './shared/composables/useAssets';
import PixiApp from './PixiApp.vue';

const { loaded } = useAssets();
</script>

<template>
  <div v-if="!loaded">Loading...</div>
  <PixiApp v-else>
    <RouterView name="scene" />
    <External>
      <div class="ui">
        <RouterView name="ui" />
      </div>
    </External>
  </PixiApp>
</template>

<style scoped>
.ui {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
