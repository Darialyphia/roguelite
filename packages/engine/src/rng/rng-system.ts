import { isDefined } from '@game/shared';
import randoomSeed from 'seedrandom';
import { System } from '../system';

export type RngSystemOptions = {
  seed: string;
};

export class RngSystem extends System<RngSystemOptions> {
  private rng!: randoomSeed.PRNG;

  initialize(options: RngSystemOptions) {
    this.rng = randoomSeed(options.seed);
  }

  next() {
    return this.rng();
  }

  nextInt(max: number) {
    return Math.floor(this.next() * (max + 1));
  }
}
