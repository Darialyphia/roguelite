import type { ClientSession } from '@game/engine';
import type { Terrain } from '@game/engine/src/board/board-utils';
import type { Cell } from '@game/engine/src/board/cell';
import type { ClientDispatchMeta } from '@game/engine/src/client-session';
import type { GameEventMap } from '@game/engine/src/game/game';
import type { GamePhase } from '@game/engine/src/game/game-phase.system';
import type { SerializedInput } from '@game/engine/src/input/input';
import { assert, isDefined, type Point3D } from '@game/shared';
import { defineStore } from 'pinia';

const useInternalBattleStore = defineStore('battle-internal', () => {
  const session = shallowRef<ClientSession>();

  return {
    session
  };
});

export type CellViewModel = Point3D & {
  id: string;
  getCell(): Cell;
  terrain: Terrain;
};
export const useBattleStore = defineStore('battle', () => {
  const internal = useInternalBattleStore();

  const cells = ref<CellViewModel[]>([]);
  const phase = ref<GamePhase>('deployment');

  const syncState = () => {
    assert(isDefined(internal.session));
    phase.value = internal.session.game.phase;
    cells.value = internal.session.game.boardSystem.cells.map(cell => ({
      id: cell.id,
      x: cell.x,
      y: cell.y,
      z: cell.z,
      terrain: cell.terrain,
      getCell() {
        return cell;
      }
    }));
  };

  const asyncListeners: Partial<{
    [EventName in keyof GameEventMap]: Set<
      (...eventArg: GameEventMap[EventName]) => Promise<void>
    >;
  }> = {};

  return {
    init(session: ClientSession) {
      internal.session = session;
      syncState();
      internal.session.subscribe(async (input, events) => {
        for (const event of events) {
          const listeners = asyncListeners[event.eventName];
          if (!listeners) continue;
          await Promise.all(
            [...listeners.values()].map(listener =>
              listener(event.event as any)
            )
          );
        }
        syncState();
      });
    },

    isReady: computed(() => isDefined(internal.session)),
    session: computed(() => internal.session),
    state: {
      cells
    },

    dispatch(input: SerializedInput, meta: ClientDispatchMeta) {
      assert(isDefined(internal.session));
      internal.session.dispatch(input, meta);
    },

    on<T extends keyof GameEventMap>(
      eventName: T,
      handler: (...eventArg: GameEventMap[T]) => Promise<void>
    ) {
      // @ts-expect-error :shrughai:
      asyncListeners[eventName] ??= new Set();
      asyncListeners[eventName].add(handler);

      return () => this.off(eventName, handler);
    },

    off<T extends keyof GameEventMap>(
      eventName: T,
      handler: (...eventArg: GameEventMap[T]) => Promise<void>
    ) {
      if (!asyncListeners[eventName]) return;
      asyncListeners[eventName].delete(handler);

      return () => this.off(eventName, handler);
    }
  };
});
