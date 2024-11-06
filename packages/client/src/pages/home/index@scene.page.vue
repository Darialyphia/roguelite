<script lang="ts" setup>
import { onTick, useScreen } from 'vue3-pixi';

definePage({
  name: 'Home',
  path: '/'
});
const size = ref(100);
const screen = useScreen();

let count = 0;

onTick(delta => {
  count += delta * 0.025;
  size.value = 60 + Math.sin(count) * 30;
});
</script>

<template>
  <graphics
    :x="screen.width / 2"
    :y="screen.height / 2"
    @render="
      graphics => {
        graphics.clear();
        graphics.beginFill(0xde3249);
        graphics.drawCircle(0, 0, size);
        graphics.endFill();
      }
    "
  />
</template>
