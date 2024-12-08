<script setup lang="ts">
import { PTransition } from 'vue3-pixi';
const { duration } = defineProps<{
  duration: { enter: number; leave: number };
}>();
</script>

<template>
  <PTransition
    appear
    :duration
    :before-enter="{ alpha: 0 }"
    :enter="{ alpha: 1 }"
    :leave="{ alpha: 0 }"
  >
    <slot />
  </PTransition>
</template>

<style scoped lang="postcss"></style>
