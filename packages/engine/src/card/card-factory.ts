import { match } from 'ts-pattern';
import { CARD_EVENTS, type CardOptions } from './card.entity';
import { CARD_KINDS } from './card-enums';
import { UnitCard } from './unit-card.entity';
import type { Game } from '../game/game';
import { SpellCard } from './spell-card.entity';
import type { Player } from '../player/player.entity';
import { QuestCard } from './quest-card.entity';

export const createCard = (game: Game, player: Player, options: CardOptions) => {
  const card = match(options.blueprint.kind)
    .with(CARD_KINDS.UNIT, () => new UnitCard(game, player, options))
    .with(CARD_KINDS.SPELL, () => new SpellCard(game, player, options))
    .with(CARD_KINDS.QUEST, () => new QuestCard(game, player, options))
    .exhaustive();

  card.on(CARD_EVENTS.BEFORE_PLAY, e => {
    game.emit('card.before_play', { ...e, card });
  });

  card.on(CARD_EVENTS.AFTER_PLAY, e => {
    game.emit('card.after_play', { ...e, card });
  });
  return card;
};
