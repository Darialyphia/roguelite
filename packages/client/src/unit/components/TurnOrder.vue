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
      @mouseenter="ui.highlightUnit(unit)"
      @mouseleave="ui.unhighlight()"
    />
  </section>
</template>

<style scoped lang="postcss">
.turn-order {
  user-select: none;
  display: flex;
  gap: var(--size-1);
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

  .ally {
    --unit-icon-bg: linear-gradient(135deg, #004ea6, #00bcff);
  }

  .enemy {
    --unit-icon-bg: linear-gradient(135deg, #56002d, #a2005b);
  }

  .highlighted {
    outline: solid 1px white;
    box-shadow: 0 0 8px 2px hsl(0 0 100% / 0.4);
    filter: brightness(125%) contrast(110%);
  }
}
</style>
