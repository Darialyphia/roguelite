<script setup lang="ts">
import { UI_MODES, useBattleUiStore } from '@/battle/stores/battle-ui.store';
import BoardCellSprite from './BoardCellSprite.vue';
import UiAnimatedSprite from '@/ui/scenes/UiAnimatedSprite.vue';
import BoardCellHighlights from './BoardCellHighlights.vue';
import type { CellViewModel } from '../models/cell.model';
import { match } from 'ts-pattern';
import { PTransition, type ContainerInst } from 'vue3-pixi';
import BoardCellLightVFX from './BoardCellLightVFX.vue';
import Card from '@/card/components/Card.vue';
import Obstacle from './Obstacle.vue';
import ObstacleCard from '@/card/components/ObstacleCard.vue';
import { useCamera } from '../composables/useCamera';
import { GAME_PHASES } from '@game/engine/src/game/game-phase.system';
import {
  useBattleStore,
  useGameClientState,
  usePathHelpers,
  useUserPlayer
} from '@/battle/stores/battle.store';
import VirtualFloatingCard from '@/ui/scenes/VirtualFloatingCard.vue';
import { useTutorialStore } from '@/tutorial/tutorial.store';

const { cell } = defineProps<{ cell: CellViewModel }>();
const emit = defineEmits<{ ready: [] }>();
const ui = useBattleUiStore();
const battle = useBattleStore();
const player = useUserPlayer();
const isHovered = computed(() => !!ui.hoveredCell?.equals(cell.getCell()));

const camera = useCamera();
const pathHelpers = usePathHelpers();

const spawnAnimation = (container: ContainerInst) => {
  container.y = -400;
  container.alpha = 0;
  gsap.to(container, {
    y: 0,
    duration: 1,
    ease: Bounce.easeOut,
    delay: Math.random() * 0.5,
    onStart() {
      container.alpha = 1;
    },
    onComplete() {
      emit('ready');
    }
  });
};

const cardPosition = computed(() =>
  camera.viewport.value?.toScreen({
    x: cell.screenPosition.x + camera.offset.value.x,
    y: cell.screenPosition.y + camera.offset.value.y
  })
);

const state = useGameClientState();
const tutorial = useTutorialStore();
</script>

<template>
  <container
    :x="cell.screenPosition.x"
    :y="cell.screenPosition.y"
    :z-order="cell.screenPosition.y"
    @pointerenter="ui.hoverAt(cell)"
    @pointerleave="ui.unHover()"
    @pointerup="
      () => {
        if (camera.isDragging.value) return;
        if (!ui.mode) return;
        match(ui.mode)
          .with(UI_MODES.BASIC, () => {
            const canSelect = cell.unit && cell.unit.player.equals(player);
            if (canSelect) {
              ui.selectUnit(cell.unit!);
              return;
            }

            if (!ui.selectedUnit) return;

            if (pathHelpers.canMoveTo(ui.selectedUnit, cell)) {
              return battle.dispatch({
                type: 'move',
                payload: {
                  x: cell.x,
                  y: cell.y,
                  z: cell.z,
                  unitId: ui.selectedUnit.id
                }
              });
            }

            if (ui.selectedUnit.canAttackAt(cell)) {
              return battle.dispatch({
                type: 'attack',
                payload: {
                  x: cell.x,
                  y: cell.y,
                  z: cell.z,
                  unitId: ui.selectedUnit.id
                }
              });
            }

            ui.unselectUnit();
          })
          .with(UI_MODES.PLAY_CARD, () => {
            if (ui.isTargetValid(cell)) {
              ui.addCardTarget({ x: cell.x, y: cell.y, z: cell.z });
              return;
            }
            ui.unselectCard();
            ui.unselectCard();
          })
          .exhaustive();
      }
    "
  >
    <PTransition
      appear
      :duration="{ enter: 1000, leave: 0 }"
      @enter="spawnAnimation"
    >
      <container :ref="(container: any) => ui.assignLayer(container, 'scene')">
        <BoardCellSprite :cell="cell" />
        <BoardCellHighlights :cell="cell" />
        <UiAnimatedSprite assetId="hovered-cell" v-if="isHovered" />
        <Obstacle
          v-if="tutorial.areObstaclesDisplayed && cell.obstacle"
          :obstacle="cell.obstacle"
        />
        <BoardCellLightVFX :cell="cell" />
      </container>
    </PTransition>
  </container>
  <VirtualFloatingCard
    :is-opened="
      (!!cell.unit || !!cell.obstacle) &&
      !!cardPosition &&
      isHovered &&
      state.phase === GAME_PHASES.BATTLE
    "
    :timeout="1000"
    :position="cardPosition!"
  >
    <Card v-if="cell.unit" :card="cell.unit.card" />
    <ObstacleCard
      v-else-if="cell.obstacle && tutorial.areObstaclesDisplayed"
      :obstacle="cell.obstacle"
    />
  </VirtualFloatingCard>
</template>
