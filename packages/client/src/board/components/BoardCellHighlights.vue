<script setup lang="ts">
import { PTransition } from 'vue3-pixi';
import {
  useBattleStore,
  useGameClientState,
  usePathHelpers,
  useUserPlayer
} from '@/pages/battle/battle.store';
import UiAnimatedSprite from '@/ui/components/UiAnimatedSprite.vue';
import { GAME_PHASES } from '@game/engine/src/game/game-phase.system';
import type { CellViewModel } from '../models/cell.model';
import { UI_MODES, useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { isDefined } from '@game/shared';
import { match } from 'ts-pattern';
import { useCamera } from '../composables/useCamera';

const { cell } = defineProps<{ cell: CellViewModel }>();

const battleStore = useBattleStore();
const camera = useCamera();
const ui = useBattleUiStore();
const state = useGameClientState();
const pathHelpers = usePathHelpers();

const isWithinCardRange = computed(() => {
  if (!ui.selectedCard) return;
  return ui.selectedCard
    .getCard()
    .isWithinRange(cell.getCell(), ui.cardTargets.length);
});

const canTarget = computed(() => {
  if (!ui.selectedCard) return;
  if (ui.hoveredCell?.equals(cell.getCell())) return ui.isTargetValid(cell);
});

const canMove = computed(() => {
  return !!ui.selectedUnit && pathHelpers.canMoveTo(ui.selectedUnit, cell);
});

const canAttack = computed(() => {
  if (ui.mode === UI_MODES.PLAY_CARD) return false;
  return (
    ui.mode === UI_MODES.BASIC &&
    isDefined(cell.getCell().unit) &&
    ui.selectedUnit?.getUnit().canAttackAt(cell)
  );
});

const isOnPath = computed(() => {
  if (camera.isDragging.value) return false;
  if (!ui.selectedUnit) return false;
  if (!ui.hoveredCell) return false;
  if (!canMove.value) return false;

  const path = pathHelpers.getPathTo(ui.selectedUnit, ui.hoveredCell);

  return path?.path.some(point => point.equals(cell));
});

const isInCardAoe = computed(() => {
  if (!ui.selectedCard) return false;
  if (!ui.hoveredCell) return false;
  const targets = [...ui.cardTargets, ui.hoveredCell];
  const aoe = ui.selectedCard.getAoe(targets);
  if (!aoe) return false;

  return aoe?.getCells(targets).some(c => c.equals(cell.getCell()));
});
const userPlayer = useUserPlayer();

const isDangerZone = computed(() => {
  if (!canMove.value) return false;
  return state.value.units
    .filter(u => userPlayer.value.isEnemy(u))
    .some(enemy => pathHelpers.canAttackAt(enemy, cell));
});
const tag = computed(() => {
  if (
    battleStore.state.phase !== GAME_PHASES.BATTLE ||
    battleStore.isPlayingFx
  ) {
    return null;
  }

  if (!ui.mode) return null;
  return match(ui.mode)
    .with(UI_MODES.BASIC, () => {
      if (!ui.selectedUnit?.player.equals(userPlayer.value)) {
        return null;
      }
      if (canAttack.value) {
        return 'danger';
      }
      if (isOnPath.value) {
        return 'movement-path';
      }

      if (canMove.value) {
        return isDangerZone.value ? 'danger' : 'movement';
      }

      return null;
    })
    .with(UI_MODES.PLAY_CARD, () => {
      if (isInCardAoe.value) {
        return 'danger';
      }

      if (canTarget.value) {
        return 'targeting';
      }
      if (isWithinCardRange.value) {
        return 'targeting-valid';
      }

      return null;
    })
    .exhaustive();
});
</script>

<template>
  <PTransition
    appear
    :duration="{ enter: 200, leave: 200 }"
    :before-enter="{ alpha: 0 }"
    :enter="{ alpha: 1 }"
    :leave="{ alpha: 0 }"
  >
    <UiAnimatedSprite
      v-if="tag"
      assetId="tile-highlights"
      :tag="tag"
      :anchor="0.5"
    />
  </PTransition>
</template>
