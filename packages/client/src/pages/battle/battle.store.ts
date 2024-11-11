import { CellViewModel } from '@/board/models/cell.model';
import { PlayerViewModel } from '@/player/player.model';
import { UnitViewModel } from '@/unit/unit.model';
import type { ClientSession } from '@game/engine';
import type { GameEventMap } from '@game/engine/src/game/game';
import type { GamePhase } from '@game/engine/src/game/game-phase.system';
import type {
  InputDispatcher,
  SerializedInput
} from '@game/engine/src/input/input-system';
import { assert, isDefined } from '@game/shared';
import { defineStore } from 'pinia';

const useInternalBattleStore = defineStore('battle-internal', () => {
  const session = shallowRef<ClientSession>();

  return {
    session
  };
});

const PLAYER_ID = 'player';
export const useBattleStore = defineStore('battle', () => {
  const internal = useInternalBattleStore();

  const cells = shallowRef<CellViewModel[]>([]);
  const players = shallowRef<PlayerViewModel[]>([]);
  const units = shallowRef<UnitViewModel[]>([]);
  const activeUnit = shallowRef<UnitViewModel>();

  const phase = ref<GamePhase>('deployment');

  const syncState = () => {
    assert(isDefined(internal.session));
    console.log('sync state');
    const game = internal.session.game;

    phase.value = game.phase;
    cells.value = game.boardSystem.cells.map(
      cell => new CellViewModel(game, cell)
    );
    players.value = game.playerSystem.players.map(
      player => new PlayerViewModel(game, player)
    );
    units.value = game.unitSystem.units.map(
      unit => new UnitViewModel(game, unit)
    );
    activeUnit.value = new UnitViewModel(game, game.turnSystem.activeUnit);
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
        console.log(input, events);
        isPlayingFx.value = true;
        for (const event of events) {
          const listeners = fxListeners[event.eventName];
          if (!listeners) continue;
          await Promise.all(
            [...listeners.values()].map(listener =>
              listener(event.event as any)
            )
          );
        }
        syncState();
        isPlayingFx.value = false;
      });

      isReady.value = true;
    },
    dispatch(input: SerializedInput) {
      dispatch(input);
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
      activeUnit
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

      return () => this.off(eventName, handler);
    }
  };
});
