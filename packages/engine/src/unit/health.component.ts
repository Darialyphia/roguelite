import { Interceptable } from '../utils/interceptable';

export type HealthComponentOptions = {
  maxHp: number;
};

export class HealthComponent {
  private baseMaxHp: number;

  private _current: number;

  private interceptors = {
    maxHp: new Interceptable<number, Record<string, never>>()
  };

  constructor(options: HealthComponentOptions) {
    this.baseMaxHp = options.maxHp;
    this._current = this.baseMaxHp;
  }

  get max() {
    return this.interceptors.maxHp.getValue(this.baseMaxHp, {});
  }

  get current() {
    return this._current;
  }

  get isDead() {
    return this._current === 0;
  }

  add(amount: number) {
    this._current = Math.min(this._current + amount, this.max);
  }

  remove(amount: number) {
    this._current = Math.max(this._current - amount, 0);
  }
}
