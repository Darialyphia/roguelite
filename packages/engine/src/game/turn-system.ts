import type { Values } from '@game/shared';
import { TypedEventEmitter } from '../utils/typed-emitter';
import { System } from '../system';
import type { Unit } from '../unit/unit.entity';
import { GAME_EVENTS } from './game';

export const TURN_EVENTS = {
  TURN_START: 'turn_start',
  TURN_END: 'turn_end'
} as const;

export type TurnEvent = Values<typeof TURN_EVENTS>;

export type TurnEventMap = {
  [TURN_EVENTS.TURN_START]: [{ turnCount: number }];
  [TURN_EVENTS.TURN_END]: [{ turnCount: number }];
};

export class TurnSystem extends System<never> {
  private _turnCount = 0;

  queue: Unit[] = [];

  private emitter = new TypedEventEmitter<TurnEventMap>();

  initialize() {
    console.groupEnd();
    this.game.on('unit.end_turn', this.onUnitTurnEnd.bind(this));
    this.on(TURN_EVENTS.TURN_START, e => {
      this.game.emit(GAME_EVENTS.TURN_START, e);
    });
    this.on(TURN_EVENTS.TURN_END, e => {
      this.game.emit(GAME_EVENTS.TURN_END, e);
    });
  }

  shutdown() {
    this.emitter.removeAllListeners();
  }

  get turnCount() {
    return this._turnCount;
  }

  get activeUnit() {
    return [...this.queue][0];
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

  startGameTurn() {
    this._turnCount++;
    this.queue = [];
    this.game.unitSystem.units
      .sort((a, b) => b.speed - a.speed)
      .forEach(unit => this.queue.push(unit));
    this.emitter.emit(TURN_EVENTS.TURN_START, { turnCount: this.turnCount });

    this.activeUnit.startTurn();
  }

  endGameTurn() {
    this.emitter.emit(TURN_EVENTS.TURN_END, { turnCount: this.turnCount });
  }

  onUnitTurnEnd() {
    this.queue.splice(this.queue.indexOf(this.activeUnit), 1);

    if (!this.activeUnit) {
      this.endGameTurn();
      this.startGameTurn();
      return;
    }

    this.activeUnit.startTurn();
  }
}
