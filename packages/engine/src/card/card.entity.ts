import { assert, type Point3D } from '@game/shared';
import { createEntityId, Entity } from '../entity';
import { isGeneralBlueprint, type CardBlueprint } from './card-blueprint';
import type { Game } from '../game/game';
import type { Player } from '../player/player.entity';

export type CardOptions = {
  id: string;
  blueprint: CardBlueprint;
};

export abstract class Card<
  TBlueprint extends CardBlueprint = CardBlueprint
> extends Entity {
  protected game: Game;

  protected blueprint: TBlueprint;

  readonly player: Player;

  constructor(game: Game, player: Player, options: CardOptions) {
    super(createEntityId(options.id));
    this.game = game;
    this.player = player;
    // @ts-expect-error
    this.blueprint = options.blueprint;
  }

  get blueprintId() {
    return this.blueprint.id;
  }

  get kind() {
    return this.blueprint.kind;
  }

  get iconId() {
    return this.blueprint.iconId;
  }

  get name() {
    return this.blueprint.name;
  }

  get description() {
    return this.blueprint.description;
  }

  get minTargets() {
    if (isGeneralBlueprint(this.blueprint)) return 0;
    return this.blueprint.minTargets;
  }

  get maxTargets() {
    if (isGeneralBlueprint(this.blueprint)) return 0;
    return this.blueprint.targets.length;
  }

  get targetsDefinition() {
    if (isGeneralBlueprint(this.blueprint)) return [];
    return this.blueprint.targets;
  }

  get aiHints() {
    return this.blueprint.aiHints;
  }

  abstract play(targets: Point3D[]): void;

  abstract get canPlay(): boolean;

  isWithinRange(point: Point3D, index: number) {
    if (isGeneralBlueprint(this.blueprint)) return true;

    if (index >= this.blueprint.targets.length) return false;

    return this.blueprint.targets[index]
      .getTargeting(this.game, this)
      .isWithinRange(point);
  }

  areTargetsValid(targets: Point3D[]) {
    const bp = this.blueprint;
    if (isGeneralBlueprint(bp)) return true;

    assert(targets.length <= bp.targets.length, 'Cannot play card: too many targets.');

    return targets.every((target, index) => {
      const targeting = bp.targets[index].getTargeting(this.game, this);
      const unit = this.game.unitSystem.getUnitAt(target);
      if (unit && !unit.canBeCardTarget) return false;

      return targeting.canTargetAt(target);
    });
  }

  getAoe(targets: Point3D[]) {
    if (!this.areTargetsValid(targets)) {
      return null;
    }
    return this.blueprint.getAoe(this.game, this as any, targets);
  }

  canPlayAt(targets: Point3D[]) {
    if (targets.length < this.minTargets) {
      return false;
    }

    return this.canPlay && this.areTargetsValid(targets);
  }
}
