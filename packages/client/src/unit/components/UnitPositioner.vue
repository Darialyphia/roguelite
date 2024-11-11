<script setup lang="ts">
import { config } from '@/utils/config';
import AnimatedIsoPoint from '@/iso/components/AnimatedIsoPoint.vue';
import type { UnitViewModel } from '../unit.model';
import { useBattleEvent } from '@/pages/battle/battle.store';

const { unit, bounce } = defineProps<{
  unit: UnitViewModel;
  bounce?: boolean;
}>();

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
      z: (start.z + end.z) / 2 + (bounce ? config.MOVEMENT_BOUNCE_HEIGHT : 0)
    };

    gsap.to(unit.position, {
      motionPath: [start, midPoint, end],
      duration: config.MOVEMENT_SPEED_PER_TILE,
      onComplete: resolve
    });
  });
});

useBattleEvent('unit.before_attack', e => {
  return new Promise(resolve => {
    if (!e.unit.equals(unit.getUnit())) return resolve();

    const start = e.unit.position;
    const end = e.target;
    const impactPoint = {
      x: (start.x + end.x) * 0.55,
      y: (start.y + end.y) * 0.55,
      z: (start.z + end.z) * 0.55
    };
    const recoilPoint = {
      x: start.x - end.x * 0.05,
      y: start.y - end.y * 0.05,
      z: start.z - end.z * 0.05
    };
    const tl = gsap.timeline();

    tl.to(unit.position, {
      ...impactPoint,
      duration: 0.05
    })
      .to(unit.position, {
        ...recoilPoint,
        duration: 0.15,
        onComplete: resolve
      })
      .to(unit.position, {
        ...start,
        duration: 0.1,
        ease: Power1.easeOut
      });
    tl.play();
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
