<script setup lang="ts">
import { clamp } from '@game/shared';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { createSpritesheetFrameObject } from '@/utils/sprite';
import type { UnitViewModel } from '../unit.model';
import { useBattleEvent } from '@/pages/battle/battle.store';

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
</script>

<template>
  <container event-mode="none">
    <animated-sprite v-if="textures" :textures="textures" playing loop />

    <pixi-graphics
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
  </container>
</template>
