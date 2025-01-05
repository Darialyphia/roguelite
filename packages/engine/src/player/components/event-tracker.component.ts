import { GAME_EVENTS, type Game, type StarEvent } from '../../game/game';
import type { Player } from '../player.entity';

export class EventTrackerComponent {
  private lastTurnEvents: StarEvent[] = [];

  constructor(
    private game: Game,
    private player: Player
  ) {
    let currentTurnEvents: StarEvent[] = [];
    game.on('*', e => {
      if (e.eventName === GAME_EVENTS.PLAYER_END_TURN) {
        this.lastTurnEvents = currentTurnEvents;
        currentTurnEvents = [];
      } else {
        currentTurnEvents.push(e);
      }
    });
  }

  get allyDiedLastTurn() {
    return this.lastTurnEvents.some(e => {
      if (e.eventName !== GAME_EVENTS.UNIT_AFTER_DESTROY) return false;
      return (e.event as any).unit.player.isAlly(this.player);
    });
  }

  get enemyDiedLastTurn() {
    return this.lastTurnEvents.some(
      e =>
        e.eventName === GAME_EVENTS.UNIT_AFTER_DESTROY &&
        (e.event as any).unit.player.eisEnemy(this.player)
    );
  }
}
