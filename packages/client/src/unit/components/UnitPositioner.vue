<script setup lang="ts">
import { config } from '@/utils/config';
import type { UnitViewModel } from '../unit.model';
import {
  useBattleEvent,
  useGameClientState
} from '@/pages/battle/battle.store';
import { type Point3D } from '@game/shared';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import type { Unit } from '@game/engine/src/unit/unit.entity';
import { GAME_EVENTS } from '@game/engine/src/game/game';

const { unit, bounce } = defineProps<{
  unit: UnitViewModel;
  bounce?: boolean;
}>();

const offset = {
  x: 0,
  y: -24
};
const state = useGameClientState();
useBattleEvent(GAME_EVENTS.UNIT_AFTER_MOVE, e => {
  return new Promise(resolve => {
    if (!e.unit.equals(unit.getUnit())) return resolve();

    const start = state.value.cells.find(c =>
      c.getCell().position.equals(e.previousPosition)
    )!.screenPosition;
    const end = state.value.cells.find(c =>
      c.getCell().position.equals(e.position)
    )!.screenPosition;

    const midPoint = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2 - (bounce ? config.MOVEMENT_BOUNCE_HEIGHT : 0)
    };

    gsap.to(unit.screenPosition, {
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
useBattleEvent(GAME_EVENTS.UNIT_BEFORE_ATTACK, attackAnimation);
useBattleEvent(GAME_EVENTS.UNIT_BEFORE_COUNTERATTACK, attackAnimation);

const ui = useBattleUiStore();
</script>

<template>
  <container
    :x="unit.screenPosition.x"
    :y="unit.screenPosition.y"
    :z-index="unit.screenPosition.y + 1"
  >
    <container
      :position="offset"
      :ref="(container: any) => ui.assignLayer(container, 'scene')"
    >
      <slot />
    </container>
  </container>
</template>

<style scoped lang="postcss"></style>
