<script setup lang="ts">
import { clamp } from '@game/shared';
import type { UnitViewModel } from '@/pages/battle/battle.store';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { createSpritesheetFrameObject } from '@/utils/sprite';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const sheet = useSpritesheet<'', 'base'>('unit-stat-bars');

const textures = computed(() => {
  if (!sheet.value) return null;

  return createSpritesheetFrameObject(
    `${unit.currentAp}`,
    sheet.value.sheets.base.base
  );
});

const tweenedAp = ref(unit.currentAp);
const tweenedHp = ref(unit.currentHp);

watch(
  () => unit.currentAp,
  newAp => {
    gsap.to(tweenedAp, {
      value: newAp,
      duration: 0.5
    });
  }
);
watch(
  () => unit.currentHp,
  newHp => {
    gsap.to(tweenedHp, {
      value: newHp,
      duration: 0.5
    });
  }
);
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
