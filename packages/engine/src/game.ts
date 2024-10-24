import type { Prettify, Serializable } from '@game/shared';
import { TypedEventEmitter } from './utils/typed-emitter';
import { BoardSystem, type SerializedBoard } from './board/board-system';
import { UnitSystem } from './unit/unit-system';
import { RngSystem } from './rng/rng-system';
import { TurnSystem, type TurnEvent, type TurnEventMap } from './unit/turn-system';
import type { SerializedUnit, UnitEvent, UnitEventMap } from './unit/unit.entity';
import { config } from './config';
import { PlayerSystem } from './player/player-system';

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
  'game:error': [Error];
};

export type GameEventMap = Prettify<GameEventsBase & GlobalUnitEvents & GlobalTurnEvents>;

export type GameOptions = {
  rngSeed: string;
};

export class Game implements Serializable<SerializedGameState> {
  private readonly emitter = new TypedEventEmitter<GameEventMap>();

  readonly boardSystem = new BoardSystem(this);

  readonly unitSystem = new UnitSystem(this);

  readonly playerSystem = new PlayerSystem(this);

  readonly rngSystem = new RngSystem(this);

  readonly turnSystem = new TurnSystem(this);

  readonly config = config;

  constructor(options: GameOptions) {
    this.rngSystem.initialize({ seed: options.rngSeed });
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
  }

  get on() {
    return this.emitter.on;
  }

  get once() {
    return this.emitter.on;
  }

  get emit() {
    return this.emitter.on;
  }

  serialize() {
    return {
      units: this.unitSystem.units.map(u => u.serialize()),
      board: this.boardSystem.serialize()
    };
  }
}
