<script setup lang="ts">
import { PTransitionGroup } from 'vue3-pixi';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import {
  useGame,
  useGameClientState,
  usePathHelpers,
  useUserPlayer
} from '@/pages/battle/battle.store';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { config } from '@/utils/config';

const state = useGameClientState();
const userPlayer = useUserPlayer();

const ui = useBattleUiStore();
const pathHelpers = usePathHelpers();
const game = useGame();

const attackerPositions = computed(() => {
  return state.value.units
    .filter(unit => {
      if (
        ui.hoveredCell &&
        ui.selectedUnit &&
        userPlayer.value.isEnemy(unit) &&
        pathHelpers.canMoveTo(ui.selectedUnit, ui.hoveredCell) &&
        pathHelpers.canAttackAt(unit, ui.hoveredCell)
      ) {
        return true;
      }

      return false;
    })
    .map(unit => {
      const cell = game.value.boardSystem.getCellAt(unit.position)!;
      return {
        id: unit.id,
        x: cell.hex.x,
        y: cell.hex.y,
        gamePos: unit.position
      };
    });
});

const filters = [
  new DropShadowFilter({
    alpha: 0.8,
    color: 0xe93100,
    quality: 3,
    offset: {
      x: 0,
      y: 4
    }
  })
];
</script>

<template>
  <container
    :ref="(container: any) => ui.assignLayer(container, 'ui')"
    v-if="ui.selectedUnit"
  >
    <PTransitionGroup
      :duration="{ enter: 300, leave: 300 }"
      :before-enter="{ alpha: 0 }"
      :enter="{ alpha: 1 }"
      :leave="{ alpha: 0 }"
    >
      <graphics
        v-for="pos in attackerPositions"
        :key="pos.id"
        :z-index="9999"
        :z-order="9999"
        :y="-config.TILE_SPRITE_SIZE.height * 0.75"
        :alpha="0.75"
        :filters="filters"
        @render="
          // g => {
          //   if (!ui.hoveredCell) return;
          //   g.clear();
          //   g.moveTo(pos.x, pos.y);
          //   g.lineStyle(2, '#ffdaad');
          //   const midPoint = {
          //     x: (pos.gamePos.x + ui.hoveredCell!.x) / 2,
          //     y: (pos.gamePos.y + ui.hoveredCell!.y) / 2,
          //     z: (pos.gamePos.z + ui.hoveredCell!.z) / 2
          //   };

          //   const iso = isoWorld.toIso({ ...midPoint, z: midPoint.z + 8 });

          //   g.quadraticCurveTo(
          //     iso.x,
          //     iso.y,
          //     hoveredCellIsoPosition.x,
          //     hoveredCellIsoPosition.y + 20
          //   );
          // }
        "
      />
    </PTransitionGroup>
  </container>
</template>
