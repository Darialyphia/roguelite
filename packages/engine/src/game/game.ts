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
import { Unit, type UnitEventMap } from '../unit/unit.entity';
import { defaultConfig, type Config } from '../config';
import { PlayerSystem } from '../player/player-system';
import { InputSystem, type SerializedInput } from '../input/input-system';
import type { RngSystem } from '../rng/rng-system';
import { mapValues, mapKeys } from 'lodash-es';
import { GamePhaseSystem } from './game-phase.system';
import { type Player, type PlayerEventMap } from '../player/player.entity';
import { MAPS_DICTIONARY } from '../board/maps/_index';
import type { TeamOptions } from '../player/team.entity';
import {
  CARD_EVENTS,
  type Card,
  type CardEvent,
  type CardEventMap
} from '../card/card.entity';
import { UNIT_EVENTS, type UnitEvent } from '../unit/unit-enums';
import { PLAYER_EVENTS, type PlayerEvent } from '../player/player-enums';

// augments the paylod of an event with additional data
// for example: a unit may emit a AFTER_MOVE event without a reference to itself
// but the global event UNIT_AFTER_MOVE will have a reference to the unit who moved
// this type represents that in a generic way
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

type GlobalCardEvents = {
  [Event in CardEvent as `card.${Event}`]: EnrichEvent<
    CardEventMap[Event],
    { card: Card }
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
  GameEventsBase &
    GlobalUnitEvents &
    GlobalCardEvents &
    GlobalTurnEvents &
    GlobalPlayerEvents
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
  ...(mapKeys(
    mapValues(UNIT_EVENTS, evt => `unit.${evt}`),
    (value, key) => `UNIT_${key}`
  ) as {
    [Key in keyof typeof UNIT_EVENTS as `UNIT_${Key}`]: `unit.${(typeof UNIT_EVENTS)[Key]}`;
  }),
  ...(mapKeys(
    mapValues(CARD_EVENTS, evt => `card.${evt}`),
    (value, key) => `CARD_${key}`
  ) as {
    [Key in keyof typeof CARD_EVENTS as `CARD_${Key}`]: `card.${(typeof CARD_EVENTS)[Key]}`;
  }),
  ...(mapKeys(
    mapValues(PLAYER_EVENTS, evt => `player.${evt}`),
    (value, key) => `PLAYER_${key}`
  ) as {
    [Key in keyof typeof PLAYER_EVENTS as `PLAYER_${Key}`]: `player.${(typeof PLAYER_EVENTS)[Key]}`;
  }),
  ...(mapKeys(
    mapValues(TURN_EVENTS, evt => `turn.${evt}`),
    (value, key) => `${key}`
  ) as {
    [Key in keyof typeof TURN_EVENTS as `${Key}`]: `turn.${(typeof TURN_EVENTS)[Key]}`;
  }),
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
  teams: BetterOmit<TeamOptions['players'][number], 'generalPosition'>[][]; // player start positions are originally on the map data
  history?: SerializedInput[];
  configOverrides: Partial<Config>;
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

  readonly config: Config;

  readonly id: string;

  constructor(readonly options: GameOptions) {
    this.id = options.id;
    this.config = Object.assign({}, defaultConfig, options.configOverrides);
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
          generalPosition: map.generalPositions[teamIndex][playerIndex]
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
    this.playerSystem.shutdown();
    this.unitSystem.shutdown();
  }

  clone(id: number) {
    const game = new Game({
      ...this.options,
      id: `simulation_${id}`,
      history: this.inputSystem.serialize()
    });
    game.initialize();

    return game;
  }
}
