import type { Values } from '@game/shared';
import type { Game } from '../game/game';
import type { Unit } from './unit.entity';
import { defaultConfig } from '../config';

export type Keyword = {
  id: string;
  name: string;
  description: string;
  spriteId?: string;
  shouldDisplaySprite?: (game: Game, unit: Unit) => boolean;
  aliases: (string | RegExp)[];
};

export const KEYWORDS = {
  ALTAR: {
    id: 'altar',
    name: 'Altar',
    description: `Cannot move, attack, or counterattack. When destroyed, remain on the board and your opponent gains ${defaultConfig.ALTAR_VP_REWARD} VP.`,
    spriteId: 'keyword-altar',
    aliases: []
  },
  AMBUSH: {
    id: 'ambush',
    name: 'Ambush',
    description: 'This unit can be summon nearby an enemy unit.',
    aliases: []
  },
  DESCEND: {
    id: 'descend',
    name: 'Descend',
    description: 'This unie can be summoner anywhere.',
    aliases: []
  },
  COMMANDER: {
    id: 'commander',
    name: 'Commander',
    description: 'You can summon units nearby this.',
    spriteId: 'keyword-commander',
    aliases: []
  },
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
    description: "At the beginning of its owner's turn, deal x damage to this unit",
    aliases: [/burn\([0-9]+\)/, /burn/]
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
  RUSH: {
    id: 'rush',
    name: 'Rush',
    spriteId: 'keyword-rush',
    description: "This unit doesn't exhaust when deployed.",
    aliases: []
  },

  RAGE: {
    id: 'rage',
    spriteId: 'keyword-rage',
    name: 'Rage',
    description:
      'At the beginning of its turn, this unit walks towards the nearest enemy and attacks it if possible',
    aliases: []
  },
  STRUCTURE: {
    id: 'strucure',
    spriteId: 'keyword-structure',
    name: 'Structure',
    description: 'This unit cannot move or attack.',
    aliases: []
  },
  DOUBLE_ATTACK: {
    id: 'double_attack',
    spriteId: 'keyword-double-attack',
    name: 'Double Attack',
    description: 'This unit can attack twice.',
    aliases: []
  }
} as const satisfies Record<string, Keyword>;

export type KeywordName = Values<typeof KEYWORDS>['name'];
export type KeywordId = Values<typeof KEYWORDS>['id'];

export const getKeywordById = (id: KeywordId): Keyword | undefined =>
  Object.values(KEYWORDS).find(k => k.id === id);
