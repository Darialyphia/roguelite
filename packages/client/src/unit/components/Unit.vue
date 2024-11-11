<script setup lang="ts">
import { useBattleStore } from '@/pages/battle/battle.store';
import { config } from '@/utils/config';
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import UnitSprite from './UnitSprite.vue';
import UnitShadow from './UnitShadow.vue';
import UnitStatBars from './UnitStatBars.vue';
import type { UnitViewModel } from '../unit.model';
import UnitPositioner from './UnitPositioner.vue';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const battleStore = useBattleStore();
const camera = useIsoCamera();

const scaleX = computed(() => {
  let value = unit
    .getUnit()
    .player.isEnemy(battleStore.state.userPlayer.getPlayer())
    ? -1
    : 1;
  if (camera.angle.value === 90 || camera.angle.value === 180) {
    value *= -1;
  }

  return value;
});
</script>

<template>
  <UnitPositioner :unit="unit">
    <container
      :scale-x="scaleX"
      :x="scaleX === -1 ? config.TILE_SIZE.x * 1.5 : 0"
    >
      <!-- <Graphics
        :alpha="0.25"
        @render="
          g => {
            g.clear();
            g.beginFill('blue');
            g.drawRect(
              0,
              0,
              config.UNIT_SPRITE_SIZE.width,
              config.UNIT_SPRITE_SIZE.height
            );
          }
        "
      /> -->
      <UnitShadow :unit="unit" />
      <UnitSprite :unit="unit" />
    </container>

    <UnitStatBars :unit="unit" :x="config.TILE_SIZE.x / 3" />
  </UnitPositioner>
</template>

<style scoped lang="postcss"></style>
