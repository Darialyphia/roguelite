<script lang="ts" setup>
import { useScreen } from 'vue3-pixi';

definePage({
  name: 'Home',
  path: '/'
});
const screen = useScreen();
</script>

<template>
  <graphics
    :x="screen.width / 2"
    :y="screen.height / 2"
    @render="
      graphics => {
        graphics.clear();
        graphics.beginFill(0xde3249);
        graphics.drawCircle(0, 0, 200);
        graphics.endFill();
      }
    "
  />
</template>
