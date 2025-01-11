<script setup lang="ts">
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { createSpritesheetFrameObject } from '@/utils/sprite';
import type { UnitViewModel } from '../unit.model';
import { useBattleUiStore } from '@/battle/stores/battle-ui.store';
import type { AnimatedSprite } from 'pixi.js';
import { useBattleEvent } from '@/battle/stores/battle.store';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const sheet = useSpritesheet<'', 'base'>('ap-indicator');
const textures = computed(() => {
  if (!sheet.value) return null;

  return createSpritesheetFrameObject('idle', sheet.value.sheets.base.base);
});

const sprite = ref<AnimatedSprite>();
useBattleEvent('unit.before_destroy', async e => {
  if (!e.unit.equals(unit.getUnit())) return Promise.resolve();
  await gsap.to(sprite.value!, {
    pixi: {
      alpha: 0,
      ease: Power2.easeOut
    },
    duration: 0.8
  });
});

const ui = useBattleUiStore();
</script>

<template>
  <container
    v-if="textures"
    :ref="
      (obj: any) => {
        ui.assignLayer(obj, 'ui');
        if (!obj) return;
        sprite = obj;
      }
    "
  >
    <animated-sprite
      v-for="i in unit.currentAp"
      :textures="textures"
      :anchor="0.5"
      event-mode="none"
      playing
      loop
      :x="-35 + i * 8"
      :y="18"
    />
  </container>
</template>
