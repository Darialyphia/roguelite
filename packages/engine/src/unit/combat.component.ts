import { match } from 'ts-pattern';
import type { Game } from '../game';
import { Interceptable } from '../utils/interceptable';
import type { Unit } from './unit.entity';

export type Damage = {
  type: 'physical' | 'magical';
  amount: number;
  ratio: number;
};

export type CombatStats = {
  pAtk: number;
  pDef: number;
  mAtk: number;
  mDef: number;
  pDefPiercing: {
    percentage: number;
    flat: number;
  };
  mDefPiercing: {
    percentage: number;
    flat: number;
  };
};

export type CombatComponentOptions = {
  baseStats: CombatStats;
};

export class CombatComponent {
  private game: Game;

  private baseStats: CombatStats;

  private interceptors = {
    pAtk: new Interceptable<number>(),
    pDef: new Interceptable<number>(),
    mAtk: new Interceptable<number>(),
    mDef: new Interceptable<number>(),
    pDefPiercing: {
      flat: new Interceptable<number>(),
      percentage: new Interceptable<number>()
    },
    mDefPiercing: {
      flat: new Interceptable<number>(),
      percentage: new Interceptable<number>()
    }
  };

  constructor(game: Game, options: CombatComponentOptions) {
    this.game = game;
    this.baseStats = options.baseStats;
  }

  get pAtk(): number {
    return this.interceptors.pAtk.getValue(this.baseStats.pAtk, {});
  }

  get mAtk(): number {
    return this.interceptors.mAtk.getValue(this.baseStats.mAtk, {});
  }

  get pDef(): number {
    return this.interceptors.pDef.getValue(this.baseStats.pDef, {});
  }

  get mDef(): number {
    return this.interceptors.mDef.getValue(this.baseStats.mDef, {});
  }

  get pDefPiercing(): { flat: number; percentage: number } {
    return {
      flat: this.interceptors.pDefPiercing.flat.getValue(
        this.baseStats.pDefPiercing.flat,
        {}
      ),
      percentage: this.interceptors.pDefPiercing.percentage.getValue(
        this.baseStats.pDefPiercing.percentage,
        {}
      )
    };
  }

  get mDefPiercing(): { flat: number; percentage: number } {
    return {
      flat: this.interceptors.mDefPiercing.flat.getValue(
        this.baseStats.mDefPiercing.flat,
        {}
      ),
      percentage: this.interceptors.mDefPiercing.percentage.getValue(
        this.baseStats.mDefPiercing.percentage,
        {}
      )
    };
  }

  getDamageDealt(damage: Damage, opponent: Unit) {
    return match(damage.type)
      .with('physical', () => {
        const base = damage.amount + this.pAtk * damage.ratio;
        const reduction =
          opponent.pDef * (this.pDefPiercing.percentage / 100) - this.pDefPiercing.flat;

        return base * (100 / (100 + reduction));
      })
      .with('magical', () => {
        const base = damage.amount + this.mAtk * damage.ratio;
        const reduction =
          opponent.mDef * (this.mDefPiercing.percentage / 100) - this.mDefPiercing.flat;

        return base * (100 / (100 + reduction));
      })
      .exhaustive();
  }
}
