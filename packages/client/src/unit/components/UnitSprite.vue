<script setup lang="ts">
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { OutlineFilter } from '@pixi/filter-outline';
import { type Filter } from 'pixi.js';
import { useMultiLayerTexture } from '@/shared/composables/useMultiLayerTexture';
import { config } from '@/utils/config';
import type { UnitViewModel } from '../unit.model';
import { ColorOverlayFilter } from '@pixi/filter-color-overlay';
import { isDefined } from '@game/shared';
import UnitModifierSprite from './UnitModifierSprite.vue';
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import { AdjustmentFilter } from '@pixi/filter-adjustment';
import {
  useBattleStore,
  useGameClientState
} from '@/pages/battle/battle.store';
import { createSpritesheetFrameObject } from '@/utils/sprite';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const sheet = useSpritesheet<'', 'base'>(() => unit.spriteId);
const textures = computed(() => {
  if (!sheet.value) return null;

  return createSpritesheetFrameObject('idle', sheet.value.sheets.base.base);
});

const ui = useBattleUiStore();
const state = useGameClientState();
const camera = useIsoCamera();
const selectedFilter = new OutlineFilter(
  camera.viewport.value!.scale.x,
  0xffffff
);
camera.viewport.value?.on('zoomed-end', () => {
  selectedFilter.thickness = Math.round(camera.viewport.value!.scale.x);
});
const inAoeFilter = new ColorOverlayFilter(0xff0000, 0.3);
const inactiveFilter = new AdjustmentFilter({
  saturation: 0.5,
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

const filters = computed(() => {
  const result: Filter[] = [];

  if (ui.highlightedUnit?.equals(unit)) {
    result.push(selectedFilter);
  }

  if (isInCardAoe.value) {
    result.push(inAoeFilter);
  }

  return result;
});

const modifierSpriteIds = computed(() => {
  return unit.modifierInfos.map(infos => infos?.spriteId).filter(isDefined);
});
</script>

<template>
  <animated-sprite
    v-if="textures?.length"
    :textures="textures"
    :anchor="0.5"
    event-mode="none"
    :filters="filters"
  >
    <UnitModifierSprite
      v-for="modifier in modifierSpriteIds"
      :key="modifier"
      :sprite-id="modifier"
    />
  </animated-sprite>
</template>
