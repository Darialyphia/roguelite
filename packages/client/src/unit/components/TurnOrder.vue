<script setup lang="ts">
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import {
  useBattleStore,
  useGameClientState,
  useUserPlayer
} from '@/pages/battle/battle.store';
import UnitIcon from './UnitIcon.vue';
import Card from '@/card/components/Card.vue';
import {
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger
} from 'radix-vue';
import { GAME_PHASES } from '@game/engine/src/game/game-phase.system';

const battleStore = useBattleStore();
const ui = useBattleUiStore();
const userPlayer = useUserPlayer();
const state = useGameClientState();
</script>

<template>
  <section class="turn-order" v-if="state.phase === GAME_PHASES.BATTLE">
    <div class="title">
      <div>Turn</div>
      <div class="turn" :data-text="state.turn">{{ state.turn }}</div>
    </div>
    <HoverCardRoot
      v-for="unit in battleStore.state.turnOrderUnits"
      :key="unit.id"
      :open-delay="400"
      :close-delay="0"
    >
      <HoverCardTrigger>
        <UnitIcon
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
      </HoverCardTrigger>

      <HoverCardPortal>
        <Transition>
          <HoverCardContent side="bottom">
            <Card :card="unit.card" />
          </HoverCardContent>
        </Transition>
      </HoverCardPortal>
    </HoverCardRoot>
  </section>
</template>

<style scoped lang="postcss">
.turn-order {
  user-select: none;
  display: flex;
  gap: var(--size-2);
  align-items: flex-end;
  position: relative;
  z-index: 0;

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

.title {
  align-self: center;
  color: #ffdaad;
  font-family: 'Silkscreen';
  margin-inline-end: var(--size-2);
}

.turn {
  font-size: var(--font-size-6);
  line-height: 1;
  text-align: center;
  position: relative;
  place-self: center;
  background: linear-gradient(
    #fffe00,
    #fffe00 calc(50% + 3px),
    #feb900 calc(50% + 3px)
  );
  background-clip: text;
  color: transparent;
  position: relative;
  &:after {
    background: none;
    content: attr(data-text);
    position: absolute;
    text-shadow: 0 3px #5d1529;
    inset: 0;
    z-index: -1;
  }
}

.v-enter-active {
  transition: opacity 0.3s var(--ease-2);
}

.v-enter-from {
  opacity: 0;
}
</style>
