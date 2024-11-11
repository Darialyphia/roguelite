import { System } from '../system';
import type { RngSystem, RngSystemOptions } from './rng-system';
import randoomSeed from 'seedrandom';

export class ServerRngSystem extends System<RngSystemOptions> implements RngSystem {
  name = 'RNG SYSTEM';

  color = 'lime';

  private rng!: randoomSeed.PRNG;

  seed!: string;

  private _values: number[] = [];

  initialize(options: RngSystemOptions) {
    this.seed = options.seed;
    this.rng = randoomSeed(this.seed);
    this.next = this.next.bind(this);
  }

  get values() {
    return [...this._values];
  }

  set values(val) {
    this._values = val;
  }

  next() {
    const val = this.rng();
    this._values.push(val);
    return val;
  }

  nextInt(max: number) {
    return Math.floor(this.next() * (max + 1));
  }

  serialize() {
    return { values: [...this._values] };
  }
}
