<script setup lang="ts">
import { config } from '@/utils/config';
import AnimatedIsoPoint from '@/iso/components/AnimatedIsoPoint.vue';
import type { UnitViewModel } from '../unit.model';
import { useBattleEvent } from '@/pages/battle/battle.store';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const offset = {
  x: -(config.UNIT_SPRITE_SIZE.width - config.TILE_SPRITE_SIZE.width) / 2,
  y: -(config.UNIT_SPRITE_SIZE.height - config.TILE_SPRITE_SIZE.height)
};

useBattleEvent('unit.after_move', e => {
  return new Promise(resolve => {
    if (!e.unit.equals(unit.getUnit())) return resolve();

    gsap.to(unit.position, {
      x: e.position.x,
      y: e.position.y,
      z: e.position.z,
      duration: 0.4,
      ease: Power1.easeIn,
      onComplete: resolve
    });
  });
});
</script>

<template>
  <AnimatedIsoPoint :position="unit.position" :z-index-offset="32">
    <container :position="offset">
      <slot />
    </container>
  </AnimatedIsoPoint>
</template>

<style scoped lang="postcss"></style>
