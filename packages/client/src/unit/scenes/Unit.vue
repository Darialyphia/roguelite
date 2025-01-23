<script setup lang="ts">
import UnitOrientation from './UnitOrientation.vue';
import UnitSprite from './UnitSprite.vue';
import UnitShadow from './UnitShadow.vue';
import UnitStatsIndicators from './UnitStatsIndicators.vue';
import UnitPositioner from './UnitPositioner.vue';
import type { UnitViewModel } from '../unit.model';
import UnitVFX from './vfx/UnitVFX.vue';

import { PTransition } from 'vue3-pixi';
import type { Container } from 'pixi.js';
import AlphaTransition from '@/ui/scenes/AlphaTransition.vue';
import { waitFor } from '@game/shared';
import { GAME_EVENTS } from '@game/engine/src/game/game';
import { useCamera } from '@/board/composables/useCamera';
import UnitResourceIndicator from './UnitResourceIndicator.vue';
import UnitModifierSprite from './UnitModifierSprite.vue';
import { useBattleEvent, useUserPlayer } from '@/battle/stores/battle.store';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const camera = useCamera();

const centerCamera = () => {
  const viewport = camera.viewport.value;
  if (!viewport) return;

  const position = {
    x: unit.screenPosition.x + camera.offset.value.x,
    y: unit.screenPosition.y + camera.offset.value.y
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

const isSpawnAnimationDone = ref(false);
const spawnAnimation = (container: Container) => {
  container.y = -40;
  container.alpha = 0;
  gsap.to(container, { alpha: 1, duration: 0.3 });
  gsap.to(container, {
    y: -12,
    duration: 1,
    ease: Bounce.easeOut,
    onComplete() {
      isSpawnAnimationDone.value = true;
    }
  });
};

const player = useUserPlayer();
</script>

<template>
  <UnitPositioner :unit="unit" bounce>
    <PTransition
      appear
      :duration="{ enter: 1000, leave: 0 }"
      @enter="spawnAnimation"
    >
      <UnitOrientation :unit="unit">
        <sprite
          v-if="isSpawnAnimationDone"
          event-mode="none"
          :anchor="0.5"
          :y="28"
          :texture="
            player.equals(unit.player)
              ? '/assets/ui/ally-indicator.png'
              : '/assets/ui/enemy-indicator.png'
          "
        />
        <UnitShadow :unit="unit" />
        <UnitSprite :unit="unit" />
      </UnitOrientation>
    </PTransition>
    <UnitVFX :unit="unit" />

    <AlphaTransition
      :duration="{ enter: 200, leave: 200 }"
      v-if="isSpawnAnimationDone"
    >
      <container>
        <UnitStatsIndicators
          :unit="unit"
          v-if="!unit.isAltar || !unit.isDead"
        />
        <UnitResourceIndicator v-if="unit.isAltar" :unit="unit" />
        <UnitModifierSprite
          v-for="(modifier, index) in unit.modifiers"
          :unit="unit"
          :key="modifier.id"
          :modifier="modifier"
          :index="index"
        />
      </container>
    </AlphaTransition>
  </UnitPositioner>
</template>
