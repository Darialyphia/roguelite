import { assert } from '@game/shared';

export class GoldManagerComponent {
  private _amount: number;
  constructor(initialAmount: number) {
    this._amount = initialAmount;
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
