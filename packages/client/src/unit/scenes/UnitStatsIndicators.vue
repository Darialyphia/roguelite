<script setup lang="ts">
import { clamp } from '@game/shared';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { createSpritesheetFrameObject } from '@/utils/sprite';
import type { UnitViewModel } from '../unit.model';
import { TextStyle, type AnimatedSprite } from 'pixi.js';
import { useBattleUiStore } from '@/battle/stores/battle-ui.store';
import { GAME_EVENTS } from '@game/engine/src/game/game';
import { useBattleEvent } from '@/battle/stores/battle.store';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const sheet = useSpritesheet<'', 'base'>('unit-stats');
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

const getTextStyle = (color: number) => {
  return new TextStyle({
    fontSize: 18,
    fill: color,
    fontFamily: 'SilkScreen',
    align: 'center'
  });
};
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
    :y="25"
  >
    <pixi-text
      :style="getTextStyle(0xff0000)"
      :x="-22"
      :y="-2"
      :scale="0.5"
      :anchor="0.5"
    >
      {{ unit.atk }}
    </pixi-text>
    <pixi-text
      :style="getTextStyle(0x84f200)"
      :x="22"
      :y="-2"
      :scale="0.5"
      :anchor="0.5"
    >
      {{ unit.currentHp }}
    </pixi-text>
  </animated-sprite>
</template>
