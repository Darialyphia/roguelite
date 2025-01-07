<script setup lang="ts">
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { createSpritesheetFrameObject } from '@/utils/sprite';
import type { UnitViewModel } from '../unit.model';
import { useBattleEvent } from '@/pages/battle/battle.store';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import type { AnimatedSprite } from 'pixi.js';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const sheet = useSpritesheet<'', 'base'>('general-vp-threshold-indicator');
const availableTextures = computed(() => {
  if (!sheet.value) return null;

  return createSpritesheetFrameObject(
    'available',
    sheet.value.sheets.base.base
  );
});
const claimedTextures = computed(() => {
  if (!sheet.value) return null;

  return createSpritesheetFrameObject('claimed', sheet.value.sheets.base.base);
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
  <container v-if="claimedTextures && availableTextures">
    <animated-sprite
      :ref="
        (obj: any) => {
          ui.assignLayer(obj, 'ui');
          if (!obj) return;
          sprite = obj;
        }
      "
      :textures="
        unit.player.acquiredGeneralRewards.half
          ? claimedTextures
          : availableTextures
      "
      :anchor="0.5"
      event-mode="none"
      playing
      loop
      :x="23"
      :y="-12"
    />

    <animated-sprite
      :ref="
        (obj: any) => {
          ui.assignLayer(obj, 'ui');
          if (!obj) return;
          sprite = obj;
        }
      "
      :textures="
        unit.player.acquiredGeneralRewards.full
          ? claimedTextures
          : availableTextures
      "
      :anchor="0.5"
      event-mode="none"
      playing
      loop
      :x="23"
      :y="2"
    />
  </container>
</template>
