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

const onEnter = (container: Container) => {
  const target = {
    x: 30 + randomInt(30),
    y: -1 * (20 + randomInt(30))
  };
  gsap.to(container.position, {
    motionPath: [
      { x: 0, y: 0 },
      { x: (target.x / 2) * direction, y: target.y },
      { x: target.x * direction, y: target.y / 2 }
    ],
    duration: 0.7,
    ease: Power2.easeOut
  });
};
</script>

<template>
  <PTransition
    @enter="onEnter"
    :duration="{ enter: 700, leave: 200 }"
    :leave="{ alpha: 0 }"
  >
    <pixi-text
      v-if="damageAmount"
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
