<script setup lang="ts">
import {
  useBattleStore,
  type UnitViewModel
} from '@/pages/battle/battle.store';
import { config } from '@/utils/config';
import AnimatedIsoPoint from '@/iso/components/AnimatedIsoPoint.vue';
import UnitSprite from './UnitSprite.vue';
import UnitShadow from './UnitShadow.vue';
import { useIsoCamera } from '@/iso/composables/useIsoCamera';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const position = {
  x: -(config.UNIT_SPRITE_SIZE.width - config.TILE_SPRITE_SIZE.width) / 2,
  y: -(config.UNIT_SPRITE_SIZE.height - config.TILE_SPRITE_SIZE.height)
};

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
  <AnimatedIsoPoint :position="unit.position" :z-index-offset="32">
    <container :position="position">
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
    </container>
  </AnimatedIsoPoint>
</template>

<style scoped lang="postcss"></style>
