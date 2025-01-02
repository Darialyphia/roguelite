import type { Point3D } from '@game/shared';
import type { Game } from '../game/game';
import type { Card } from './card.entity';
import type { TargetingStrategy } from '../targeting/targeting-strategy';
import type { AOEShape } from '../targeting/aoe-shapes';
import { type Unit } from '../unit/unit.entity';
import type { Rune } from '../utils/rune';
import type { Job } from '../utils/job';
import type { UnitCard } from './unit-card.entity';
import type { SpellCard } from './spell-card.entity';
import type { VFXSequence } from '../vfx/vfx-sequencer';
import { CARD_KINDS, type CardKind } from './card-enums';

type CardBlueprintTarget = {
  getTargeting(game: Game, card: Card): TargetingStrategy;
};

export type CardBlueprintBase = {
  id: string;
  name: string;
  iconId: string;
  description: string;
  aiHints: {
    isRelevantTarget?: (point: Point3D, game: Game, card: Card, index: number) => boolean;
    maxUsesPerTurn?: number;
    preScoreModifier?: (game: Game, card: Card, targets: Point3D[]) => number;
    postScoreModifier?: (game: Game, card: Card, targets: Point3D[]) => number;
  };
};

export type UnitCardBlueprint = CardBlueprintBase & {
  kind: Extract<CardKind, typeof CARD_KINDS.UNIT>;
  spriteId: string;
  maxHp: number;
  atk: number;
  speed: number;
  reward: number;
  jobs: Job[];
  cost: {
    gold: number;
    runes: Rune[];
  };
  vfx: {
    play(game: Game, card: UnitCard): VFXSequence;
    destroy(game: Game, card: UnitCard): VFXSequence;
  };
  minTargets: number;
  targets: [CardBlueprintTarget, ...CardBlueprintTarget[]];
  getAoe: (game: Game, card: UnitCard, points: Point3D[]) => AOEShape;
  onPlay(game: Game, card: UnitCard, cellTargets: Point3D[], unitTargets: Unit[]): void;
  getAttackPattern: (game: Game, unit: Unit) => TargetingStrategy;
};

export type SpellCardBlueprint = CardBlueprintBase & {
  kind: Extract<CardKind, typeof CARD_KINDS.SPELL>;
  cost: {
    gold: number;
    runes: Rune[];
  };
  vfx: {
    play(game: Game, card: SpellCard): VFXSequence;
  };
  minTargets: number;
  targets: [CardBlueprintTarget, ...CardBlueprintTarget[]];
  getAoe: (game: Game, card: SpellCard, points: Point3D[]) => AOEShape;
  onPlay(game: Game, card: SpellCard, cellTargets: Point3D[], unitTargets: Unit[]): void;
};

export type CardBlueprint = UnitCardBlueprint | SpellCardBlueprint;

export const isUnitBlueprint = (bp: CardBlueprint): bp is UnitCardBlueprint =>
  bp.kind === CARD_KINDS.UNIT;
export const isSpellBlueprint = (bp: CardBlueprint): bp is SpellCardBlueprint =>
  bp.kind === CARD_KINDS.SPELL;
