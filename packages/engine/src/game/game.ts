import type { AnyObject, BetterOmit, Constructor, Prettify, Values } from '@game/shared';
import { TypedEventEmitter } from '../utils/typed-emitter';
import { BoardSystem } from '../board/board-system';
import { UnitSystem } from '../unit/unit-system';
import {
  TURN_EVENTS,
  TurnSystem,
  type TurnEvent,
  type TurnEventMap
} from './turn-system';
import {
  Unit,
  UNIT_EVENTS,
  type UnitEvent,
  type UnitEventMap
} from '../unit/unit.entity';
import { config } from '../config';
import { PlayerSystem } from '../player/player-system';
import { InputSystem, type SerializedInput } from '../input/input-system';
import type { RngSystem } from '../rng/rng-system';
import { mapValues } from 'lodash-es';
import { GamePhaseSystem } from './game-phase.system';
import {
  PLAYER_EVENTS,
  type Player,
  type PlayerEvent,
  type PlayerEventMap,
  type PlayerOptions
} from '../player/player.entity';
import { MAPS_DICTIONARY } from '../board/maps/_index';
import type { TeamOptions } from '../player/team.entity';

type EnrichEvent<TTuple extends [...any[]], TAdditional extends AnyObject> = {
  [Index in keyof TTuple]: TTuple[Index] extends AnyObject
    ? TTuple[Index] & TAdditional
    : TTuple;
} & { length: TTuple['length'] };

type GlobalUnitEvents = {
  [Event in UnitEvent as `unit.${Event}`]: EnrichEvent<
    UnitEventMap[Event],
    { unit: Unit }
  >;
};

type GlobalPlayerEvents = {
  [Event in PlayerEvent as `player.${Event}`]: EnrichEvent<
    PlayerEventMap[Event],
    { player: Player }
  >;
};

type GlobalTurnEvents = {
  [Event in TurnEvent as `turn.${Event}`]: TurnEventMap[Event];
};

type GameEventsBase = {
  'game.input-start': [SerializedInput];
  'game.input-queue-flushed': [];
  'game.error': [{ error: Error }];
  'game.start-battle': [];
  'game.end-battle': [];
  'game.ready': [];
  '*': [e: StarEvent];
};

export type GameEventMap = Prettify<
  GameEventsBase & GlobalUnitEvents & GlobalTurnEvents & GlobalPlayerEvents
>;
export type GameEventName = keyof GameEventMap;
export type GameEvent = Values<GameEventMap>;

export type StarEvent<
  T extends Exclude<GameEventName, '*'> = Exclude<GameEventName, '*'>
> = {
  eventName: T;
  event: GameEventMap[T];
};

export const GAME_EVENTS = {
  ...mapValues(UNIT_EVENTS, evt => `unit.${evt}` as `unit.${typeof evt}`),
  ...mapValues(PLAYER_EVENTS, evt => `player.${evt}` as `player.${typeof evt}`),
  ...mapValues(TURN_EVENTS, evt => `turn.${evt}` as `turn.${typeof evt}`),
  ERROR: 'game.error',
  READY: 'game.ready',
  FLUSHED: 'game.input-queue-flushed',
  INPUT_START: 'game.input-start',
  START_BATTLE: 'game.start-battle',
  END_BATTLE: 'game.end-battle'
} as const satisfies Record<string, keyof GameEventMap>;

export type GameOptions = {
  id: string;
  rngSeed: string;
  rngCtor: Constructor<RngSystem>;
  mapId: string;
  teams: BetterOmit<TeamOptions['players'][number], 'startPosition'>[][];
  history?: SerializedInput[];
};

export class Game {
  private readonly emitter = new TypedEventEmitter<GameEventMap>();

  readonly gamePhaseSystem = new GamePhaseSystem(this, 'GAME_PHASE', 'orange');

  readonly boardSystem = new BoardSystem(this, 'BOARD', 'green');

  readonly unitSystem = new UnitSystem(this, 'UNIT', 'purple');

  readonly playerSystem = new PlayerSystem(this, 'PLAYER', 'teal');

  readonly rngSystem: RngSystem;

  readonly turnSystem = new TurnSystem(this, 'TURN', 'magenta');

  readonly inputSystem = new InputSystem(this, 'INPUT', 'blue');

  readonly config = config;

  readonly id: string;

  constructor(readonly options: GameOptions) {
    this.id = options.id;
    this.rngSystem = new options.rngCtor(this, 'RNG', 'lime');
    this.setupStarEvents();
  }

  makeLogger(topic: string, color: string) {
    return (...messages: any[]) => {
      console.groupCollapsed(`%c[${this.id}][${topic}]`, `color: ${color}`);
      console.log(...messages);
      console.groupEnd();
    };
  }
  // the event emitter doesnt provide the event name if you enable wildcards, so let's implement it ourselves
  private setupStarEvents() {
    Object.values(GAME_EVENTS).forEach(eventName => {
      this.on(eventName as any, event => {
        // this.makeLogger(eventName, 'black')(event);

        this.emit('*', { eventName, event } as any);
      });
    });
  }

  initialize() {
    this.rngSystem.initialize({ seed: this.options.rngSeed });
    this.gamePhaseSystem.initialize();
    const map = MAPS_DICTIONARY[this.options.mapId];
    this.boardSystem.initialize({ map });
    this.playerSystem.initialize({
      teams: this.options.teams.map((team, teamIndex) => ({
        id: `team.${teamIndex}`,
        players: team.map((player, playerIndex) => ({
          ...player,
          startPosition: map.startPositions[teamIndex][playerIndex]
        }))
      }))
    });
    this.unitSystem.initialize();
    this.turnSystem.initialize();

    this.inputSystem.initialize(this.options.history ?? []);

    this.emit(GAME_EVENTS.READY);
  }

  get on() {
    return this.emitter.on.bind(this.emitter);
  }

  get once() {
    return this.emitter.once.bind(this.emitter);
  }

  get off() {
    return this.emitter.off.bind(this.emitter);
  }

  get emit() {
    return this.emitter.emit.bind(this.emitter);
  }

  get phase() {
    return this.gamePhaseSystem.phase;
  }

  dispatch(input: SerializedInput) {
    return this.inputSystem.dispatch(input);
  }

  shutdown() {
    this.emitter.removeAllListeners();
  }
}
