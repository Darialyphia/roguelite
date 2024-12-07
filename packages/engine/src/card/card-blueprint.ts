import type { Point3D, Values } from '@game/shared';
import type { Game } from '../game/game';
import type { Card } from './card.entity';
import type { TargetingStrategy } from '../targeting/targeting-strategy';
import type { AOEShape } from '../targeting/aoe-shapes';
import type { Unit } from '../unit/unit.entity';
import type { Rune } from '../utils/rune';
import type { Job } from '../utils/job';
import type { UnitCard } from './unit-card.entity';
import type { SpellCard } from './spell-card.entity';

type CardBlueprintTarget = {
  getTargeting(game: Game, card: Card): TargetingStrategy;
};

export const CARD_KINDS = {
  UNIT: 'unit',
  GENERAL: 'general',
  SPELL: 'spell'
} as const;

export type CardKind = Values<typeof CARD_KINDS>;

export type CardBlueprintBase = {
  id: string;
  name: string;
  iconId: string;
  description: string;
  targets: [CardBlueprintTarget, ...CardBlueprintTarget[]];
  minTargets: number;
  aiHints: {
    isRelevantTarget?: (point: Point3D, game: Game, card: Card, index: number) => boolean;
    maxUsesPerTurn?: number;
    preScoreModifier?: (game: Game, card: Card, targets: Point3D[]) => number;
    postScoreModifier?: (game: Game, card: Card, targets: Point3D[]) => number;
  };
};

export type UnitCardBlueprint = CardBlueprintBase & {
  kind: Extract<CardKind, typeof CARD_KINDS.GENERAL | typeof CARD_KINDS.UNIT>;
  targets: [CardBlueprintTarget, ...CardBlueprintTarget[]];
  minTargets: number;
  spriteId: string;
  maxHp: number;
  atk: number;
  speed: number;
  reward: number;
  goldCost: number;
  job: Job;
  cost: {
    gold: number;
    runes: Rune[];
  };
  getAoe: (game: Game, card: UnitCard, points: Point3D[]) => AOEShape;
  onPlay(game: Game, card: UnitCard, cellTargets: Point3D[], unitTargets: Unit[]): void;
  getAttackPattern: (game: Game, unit: Unit) => TargetingStrategy;
};

export type SpellCardBlueprint = CardBlueprintBase & {
  kind: Extract<CardKind, typeof CARD_KINDS.SPELL>;
  cost: {
    ap: number;
    runes: Rune[];
    job: Job[];
  };
  getAoe: (game: Game, card: SpellCard, points: Point3D[]) => AOEShape;
  onPlay(game: Game, card: SpellCard, cellTargets: Point3D[], unitTargets: Unit[]): void;
};

export type CardBlueprint = UnitCardBlueprint | SpellCardBlueprint;
