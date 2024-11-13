<script setup lang="ts">
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import { useBattleEvent } from '@/pages/battle/battle.store';
import type { UnitViewModel } from '@/unit/unit.model';
import { randomInt } from '@game/shared';
import { Container } from 'pixi.js';
import { PTransition } from 'vue3-pixi';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const damageAmount = ref(0);
let direction = 1;

const camera = useIsoCamera();
useBattleEvent('unit.before_receive_damage', e => {
  if (!e.unit.equals(unit.getUnit())) return Promise.resolve();
  damageAmount.value = e.damage.getMitigatedAmount(unit.getUnit());

  direction = e.from.position.x < e.unit.position.x ? 1 : -1;
  if (camera.angle.value === 90 || camera.angle.value === 180) {
    direction *= -1;
  }

  setTimeout(() => {
    damageAmount.value = 0;
  }, 1200);

  return Promise.resolve();
});

const offset = {
  x: 0,
  y: -50
};
const onEnter = (container: Container) => {
  const target = {
    x: 30 + randomInt(30),
    y: -1 * (30 + randomInt(30))
  };
  gsap.to(container.position, {
    motionPath: [
      { x: offset.x + 0, y: offset.y + 0 },
      { x: offset.x + (target.x / 2) * direction, y: offset.y + target.y },
      { x: offset.x + target.x * direction, y: offset.y + target.y * 0.25 }
    ],
    duration: 0.7,
    ease: Power3.easeOut
  });
};
</script>

<template>
  <PTransition
    @enter="onEnter"
    :duration="{ enter: 0, leave: 200 }"
    :leave="{ alpha: 0 }"
  >
    <pixi-text
      v-if="damageAmount"
      v-bind="offset"
      :style="{
        fontFamily: 'Silkscreen',
        align: 'center',
        fill: '#ff0000',
        fontSize: 60,
        fontWeight: '900',
        strokeThickness: 8
      }"
      :scale="0.25"
      :anchor="0.5"
    >
      {{ damageAmount }}
    </pixi-text>
  </PTransition>
</template>
