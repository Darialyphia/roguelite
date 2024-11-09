<script setup lang="ts">
import { toRefs } from 'vue';
import { useIsoCameraProvider } from '../composables/useIsoCamera';
import { useIsoWorldProvider } from '../composables/useIsoWorld';
import type { Angle } from '../composables/useIso';
import type { Point, Point3D } from '@game/shared';

const props = defineProps<{
  rotationCenter?: Point;
  angle?: Angle;
  tileSize?: Point3D;
}>();

const grid = useIsoWorldProvider(toRefs(props));
useIsoCameraProvider(grid.angle);
defineExpose({ grid });
</script>

<template>
  <container :sortable-children="true">
    <slot />
  </container>
</template>
