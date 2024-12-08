<script setup lang="ts">
import { clamp } from '@game/shared';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { createSpritesheetFrameObject } from '@/utils/sprite';
import type { UnitViewModel } from '../unit.model';
import { useBattleEvent } from '@/pages/battle/battle.store';
import type { AnimatedSprite } from 'pixi.js';
import { SpellCard } from '@game/engine/src/card/spell-card.entity';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const tweenedAp = ref(unit.currentAp);
const tweenedHp = ref(unit.currentHp);
const roundedTweenedAp = computed(() => Math.floor(tweenedAp.value));

const sheet = useSpritesheet<'', 'base'>('unit-stat-bars');
const textures = computed(() => {
  if (!sheet.value) return null;

  return createSpritesheetFrameObject(
    `${roundedTweenedAp.value}`,
    sheet.value.sheets.base.base
  );
});

const animateAp = (newVal: number) => {
  gsap.killTweensOf(tweenedAp);
  gsap.to(tweenedAp, {
    value: newVal,
    duration: 0.4
  });
};
const animateHp = (newVal: number) => {
  gsap.killTweensOf(tweenedHp);
  gsap.to(tweenedHp, {
    value: newVal,
    duration: 0.4
  });
};

watch(() => unit.currentAp, animateAp);
watch(() => unit.currentHp, animateHp);

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
    :y="-55"
  >
    <pixi-graphics
      :x="-sheet.meta.size.w / 2"
      :y="-12"
      v-if="sheet"
      @render="
        g => {
          const slices = [
            [
              sheet!.meta.slices?.find(slice => slice.name === 'ap'),
              tweenedAp,
              unit.maxAp
            ] as const,
            [
              sheet!.meta.slices?.find(slice => slice.name === 'hp'),
              tweenedHp,
              unit.maxHp
            ] as const
          ];
          g.clear();
          g.beginFill(0x665555);
          slices.forEach(([slice, stat, max]) => {
            if (!slice) return;
            const { bounds } = slice.keys[0];
            const xOffset = clamp(
              Math.round(bounds.w * (stat / max)),
              0,
              bounds.w
            );
            g.drawRect(
              bounds.x + xOffset,
              bounds.y,
              bounds.w - xOffset,
              bounds.h
            );
          });

          g.endFill();
        }
      "
    />
  </animated-sprite>
</template>
