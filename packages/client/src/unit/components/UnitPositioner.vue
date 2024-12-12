<script setup lang="ts">
import { config } from '@/utils/config';
import AnimatedIsoPoint from '@/iso/components/AnimatedIsoPoint.vue';
import type { UnitViewModel } from '../unit.model';
import { useBattleEvent } from '@/pages/battle/battle.store';
import { waitFor, type Point3D } from '@game/shared';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import type { Unit } from '@game/engine/src/unit/unit.entity';

const { unit, bounce } = defineProps<{
  unit: UnitViewModel;
  bounce?: boolean;
}>();

const offset = {
  x: 0,
  y: -24
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

const attackAnimation = async (e: { unit: Unit; target: Point3D }) => {
  if (!e.unit.equals(unit.getUnit())) return;

  const start = e.unit.position;
  const end = e.target;
  const impactPoint = {
    x: start.x + (end.x - start.x) * 0.55,
    y: start.y + (end.y - start.y) * 0.55,
    z: start.z + (end.z - start.z) * 0.55
  };
  const anticipation = {
    x: start.x - (end.x - start.x) * 0.2,
    y: start.y - (end.y - start.y) * 0.2,
    z: start.z - (end.z - start.z) * 0.2
  };
  const tl = gsap.timeline();

  tl.to(unit.position, {
    ...anticipation,
    duration: 0.15
  })
    .to(unit.position, {
      ...impactPoint,
      duration: 0.05,
      ease: Power1.easeIn
    })

    .to(unit.position, {
      ...start,
      duration: 0.1
    });
  await tl.play();
};
useBattleEvent('unit.before_attack', attackAnimation);
useBattleEvent('unit.before_counterattack', attackAnimation);

const ui = useBattleUiStore();
</script>

<template>
  <AnimatedIsoPoint :position="unit.position" :z-index-offset="32">
    <container
      :position="offset"
      :ref="(container: any) => ui.assignLayer(container, 'scene')"
    >
      <slot />
    </container>
  </AnimatedIsoPoint>
</template>

<style scoped lang="postcss"></style>
