<script setup lang="ts">
import { useBattleEvent, useBattleStore } from '@/pages/battle/battle.store';
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import type { UnitViewModel } from '../unit.model';
import { useShaker } from '@/shared/composables/vfx/useShaker';
import type { Container } from 'pixi.js';
import { waitFor } from '@game/shared';

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

const container = ref<Container>();
const shaker = useShaker(container);

useBattleEvent('unit.before_receive_damage', async e => {
  if (!e.unit.equals(unit.getUnit())) return;
  const duration = 250;

  shaker.trigger({
    isBidirectional: false,
    shakeAmount: 10,
    shakeDelay: 35,
    shakeCountMax: Math.round(duration / 25)
  });

  await waitFor(duration);
});
</script>

<template>
  <container :scale-x="scaleX" ref="container">
    <slot />
  </container>
</template>
