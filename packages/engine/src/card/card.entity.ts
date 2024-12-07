import { assert, type Point3D } from '@game/shared';
import { createEntityId, Entity } from '../entity';
import type { CardBlueprint } from './card-blueprint';
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

  get cost() {
    return this.blueprint.cost;
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
    return this.blueprint.minTargets;
  }

  get maxTargets() {
    return this.blueprint.targets.length;
  }

  get targetsDefinition() {
    return this.blueprint.targets;
  }

  get aiHints() {
    return this.blueprint.aiHints;
  }

  abstract play(targets: Point3D[]): void;

  abstract get canPlay(): boolean;

  isWithinRange(point: Point3D, index: number) {
    if (index >= this.blueprint.targets.length) return false;

    return this.blueprint.targets[index]
      .getTargeting(this.game, this)
      .isWithinRange(point);
  }

  areTargetsValid(targets: Point3D[]) {
    assert(
      targets.length <= this.blueprint.targets.length,
      'Cannot play card: too many targets.'
    );

    return targets.every((target, index) => {
      const targeting = this.blueprint.targets[index].getTargeting(this.game, this);
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
    if (targets.length < this.blueprint.minTargets) {
      return false;
    }

    return this.canPlay && this.areTargetsValid(targets);
  }
}
