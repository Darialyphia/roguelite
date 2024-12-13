<script setup lang="ts">
import UnitOrientation from './UnitOrientation.vue';
import UnitSprite from './UnitSprite.vue';
import UnitShadow from './UnitShadow.vue';
import UnitStatsIndicators from './UnitStatsIndicators.vue';
import UnitPositioner from './UnitPositioner.vue';
import type { UnitViewModel } from '../unit.model';
import UnitVFX from './vfx/UnitVFX.vue';
import { whenever } from '@vueuse/core';
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import { useIsoPoint } from '@/iso/composables/useIsoPoint';
import { useBattleEvent } from '@/pages/battle/battle.store';
import { External, PTransition } from 'vue3-pixi';
import type { Container } from 'pixi.js';
import AlphaTransition from '@/ui/components/AlphaTransition.vue';
import { waitFor } from '@game/shared';
import { GAME_EVENTS } from '@game/engine/src/game/game';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const camera = useIsoCamera();
const { isoPosition } = useIsoPoint({
  position: computed(() => unit.position)
});

const centerCamera = () => {
  const viewport = camera.viewport.value;
  if (!viewport) return;

  const position = {
    x: isoPosition.value.x + camera.offset.value.x,
    y: isoPosition.value.y + camera.offset.value.y
  };

  const isWithinViewport =
    position.x > viewport.left * 1.15 &&
    position.x < viewport.right * 0.85 &&
    position.y > viewport.top * 1.15 &&
    position.y < viewport.bottom * 0.85;

  if (isWithinViewport) return;

  camera.viewport.value?.animate({
    position,
    time: 500,
    ease: 'easeOutSine'
  });
  return waitFor(250);
};
whenever(() => unit.isActive(), centerCamera);

useBattleEvent(GAME_EVENTS.UNIT_BEFORE_ATTACK, async e => {
  if (e.unit.equals(unit.getUnit())) {
    await centerCamera();
  }
});
useBattleEvent(GAME_EVENTS.UNIT_BEFORE_RECEIVE_DAMAGE, async e => {
  if (e.unit.equals(unit.getUnit())) {
    await centerCamera();
  }
});
useBattleEvent(GAME_EVENTS.UNIT_BEFORE_PLAY_CARD, async e => {
  if (e.unit.equals(unit.getUnit())) {
    await centerCamera();
  }
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
        <UnitStatsIndicators :unit="unit" />
      </AlphaTransition>
    </template>
  </UnitPositioner>
</template>
