<script setup lang="ts">
import {
  useBattleStore,
  type CellViewModel
} from '@/pages/battle/battle.store';
import UiAnimatedSprite from '@/ui/components/UiAnimatedSprite.vue';
import { GAME_PHASES } from '@game/engine/src/game/game-phase.system';

const { cell } = defineProps<{ cell: CellViewModel }>();

const battleStore = useBattleStore();

const tag = computed(() => 'movement');

const canMove = computed(
  () => {
    return battleStore.state.activeUnit?.getUnit().canMoveTo(cell);
  },
  {
    onTrigger(event) {
      console.log(event);
    }
  }
);
// const canAttack = computed(() =>
//   battleStore.state.activeUnit?.unit.canAttackAt(cell)
// );

const isDisplayed = computed(() => {
  if (battleStore.state.phase !== GAME_PHASES.BATTLE) return false;
  if (battleStore.isPlayingFx) return false;
  return canMove.value;
});
</script>

<template>
  <UiAnimatedSprite v-if="isDisplayed" assetId="tile-highlights" :tag="tag" />
</template>
