import { isDefined } from '@game/shared';
import { System } from '../system';
import { type RngSystemOptions, type RngSystem } from './rng-system';

export class MissingRngError extends Error {}

export class ClientRngSystem extends System<RngSystemOptions> implements RngSystem {
  values: number[] = [];
  seed = '';

  // eslint-disable-next-line @typescript-eslint/no-empty-function
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
