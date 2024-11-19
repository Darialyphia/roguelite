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
  margin: var(--size-3);

  > p {
    align-self: center;
    color: #ffdaad;
    font-family: 'Silkscreen';
    margin-inline-end: var(--size-2);
  }

  & > :not(:first-of-type) {
    --unit-icon-size: calc(96px * 0.75);
  }

  & :is(.highlighted, .ally, .enemy) {
    outline: solid 1px var(--highlight-color);
    box-shadow: 0 0 8px 2px hsl(0 0 100% / 0.4);
  }
  .highlighted {
    --highlight-color: white;
    filter: brightness(125%) contrast(110%);
  }
  .ally {
    --highlight-color: #00d8f7;
  }
  .enemy {
    --highlight-color: #ff134b;
  }
}
</style>
