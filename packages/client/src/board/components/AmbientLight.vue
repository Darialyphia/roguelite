<script setup lang="ts">
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import { useIsoWorld } from '@/iso/composables/useIsoWorld';
import { useGameClientState } from '@/pages/battle/battle.store';
import { BLEND_MODES, Matrix } from 'pixi.js';
import { config } from '@/utils/config';
import { radialGradient } from '@/utils/sprite';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';

const { worldSize } = defineProps<{
  worldSize: { width: number; height: number };
}>();

const camera = useIsoCamera();

const state = useGameClientState();
const isoWorld = useIsoWorld();
const ui = useBattleUiStore();
</script>

<template>
  <graphics
    :ref="(container: any) => ui.assignLayer(container, 'scene')"
    :alpha="config.AMBIENT_LIGHT_ALPHA"
    :blend-mode="config.AMBIENT_LIGHT_BLEND_MODE"
    event-mode="none"
    :x="-camera.offset.value.x"
    :y="-camera.offset.value.y"
    :z-order="9999"
    @render="
      g => {
        g.clear();
        g.beginFill(config.AMBIENT_LIGHT_COLOR);
        g.drawRect(0, 0, worldSize.width, worldSize.height);
        g.endFill();
        state.units.forEach(unit => {
          const pos = isoWorld.toIso(unit.position);
          const coords = {
            x: pos.x + camera.offset.value.x,
            y: pos.y + camera.offset.value.y - 39
          };
          g.beginHole();
          g.drawCircle(coords.x, coords.y, config.AMBIENT_LIGHT_UNIT_SIZE / 2);

          g.endHole();
        });
        // state.units.forEach(unit => {
        //   const pos = isoWorld.toIso(unit.position);
        //   const coords = {
        //     x: pos.x + camera.offset.value.x,
        //     y: pos.y + camera.offset.value.y - 35
        //   };
        //   const texture = radialGradient(UNIT_LIGHT_SIZE, UNIT_LIGHT_SIZE, [
        //     [0, 'rgba(255,255,100,0)'],
        //     [0.9, '#01015f']
        //   ]);
        //   g.beginTextureFill({
        //     texture,
        //     matrix: new Matrix().translate(
        //       coords.x - UNIT_LIGHT_SIZE / 2,
        //       coords.y - UNIT_LIGHT_SIZE / 2
        //     )
        //   });

        //   g.drawCircle(coords.x, coords.y, UNIT_LIGHT_SIZE / 2);
        //   g.endFill();
        // });
      }
    "
  />
</template>

<style scoped lang="postcss"></style>
