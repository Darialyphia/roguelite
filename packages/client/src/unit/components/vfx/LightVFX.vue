<script setup lang="ts">
import { waitFor, type BetterOmit, type Point } from '@game/shared';
import { BLEND_MODES, Matrix, Graphics as PixiGraphics } from 'pixi.js';
import { PTransitionGroup } from 'vue3-pixi';
import { radialGradient } from '@/utils/sprite';
import { config } from '@/utils/config';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { useIsoWorld } from '@/iso/composables/useIsoWorld';
import type { UnitViewModel } from '@/unit/unit.model';
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import { getBlendFilter } from '@pixi/picture';
import PointLight from '@/vfx/PointLight.vue';
import type { PointLightConfig } from '@/vfx/usePointLight';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const ui = useBattleUiStore();

const firstPass = ref<PointLightConfig>({
  group: unit.id,
  blendMode: BLEND_MODES.SCREEN,
  position: { x: 0, y: 0 },
  radius: 150,
  colorStops: [
    [0, '#ff000033'],
    [0.33, '#ffff0033'],
    [0.6, 'rgba(0,0,0,0)']
  ]
});

const secondPass = ref<PointLightConfig>({
  group: unit.id,
  blendMode: BLEND_MODES.ADD,
  position: { x: 0, y: 0 },
  radius: 500,
  colorStops: [
    [0, '#b5a77488'],
    [1, 'rgba(0,0,0,0)']
  ]
});
</script>

<template>
  <container
    :ref="(container: any) => ui.assignLayer(container, 'fx')"
    :sortable-children="true"
    event-mode="none"
  >
    <PointLight :light="firstPass" />
    <PointLight :light="secondPass" />
  </container>
</template>
