import { UnitViewModel } from '@/unit/unit.model';
import type { ClientSession } from '@game/engine';
import type { Terrain } from '@game/engine/src/board/board-utils';
import type { Cell } from '@game/engine/src/board/cell';
import type { GameEventMap } from '@game/engine/src/game/game';
import type { GamePhase } from '@game/engine/src/game/game-phase.system';
import type {
  InputDispatcher,
  SerializedInput
} from '@game/engine/src/input/input-system';
import type { RosterUnit } from '@game/engine/src/player/player-roster.component';
import type { Player } from '@game/engine/src/player/player.entity';
import { assert, isDefined, type Point3D } from '@game/shared';
import { defineStore } from 'pinia';

const useInternalBattleStore = defineStore('battle-internal', () => {
  const session = shallowRef<ClientSession>();

  return {
    session
  };
});
// @TODO Make ViewModel class for Cell and Player
export type CellViewModel = Readonly<
  Point3D & {
    id: string;
    getCell(): Cell;
    terrain: Terrain;
  }
>;

export type PlayerViewModel = Readonly<{
  id: string;
  getPlayer(): Player;
  roster: RosterUnit[];
}>;

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
    const game = internal.session.game;
    console.log('sync game state', game.phase);

    phase.value = game.phase;
    cells.value = game.boardSystem.cells.map(cell => ({
      id: cell.id,
      x: cell.x,
      y: cell.y,
      z: cell.z,
      terrain: cell.terrain,
      getCell() {
        return cell;
      }
    }));
    players.value = game.playerSystem.players.map(player => ({
      id: player.id,
      roster: player.roster.units,
      getPlayer() {
        return player;
      }
    }));
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
    async init(session: ClientSession, dispatcher: InputDispatcher) {
      internal.session = session;
      await internal.session.initialize();
      dispatch = dispatcher;

      syncState();
      internal.session.subscribe(async (input, events) => {
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
