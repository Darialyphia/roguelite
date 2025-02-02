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
import {
  GAME_EVENTS,
  type Game,
  type GameEventMap
} from '@game/engine/src/game/game';
import {
  GAME_PHASES,
  type GamePhase
} from '@game/engine/src/game/game-phase.system';
import type {
  InputDispatcher,
  SerializedInput
} from '@game/engine/src/input/input-system';
import {
  assert,
  isDefined,
  Vec3,
  waitFor,
  type Nullable,
  type Override,
  type PartialBy,
  type Point3D
} from '@game/shared';
import { defineStore } from 'pinia';
import { AI } from '@game/engine/src/ai/ai';
import {
  VFXPlayer,
  type VFXEventMap
} from '@game/engine/src/vfx/vfx-sequencer';
import { TypedEventEmitter } from '@game/engine/src/utils/typed-emitter';
import { CARD_KINDS } from '@game/engine/src/card/card-enums';
import type { Unit } from '@game/engine/src/unit/unit.entity';
import { UI_MODES, useBattleUiStore } from './battle-ui.store';

const useInternalBattleStore = defineStore('battle-internal', () => {
  const session = shallowRef<ClientSession>();

  return {
    session
  };
});

export const useBattleStore = defineStore('battle', () => {
  const internal = useInternalBattleStore();

  const cells = ref<CellViewModel[]>([]);
  const players = ref<PlayerViewModel[]>([]);
  const units = ref<UnitViewModel[]>([]);
  const turn = ref(0);
  const winner = ref<Nullable<PlayerViewModel>>(null);
  const phase = ref<GamePhase>('mulligan');

  const syncState = () => {
    assert(isDefined(internal.session));
    const game = internal.session.game;
    turn.value = game.turnSystem.turnCount;
    phase.value = game.phase;
    cells.value = game.boardSystem.cells.map(cell =>
      makeCellViewModel(game, cell)
    );
    players.value = game.playerSystem.players.map(player =>
      makePlayerViewModel(game, player)
    );
    units.value = game.unitSystem.units.map(unit => {
      return makeUnitViewModel(game, unit);
    });
    winner.value = game.winner
      ? makePlayerViewModel(game, game.winner.players[0])
      : null;
  };

  const fxEmitter = new TypedEventEmitter<GameEventMap>(true);

  const isPlayingFx = ref(false);
  const isReady = ref(false);

  let dispatch: InputDispatcher = () => {};

  const vfxPlayer = new VFXPlayer();

  vfxPlayer.on('WAIT', async e => {
    await waitFor(e.duration);
  });

  fxEmitter.on('card.before_play', async e => {
    if (e.card.kind === CARD_KINDS.SPELL) {
      await vfxPlayer.playSequence(e.vfx);
    }
  });
  fxEmitter.on('card.after_play', async e => {
    if (e.card.kind === CARD_KINDS.UNIT) {
      await vfxPlayer.playSequence(e.vfx);
    }
  });

  fxEmitter.on('unit.created', async e => {
    const game = internal.session!.game;
    units.value.push(makeUnitViewModel(game, e.unit));
  });

  const playerId = ref<string>();
  return {
    init(session: ClientSession, dispatcher: InputDispatcher, id: string) {
      playerId.value = id;
      internal.session = session;
      dispatch = dispatcher;

      syncState();
      internal.session.subscribe(async (input, events) => {
        isPlayingFx.value = true;

        for (const event of events) {
          await fxEmitter.emitAsync(event.eventName, event.event as any);
        }
        syncState();
        isPlayingFx.value = false;
      });

      isReady.value = true;
    },
    dispatch<T extends SerializedInput['type']>(input: {
      type: T;
      payload: PartialBy<
        (SerializedInput & { type: T })['payload'],
        'playerId'
      >;
    }) {
      // @ts-expect-error distributive union issue blablabla
      dispatch({
        type: input.type,
        payload: {
          playerId: internal.session!.game.turnSystem.activePlayer.id,
          ...input.payload
        }
      });
    },
    isPlayingFx: readonly(isPlayingFx),
    isReady: computed(() => isDefined(internal.session)),
    session: computed(() => internal.session),
    playerId,
    state: {
      phase,
      cells,
      players,
      winner,
      units,
      userPlayer: computed(
        () => players.value.find(p => p.id === playerId.value)!
      ),
      turn
    },

    onVFX<T extends keyof VFXEventMap>(
      eventName: T,
      handler: (...eventArg: VFXEventMap[T]) => Promise<void>
    ) {
      return vfxPlayer.on(eventName, handler);
    },

    offVFX<T extends keyof VFXEventMap>(
      eventName: T,
      handler: (...eventArg: VFXEventMap[T]) => Promise<void>
    ) {
      return vfxPlayer.on(eventName, handler);
    },

    on<T extends keyof GameEventMap>(
      eventName: T,
      handler: (...eventArg: GameEventMap[T]) => Promise<void>
    ) {
      return fxEmitter.on(eventName, handler);
    },

    once<T extends keyof GameEventMap>(
      eventName: T,
      handler: (...eventArg: GameEventMap[T]) => Promise<void>
    ) {
      return fxEmitter.once(eventName, handler);
    },

    off<T extends keyof GameEventMap>(
      eventName: T,
      handler: (...eventArg: GameEventMap[T]) => Promise<void>
    ) {
      return fxEmitter.off(eventName, handler);
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

export const useVFXEvent = <T extends keyof VFXEventMap>(
  name: T,
  handler: (...eventArg: VFXEventMap[T]) => Promise<void>
) => {
  const store = useBattleStore();

  const unsub = store.onVFX(name, handler);

  onUnmounted(unsub);

  return unsub;
};

export const useUserPlayer = () => {
  const store = useBattleStore();
  return computed(() => store.state.userPlayer);
};

export const useOpponentPlayer = () => {
  const store = useBattleStore();

  return computed(
    () => store.state.players.find(p => p.id !== store.playerId)!
  );
};

export const useGame = () => {
  const store = useBattleStore();

  return computed(() => store.session!.game) as ComputedRef<Game>;
};

export const useGameClientState = () => {
  const store = useBattleStore();

  return computed(() => store.state);
};

export const usePathHelpers = () => {
  const ui = useBattleUiStore();
  const state = useGameClientState();

  const pathCache = new Map<
    string,
    {
      distance: number;
      path: Vec3[];
    } | null
  >();

  const canMoveToCache = new Map<string, boolean>();

  const toCacheKey = (
    unit: UnitViewModel,
    point: Point3D,
    maxDistance?: number
  ) => `${unit.id}_${point.x}_${point.y}_${point.z}_${maxDistance}`;

  const getPath = (
    unit: UnitViewModel,
    point: Point3D,
    maxDistance: number
  ) => {
    const key = toCacheKey(unit, point, maxDistance);

    if (!pathCache.has(key)) {
      pathCache.set(key, unit.getUnit().getPathTo(point));
    }

    return pathCache.get(key);
  };

  const getCanMoveTo = (unit: UnitViewModel, point: Point3D) => {
    return unit.possibleMoves.some(
      p => p.x === point.x && p.y === point.y && p.z === point.z
    );
  };

  useBattleEvent(GAME_EVENTS.FLUSHED, async () => {
    pathCache.clear();
    canMoveToCache.clear();
  });

  watch(
    () => ui.selectedUnit,
    () => {
      pathCache.clear();
      canMoveToCache.clear();
    }
  );

  return {
    canMoveTo(unit: UnitViewModel, point: Point3D) {
      return ui.mode === UI_MODES.BASIC && getCanMoveTo(unit, point);
    },

    getPathTo(unit: UnitViewModel, point: Point3D) {
      return getPath(unit, point, unit.remainingMovement);
    },

    canAttackAt(unit: UnitViewModel, point: Point3D) {
      if (ui.mode !== UI_MODES.BASIC) return false;
      return state.value.cells.some(cell => {
        if (!unit.getUnit().canAttackFromSimulatedPosition(point, cell)) {
          return false;
        }

        const path = getPath(unit, cell, unit.remainingMovement);

        return !!path;
      });
    }
  };
};
