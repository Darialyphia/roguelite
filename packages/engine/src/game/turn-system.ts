import type { Values } from '@game/shared';
import { TypedEventEmitter } from '../utils/typed-emitter';
import { System } from '../system';
import { GAME_EVENTS } from './game';
import type { Player } from '../player/player.entity';

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

  private _activePlayer!: Player;

  private firstPlayer!: Player;

  private emitter = new TypedEventEmitter<TurnEventMap>();

  initialize() {
    // const idx = this.game.rngSystem.nextInt(this.game.playerSystem.players.length);
    this._activePlayer = this.game.playerSystem.players[0];
    this.firstPlayer = this._activePlayer;

    this.game.on(GAME_EVENTS.PLAYER_END_TURN, this.onPlayerTurnEnd.bind(this));

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

  get activePlayer() {
    return this._activePlayer;
  }

  get turnCount() {
    return this._turnCount;
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
    this.emitter.emit(TURN_EVENTS.TURN_START, { turnCount: this.turnCount });
    this._activePlayer.startTurn();
  }

  endGameTurn() {
    this.emitter.emit(TURN_EVENTS.TURN_END, { turnCount: this.turnCount });
  }

  onPlayerTurnEnd() {
    const nextPlayer = this._activePlayer.opponents[0];
    if (nextPlayer.equals(this.firstPlayer)) {
      this.endGameTurn();
      this._activePlayer = nextPlayer;
      this.startGameTurn();
    } else {
      this._activePlayer = nextPlayer;
      this._activePlayer.startTurn();
    }
  }
}
