import type { Values } from '@game/shared';
import type { Game } from '../game';
import type { Unit } from './unit.entity';
import { TypedEventEmitter } from '../utils/typed-emitter';

export const TURN_EVENTS = {
  TURN_START: 'turn_start',
  TURN_END: 'turn_end'
} as const;

export type TurnEvent = Values<typeof TURN_EVENTS>;

export type TurnEventMap = {
  [TURN_EVENTS.TURN_START]: [{ turnCount: number }];
  [TURN_EVENTS.TURN_END]: [{ turnCount: number }];
};

export class TurnSystem {
  private _turnCount = 1;

  private queue = new Set<Unit>();

  private game: Game;

  private emitter = new TypedEventEmitter<TurnEventMap>();

  constructor(game: Game) {
    this.game = game;
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
    this.queue.clear();
    this.game.unitSystem.units
      .sort((a, b) => b.speed - a.speed)
      .forEach(unit => this.queue.add(unit));
    this.emitter.emit(TURN_EVENTS.TURN_START, { turnCount: this.turnCount });
  }

  endGameTurn() {
    this.emitter.emit(TURN_EVENTS.TURN_END, { turnCount: this.turnCount });
  }

  onUnitTurnEnd() {
    this.queue.delete(this.activeUnit);

    if (!this.activeUnit) {
      this.endGameTurn();
      return;
    }

    this.activeUnit.ready();
  }
}
