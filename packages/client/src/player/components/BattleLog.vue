<script setup lang="ts">
import type { Card } from '@game/engine/src/card/card.entity';
import type { SerializedInput } from '@game/engine/src/input/input-system';
import type { Unit } from '@game/engine/src/unit/unit.entity';
import type { Point3D } from '@game/shared';
import { vOnClickOutside } from '@vueuse/components';
import { match } from 'ts-pattern';
import { Icon } from '@iconify/vue';
import type { EntityId } from '@game/engine/src/entity';
import type { Player } from '@game/engine/src/player/player.entity';
import { GAME_PHASES } from '@game/engine/src/game/game-phase.system';
import { GAME_EVENTS } from '@game/engine/src/game/game';
import {
  useBattleEvent,
  useGame,
  useGameClientState
} from '@/battle/stores/battle.store';

const state = useGameClientState();
const game = useGame();

type Token =
  | {
      kind: 'text';
      text: string;
    }
  | { kind: 'card'; card: Card }
  | {
      kind: 'unit';
      unit: Unit;
    }
  | {
      kind: 'player';
      player: Player;
    }
  | {
      kind: 'input';
      player: Player;
    }
  | { kind: 'position'; point: Point3D }
  | { kind: 'turn_start'; player: Player }
  | { kind: 'action'; text: string };

const events = ref<Token[][]>([[]]);

useBattleEvent(GAME_EVENTS.INPUT_START, async event => {
  events.value.push([
    {
      kind: 'input',
      player: game.value.playerSystem.getPlayerById(
        event.payload.playerId as EntityId
      )!
    },
    {
      kind: 'action',
      text: match(event.type as Exclude<SerializedInput['type'], 'deploy'>)
        .with('attack', () => 'attacks')
        .with('endTurn', () => 'ends their turn')
        .with('move', () => 'moves')
        .with('playCard', () => 'plays a card')
        .with('drawResourceAction', () => 'draws a card')
        .with('goldResourceAction', () => 'gains 1 gold')
        .with('runeResourceAction', () => 'adds a rune')
        .with('mulligan', () => 'mulligans')
        .exhaustive()
    }
  ]);
});

useBattleEvent(GAME_EVENTS.PLAYER_BEFORE_PLAY_CARD, async event => {
  events.value.push([
    { kind: 'player', player: event.player },
    { kind: 'text', text: 'played' },
    { kind: 'card', card: event.card }
  ]);
});

useBattleEvent(GAME_EVENTS.UNIT_BEFORE_ATTACK, async event => {
  const tokens: Token[] = [
    { kind: 'unit', unit: event.unit },
    { kind: 'text', text: 'attacked' }
  ];
  const target = game.value.unitSystem.getUnitAt(event.target);
  if (target) {
    tokens.push({ kind: 'unit', unit: target });
  }
  events.value.push(tokens);
});

useBattleEvent(GAME_EVENTS.UNIT_BEFORE_RECEIVE_DAMAGE, async event => {
  events.value.push([
    { kind: 'unit', unit: event.unit },
    {
      kind: 'text',
      text: `took ${event.damage.getMitigatedAmount(event.unit)} damage from`
    },
    { kind: 'card', card: event.from }
  ]);
});

useBattleEvent(GAME_EVENTS.UNIT_AFTER_RECEIVE_HEAL, async event => {
  events.value.push([
    { kind: 'unit', unit: event.unit },
    { kind: 'text', text: `got healed for ${event.amount} by` },
    { kind: 'unit', unit: event.from }
  ]);
});

useBattleEvent(GAME_EVENTS.UNIT_AFTER_MOVE, async event => {
  events.value.push([
    { kind: 'unit', unit: event.unit },
    { kind: 'text', text: `moved from` },
    { kind: 'position', point: event.previousPosition },
    { kind: 'text', text: `to` },
    { kind: 'position', point: event.position }
  ]);
});

useBattleEvent(GAME_EVENTS.PLAYER_START_TURN, async event => {
  events.value.push([{ kind: 'turn_start', player: event.player }]);
});

useBattleEvent(GAME_EVENTS.UNIT_AFTER_DESTROY, async event => {
  events.value.push([
    { kind: 'unit', unit: event.unit },
    { kind: 'text', text: `got destroyed.` }
  ]);
});

useBattleEvent(GAME_EVENTS.PLAYER_AFTER_RUNE_CHANGE, async event => {
  events.value.push([
    { kind: 'player', player: event.player },
    { kind: 'text', text: `gained a ${event.rune.name} rune` }
  ]);
});

useBattleEvent(GAME_EVENTS.PLAYER_AFTER_GOLD_CHANGE, async event => {
  events.value.push([
    { kind: 'player', player: event.player },
    { kind: 'text', text: `gained ${event.amount} gold.` }
  ]);
});
const isCollapsed = ref(true);

const listEl = ref<HTMLElement>();
watch(isCollapsed, collapsed => {
  if (!collapsed) {
    nextTick(() => {
      listEl.value?.scrollTo({
        top: listEl.value.scrollHeight,
        behavior: 'instant'
      });
    });
  }
});

watch(
  () => events.value.length,
  () => {
    if (isCollapsed.value) return;
    nextTick(() => {
      listEl.value?.scrollTo({
        top: listEl.value.scrollHeight,
        behavior: 'smooth'
      });
    });
  }
);

const close = () => {
  isCollapsed.value = true;
};

const isAction = (event: Pick<Token, 'kind'>[]) =>
  event.some(t => t.kind === 'action');
</script>

<template>
  <div
    v-if="state.phase === GAME_PHASES.BATTLE"
    v-on-click-outside="close"
    class="combat-log fancy-scrollbar"
    :class="isCollapsed && 'is-collapsed'"
  >
    <h4>Battle Log</h4>
    <ul v-if="!isCollapsed" ref="listEl" class="fancy-scrollbar">
      <li
        v-for="(event, index) in events"
        :key="index"
        :class="isAction(event) && 'action'"
      >
        <span
          v-for="(token, tokenIndex) in event"
          :key="tokenIndex"
          :class="token.kind"
        >
          <template v-if="token.kind === 'text'">{{ token.text }}</template>
          <template v-else-if="token.kind === 'action'">
            {{ token.text }}
          </template>
          <template v-else-if="token.kind === 'card'">
            {{ token.card.name }}
          </template>
          <template v-else-if="token.kind === 'unit'">
            {{ token.unit.name }}
          </template>
          <template v-else-if="token.kind === 'input'">
            {{ token.player.name }}
          </template>
          <template v-else-if="token.kind === 'position'">
            [{{ token.point.x }}, {{ token.point.y }}, {{ token.point.z }}]
          </template>
          <template v-else-if="token.kind === 'player'">
            {{ token.player.name }}
          </template>
          <template v-else-if="token.kind === 'turn_start'">
            {{ token.player.name }}
          </template>
        </span>
      </li>
    </ul>
    <button class="toggle" @click="isCollapsed = !isCollapsed">
      <Icon icon="material-symbols:arrow-forward-ios" />
    </button>
  </div>
</template>

<style scoped lang="postcss">
.combat-log {
  position: fixed;
  top: 35%;

  font-family: 'Press Start 2P';
  color: #efef9f;
  user-select: none;
  background-color: #32021b;
  padding: var(--size-5);
  border: solid 6px #efef9f;
  border-right-color: #d7ad42;
  border-bottom-color: #d7ad42;
  text-shadow: 0 4px 0px #4e3327;
  box-shadow: 3px 3px 0 black;

  display: grid;
  grid-template-rows: auto 1fr;

  width: 26rem;
  height: var(--size-15);
  z-index: 1;
  @screen lt-lg {
    width: 20rem;
    height: var(--size-13);
  }

  padding-inline: 0;

  line-height: 2;

  transition: transform 0.2s var(--ease-1);

  &.is-collapsed {
    transform: translateX(-100%);
    padding: var(--size-2);
  }

  > button {
    align-self: start;
    margin-inline-start: auto;
  }
}

h4 {
  padding-block-end: var(--size-4);
  padding-inline-start: var(--size-3);
}

ul {
  overflow-y: auto;
}
li {
  display: flex;
  flex-wrap: wrap;
  gap: 1ch;

  padding-block: var(--size-1);
  padding-inline-start: var(--size-6);

  font-size: 10px;

  &.action {
    background-color: hsl(0 0 100% / 0.05);
  }
}

.toggle {
  position: absolute;
  top: 0;
  left: 100%;
  transform: translateY(-6px);

  width: var(--size-8);
  height: calc(var(--size-9) + var(--size-1) + 1px);
  padding: 0;

  display: grid;
  place-content: center;

  font-family: 'Press Start 2P';
  color: #efef9f;
  user-select: none;
  background-color: #32021b;
  border: solid 6px #efef9f;
  border-right-color: #d7ad42;
  border-bottom-color: #d7ad42;
  text-shadow: 0 4px 0px #4e3327;
  box-shadow: 3px 3px 0 black;

  border-left: none;
  > svg {
    aspect-ratio: 1;
    width: 100%;
  }

  @screen lt-lg {
    height: var(--size-9);
  }
}

.player,
.unit,
.input,
.card,
.position {
  font-weight: var(--font-weight-7);
}

.input {
  color: var(--cyan-5);

  li:has(&) {
    padding-inline-start: var(--size-3);
  }
}

.unit {
  color: var(--orange-6);
}

.card {
  color: var(--orange-6);
}

.turn_start {
  flex-grow: 1;

  font-size: var(--font-size-0);
  font-weight: var(--font-weight-6);
  text-align: center;

  background-color: hsl(0 0 100% / 0.1);

  li:has(&) {
    padding: 0;
  }
}
</style>
