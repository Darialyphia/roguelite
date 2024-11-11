<script setup lang="ts">
import { useBattleEvent, useBattleStore } from '@/pages/battle/battle.store';
import { config } from '@/utils/config';
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

const offsetX = computed(() =>
  scaleX.value === -1 ? config.TILE_SIZE.x * 1.5 : 0
);

const container = ref<Container>();
const shaker = useShaker(container);

useBattleEvent('unit.before_receive_damage', async e => {
  if (!e.unit.equals(unit.getUnit())) return;
  const duration = 150;

  shaker.trigger({
    isBidirectional: false,
    shakeAmount: 10,
    shakeDelay: 25,
    shakeCountMax: Math.round(duration / 25)
  });

  await waitFor(duration);
});
</script>

<template>
  <container ref="container">
    <container :scale-x="scaleX" :x="offsetX">
      <slot />
    </container>
  </container>
</template>
