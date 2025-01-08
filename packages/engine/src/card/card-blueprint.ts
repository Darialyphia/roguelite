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
import { CARD_KINDS, type CardKind, type UnitType } from './card-enums';
import type { QuestCard } from './quest-card.entity';

type CardBlueprintTarget<T extends Card> = {
  getTargeting(game: Game, card: T): TargetingStrategy;
};

export type CardAiHints = {
  isRelevantTarget?: (point: Point3D, game: Game, card: Card, index: number) => boolean;
  relevantMoves?: (game: Game, unit: Unit) => Point3D[];
  maxUsesPerTurn?: (game: Game, card: Card) => number;
  prePlayScoreModifier?: (game: Game, card: Card, targets: Point3D[]) => number;
  postPlayScoreModifier?: (game: Game, card: Card, targets: Point3D[]) => number;
  preAttackScoreModifier?: (game: Game, unit: Unit, target: Point3D) => number;
  postAttackScoreModifier?: (game: Game, unit: Unit, target: Point3D) => number;
  preMoveScoreModifier?: (game: Game, unit: Unit, target: Point3D) => number;
  postMoveScoreModifier?: (game: Game, unit: Unit, target: Point3D) => number;
  endTurnWhileInHandScoreModifier?: (game: Game, card: Card) => number;
  endTurnWhileOnBoardScoreModifier?: (game: Game, unit: Unit) => number;
};

export type CardBlueprintBase = {
  id: string;
  name: string;
  iconId: string;
  description: string;
  shouldHighlightInHand?: (game: Game, card: Card) => boolean;
  aiHints: CardAiHints;
  cost: {
    gold: number;
    runes: Rune[];
  };
};

export type UnitCardBlueprint = CardBlueprintBase & {
  kind: Extract<CardKind, typeof CARD_KINDS.UNIT>;
  spriteId: string;
  maxHp: number;
  atk: number;
  jobs: Job[];
  vfx: {
    play(game: Game, card: UnitCard): VFXSequence;
    destroy(game: Game, card: UnitCard): VFXSequence;
  };
  minTargets: number;
  targets: [CardBlueprintTarget<UnitCard>, ...CardBlueprintTarget<UnitCard>[]];
  unitType: UnitType;
  getAoe: (game: Game, card: UnitCard, points: Point3D[]) => AOEShape;
  onPlay(game: Game, card: UnitCard, cellTargets: Point3D[], unitTargets: Unit[]): void;
};

export type SpellCardBlueprint = CardBlueprintBase & {
  kind: Extract<CardKind, typeof CARD_KINDS.SPELL>;
  vfx: {
    play(game: Game, card: SpellCard): VFXSequence;
  };
  minTargets: number;
  targets: [CardBlueprintTarget<SpellCard>, ...CardBlueprintTarget<SpellCard>[]];
  getAoe: (game: Game, card: SpellCard, points: Point3D[]) => AOEShape;
  onPlay(game: Game, card: SpellCard, cellTargets: Point3D[], unitTargets: Unit[]): void;
};

export type QuestCardBlueprint = CardBlueprintBase & {
  kind: Extract<CardKind, typeof CARD_KINDS.QUEST>;
  vfx: {
    play(game: Game, card: QuestCard): VFXSequence;
  };
  minTargets: number;
  targets: [CardBlueprintTarget<QuestCard>, ...CardBlueprintTarget<QuestCard>[]];
  onPlay(game: Game, card: QuestCard): void;
  onCompleted(game: Game, card: QuestCard): void;
};

export type CardBlueprint = UnitCardBlueprint | SpellCardBlueprint | QuestCardBlueprint;

export const isUnitBlueprint = (bp: CardBlueprint): bp is UnitCardBlueprint =>
  bp.kind === CARD_KINDS.UNIT;
export const isSpellBlueprint = (bp: CardBlueprint): bp is SpellCardBlueprint =>
  bp.kind === CARD_KINDS.SPELL;
export const isQuestBlueprint = (bp: CardBlueprint): bp is QuestCardBlueprint =>
  bp.kind === CARD_KINDS.QUEST;
