<script setup lang="ts">
import UnitOrientation from './UnitOrientation.vue';
import UnitSprite from './UnitSprite.vue';
import UnitShadow from './UnitShadow.vue';
import UnitStatBars from './UnitStatBars.vue';
import UnitPositioner from './UnitPositioner.vue';
import type { UnitViewModel } from '../unit.model';
import UnitVFX from './vfx/UnitVFX.vue';
import { whenever } from '@vueuse/core';
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import { useIsoPoint } from '@/iso/composables/useIsoPoint';
import { useBattleEvent } from '@/pages/battle/battle.store';
import { PTransition } from 'vue3-pixi';
import type { Container } from 'pixi.js';
import AlphaTransition from '@/ui/components/AlphaTransition.vue';
import ActiveUnitIndicator from './ActiveUnitIndicator.vue';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const camera = useIsoCamera();
const { isoPosition } = useIsoPoint({
  position: computed(() => unit.position)
});

const centerCamera = () => {
  camera.viewport.value?.animate({
    position: {
      x: isoPosition.value.x + camera.offset.value.x,
      y: isoPosition.value.y + camera.offset.value.y
    },
    time: 250,
    ease: 'easeOutSine'
  });
};
whenever(() => unit.isActive(), centerCamera);

useBattleEvent('unit.before_attack', e => {
  if (e.unit.equals(unit.getUnit())) {
    centerCamera();
  }
  return Promise.resolve();
});
useBattleEvent('unit.before_receive_damage', e => {
  if (e.unit.equals(unit.getUnit())) {
    centerCamera();
  }
  return Promise.resolve();
});
useBattleEvent('unit.before_play_card', e => {
  if (e.unit.equals(unit.getUnit())) {
    centerCamera();
  }
  return Promise.resolve();
});

const isSpawnAnimationDone = ref(false);
const spawnAnimation = (container: Container) => {
  container.y = -100;
  container.alpha = 0;
  gsap.to(container, {
    y: 0,
    duration: 1,
    ease: Bounce.easeOut,
    delay: Math.random() * 0.5,
    onStart() {
      container.alpha = 1;
    },
    onComplete() {
      isSpawnAnimationDone.value = true;
    }
  });
};
</script>

<template>
  <UnitPositioner :unit="unit" bounce>
    <PTransition
      appear
      :duration="{ enter: 1000, leave: 0 }"
      @enter="spawnAnimation"
    >
      <UnitOrientation :unit="unit">
        <UnitShadow :unit="unit" />
        <UnitSprite :unit="unit" />
      </UnitOrientation>
    </PTransition>
    <UnitVFX :unit="unit" />
    <template v-if="isSpawnAnimationDone">
      <AlphaTransition :duration="{ enter: 200, leave: 200 }">
        <UnitStatBars :unit="unit" />
      </AlphaTransition>
    </template>
  </UnitPositioner>
</template>
