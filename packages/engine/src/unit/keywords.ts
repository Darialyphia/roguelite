import type { Values } from '@game/shared';
import type { Game } from '../game/game';
import type { Unit } from './unit.entity';

export type Keyword = {
  id: string;
  name: string;
  description: string;
  spriteId?: string;
  shouldDisplaySprite?: (game: Game, unit: Unit) => boolean;
  aliases: (string | RegExp)[];
};

export const KEYWORDS = {
  RANGED: {
    id: 'ranged',
    name: 'Ranged(x)',
    description: 'Can attack any x tiles away, but cannot attack in melee range',
    aliases: [/ranged\([0-9]+\)/]
  },
  SPLASH_ATTACK: {
    id: 'splash_attack',
    name: 'Splash Attack',
    description: 'When this card attacks, it also damages the unit text to the target.',
    aliases: []
  },
  COMMANDER: {
    id: 'commander',
    name: 'Commander',
    description: 'You can play your unit cards next to this.',
    aliases: []
  },
  FEARSOME: {
    id: 'fearsome',
    name: 'Fearsome',
    description: 'Units attacked by this do not counterattack.',
    aliases: []
  },
  VIGILANT: {
    id: 'vigilant',
    name: 'Vigilant',
    description: 'This unit has unlimited counterattacks.',
    aliases: []
  },
  RUSH: {
    id: 'rush',
    name: 'Rush',
    description: "This unit doesn't exhaust when deployed.",
    aliases: []
  },
  SPELLCASTER: {
    id: 'spellcaster',
    name: 'Spellcaster',
    description: 'This unit can use spell cards in place of its general',
    aliases: []
  }
} as const satisfies Record<string, Keyword>;

export type KeywordName = Values<typeof KEYWORDS>['name'];
export type KeywordId = Values<typeof KEYWORDS>['id'];

export const getKeywordById = (id: KeywordId): Keyword | undefined =>
  Object.values(KEYWORDS).find(k => k.id === id);
