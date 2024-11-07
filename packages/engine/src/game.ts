import type { Constructor, Prettify, Serializable } from '@game/shared';
import { TypedEventEmitter } from './utils/typed-emitter';
import { BoardSystem, type SerializedBoard } from './board/board-system';
import { UnitSystem } from './unit/unit-system';
import { TurnSystem, type TurnEvent, type TurnEventMap } from './unit/turn-system';
import type { SerializedUnit, UnitEvent, UnitEventMap } from './unit/unit.entity';
import { config } from './config';
import { PlayerSystem } from './player/player-system';
import { InputSystem } from './input/input-system';
import type { RngSystem } from './rng/rng-system';
import type { SerializedInput } from './input/input';

export type SerializedGameState = {
  units: SerializedUnit[];
  board: SerializedBoard;
};

type GlobalUnitEvents = {
  [Event in UnitEvent as `unit.${Event}`]: UnitEventMap[Event];
};

type GlobalTurnEvents = {
  [Event in TurnEvent as `turn.${Event}`]: TurnEventMap[Event];
};

type GameEventsBase = {
  'game.input-queue-flushed': [];
  'game.error': [{ error: Error }];
};

export type GameEventMap = Prettify<GameEventsBase & GlobalUnitEvents & GlobalTurnEvents>;

export type GameOptions = {
  rngSeed: string;
  rngCtor: Constructor<RngSystem>;
};

export class Game implements Serializable<SerializedGameState> {
  private readonly emitter = new TypedEventEmitter<GameEventMap>();

  readonly boardSystem = new BoardSystem(this);

  readonly unitSystem = new UnitSystem(this);

  readonly playerSystem = new PlayerSystem(this);

  readonly rngSystem: RngSystem;

  readonly turnSystem = new TurnSystem(this);

  readonly inputSystem = new InputSystem(this);

  readonly config = config;

  constructor(private options: GameOptions) {
    this.rngSystem = new options.rngCtor(this);
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

  serialize() {
    return {
      units: this.unitSystem.units.map(u => u.serialize()),
      board: this.boardSystem.serialize()
    };
  }
}
