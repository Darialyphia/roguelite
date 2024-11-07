import { isDefined } from '@game/shared';
import randoomSeed from 'seedrandom';
import { System } from '../system';

export type RngSystemOptions = {
  seed: string;
};

export type RngSystem = System<RngSystemOptions> & {
  nextInt(max: number): number;
  next(): number;
  serialize(): {
    values: number[];
  };
  values: number[];
  seed: string;
};

export class ServerRngSystem extends System<RngSystemOptions> implements RngSystem {
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

export class MissingRngError extends Error {}

export class ClientRngSystem extends System<RngSystemOptions> implements RngSystem {
  values: number[] = [];
  seed = '';

  initialize() {}

  private rng() {
    const val = this.values.shift();
    if (!isDefined(val)) throw new MissingRngError('Missing rng value');

    return val;
  }

  nextInt(max: number) {
    return Math.floor(this.next() * (max + 1));
  }

  next() {
    return this.rng();
  }

  serialize() {
    return {
      values: []
    };
  }
}
