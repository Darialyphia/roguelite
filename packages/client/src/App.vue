<script setup lang="ts">
import { External } from 'vue3-pixi';
import { useAssets } from './shared/composables/useAssets';
import PixiApp from './PixiApp.vue';
import { TooltipProvider } from 'radix-vue';

const { loaded } = useAssets();

const uiRoot = document.getElementById('#app');
</script>

<template>
  <div v-if="!loaded">Loading...</div>
  <PixiApp v-else>
    <RouterView name="scene" />
    <External :root="uiRoot!" id="ui-root">
      <TooltipProvider :delay-duration="400">
        <RouterView name="ui" />
      </TooltipProvider>
    </External>
  </PixiApp>
</template>

<style>
#ui-root {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
