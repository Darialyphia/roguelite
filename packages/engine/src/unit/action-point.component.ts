import { Interceptable } from '../utils/interceptable';

export type ActionPointComponentOptions = {
  maxAp: number;
};

export class ActionPointComponent {
  private baseMaxAp: number;

  private _current: number;

  private interceptors = {
    maxAp: new Interceptable<number, Record<string, never>>()
  };

  constructor(options: ActionPointComponentOptions) {
    this.baseMaxAp = options.maxAp;
    this._current = this.baseMaxAp;
  }

  get max() {
    return this.interceptors.maxAp.getValue(this.baseMaxAp, {});
  }

  get current() {
    return this._current;
  }

  get isDepleted() {
    return this._current === 0;
  }

  refill() {
    this._current = this.max;
  }

  add(amount: number) {
    this._current = Math.min(this._current + amount, this.max);
  }

  remove(amount: number) {
    this._current = Math.max(this._current - amount, 0);
  }
}
