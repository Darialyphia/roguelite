import {
  type CellViewModel,
  makeCellViewModel
} from '@/board/models/cell.model';
import {
  type PlayerViewModel,
  makePlayerViewModel
} from '@/player/player.model';
import { type UnitViewModel, makeUnitViewModel } from '@/unit/unit.model';
import type { ClientSession } from '@game/engine';
import type { Game, GameEventMap } from '@game/engine/src/game/game';
import type { GamePhase } from '@game/engine/src/game/game-phase.system';
import type {
  InputDispatcher,
  SerializedInput
} from '@game/engine/src/input/input-system';
import { assert, isDefined, type Override } from '@game/shared';
import { defineStore } from 'pinia';
import { AI } from '@game/engine/src/ai/ai';

const useInternalBattleStore = defineStore('battle-internal', () => {
  const session = shallowRef<ClientSession>();

  return {
    session
  };
});

export const PLAYER_ID = 'player';
export const AI_ID = 'ai';

export const useBattleStore = defineStore('battle', () => {
  const internal = useInternalBattleStore();

  const cells = ref<CellViewModel[]>([]);
  const players = ref<PlayerViewModel[]>([]);
  const units = ref<UnitViewModel[]>([]);
  const turnOrderUnits = ref<UnitViewModel[]>([]);
  const activeUnit = ref<UnitViewModel>();

  const phase = ref<GamePhase>('deployment');

  const syncState = () => {
    assert(isDefined(internal.session));
    const game = internal.session.game;

    phase.value = game.phase;
    cells.value = game.boardSystem.cells.map(cell =>
      makeCellViewModel(game, cell)
    );
    players.value = game.playerSystem.players.map(player =>
      makePlayerViewModel(game, player)
    );
    units.value = game.unitSystem.units.map(unit =>
      makeUnitViewModel(game, unit)
    );
    activeUnit.value = makeUnitViewModel(game, game.turnSystem.activeUnit);
    turnOrderUnits.value = game.turnSystem.queue.map(unit =>
      makeUnitViewModel(game, unit)
    );
  };

  const fxListeners: Partial<{
    [EventName in keyof GameEventMap]: Set<
      (...eventArg: GameEventMap[EventName]) => Promise<void>
    >;
  }> = {};

  const isPlayingFx = ref(false);
  const isReady = ref(false);

  let dispatch: InputDispatcher = () => {};

  return {
    init(session: ClientSession, dispatcher: InputDispatcher) {
      internal.session = session;
      dispatch = dispatcher;

      syncState();
      internal.session.subscribe(async (input, events) => {
        isPlayingFx.value = true;

        for (const event of events) {
          const listeners = fxListeners[event.eventName];
          if (!listeners) continue;
          await Promise.all(
            [...listeners.values()].map(listener =>
              // @ts-expect-error :shrughai:
              listener(event.event)
            )
          );
        }
        syncState();
        isPlayingFx.value = false;
      });

      isReady.value = true;
    },
    dispatch(
      input: Override<
        SerializedInput,
        { payload: Omit<SerializedInput['payload'], 'playerId'> }
      >
    ) {
      // @ts-expect-error distributive union issue blablabla
      dispatch({
        type: input.type,
        payload: {
          ...input.payload,
          playerId: internal.session!.game.turnSystem.activeUnit.player.id
        }
      });
    },
    isPlayingFx: readonly(isPlayingFx),
    isReady: computed(() => isDefined(internal.session)),
    session: readonly(computed(() => internal.session)),
    state: {
      phase,
      cells,
      players,
      units,
      userPlayer: computed(() => players.value.find(p => p.id === PLAYER_ID)!),
      activeUnit,
      turnOrderUnits
    },

    on<T extends keyof GameEventMap>(
      eventName: T,
      handler: (...eventArg: GameEventMap[T]) => Promise<void>
    ) {
      // @ts-expect-error :shrughai:
      fxListeners[eventName] ??= new Set();
      fxListeners[eventName].add(handler);
      return () => this.off(eventName, handler);
    },

    off<T extends keyof GameEventMap>(
      eventName: T,
      handler: (...eventArg: GameEventMap[T]) => Promise<void>
    ) {
      if (!fxListeners[eventName]) return;
      fxListeners[eventName].delete(handler);
    }
  };
});

export const useBattleEvent = <T extends keyof GameEventMap>(
  name: T,
  handler: (...eventArg: GameEventMap[T]) => Promise<void>
) => {
  const store = useBattleStore();

  const unsub = store.on(name, handler);

  onUnmounted(unsub);

  return unsub;
};

export const useActiveUnit = () => {
  const store = useBattleStore();

  return computed(() => store.state.activeUnit);
};

export const useUserPlayer = () => {
  const store = useBattleStore();

  return computed(() => store.state.players.find(p => p.id === PLAYER_ID)!);
};

export const useGame = () => {
  const store = useBattleStore();

  return computed(() => store.session!.game) as ComputedRef<Game>;
};

export const useGameClientState = () => {
  const store = useBattleStore();

  return computed(() => store.state);
};
