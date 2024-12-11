<script setup lang="ts">
import type { PlayerViewModel } from '../player.model';
import { config } from '@/utils/config';
import { config as engineConfig } from '@game/engine/src/config';
import { type Rune, RUNES } from '@game/engine/src/utils/rune';
import { GAME_PHASES } from '@game/engine/src/game/game-phase.system';
import { useGameClientState } from '@/pages/battle/battle.store';

const { player, inverted } = defineProps<{
  player: PlayerViewModel;
  inverted?: boolean;
}>();

const getRuneCountByType = (rune: Rune) =>
  player.runes.filter(r => r.equals(rune)).length;
const state = useGameClientState();
</script>

<template>
  <div
    class="player-battle-infos"
    :class="inverted && 'is-inverted'"
    v-if="state.phase === GAME_PHASES.BATTLE"
  >
    <div>
      <div class="name" :data-text="player.name">{{ player.name }}</div>
      <div class="avatar runes circle-layout">
        <div
          class="rune circle-layout-item"
          style="--bg: url('/assets/ui/rune-blue-small.png')"
        >
          {{ getRuneCountByType(RUNES.BLUE) }}
        </div>
        <div
          class="rune circle-layout-item"
          style="--bg: url('/assets/ui/rune-red-small.png')"
        >
          {{ getRuneCountByType(RUNES.RED) }}
        </div>
        <div
          class="rune circle-layout-item"
          style="--bg: url('/assets/ui/rune-green-small.png')"
        >
          {{ getRuneCountByType(RUNES.GREEN) }}
        </div>
        <div
          class="rune circle-layout-item"
          style="--bg: url('/assets/ui/rune-yellow-small.png')"
        >
          {{ getRuneCountByType(RUNES.YELLOW) }}
        </div>
        <div
          class="rune circle-layout-item"
          style="--bg: url('/assets/ui/rune-purple-small.png')"
        >
          {{ getRuneCountByType(RUNES.PURPLE) }}
        </div>
      </div>
    </div>

    <div class="stats">
      <div class="large" style="--bg: url('/assets/ui/vp-large.png')">
        <span :data-text="player.victoryPoints">
          {{ player.victoryPoints }}
        </span>
      </div>
      <div style="--bg: url('/assets/ui/gold.png')">
        <span :data-text="player.gold">
          {{ player.gold }}
        </span>
      </div>
      <div style="--bg: url('/assets/ui/hand.png')">
        <span :data-text="player.hand.length">{{ player.hand.length }}</span>
      </div>
      <div style="--bg: url('/assets/ui/deck.png')">
        <span :data-text="player.remainingCardsInDeck">
          {{ player.remainingCardsInDeck }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.player-battle-infos {
  z-index: 0;
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: var(--size-4);
  font-family: 'Silkscreen';
  font-weight: var(--font-weight-6);
  pointer-events: auto;

  &.is-inverted {
    flex-direction: row-reverse;
  }
}

.avatar {
  aspect-ratio: 1;
  background: url('/assets/ui/avatar-frame.png');
}

.circle-layout {
  display: grid;
  place-content: center;
  > * {
    grid-column: 1;
    grid-row: 1;
  }
  > .circle-layout-item {
    --angle: calc(
      (
        var(--offset, 0) +
          (1turn * (var(--child-index) - 1) / var(--total-items))
      )
    );
    transform: rotateZ(var(--angle)) translateY(calc(-1 * var(--radius)))
      rotateZ(calc(-1 * var(--angle)));
  }
}

.vp {
  --offset: 0turn;
  --radius: calc(13rem / 2);
  --total-items: v-bind('engineConfig.VICTORY_POINTS_WIN_THRESHOLD');
  width: calc(var(--radius) * 2);
  aspect-ratio: 1;
  border-radius: var(--radius-round);

  > div {
    background: var(--bg);
    width: 30px;
    aspect-ratio: 1;
  }
}

.runes {
  --radius: calc(36 * 3px);
  --total-items: 12;
  --offset: calc(1turn / 3);
  place-self: center;
  width: calc(var(--radius) * 2);
  aspect-ratio: 1;

  position: relative;
  z-index: 0;

  > .rune {
    background: var(--bg);
    width: calc(1px * v-bind('config.RUNE_SMALL_SIZE'));
    aspect-ratio: 1;
    display: grid;
    place-content: center;
    color: black;
    font-size: var(--font-size-4);
    padding-bottom: 3px;
    text-shadow: 0 2px #fffe00;
  }

  .gold {
    position: relative;

    display: grid;
    place-content: center;
    > span {
      font-size: var(--font-size-5);
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
    &::before {
      content: '';
      background: url('/assets/ui/gold.png');
      width: 30px;
      aspect-ratio: 1;
      position: absolute;
      bottom: 0;
      right: 0;
      transform: translate(60%, 60%);
    }
  }
}

.name {
  margin-inline: auto;
  width: fit-content;
  font-family: 'Silkscreen';
  font-size: var(--font-size-5);
  background: linear-gradient(
    #fffe00,
    #fffe00 calc(50% + 3px),
    #feb900 calc(50% + 3px)
  );
  background-clip: text;
  color: transparent;
  position: relative;
  letter-spacing: 2px;
  &:after {
    background: none;
    content: attr(data-text);
    position: absolute;
    text-shadow: 0 3px #5d1529;
    inset: 0;
    z-index: -1;
  }
}

.stats {
  display: flex;
  flex-direction: column;
  gap: var(--size-2);

  > div {
    --size: 30px;
    background: var(--bg);
    background-position: center left;
    background-repeat: no-repeat;
    height: var(--size);
    padding-left: calc(var(--size) + var(--size-1));
    font-size: var(--size-4);
    display: flex;
    align-items: center;
    position: relative;
    z-index: 0;
    .is-inverted & {
      background-position: center right;
      padding-left: 0;
      padding-right: calc(var(--size) + var(--size-1));
      display: flex;
      justify-content: flex-end;
    }
    &.large {
      --size: 60px;
      font-size: var(--size-7);
    }
    > span {
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
  }
}
</style>
