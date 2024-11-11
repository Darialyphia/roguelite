<script setup lang="ts">
import { config } from '@/utils/config';
import AnimatedIsoPoint from '@/iso/components/AnimatedIsoPoint.vue';
import type { UnitViewModel } from '../unit.model';
import { useBattleEvent } from '@/pages/battle/battle.store';
import { useIsoWorld } from '@/iso/composables/useIsoWorld';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const offset = {
  x: -(config.UNIT_SPRITE_SIZE.width - config.TILE_SPRITE_SIZE.width) / 2,
  y: -(config.UNIT_SPRITE_SIZE.height - config.TILE_SPRITE_SIZE.height)
};

useBattleEvent('unit.after_move', e => {
  return new Promise(resolve => {
    if (!e.unit.equals(unit.getUnit())) return resolve();

    const start = e.previousPosition;

    const end = e.position;

    const midPoint = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
      z: (start.z + end.z) / 2 + 1.5
    };

    gsap.to(unit.position, {
      motionPath: [start, midPoint, end],
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
