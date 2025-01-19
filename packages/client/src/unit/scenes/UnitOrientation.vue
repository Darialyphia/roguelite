<script setup lang="ts">
import type { UnitViewModel } from '../unit.model';
import { useShaker } from '@/shared/composables/vfx/useShaker';
import type { Container } from 'pixi.js';
import { waitFor } from '@game/shared';
import { GAME_EVENTS } from '@game/engine/src/game/game';
import {
  useBattleEvent,
  useGameClientState,
  useVFXEvent
} from '@/battle/stores/battle.store';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const state = useGameClientState();
const scaleX = computed(() => {
  let value = unit.player.equals(state.value.players[1]) ? -1 : 1;

  return value;
});

const container = ref<Container>();
const shaker = useShaker(container);

useBattleEvent(GAME_EVENTS.UNIT_BEFORE_RECEIVE_DAMAGE, async e => {
  if (!e.unit.equals(unit.getUnit())) return;
  const duration = 200;

  shaker.trigger({
    isBidirectional: false,
    shakeAmount: 10,
    shakeDelay: 35,
    shakeCountMax: Math.round(duration / 25)
  });

  await waitFor(duration);
});

useVFXEvent('SHAKE_UNIT', async params => {
  if (!params.unit.equals(unit.getUnit())) return;

  shaker.trigger({
    isBidirectional: params.isBidirectional,
    shakeAmount: params.amplitude,
    shakeDelay: 35,
    shakeCountMax: Math.round(params.duration / 35)
  });
});

useBattleEvent(GAME_EVENTS.UNIT_BEFORE_DESTROY, async e => {
  if (!e.unit.equals(unit.getUnit())) return Promise.resolve();
  await gsap.to(container.value!, {
    pixi: {
      y: 30,
      alpha: 0,
      ease: Power2.easeOut
    },
    duration: 1.2
  });
});
</script>

<template>
  <container :scale-x="scaleX" ref="container" :y="-12">
    <slot />
  </container>
</template>
