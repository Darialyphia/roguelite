<script setup lang="ts">
import type { Point3D } from '@game/shared';
import { Container } from 'pixi.js';
import { useIsoWorld } from '../composables/useIsoWorld';
import { useIsoPoint } from '../composables/useIsoPoint';

const props = defineProps<{ position: Point3D; zIndexOffset?: number }>();

const { scale } = useIsoWorld();
const { isoPosition, zIndex } = useIsoPoint(toRefs(props));

const containerRef = ref<Container>();

watch(
  [isoPosition, zIndex, containerRef],
  ([pos, z, container], [, , prevContainer]) => {
    if (!container) return;

    gsap.to(container, {
      duration: prevContainer ? 0.7 : 0,
      pixi: {
        x: pos.x,
        y: pos.y,
        zIndex: z
      },
      ease: Power1.easeInOut
    });
  },
  { immediate: true }
);
</script>

<template>
  <container ref="containerRef" :pivot="{ x: scale.x / 2 }">
    <slot :isoPosition="isoPosition" :z-index="zIndex" />
  </container>
</template>

<style scoped lang="postcss"></style>
