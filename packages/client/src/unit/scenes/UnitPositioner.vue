<script setup lang="ts">
import { config } from '@/utils/config';
import type { UnitViewModel } from '../unit.model';
import {
  useBattleEvent,
  useGameClientState
} from '@/pages/battle/battle.store';
import { clamp, type Point3D } from '@game/shared';
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

  const start = state.value.cells.find(c =>
    c.getCell().position.equals(e.unit.position)
  )!.screenPosition;
  const end = state.value.cells.find(c =>
    c.getCell().position.equals(e.target)
  )!.screenPosition;

  const impactPoint = {
    x:
      start.x +
      clamp((end.x - start.x) * 0.55, -config.TILE_SIZE.x, config.TILE_SIZE.x),
    y:
      start.y +
      clamp((end.y - start.y) * 0.55, -config.TILE_SIZE.y, config.TILE_SIZE.y)
  };
  const anticipation = {
    x: start.x - (end.x - start.x) * 0.2,
    y: start.y - (end.y - start.y) * 0.2
  };
  const tl = gsap.timeline();

  tl.to(unit.screenPosition, {
    ...anticipation,
    duration: 0.15
  })
    .to(unit.screenPosition, {
      ...impactPoint,
      duration: 0.05,
      ease: Power1.easeIn
    })

    .to(unit.screenPosition, {
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
    :z-order="unit.screenPosition.y + 1"
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
