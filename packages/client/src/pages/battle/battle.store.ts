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

export const PLAYER_ID = 'player';
export const AI_ID = 'ai';

export const useBattleStore = defineStore('battle', () => {
  const internal = useInternalBattleStore();

  const cells = ref<CellViewModel[]>([]);
  const players = ref<PlayerViewModel[]>([]);
  const units = ref<UnitViewModel[]>([]);
  const turnOrderUnits = ref<UnitViewModel[]>([]);
  const activeUnit = ref<UnitViewModel>();
  const turn = ref(0);

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
    if (game.phase !== GAME_PHASES.MULLIGAN) {
      activeUnit.value = makeUnitViewModel(game, game.turnSystem.activeUnit);
    }
    turnOrderUnits.value = game.turnSystem.queue.map(unit =>
      makeUnitViewModel(game, unit)
    );
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
    if (e.card.kind === CARD_KINDS.UNIT || e.card.kind === CARD_KINDS.GENERAL) {
      await vfxPlayer.playSequence(e.vfx);
    }
  });

  fxEmitter.on('unit.created', async e => {
    const game = internal.session!.game;
    units.value.push(makeUnitViewModel(game, e.unit));
  });

  return {
    init(session: ClientSession, dispatcher: InputDispatcher) {
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
          playerId: internal.session!.game.turnSystem.activeUnit?.player.id,
          ...input.payload
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
      turnOrderUnits,
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

export const usePathHelpers = () => {
  const ui = useBattleUiStore();
  const game = useGame();
  const state = useGameClientState();

  const pathCache = new Map<
    string,
    {
      distance: number;
      path: Vec3[];
    } | null
  >();

  const canMoveToCache = new Map<string, boolean>();

  const toCacheKey = (unit: UnitViewModel, point: Point3D) =>
    `${unit.id}_${point.x}_${point.y}_${point.z}`;

  const getPath = (unit: UnitViewModel, point: Point3D) => {
    const key = toCacheKey(unit, point);

    if (!pathCache.has(key)) {
      pathCache.set(key, unit.getUnit().getPathTo(point));
    }

    return pathCache.get(key);
  };

  const getCanMoveTo = (unit: UnitViewModel, point: Point3D) => {
    const key = toCacheKey(unit, point);

    if (!canMoveToCache.has(key)) {
      canMoveToCache.set(key, unit.getUnit().canMoveTo(point));
    }

    return canMoveToCache.get(key)!;
  };

  useBattleEvent(GAME_EVENTS.FLUSHED, async () => {
    pathCache.clear();
    canMoveToCache.clear();
  });

  return {
    canMoveTo(unit: UnitViewModel, point: Point3D) {
      return ui.mode === UI_MODES.BASIC && getCanMoveTo(unit, point);
    },

    getPathTo(unit: UnitViewModel, point: Point3D) {
      return getPath(unit, point);
    },

    canAttackAt(unit: UnitViewModel, point: Point3D) {
      if (ui.mode !== UI_MODES.BASIC) return false;
      return state.value.cells.some(cell => {
        if (!unit.getUnit().canAttackFromSimulatedPosition(point, cell)) {
          return false;
        }

        const path = getPath(unit, cell);
        if (!path) {
          return false;
        }
        const totalCost =
          path.distance * unit.getUnit().apCostPerMovement +
          unit.getUnit().apCostPerAttack;

        return totalCost <= unit.currentAp;
      });
    }
  };
};
