<script setup lang="ts">
import { External } from 'vue3-pixi';
import { useAssets } from './shared/composables/useAssets';
import PixiApp from './PixiApp.vue';

const { loaded } = useAssets();

const uiRoot = useTemplateRef('uiRoot');
</script>

<template>
  <div v-if="!loaded">Loading...</div>
  <PixiApp v-else>
    <RouterView name="scene" />
    <External :root="uiRoot!">
      <div class="ui">
        <RouterView name="ui" />
      </div>
    </External>
  </PixiApp>
  <div ref="uiRoot" />
</template>

<style scoped>
.ui {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
