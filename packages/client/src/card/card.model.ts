import type { Game } from '@game/engine';
import { type CardBlueprint } from '@game/engine/src/card/card-blueprint';
import { CARD_KINDS, type CardKind } from '@game/engine/src/card/card-enums';
import type { Card } from '@game/engine/src/card/card.entity';
import type { SpellCard } from '@game/engine/src/card/spell-card.entity';
import type { UnitCard } from '@game/engine/src/card/unit-card.entity';
import type { EntityId } from '@game/engine/src/entity';
import type { AOEShape } from '@game/engine/src/targeting/aoe-shapes';
import type { Job } from '@game/engine/src/utils/job';
import type { Rune } from '@game/engine/src/utils/rune';
import type { Nullable, Point3D } from '@game/shared';
import { match } from 'ts-pattern';

type CardViewModelBase = {
  id: EntityId;
  iconId: string;
  name: string;
  description: string;
  cost?: CardBlueprint['cost'];
  equals(card: CardViewModel): boolean;
  canPlayAt(points: Point3D[]): boolean;
  areTargetsValid(points: Point3D[]): boolean;
  isWithinRange(point: Point3D, index: number): boolean;
  getAoe(points: Point3D[]): Nullable<AOEShape>;
};

type UnitCardViewModel = CardViewModelBase & {
  kind: (typeof CARD_KINDS)['UNIT'];
  cost: { gold: number; runes: Rune[] };
  atk: number;
  maxHp: number;
  reward: number;
  speed: number;
  jobs: Job[];
  getCard(): UnitCard;
};

type SpellCardViewModel = CardViewModelBase & {
  kind: (typeof CARD_KINDS)['SPELL'];
  cost: { gold: number; runes: Rune[] };
  getCard(): SpellCard;
};

export type CardViewModel = UnitCardViewModel | SpellCardViewModel;

export const makeCardViewModel = (game: Game, card: Card): CardViewModel => {
  return match(card.kind)
    .with(CARD_KINDS.UNIT, () => makeUnitCardViewModel(game, card as UnitCard))
    .with(CARD_KINDS.SPELL, () =>
      makeSpellCardViewModel(game, card as SpellCard)
    )

    .exhaustive();
};

const makeCardViewModelBase = (game: Game, card: Card): CardViewModelBase => {
  return {
    id: card.id,
    iconId: card.iconId,
    name: card.name,
    description: card.description,
    equals(otherCard) {
      return otherCard.getCard().equals(card);
    },
    canPlayAt(points: Point3D[]) {
      return card.canPlayAt(points);
    },
    areTargetsValid(points: Point3D[]) {
      return card.areTargetsValid(points);
    },
    isWithinRange(point, index) {
      return card.isWithinRange(point, index);
    },
    getAoe(points) {
      return card.getAoe(points);
    }
  };
};

const makeUnitCardViewModel = (
  game: Game,
  card: UnitCard
): UnitCardViewModel => {
  return {
    ...makeCardViewModelBase(game, card),
    kind: card.kind as any,
    getCard() {
      return card;
    },
    atk: card.atk,
    maxHp: card.maxHp,
    speed: card.speed,
    reward: card.reward,
    cost: card.cost,
    jobs: card.jobs
  };
};

const makeSpellCardViewModel = (
  game: Game,
  card: SpellCard
): SpellCardViewModel => {
  return {
    ...makeCardViewModelBase(game, card),
    kind: card.kind as any,
    getCard() {
      return card;
    },
    cost: card.cost
  };
};
