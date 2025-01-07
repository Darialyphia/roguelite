<script setup lang="ts">
import { config as engineConfig } from '@game/engine/src/config';
import { Rune, RUNES } from '@game/engine/src/utils/rune';
import type { PlayerViewModel } from '../player.model';
import {
  HoverCardRoot,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardPortal,
  ProgressRoot,
  ProgressIndicator
} from 'radix-vue';
import Card from '@/card/components/Card.vue';
import { useGameClientState } from '@/pages/battle/battle.store';
import { GAME_PHASES } from '@game/engine/src/game/game-phase.system';
import UiSimpleTooltip from '@/ui/components/UiSimpleTooltip.vue';

const { player, inverted } = defineProps<{
  player: PlayerViewModel;
  inverted?: boolean;
}>();

const getRuneCountByType = (rune: Rune) =>
  player.runes.filter(r => r.equals(rune)).length;

const runes = computed<Array<{ type: string; count: number; name: string }>>(
  () => [
    { type: 'red', name: RUNES.RED.name, count: getRuneCountByType(RUNES.RED) },
    {
      type: 'green',
      name: RUNES.GREEN.name,
      count: getRuneCountByType(RUNES.GREEN)
    },
    {
      type: 'purple',
      name: RUNES.PURPLE.name,
      count: getRuneCountByType(RUNES.PURPLE)
    },
    {
      type: 'yellow',
      name: RUNES.YELLOW.name,
      count: getRuneCountByType(RUNES.YELLOW)
    },
    {
      type: 'blue',
      name: RUNES.BLUE.name,
      count: getRuneCountByType(RUNES.BLUE)
    }
  ]
);
const state = useGameClientState();
</script>

<template>
  <section
    v-if="state.phase === GAME_PHASES.BATTLE"
    class="player-infos"
    :class="inverted && 'is-inverted'"
  >
    <div class="name dual-color-text" :data-text="player.name">
      {{ player.name }}
    </div>
    <ul class="resources">
      <UiSimpleTooltip v-for="rune in runes" :key="rune.type">
        <template #trigger>
          <li
            class="rune"
            :style="{
              '--bg': `url('/assets/ui/rune-${rune.type}-small.png')`
            }"
          >
            {{ rune.count }}
          </li>
        </template>
        Unlocked {{ rune.name }} runes.
      </UiSimpleTooltip>

      <li class="gold">
        <span class="dual-color-text" :data-text="player.gold">
          {{ player.gold }}
        </span>
      </li>
    </ul>

    <div class="bottom-row">
      <UiSimpleTooltip>
        <template #trigger>
          <div class="deck">
            {{ player.remainingCardsInDeck }}
          </div>
        </template>
        Remaining card in the deck.
      </UiSimpleTooltip>
      <UiSimpleTooltip>
        <template #trigger>
          <div class="quests">
            <HoverCardRoot
              v-for="quest in player.quests"
              :key="quest.id"
              :close-delay="0"
              :open-delay="300"
            >
              <HoverCardTrigger as-child>
                <div />
              </HoverCardTrigger>
              <HoverCardPortal>
                <HoverCardContent :side-offset="15">
                  <Card :card="quest" />
                </HoverCardContent>
              </HoverCardPortal>
            </HoverCardRoot>

            <div
              v-for="i in engineConfig.MAX_ONGOING_QUESTS -
              player.quests.length"
              :key="i"
              class="empty"
            />
          </div>
        </template>

        Ongoing quests.
      </UiSimpleTooltip>
    </div>

    <ProgressRoot
      v-model="player.victoryPoints"
      class="vp-progress"
      :max="engineConfig.VICTORY_POINTS_WIN_THRESHOLD"
    >
      <ProgressIndicator as-child>
        <UiSimpleTooltip>
          <template #trigger>
            <div
              class="indicator"
              :style="{ '--score': player.victoryPoints }"
            />
          </template>
          <div>
            <div>Collect VP to win the game.</div>
            <br />
            <div>- When you reach 5 VP, your opponent draws 1 card.</div>
            <br />
            <div>- When you reach 10 VP, your opponent draws 1 more card.</div>
          </div>
        </UiSimpleTooltip>
      </ProgressIndicator>
    </ProgressRoot>

    <div class="vp" :style="{ '--score': player.victoryPoints }">
      <span class="sr-only">{{ player.victoryPoints }}</span>
    </div>
  </section>
</template>

<style scoped lang="postcss">
.dual-color-text {
  background: linear-gradient(
    #fffe00,
    #fffe00 calc(50% + 3px),
    #feb900 calc(50% + 3px)
  );
  background-clip: text;
  color: transparent;
  position: relative;

  :has(> &) {
    position: relative;
    z-index: 0;
  }
  &:after {
    background: none;
    content: attr(data-text);
    position: absolute;
    text-shadow: 0 3px black;
    inset: 0;
    z-index: -1;
  }
}

.player-infos {
  height: calc(var(--pixel-art-scale) * 68px);
  display: grid;
  grid-template-columns: auto calc(var(--pixel-art-scale) * 12px) calc(
      var(--pixel-art-scale) * 40px
    );
  grid-template-rows:
    auto calc(var(--pixel-art-scale) * 13px)
    calc(var(--pixel-art-scale) * 34px);
  row-gap: calc(var(--pixel-art-scale) * 3px);
  column-gap: calc(var(--pixel-art-scale) * 3px);
  font-family: 'Silkscreen';
  grid-template-areas:
    'name progress vp'
    'resources progress vp'
    'bottom progress vp';
  &.is-inverted {
    grid-template-columns:
      calc(var(--pixel-art-scale) * 40px)
      calc(var(--pixel-art-scale) * 12px) auto;
    grid-template-areas:
      'vp progress name'
      'vp progress resources'
      'vp progress bottom';
  }
  filter: drop-shadow(0 0 0.5em hsl(0 0 0 / 0.5));
}

.name {
  grid-area: name;
  font-size: var(--font-size-5);
  text-align: right;
  .is-inverted & {
    text-align: left;
  }
}

.resources {
  grid-area: resources;
  display: flex;
  justify-content: space-between;
  gap: var(--size-2);
}

.bottom-row {
  grid-area: bottom;
  gap: var(--size-4);
  justify-content: flex-end;
  display: flex;

  .is-inverted & {
    flex-direction: row-reverse;
  }
}

.vp-progress {
  grid-area: progress;
}

.vp {
  grid-area: vp;
}

.rune {
  width: calc(var(--pixel-art-scale) * 13px);
  aspect-ratio: 1;
  background-image: var(--bg);
  display: grid;
  place-content: center;
  font-size: var(--font-size-4);
  color: black;
  text-shadow: 0 0 9px #d7ad42;
  pointer-events: auto;
}

.gold {
  padding-left: calc(var(--pixel-art-scale) * 15px);
  aspect-ratio: 1;
  background-image: url('/assets/ui/gold.png');
  background-repeat: no-repeat;
  background-position: 0 0;
  font-size: var(--font-size-5);
  display: flex;
  align-items: center;
  pointer-events: auto;
}

.deck {
  background: url('/assets/ui/deck-big.png');
  background-repeat: no-repeat;
  background-position: left bottom;
  width: calc(var(--pixel-art-scale) * 26px);
  text-align: center;
  color: #d7ad42;
  pointer-events: auto;
  font-size: var(--font-size-4);
}

.quests {
  --size: 0px;
  pointer-events: auto;
  display: flex;
  gap: var(--size-4);
  height: 100%;
  > div {
    width: 66px;
    height: 100%;
    background-image: url('/assets/ui/quest-icon-filled.png');
    &.empty {
      background-image: url('/assets/ui/quest-icon-empty.png');
    }
  }
}

.indicator {
  height: 100%;
  background: url('/assets/ui/vp-progress-bar.png');
  background-size: cover;
  --frame-height: calc(var(--pixel-art-scale) * 68px);
  --bg-offset: calc(-1 * var(--score) * var(--frame-height));
  background-position: 0 var(--bg-offset);
  pointer-events: auto;
}
.vp {
  height: 100%;
  background: url('/assets/ui/vp-counter.png');
  background-size: cover;
  --frame-height: calc(var(--pixel-art-scale) * 68px);
  --bg-offset: calc(-1 * var(--score) * var(--frame-height));
  background-position: 0 var(--bg-offset);
}
</style>
