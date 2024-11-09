<script setup lang="ts">
import { toRefs } from 'vue';
import { useIsoCameraProvider } from '../composables/useIsoCamera';
import { useIsoWorldProvider } from '../composables/useIsoWorld';
import type { Angle } from '../composables/useIso';
import type { Point3D } from '@game/shared';

const props = defineProps<{
  width: number;
  height: number;
  angle?: Angle;
  tileSize?: Point3D;
}>();

const grid = useIsoWorldProvider(toRefs(props));
const camera = useIsoCameraProvider(grid.angle);
defineExpose({ grid, camera });
</script>

<template>
  <container :sortable-children="true">
    <slot />
  </container>
</template>
