import { assert } from '@game/shared';
import type { Game } from '../../game/game';
import { config } from '../../config';

export class GoldManagerComponent {
  private _amount: number;
  constructor(
    private game: Game,
    initialAmount: number
  ) {
    this._amount = initialAmount;
    this.game.on('turn.turn_start', () => {
      this.deposit(config.GOLD_PER_TURN);
    });
  }

  canSpend(amount: number) {
    return this._amount >= amount;
  }

  spend(amount: number) {
    assert(this.canSpend(amount), 'Not enough gold');
    this._amount -= amount;
  }

  deposit(amount: number) {
    this._amount += amount;
  }

  get amount() {
    return this._amount;
  }
}
