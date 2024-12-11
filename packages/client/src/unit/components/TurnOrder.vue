<script setup lang="ts">
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import { useBattleStore, useUserPlayer } from '@/pages/battle/battle.store';
import UnitIcon from './UnitIcon.vue';

const battleStore = useBattleStore();
const ui = useBattleUiStore();
const userPlayer = useUserPlayer();
</script>

<template>
  <section class="turn-order">
    <p>Turn Order</p>
    <UnitIcon
      v-for="unit in battleStore.state.turnOrderUnits"
      :key="unit.id"
      :unit="unit"
      class="pointer-events-auto"
      :class="{
        highlighted: ui.highlightedUnit?.equals(unit),
        ally: unit.getUnit().player.isAlly(userPlayer.getPlayer()),
        enemy: unit.getUnit().player.isEnemy(userPlayer.getPlayer())
      }"
      @click="ui.selectUnit(unit)"
      @mouseenter="ui.highlightUnit(unit)"
      @mouseleave="ui.unhighlightUnit()"
    />
  </section>
</template>

<style scoped lang="postcss">
.turn-order {
  user-select: none;
  display: flex;
  gap: var(--size-2);
  align-items: flex-end;

  > p {
    align-self: center;
    color: #ffdaad;
    font-family: 'Silkscreen';
    margin-inline-end: var(--size-2);
  }

  & :is(.highlighted, .ally, .enemy) {
    outline: solid 1px var(--highlight-color);
  }
  .highlighted {
    --highlight-color: white;
    filter: brightness(125%) contrast(110%);
  }
  .ally {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      width: 10px;
      aspect-ratio: 1;
      background: radial-gradient(
        circle at center,
        white,
        hsl(200, 80%, 60%) 50%
      );
      box-shadow: 0 0 1.5em 3px hsl(200, 80%, 60%);
      border-radius: var(--radius-round);
    }
  }
  .enemy {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      width: 10px;
      aspect-ratio: 1;
      background: radial-gradient(
        circle at center,
        white,
        hsl(0, 80%, 60%) 50%
      );
      box-shadow: 0 0 1.5em 3px hsl(0, 80%, 60%);
      border-radius: var(--radius-round);
    }
  }
}
</style>
