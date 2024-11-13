import type { Game } from '@game/engine';
import type { Card } from '@game/engine/src/card/card.entity';
import type { EntityId } from '@game/engine/src/entity';

export type CardViewModel = {
  id: EntityId;
  name: string;
  description: string;
  cost: number;
  getCard(): Card;
};

export const makeCardViewModel = (game: Game, card: Card): CardViewModel => {
  return {
    id: card.id,
    cost: card.cost,
    name: card.name,
    description: card.description,
    getCard() {
      return card;
    }
  };
};
