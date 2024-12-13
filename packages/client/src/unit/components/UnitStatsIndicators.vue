<script setup lang="ts">
import { clamp } from '@game/shared';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { createSpritesheetFrameObject } from '@/utils/sprite';
import type { UnitViewModel } from '../unit.model';
import { useBattleEvent } from '@/pages/battle/battle.store';
import { TextStyle, type AnimatedSprite } from 'pixi.js';
import { SpellCard } from '@game/engine/src/card/spell-card.entity';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const sheet = useSpritesheet<'', 'base'>('unit-stats');
const textures = computed(() => {
  if (!sheet.value) return null;

  return createSpritesheetFrameObject('idle', sheet.value.sheets.base.base);
});

useBattleEvent('unit.after_move', e => {
  return new Promise(resolve => {
    if (!e.unit.equals(unit.getUnit())) return resolve();
    // eslint-disable-next-line vue/no-mutating-props
    unit.currentAp -= e.cost;
    resolve();
  });
});
useBattleEvent('unit.after_attack', e => {
  return new Promise(resolve => {
    if (!e.unit.equals(unit.getUnit())) return resolve();
    // eslint-disable-next-line vue/no-mutating-props
    unit.currentAp -= e.cost;
    resolve();
  });
});
useBattleEvent('unit.after_play_card', e => {
  return new Promise(resolve => {
    if (!e.unit.equals(unit.getUnit())) return resolve();
    if (e.card instanceof SpellCard) {
      // eslint-disable-next-line vue/no-mutating-props
      unit.currentAp -= e.card.cost.ap;
    }
    resolve();
  });
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
    fontSize: 20,
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
    :y="-35"
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
      :y="-2"
      :scale="0.5"
      :anchor="0.5"
    >
      {{ unit.currentHp }}
    </pixi-text>
    <pixi-text
      :style="getTextStyle(0x00bcff)"
      :x="22"
      :y="-2"
      :scale="0.5"
      :anchor="0.5"
    >
      {{ unit.currentAp }}
    </pixi-text>
  </animated-sprite>
</template>
