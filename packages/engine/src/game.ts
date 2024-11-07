import type { Constructor, Prettify, Values } from '@game/shared';
import { TypedEventEmitter } from './utils/typed-emitter';
import { BoardSystem } from './board/board-system';
import { UnitSystem } from './unit/unit-system';
import {
  TURN_EVENTS,
  TurnSystem,
  type TurnEvent,
  type TurnEventMap
} from './unit/turn-system';
import { UNIT_EVENTS, type UnitEvent, type UnitEventMap } from './unit/unit.entity';
import { config } from './config';
import { PlayerSystem } from './player/player-system';
import { InputSystem } from './input/input-system';
import type { RngSystem } from './rng/rng-system';
import type { SerializedInput } from './input/input';
import { mapValues } from 'lodash-es';
import { StateMachine, t } from 'typescript-fsm';

type GlobalUnitEvents = {
  [Event in UnitEvent as `unit.${Event}`]: UnitEventMap[Event];
};

type GlobalTurnEvents = {
  [Event in TurnEvent as `turn.${Event}`]: TurnEventMap[Event];
};

type GameEventsBase = {
  'game.input-queue-flushed': [];
  'game.error': [{ error: Error }];
  'game.start-battle': [];
  'game.end-battle': [];
  '*': [e: StarEvent];
};

export type GameEventMap = Prettify<GameEventsBase & GlobalUnitEvents & GlobalTurnEvents>;
export type GameEventName = keyof GameEventMap;
export type GameEvent = Values<GameEventMap>;

export type StarEvent<
  T extends Exclude<GameEventName, '*'> = Exclude<GameEventName, '*'>
> = {
  eventName: T;
  event: GameEventMap[T];
};

const GAME_EVENTS = {
  ...mapValues(UNIT_EVENTS, evt => `unit.${evt}` as `unit.${typeof evt}`),
  ...mapValues(TURN_EVENTS, evt => `turn.${evt}` as `turn.${typeof evt}`),
  ERROR: 'game.error',
  FLUSHED: 'game.input-queue-flushed',
  START_BATTLE: 'game.start-battle',
  END_BATTLE: 'game.end-battle'
} as const satisfies Record<string, keyof GameEventMap>;

export type GameOptions = {
  rngSeed: string;
  rngCtor: Constructor<RngSystem>;
};

export const GAME_PHASES = {
  DEPLOYMENT: 'deployment',
  BATTLE: 'battle',
  END: 'end'
} as const;
export type GamePhase = Values<typeof GAME_PHASES>;

export const GAME_PHASE_EVENTS = {
  START_BATTLE: 'start_battle',
  END_BATTLE: 'end_battle'
} as const;
export type GamePhaseEvent = Values<typeof GAME_PHASE_EVENTS>;

export class Game {
  private readonly emitter = new TypedEventEmitter<GameEventMap>();

  readonly boardSystem = new BoardSystem(this);

  readonly unitSystem = new UnitSystem(this);

  readonly playerSystem = new PlayerSystem(this);

  readonly rngSystem: RngSystem;

  readonly turnSystem = new TurnSystem(this);

  readonly inputSystem = new InputSystem(this);

  readonly config = config;

  private stateMachine = new StateMachine<GamePhase, GamePhaseEvent>(
    GAME_PHASES.DEPLOYMENT,
    [
      t(GAME_PHASES.DEPLOYMENT, GAME_PHASE_EVENTS.START_BATTLE, GAME_PHASES.BATTLE),
      t(GAME_PHASES.BATTLE, GAME_PHASE_EVENTS.END_BATTLE, GAME_PHASES.END)
    ]
  );

  constructor(private options: GameOptions) {
    this.rngSystem = new options.rngCtor(this);
    this.setupStarEvents();
  }

  get phase() {
    return this.stateMachine.getState();
  }

  startBattle() {
    if (!this.stateMachine.can(GAME_PHASE_EVENTS.START_BATTLE)) {
      throw new Error(
        `Cannot enter phase ${GAME_PHASES.BATTLE} from phase ${this.phase}`
      );
    }

    this.stateMachine.dispatch(GAME_PHASE_EVENTS.START_BATTLE);
  }

  endBattle() {
    if (!this.stateMachine.can(GAME_PHASE_EVENTS.END_BATTLE)) {
      throw new Error(`Cannot enter phase ${GAME_PHASES.END} from phase ${this.phase}`);
    }

    this.stateMachine.dispatch(GAME_PHASE_EVENTS.END_BATTLE);
  }

  // the event emitter doesnt provide the event name if you enable wildcards, so let's implement it ourselves
  private setupStarEvents() {
    Object.values(GAME_EVENTS).forEach(eventName => {
      this.on(eventName as any, async event => {
        // this.logger(`%c[EVENT:${this.id}:${eventName}]`, 'color: #008b8b');

        await this.emit('*', { eventName, event } as any);
      });
    });
  }

  initialize() {
    this.rngSystem.initialize({ seed: this.options.rngSeed });
    this.boardSystem.initialize({
      width: 10,
      height: 10,
      cells: []
    });
    this.playerSystem.initialize({
      teams: []
    });
    this.unitSystem.initialize({ units: [] });
    this.turnSystem.initialize();
    this.inputSystem.initialize([]);
  }

  get on() {
    return this.emitter.on;
  }

  get once() {
    return this.emitter.on;
  }

  get emit() {
    return this.emitter.emit;
  }

  dispatch(input: SerializedInput) {
    return this.inputSystem.dispatch(input);
  }
}
