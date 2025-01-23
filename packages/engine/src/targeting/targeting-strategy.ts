import { isDefined, type Point3D, type Values } from '@game/shared';
import { match } from 'ts-pattern';
import type { Player } from '../player/player.entity';
import type { Game } from '../game/game';

export type TargetingStrategy = {
  isWithinRange(point: Point3D): boolean;
  canTargetAt(point: Point3D): boolean;
};

export const TARGETING_TYPE = {
  EMPTY: 'empty',
  ALLY_UNIT: 'ally_unit',
  ALLY_ALTAR: 'ally_altar',
  ALLY_MINION: 'ally_minion',
  ENEMY_UNIT: 'enemy_unit',
  ENEMY_ALTAR: 'enemy_altar',
  ENEMY_MINION: 'enemy_minion',
  UNIT: 'unit',
  ALTAR: 'altar',
  MINION: 'minion',
  ANYWHERE: 'anywhere'
} as const;

export type TargetingType = Values<typeof TARGETING_TYPE>;
export type NonEmptyTargetingType = Exclude<
  TargetingType,
  (typeof TARGETING_TYPE)['EMPTY'] | (typeof TARGETING_TYPE)['ANYWHERE']
>;

export const isValidTargetingType = (
  game: Game,
  point: Point3D,
  player: Player,
  type: TargetingType
) => {
  const unit = game.unitSystem.getUnitAt(point);

  return match(type)
    .with(TARGETING_TYPE.ANYWHERE, () => true)
    .with(TARGETING_TYPE.EMPTY, () => !unit)
    .with(TARGETING_TYPE.ALLY_UNIT, () => !!unit?.player.isAlly(player))
    .with(TARGETING_TYPE.ALLY_ALTAR, () => !!unit?.player.isAlly(player) && unit.isAltar)
    .with(
      TARGETING_TYPE.ALLY_MINION,
      () => !!unit?.player.isAlly(player) && !unit.isAltar
    )
    .with(TARGETING_TYPE.ENEMY_UNIT, () => !!unit?.player.isEnemy(player))
    .with(
      TARGETING_TYPE.ENEMY_ALTAR,
      () => !!unit?.player.isEnemy(player) && unit.isAltar
    )
    .with(
      TARGETING_TYPE.ENEMY_MINION,
      () => !!unit?.player.isEnemy(player) && !unit.isAltar
    )
    .with(TARGETING_TYPE.UNIT, () => isDefined(unit))
    .with(TARGETING_TYPE.ALTAR, () => isDefined(unit) && unit?.isAltar)
    .with(TARGETING_TYPE.MINION, () => isDefined(unit) && !unit.isAltar)
    .exhaustive();
};
