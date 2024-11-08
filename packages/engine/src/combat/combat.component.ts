import type { Game } from '../game/game';
import { Interceptable } from '../utils/interceptable';
import type { Unit } from '../unit/unit.entity';
import type { TargetingStrategy } from '../targeting/targeting-strategy';
import type { AOEShape } from '../targeting/aoe-shapes';
import { isDefined, type Point3D } from '@game/shared';
import { Damage } from './damage/damage';
import { PhyicalScalingStrategy } from './damage/scaling/physical-scaling.strategy';
import { PhysicalMitigationStrategy } from './damage/mitigation/physical-mitigation.strategy';
import { config } from '../config';

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
  unit: Unit;
  baseStats: CombatStats;
  attackPattern: TargetingStrategy;
};

export class CombatComponent {
  private game: Game;

  private unit: Unit;

  private baseStats: CombatStats;

  private targeting: TargetingStrategy;

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
    this.unit = options.unit;
    this.baseStats = options.baseStats;
    this.targeting = options.attackPattern;
  }

  canAttackAt(point: Point3D) {
    if (!this.game.unitSystem.getUnitAt(point)) return;

    return this.targeting.canTargetAt(point);
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

  attackAt(point: Point3D, options: { aoeShape: AOEShape; allowFriendlyFire: boolean }) {
    const targets = options.aoeShape
      .getCells(point)
      .map(cell => cell.unit)
      .filter((target): target is Unit => {
        if (!isDefined(target)) return false;
        if (!options.allowFriendlyFire) return target.isEnemy(this.unit);
        return true;
      });

    const damage = new Damage({
      baseAmount: config.BASE_ATTACK_DAAMGE,
      source: this.unit,
      scalings: [new PhyicalScalingStrategy(1)],
      mitigation: new PhysicalMitigationStrategy()
    });

    this.unit.dealDamage(targets, damage);
  }
}
