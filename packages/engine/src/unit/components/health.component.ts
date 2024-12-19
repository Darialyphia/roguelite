import type { Card } from '../../card/card.entity';
import { Interceptable, type inferInterceptor } from '../../utils/interceptable';
import { TypedEventEmitter } from '../../utils/typed-emitter';

export type HealthComponentOptions = {
  maxHp: number;
};

export const HEALTH_EVENTS = {
  CHANGE: 'CHANGE'
} as const;

type HealthEventMap = {
  [HEALTH_EVENTS.CHANGE]: [{ current: number; max: number; source: Card }];
};

type HealthInterceptor = HealthComponent['interceptors'];

export class HealthComponent {
  private baseMaxHp: number;

  private _current: number;

  private interceptors = {
    maxHp: new Interceptable<number, Record<string, never>>()
  };

  private emitter = new TypedEventEmitter<HealthEventMap>();

  constructor(options: HealthComponentOptions) {
    this.baseMaxHp = options.maxHp;
    this._current = this.baseMaxHp;
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

  get max() {
    return this.interceptors.maxHp.getValue(this.baseMaxHp, {});
  }

  get current() {
    return this._current;
  }

  get isDead() {
    return this._current === 0;
  }

  add(amount: number, source: Card) {
    this._current = Math.min(this._current + amount, this.max);
    this.emitter.emit(HEALTH_EVENTS.CHANGE, {
      current: this.current,
      max: this.max,
      source
    });
  }

  remove(amount: number, source: Card) {
    this._current = Math.max(this._current - amount, 0);
    this.emitter.emit(HEALTH_EVENTS.CHANGE, {
      current: this.current,
      max: this.max,
      source
    });
  }

  addInterceptor<T extends keyof HealthInterceptor>(
    key: T,
    interceptor: inferInterceptor<HealthInterceptor[T]>,
    priority?: number
  ) {
    this.interceptors[key].add(interceptor, priority);
    this._current = Math.min(this._current, this.max);

    return () => this.removeInterceptor(key, interceptor);
  }

  removeInterceptor<T extends keyof HealthInterceptor>(
    key: T,
    interceptor: inferInterceptor<HealthInterceptor[T]>
  ) {
    this.interceptors[key].remove(interceptor);
    this._current = Math.min(this._current, this.max);
  }
}
