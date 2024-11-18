import type { Game } from '../game/game';
import { Interceptable, type inferInterceptor } from '../utils/interceptable';
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

type CombatInterceptor = CombatComponent['interceptors'];

export class CombatComponent {
  private unit: Unit;

  private baseStats: CombatStats;

  private targeting: TargetingStrategy;

  private game: Game;

  private interceptors = {
    pAtk: new Interceptable<number>(),
    pDef: new Interceptable<number>(),
    mAtk: new Interceptable<number>(),
    mDef: new Interceptable<number>(),
    pDefPiercing: new Interceptable<{ flat: number; percentage: number }>(),
    mDefPiercing: new Interceptable<{ flat: number; percentage: number }>()
  };

  constructor(game: Game, options: CombatComponentOptions) {
    this.game = game;
    this.unit = options.unit;
    this.baseStats = options.baseStats;
    this.targeting = options.attackPattern;
  }

  canAttackAt(point: Point3D) {
    if (this.unit.position.equals(point)) return false;
    const unit = this.game.unitSystem.getUnitAt(point);
    if (unit && !unit.canBeAttacked) return false;

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
    return this.interceptors.pDefPiercing.getValue(this.baseStats.pDefPiercing, {});
  }

  get mDefPiercing(): { flat: number; percentage: number } {
    return this.interceptors.mDefPiercing.getValue(this.baseStats.mDefPiercing, {});
  }

  attackAt(aoeShape: AOEShape) {
    const targets = aoeShape.getUnits();

    const damage = new Damage({
      baseAmount: config.BASE_ATTACK_DAAMGE,
      source: this.unit,
      scalings: [new PhyicalScalingStrategy(1)],
      mitigation: new PhysicalMitigationStrategy()
    });

    this.unit.dealDamage(targets, damage);
  }

  addInterceptor<T extends keyof CombatInterceptor>(
    key: T,
    interceptor: inferInterceptor<CombatInterceptor[T]>,
    priority?: number
  ) {
    this.interceptors[key].add(interceptor as any, priority);

    return () => this.removeInterceptor(key, interceptor);
  }

  removeInterceptor<T extends keyof CombatInterceptor>(
    key: T,
    interceptor: inferInterceptor<CombatInterceptor[T]>
  ) {
    this.interceptors[key].remove(interceptor as any);
  }
}
