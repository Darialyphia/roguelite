<script setup lang="ts">
import {
  BLEND_MODES,
  Matrix,
  Graphics as PixiGraphics,
  Container as PixiContainer
} from 'pixi.js';
import { radialGradient } from '@/utils/sprite';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import { getBlendFilter } from '@pixi/picture';
import { usePointLights, type PointLightConfig } from './usePointLight';
import { until } from '@vueuse/core';

const { light } = defineProps<{ light: PointLightConfig }>();

const camera = useIsoCamera();
const ui = useBattleUiStore();
const { registerLight } = usePointLights();
const renderLight = (g: PixiGraphics) => {
  g.clear();

  const coords = {
    x: camera.offset.value.x + light.position.x,
    y: camera.offset.value.y + light.position.y
  };

  const texture = radialGradient(
    light.radius * 2,
    light.radius * 2,
    light.colorStops
  );

  g.beginTextureFill({
    texture,
    matrix: new Matrix().translate(
      coords.x + light.radius,
      coords.y + light.radius
    )
  });
  g.drawCircle(coords.x, coords.y, light.radius);
  g.endFill();
};

const containerRef = ref<PixiContainer>();
let unsub: () => void = () => {};
until(containerRef)
  .toBeTruthy()
  .then(container => {
    unsub = registerLight(Object.assign(light, { root: container }));
  });
onBeforeUnmount(() => {
  unsub();
});
</script>

<template>
  <container
    :ref="
      (container: any) => {
        ui.assignLayer(container, 'fx');
        containerRef = container;
      }
    "
    :sortable-children="true"
    event-mode="none"
  >
    <graphics
      :filters="
        light.blendMode > BLEND_MODES.SCREEN
          ? [getBlendFilter(light.blendMode)]
          : []
      "
      :blend-mode="
        light.blendMode <= BLEND_MODES.SCREEN
          ? light.blendMode
          : BLEND_MODES.NORMAL
      "
      event-mode="none"
      :x="-camera.offset.value.x"
      :y="-camera.offset.value.y"
      @render="g => renderLight(g)"
    />
  </container>
</template>
