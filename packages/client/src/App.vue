<script setup lang="ts">
import { Application, External } from 'vue3-pixi';
const viewport = window;
</script>

<template>
  <Application :resize-to="viewport">
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
}
</style>
