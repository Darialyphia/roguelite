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
const lightTint = ref('#FFDD00');
const lightAlpha = ref(40);
const lightColor = computed(
  () => `${lightTint.value}${lightAlpha.value.toString(16)}`
);
const shadowTint = ref(config.AMBIENT_LIGHT_COLOR);
const shadowAlpha = ref(30);
const shadowColor = computed(
  () => `${shadowTint.value}${shadowAlpha.value.toString(16)}`
);

const renderLights = (g: PixiGraphics) => {
  state.value.units.forEach(unit => {
    const pos = isoWorld.toIso(unit.position);
    const coords = {
      x: pos.x + camera.offset.value.x,
      y: pos.y + camera.offset.value.y - 39
    };

    const texture = radialGradient(
      config.AMBIENT_LIGHT_UNIT_SIZE,
      config.AMBIENT_LIGHT_UNIT_SIZE,
      [
        [0, lightColor.value],
        [0.15, lightColor.value],
        [1, 'rgba(0,0,0,0)']
      ]
    );

    g.beginTextureFill({
      texture,
      matrix: new Matrix().translate(
        coords.x + config.AMBIENT_LIGHT_UNIT_SIZE / 2,
        coords.y + config.AMBIENT_LIGHT_UNIT_SIZE / 2
      )
    });
    g.drawCircle(coords.x, coords.y, config.AMBIENT_LIGHT_UNIT_SIZE / 2);
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
      :filters="[getBlendFilter(BLEND_MODES.SOFT_LIGHT)]"
      event-mode="none"
      :x="-camera.offset.value.x"
      :y="-camera.offset.value.y"
      @render="
        g => {
          g.clear();
          g.beginFill(shadowColor);
          g.drawRect(0, 0, worldSize.width, worldSize.height);
          g.endFill();

          renderLights(g);
        }
      "
    />
    <!-- <graphics
      :alpha="alpha"
      :filters="[getBlendFilter(BLEND_MODES.OVERLAY)]"
      event-mode="none"
      :x="-camera.offset.value.x"
      :y="-camera.offset.value.y"
      @render="renderLights"
    /> -->
    <External>
      <div class="c-yellow-3 fixed top-0 right-14 Z-10">
        <div>
          LIGHT
          <input type="color" v-model="lightTint" />
          <input
            type="range"
            v-model.number="lightAlpha"
            min="0"
            max="255"
            step="1"
          />
        </div>
        <div>
          SHADOW
          <input type="color" v-model="shadowTint" />
          <input
            type="range"
            v-model.number="shadowAlpha"
            min="0"
            max="255"
            step="1"
          />
        </div>
      </div>
    </External>
  </container>
</template>

<style scoped lang="postcss"></style>
