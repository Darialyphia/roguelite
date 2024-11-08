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
