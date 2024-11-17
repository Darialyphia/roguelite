import type { Game } from '@game/engine';
import type { Card } from '@game/engine/src/card/card.entity';
import type { EntityId } from '@game/engine/src/entity';
import type { AOEShape } from '@game/engine/src/targeting/aoe-shapes';
import type { Nullable, Point3D } from '@game/shared';

export type CardViewModel = {
  id: EntityId;
  iconId: string;
  name: string;
  description: string;
  cost: number;
  getCard(): Card;
  equals(card: CardViewModel): boolean;
  canPlayAt(points: Point3D[]): boolean;
  areTargetsValid(points: Point3D[]): boolean;
  isWithinRange(point: Point3D, index: number): boolean;
  getAoe(points: Point3D[]): Nullable<AOEShape>;
};

export const makeCardViewModel = (game: Game, card: Card): CardViewModel => {
  return {
    id: card.id,
    iconId: card.iconId,
    cost: card.cost,
    name: card.name,
    description: card.description,
    getCard() {
      return card;
    },
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
