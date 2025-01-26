<script setup lang="ts">
import { Rune, RUNES } from '@game/engine/src/utils/rune';
import type { PlayerViewModel } from '../player.model';
import {
  HoverCardRoot,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardPortal
} from 'radix-vue';
import Card from '@/card/components/Card.vue';
import { GAME_PHASES } from '@game/engine/src/game/game-phase.system';
import UiSimpleTooltip from '@/ui/components/UiSimpleTooltip.vue';
import { GAME_EVENTS } from '@game/engine/src/game/game';
import {
  useBattleEvent,
  useGame,
  useGameClientState
} from '@/battle/stores/battle.store';
import { useTutorialStore } from '@/tutorial/tutorial.store';

const { player, inverted } = defineProps<{
  player: PlayerViewModel;
  inverted?: boolean;
}>();

const game = useGame();

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

const isVpGlowing = ref(false);
useBattleEvent(GAME_EVENTS.PLAYER_BEFORE_VP_CHANGE, async e => {
  if (e.player.equals(player.getPlayer())) {
    isVpGlowing.value = true;
    setTimeout(() => {
      isVpGlowing.value = false;
    }, 1000);
  }
});

const tutorial = useTutorialStore();
</script>

<template>
  <section
    v-if="state.phase === GAME_PHASES.BATTLE"
    class="player-infos"
    :class="{ 'is-inverted': inverted, 'is-active': player.isActive }"
  >
    <div class="name dual-color-text" :data-text="player.name">
      <div class="pointer-events-auto" />
      {{ player.name }}
    </div>
    <ul class="resources">
      <UiSimpleTooltip>
        <template #trigger>
          <li
            :id="`player_${player.id}_gold`"
            class="gold"
            :class="!tutorial.isGoldResourcesDisplayed && 'tutorial-hidden'"
          >
            <span class="dual-color-text" :data-text="player.gold">
              {{ player.gold }}
            </span>
          </li>
        </template>
        Available gold.
      </UiSimpleTooltip>

      <template v-for="rune in runes" :key="rune.type">
        <UiSimpleTooltip v-for="i in rune.count" :key="i">
          <template #trigger>
            <li
              class="rune"
              :class="!tutorial.isRuneResourcesDisplayed && 'tutorial-hidden'"
              :style="{
                '--bg': `url('/assets/ui/rune-${rune.type}-small.png')`
              }"
            />
          </template>
          {{ rune.name }} runes.
        </UiSimpleTooltip>
      </template>
    </ul>

    <div class="bottom-row">
      <UiSimpleTooltip>
        <template #trigger>
          <div
            class="deck"
            :class="!tutorial.isDeckDisplayed && 'tutorial-hidden'"
          >
            {{ player.remainingCardsInDeck }}
          </div>
        </template>
        Remaining card in the deck.
      </UiSimpleTooltip>
      <UiSimpleTooltip>
        <template #trigger>
          <div
            class="quests"
            :class="!tutorial.isQuestsDisplayed && 'tutorial-hidden'"
          >
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
              v-for="i in game.config.MAX_ONGOING_QUESTS - player.quests.length"
              :key="i"
              class="empty"
            />
          </div>
        </template>

        Ongoing quests.
      </UiSimpleTooltip>
    </div>

    <div
      class="vp"
      :style="{ '--score': player.victoryPoints }"
      :class="[
        isVpGlowing && 'glowing',
        !tutorial.isVPDisplayed && 'tutorial-hidden'
      ]"
    >
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
  grid-template-columns: auto calc(var(--pixel-art-scale) * 40px);
  grid-template-rows:
    auto calc(var(--pixel-art-scale) * 13px)
    calc(var(--pixel-art-scale) * 34px);
  row-gap: calc(var(--pixel-art-scale) * 3px);
  column-gap: calc(var(--pixel-art-scale) * 3px);
  font-family: 'Silkscreen';
  grid-template-areas:
    'name vp'
    'resources vp'
    'bottom vp';
  &.is-inverted {
    grid-template-columns:
      calc(var(--pixel-art-scale) * 40px)
      auto;
    grid-template-areas:
      'vp name'
      'vp resources'
      'vp bottom';
  }
  filter: drop-shadow(0 0 5px hsl(0 0 0 / 0.7));
  /* background-color: #32021b; */
}

.name {
  grid-area: name;
  font-size: var(--font-size-5);
  display: flex;
  justify-content: flex-end;
  gap: var(--size-2);
  > div {
    width: var(--size-5);
    aspect-ratio: 1;
    border-radius: var(--radius-round);
    background: linear-gradient(
      #fffe00,
      #fffe00 calc(50% + 3px),
      #feb900 calc(50% + 3px)
    );
    align-self: center;
    .player-infos:not(.is-active) & {
      display: none;
    }
  }
  .is-inverted & {
    flex-direction: row-reverse;
  }
}

.resources {
  grid-area: resources;
  display: flex;
  flex-direction: row-reverse;
  min-width: calc(var(--pixel-art-scale) * 6 * 13px + 100px);
  .is-inverted & {
    flex-direction: row;
  }
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
  transition: filter 0.5s var(--ease-2);
  &.glowing {
    filter: drop-shadow(0 0 1em cyan) contrast(300%) brightness(200%);
  }
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
  font-size: var(--font-size-6);
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
