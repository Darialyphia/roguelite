<script setup lang="ts">
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { createSpritesheetFrameObject } from '@/utils/sprite';
import type { UnitViewModel } from '../unit.model';
import { useBattleEvent } from '@/pages/battle/battle.store';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import type { AnimatedSprite } from 'pixi.js';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const sheet = useSpritesheet<'', 'base'>('general-indicator');
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
  <animated-sprite
    v-if="textures"
    :ref="
      (obj: any) => {
        ui.assignLayer(obj, 'ui');
        if (!obj) return;
        sprite = obj;
      }
    "
    :textures="textures"
    :anchor="0.5"
    event-mode="none"
    playing
    loop
    :x="23"
    :y="-30"
  />
</template>
