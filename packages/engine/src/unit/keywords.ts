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
    spriteId: 'keyword-ranged',
    aliases: [/ranged\([0-9]+\)/]
  },
  BURN: {
    id: 'burn',
    name: 'Burn(x)',
    spriteId: 'keyword-burn',
    description: 'At the beginning of its owner, deal x damage to this unit',
    aliases: [/burn\([0-9]+\)/]
  },
  SPLASH_ATTACK: {
    id: 'splash_attack',
    name: 'Splash Attack',
    spriteId: 'keyword-splash-attack',
    description: 'When this card attacks, it also damages the unit next to the target.',
    aliases: []
  },
  SUMMON: {
    id: 'summon',
    name: 'Summon',
    description: 'Triggers when this unit is played from your hand.',
    aliases: []
  },
  FEARSOME: {
    id: 'fearsome',
    name: 'Fearsome',
    spriteId: 'keyword-fearsome',
    description: 'Units attacked by this do not counterattack.',
    aliases: []
  },
  VIGILANT: {
    id: 'vigilant',
    name: 'Vigilant',
    spriteId: 'keyword-vigilant',
    description: 'This unit has unlimited counterattacks.',
    aliases: []
  },
  RUSH: {
    id: 'rush',
    name: 'Rush',
    spriteId: 'keyword-rush',
    description: "This unit doesn't exhaust when deployed.",
    aliases: []
  },
  SPELLCASTER: {
    id: 'spellcaster',
    spriteId: 'keyword-spellcaster',
    name: 'Spellcaster',
    description: 'This unit can use spell cards in place of its general',
    aliases: []
  },
  RAGE: {
    id: 'rage',
    spriteId: 'keyword-rage',
    name: 'Rage',
    description:
      'At the beginning of its turn, this unit walks towards the nearest me and attacks it if possible',
    aliases: []
  }
} as const satisfies Record<string, Keyword>;

export type KeywordName = Values<typeof KEYWORDS>['name'];
export type KeywordId = Values<typeof KEYWORDS>['id'];

export const getKeywordById = (id: KeywordId): Keyword | undefined =>
  Object.values(KEYWORDS).find(k => k.id === id);
