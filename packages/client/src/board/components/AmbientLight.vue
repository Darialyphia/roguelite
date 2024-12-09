<script setup lang="ts">
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import { useIsoWorld } from '@/iso/composables/useIsoWorld';
import { useGameClientState } from '@/pages/battle/battle.store';
import { config } from '@/utils/config';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { radialGradient } from '@/utils/sprite';
import { BLEND_MODES, Graphics as PixiGraphics, Matrix } from 'pixi.js';
import { External } from 'vue3-pixi';
import { getBlendFilter } from '@pixi/picture';

const { worldSize } = defineProps<{
  worldSize: { width: number; height: number };
}>();

const camera = useIsoCamera();
const isoWorld = useIsoWorld();
const ui = useBattleUiStore();
const state = useGameClientState();
const lightTintFirstPass = ref('#FFDD00');
const lightTintSecondPass = ref('#FFDD00');
const lightAlphaFirstPass = ref(127);
const lightAlphaSecondPass = ref(127);
const lightColorFirstPass = computed(
  () =>
    `${lightTintFirstPass.value}${lightAlphaFirstPass.value.toString(16).padStart(2, '0')}`
);
const lightColorSecondPass = computed(
  () =>
    `${lightTintSecondPass.value}${lightAlphaSecondPass.value.toString(16).padStart(2, '0')}`
);
const lightBlendModeFirstPass = ref(BLEND_MODES.ADD);
const lightBlendModeSecondPass = ref(BLEND_MODES.ADD);
const lightSizeFirstPass = ref(config.AMBIENT_LIGHT_UNIT_SIZE);
const lightSizeSecondPass = ref(config.AMBIENT_LIGHT_UNIT_SIZE);
const shadowTint = ref(config.AMBIENT_LIGHT_COLOR);
const shadowAlpha = ref(127);
const shadowColor = computed(
  () => `${shadowTint.value}${shadowAlpha.value.toString(16)}`
);

const renderLights = (g: PixiGraphics, color: string, size: number) => {
  g.clear();
  state.value.units.forEach(unit => {
    const pos = isoWorld.toIso(unit.position);
    const coords = {
      x: pos.x + camera.offset.value.x,
      y: pos.y + camera.offset.value.y - 39
    };

    const texture = radialGradient(size, size, [
      [0, color],
      [0.1, color],
      [1, 'rgba(0,0,0,0)']
    ]);

    g.beginTextureFill({
      texture,
      matrix: new Matrix().translate(coords.x + size / 2, coords.y + size / 2)
    });
    g.drawCircle(coords.x, coords.y, size / 2);
    g.endFill();
  });
};
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
          g.beginFill(shadowColor);
          g.drawRect(0, 0, worldSize.width, worldSize.height);
          g.endFill();
        }
      "
    />
    <graphics
      :filters="
        lightBlendModeFirstPass > BLEND_MODES.SCREEN
          ? [getBlendFilter(BLEND_MODES.OVERLAY)]
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
    />
    <graphics
      :filters="
        lightBlendModeSecondPass > BLEND_MODES.SCREEN
          ? [getBlendFilter(BLEND_MODES.OVERLAY)]
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
    />
    <External>
      <div class="fixed top-0 right-14 Z-10">
        <fieldset>
          <legend>Light</legend>
          <fieldset>
            <legend>First Pass</legend>
            <label>
              Color
              <input type="color" v-model="lightTintFirstPass" />
            </label>

            <label>
              Alpha
              <input
                type="range"
                v-model.number="lightAlphaFirstPass"
                min="0"
                max="255"
                step="1"
              />
            </label>

            <fieldset>
              <legend>Blend mode</legend>
              <label>
                <input
                  type="radio"
                  name="blend-mode"
                  v-model="lightBlendModeFirstPass"
                  :value="BLEND_MODES.ADD"
                />
                Add
              </label>
              <label>
                <input
                  type="radio"
                  name="blend-mode"
                  v-model="lightBlendModeFirstPass"
                  :value="BLEND_MODES.SCREEN"
                />
                Screen
              </label>
              <label>
                <input
                  type="radio"
                  name="blend-mode"
                  v-model="lightBlendModeFirstPass"
                  :value="BLEND_MODES.OVERLAY"
                />
                Overlay
              </label>
              <label>
                <input
                  type="radio"
                  name="blend-mode"
                  v-model="lightBlendModeFirstPass"
                  :value="BLEND_MODES.SOFT_LIGHT"
                />
                Soft Light
              </label>
              <label>
                <input
                  type="radio"
                  name="blend-mode"
                  v-model="lightBlendModeFirstPass"
                  :value="BLEND_MODES.HARD_LIGHT"
                />
                Hard Light
              </label>
            </fieldset>

            <label>
              Size
              <input
                type="range"
                v-model.number="lightSizeFirstPass"
                min="0"
                max="1500"
                step="5"
              />
            </label>
          </fieldset>

          <fieldset>
            <legend>Second Pass</legend>
            <label>
              Color
              <input type="color" v-model="lightTintSecondPass" />
            </label>

            <label>
              Alpha
              <input
                type="range"
                v-model.number="lightAlphaSecondPass"
                min="0"
                max="255"
                step="1"
              />
            </label>

            <fieldset>
              <legend>Blend mode</legend>
              <label>
                <input
                  type="radio"
                  name="blend-mode"
                  v-model="lightBlendModeSecondPass"
                  :value="BLEND_MODES.ADD"
                />
                Add
              </label>
              <label>
                <input
                  type="radio"
                  name="blend-mode"
                  v-model="lightBlendModeSecondPass"
                  :value="BLEND_MODES.SCREEN"
                />
                Screen
              </label>
              <label>
                <input
                  type="radio"
                  name="blend-mode"
                  v-model="lightBlendModeSecondPass"
                  :value="BLEND_MODES.OVERLAY"
                />
                Overlay
              </label>
              <label>
                <input
                  type="radio"
                  name="blend-mode"
                  v-model="lightBlendModeSecondPass"
                  :value="BLEND_MODES.SOFT_LIGHT"
                />
                Soft Light
              </label>
              <label>
                <input
                  type="radio"
                  name="blend-mode"
                  v-model="lightBlendModeSecondPass"
                  :value="BLEND_MODES.HARD_LIGHT"
                />
                Hard Light
              </label>
            </fieldset>

            <label>
              Size
              <input
                type="range"
                v-model.number="lightSizeSecondPass"
                min="0"
                max="1500"
                step="5"
              />
            </label>
          </fieldset>
        </fieldset>
        <fieldset>
          <legend>Shadow</legend>
          <label>
            Color
            <input type="color" v-model="shadowTint" />
          </label>
          <label>
            Alpha
            <input
              type="range"
              v-model.number="shadowAlpha"
              min="0"
              max="255"
              step="1"
            />
          </label>
        </fieldset>
      </div>
    </External>
  </container>
</template>

<style scoped lang="postcss">
fieldset {
  border: solid 1px white;
  color: white;
  padding: 0.5rem;
}

legend {
  font-size: var(--font-size-3);
  font-weight: var(--font-weight-5);
}
</style>
