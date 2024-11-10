<script setup lang="ts">
import { Container } from 'pixi.js';
import { toRefs } from 'vue';
import { useIsoWorld } from '../composables/useIsoWorld';
import { useIsoPoint } from '../composables/useIsoPoint';
import type { Point3D } from '@game/shared';

const props = defineProps<{
  position: Point3D;
  zIndexOffset?: number;
}>();

const { scale } = useIsoWorld();
const { isoPosition, zIndex } = useIsoPoint(toRefs(props));
</script>

<template>
  <container
    :position="isoPosition"
    :z-index="zIndex"
    :pivot="{ x: 0, y: scale.z }"
  >
    <slot :isoPosition="isoPosition" :z-index="zIndex" />
  </container>
</template>

<style scoped lang="postcss"></style>
