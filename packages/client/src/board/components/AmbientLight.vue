<script setup lang="ts">
import { useVFXEvent } from '@/pages/battle/battle.store';
import { config } from '@/utils/config';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { BLEND_MODES, Graphics as PixiGraphics, Matrix } from 'pixi.js';
import { waitFor } from '@game/shared';
import { useCamera } from '../composables/useCamera';

const { worldSize } = defineProps<{
  worldSize: { width: number; height: number };
}>();

const camera = useCamera();
const ui = useBattleUiStore();
// const lightTintFirstPass = ref('#FFDD00');
// const lightTintSecondPass = ref('#FFDD00');
// const lightAlphaFirstPass = ref(127);
// const lightAlphaSecondPass = ref(127);
// const lightColorFirstPass = computed(
//   () =>
//     `${lightTintFirstPass.value}${lightAlphaFirstPass.value.toString(16).padStart(2, '0')}`
// );
// const lightColorSecondPass = computed(
//   () =>
//     `${lightTintSecondPass.value}${lightAlphaSecondPass.value.toString(16).padStart(2, '0')}`
// );
// const lightBlendModeFirstPass = ref(BLEND_MODES.ADD);
// const lightBlendModeSecondPass = ref(BLEND_MODES.ADD);
// const lightSizeFirstPass = ref(config.AMBIENT_LIGHT_UNIT_SIZE);
// const lightSizeSecondPass = ref(config.AMBIENT_LIGHT_UNIT_SIZE);
const color = ref(config.AMBIENT_LIGHT_COLOR);
const blendMode = ref(config.AMBIENT_LIGHT_BLEND_MODE);

useVFXEvent('TINT_SCREEN', async params => {
  blendMode.value = params.blendMode;

  for (const step of params.steps) {
    await gsap.to(color, {
      value: step.color,
      duration: step.transitionDuration / 1000
    });
    await waitFor(step.duration);
  }

  await gsap.to(color, {
    value: config.AMBIENT_LIGHT_COLOR,
    duration: params.endTransitionDuration / 1000
  });
  blendMode.value = config.AMBIENT_LIGHT_BLEND_MODE;
});
// const renderLights = (g: PixiGraphics, color: string, size: number) => {
//   g.clear();
//   state.value.units.forEach(unit => {
//     const pos = isoWorld.toIso(unit.position);
//     const coords = {
//       x: pos.x + camera.offset.value.x,
//       y: pos.y + camera.offset.value.y - 39
//     };

//     const texture = radialGradient(size, size, [
//       [0, color],
//       [0.1, color],
//       [0.8, 'rgba(0,0,0,0)']
//     ]);

//     g.beginTextureFill({
//       texture,
//       matrix: new Matrix().translate(coords.x + size / 2, coords.y + size / 2)
//     });
//     g.drawCircle(coords.x, coords.y, size / 2);
//     g.endFill();
//   });
// };
</script>

<template>
  <container
    :ref="(container: any) => ui.assignLayer(container, 'scene')"
    :z-order="9999"
    :z-index="9999"
  >
    <graphics
      :blend-mode="BLEND_MODES.MULTIPLY"
      event-mode="none"
      :x="-camera.offset.value.x"
      :y="-camera.offset.value.y"
      @render="
        g => {
          g.clear();
          g.beginFill(color);
          g.drawRect(0, 0, worldSize.width, worldSize.height);
          g.endFill();
        }
      "
    />
    <!-- <graphics
      :filters="
        lightBlendModeFirstPass > BLEND_MODES.SCREEN
          ? [getBlendFilter(lightBlendModeFirstPass)]
          : []
      "
      :blend-mode="
        lightBlendModeFirstPass <= BLEND_MODES.SCREEN
          ? lightBlendModeFirstPass
          : BLEND_MODES.NORMAL
      "
      event-mode="none"
      :x="-camera.offset.value.x"
      :y="-camera.offset.value.y"
      @render="g => renderLights(g, lightColorFirstPass, lightSizeFirstPass)"
    /> -->
    <!-- <graphics
      :filters="
        lightBlendModeSecondPass > BLEND_MODES.SCREEN
          ? [getBlendFilter(lightBlendModeSecondPass)]
          : []
      "
      :blend-mode="
        lightBlendModeSecondPass <= BLEND_MODES.SCREEN
          ? lightBlendModeSecondPass
          : BLEND_MODES.NORMAL
      "
      event-mode="none"
      :x="-camera.offset.value.x"
      :y="-camera.offset.value.y"
      @render="g => renderLights(g, lightColorSecondPass, lightSizeSecondPass)"
    /> -->
  </container>
</template>

<style scoped lang="postcss">
fieldset {
  border: solid 1px white;
  color: white;
  padding: 0.5rem;
  font-size: var(--font-size-00);
}

legend {
  font-size: var(--font-size-1);
  font-weight: var(--font-weight-5);
}
</style>
