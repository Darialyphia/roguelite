<script setup lang="ts">
import { Application, External } from 'vue3-pixi';
import { useAssets } from './shared/composables/useAssets';

const viewport = window;
const { loaded } = useAssets();
</script>

<template>
  <div v-if="!loaded">Loading...</div>
  <Application
    v-else
    :resize-to="viewport"
    :width="viewport.innerWidth"
    :height="viewport.innerHeight"
  >
    <RouterView name="scene" />
    <External>
      <div class="ui">
        <RouterView name="ui" />
      </div>
    </External>
  </Application>
</template>

<style scoped>
.ui {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
