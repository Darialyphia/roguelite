<script setup lang="ts">
import {
  useActiveUnit,
  useBattleStore,
  useGameClientState,
  useUserPlayer
} from '@/pages/battle/battle.store';
import { config } from '@/utils/config';
import { GAME_PHASES } from '@game/engine/src/game/game-phase.system';
import { RUNES, type Rune } from '@game/engine/src/utils/rune';

const battle = useBattleStore();
const state = useGameClientState();
const userPlayer = useUserPlayer();
const activeUnit = useActiveUnit();

const getRuneCountByType = (rune: Rune) =>
  userPlayer.value.runes.filter(r => r.equals(rune)).length;

const isUserPlayerTurn = computed(() =>
  activeUnit.value?.player.equals(userPlayer.value)
);
</script>

<template>
  <div
    class="hexagonal-grid action-wheel"
    v-if="state.phase === GAME_PHASES.BATTLE"
  >
    <button
      aria-label="add Order rune"
      style="--bg: url('/assets/ui/rune-yellow.png')"
      :disabled="!userPlayer.canPerformResourceAction || !isUserPlayerTurn"
      @click="
        battle.dispatch({
          type: 'runeResourceAction',
          payload: {
            rune: 'YELLOW'
          }
        })
      "
    />
    <button
      aria-label="add Chaos rune"
      style="--bg: url('/assets/ui/rune-purple.png')"
      :disabled="!userPlayer.canPerformResourceAction || !isUserPlayerTurn"
      @click="
        battle.dispatch({
          type: 'runeResourceAction',
          payload: {
            rune: 'PURPLE'
          }
        })
      "
    />
    <button
      aria-label="add Creation rune"
      style="--bg: url('/assets/ui/rune-green.png')"
      :disabled="!userPlayer.canPerformResourceAction || !isUserPlayerTurn"
      @click="
        battle.dispatch({
          type: 'runeResourceAction',
          payload: {
            rune: 'GREEN'
          }
        })
      "
    />
    <button
      aria-label="add Destruction rune"
      style="--bg: url('/assets/ui/rune-red.png')"
      :disabled="!userPlayer.canPerformResourceAction || !isUserPlayerTurn"
      @click="
        battle.dispatch({
          type: 'runeResourceAction',
          payload: {
            rune: 'RED'
          }
        })
      "
    />
    <button
      aria-label="add Aether rune"
      style="--bg: url('/assets/ui/rune-blue.png')"
      :disabled="!userPlayer.canPerformResourceAction || !isUserPlayerTurn"
      @click="
        battle.dispatch({
          type: 'runeResourceAction',
          payload: {
            rune: 'BLUE'
          }
        })
      "
    />
    <button
      aria-label="gain one additional gold"
      style="--bg: url('/assets/ui/gold-action.png')"
      :disabled="!userPlayer.canPerformResourceAction || !isUserPlayerTurn"
      @click="
        battle.dispatch({
          type: 'goldResourceAction',
          payload: {}
        })
      "
    >
      {{ getRuneCountByType(RUNES.BLUE) || '' }}
    </button>
    <button
      aria-label="draw an additional card"
      style="--bg: url('/assets/ui/draw-action.png')"
      :disabled="!userPlayer.canPerformResourceAction || !isUserPlayerTurn"
      @click="
        battle.dispatch({
          type: 'drawResourceAction',
          payload: {}
        })
      "
    />
    <button
      aria-label="end turn"
      :disabled="!isUserPlayerTurn"
      style="--bg: url('/assets/ui/end-turn-action.png')"
      @click="
        battle.dispatch({
          type: 'endTurn',
          payload: {}
        })
      "
    />
  </div>
</template>

<style scoped lang="postcss">
.hexagonal-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, var(--half-item-size)));
  grid-template-rows:
    calc(var(--item-size) * 0.75)
    calc(var(--item-size) * 0.25)
    calc(var(--item-size) * 0.5)
    calc(var(--item-size) * 0.25)
    calc(var(--item-size) * 0.5)
    calc(var(--item-size) * 0.5)
    calc(var(--item-size) * 0.25)
    calc(var(--item-size) * 0.75);

  > * {
    clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
    width: var(--item-size);
    aspect-ratio: 1;
    &:nth-of-type(1) {
      grid-column: 2 / span 2;
      grid-row: 1 / span 2;
    }
    &:nth-of-type(2) {
      grid-column: 4 / span 2;
      grid-row: 1 / span 2;
    }
    &:nth-of-type(3) {
      grid-column: 1 / span 2;
      grid-row: 2 / span 3;
    }
    &:nth-of-type(4) {
      grid-column: 3 / span 2;
      grid-row: 2 / span 3;
    }
    &:nth-of-type(5) {
      grid-column: 5 / span 2;
      grid-row: 2 / span 3;
    }
    &:nth-of-type(6) {
      grid-column: 2 / span 2;
      grid-row: 4 / span 2;
    }
    &:nth-of-type(7) {
      grid-column: 4 / span 2;
      grid-row: 4 / span 2;
    }
    &:nth-of-type(8) {
      grid-column: 3 / span 2;
      grid-row: 6 / span 2;
    }
  }
}

.action-wheel {
  --item-size: calc(1px * v-bind('config.ACTION_WHEEL_BUTTON_SIZE'));
  --half-item-size: calc(var(--item-size) / 2);

  background: url('/assets/ui/action-wheel.png');
  background-position: top left;
  background-repeat: no-repeat;
  width: calc(1px * v-bind('config.ACTION_WHEEL_WIDTH'));
  height: calc(1px * v-bind('config.ACTION_WHEEL_HEIGHT'));
  padding-left: 9px;
  padding-top: 9px;
}

button {
  background: var(--bg);
  pointer-events: auto;
  &:disabled {
    filter: grayscale(80%) brightness(75%);
  }
  &:hover {
    filter: brightness(120%);
  }
}
</style>
