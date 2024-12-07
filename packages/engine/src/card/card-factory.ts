import { match } from 'ts-pattern';
import type { CardOptions } from './card.entity';
import { CARD_KINDS } from './card-blueprint';
import { UnitCard } from './unit-card.entity';
import type { Game } from '../game/game';
import { SpellCard } from './spell-card.entity';
import type { Player } from '../player/player.entity';

export const createCard = (game: Game, player: Player, options: CardOptions) => {
  return match(options.blueprint.kind)
    .with(CARD_KINDS.GENERAL, CARD_KINDS.UNIT, () => new UnitCard(game, player, options))
    .with(CARD_KINDS.SPELL, () => new SpellCard(game, player, options))
    .exhaustive();
};
