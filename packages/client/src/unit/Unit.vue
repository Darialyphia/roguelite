<script setup lang="ts">
import type { UnitViewModel } from '@/pages/battle/battle.store';
import { config } from '@/utils/config';
import AnimatedIsoPoint from '@/iso/components/AnimatedIsoPoint.vue';
import UnitSprite from './UnitSprite.vue';
import UnitShadow from './UnitShadow.vue';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const position = {
  x: config.UNIT_SPRITE_SIZE.width - config.TILE_SPRITE_SIZE.width,
  y: -(
    config.UNIT_SPRITE_SIZE.height -
    config.TILE_SPRITE_SIZE.height +
    config.TILE_SIZE.z
  )
};
</script>

<template>
  <AnimatedIsoPoint :position="unit.position" :z-index-offset="32">
    <container :position="position">
      <UnitShadow :unit="unit" />
      <UnitSprite :unit="unit" />
    </container>
  </AnimatedIsoPoint>
</template>

<style scoped lang="postcss"></style>
