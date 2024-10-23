import type { Values } from '@game/shared';
import type { Game } from '../game';
import type { Unit } from './unit.entity';
import { TypedEventEmitter } from '../utils/typed-emitter';
import { System } from '../system';

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
  private _turnCount = 1;

  private queue: Unit[] = [];

  private emitter = new TypedEventEmitter<TurnEventMap>();

  initialize() {
    this.game.on('turn.turn_end', this.onUnitTurnEnd.bind(this));
  }

  get turnCount() {
    return this._turnCount;
  }

  get activeUnit() {
    return [...this.queue][0];
  }

  get on() {
    return this.emitter.on;
  }

  get once() {
    return this.emitter.once;
  }

  get off() {
    return this.emitter.off;
  }

  startGameTurn() {
    this._turnCount++;
    this.queue = [];
    this.game.unitSystem.units
      .sort((a, b) => b.speed - a.speed)
      .forEach(unit => this.queue.push(unit));
    this.emitter.emit(TURN_EVENTS.TURN_START, { turnCount: this.turnCount });
  }

  endGameTurn() {
    this.emitter.emit(TURN_EVENTS.TURN_END, { turnCount: this.turnCount });
  }

  onUnitTurnEnd() {
    this.queue.splice(this.queue.indexOf(this.activeUnit), 1);

    if (!this.activeUnit) {
      this.endGameTurn();
      return;
    }

    this.activeUnit.startTurn();
  }
}
