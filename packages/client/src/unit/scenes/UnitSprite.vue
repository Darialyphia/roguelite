<script setup lang="ts">
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { UI_MODES, useBattleUiStore } from '@/battle/stores/battle-ui.store';
import { OutlineFilter } from '@pixi/filter-outline';
import { type Filter } from 'pixi.js';
import type { UnitViewModel } from '../unit.model';
import { ColorOverlayFilter } from '@pixi/filter-color-overlay';
import { AdjustmentFilter } from '@pixi/filter-adjustment';
import { createSpritesheetFrameObject } from '@/utils/sprite';
import { useCamera } from '@/board/composables/useCamera';
import { usePathHelpers } from '@/battle/stores/battle.store';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const sheet = useSpritesheet<'', 'base' | 'destroyed'>(() => unit.spriteId);
const textures = computed(() => {
  if (!sheet.value) return null;
  return createSpritesheetFrameObject(
    'idle',
    unit.isAltar && unit.isDead
      ? sheet.value.sheets.base.destroyed
      : sheet.value.sheets.base.base
  );
});

const ui = useBattleUiStore();
const camera = useCamera();
const selectedFilter = new OutlineFilter(
  camera.viewport.value!.scale.x,
  0xffffff
);
camera.viewport.value?.on('zoomed-end', () => {
  selectedFilter.thickness = Math.round(camera.viewport.value!.scale.x);
});
const inAoeFilter = new ColorOverlayFilter(0xff0000, 0.3);
const exhaustedFilter = new AdjustmentFilter({
  saturation: 0.25,
  brightness: 0.85
});

const isInCardAoe = computed(() => {
  if (!ui.selectedCard) return false;
  if (!ui.hoveredCell) return false;
  const targets = [...ui.cardTargets, ui.hoveredCell];
  const aoe = ui.selectedCard.getAoe(targets);
  if (!aoe) return false;
  return aoe?.getUnits(targets).some(u => u.equals(unit.getUnit()));
});

const isInAttackAoe = computed(() => {
  if (ui.mode !== UI_MODES.BASIC) return false;
  if (!ui.selectedUnit) return false;
  if (!ui.hoveredCell) return false;

  return (
    ui.selectedUnit.canAttackAt(ui.hoveredCell) &&
    ui.selectedUnit
      .getUnit()
      .attackAOEShape.getUnits([ui.hoveredCell])
      .some(u => u.equals(unit.getUnit()))
  );
});

const filters = computed(() => {
  const result: Filter[] = [];

  if (ui.highlightedUnit?.equals(unit)) {
    result.push(selectedFilter);
  }

  if (isInCardAoe.value || isInAttackAoe.value) {
    result.push(inAoeFilter);
  }

  if (unit.isExhausted) {
    result.push(exhaustedFilter);
  }

  return result;
});

// const modifierSpriteIds = computed(() => {
//   return unit.modifierInfos.map(infos => infos?.spriteId).filter(isDefined);
// });
</script>

<template>
  <animated-sprite
    v-if="textures?.length"
    :textures="textures"
    :anchor="0.5"
    event-mode="none"
    :filters="filters"
  >
    <!-- <UnitModifierSprite
      v-for="modifier in modifierSpriteIds"
      :key="modifier"
      :sprite-id="modifier"
    /> -->
  </animated-sprite>
</template>
